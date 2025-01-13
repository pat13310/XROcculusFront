export interface NetworkMetric {
  id: string;
  device_id: string;
  timestamp: string;
  connection_type: string;
  signal_strength: number;
  latency: number;
  download_speed: number;
  upload_speed: number;
  packet_loss: number;
}

export interface DataUsage {
  app_id: string;
  app_name: string;
  total_bytes: number;
  device_id: string;
  hour: string;
}

export interface BatteryStats {
  device_id: string;
  device_name: string;
  hour: string;
  avg_level: number;
  min_level: number;
  max_level: number;
  charging_count: number;
}

export interface AppStats {
  app_name: string;
  user_count: number;
  total_bytes: number;
}

export interface ConsoleStorage {
  model: string;
  device_count: number;
  total_storage: number;
  used_storage: number;
}