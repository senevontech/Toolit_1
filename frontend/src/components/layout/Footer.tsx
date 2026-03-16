import Link from "next/link";

const primaryLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/" },
  { label: "About", href: "/" },
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Pricing", href: "/" },
];

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Website", href: "/" },
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
          <h2 className="brand-footer__wordmark">TOOLIT</h2>
          <p className="brand-footer__tagline">A product of Senevon INC</p>
        </div>

        <div className="brand-footer__nav-shell">
          <div className="brand-footer__nav-grid">
            <div className="brand-footer__column">
              <p className="brand-footer__heading">Menu</p>
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
                <div className="brand-footer__emblem" aria-hidden>
                  <span className="brand-footer__emblem-block" />
                </div>
                <nav className="brand-footer__links" aria-label="Social links">
                  {socialLinks.map((item) => (
                    <Link key={item.label} href={item.href} className="brand-footer__link">
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          <p className="brand-footer__watermark">SENEVON</p>
        </div>
      </div>

      <div className="brand-footer__bottomline">
        All rights reserved @senevon inc {year}
      </div>
    </footer>
  );
}
