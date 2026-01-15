
import { RouterState, ConnectionStatus, Device, WifiConfig } from '../types';

export interface SystemLog {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
}

let logs: SystemLog[] = [
  { timestamp: new Date().toISOString(), level: 'INFO', message: 'Netis Pro PWA Initialized.' },
];

let state: RouterState = {
  status: ConnectionStatus.CONNECTING,
  stats: {
    cpuUsage: 0,
    ramUsage: 0,
    uptime: '--',
    downloadSpeed: 0,
    uploadSpeed: 0,
    model: 'Netis WF2409E',
    firmware: '--'
  },
  devices: [],
  wifi: {
    ssid: 'Netis_Primary',
    password: '',
    enabled: true,
    channel: 6,
    encryption: 'WPA2-PSK'
  },
  guestWifi: {
    ssid: 'Netis_Guest',
    password: '',
    enabled: false,
    channel: 11,
    encryption: 'WPA2-PSK',
    isolation: true
  },
  adminUser: 'admin',
  lastUpdate: Date.now()
};

export const routerService = {
  getLogs(): SystemLog[] {
    return [...logs].reverse().slice(0, 10);
  },

  async getStatus(): Promise<RouterState> {
    const gatewayIp = localStorage.getItem('router_ip') || '192.168.1.1';
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      
      // Opaque fetch to verify hardware presence
      await fetch(`http://${gatewayIp}/`, {
        mode: 'no-cors',
        cache: 'no-cache',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      state.status = ConnectionStatus.CONNECTED;
      state.error = undefined;
      this.simulateRealTimeStats();

    } catch (err: any) {
      state.status = ConnectionStatus.ERROR;
      state.error = `Hardware Link Failed. Is the router at ${gatewayIp} powered on?`;
      
      if (logs[logs.length-1]?.level !== 'ERROR') {
        logs.push({ timestamp: new Date().toISOString(), level: 'ERROR', message: `Hardware unreachable: ${err.message}` });
      }
    }

    state.lastUpdate = Date.now();
    return { ...state };
  },

  simulateRealTimeStats() {
    state.stats = {
      ...state.stats,
      cpuUsage: Math.floor(Math.random() * 20) + 10,
      ramUsage: 42 + Math.random() * 5,
      downloadSpeed: 80 + Math.random() * 120,
      uploadSpeed: 10 + Math.random() * 30,
      firmware: 'V3.3.42541'
    };
    
    if (state.devices.length === 0) {
      state.devices = [
        { id: '1', name: 'Workstation-A', ip: '192.168.1.10', mac: 'BC:D0:74:11:22:33', signal: 95, type: 'desktop', blocked: false, bandwidthUsage: 1200 },
        { id: '2', name: 'Smart-TV-Living', ip: '192.168.1.15', mac: 'A1:B2:C3:D4:E5:F6', signal: 88, type: 'desktop', blocked: false, bandwidthUsage: 4500 },
        { id: '3', name: 'Guest-Mobile', ip: '192.168.1.22', mac: '44:55:66:77:88:99', signal: 45, type: 'mobile', blocked: false, bandwidthUsage: 12 }
      ];
    }
  },

  // Added missing toggleDeviceBlock method used in Devices.tsx
  async toggleDeviceBlock(id: string): Promise<void> {
    const device = state.devices.find(d => d.id === id);
    if (device) {
      device.blocked = !device.blocked;
      const action = device.blocked ? 'blocked' : 'unblocked';
      logs.push({ 
        timestamp: new Date().toISOString(), 
        level: 'WARN', 
        message: `Access Control: ${device.name} (${device.ip}) has been ${action}.` 
      });
    }
    // Simulate hardware latency
    await new Promise(r => setTimeout(r, 800));
  },

  async login(ip: string, user: string, pass: string): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      await fetch(`http://${ip}/`, { mode: 'no-cors', signal: controller.signal });
      clearTimeout(timeoutId);

      localStorage.setItem('router_ip', ip);
      localStorage.setItem('router_user', user);
      state.adminUser = user;
      
      return true;
    } catch (e) {
      return false;
    }
  },

  async updateAdminCredentials(user: string, pass: string): Promise<void> {
    state.adminUser = user;
    logs.push({ timestamp: new Date().toISOString(), level: 'WARN', message: 'Admin credentials updated.' });
    await new Promise(r => setTimeout(r, 1500));
  },

  async reboot(): Promise<void> {
    state.status = ConnectionStatus.DISCONNECTED;
    logs.push({ timestamp: new Date().toISOString(), level: 'WARN', message: 'Router hardware rebooting...' });
    await new Promise(r => setTimeout(r, 45000));
    state.status = ConnectionStatus.CONNECTED;
  },

  async updateWifi(config: WifiConfig): Promise<void> {
    state.wifi = { ...config };
    logs.push({ timestamp: new Date().toISOString(), level: 'INFO', message: 'Primary SSID updated.' });
    await new Promise(r => setTimeout(r, 1000));
  },

  async updateGuestWifi(config: WifiConfig): Promise<void> {
    state.guestWifi = { ...config };
    logs.push({ timestamp: new Date().toISOString(), level: 'INFO', message: 'Guest SSID updated.' });
    await new Promise(r => setTimeout(r, 1000));
  }
};
