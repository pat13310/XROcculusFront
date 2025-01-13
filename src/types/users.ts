export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  avatar: string | null;
  lastActive: string;
  created_at: string;
}

export interface UserStats {
  total: number;
  active: number;
  newThisMonth: number;
  avgSessionTime: number;
}