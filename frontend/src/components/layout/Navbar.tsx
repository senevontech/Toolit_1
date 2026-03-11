"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-orange-500">
          Toolit
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
          <Link href="/">Home</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-3">
          <Link href="/" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link
            href="/privacy-policy"
            onClick={() => setOpen(false)}
          >
            Privacy Policy
          </Link>
        </div>
      )}
    </header>
  );
}