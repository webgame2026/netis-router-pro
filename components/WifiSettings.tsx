
import React, { useState, useEffect } from 'react';
import { routerService } from '../services/routerService';
import { WifiConfig } from '../types';
import { Wifi, Save, Loader2, Eye, EyeOff, CheckCircle2, ShieldCheck, UserPlus } from 'lucide-react';

const WifiSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'main' | 'guest'>('main');
  const [config, setConfig] = useState<WifiConfig | null>(null);
  const [guestConfig, setGuestConfig] = useState<WifiConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const data = await routerService.getStatus();
      setConfig(data.wifi);
      setGuestConfig(data.guestWifi);
    };
    fetch();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (activeTab === 'main' && config) {
      await routerService.updateWifi(config);
    } else if (activeTab === 'guest' && guestConfig) {
      await routerService.updateGuestWifi(guestConfig);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!config || !guestConfig) return null;

  const current = activeTab === 'main' ? config : guestConfig;
  const setCurrent = activeTab === 'main' ? setConfig : setGuestConfig;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-top-4 duration-500 pb-12">
      <div className="bg-white rounded-[32px] shadow-xl border border-slate-200 overflow-hidden">
        {/* Header Tabs */}
        <div className="flex bg-slate-50 border-b border-slate-200 p-2 gap-2">
          <button 
            onClick={() => setActiveTab('main')}
            className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all ${
              activeTab === 'main' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Wifi size={18} /> Primary SSID
          </button>
          <button 
            onClick={() => setActiveTab('guest')}
            className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all ${
              activeTab === 'guest' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <UserPlus size={18} /> Guest Network
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 md:p-10 space-y-8">
          <div className="flex items-center justify-between bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <div>
              <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px]">Wireless Status</h3>
              <p className="text-sm text-slate-500 mt-1">Enable or disable this specific radio broadcast.</p>
            </div>
            <button
              type="button"
              onClick={() => setCurrent({...current, enabled: !current.enabled} as any)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${current.enabled ? 'bg-green-500' : 'bg-slate-300'}`}
            >
              <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${current.enabled ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Network Identifier (SSID)</label>
              <input 
                type="text"
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-700"
                value={current.ssid}
                onChange={e => setCurrent({...current, ssid: e.target.value} as any)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Security Protocol</label>
              <select 
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-700 bg-white"
                value={current.encryption}
                onChange={e => setCurrent({...current, encryption: e.target.value} as any)}
              >
                <option value="WPA2-PSK">WPA2-PSK (Highly Secure)</option>
                <option value="WPA-PSK">WPA-PSK (Legacy)</option>
                <option value="NONE">None (Insecure Open)</option>
              </select>
            </div>

            <div className="space-y-2 relative">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">WPA Passphrase</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-mono font-bold"
                  value={current.password}
                  onChange={e => setCurrent({...current, password: e.target.value} as any)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Radio Broadcast Channel</label>
              <select 
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-700 bg-white"
                value={current.channel}
                onChange={e => setCurrent({...current, channel: parseInt(e.target.value)} as any)}
              >
                <option value={0}>Auto Optimization</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(n => <option key={n} value={n}>CH {n} (2.4GHz)</option>)}
              </select>
            </div>
          </div>

          {activeTab === 'guest' && (
            <div className="flex items-center gap-4 p-5 bg-blue-50 rounded-2xl border border-blue-100">
               <ShieldCheck className="text-blue-600 shrink-0" />
               <div>
                  <h4 className="text-xs font-black text-blue-900 uppercase">Client Isolation Active</h4>
                  <p className="text-[10px] text-blue-700 mt-0.5">Guest users cannot access other devices or your primary admin panel.</p>
               </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              disabled={saving}
              className={`flex items-center justify-center gap-3 px-12 py-5 rounded-[24px] font-black text-sm transition-all shadow-xl active:scale-95 ${
                saved 
                ? 'bg-green-500 text-white' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
              } disabled:opacity-50`}
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : saved ? <CheckCircle2 size={20} /> : <Save size={20} />}
              {saving ? 'Synchronizing...' : saved ? 'Settings Applied' : 'Update Wireless Node'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WifiSettings;
