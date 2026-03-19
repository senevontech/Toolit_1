import type { Metadata } from "next";
import "./whomadeit.css";

export const metadata: Metadata = {
  title: "Who Made It",
  robots: { index: false, follow: false },
};

const DEVELOPERS = [
  {
    name: "Srijon Karmakar",
    email: "srijonkarmakar.dev@gmail.com",
    role: "Full-stack engineer",
    initials: "SN",
  },
  {
    name: "Nadia Tariq",
    email: "nadia@toolegend.com",
    role: "Frontend Developer",
    initials: "NT",
  },
  {
    name: "Vashti Khumalo",
    email: "vashti@toolegend.com",
    role: "Backend Developer",
    initials: "VK",
  },
  {
    name: "Imran Siddiqui",
    email: "imran@toolegend.com",
    role: "Full-Stack Developer",
    initials: "IS",
  },
] as const;

export default function WhoMadeItPage() {
  return (
    <div className="wmi-page">
      {/* ── HEADER ── */}
      <header className="wmi-header">
        <p className="wmi-eyebrow">Behind the scenes</p>
        <h1 className="wmi-title">Who Made It</h1>
        <p className="wmi-subtitle">
          The team that built Toolegend from the ground up.
        </p>
      </header>

      {/* ── CARDS GRID ── */}
      <section className="wmi-grid-section">
        <div className="wmi-grid">
          {DEVELOPERS.map((dev) => (
            <article key={dev.email} className="wmi-card">
              <div className="wmi-avatar" aria-hidden="true">
                {dev.initials}
              </div>
              <div className="wmi-card-body">
                <h2 className="wmi-name">{dev.name}</h2>
                <span className="wmi-role">{dev.role}</span>
                <a
                  href={`mailto:${dev.email}`}
                  className="wmi-email"
                  aria-label={`Email ${dev.name}`}
                >
                  {dev.email}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── FOOTER NOTE ── */}
      <footer className="wmi-footer-note">
        <p className="wmi-footer-text">
          Built with care &mdash; Toolegend &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
