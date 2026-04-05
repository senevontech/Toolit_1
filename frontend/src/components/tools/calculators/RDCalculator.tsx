"use client";

import { useState } from "react";
import CalculatorShell from "./CalculatorShell";
import { formatCurrency, parseNumber } from "./calculatorUtils";

export default function RDCalculator() {
  const [monthlyDeposit, setMonthlyDeposit] = useState("");
  const [rate, setRate] = useState("");
  const [months, setMonths] = useState("");
  const [results, setResults] = useState<{ label: string; value: string }[]>([]);

  const calculate = () => {
    const deposit = parseNumber(monthlyDeposit);
    const annualRate = parseNumber(rate);
    const totalMonths = parseNumber(months);

    if ([deposit, annualRate, totalMonths].some(Number.isNaN) || deposit <= 0 || totalMonths <= 0) {
      setResults([]);
      return;
    }

    const monthlyRate = annualRate / 400;
    const maturityAmount =
      deposit *
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / (1 - Math.pow(1 + monthlyRate, -1)));
    const investedAmount = deposit * totalMonths;
    const interestEarned = maturityAmount - investedAmount;

    setResults([
      { label: "Total invested", value: formatCurrency(investedAmount) },
      { label: "Interest earned", value: formatCurrency(interestEarned) },
      { label: "Maturity value", value: formatCurrency(maturityAmount) },
    ]);
  };

  return (
    <CalculatorShell
      title="RD Calculator"
      description="Estimate recurring deposit maturity value from your monthly deposit, interest rate, and tenure."
      actionLabel="Calculate RD"
      onCalculate={calculate}
      results={results}
    >
      <input className="input" value={monthlyDeposit} onChange={(e) => setMonthlyDeposit(e.target.value)} placeholder="Monthly deposit" />
      <input className="input" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="Annual interest rate (%)" />
      <input className="input" value={months} onChange={(e) => setMonths(e.target.value)} placeholder="Tenure (months)" />
    </CalculatorShell>
  );
}
