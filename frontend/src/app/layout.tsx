import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

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
    <html lang="en">
      <body className="bg-white text-gray-800 flex flex-col min-h-screen">
        {/* ================= HEADER ================= */}
        <header className="border-b shadow-sm bg-white sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            {/* Logo */}
            <Link
              href="/"
              className="text-2xl font-bold text-orange-500"
            >
              Toolit
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-6 text-sm font-medium">
              <Link href="/" className="hover:text-orange-500">
                Home
              </Link>

              <Link
                href="/privacy-policy"
                className="hover:text-orange-500"
              >
                Privacy
              </Link>
            </nav>
          </div>
        </header>

        {/* ================= MAIN ================= */}
        <main className="flex-1 max-w-7xl mx-auto px-4 py-10 w-full">
          {children}
        </main>

        {/* ================= FOOTER ================= */}
        <footer className="border-t bg-gray-50 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Toolit. All rights reserved.
        </footer>
      </body>
    </html>
  );
}