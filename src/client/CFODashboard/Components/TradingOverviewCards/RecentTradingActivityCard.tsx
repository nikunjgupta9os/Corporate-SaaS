import React from "react";
import { TrendingUp, DollarSign, Building2 } from "lucide-react";

const RecentTradingActivityCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Trading Activity</h3>
          <p className="text-sm text-gray-500">Last 7 Days Summary</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Stats - Left Side */}
        <div className="flex-1">
          <div className="space-y-4">
            {/* Top Row - Two cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: "Total Trades",
                  value: "150",
                  icon: <span className="text-xs font-bold text-slate-700">T</span>,
                },
                {
                  label: "Total Volume",
                  value: "$312.8M",
                  icon: <DollarSign className="w-4 h-4 text-slate-600" />,
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-xl border border-primary-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-primary-lg border border-primary-lt rounded-full flex items-center justify-center">
                      {stat.icon}
                    </div>
                    <p className="text-xs text-slate-600 font-medium">{stat.label}</p>
                  </div>
                  <p className="text-xl font-bold text-primary">{stat.value}</p>
                </div>
              ))}
            </div>
            
            {/* Bottom Row - Centered card */}
            <div className="flex justify-center">
              <div className="w-1/2">
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-xl border border-primary-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-primary-lg border border-primary-lt rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-slate-700">A</span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">Avg Trade Size</p>
                  </div>
                  <p className="text-xl font-bold text-primary">$6.7M</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Trades - Right Side */}
        <div className="flex-1 relative -top-6">
          <div className="space-y-3">
            {[
              {
                pair: "USD/EUR Forward",
                bank: "ABC Bank",
                amount: "$25.4M",
                from: "blue-50",
                to: "blue-100",
                border: "blue-200",
                text: "text-blue-800",
                subtext: "text-blue-600",
                iconBg: "bg-blue-200",
                iconColor: "text-blue-700",
              },
              {
                pair: "GBP/USD Spot",
                bank: "QRS Bank",
                amount: "$18.7M",
                from: "purple-50",
                to: "purple-100",
                border: "purple-200",
                text: "text-purple-800",
                subtext: "text-purple-600",
                iconBg: "bg-purple-200",
                iconColor: "text-purple-700",
              },
              {
                pair: "JPY/USD Forward",
                bank: "ZAB Capital",
                amount: "$31.2M",
                from: "emerald-50",
                to: "emerald-100",
                border: "emerald-200",
                text: "text-emerald-800",
                subtext: "text-emerald-600",
                iconBg: "bg-emerald-200",
                iconColor: "text-emerald-700",
              },
            ].map((trade, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-4 bg-gradient-to-r from-${trade.from} to-${trade.to} rounded-xl border border-${trade.border} hover:from-${trade.to} hover:to-${trade.to}-150 transition-colors`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${trade.iconBg} rounded-full flex items-center justify-center`}>
                    <Building2 className={`w-4 h-4 ${trade.iconColor}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${trade.text}`}>{trade.pair}</p>
                    <p className={`text-xs ${trade.subtext}`}>{trade.bank}</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-[#393e46e7]">{trade.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentTradingActivityCard;
