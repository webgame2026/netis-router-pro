
import React, { useState } from 'react';
import { routerService } from '../services/routerService';
import { RefreshCw, Globe, Shield, Terminal, Zap, Trash2, Key, Save, Loader2, AlertTriangle, Database } from 'lucide-react';

interface AdvancedSettingsProps {
  onReboot: () => void;
}

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({ onReboot }) => {
  const [showSecurity, setShowSecurity] = useState(false);
  const [newAdmin, setNewAdmin] = useState('admin');
  const [newPass, setNewPass] = useState('');
  const [updating, setUpdating] = useState(false);

  const handleRebootClick = async () => {
    if (confirm('Initiate hardware reboot for Netis WF2409E? All active sessions will drop for 60 seconds.')) {
      onReboot();
      await routerService.reboot();
    }
  };

  const handleSecurityUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass) return alert('Please enter a new security passphrase.');
    setUpdating(true);
    await routerService.updateAdminCredentials(newAdmin, newPass);
    setUpdating(false);
    setShowSecurity(false);
    alert('Security credentials updated. You may be required to re-login.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {showSecurity ? (
        <div className="bg-white p-8 rounded-[32px] shadow-xl border border-slate-200 max-w-2xl mx-auto animate-in zoom-in-95">
           <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                 <Key size={24} />
              </div>
              <div>
                 <h2 className="text-xl font-black text-slate-800">Security Credentials</h2>
                 <p className="text-sm text-slate-500">Update admin login for the gateway portal.</p>
              </div>
           </div>

           <form onSubmit={handleSecurityUpdate} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Admin Username</label>
                 <input 
                  type="text" 
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-bold"
                  value={newAdmin}
                  onChange={e => setNewAdmin(e.target.value)}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">New Passphrase</label>
                 <input 
                  type="password" 
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-mono"
                  placeholder="••••••••"
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                 />
              </div>
              <div className="flex gap-3 pt-4">
                 <button 
                  type="button"
                  onClick={() => setShowSecurity(false)}
                  className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all"
                 >
                    Cancel
                 </button>
                 <button 
                  type="submit"
                  disabled={updating}
                  className="flex-1 py-4 rounded-2xl bg-red-600 text-white font-black hover:bg-red-700 transition-all shadow-lg flex items-center justify-center gap-2"
                 >
                    {updating ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Update Security
                 </button>
              </div>
           </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActionCard 
            title="System Reboot" 
            desc="Perform a hard restart of the wireless hardware." 
            icon={<RefreshCw />} 
            btnText="Initiate" 
            onAction={handleRebootClick}
            variant="amber"
          />
          
          <ActionCard 
            title="Admin Pass" 
            desc="Change current login credentials for this router." 
            icon={<Key />} 
            btnText="Secure Portal" 
            onAction={() => setShowSecurity(true)}
            variant="red"
          />

          <ActionCard 
            title="QoS Optimizer" 
            desc="Prioritize bandwidth for specific network nodes." 
            icon={<Zap />} 
            btnText="Manage" 
            onAction={() => {}}
            variant="blue"
          />

          <ActionCard 
            title="Dynamic DNS" 
            desc="Access your router remotely via custom domain." 
            icon={<Globe />} 
            btnText="Config" 
            onAction={() => {}}
            variant="emerald"
          />

          <ActionCard 
            title="Firewall" 
            desc="Configure SPI and DoS attack protection." 
            icon={<Shield />} 
            btnText="Security Rules" 
            onAction={() => {}}
            variant="indigo"
          />

          <ActionCard 
            title="System Logs" 
            desc="Export DHCP, connection, and event history." 
            icon={<Database />} 
            btnText="Download" 
            onAction={() => {}}
            variant="slate"
          />
        </div>
      )}
    </div>
  );
};

const ActionCard = ({ title, desc, icon, btnText, onAction, variant }: any) => {
  const variants: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    red: "bg-red-50 text-red-600 border-red-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    slate: "bg-slate-50 text-slate-600 border-slate-100",
  };

  const btnColors: any = {
    blue: "bg-blue-600 hover:bg-blue-700",
    amber: "bg-amber-600 hover:bg-amber-700",
    emerald: "bg-emerald-600 hover:bg-emerald-700",
    red: "bg-red-600 hover:bg-red-700",
    indigo: "bg-indigo-600 hover:bg-indigo-700",
    slate: "bg-slate-800 hover:bg-slate-900",
  };

  return (
    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-xl hover:border-blue-100 transition-all group">
      <div className="mb-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border transition-transform group-hover:scale-110 duration-500 ${variants[variant]}`}>
          {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
        </div>
        <h3 className="text-lg font-black text-slate-800 mb-2">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">{desc}</p>
      </div>
      <button 
        onClick={onAction}
        className={`w-full py-4 rounded-2xl text-white font-black text-xs transition-all shadow-lg active:scale-95 ${btnColors[variant]}`}
      >
        {btnText}
      </button>
    </div>
  );
};

export default AdvancedSettings;
