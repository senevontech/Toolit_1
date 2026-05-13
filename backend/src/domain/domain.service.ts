import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';

type ParsedDomain = {
  hostname: string;
  rootDomain: string;
  subdomain: string | null;
  tld: string | null;
  labels: number;
  isLocalOrIp: boolean;
  isSecureCandidate: boolean;
};

function normalizeDomain(value: string) {
  const input = value.trim();
  if (!input) {
    return null;
  }

  try {
    const parsed = input.includes('://') ? new URL(input) : new URL(`https://${input}`);
    return parsed.hostname.toLowerCase();
  } catch {
    return null;
  }
}

function parseDomain(hostname: string): ParsedDomain {
  const segments = hostname.split('.');
  const tld = segments.length > 1 ? segments[segments.length - 1] : '';
  const sld = segments.length > 1 ? segments[segments.length - 2] : hostname;
  const subdomain = segments.length > 2 ? segments.slice(0, segments.length - 2).join('.') : '';
  const looksLikeLocal =
    hostname === 'localhost' ||
    hostname.endsWith('.local') ||
    /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname);

  return {
    hostname,
    rootDomain: segments.length > 1 ? `${sld}.${tld}` : hostname,
    subdomain: subdomain || null,
    tld: tld || null,
    labels: segments.length,
    isLocalOrIp: looksLikeLocal,
    isSecureCandidate: !looksLikeLocal && tld.length >= 2,
  };
}

@Injectable()
export class DomainService {
  async checkAvailability(value: string) {
    const hostname = normalizeDomain(value);

    if (!hostname) {
      throw new BadRequestException('Enter a valid domain or URL.');
    }

    const details = parseDomain(hostname);

    if (details.isLocalOrIp || !details.isSecureCandidate) {
      throw new BadRequestException('This does not look like a registrable public domain.');
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(`https://rdap.org/domain/${details.rootDomain}`, {
        signal: controller.signal,
        headers: {
          accept: 'application/rdap+json, application/json',
          'user-agent': 'Toolit Domain Checker',
        },
      });

      if (response.status === 404) {
        return {
          ...details,
          status: 'possibly-available',
          canBuy: true,
          message:
            'No active RDAP registration record was found. This domain may be available to buy, but confirm with a registrar before purchasing.',
          checkedAt: new Date().toISOString(),
        };
      }

      if (!response.ok) {
        throw new ServiceUnavailableException('Live availability lookup failed.');
      }

      const data = (await response.json()) as {
        ldhName?: string;
        unicodeName?: string;
        events?: Array<{ eventAction?: string; eventDate?: string }>;
      };

      const registrationEvent = data.events?.find((event) => event.eventAction === 'registration');
      const expirationEvent = data.events?.find((event) => event.eventAction === 'expiration');

      return {
        ...details,
        status: 'registered',
        canBuy: false,
        message: 'This domain already has an active registration record, so it is likely not available for direct purchase.',
        checkedAt: new Date().toISOString(),
        registeredDomain: data.unicodeName || data.ldhName || details.rootDomain,
        registrationDate: registrationEvent?.eventDate ?? null,
        expirationDate: expirationEvent?.eventDate ?? null,
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof ServiceUnavailableException) {
        throw error;
      }

      throw new ServiceUnavailableException(
        'Live domain lookup is unavailable right now. Please try again in a moment.',
      );
    } finally {
      clearTimeout(timeout);
    }
  }
}
