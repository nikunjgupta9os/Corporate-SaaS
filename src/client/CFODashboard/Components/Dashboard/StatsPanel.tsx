import { useState, useEffect } from "react";
import axios from "axios";
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


// --- Mock Data ---
const statsData: StatCardType[] = [
  { 
    id: '1', 
    title: "Hedging Effectiveness Ratio", 
    value: "87.3%", 
    icon: "📊", 
    change: { week: "-0.5%", month: "+2.1%", year: "+11.4%" }, 
    bgColor: "bg-gradient-to-tr from-[#1299909E] to-[#129990]" 
  },
  { 
    id: '2', 
    title: "Total Hedged Exposure", 
    value: "$1.2301M", 
    icon: "🏦", 
    change: { week: "+2.1%", month: "+7.9%", year: "+15.5%" }, 
    bgColor: "bg-gradient-to-r from-[#65b67cf7] to-green-700"  
  },
  { 
    id: '3', 
    title: "Total Unhedged Exposure", 
    value: "$0M", 
    icon: "🔥", 
    change: { week: "-1.2%", month: "+5.0%", year: "+8.7%" }, 
    bgColor: "bg-gradient-to-br from-[#0d6d69CC] to-[#0a5755B3]" 
  },
  { 
    id: '4', 
    title: "Mark-to-Market P&L", 
    value: "$3.1M", 
    icon: "💰", 
    change: { week: "+$0.3M", month: "+$1.2M", year: "+$10.2M" }, 
    bgColor: "bg-gradient-to-b from-teal-500 to-teal-600" 
  },
  { 
    id: '5', 
    title: "Cost of Premium Paid (YTD)", 
    value: "$1.47M", 
    icon: "💸", 
    change: { week: "+2.5%", month: "+6.3%", year: "+20.1%" }, 
    bgColor: "bg-gradient-to-bl from-green-400 to-green-700" 
  },
  { 
    id: '6', 
    title: "Cost of Bank Margin (YTD)", 
    value: "$0.25M", 
    icon: "🛍️", 
    change: { week: "+0.01%", month: "+1.5%", year: "+5.6%" }, 
    bgColor: "bg-gradient-to-l from-[#429d5c] to-[#68ba7fe9]" 
  },
  { 
    id: '7', 
    title: "Overall Hedge Ratio", 
    value: "85%", 
    icon: "📄", 
    change: { week: "90%", month: "78%", year: "71%" }, 
    bgColor: "bg-gradient-to-tl from-[#4dc9bf] to-[#073f40CC]" 
  },
];

// --- StatCard Component ---
interface StatCardProps {
  data: StatCardType;
  selectedFrame?: TimeFrame;
  onTimeFrameChange?: (frame: TimeFrame) => void;
}

const StatCard = ({ data }: StatCardProps) => {

  return (
    <div
      className={`
        ${data.bgColor}
        text-secondary-color rounded-2xl shadow-md p-4 w-full relative
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
            <h2 className="font-medium text-white">{data.title}</h2>
            <span className="text-xl text-white">{data.value}</span>
          </div>
          {/* <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl border border-white/30 shadow-md flex items-center justify-center text-white text-2xl">
            {data.icon}
          </div> */}
        </div>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-start mt-10 gap-2">
            <div>
        
            </div>
          </div>
          <div className="flex items-start mt-10">
           
          </div>
        </div>
      </div>
    </div>
  );
};

// --- StatsPanel Component ---
const StatsPanel = () => {
  const [selectedFrame, setSelectedFrame] = useState<TimeFrame>("month");

  // Store dynamic unhedged exposure
  const [unhedgedExposure, setUnhedgedExposure] = useState<string>("$0M");

  useEffect(() => {
    const fetchUnhedgedExposure = async () => {
      try {
        const res = await axios.get("https://backend-5n7t.onrender.com/api/exposureUpload/USDsum");

        // Assume response structure is: { value: number } or similar
        const rawValue = res.data?.totalUsd ?? 0; // Adjust this line if structure differs
        const processed = rawValue / 1000000;
        const totalHedgedExposure = 1.2312; // in M

        const finalValue =processed- totalHedgedExposure;
        setUnhedgedExposure(`$${finalValue.toFixed(2)}M`);
      } catch (error) {
        console.error("Failed to fetch unhedged exposure:", error);
        setUnhedgedExposure("Error");
      }
    };

    fetchUnhedgedExposure();
  }, []);

  const updatedStatsData: StatCardType[] = statsData.map((stat) => {
    if (stat.title === "Total Unhedged Exposure") {
      return {
        ...stat,
        value: unhedgedExposure,
      };
    }
    return stat;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-3 w-full">
      {updatedStatsData.map((stat) => (
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
