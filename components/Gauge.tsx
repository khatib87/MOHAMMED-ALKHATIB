import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface GaugeProps {
  actual: number;
  target: number;
  unit: string;
  darkMode?: boolean;
}

const Gauge: React.FC<GaugeProps> = ({ actual, target, unit, darkMode = false }) => {
  // Prevent division by zero and clamp percentage between 0 and 100 for the chart
  const percentage = target === 0 ? 0 : Math.min(100, Math.max(0, (actual / target) * 100));
  
  // Color Logic
  let color = '#22c55e'; // Green
  if (percentage < 50) color = '#ef4444'; // Red
  else if (percentage < 75) color = '#eab308'; // Yellow

  // Data for the half-donut
  const data = [
    { name: 'Score', value: percentage },
    { name: 'Remainder', value: 100 - percentage },
  ];

  const settings = {
    startAngle: 180,
    endAngle: 0,
    innerRadius: '60%',
    outerRadius: '100%',
  };

  // Formatter to limit decimals and add commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="75%" // Shift down for half-circle effect
            startAngle={settings.startAngle}
            endAngle={settings.endAngle}
            innerRadius={settings.innerRadius}
            outerRadius={settings.outerRadius}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell key="cell-0" fill={color} />
            <Cell 
                key="cell-1" 
                fill={darkMode ? 'rgba(255,255,255,0.1)' : '#f1f5f9'} 
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      {/* Central Label */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end h-full pb-0 pointer-events-none">
        <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
          {percentage.toFixed(0)}%
        </span>
        <span className={`text-xs uppercase font-semibold tracking-wider mt-1 ${darkMode ? 'text-indigo-200' : 'text-slate-500'}`}>
           {formatNumber(actual)} / {formatNumber(target)} {unit}
        </span>
      </div>
    </div>
  );
};

export default Gauge;