import "./globals.css";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Zap } from "lucide-react";

import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "Toolit - Free Online Tools",
    template: "%s | Toolit",
  },
  description:
    "Free online tools for documents, images, developers and calculators. Fast, secure and easy to use.",
  keywords: [
    "image compressor",
    "pdf tools",
    "online tools",
    "json formatter",
    "qr generator",
    "calculator tools",
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
        className="flex min-h-screen flex-col text-gray-700 antialiased"
      >
        <header
          className="sticky top-0 z-50"
          style={{
            background: "linear-gradient(145deg, #edf1f7, #d8dfe9)",
            boxShadow:
              "0 6px 20px rgba(163,177,198,0.50), 0 2px 6px rgba(163,177,198,0.30), inset 0 1px 0 rgba(255,255,255,0.80)",
          }}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5">
            <Link href="/" className="group flex items-center">
              <Image
                src="/logo/logo.png"
                alt="Toolit"
                width={120}
                height={40}
                priority
                style={{
                  objectFit: "contain",
                  transition:
                    "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                }}
                className="group-hover:scale-105"
              />
            </Link>

            <nav className="hidden items-center gap-1.5 md:flex">
              <Link href="/" className="btn-ghost">
                Home
              </Link>
              <Link href="/studio" className="btn-ghost">
                Studio
              </Link>
              <Link href="/privacy-policy" className="btn-ghost">
                Privacy
              </Link>
              <Link href="/" className="btn btn-sm ml-1">
                <Zap size={13} className="fill-white" />
                All Tools
              </Link>
            </nav>

            <div className="flex items-center gap-2 md:hidden">
              <Link href="/studio" className="btn-outline btn-sm">
                Studio
              </Link>
              <Link href="/" className="btn btn-sm">
                Tools
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
