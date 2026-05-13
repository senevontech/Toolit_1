"use client";

import { useState } from "react";
import CalculatorShell from "./CalculatorShell";
import { formatCurrency, parseNumber } from "./calculatorUtils";

export default function FDCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [compoundings, setCompoundings] = useState("4");
  const [results, setResults] = useState<{ label: string; value: string }[]>([]);

  const calculate = () => {
    const P = parseNumber(principal);
    const r = parseNumber(rate);
    const t = parseNumber(years);
    const n = parseNumber(compoundings);

    if ([P, r, t, n].some(Number.isNaN) || P <= 0 || t <= 0 || n <= 0) {
      setResults([]);
      return;
    }

    const maturityAmount = P * Math.pow(1 + r / (100 * n), n * t);
    const interestEarned = maturityAmount - P;

    setResults([
      { label: "Invested amount", value: formatCurrency(P) },
      { label: "Interest earned", value: formatCurrency(interestEarned) },
      { label: "Maturity amount", value: formatCurrency(maturityAmount) },
    ]);
  };

  return (
    <CalculatorShell
      title="FD Calculator"
      description="Estimate fixed deposit maturity value, total interest earned, and total return with compounding."
      actionLabel="Calculate FD"
      onCalculate={calculate}
      results={results}
      note="This uses standard compound-interest FD math with configurable compounding frequency."
    >
      <input className="input" value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder="Deposit amount" />
      <input className="input" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="Annual interest rate (%)" />
      <input className="input" value={years} onChange={(e) => setYears(e.target.value)} placeholder="Tenure (years)" />
      <select className="input default:bg-transparent" value={compoundings} onChange={(e) => setCompoundings(e.target.value)}>
        <option value="1">Compounded yearly</option>
        <option value="2">Compounded half-yearly</option>
        <option value="4">Compounded quarterly</option>
        <option value="12">Compounded monthly</option>
      </select>
    </CalculatorShell>
  );
}
