"use client";

import { useState } from "react";
import CalculatorShell from "./CalculatorShell";
import { calculateMonthlyEmi, formatCurrency, parseNumber } from "./calculatorUtils";

export default function LoanEMIBreakdownCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [results, setResults] = useState<{ label: string; value: string }[]>([]);

  const calculate = () => {
    const P = parseNumber(principal);
    const annualRate = parseNumber(rate);
    const tenureYears = parseNumber(years);

    if ([P, annualRate, tenureYears].some(Number.isNaN) || P <= 0 || tenureYears <= 0) {
      setResults([]);
      return;
    }

    const months = tenureYears * 12;
    const emi = calculateMonthlyEmi(P, annualRate, months);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - P;
    const firstMonthInterest = P * (annualRate / 12 / 100);
    const firstMonthPrincipal = emi - firstMonthInterest;

    setResults([
      { label: "Monthly EMI", value: formatCurrency(emi) },
      { label: "Total interest", value: formatCurrency(totalInterest) },
      { label: "Total payment", value: formatCurrency(totalPayment) },
      { label: "First EMI interest", value: formatCurrency(firstMonthInterest) },
      { label: "First EMI principal", value: formatCurrency(firstMonthPrincipal) },
    ]);
  };

  return (
    <CalculatorShell
      title="Loan EMI Breakdown Calculator"
      description="See the monthly EMI plus total repayment, total interest, and a simple principal-versus-interest breakdown."
      actionLabel="Calculate Breakdown"
      onCalculate={calculate}
      results={results}
      note="This gives a detailed EMI summary for the loan, including the first-month split between principal and interest."
    >
      <input className="input" value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder="Loan amount" />
      <input className="input" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="Interest rate (%)" />
      <input className="input" value={years} onChange={(e) => setYears(e.target.value)} placeholder="Tenure (years)" />
    </CalculatorShell>
  );
}
