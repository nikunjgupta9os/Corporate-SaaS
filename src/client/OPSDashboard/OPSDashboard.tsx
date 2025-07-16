// import React from "react";
import Layout from "../common/Layout";

const TreasuryCards = () => {
  const cardData1 = [
    {
      title: "Exposures Requiring Attention",
      subtitle: "(Next 7 Days)",
      value: "5",
      description: "Unhedged & Approaching Maturity",
    },
    {
      title: "Ready for Settlement",
      value: "12",
      description: "Trader Maturing Today",
    },
    {
      title: "Overall Unhedged Value",
      value: "$10.2M",
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
      value: "155",
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

  const currencyData = [
    { currency: "USD", value: 15.2, position: "Long", color: "bg-green-400" },
    { currency: "EUR", value: 8.1, position: "Short", color: "bg-red-400" },
    { currency: "JPY", value: 4.5, position: "Short", color: "bg-red-400" },
    { currency: "GBP", value: 2.8, position: "Long", color: "bg-green-400" },
    { currency: "CNY", value: 1.2, position: "Short", color: "bg-red-400" },
  ];

  // Calculate bar height based on value (each unit = 10px, minimum 20px)
  const getBarHeight = (value: number): number => {
    const baseHeight = Math.abs(value) * 10; // 10px per unit
    return Math.max(baseHeight, 20); // Minimum 20px height
  };

    const bankData = [
    { name: "JPMorgan Chase", used: 85, limit: 100, utilization: 85 },
    { name: "Goldman Sachs", used: 60, limit: 120, utilization: 50 },
    { name: "HSBC", used: 95, limit: 100, utilization: 95 },
  ];

  const alerts = [
    { 
      id: 1, 
      text: "Unhedged EUR Payables maturing in 3 days: $2.5M", 
      action: "Click to hedge", 
      completed: false 
    },
    { 
      id: 2, 
      text: "Settlement for Trade ID #FX8901 Failed", 
      action: "Review details", 
      completed: true 
    },
    { 
      id: 3, 
      text: "High slippage detected on recent USD/JPY trade", 
      action: "Investigate", 
      completed: false 
    },
  ];

  return (
    <>
      {/* Original 6 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {cardData1.map((card, index) => (
          <div
            key={`card1-${index}`}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
          >
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg mx-auto font-semibold text-gray-700 underline underline-offset-4">
                  {card.title}
                  {card.subtitle && (
                    <span className="text-sm text-gray-500 ml-1">
                      {card.subtitle}
                    </span>
                  )}
                </h2>
              </div>

              <div className="flex items-end justify-center pt-4 space-x-2">
                <p className="text-4xl font-bold text-primary">{card.value}</p>
                <p className="text-sm text-gray-500">{card.description}</p>
              </div>

              <div className="pt-4 text-end">
                <button className="text-xs text-primary-lt hover:text-primary font-medium">
                  View Details →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New 4 cards in 2x2 grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cardData2.map((card, index) => (
          <div
            key={`card2-${index}`}
            className="bg-white rounded-lg shadow-md p-10 border border-gray-200 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
          >
            <h2 className="text-lg font-semibold text-gray-700 pb-2 border-b border-gray-200 mb-4">
              {card.title}
            </h2>

            <div className="space-y-3">
              {card.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex justify-between items-center"
                >
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 transition-all duration-300 hover:shadow-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
            Top 5 Currency Net Positions
            </h2>

            <div className="flex items-end justify-between h-48 mt-4">
            {currencyData.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                <div
                    className={`mb-2 text-xs font-semibold ${
                    item.value > 0 ? "text-green-600" : "text-red-600"
                    }`}
                >
                    {item.value > 0 ? "+" : ""}
                    {item.value}M
                </div>
                <div className="relative w-full flex justify-center">
                    <div
                    className={`w-12 ${item.color} rounded-t-md transition-all duration-700 ease-out relative flex items-center justify-center`}
                    style={{
                        height: `${getBarHeight(item.value)}px`,
                    }}
                    >
                    <div className="text-xs font-semibold text-white">
                        {item.position}
                    </div>
                    </div>
                </div>
                <div className="mt-2 text-sm font-medium text-gray-700">
                    {item.currency}
                </div>
                </div>
            ))}
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all">
            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200 flex items-center">
            <span className="bg-blue-100 text-blue-800 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4z" clipRule="evenodd" />
                </svg>
            </span>
            Bank Limits Utilization
            </h2>
            
            <div className="space-y-5">
            {bankData.map((bank, index) => (
                <div key={index} className="group">
                <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-700">{bank.name}</span>
                    <span className="text-sm text-gray-600">
                    ${bank.used}M / ${bank.limit}M
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                    className={`h-2.5 rounded-full transition-all duration-500 
                        ${bank.utilization > 90 ? 'bg-red-500' : 
                        bank.utilization > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${bank.utilization}%` }}
                    ></div>
                </div>
                <div className="text-right text-xs mt-1 text-gray-500">
                    {bank.utilization}% utilized
                </div>
                </div>
            ))}
            </div>
        </div>
    </div>
    </>
  );
};

function OPSDashboard() {
  return (
    <Layout title="Operations Dashboard">
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Operations Dashboard
        </h1>
        <TreasuryCards />
      </div>
    </Layout>
  );
}

export default OPSDashboard;
