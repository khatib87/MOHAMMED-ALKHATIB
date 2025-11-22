import React, { useState } from 'react';
import { KPI, CATEGORIES } from '../types';
import KPICard from './KPICard';
import Gauge from './Gauge';

interface DashboardProps {
  kpis: KPI[];
}

const Dashboard: React.FC<DashboardProps> = ({ kpis }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter KPIs based on selected category
  const filteredKpis = selectedCategory === 'All' 
    ? kpis 
    : kpis.filter(k => k.category === selectedCategory);

  // Calculate high-level stats based on filtered list
  const total = filteredKpis.length;
  const onTrack = filteredKpis.filter(k => (k.actual / k.target) >= 0.75).length;
  const atRisk = filteredKpis.filter(k => (k.actual / k.target) >= 0.5 && (k.actual / k.target) < 0.75).length;
  const offTrack = filteredKpis.filter(k => (k.actual / k.target) < 0.5).length;

  // Calculate Overall Performance Average for filtered list
  const overallPercentage = total > 0
    ? filteredKpis.reduce((acc, kpi) => {
        const perf = kpi.target !== 0 ? (kpi.actual / kpi.target) : 0;
        return acc + perf;
      }, 0) / total * 100
    : 0;

  const overallDisplay = overallPercentage.toFixed(1);

  return (
    <div className="space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#0a192f]">Performance Overview</h2>
          <p className="text-slate-500 mt-1">Real-time monitoring of NCC strategic objectives</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
            {/* Category Filter */}
            <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium focus:ring-2 focus:ring-[#0a192f] outline-none cursor-pointer hover:border-slate-300 transition-colors min-w-[200px]"
            >
                <option value="All">All Departments</option>
                {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
        </div>
      </div>

      {/* Overall Performance Section */}
      <div className="bg-[#0a192f] rounded-2xl p-6 md:p-8 text-white shadow-xl overflow-hidden relative">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-indigo-200 uppercase tracking-wider">
                        {selectedCategory === 'All' ? 'Overall Performance' : `${selectedCategory} Performance`}
                    </h3>
                    {selectedCategory !== 'All' && (
                        <span className="px-2 py-1 rounded bg-indigo-500/30 border border-indigo-400/30 text-xs font-mono text-indigo-200">
                            FILTERED
                        </span>
                    )}
                </div>
                
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl md:text-6xl font-bold text-white">{overallDisplay}%</span>
                    <span className="text-indigo-200">average efficiency</span>
                </div>
                <p className="mt-4 text-slate-300 max-w-xl">
                    This metric represents the aggregate completion rate of {selectedCategory === 'All' ? 'all' : `filtered ${selectedCategory}`} Key Performance Indicators currently being tracked by the NCC dashboard.
                </p>
            </div>
            
            <div className="w-full md:w-64 h-40 bg-white/5 rounded-xl backdrop-blur-sm p-4 border border-white/10 flex flex-col items-center justify-center">
                 <div className="w-full h-full">
                    <Gauge actual={overallPercentage} target={100} unit="%" darkMode={true} />
                 </div>
            </div>
        </div>
        {/* Background Decor */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500 rounded-full opacity-10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-blue-500 rounded-full opacity-10 blur-3xl pointer-events-none"></div>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <div className="text-slate-500 text-xs uppercase font-semibold tracking-wider">
                {selectedCategory === 'All' ? 'Total KPIs' : 'Visible KPIs'}
            </div>
            <div className="text-2xl font-bold text-slate-800 mt-1">{total}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border-l-4 border-green-500 shadow-sm">
            <div className="text-green-600 text-xs uppercase font-semibold tracking-wider">On Track</div>
            <div className="text-2xl font-bold text-slate-800 mt-1">{onTrack}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border-l-4 border-yellow-500 shadow-sm">
            <div className="text-yellow-600 text-xs uppercase font-semibold tracking-wider">At Risk</div>
            <div className="text-2xl font-bold text-slate-800 mt-1">{atRisk}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border-l-4 border-red-500 shadow-sm">
            <div className="text-red-600 text-xs uppercase font-semibold tracking-wider">Off Track</div>
            <div className="text-2xl font-bold text-slate-800 mt-1">{offTrack}</div>
        </div>
      </div>

      {/* Gauge Color Legend */}
      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-3 text-xs text-slate-500 bg-white/50 p-3 rounded-lg border border-slate-100">
          <span className="font-semibold text-slate-600 uppercase tracking-wider">Zone Guide:</span>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5">
                 <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                 <span>0-50% (Critical)</span>
             </div>
             <div className="flex items-center gap-1.5">
                 <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                 <span>50-75% (At Risk)</span>
             </div>
             <div className="flex items-center gap-1.5">
                 <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                 <span>75-100% (On Track)</span>
             </div>
          </div>
      </div>

      {/* KPI Grid */}
      {filteredKpis.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-100 border-dashed">
              <h3 className="text-lg font-medium text-slate-900">No KPIs Found</h3>
              <p className="text-slate-500 mt-1 mb-4">
                  {kpis.length === 0 ? "Get started by adding a new KPI in the admin panel." : `No KPIs found for the ${selectedCategory} category.`}
              </p>
          </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredKpis.map(kpi => (
                <KPICard key={kpi.id} kpi={kpi} />
            ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;