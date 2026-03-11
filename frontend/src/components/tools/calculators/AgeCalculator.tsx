"use client";
import { useState } from "react";

export default function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [age, setAge] = useState<number | null>(null);

  const calculate = () => {
    const birthDate = new Date(dob);
    const today = new Date();

    if (!dob) return;

    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }

    setAge(calculatedAge);
  };

  return (
    <div className="calculator-card">
      <h1 className="calculator-title">Age Calculator</h1>

      <input
        type="date"
        className="input"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
      />

      <button className="btn" onClick={calculate}>
        Calculate Age
      </button>

      {age !== null && (
        <div className="result-box">
          Age: {age} years
        </div>
      )}
    </div>
  );
}