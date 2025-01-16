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