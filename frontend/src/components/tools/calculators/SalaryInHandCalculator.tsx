"use client";

import { useState } from "react";
import CalculatorShell from "./CalculatorShell";
import { formatCurrency, parseNumber } from "./calculatorUtils";

export default function SalaryInHandCalculator() {
  const [ctc, setCtc] = useState("");
  const [bonus, setBonus] = useState("");
  const [pfRate, setPfRate] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [results, setResults] = useState<{ label: string; value: string }[]>([]);

  const calculate = () => {
    const annualCtc = parseNumber(ctc);
    const annualBonus = parseNumber(bonus);
    const providentFundRate = parseNumber(pfRate);
    const estimatedTaxRate = parseNumber(taxRate);

    if (
      [annualCtc, annualBonus, providentFundRate, estimatedTaxRate].some(Number.isNaN) ||
      annualCtc <= 0
    ) {
      setResults([]);
      return;
    }

    const fixedAnnual = Math.max(0, annualCtc - annualBonus);
    const monthlyGross = fixedAnnual / 12;
    const monthlyPf = monthlyGross * (providentFundRate / 100);
    const annualTax = annualCtc * (estimatedTaxRate / 100);
    const monthlyTax = annualTax / 12;
    const monthlyInHand = monthlyGross - monthlyPf - monthlyTax;

    setResults([
      { label: "Monthly gross", value: formatCurrency(monthlyGross) },
      { label: "Monthly PF deduction", value: formatCurrency(monthlyPf) },
      { label: "Monthly tax estimate", value: formatCurrency(monthlyTax) },
      { label: "Estimated monthly in-hand", value: formatCurrency(monthlyInHand) },
      { label: "Estimated annual in-hand", value: formatCurrency(monthlyInHand * 12 + annualBonus) },
    ]);
  };

  return (
    <CalculatorShell
      title="Salary / In-hand Calculator"
      description="Estimate monthly in-hand salary after PF and tax assumptions using your annual CTC and bonus."
      actionLabel="Calculate In-hand"
      onCalculate={calculate}
      results={results}
      note="This gives a quick salary estimate using your PF and tax assumptions. Actual salary structure can differ by employer."
    >
      <input className="input" value={ctc} onChange={(e) => setCtc(e.target.value)} placeholder="Annual CTC" />
      <input className="input" value={bonus} onChange={(e) => setBonus(e.target.value)} placeholder="Annual bonus or variable pay" />
      <input className="input" value={pfRate} onChange={(e) => setPfRate(e.target.value)} placeholder="PF deduction rate (%)" />
      <input className="input" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} placeholder="Estimated effective tax rate (%)" />
    </CalculatorShell>
  );
}
