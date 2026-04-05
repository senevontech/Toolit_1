"use client";

import { useState } from "react";
import CalculatorShell from "./CalculatorShell";
import { formatCurrency, formatPercent, parseNumber } from "./calculatorUtils";

export default function IncomeTaxCalculator() {
  const [income, setIncome] = useState("");
  const [deductions, setDeductions] = useState("");
  const [results, setResults] = useState<{ label: string; value: string }[]>([]);

  const calculate = () => {
    const grossIncome = parseNumber(income);
    const deductionAmount = parseNumber(deductions);

    if ([grossIncome, deductionAmount].some(Number.isNaN) || grossIncome < 0 || deductionAmount < 0) {
      setResults([]);
      return;
    }

    const taxableIncome = Math.max(0, grossIncome - deductionAmount);
    const slabs = [
      { upto: 300000, rate: 0 },
      { upto: 700000, rate: 0.05 },
      { upto: 1000000, rate: 0.1 },
      { upto: 1200000, rate: 0.15 },
      { upto: 1500000, rate: 0.2 },
      { upto: Number.POSITIVE_INFINITY, rate: 0.3 },
    ];

    let remaining = taxableIncome;
    let previousLimit = 0;
    let tax = 0;

    for (const slab of slabs) {
      if (remaining <= 0) {
        break;
      }

      const slabWidth = slab.upto - previousLimit;
      const taxableAtThisSlab = Math.min(remaining, slabWidth);
      tax += taxableAtThisSlab * slab.rate;
      remaining -= taxableAtThisSlab;
      previousLimit = slab.upto;
    }

    const cess = tax * 0.04;
    const totalTax = tax + cess;
    const effectiveRate = grossIncome === 0 ? 0 : (totalTax / grossIncome) * 100;

    setResults([
      { label: "Taxable income", value: formatCurrency(taxableIncome) },
      { label: "Income tax", value: formatCurrency(tax) },
      { label: "Health & education cess", value: formatCurrency(cess) },
      { label: "Total tax", value: formatCurrency(totalTax) },
      { label: "Effective tax rate", value: formatPercent(effectiveRate) },
    ]);
  };

  return (
    <CalculatorShell
      title="Income Tax Calculator"
      description="Estimate tax under a simplified Indian new-regime style slab structure with deductions and cess."
      actionLabel="Calculate Tax"
      onCalculate={calculate}
      results={results}
      note="This is a quick estimate using a simplified slab model, not a substitute for professional tax filing advice."
    >
      <input className="input" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="Annual gross income" />
      <input className="input" value={deductions} onChange={(e) => setDeductions(e.target.value)} placeholder="Eligible deductions" />
    </CalculatorShell>
  );
}
