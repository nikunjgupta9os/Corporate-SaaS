import { Globe } from 'lucide-react';

const CurrencyExposure = () => {
  const currencyData = [
    {
      currency: 'USD',
      exposure: '$36.6M',
    },
    {
      currency: 'EUR',
      exposure: '-$11.6M',
    },
    {
      currency: 'GBP',
      exposure: '-$6.6M',
    },
    {
      currency: 'JPY',
      exposure: '-$1.6M',
    },
    // {
    //   currency: 'GBP',
    //   exposure: '-$6.6M',
    // },
    // {
    //   currency: 'JPY',
    //   exposure: '-$1.6M',
    // }
  ];

  return (
    <div 
    className="max-w-[365px] h-full max-h-[564px] bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-4 text-white relative overflow-hidden
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
          <div className="w-8 h-8 bg-emerald-500/20 backdrop-blur-md rounded-lg border border-emerald-400/30 shadow-md flex items-center justify-center">
            <Globe className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Currency Exposure</h2>
            <p className="text-slate-300 text-xs">Net exposure & hedging</p>
          </div>
        </div>

        {/* Currency List */}
        <div className="max-h-[366px] overflow-y-auto">
          <div 
          className="space-y-3">
            {currencyData.map((currency, index) => (
              <div key={currency.currency} className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                {/* Currency Header */}
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white">{currency.currency}</span>
                  </div>
                  <span className={`text-sm font-semibold ${
                    currency.exposure.startsWith('-') ? 'text-red-400' : 'text-emerald-400'
                  }`}>
                    {currency.exposure}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-1.5">
                  <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
        {/* Summary Footer */}
        <div>
          <div className="mt-5 p-3 items-end bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300">Total Net Exposure</span>
              <span className="text-white font-medium">$17.4M</span>
            </div>
            <div className="flex justify-between items-center text-xs mt-1">
              <span className="text-slate-300">Avg Hedge Ratio</span>
              <span className="text-white font-medium">67.75%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyExposure;