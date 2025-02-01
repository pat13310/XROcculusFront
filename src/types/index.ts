export interface Device {
  id: string;
  name: string;
  model: string;
  status: 'online' | 'offline';
  batteryLevel: number;
  storageUsed: number;
  storageTotal: number;
  lastSync: string | Date;
}

export interface DeviceStats {
  totalDevices: number;
  activeDevices: number;
  storageUsed: number;
  storageTotal: number;
  batteryLevels: number[];
}

export interface Application {
  id: string;
  name: string;
  description: string;
  url: string;
  status: 'active' | 'pending' | 'revoked' | 'suspended' | 'available' | 'installed';
  installed: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  rating?: number;
  developer?: string;
  category?: string;
  version?: string;
  size?: number;
}