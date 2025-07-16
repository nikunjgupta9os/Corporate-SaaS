import React, { useEffect, useState } from "react";
import Layout from "../common/Layout";
import axios from "axios";


// const [currencyData, setCurrencyData] = useState<
//   { currency: string; value: number; color: string }[]
// >([]);
// const [loading, setLoading] = useState(true);
// const [error, setError] = useState("");

const TreasuryCards = () => {
  const [unhedgedData, setUnhedgedData] = useState<number | null>(null);

  const cardData1 = [
    {
      title: "Exposures Requiring Attention",
      subtitle: "(Next 7 Days)",
      value: "5",
      description: "Unhedged & Approaching Maturity",
    },
    {
      title: "Ready for Settlement",
      value: "2",
      description: "Trades Maturing Today",
    },
    {
  title: "Overall Unhedged Value",
  value: unhedgedData !== null ? `$${unhedgedData.toFixed(2)}M` : "Loading...",
  description: "Potential Spot Exposure",
},
    {
      title: "Pending Settlements",
      subtitle: "(Today)",
      value: "3",
      description: "Awaiting Confirmation",
    },
    {
      title: "Daily Traded Volume",
      value: "$85.5M",
      description: "YTD Avg $78.1M",
    },
    {
      title: "Number of Active Forwards",
      value: "24",
      description: "Avg force 60 days",
    },
  ];

  const cardData2 = [
    {
      title: "Upcoming Exposure Maturities",
      items: [
        { label: "Next 7 Days", value: "$18.5M", subvalue: "(3 Unhedged)" },
        { label: "Next 30 Days", value: "$45.0M", subvalue: "(5 Unhedged)" },
        { label: "Total Upcoming", value: "$63.5M" },
      ],
    },
    {
      title: "Trades Maturing Soon",
      items: [
        { label: "Today", value: "USD/EUR $15M", subvalue: "(Pending)" },
        { label: "Tomorrow", value: "GBP/USD $8M", subvalue: "(Confirmed)" },
        { label: "Next Week", value: "JPY/USD $22M", subvalue: "(Issues)" },
      ],
    },
    {
      title: "Settlement Performance (Daily)",
      items: [
        { label: "Confirmed Settlements", value: "10" },
        { label: "Pending Settlements", value: "3" },
        { label: "Failed Settlements (24h)", value: "1" },
        { label: "Auto-Reconciled", value: "95%" },
      ],
    },
    {
      title: "Recent Hedge Effectiveness",
      items: [
        { label: "Avg. Slippage (Last 24h)", value: "-0.0003" },
        { label: "Hedge Success Rate", value: "92%" },
        { label: "Unrealized P&L (Hedging)", value: "+$0.15M" },
      ],
    },
  ];

  const [currencyData, setCurrencyData] = useState<
    { currency: string; value: number; color: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // const [unhedgedData, setUnhedgedData] = useState<number | null>(null);


  useEffect(() => {
  const fetchCurrencyData = async () => {
    try {
      const response = await axios.get(
        "https://backend-5n7t.onrender.com/api/exposureUpload/top-currencies"
      );
      const mapped = response.data.map((item) => ({
        currency: item.currency,
        value: item.value / 10000, // Convert to millions
        color: item.value >= 0 ? "bg-green-500" : "bg-red-500",
      }));
      setCurrencyData(mapped);
    } catch (err) {
      setError("Failed to load currency data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnhedgedData = async () => {
    try {
      const response = await axios.get(
        "https://backend-5n7t.onrender.com/api/exposureUpload/USDsum"
      );
      let usdValue = response.data.totalUsd;
      usdValue = usdValue / 1000000;
      usdValue= usdValue-1.2301 // Convert to millions
      setUnhedgedData(usdValue);
    } catch (err) {
      // setError("Failed to load unhedged data.");
      console.error(err);
    }
  };

  fetchCurrencyData();
  fetchUnhedgedData(); // ⬅ Call this too
}, []);

  const formatToMillions = (value: number): string => {
    return `${value >= 0 ? "+" : ""}${Math.abs(value).toFixed(1)}M`;
  };

  // Calculate maximum absolute value for normalization
  const maxValue = Math.max(
    ...currencyData.map((item) => Math.abs(item.value)),
    1 // Ensure we don't divide by zero
  );

  return (
    <>
      {/* Section 1: Primary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {cardData1.map((card, index) => (
          <div
            key={`card1-${index}`}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200 transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg"
          >
            <div className="flex flex-col space-y-2">
              <h2 className="text-lg mx-auto font-semibold text-gray-700 underline underline-offset-4">
                {card.title}
                {card.subtitle && (
                  <span className="text-sm text-gray-500 ml-1">
                    {card.subtitle}
                  </span>
                )}
              </h2>
              <div className="flex items-end justify-center pt-4 space-x-2">
                <p className="text-4xl font-bold text-primary">{card.value}</p>
                <p className="text-sm text-gray-500">{card.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Section 2: Grid Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cardData2.map((card, index) => (
          <div
            key={`card2-${index}`}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200 transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg"
          >
            <h2 className="text-lg font-semibold text-gray-700 pb-2 border-b mb-4">
              {card.title}
            </h2>
            <div className="space-y-3">
              {card.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <div className="text-right">
                    <span className="font-medium text-gray-800">
                      {item.value}
                    </span>
                    {item.subvalue && (
                      <span className="text-xs text-gray-500 ml-1">
                        {item.subvalue}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

     {/* Section 3: Compact Currency Net Positions */}
<div className="mt-6 w-1/2">
  <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
    <h2 className="text-lg font-semibold text-gray-800 mb-4">
      Top {currencyData.length} Currency Net Positions (in millions)
    </h2>

    {loading ? (
      <p className="text-center text-gray-500 py-2">Loading...</p>
    ) : error ? (
      <p className="text-center text-red-500 py-2">{error}</p>
    ) : (
      <div className="flex items-end justify-center gap-4 h-24 px-4">
        {currencyData.map((item, index) => {
          const heightPercentage = (Math.abs(item.value) / maxValue) * 70; // Adjusted to reduce bar height
          return (
            <div key={index} className="flex flex-col items-center w-12">
              <div
                className={`w-6 ${item.color} rounded-t-sm transition-all duration-300`}
                style={{ height: `${heightPercentage}px` }}
              ></div>
              <div className="mt-1 text-xs font-medium text-gray-700 truncate w-full text-center">
                {item.currency}
              </div>
              <div
                className={`text-[10px] mt-1 font-medium ${
                  item.value >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatToMillions(item.value)}
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
</div>

      {/* </div> */}
    </>
  );
};

const OPSDashboard = () => {
  return (
    <Layout title="Operations Dashboard">
      <div className="p-6 bg-gray-50 min-h-screen">
        <TreasuryCards />
      </div>
    </Layout>
  );
};

export default OPSDashboard;