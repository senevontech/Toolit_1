import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-20">
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
        {/* About */}
        <div>
          <h3 className="font-bold text-lg mb-3">
            Toolit
          </h3>
          <p className="text-sm text-gray-600">
            Free online tools for images, PDFs, developers
            and calculators. Fast, secure & easy to use.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-lg mb-3">
            Quick Links
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <Link href="/">Home</Link>
            <br />
            <Link href="/privacy-policy">
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-bold text-lg mb-3">
            Legal
          </h3>
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Toolit.  
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}