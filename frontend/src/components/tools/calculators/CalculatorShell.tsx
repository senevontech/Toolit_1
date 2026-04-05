"use client";

type ResultItem = {
  label: string;
  value: string;
};

type CalculatorShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  onCalculate: () => void;
  actionLabel: string;
  results?: ResultItem[];
  note?: string;
};

export default function CalculatorShell({
  title,
  description,
  children,
  onCalculate,
  actionLabel,
  results = [],
  note,
}: CalculatorShellProps) {
  return (
    <div className="tool-container">
      <div className="space-y-8">
        <div>
          <p className="tool-subtitle uppercase tracking-[0.18em]">Calculator</p>
          <h1 className="tool-title mt-3">{title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">{description}</p>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="neu-card space-y-4 p-6">{children}</div>

          <div className="space-y-5">
            <section className="neu-card p-6">
              <h2 className="text-lg font-bold text-slate-100">Action</h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                {note || "Enter your values and calculate the result instantly."}
              </p>
              <button type="button" className="btn mt-5" onClick={onCalculate}>
                {actionLabel}
              </button>
            </section>

            <section className="neu-card p-6">
              <h2 className="text-lg font-bold text-slate-100">Results</h2>
              {results.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {results.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/10 px-4 py-3"
                    >
                      <span className="text-sm text-slate-400">{item.label}</span>
                      <span className="text-sm font-semibold text-slate-100">{item.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm leading-7 text-slate-500">
                  Your calculated values will appear here.
                </p>
              )}
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}
