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
  children,
  onCalculate,
  actionLabel,
  results = [],
  note,
}: CalculatorShellProps) {
  return (
    <div className="tool-container tool-shell tool-shell--calculator">
      <div className="space-y-5">
        <section className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="neu-card space-y-4 p-6">
            {children}
            {note ? (
              <p className="text-sm leading-6 text-slate-500">{note}</p>
            ) : null}
            <button type="button" className="btn mt-2 w-full sm:w-auto" onClick={onCalculate}>
              {actionLabel}
            </button>
          </div>

          <section className="neu-card p-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
              Results
            </h2>
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
        </section>
      </div>
    </div>
  );
}
