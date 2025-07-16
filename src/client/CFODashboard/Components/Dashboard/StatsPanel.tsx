import { useState } from "react";

// --- Types ---
type TimeFrame = "week" | "month" | "year";
type StatCardType = {
  id: string;
  title: string;
  value: string;
  icon: React.ReactNode | string;
  change: Record<TimeFrame, string> | string;
  bgColor: string;
};

// --- Constants ---
const TIME_FRAMES: TimeFrame[] = ["week", "month", "year"];

// --- Mock Data ---
const statsData: StatCardType[] = [
  { 
    id: '1', 
    title: "Hedging Effectiveness Ratio", 
    value: "87.3%", 
    icon: "📊", 
    change: { week: "-0.5%", month: "+2.1%", year: "+11.4%" }, 
    bgColor: "bg-gradient-to-br from-blue-400 to-blue-600" 
  },
  { 
    id: '2', 
    title: "Total Hedged Exposure", 
    value: "$1.2301M", 
    icon: "🏦", 
    change: { week: "+2.1%", month: "+7.9%", year: "+15.5%" }, 
    bgColor: "bg-gradient-to-br from-purple-500 via-purple-800 to-purple-900"  
  },
  { 
    id: '3', 
    title: "Total Unhedged Exposure", 
    value: "$0M", 
    icon: "🔥", 
    change: { week: "-1.2%", month: "+5.0%", year: "+8.7%" }, 
    bgColor: "bg-gradient-to-tr from-orange-500 to-yellow-400" 
  },
  { 
    id: '4', 
    title: "Mark-to-Market P&L", 
    value: "$3.1M", 
    icon: "💰", 
    change: { week: "+$0.3M", month: "+$1.2M", year: "+$10.2M" }, 
    bgColor: "bg-gradient-to-tl from-teal-500 to-teal-600" 
  },
  { 
    id: '5', 
    title: "Cost of Premium Paid (YTD)", 
    value: "$1.47M", 
    icon: "💸", 
    change: { week: "+2.5%", month: "+6.3%", year: "+20.1%" }, 
    bgColor: "bg-gradient-to-br from-green-400 to-green-700" 
  },
  { 
    id: '6', 
    title: "Cost of Bank Margin (YTD)", 
    value: "$0.25M", 
    icon: "🛍️", 
    change: { week: "+0.01%", month: "+1.5%", year: "+5.6%" }, 
    bgColor: "bg-gradient-to-tr from-pink-400 to-rose-500" 
  },
  { 
    id: '7', 
    title: "Overall Hedge Ratio", 
    value: "85%", 
    icon: "📄", 
    change: { week: "90%", month: "78%", year: "71%" }, 
    bgColor: "bg-gradient-to-tr from-[#F2C078] to-[#FF7D29]" 
  },
];

// --- StatCard Component ---
interface StatCardProps {
  data: StatCardType;
  selectedFrame?: TimeFrame;
  onTimeFrameChange?: (frame: TimeFrame) => void;
}

const StatCard = ({ data, selectedFrame, onTimeFrameChange }: StatCardProps) => {
  const hasTimeFrames = typeof data.change === "object" && data.change !== null;
  const changeValue =
    hasTimeFrames && selectedFrame
      ? (data.change as Record<TimeFrame, string>)[selectedFrame]
      : data.change;

  return (
    <div
      className={`
        ${data.bgColor}
        text-white rounded-2xl shadow-md p-4 w-full relative
        transition-transform duration-200
        hover:scale-100 hover:shadow-xl
        active:scale-95 active:shadow-md
        cursor-pointer
      `}
    >
      {/* Decorative SVG */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg className="w-full h-full" width="100%" height="100%">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFFFFF" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>
      {/* Card Content */}
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-2">
          <div className="flex flex-col items-start">
            <h2 className="font-medium">{data.title}</h2>
            <span className="text-xl">{data.value}</span>
          </div>
          <div className="w-12 h-12 bg-gray-600/60 backdrop-blur-md rounded-xl border border-white/30 shadow-md flex items-center justify-center text-white text-2xl">
            {data.icon}
          </div>
        </div>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-start mt-10 gap-2">
            <div>
              {/* {typeof changeValue === "string" && (
                <span className="w-12 h-12 bg-gray-600/60 backdrop-blur-md border border-white/30 shadow-md text-white py-1 px-3 rounded-lg">
                  {changeValue}
                </span>
              )} */}
            </div>
          </div>
          <div className="flex items-start mt-10">
            {/* {hasTimeFrames && selectedFrame && onTimeFrameChange && (
              <select
                value={selectedFrame}
                onChange={(e) => onTimeFrameChange(e.target.value as TimeFrame)}
                className="text-sm bg-white/10 backdrop-blur-md border border-white/30 shadow-md px-2 py-0.5 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-white/50"
              >
                {TIME_FRAMES.map((frame) => (
                  <option key={frame} value={frame} className="bg-gray-400/30 text-black border">
                    {frame.charAt(0).toUpperCase() + frame.slice(1)}
                  </option>
                ))}
              </select>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- StatsPanel Component ---
const StatsPanel = () => {
  // State for selected time frame (shared across all cards)
  const [selectedFrame, setSelectedFrame] = useState<TimeFrame>("month");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-2 py-4 mr-3">
      {statsData.map((stat) => (
        <StatCard
          key={stat.id}
          data={stat}
          selectedFrame={typeof stat.change === "object" ? selectedFrame : undefined}
          onTimeFrameChange={typeof stat.change === "object" ? setSelectedFrame : undefined}
        />
      ))}
    </div>
  );
};

export default StatsPanel;