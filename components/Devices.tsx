
import React, { useState, useEffect } from 'react';
import { routerService } from '../services/routerService';
import { Device } from '../types';
import { Monitor, Smartphone, Cpu, ShieldAlert, ShieldCheck, Search, Wifi, WifiOff } from 'lucide-react';

const Devices: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      const data = await routerService.getStatus();
      setDevices(data.devices);
    };
    fetch();
    const interval = setInterval(fetch, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleBlock = async (id: string) => {
    await routerService.toggleDeviceBlock(id);
    const data = await routerService.getStatus();
    setDevices(data.devices);
  };

  const filteredDevices = devices.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.ip.includes(search) || 
    d.mac.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 md:space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">Connections</h2>
          <p className="text-xs md:text-sm text-slate-500">{devices.length} devices currently active</p>
        </div>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" size={16} />
          <input 
            type="text" 
            placeholder="Search devices..."
            className="pl-9 pr-4 py-2.5 w-full bg-white border border-slate-200 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
        {filteredDevices.map(device => (
          <div 
            key={device.id} 
            className={`p-4 md:p-5 rounded-2xl md:rounded-3xl bg-white border transition-all hover:shadow-md flex items-center justify-between ${
              device.blocked ? 'border-red-100 opacity-80' : 'border-slate-200'
            }`}
          >
            <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
              <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 ${
                device.blocked ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
              }`}>
                {device.type === 'mobile' && <Smartphone size={20} className="md:size-[24px]" />}
                {device.type === 'desktop' && <Monitor size={20} className="md:size-[24px]" />}
                {device.type === 'iot' && <Cpu size={20} className="md:size-[24px]" />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-slate-800 text-sm md:text-base truncate">{device.name}</h4>
                  {device.blocked && (
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-red-100 text-red-600 uppercase">Blocked</span>
                  )}
                </div>
                <div className="flex flex-col mt-0.5">
                  <p className="text-[10px] md:text-xs text-slate-500 font-mono truncate">{device.ip}</p>
                  <p className="text-[10px] md:text-xs text-slate-400 font-mono truncate hidden md:block">{device.mac}</p>
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex items-center gap-1">
                    {device.signal > 30 ? <Wifi size={12} className="text-slate-400" /> : <WifiOff size={12} className="text-amber-500" />}
                    <span className="text-[10px] font-bold text-slate-600">{device.signal.toFixed(0)}%</span>
                  </div>
                  <div className="h-0.5 w-0.5 rounded-full bg-slate-300" />
                  <span className="text-[10px] font-black text-blue-600">{device.bandwidthUsage} KB/s</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleToggleBlock(device.id)}
              className={`p-2 md:p-3 rounded-xl transition-all shrink-0 ml-2 ${
                device.blocked 
                  ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
                  : 'bg-red-50 text-red-600 hover:bg-red-100'
              }`}
            >
              {device.blocked ? <ShieldCheck size={18} className="md:size-[20px]" /> : <ShieldAlert size={18} className="md:size-[20px]" />}
            </button>
          </div>
        ))}
      </div>

      {filteredDevices.length === 0 && (
        <div className="py-12 md:py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-slate-300" size={24} />
          </div>
          <h3 className="text-base md:text-lg font-bold text-slate-800">No matching devices</h3>
          <p className="text-xs text-slate-500">Try adjusting your search</p>
        </div>
      )}
    </div>
  );
};

export default Devices;
