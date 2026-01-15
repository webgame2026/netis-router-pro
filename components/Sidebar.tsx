
import React from 'react';
import { Activity, ShieldCheck, Wifi, Settings, LogOut, Users, Cpu, Sparkles } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'devices', label: 'Connected Devices', icon: Users },
    { id: 'wifi', label: 'Wi-Fi Settings', icon: Wifi },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Sparkles, highlight: true },
    { id: 'advanced', label: 'Advanced Tools', icon: Settings },
  ];

  return (
    <aside className="w-72 bg-white border-r flex flex-col h-full shadow-sm z-20">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 netis-gradient rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <Cpu size={24} />
        </div>
        <span className="text-xl font-bold tracking-tight text-blue-900">Netis<span className="font-light">Pro</span></span>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative group ${
              activeTab === item.id
                ? 'bg-blue-50 text-blue-600 shadow-sm'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <item.icon size={20} className={item.highlight && activeTab !== item.id ? 'text-blue-500 animate-pulse' : ''} />
            {item.label}
            {item.highlight && (
               <span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-md bg-blue-100 text-[8px] font-black text-blue-700 uppercase tracking-tighter">New</span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut size={20} />
          Sign Out
        </button>
        <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Hardware Status</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[45%]" />
            </div>
            <span className="text-[10px] font-bold text-slate-500">45% Load</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
