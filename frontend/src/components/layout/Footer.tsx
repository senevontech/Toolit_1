import Image from "next/image";
import Link from "next/link";

const primaryLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/#features" },
  { label: "About", href: "/#about" },
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Pricing", href: "/studio" },
];

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com", external: true },
  { label: "Instagram", href: "https://instagram.com", external: true },
  { label: "Website", href: "https://senevon.in", external: true },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="brand-footer">
      <div className="brand-footer__topline">
        <a
          href="https://senevon.in"
          target="_blank"
          rel="noreferrer"
          className="brand-footer__site-link"
        >
          senevon.in
        </a>
      </div>

      <div className="brand-footer__content">
        <div className="brand-footer__hero">
          <div className="brand-footer__wordmark-wrap">
            <h2 className="brand-footer__wordmark">TOOLMITRA</h2>
          </div>
          <p className="brand-footer__tagline">A product of Senevon INC</p>
        </div>

        <div className="brand-footer__nav-shell">
          <div className="brand-footer__nav-grid">
            <div className="brand-footer__column">
              <nav className="brand-footer__links" aria-label="Footer navigation">
                {primaryLinks.map((item) => (
                  <Link key={item.label} href={item.href} className="brand-footer__link">
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="brand-footer__column">
              <p className="brand-footer__heading">Social</p>
              <div className="brand-footer__social-wrap">
                <nav className="brand-footer__links" aria-label="Social links">
                  {socialLinks.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="brand-footer__link"
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noreferrer" : undefined}
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          <div className="brand-footer__logo-lockup" aria-hidden>
            <Image
              src="/logo/snv-logo.png"
              alt=""
              width={3264}
              height={3264}
              className="brand-footer__logo-mark"
            />
          </div>
        </div>
      </div>

      <div className="brand-footer__bottomline">
        All rights reserved @senevon inc {year}
      </div>
    </footer>
  );
}
