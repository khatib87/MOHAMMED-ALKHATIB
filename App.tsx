
import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import { KPI, ViewMode } from './types';

// Initial Demo Data
const INITIAL_DATA: KPI[] = [
  { id: '1', name: 'Q3 Revenue', actual: 850, target: 1000, unit: 'k', description: 'Total revenue for the third quarter across all regions.', category: 'Finance' },
  { id: '2', name: 'Customer Sat.', actual: 92, target: 90, unit: '%', description: 'CSAT score based on post-ticket surveys.', category: 'Marketing' },
  { id: '3', name: 'Server Uptime', actual: 98.5, target: 99.9, unit: '%', description: 'Platform availability percentage.', category: 'IT' },
  { id: '4', name: 'New Leads', actual: 45, target: 120, unit: '', description: 'Qualified marketing leads generated this month.', category: 'Sales' },
  { id: '5', name: 'Safety Incidents', actual: 0, target: 0, unit: '', description: 'Number of reportable safety incidents this month.', category: 'SHEQ' },
  { id: '6', name: 'Project A Delivery', actual: 80, target: 100, unit: '%', description: 'Completion percentage of Project A milestones.', category: 'Projects' },
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [kpis, setKpis] = useState<KPI[]>(() => {
      const saved = localStorage.getItem('ncc_kpis');
      return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  // Persist data
  useEffect(() => {
    localStorage.setItem('ncc_kpis', JSON.stringify(kpis));
  }, [kpis]);

  const handleAdminClick = () => {
    if (isAuthenticated) {
      setView('admin');
    } else {
      setView('login');
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setView('admin');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setView('dashboard');
  };

  const addKPI = (kpi: KPI) => {
    setKpis(prev => [...prev, kpi]);
    setView('dashboard');
  };

  const updateKPI = (updatedKpi: KPI) => {
    setKpis(prev => prev.map(k => k.id === updatedKpi.id ? updatedKpi : k));
    setView('dashboard');
  };

  const deleteKPI = (id: string) => {
    if(window.confirm('Are you sure you want to delete this KPI?')) {
        setKpis(prev => prev.filter(k => k.id !== id));
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard kpis={kpis} />;
      case 'login':
        return <Login onLogin={handleLogin} />;
      case 'admin':
        return (
          <AdminPanel 
            kpis={kpis} 
            onAdd={addKPI} 
            onUpdate={updateKPI} 
            onDelete={deleteKPI}
            onBack={() => setView('dashboard')}
          />
        );
      default:
        return <Dashboard kpis={kpis} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      {/* Navigation Header */}
      <nav className="bg-[#0a192f] text-white sticky top-0 z-50 shadow-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#0a192f] font-bold text-xl">
                    N
                </div>
                <span className="font-bold text-lg tracking-tight">NCC KPI</span>
            </div>
            <div className="flex items-center space-x-4">
                <button 
                    onClick={() => setView('dashboard')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === 'dashboard' ? 'bg-white/10 text-white' : 'text-slate-300 hover:text-white'}`}
                >
                    Dashboard
                </button>
                <button 
                    onClick={handleAdminClick}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === 'admin' || view === 'login' ? 'bg-white/10 text-white' : 'text-slate-300 hover:text-white'}`}
                >
                    Admin
                </button>
                {isAuthenticated && (
                  <button 
                    onClick={handleLogout}
                    className="ml-2 text-xs text-slate-400 hover:text-white uppercase tracking-wider"
                  >
                    Sign Out
                  </button>
                )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-slate-400 text-sm">
                &copy; {new Date().getFullYear()} NCC KPI Dashboard.
            </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
