
export const CATEGORIES = [
  'HR', 
  'Marketing', 
  'Sales', 
  'IT', 
  'Supply Chain', 
  'Manufacturing', 
  'Projects', 
  'SHEQ', 
  'IPD', 
  'Finance'
] as const;

export interface KPI {
  id: string;
  name: string;
  actual: number;
  target: number;
  unit: string;
  description: string;
  category: string;
}

export type ViewMode = 'dashboard' | 'admin' | 'login';

export interface DashboardStats {
  totalKPIs: number;
  onTrack: number;
  atRisk: number;
  offTrack: number;
}
