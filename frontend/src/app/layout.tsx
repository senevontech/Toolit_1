import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Zap } from "lucide-react";

export const metadata: Metadata = {
  title: {
    default: "Toolit - Free Online Tools",
    template: "%s | Toolit",
  },
  description:
    "Free online tools for documents, images, developers and calculators. Fast, secure and easy to use.",
  keywords: [
    "image compressor", "pdf tools", "online tools",
    "json formatter", "qr generator", "calculator tools",
  ],
  authors: [{ name: "Toolit" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        style={{ background: "#e2e8f0" }}
        className="text-gray-700 flex flex-col min-h-screen antialiased"
      >
        {/* ═══════════ HEADER ═══════════ */}
        <header
          className="sticky top-0 z-50"
          style={{
            background: "linear-gradient(145deg, #edf1f7, #d8dfe9)",
            boxShadow:
              "0 6px 20px rgba(163,177,198,0.50), 0 2px 6px rgba(163,177,198,0.30), inset 0 1px 0 rgba(255,255,255,0.80)",
          }}
        >
          <div className="max-w-7xl mx-auto px-5 py-3.5 flex justify-between items-center">

            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <Image
                src="/logo/logo.png"
                alt="Toolit"
                width={120}
                height={40}
                priority
                style={{
                  objectFit: "contain",
                  transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                }}
                className="group-hover:scale-105"
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1.5">
              <Link href="/" className="btn-ghost">Home</Link>
              <Link href="/privacy-policy" className="btn-ghost">Privacy</Link>
              <Link href="/" className="btn btn-sm ml-1">
                <Zap size={13} className="fill-white" />
                All Tools
              </Link>
            </nav>

            {/* Mobile */}
            <Link href="/" className="md:hidden btn btn-sm">Tools</Link>
          </div>
        </header>

        {/* ═══════════ MAIN ═══════════ */}
        <main className="flex-1 w-full">
          {children}
        </main>

        {/* ═══════════ FOOTER ═══════════ */}
        <footer
          className="mt-auto relative overflow-hidden"
          style={{
            /* Skeuomorphic orange metal surface */
            background: "linear-gradient(152deg, #fb923c 0%, #f97316 28%, #ea580c 62%, #c2440a 100%)",
            boxShadow: "inset 0 10px 40px rgba(0,0,0,0.22), inset 0 -2px 0 rgba(255,150,60,0.30)",
          }}
        >
          {/* Light-source highlight (top-left sheen) */}
          <div
            aria-hidden
            style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: "radial-gradient(ellipse 80% 40% at 20% 0%, rgba(255,255,255,0.13) 0%, transparent 70%)",
            }}
          />
          {/* Subtle surface texture */}
          <div
            aria-hidden
            style={{
              position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.04,
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0' y='0' width='1' height='1' fill='%23fff'/%3E%3C/svg%3E\")",
            }}
          />

          {/* ── Top utility bar ── */}
          <div
            style={{ borderBottom: "1px solid rgba(212,221,233,0.18)", position: "relative" }}
          >
            <div
              className="px-6 md:px-10 py-5"
              style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "start", gap: "1rem" }}
            >
              {/* Left: contact info */}
              <div>
                <p style={{ fontSize: "0.6rem", letterSpacing: "0.14em", color: "rgba(232,238,245,0.50)", textTransform: "uppercase", marginBottom: "0.2rem" }}>
                  For Media Inquiries
                </p>
                <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "#e8eef5", letterSpacing: "0.04em", textShadow: "0 1px 4px rgba(0,0,0,0.30)" }}>
                  HELLO@TOOLIT.COM
                </p>
                <p style={{ fontSize: "0.6rem", letterSpacing: "0.14em", color: "rgba(232,238,245,0.50)", textTransform: "uppercase", marginTop: "0.65rem", marginBottom: "0.2rem" }}>
                  For Partnerships
                </p>
                <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "#e8eef5", letterSpacing: "0.04em", textShadow: "0 1px 4px rgba(0,0,0,0.30)" }}>
                  PARTNER@TOOLIT.COM
                </p>
              </div>

              {/* Center: logo */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Image
                  src="/logo/logo.png"
                  alt="Toolit"
                  width={110}
                  height={38}
                  style={{
                    objectFit: "contain",
                    filter: "brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0,0,0,0.3))",
                    opacity: 0.92,
                  }}
                />
              </div>

              {/* Right: social links */}
              <div style={{ textAlign: "right" }}>
                {[
                  ["INSTAGRAM", "/"],
                  ["TELEGRAM",  "/"],
                  ["TWITTER",   "/"],
                ].map(([label, href]) => (
                  <div key={label} style={{ marginBottom: "0.4rem" }}>
                    <Link
                      href={href}
                      style={{
                        fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em",
                        color: "#e8eef5", textDecoration: "none",
                        textShadow: "0 1px 4px rgba(0,0,0,0.30)",
                        transition: "color 0.15s ease",
                        display: "inline-flex", alignItems: "center", gap: "0.3rem",
                      }}
                    >
                      {label} <span style={{ fontSize: "0.7rem", opacity: 0.7 }}>↗</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Navigation links ── */}
          <div className="px-6 md:px-10 py-10 md:py-12" style={{ position: "relative" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "0.1rem 2rem",
              }}
            >
              {[
                ["ALL TOOLS",        "/"                          ],
                ["IMAGE TOOLS",      "/tools/image-compressor"   ],
                ["DOCUMENT TOOLS",   "/tools/merge-pdf"          ],
                ["DEVELOPER TOOLS",  "/tools/json-formatter"     ],
                ["CALCULATORS",      "/tools/emi-calculator"     ],
                ["PRIVACY POLICY",   "/privacy-policy"           ],
              ].map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  style={{
                    display: "block",
                    fontSize: "clamp(1.35rem, 2.8vw, 2.2rem)",
                    fontWeight: 900,
                    letterSpacing: "0.04em",
                    lineHeight: 1.3,
                    textTransform: "uppercase",
                    textDecoration: "none",
                    color: "#d4dce8",
                    textShadow:
                      "2px 2px 10px rgba(0,0,0,0.32), -1px -1px 1px rgba(255,255,255,0.12)",
                    transition: "color 0.15s ease, text-shadow 0.15s ease",
                    padding: "0.35rem 0",
                    borderBottom: "1px solid rgba(212,221,233,0.10)",
                  }}
                >
                  {label} <span style={{ fontSize: "0.65em", opacity: 0.5, fontWeight: 400 }}>↗</span>
                </Link>
              ))}
            </div>
          </div>

          {/* ── Massive wordmark ── */}
          <div
            style={{
              borderTop: "1px solid rgba(212,221,233,0.18)",
              borderBottom: "1px solid rgba(212,221,233,0.18)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <p
              style={{
                fontSize: "clamp(4.5rem, 18vw, 13rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 0.9,
                color: "#d4dce8",
                textTransform: "uppercase",
                padding: "0.1em 0.18em",
                margin: 0,
                whiteSpace: "nowrap",
                textShadow:
                  "4px 4px 18px rgba(0,0,0,0.35), -2px -2px 4px rgba(255,255,255,0.14), 0 0 60px rgba(0,0,0,0.15)",
                /* Subtle inner-edge highlight for skeuomorphic depth */
                WebkitTextStroke: "1px rgba(255,255,255,0.06)",
              }}
            >
              TOOLIT
            </p>
          </div>

          {/* ── Bottom bar ── */}
          <div style={{ position: "relative" }}>
            <div
              className="px-6 md:px-10 py-4"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              {[
                `©${new Date().getFullYear()} TOOLIT. ALL RIGHTS RESERVED`,
                "BUILT FOR PRODUCTIVITY",
                "FREE · FAST · SECURE",
              ].map((text) => (
                <span
                  key={text}
                  style={{
                    fontSize: "0.62rem",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    color: "rgba(212,221,233,0.55)",
                    textTransform: "uppercase",
                  }}
                >
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* ── Ruler ── */}
          <div
            style={{
              borderTop: "1px solid rgba(212,221,233,0.18)",
              padding: "0.35rem 0 0.5rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Tick marks via CSS */}
            <div
              style={{
                height: "10px",
                backgroundImage: [
                  /* Major ticks every 100px */
                  "repeating-linear-gradient(90deg, rgba(212,221,233,0.55) 0px, rgba(212,221,233,0.55) 1px, transparent 1px, transparent 100px)",
                  /* Minor ticks every 20px */
                  "repeating-linear-gradient(90deg, rgba(212,221,233,0.25) 0px, rgba(212,221,233,0.25) 1px, transparent 1px, transparent 20px)",
                ].join(", "),
                backgroundPosition: "left center",
              }}
            />
            {/* Ruler numbers */}
            <div
              style={{
                display: "flex",
                paddingTop: "2px",
                position: "relative",
              }}
            >
              {Array.from({ length: 16 }, (_, i) => i * 100).map((n) => (
                <span
                  key={n}
                  style={{
                    position: "absolute",
                    left: `${n}px`,
                    fontSize: "0.48rem",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    color: "rgba(212,221,233,0.40)",
                    fontVariantNumeric: "tabular-nums",
                    transform: "translateX(-50%)",
                  }}
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
