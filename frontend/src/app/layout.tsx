import "./globals.css";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Outfit } from "next/font/google";
import { Zap, Home } from "lucide-react";

import Footer from "@/components/layout/Footer";
import LoadingCurtain from "@/components/layout/LoadingCurtain";
import {
  defaultDescription,
  defaultKeywords,
  siteMetadataBase,
  siteName,
  siteUrl,
} from "@/lib/seo";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-geometric",
});

export const metadata: Metadata = {
  metadataBase: siteMetadataBase,
  applicationName: siteName,
  title: {
    default: `${siteName} - Free Online Tools`,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  keywords: defaultKeywords,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName,
    url: "/",
    title: `${siteName} - Free Online Tools`,
    description: defaultDescription,
    images: [
      {
        url: "/logo/logo-black.png",
        alt: `${siteName} logo`,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: `${siteName} - Free Online Tools`,
    description: defaultDescription,
    images: ["/logo/logo-black.png"],
  },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} scroll-smooth`}>
      <body
        style={{
          background: "var(--nm-bg, #e8e0d8)",
          color: "var(--nm-text, #374151)",
          transition: "background 0.35s ease, color 0.35s ease",
        }}
        className="flex min-h-screen flex-col text-gray-700 antialiased"
      >
        <header
          className="site-header sticky top-0 z-50"
          style={{
            background: "var(--nm-bg, #e8e0d8)",
            boxShadow: "var(--nm-shadow-out, 0 0 0 transparent)",
            transition: "background 0.35s ease, box-shadow 0.35s ease",
          }}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5">
            <Link href="/" className="group flex items-center">
              <Image
                src="/logo/logo-black.png"
                alt="Toolmitra"
                width={120}
                height={40}
                priority
                style={{
                  objectFit: "contain",
                  transition:
                    "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                }}
                className="h-auto w-[108px] sm:w-[120px] group-hover:scale-105"
              />
            </Link>

            <nav className="hidden items-center gap-2 md:flex">
              <Link href="/" className="btn-ghost navbar-link">
                Home
              </Link>
              <Link href="/privacy-policy" className="btn-ghost navbar-link">
                Privacy
              </Link>
              <Link href="/tools" className="btn btn-sm ml-1">
                <Zap size={13} className="fill-white" />
                All Tools
              </Link>
            </nav>

            {/* Mobile-only home button */}
            <Link
              href="/"
              aria-label="Go to Home"
              className="mobile-home-btn md:hidden"
            >
              <Home size={16} strokeWidth={2.2} />
            </Link>
          </div>
        </header>

        <LoadingCurtain />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
