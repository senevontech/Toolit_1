"use client";
import { useState } from "react";

export default function GSTCalculator() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const amt = parseFloat(amount);
    const gst = parseFloat(rate);
    if (isNaN(amt) || isNaN(gst)) return;

    const total = amt + (amt * gst) / 100;
    setResult(total);
  };

  return (
    <div className="calculator-card">
      <h1 className="calculator-title">GST Calculator</h1>

      <input
        className="input"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        className="input"
        placeholder="GST %"
        value={rate}
        onChange={(e) => setRate(e.target.value)}
      />

      <button className="btn" onClick={calculate}>
        Calculate
      </button>

      {result !== null && (
        <div className="result-box">
          Total Amount: ₹{result.toFixed(2)}
        </div>
      )}
    </div>
  );
}