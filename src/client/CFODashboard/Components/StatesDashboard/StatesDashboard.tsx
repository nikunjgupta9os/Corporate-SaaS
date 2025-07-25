import { CreditCard, TrendingUp, RotateCcw, Building2 } from 'lucide-react';
import React, { useEffect, useState } from "react";
import axios from "axios";

type CurrencyData = {
  currency: string;
  amount: string; // assuming backend sends plain number like 89200000
};
const FinancialDashboard = () => {
 const [payablesData, setPayablesData] = useState<CurrencyData[]>([]);
const [receivablesData, setReceivablesData] = useState<CurrencyData[]>([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const [payablesRes, receivablesRes] = await Promise.all([
        axios.get("https://backend-5n7t.onrender.com/api/exposureUpload/payables"),
        axios.get("https://backend-5n7t.onrender.com/api/exposureUpload/receivables"),
      ]);

      setPayablesData(payablesRes.data);
      setReceivablesData(receivablesRes.data);
    } catch (error) {
      console.error("Error fetching exposure data:", error);
    }
  };

  fetchData();
}, []);


  const rolloversData = [
    { label: 'Total Rollovers:', value: '15' },
    { label: 'USD Rollovers:', value: '5' },
    { label: 'EUR Rollovers:', value: '4' },
    { label: 'JPY Rollovers:', value: '3' },
    { label: 'GBP Rollovers:', value: '2' },
    { label: 'CNY Rollovers:', value: '1' },
    { label: 'AUD Rollovers:', value: '1' },
    { label: 'CAD Rollovers:', value: '1' },
    { label: 'CHF Rollovers:', value: '1' },
    { label: 'SGD Rollovers:', value: '1' }
  ];
const forwardsData = [
  {
    bank: 'ABC Bank',
    trades: ['Sell USD', 'Sell AUD', 'Buy CAD', 'Buy CHF', 'Buy CNY', 'Buy EUR', 'Sell EUR', 'Buy GBP'],
    amounts: ['$25,000', '$70,000', '$75,000', '$15,000', '$80,000', '$100,000', '$50,000', '$20,000']
  },
  {
    bank: 'QRS Bank',
    trades: ['Sell EUR', 'Sell JPY', 'Buy EUR'],
    amounts: ['$150,000', '$1,000,000', '$100,000']
  },
  {
    bank: 'ZAB Capital',
    trades: ['Buy EUR', 'Buy USD', 'Sell SEK', 'Sell USD'],
    amounts: ['$100,000', '$240,000', '$250,000', '$260,000']
  }
];


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Total Payables Card - Enhanced with Scroll */}
      <div className="bg-gradient-to-br from-[#bdf6e1] to-[#90cbb5] border border-primary-lt rounded-xl p-4 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden max-h-[400px] flex flex-col">
        {/* Complex Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="payables-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="#3b82f6" fillOpacity="0.3" />
                <circle cx="40" cy="20" r="1" fill="#3b82f6" fillOpacity="0.3" />
                <circle cx="20" cy="40" r="1" fill="#3b82f6" fillOpacity="0.3" />
                <circle cx="40" cy="40" r="1" fill="#3b82f6" fillOpacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#payables-pattern)" />
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-10 h-10 bg-primary-xl rounded-xl flex items-center justify-center group-hover:bg-primary-lg transition-colors shadow-inner">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="text-secondary-text-dark text-sm font-medium">Total Payables</span>
              <div className="text-xs text-primary">Outstanding liabilities</div>
            </div>
          </div>
          <div className="text-2xl font-bold text-secondary-text-dark text-center py-2 px-4 rounded-lg">$187.4M</div>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-1">
              {payablesData.map((item, _) => (
                <div key={item.currency} className="flex justify-between items-center py-2 px-3 bg-white/70 rounded-lg hover:bg-white/50 transition-colors shadow-sm">
                  <span className="text-secondary-text-dark text-sm font-medium flex items-center">
                    <span className="w-2 h-2 bg-primary-lg rounded-full mr-2"></span>
                    {item.currency}
                  </span>
                  <span className="text-slate-800 text-sm font-semibold bg-primary-lg px-2 py-1 rounded">
                    {item.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Total Receivables Card - Enhanced with Scroll */}
      <div className="bg-gradient-to-br from-[#93DA97] to-green-600 border border-green-400 rounded-xl p-4 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden h-[400px] flex flex-col">
        {/* Diagonal Stripe Background */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="receivables-pattern" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="20" stroke="#f97316" strokeWidth="1" strokeOpacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#receivables-pattern)" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-200/20 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-10 h-10 bg-[#06923E4D] rounded-xl flex items-center justify-center group-hover:bg-[#06923E8C] transition-colors shadow-inner">
              <TrendingUp className="w-5 h-5 text-green-700" />
            </div>
            <div>
              <span className="text-slate-600 text-sm font-medium">Total Receivables</span>
              <div className="text-xs text-green-700">Expected income</div>
            </div>
          </div>
          <div className="text-2xl font-bold text-secondary-text-dark text-center py-2 px-4 rounded-lg ">$204.2M</div>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-1">
              {receivablesData.map((item, _) => (
                <div key={item.currency} className="flex justify-between items-center py-2 px-3 bg-white/70 rounded-lg hover:bg-[#b9e6cbd0] transition-colors shadow-sm">
                  <span className="text-slate-700 text-sm font-medium flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    {item.currency}
                  </span>
                  <span className="text-slate-800 text-sm font-semibold bg-green-50 px-2 py-1 rounded">
                    {item.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
{/* Bank Wise Forwards Card - Enhanced with Scroll */}
      <div className="bg-gradient-to-br from-[#A3DC9A] to-[#4A9782] border border-teal-400 rounded-xl p-4 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden h-[400px] flex flex-col">
        {/* Wave Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="forwards-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 20 Q10 10 20 20 T40 20" stroke="#8b5cf6" strokeWidth="1" strokeOpacity="0.3" fill="none" />
                <path d="M0 30 Q10 20 20 30 T40 30" stroke="#8b5cf6" strokeWidth="1" strokeOpacity="0.3" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#forwards-pattern)" />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-200/20 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center group-hover:bg-[#4A97823D] transition-colors shadow-inner">
              <Building2 className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <span className="text-slate-600 text-sm font-medium">Bank Wise Forwards</span>
              <div className="text-xs text-teal-700">Active Positions by Counterparty</div>
            </div>
          </div>
          
          {/* Scrollable Container */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-3">
              {forwardsData.map((bank, index) => (
                <div 
                  key={index} 
                  className="bg-white/30 backdrop-blur-sm border border-teal-200/50 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="text-sm font-semibold text-slate-800 mb-2 pb-1 border-b border-teal-200/30 flex items-center">
                    <div className="w-2 h-2 bg-teal-400 rounded-full mr-2"></div>
                    {bank.bank}
                  </div>
                  <div className="space-y-2">
                    {bank.trades.map((trade, tradeIndex) => (
                      <div 
                        key={tradeIndex} 
                        className="flex justify-between items-center py-1 px-2 bg-white/50 rounded hover:bg-white/70 transition-colors"
                      >
                        <span className="text-xs text-slate-700">{trade}</span>
                        <span className="text-xs font-semibold text-gray-600 bg-white/50 px-2 py-0.5 rounded">
                          {bank.amounts[tradeIndex]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


      {/* Forward Rollovers Card - Enhanced with Scroll */}
      <div className="bg-gradient-to-br from-emerald-100 to-teal-100 border border-emerald-200 rounded-xl p-4 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden h-[400px] flex flex-col">
        {/* Dot Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="rollovers-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="#10b981" fillOpacity="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#rollovers-pattern)" />
          </svg>
        </div>
        <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-200/20 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors shadow-inner">
              <RotateCcw className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <span className="text-slate-600 text-sm font-medium">Forward Rollovers</span>
              <div className="text-xs text-emerald-500">For Current Period (YTD)</div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-1">
              {rolloversData.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 px-3 bg-white/70 rounded-lg hover:bg-white transition-colors shadow-sm">
                  <span className="text-slate-700 text-sm flex items-center">
                    {index === 0 ? (
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                    ) : (
                      <span className="w-2 h-2 bg-emerald-300 rounded-full mr-2"></span>
                    )}
                    {item.label}
                  </span>
                  <span className={`text-sm font-semibold ${
                    index === 0 ? 'text-emerald-700 bg-emerald-100 text-base' : 'text-slate-800 bg-emerald-50'
                  } px-2 py-1 rounded`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default FinancialDashboard;