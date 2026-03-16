const policySections = [
  {
    title: "What we process",
    body:
      "Toolit focuses on in-browser utilities and temporary file handling. Files you upload are used only to complete the tool action you request.",
  },
  {
    title: "How long data stays",
    body:
      "Generated outputs and uploaded inputs are not intended for permanent storage. Keep this page aligned with any backend retention policy if server-side processing expands.",
  },
  {
    title: "Contact",
    body:
      "For privacy requests or policy questions, contact hello@toolit.com and partner@toolit.com.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <section className="px-4 py-14 md:px-8">
      <div className="tool-container mx-auto max-w-4xl">
        <p className="tool-subtitle uppercase tracking-[0.18em]">
          Legal
        </p>
        <h1 className="tool-title mt-3 text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          This page provides a basic privacy summary for Toolit. Update it
          with production retention, analytics, and compliance details before
          treating it as a final legal document.
        </p>

        <div className="mt-10 space-y-6">
          {policySections.map((section) => (
            <article key={section.title} className="neu-card p-6 md:p-7">
              <h2 className="text-lg font-extrabold text-slate-800">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {section.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
