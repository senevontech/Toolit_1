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
  controls,
  inputLabel = "Input",
  inputNode,
  outputLabel = "Output",
  outputNode,
}: DevToolShellProps) {
  return (
    <div className="tool-container tool-shell tool-shell--dev">
      <div className="space-y-5">
        {controls ? <section className="neu-card p-5 md:p-6">{controls}</section> : null}

        <section className="grid gap-5 lg:grid-cols-2">
          <div className="neu-card p-5 md:p-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
              {inputLabel}
            </h2>
            <div className="mt-4">{inputNode}</div>
          </div>

          <div className="neu-card p-5 md:p-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
              {outputLabel}
            </h2>
            <div className="mt-4">{outputNode}</div>
          </div>
        </section>
      </div>
    </div>
  );
}
