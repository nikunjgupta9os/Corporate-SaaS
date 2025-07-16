import React from "react";

type CurrencyData = {
  code: string;
  amount: string;
  hedgeRatio?: number;
};

type BusinessUnit = {
  name: string;
  total: string;
  currencies: CurrencyData[];
};

const BusinessUnitExposureCard: React.FC = () => {
  const businessUnits: BusinessUnit[] = [
    {
      name: "Technology",
      total: "$89.3M",
      currencies: [
        { code: "USD", amount: "$52.1M", hedgeRatio: 72 },
        { code: "EUR", amount: "$24.8M", hedgeRatio: 14 },
        { code: "CNY", amount: "$12.4M" },
      ],
    },
    {
      name: "Manufacturing",
      total: "$76.8M",
      currencies: [
        { code: "USD", amount: "$28.7M" },
        { code: "EUR", amount: "$31.2M" },
        { code: "GBP", amount: "$16.9M" },
      ],
    },
    {
      name: "Healthcare",
      total: "$54.2M",
      currencies: [
        { code: "USD", amount: "$35.4M", hedgeRatio: 91 },
        { code: "EUR", amount: "$12.1M" },
        { code: "JPY", amount: "$6.7M" },
      ],
    },
    {
      name: "Energy",
      total: "$42.1M",
      currencies: [
        { code: "USD", amount: "$25.8M", hedgeRatio: 79 },
        { code: "EUR", amount: "$10.3M" },
        { code: "GBP", amount: "$6.0M" },
      ],
    },
  ];

  const getHedgeRatioColor = (ratio?: number) => {
    if (!ratio) return "bg-gray-100 text-gray-600";
    return ratio < 50 
      ? "bg-red-50 text-red-600" 
      : ratio > 75 
        ? "bg-green-50 text-green-600" 
        : "bg-yellow-50 text-yellow-600";
  };

  const getCurrencyColor = (code: string) => {
    const colors: Record<string, string> = {
      USD: "text-blue-600",
      EUR: "text-purple-600",
      GBP: "text-amber-600",
      CNY: "text-red-500",
      JPY: "text-indigo-500"
    };
    return colors[code] || "text-gray-600";
  };

  return (
    <div className="bg-white mt-10 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800">Business Unit Exposure</h3>
        <p className="text-sm text-gray-500">Net exposure and hedging status by business unit</p>
      </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {businessUnits.map((unit) => (
          <div 
            key={unit.name} 
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-gray-700">{unit.name}</h4>
              <span className="text-xl font-bold text-gray-900">{unit.total}</span>
            </div>
            
            <div className="space-y-2">
              {unit.currencies.map((currency) => (
                <div 
                  key={`${unit.name}-${currency.code}`} 
                  className="flex justify-between items-center p-2 bg-gray-50 rounded"
                >
                  <div className="flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-2 ${getCurrencyColor(currency.code)} bg-opacity-30`}></span>
                    <span className="text-sm font-medium">
                      <span className={getCurrencyColor(currency.code)}>{currency.code}</span>: {currency.amount}
                    </span>
                  </div>
                  
                  {currency.hedgeRatio && (
                    <span className={`text-xs px-2 py-1 rounded-full ${getHedgeRatioColor(currency.hedgeRatio)}`}>
                      {currency.hedgeRatio}% hedged
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Card Footer */}
      <div className="bg-gray-50 px-6 py-3 text-xs text-gray-500 border-t border-gray-100">
        Last updated: {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

export default BusinessUnitExposureCard;