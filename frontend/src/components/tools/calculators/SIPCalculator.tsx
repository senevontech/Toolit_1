"use client";

import { useState } from "react";

export default function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number | "">("");
  const [rate, setRate] = useState<number | "">("");
  const [years, setYears] = useState<number | "">("");

  const calculateSIP = () => {
    if (!monthlyInvestment || !rate || !years) return 0;

    const monthlyRate = rate / 12 / 100;
    const months = years * 12;

    return (
      monthlyInvestment *
      (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
        (1 + monthlyRate))
    );
  };

  const totalInvested =
    monthlyInvestment && years
      ? monthlyInvestment * years * 12
      : 0;

  const estimatedReturns =
    calculateSIP() - totalInvested;

  const formatCurrency = (value: number) =>
    value.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });

  const showResults =
    monthlyInvestment !== "" &&
    rate !== "" &&
    years !== "";

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">
        SIP Calculator
      </h2>

      {/* Inputs */}
      <div className="bg-gray-100 p-6 rounded-xl space-y-6">
        <div>
          <label className="block font-medium">
            Monthly Investment (₹)
          </label>
          <input
            type="number"
            value={monthlyInvestment}
            onChange={(e) =>
              setMonthlyInvestment(
                e.target.value === ""
                  ? ""
                  : Number(e.target.value)
              )
            }
            className="border p-2 rounded w-full"
            placeholder="Enter monthly amount"
          />
        </div>

        <div>
          <label className="block font-medium">
            Expected Annual Return (%)
          </label>
          <input
            type="number"
            value={rate}
            onChange={(e) =>
              setRate(
                e.target.value === ""
                  ? ""
                  : Number(e.target.value)
              )
            }
            className="border p-2 rounded w-full"
            placeholder="Enter return rate"
          />
        </div>

        <div>
          <label className="block font-medium">
            Investment Duration (Years)
          </label>
          <input
            type="number"
            value={years}
            onChange={(e) =>
              setYears(
                e.target.value === ""
                  ? ""
                  : Number(e.target.value)
              )
            }
            className="border p-2 rounded w-full"
            placeholder="Enter years"
          />
        </div>
      </div>

      {/* Results (only show if filled) */}
      {showResults && (
        <div className="bg-white border rounded-xl p-6 space-y-4">
          <div>
            <p className="text-gray-600">
              Total Invested:
            </p>
            <p className="text-xl font-semibold">
              {formatCurrency(totalInvested)}
            </p>
          </div>

          <div>
            <p className="text-gray-600">
              Estimated Returns:
            </p>
            <p className="text-xl font-semibold text-green-600">
              {formatCurrency(estimatedReturns)}
            </p>
          </div>

          <div>
            <p className="text-gray-600">
              Total Value:
            </p>
            <p className="text-2xl font-bold text-orange-500">
              {formatCurrency(calculateSIP())}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}