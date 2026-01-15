
export enum ConnectionStatus {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  ERROR = 'ERROR'
}

export interface Device {
  id: string;
  name: string;
  ip: string;
  mac: string;
  signal: number;
  type: 'mobile' | 'desktop' | 'iot';
  blocked: boolean;
  bandwidthUsage: number;
  limitMbps?: number; // Advanced control
}

export interface RouterStats {
  cpuUsage: number;
  ramUsage: number;
  uptime: string;
  downloadSpeed: number;
  uploadSpeed: number;
  model: string;
  firmware: string;
}

export interface WifiConfig {
  ssid: string;
  password: string;
  enabled: boolean;
  channel: number;
  encryption: string;
  isolation?: boolean; // Guest specific
}

export interface RouterState {
  status: ConnectionStatus;
  stats: RouterStats;
  devices: Device[];
  wifi: WifiConfig;
  guestWifi: WifiConfig;
  adminUser: string;
  lastUpdate: number;
  error?: string;
}
