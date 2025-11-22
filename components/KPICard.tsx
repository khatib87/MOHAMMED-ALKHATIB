import React from 'react';
import { KPI } from '../types';
import Gauge from './Gauge';

interface KPICardProps {
  kpi: KPI;
}

const KPICard: React.FC<KPICardProps> = ({ kpi }) => {
  const difference = kpi.actual - kpi.target;
  const isPositive = difference >= 0;
  
  // Format helper to ensure consistency with Gauge
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow duration-300 flex flex-col">
      <div className="mb-4">
        <div className="flex justify-between items-start mb-2">
           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
             {kpi.category}
           </span>
        </div>
        <h3 className="text-lg font-semibold text-slate-800 truncate" title={kpi.name}>
          {kpi.name}
        </h3>
        <p className="text-sm text-slate-500 mt-1 line-clamp-2 h-10">
          {kpi.description}
        </p>
      </div>
      
      <div className="flex-grow flex items-center justify-center mb-2 h-40">
        <Gauge actual={kpi.actual} target={kpi.target} unit={kpi.unit} />
      </div>

      {/* Variance / Note Section */}
      <div className="flex justify-center mb-4">
         <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
            isPositive 
                ? 'bg-green-50 text-green-700 border-green-100' 
                : 'bg-red-50 text-red-700 border-red-100'
         }`}>
            {isPositive ? (
               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
               </svg>
            ) : (
               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
               </svg>
            )}
            <span>
               {formatNumber(Math.abs(difference))} {kpi.unit} {isPositive ? 'Above' : 'Below'} Target
            </span>
         </div>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between text-sm">
        <div className="flex flex-col">
          <span className="text-slate-400 text-xs uppercase">Actual</span>
          <span className="font-medium text-slate-700">{formatNumber(kpi.actual)} {kpi.unit}</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-slate-400 text-xs uppercase">Target</span>
          <span className="font-medium text-slate-700">{formatNumber(kpi.target)} {kpi.unit}</span>
        </div>
      </div>
    </div>
  );
};

export default KPICard;