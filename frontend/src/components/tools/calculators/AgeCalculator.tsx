"use client";
import { useState } from "react";

type Age = {
  years: number;
  months: number;
  days: number;
};

export default function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [age, setAge] = useState<Age | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    if (!dob) {
      setError("Please select a date");
      setAge(null);
      return;
    }

    const birthDate = new Date(dob);
    const today = new Date();

    if (birthDate > today) {
      setError("Date of birth cannot be in the future");
      setAge(null);
      return;
    }

    setError("");

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    // Adjust days
    if (days < 0) {
      const prevMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        0
      ).getDate();
      days += prevMonth;
      months--;
    }

    // Adjust months
    if (months < 0) {
      months += 12;
      years--;
    }

    setAge({ years, months, days });
  };

  return (
    <div className="calculator-card">
      <h1 className="calculator-title">Age Calculator</h1>

      <input
        type="date"
        className="input"
        value={dob}
        onChange={(e) => {
          setDob(e.target.value);
          setAge(null);
          setError("");
        }}
      />

      <button className="btn" onClick={calculate}>
        Calculate Age
      </button>

      {error && <div className="error-text">{error}</div>}

      {age && (
        <div className="result-box">
          <p><strong>{age.years}</strong> Years</p>
          <p><strong>{age.months}</strong> Months</p>
          <p><strong>{age.days}</strong> Days</p>
        </div>
      )}
    </div>
  );
}