import React from "react";
import { Calendar, Clock } from "lucide-react";

const ForwardMaturityAnalysisCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Calendar className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Forward Maturity Analysis</h3>
          <p className="text-sm text-gray-500">Upcoming Settlements and Exposures</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8 h-96">
        {[
          {
            label: "Next 30 Days",
            amount: "$78.4M",
            contracts: "24 Contracts",
            from: "blue-50",
            to: "blue-100",
            border: "blue-200",
            text: "blue-700",
            icon: "text-blue-600",
          },
          {
            label: "31-90 Days",
            amount: "$124.7M",
            contracts: "38 Contracts",
            from: "purple-50",
            to: "purple-100",
            border: "purple-200",
            text: "purple-700",
            icon: "text-purple-600",
          },
          {
            label: "91-180 Days",
            amount: "$89.2M",
            contracts: "29 Contracts",
            from: "emerald-50",
            to: "emerald-100",
            border: "emerald-200",
            text: "emerald-700",
            icon: "text-emerald-600",
          },
          {
            label: "180+ Days",
            amount: "$52.1M",
            contracts: "16 Contracts",
            from: "amber-50",
            to: "amber-100",
            border: "amber-200",
            text: "amber-700",
            icon: "text-amber-600",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-br from-${item.from} to-${item.to} p-6 rounded-xl border border-${item.border} flex flex-col justify-center min-h-[180px]`}
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock className={`w-5 h-5 ${item.icon}`} />
              <h4 className={`text-base font-medium ${item.text}`}>{item.label}</h4>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{item.amount}</p>
            <p className="text-sm text-gray-600">{item.contracts}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForwardMaturityAnalysisCard;
