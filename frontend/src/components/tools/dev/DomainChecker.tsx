"use client";

import { useMemo, useState } from "react";
import { Loader2, Search } from "lucide-react";
import DevToolShell from "./DevToolShell";
import { API_URL } from "@/lib/api";

type DomainCheckResponse = {
  hostname: string;
  rootDomain: string;
  subdomain: string | null;
  tld: string | null;
  labels: number;
  isLocalOrIp: boolean;
  isSecureCandidate: boolean;
  status: "registered" | "possibly-available";
  canBuy: boolean;
  message: string;
  checkedAt: string;
  registeredDomain?: string | null;
  registrationDate?: string | null;
  expirationDate?: string | null;
};

function normalizeDomain(value: string) {
  const input = value.trim();
  if (!input) return null;

  try {
    const parsed = input.includes("://") ? new URL(input) : new URL(`https://${input}`);
    return parsed.hostname.toLowerCase();
  } catch {
    return null;
  }
}

function createSuggestions(rootDomain: string) {
  const dotIndex = rootDomain.lastIndexOf(".");
  const name = dotIndex >= 0 ? rootDomain.slice(0, dotIndex) : rootDomain;
  const cleanName = name.replace(/[^a-z0-9-]/gi, "").toLowerCase();

  if (!cleanName) {
    return [];
  }

  return [
    `${cleanName}.com`,
    `${cleanName}.in`,
    `${cleanName}.net`,
    `${cleanName}.org`,
    `get${cleanName}.com`,
    `${cleanName}app.com`,
  ];
}

function registrarLinks(domain: string) {
  return [
    {
      label: "Namecheap",
      href: `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(domain)}`,
    },
    {
      label: "GoDaddy",
      href: `https://www.godaddy.com/domainsearch/find?domainToCheck=${encodeURIComponent(domain)}`,
    },
    {
      label: "Spaceship",
      href: `https://www.spaceship.com/domains/search/?q=${encodeURIComponent(domain)}`,
    },
  ];
}

function formatDate(value?: string | null) {
  if (!value) {
    return "Unknown";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export default function DomainChecker() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<DomainCheckResponse | null>(null);
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const parsedHostname = useMemo(() => normalizeDomain(input), [input]);
  const rootDomain = result?.rootDomain || parsedHostname || "";
  const suggestions = useMemo(
    () => (rootDomain ? createSuggestions(rootDomain.includes(".") ? rootDomain : `${rootDomain}.com`) : []),
    [rootDomain]
  );
  const links = useMemo(() => (result?.rootDomain ? registrarLinks(result.rootDomain) : []), [result]);

  const handleCheck = async () => {
    if (!input.trim()) {
      setError("Enter a domain name first.");
      setResult(null);
      return;
    }

    setIsChecking(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/domain/check?value=${encodeURIComponent(input.trim())}`
      );
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          typeof payload.message === "string"
            ? payload.message
            : "Domain availability check failed."
        );
      }

      setResult(payload as DomainCheckResponse);
    } catch (checkError) {
      setResult(null);
      setError(
        checkError instanceof Error
          ? checkError.message
          : "Domain availability check failed."
      );
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <DevToolShell
      title="Domain Checker"
      description="Check whether a domain looks available to buy, inspect its structure, and jump straight to registrars for purchase."
      controls={
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/5 bg-black/10 p-4 text-sm leading-7 text-slate-400">
            This tool now runs a live backend lookup. If a registration record exists, it will show as already registered. If no RDAP record is found, it may be available to buy.
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn" onClick={handleCheck} disabled={isChecking}>
              {isChecking ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              {isChecking ? "Checking..." : "Check Availability"}
            </button>

            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="btn-outline"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      }
      inputLabel="Domain or URL"
      inputNode={
        <textarea
          className="input min-h-[18rem]"
          placeholder="example.com or https://sub.example.com/path"
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setError("");
          }}
        />
      }
      outputLabel="Live Availability Result"
      outputNode={
        <div className="space-y-4">
          {!input.trim() ? (
            <p className="text-sm leading-7 text-slate-500">
              Enter a domain, then run a live availability check.
            </p>
          ) : null}

          {error ? (
            <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          ) : null}

          {result ? (
            <>
              <div className="rounded-2xl border border-white/5 bg-black/10 p-4">
                <p className="text-sm font-semibold text-slate-100">Availability</p>
                <p
                  className={`mt-2 text-base font-bold ${
                    result.canBuy ? "text-emerald-300" : "text-amber-300"
                  }`}
                >
                  {result.canBuy ? "This domain may be available to buy" : "This domain is already registered"}
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-400">{result.message}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/10 px-4 py-3">
                  <span className="text-sm text-slate-400">Root domain</span>
                  <span className="text-sm font-semibold text-slate-100">{result.rootDomain}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/10 px-4 py-3">
                  <span className="text-sm text-slate-400">Subdomain</span>
                  <span className="text-sm font-semibold text-slate-100">{result.subdomain || "None"}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/10 px-4 py-3">
                  <span className="text-sm text-slate-400">TLD</span>
                  <span className="text-sm font-semibold text-slate-100">{result.tld || "None"}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/10 px-4 py-3">
                  <span className="text-sm text-slate-400">Checked at</span>
                  <span className="text-sm font-semibold text-slate-100">{formatDate(result.checkedAt)}</span>
                </div>
                {!result.canBuy ? (
                  <>
                    <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/10 px-4 py-3">
                      <span className="text-sm text-slate-400">Registration date</span>
                      <span className="text-sm font-semibold text-slate-100">
                        {formatDate(result.registrationDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/10 px-4 py-3">
                      <span className="text-sm text-slate-400">Expiration date</span>
                      <span className="text-sm font-semibold text-slate-100">
                        {formatDate(result.expirationDate)}
                      </span>
                    </div>
                  </>
                ) : null}
              </div>

              {suggestions.length > 0 ? (
                <div className="rounded-2xl border border-white/5 bg-black/10 p-4">
                  <p className="text-sm font-semibold text-slate-100">Try alternatives</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {suggestions.map((item) => (
                      <button
                        key={item}
                        type="button"
                        className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-orange-400/50 hover:text-white"
                        onClick={() => {
                          setInput(item);
                          setResult(null);
                          setError("");
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      }
    />
  );
}
