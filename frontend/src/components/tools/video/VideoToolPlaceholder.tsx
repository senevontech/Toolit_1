"use client";

type VideoToolPlaceholderProps = {
  title: string;
  description: string;
  inputs: string[];
  outputs: string[];
};

export default function VideoToolPlaceholder({
  title,
  description,
  inputs,
  outputs,
}: VideoToolPlaceholderProps) {
  return (
    <div className="tool-container">
      <div className="space-y-8">
        <div>
          <p className="tool-subtitle uppercase tracking-[0.18em]">Video Tool</p>
          <h2 className="tool-title mt-3">{title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
            {description}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="neu-inset-panel p-6">
            <h3 className="text-lg font-bold text-slate-100">What It Will Support</h3>
            <div className="mt-4 space-y-3 text-sm leading-7 text-slate-400">
              {inputs.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </section>

          <section className="neu-inset-panel p-6">
            <h3 className="text-lg font-bold text-slate-100">Expected Output</h3>
            <div className="mt-4 space-y-3 text-sm leading-7 text-slate-400">
              {outputs.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </section>
        </div>

        <section className="neu-card p-6 md:p-7">
          <h3 className="text-lg font-bold text-slate-100">Status</h3>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            This page is connected to the catalog, but real video conversion,
            trimming, and compression still require a processing backend such as
            FFmpeg. The current project does not have that video engine wired in yet.
          </p>
        </section>
      </div>
    </div>
  );
}
