"use client";

type DevToolShellProps = {
  title: string;
  description: string;
  controls?: React.ReactNode;
  inputLabel?: string;
  inputNode: React.ReactNode;
  outputLabel?: string;
  outputNode: React.ReactNode;
};

export default function DevToolShell({
  title,
  description,
  controls,
  inputLabel = "Input",
  inputNode,
  outputLabel = "Output",
  outputNode,
}: DevToolShellProps) {
  return (
    <div className="tool-container">
      <div className="space-y-6">
        <div>
          <p className="tool-subtitle uppercase tracking-[0.18em]">Developer Tool</p>
          <h2 className="tool-title mt-3">{title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            {description}
          </p>
        </div>

        {controls ? <section className="neu-card p-5 md:p-6">{controls}</section> : null}

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="neu-card p-5 md:p-6">
            <h3 className="text-base font-bold text-slate-100">{inputLabel}</h3>
            <div className="mt-4">{inputNode}</div>
          </div>

          <div className="neu-card p-5 md:p-6">
            <h3 className="text-base font-bold text-slate-100">{outputLabel}</h3>
            <div className="mt-4">{outputNode}</div>
          </div>
        </section>
      </div>
    </div>
  );
}
