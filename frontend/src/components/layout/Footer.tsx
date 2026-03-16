import Image from "next/image";
import Link from "next/link";

const contactGroups = [
  {
    label: "Media inquiries",
    value: "hello@toolit.com",
    href: "mailto:hello@toolit.com",
  },
  {
    label: "Partnerships",
    value: "partner@toolit.com",
    href: "mailto:partner@toolit.com",
  },
];

const socialLinks = [
  { label: "Instagram", href: "/" },
  { label: "Telegram", href: "/" },
  { label: "Twitter", href: "/" },
];

const footerLinks = [
  { eyebrow: "Start here", label: "All tools", href: "/" },
  {
    eyebrow: "Visual workflow",
    label: "Image tools",
    href: "/tools/image-compressor",
  },
  {
    eyebrow: "Document stack",
    label: "Document tools",
    href: "/tools/merge-pdf",
  },
  {
    eyebrow: "Code bench",
    label: "Developer tools",
    href: "/tools/json-formatter",
  },
  {
    eyebrow: "Everyday math",
    label: "Calculators",
    href: "/tools/emi-calculator",
  },
  {
    eyebrow: "Policy",
    label: "Privacy policy",
    href: "/privacy-policy",
  },
];

const rulerMarks = Array.from(
  { length: 11 },
  (_, index) => `${55 + index * 5}`
);

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-shell mt-auto">
      <div className="footer-glow" aria-hidden />
      <div className="footer-noise" aria-hidden />

      <div className="footer-topbar">
        <div className="footer-container footer-topbar-grid">
          <div className="footer-contact">
            {contactGroups.map((item) => (
              <div key={item.label} className="footer-contact-block">
                <p className="footer-meta">{item.label}</p>
                <Link href={item.href} className="footer-utility-link">
                  {item.value}
                </Link>
              </div>
            ))}
          </div>

          <div className="footer-brand-lockup">
            <div className="footer-brand-seal" aria-hidden>
              TL
            </div>
            <div>
              <p className="footer-meta">Toolit industries</p>
              <p className="footer-brand-title">Skeuomorphic utility deck</p>
            </div>
          </div>

          <div className="footer-socials">
            {socialLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="footer-utility-link footer-social-link"
              >
                <span>{item.label}</span>
                <span aria-hidden>↗</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-container footer-main-grid">
          <div className="footer-brand-panel">
            <div className="footer-logo-wrap">
              <Image
                src="/logo/logo.png"
                alt="Toolit"
                width={180}
                height={60}
                className="footer-logo"
              />
            </div>
            <p className="footer-panel-copy">
              Fast online tools for documents, images, developers, and
              calculators. Built to feel mechanical, sharp, and immediate.
            </p>
          </div>

          <nav className="footer-nav" aria-label="Footer">
            {footerLinks.map((item) => (
              <Link key={item.label} href={item.href} className="footer-nav-link">
                <span className="footer-meta">{item.eyebrow}</span>
                <span className="footer-nav-label">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="footer-wordmark-band" aria-hidden>
        <p className="footer-wordmark">TOOLIT</p>
      </div>

      <div className="footer-bottombar">
        <div className="footer-container footer-bottombar-grid">
          <span className="footer-meta footer-bottom-copy">
            © {year} Toolit. All rights reserved.
          </span>
          <span className="footer-meta footer-bottom-copy">
            Built for productivity
          </span>
          <span className="footer-meta footer-bottom-copy">
            Free · Fast · Secure
          </span>
        </div>
      </div>

      <div className="footer-ruler" aria-hidden>
        <div className="footer-ruler-ticks" />
        <div className="footer-container footer-ruler-labels">
          {rulerMarks.map((mark) => (
            <span key={mark} className="footer-ruler-label">
              {mark}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
