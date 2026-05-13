"use client";

import { useState } from "react";
import CalculatorShell from "./CalculatorShell";
import { formatCurrency, parseNumber } from "./calculatorUtils";

export default function InflationCalculator() {
  const [amount, setAmount] = useState("");
  const [inflationRate, setInflationRate] = useState("");
  const [years, setYears] = useState("");
  const [results, setResults] = useState<{ label: string; value: string }[]>([]);

  const calculate = () => {
    const baseAmount = parseNumber(amount);
    const rate = parseNumber(inflationRate);
    const period = parseNumber(years);

    if ([baseAmount, rate, period].some(Number.isNaN) || baseAmount <= 0 || period <= 0) {
      setResults([]);
      return;
    }

    const futureCost = baseAmount * Math.pow(1 + rate / 100, period);
    const purchasingPower = baseAmount / Math.pow(1 + rate / 100, period);

    setResults([
      { label: "Current amount", value: formatCurrency(baseAmount) },
      { label: "Future equivalent cost", value: formatCurrency(futureCost) },
      { label: "Future purchasing power", value: formatCurrency(purchasingPower) },
    ]);
  };

  return (
    <CalculatorShell
      title="Inflation Calculator"
      description="See how inflation changes future cost and how much current money may be worth after a number of years."
      actionLabel="Calculate Inflation"
      onCalculate={calculate}
      results={results}
    >
      <input className="input" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Current amount" />
      <input className="input" value={inflationRate} onChange={(e) => setInflationRate(e.target.value)} placeholder="Inflation rate (%)" />
      <input className="input" value={years} onChange={(e) => setYears(e.target.value)} placeholder="Years" />
    </CalculatorShell>
  );
}
