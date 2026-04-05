import "./globals.css";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Outfit } from "next/font/google";
import { Zap, Home } from "lucide-react";

import Footer from "@/components/layout/Footer";
import LoadingCurtain from "@/components/layout/LoadingCurtain";
import ThemeBoot from "@/components/theme/ThemeBoot";
import { categories } from "@/lib/tools";
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
        url: "/logo/logo-white.png",
        alt: `${siteName} logo`,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: `${siteName} - Free Online Tools`,
    description: defaultDescription,
    images: ["/logo/logo-white.png"],
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
  const navCategories = categories.map((category) => ({
    value: category,
    label: category === "Calculators" ? "Calculators" : category.replace(" Tools", ""),
  }));

  return (
    <html lang="en" className={`${outfit.variable} scroll-smooth`}>
      <body
        style={{
          background: "var(--nm-bg, #111827)",
          color: "var(--nm-text, #e5eefc)",
          transition: "background 0.35s ease, color 0.35s ease",
        }}
        className="flex min-h-screen flex-col antialiased"
      >
        <ThemeBoot />
        <header
          className="site-header sticky top-0 z-50"
          style={{
            background: "var(--nm-bg, #111827)",
            boxShadow: "var(--nm-shadow-out, 0 0 0 transparent)",
            transition: "background 0.35s ease, box-shadow 0.35s ease",
          }}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5">
            <Link href="/" className="group flex items-center">
              <Image
                src="/logo/logo-white.png"
                alt="Toolmitra"
                width={120}
                height={40}
                priority
                style={{
                  objectFit: "contain",
                  height: "auto",
                  transition:
                    "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                }}
                className="h-auto w-[108px] sm:w-[120px] group-hover:scale-105"
              />
            </Link>

            <nav className="hidden items-center gap-2 lg:flex">
              <Link href="/" className="btn-ghost navbar-link">
                Home
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
              className="mobile-home-btn lg:hidden"
            >
              <Home size={16} strokeWidth={2.2} />
            </Link>
          </div>

          <nav className="site-category-strip" aria-label="Tool categories">
            <div className="site-category-strip__inner">
              {navCategories.map((category) => (
                <Link
                  key={category.value}
                  href={`/tools?category=${encodeURIComponent(category.value)}#tools`}
                  className="site-category-strip__link"
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </nav>

        </header>

        <LoadingCurtain />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
