import React from 'react';
import type { FinanceEntry } from '../../types/finance';

interface StatsSummaryProps {
  data: FinanceEntry[];
  selectedMetric: keyof FinanceEntry;
}

const StatsSummary: React.FC<StatsSummaryProps> = ({ data, selectedMetric }) => {
  const total = data.reduce((sum, item) => {
    const value = item[selectedMetric];
    return typeof value === 'number' ? sum + value : sum;
  }, 0);

  const avg = data.length ? total / data.length : 0;

  const max = Math.max(
    ...data.map(item => {
      const value = item[selectedMetric];
      return typeof value === 'number' ? value : 0;
    })
  );

  const growth =
    data.length > 1 &&
    typeof data[0][selectedMetric] === 'number' &&
    typeof data[data.length - 1][selectedMetric] === 'number'
      ? ((data[data.length - 1][selectedMetric] as number) - (data[0][selectedMetric] as number)) /
        (data[0][selectedMetric] as number) *
        100
      : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-6 mt-6 mx-10">
      <div className="bg-blue-200 p-4 text-black border-4 border-blue-300 rounded-3xl">
        <p>Total</p>
        <p className="text-2xl font-bold">{total.toLocaleString()}</p>
      </div>
      <div className="bg-green-200 p-4 rounded-3xl border-4 text-black border-green-300">
        <p>Average</p>
        <p className="text-2xl font-bold">{avg.toFixed(2)}</p>
      </div>
      <div className="bg-purple-200 p-4 rounded-3xl border-4 text-black border-purple-300">
        <p>Peak</p>
        <p className="text-2xl font-bold">{max.toLocaleString()}</p>
      </div>
      <div className="bg-orange-200 p-4 rounded-3xl border-4 text-black border-orange-300">
        <p>Growth</p>
        <p className="text-2xl font-bold">{growth.toFixed(2)}%</p>
      </div>
    </div>
  );
};

export default StatsSummary;
