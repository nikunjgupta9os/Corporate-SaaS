import { Globe } from 'lucide-react';
import axios from "axios";
import React, { useState, useEffect } from "react";

interface CurrencyExposure {
  currency: string;
  amount: number;
}
const CurrencyExposure = () => {
   const [currencyData, setCurrencyData] = useState<CurrencyExposure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCurrencyData = async () => {
      try {
        const res = await axios.get(
          "https://backend-5n7t.onrender.com/api/exposureUpload/getpoAmountByCurrency"
        );

        // ✅ Assume response like:
        // [ { currency: "USD", exposure: 36600000 }, { currency: "EUR", exposure: -11600000 } ]
        const formatted = res.data.map((item: any) => ({
          currency: item.currency,
          amount: item.amount,
        }));

        setCurrencyData(formatted);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch currency exposure:", err);
        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchCurrencyData();
  }, []);
  return (
    <div 
    className="w-full h-full bg-gradient-to-br from-[#129990E6] to-teal-500 rounded-xl shadow-lg p-4 text-white relative overflow-hidden
      transition duration-200 ease-in-out
      hover:shadow-lg hover:scale-[1.02] hover:bg-opacity-90">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <svg
          className="w-full h-full"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="currency-grid-pattern"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#ffffff"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#currency-grid-pattern)" />
        </svg>
      </div>

      {/* Content */}
      <div 
      className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-white/40 backdrop-blur-md rounded-lg border border-emerald-400/30 shadow-md flex items-center justify-center">
            <Globe className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Currency Exposure</h2>
            <p className="text-secondary-color text-xs">Net exposure & Hedging</p>
          </div>
        </div>

        {/* Currency List */}
        <div className="max-h-[366px] overflow-y-auto">
          <div 
          className="space-y-3">
            {currencyData.map((currency, _) => (
              <div key={currency.currency} className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                {/* Currency Header */}
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white">{currency.currency}</span>
                  </div>
                  <span className={`text-sm font-semibold ${
                    currency.amount<0 ? 'text-gray-50' : 'text-white'
                  }`}>
                    {currency.amount}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-1.5">
                  <div className="w-full bg-white/50 rounded-full h-1.5 overflow-hidden">
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
        {/* Summary Footer */}
        <div>
          <div className="mt-5 p-3 items-end bg-white/30 backdrop-blur-sm rounded-lg border border-white/10">
            <div className="flex justify-between items-center text-xs">
              <span className="text-secondary-color">Total Net Exposure</span>
              <span className="text-white font-medium">$17.4M</span>
            </div>
            <div className="flex justify-between items-center text-xs mt-1">
              <span className="text-secondary-color">Avg Hedge Ratio</span>
              <span className="text-white font-medium">67.75%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyExposure;