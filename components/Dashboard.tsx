
import React, { useState, useEffect } from 'react';
import { CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts';
import { routerService } from '../services/routerService';
import { RouterState, ConnectionStatus } from '../types';
import { ArrowUpRight, ArrowDownRight, Cpu, HardDrive, RefreshCw, AlertTriangle, Radio } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<RouterState | null>(null);
  const [history, setHistory] = useState<{ time: string; down: number; up: number }[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setRefreshing(true);
    const res = await routerService.getStatus();
    setData(res);
    if (res.status === ConnectionStatus.CONNECTED) {
      setHistory(prev => {
        const next = [...prev, { 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), 
          down: res.stats.downloadSpeed, 
          up: res.stats.uploadSpeed 
        }];
        return next.slice(-20);
      });
    }
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 6000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="animate-spin text-blue-600">
        <RefreshCw size={32} />
      </div>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Polling Gateway...</p>
    </div>
  );

  const isOffline = data.status === ConnectionStatus.ERROR;

  return (
    <div className={`space-y-4 md:space-y-8 animate-in fade-in duration-500 ${isOffline ? 'opacity-80' : ''}`}>
      {/* Real-time Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatCard 
          title="Download" 
          value={isOffline ? '--' : `${data.stats.downloadSpeed.toFixed(1)}`} 
          unit="Mbps"
          icon={<ArrowDownRight size={18} className="text-blue-500" />} 
          color="blue"
        />
        <StatCard 
          title="Upload" 
          value={isOffline ? '--' : `${data.stats.uploadSpeed.toFixed(1)}`} 
          unit="Mbps"
          icon={<ArrowUpRight size={18} className="text-emerald-500" />} 
          color="emerald"
        />
        <StatCard 
          title="CPU Load" 
          value={isOffline ? '--' : `${data.stats.cpuUsage}`} 
          unit="%"
          icon={<Cpu size={18} className="text-amber-500" />} 
          color="amber"
          progress={isOffline ? 0 : data.stats.cpuUsage}
        />
        <StatCard 
          title="RAM Usage" 
          value={isOffline ? '--' : `${data.stats.ramUsage.toFixed(0)}`} 
          unit="%"
          icon={<HardDrive size={18} className="text-indigo-500" />} 
          color="indigo"
          progress={isOffline ? 0 : data.stats.ramUsage}
        />
      </div>

      {/* Traffic Chart */}
      <div className="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-800">Traffic Analysis</h3>
              <p className="text-[10px] md:text-sm text-slate-500">Real-time throughput metrics</p>
            </div>
            {refreshing && <RefreshCw size={14} className="animate-spin text-blue-400" />}
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Down</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Up</span>
            </div>
          </div>
        </div>
        <div className="h-48 md:h-80 w-full relative">
          {isOffline && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[2px] rounded-2xl">
               <AlertTriangle size={48} className="text-red-500 mb-3 animate-bounce" />
               <p className="text-sm font-black text-red-600 uppercase tracking-[0.2em] mb-4">Link Disconnected</p>
               <button 
                onClick={fetchData}
                className="px-6 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold shadow-lg hover:bg-slate-900 transition-all flex items-center gap-2"
               >
                 <RefreshCw size={14} /> Reconnect Hardware
               </button>
            </div>
          )}
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs>
                <linearGradient id="colorDown" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorUp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" hide />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} 
                tickFormatter={(val) => `${val}`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '11px', fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="down" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorDown)" 
              />
              <Area 
                type="monotone" 
                dataKey="up" 
                stroke="#10b981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorUp)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hardware Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white p-5 md:p-8 rounded-[32px] shadow-sm border border-slate-200 group hover:border-blue-200 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              System Identity
            </h3>
            <div className={`p-1.5 rounded-lg ${isOffline ? 'bg-red-50 text-red-400' : 'bg-green-50 text-green-500'}`}>
               <Radio size={14} className={isOffline ? '' : 'animate-pulse'} />
            </div>
          </div>
          <div className="space-y-4">
            <InfoRow label="Model Identifier" value={data.stats.model} />
            <InfoRow label="Firmware Revision" value={data.stats.firmware} />
            <InfoRow label="Heartbeat Status" value={isOffline ? 'Inactive' : 'Live Polling'} />
            <InfoRow label="Network Node Count" value={isOffline ? '--' : `${data.devices.length} Devices`} />
          </div>
        </div>
        <div className="bg-white p-5 md:p-8 rounded-[32px] shadow-sm border border-slate-200 group hover:border-blue-200 transition-colors">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            Wireless Profile
          </h3>
          <div className="space-y-4">
            <InfoRow label="Primary SSID" value={data.wifi.ssid} />
            <InfoRow label="Encryption Protocol" value={data.wifi.encryption} />
            <InfoRow label="Active Channel" value={data.wifi.channel === 0 ? '--' : data.wifi.channel.toString()} />
            <InfoRow label="Broadcasting" value={isOffline ? '--' : (data.wifi.enabled ? 'Active' : 'Muted')} />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, unit, icon, color, progress }: any) => (
  <div className="bg-white p-5 md:p-6 rounded-[28px] shadow-sm border border-slate-200 relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2.5 rounded-2xl bg-${color}-50 border border-${color}-100`}>
        {icon}
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <div className="flex items-baseline gap-1">
        <h4 className="text-xl md:text-3xl font-black text-slate-800">{value}</h4>
        <span className="text-[10px] md:text-xs font-bold text-slate-400">{unit}</span>
      </div>
    </div>
    {progress !== undefined && (
      <div className="mt-4 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-${color}-500 transition-all duration-1000`} 
          style={{ width: `${progress}%` }} 
        />
      </div>
    )}
  </div>
);

const InfoRow = ({ label, value }: { label: string, value: string }) => (
  <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">{label}</span>
    <span className="text-xs md:text-sm text-slate-800 font-black truncate max-w-[150px] text-right">{value}</span>
  </div>
);

export default Dashboard;
