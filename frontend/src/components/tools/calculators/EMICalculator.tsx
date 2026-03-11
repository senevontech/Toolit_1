"use client";
import { useState } from "react";

export default function EMICalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [emi, setEmi] = useState<number | null>(null);

  const calculate = () => {
    const P = parseFloat(principal);
    const R = parseFloat(rate) / 12 / 100;
    const N = parseFloat(tenure) * 12;

    if (isNaN(P) || isNaN(R) || isNaN(N)) return;

    const emiValue =
      (P * R * Math.pow(1 + R, N)) /
      (Math.pow(1 + R, N) - 1);

    setEmi(emiValue);
  };

  return (
    <div className="calculator-card">
      <h1 className="calculator-title">EMI Calculator</h1>

      <input
        className="input"
        placeholder="Loan Amount"
        value={principal}
        onChange={(e) => setPrincipal(e.target.value)}
      />

      <input
        className="input"
        placeholder="Interest Rate (%)"
        value={rate}
        onChange={(e) => setRate(e.target.value)}
      />

      <input
        className="input"
        placeholder="Tenure (years)"
        value={tenure}
        onChange={(e) => setTenure(e.target.value)}
      />

      <button className="btn" onClick={calculate}>
        Calculate EMI
      </button>

      {emi !== null && (
        <div className="result-box">
          Monthly EMI: ₹{emi.toFixed(2)}
        </div>
      )}
    </div>
  );
}