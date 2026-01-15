
import React, { useState, useEffect } from 'react';
import { ConnectionStatus, RouterState } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import Devices from './components/Devices';
import WifiSettings from './components/WifiSettings';
import AdvancedSettings from './components/AdvancedSettings';
import AIAssistant from './components/AIAssistant';
import ConnectionGuide from './components/ConnectionGuide';
import { routerService } from './services/routerService';
import { Activity, Users, Wifi, Settings, AlertTriangle, Radio, HelpCircle, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isRebooting, setIsRebooting] = useState(false);
  const [routerState, setRouterState] = useState<RouterState | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('router_session');
    if (session) setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const fetch = async () => {
        const s = await routerService.getStatus();
        setRouterState(s);
      };
      fetch();
      const interval = setInterval(fetch, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleLogin = async (success: boolean) => {
    if (success) {
      localStorage.setItem('router_session', 'active');
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('router_session');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  if (isRebooting) {
    return (
      <div className="h-screen netis-gradient flex flex-col items-center justify-center text-white text-center p-8">
        <div className="w-16 h-16 md:w-24 md:h-24 border-4 border-white/20 border-t-white rounded-full animate-spin mb-8" />
        <h1 className="text-2xl md:text-4xl font-black mb-4">Rebooting Router</h1>
        <p className="text-blue-100 max-w-md text-sm md:text-base">Connecting to gateway {localStorage.getItem('router_ip')}... Please wait.</p>
      </div>
    );
  }

  const navItems = [
    { id: 'overview', label: 'Status', icon: Activity },
    { id: 'devices', label: 'Devices', icon: Users },
    { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Sparkles },
    { id: 'advanced', label: 'Tools', icon: Settings },
  ];

  const currentIp = localStorage.getItem('router_ip') || '192.168.1.1';
  const isError = routerState?.status === ConnectionStatus.ERROR;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden flex-col md:flex-row">
      {showGuide && <ConnectionGuide onClose={() => setShowGuide(false)} />}
      
      <div className="hidden md:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      </div>

      <main className="flex-1 overflow-y-auto relative bg-[#f8fafc] pb-20 md:pb-0">
        <header className="sticky top-0 z-40 glass-panel border-b px-4 md:px-8 py-3 flex items-center justify-between">
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-slate-800 capitalize flex items-center gap-2 truncate">
              {activeTab === 'overview' ? 'Real-time Status' : `${activeTab.replace('-', ' ')}`}
            </h1>
            <div className="flex items-center gap-2">
               <p className="text-[10px] text-slate-500 font-mono">{currentIp}</p>
               {isError && (
                 <AlertTriangle size={12} className="text-red-500" />
               )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
              !isError ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              {isError ? <AlertTriangle size={12} /> : <Radio size={12} className="animate-pulse" />}
              <span className="text-[10px] font-black uppercase tracking-widest">
                {isError ? 'OFFLINE' : 'LIVE'}
              </span>
            </div>
            <button 
              onClick={() => setShowGuide(true)}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
              title="Connection Help"
            >
              <HelpCircle size={18} />
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {isError && (
            <div className="mb-6 p-4 md:p-6 bg-red-50 border border-red-100 rounded-[24px] flex items-start gap-4 animate-in fade-in slide-in-from-top-4">
              <div className="p-2 bg-red-100 text-red-600 rounded-xl shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-red-900">Direct Connection Restricted</h4>
                <p className="text-xs text-red-700 mt-1 leading-relaxed">
                  Web browsers block websites from talking directly to your home router at {currentIp}. 
                  A CORS bypass extension is required to see real-time data here.
                </p>
                <div className="mt-4">
                  <button 
                    onClick={() => setShowGuide(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-bold shadow-md hover:bg-red-700 transition-all"
                  >
                    <HelpCircle size={14} />
                    View Setup Guide
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'overview' && <Dashboard />}
          {activeTab === 'devices' && <Devices />}
          {activeTab === 'wifi' && <WifiSettings />}
          {activeTab === 'advanced' && <AdvancedSettings onReboot={() => setIsRebooting(true)} />}
          {activeTab === 'ai-assistant' && <AIAssistant />}
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-1.5 flex justify-around items-center z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              activeTab === item.id ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
            <item.icon size={18} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            <span className="text-[9px] font-bold tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
