
import React, { useState } from 'react';
import { KPI, CATEGORIES } from '../types';

interface AdminPanelProps {
  kpis: KPI[];
  onAdd: (kpi: KPI) => void;
  onUpdate: (kpi: KPI) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ kpis, onAdd, onUpdate, onDelete, onBack }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [actual, setActual] = useState('');
  const [target, setTarget] = useState('');
  const [unit, setUnit] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setActual('');
    setTarget('');
    setUnit('');
    setDescription('');
    setCategory(CATEGORIES[0]);
  };

  const handleEdit = (kpi: KPI) => {
    setEditingId(kpi.id);
    setName(kpi.name);
    setActual(kpi.actual.toString());
    setTarget(kpi.target.toString());
    setUnit(kpi.unit);
    setDescription(kpi.description);
    setCategory(kpi.category || CATEGORIES[0]);
    
    // Scroll to top to see form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const kpiData: KPI = {
      id: editingId || Date.now().toString(),
      name,
      actual: Number(actual),
      target: Number(target),
      unit,
      description,
      category,
    };

    if (editingId) {
      onUpdate(kpiData);
    } else {
      onAdd(kpiData);
    }
    resetForm();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h2 className="text-2xl font-bold text-[#0a192f]">Admin Console</h2>
            <p className="text-slate-500">Manage your Key Performance Indicators</p>
        </div>
        <button 
            onClick={onBack}
            className="text-slate-600 hover:text-[#0a192f] font-medium px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
            &larr; Back to Dashboard
        </button>
      </div>

      {/* KPI Form */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
            {editingId ? 'Edit KPI' : 'Add New KPI'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">KPI Name</label>
            <input 
                required
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0a192f] focus:border-[#0a192f] outline-none transition-all"
                placeholder="e.g. Quarterly Revenue"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0a192f] focus:border-[#0a192f] outline-none transition-all bg-white"
            >
                {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Unit (Symbol)</label>
            <input 
                required
                type="text" 
                value={unit}
                onChange={e => setUnit(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0a192f] focus:border-[#0a192f] outline-none transition-all"
                placeholder="%, $, k, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Actual Value</label>
            <input 
                required
                type="number" 
                step="any"
                value={actual}
                onChange={e => setActual(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0a192f] focus:border-[#0a192f] outline-none transition-all"
                placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Target Value</label>
            <input 
                required
                type="number" 
                step="any"
                value={target}
                onChange={e => setTarget(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0a192f] focus:border-[#0a192f] outline-none transition-all"
                placeholder="100.00"
            />
          </div>
          
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea 
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0a192f] focus:border-[#0a192f] outline-none transition-all"
                placeholder="Describe what this KPI measures..."
            />
          </div>

          <div className="col-span-2 flex gap-3 justify-end mt-2">
            {editingId && (
                <button 
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 rounded-lg border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                >
                    Cancel
                </button>
            )}
            <button 
                type="submit"
                className="px-6 py-2 rounded-lg bg-[#0a192f] text-white font-medium hover:bg-[#172a46] transition-colors shadow-md"
            >
                {editingId ? 'Update KPI' : 'Create KPI'}
            </button>
          </div>
        </form>
      </div>

      {/* List of KPIs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700 text-sm">KPI Detail</th>
              <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Performance</th>
              <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {kpis.length === 0 ? (
                <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-400">
                        No KPIs found. Add one above.
                    </td>
                </tr>
            ) : (
                kpis.map((kpi) => (
                <tr key={kpi.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
                                {kpi.category}
                            </span>
                        </div>
                        <div className="font-medium text-slate-800">{kpi.name}</div>
                        <div className="text-xs text-slate-500 truncate max-w-xs">{kpi.description}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                        <div className="flex flex-col">
                             <span className="text-sm">Actual: <span className="font-semibold">{kpi.actual} {kpi.unit}</span></span>
                             <span className="text-xs text-slate-400">Target: {kpi.target} {kpi.unit}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                    <button 
                        onClick={() => handleEdit(kpi)}
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                    >
                        Edit
                    </button>
                    <button 
                        onClick={() => onDelete(kpi.id)}
                        className="text-red-500 hover:text-red-700 font-medium text-sm"
                    >
                        Delete
                    </button>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
