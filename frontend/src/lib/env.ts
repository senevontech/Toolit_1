const DEV_API_FALLBACK = "http://localhost:5000";

function normalizeUrl(value: string, envKey: string) {
  try {
    const url = new URL(value);
    return url.toString().replace(/\/$/, "");
  } catch {
    throw new Error(`${envKey} must be a valid absolute URL.`);
  }
}

export function getPublicSiteUrl(defaultUrl: string) {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) {
    return defaultUrl;
  }
  return normalizeUrl(raw, "NEXT_PUBLIC_SITE_URL");
}

export function getPublicApiUrl() {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (raw) {
    return normalizeUrl(raw, "NEXT_PUBLIC_API_URL");
  }
  return process.env.NODE_ENV === "development" ? DEV_API_FALLBACK : "";
}
