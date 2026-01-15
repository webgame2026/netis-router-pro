
import React, { useState } from 'react';
import { routerService } from '../services/routerService';
import { Cpu, ShieldCheck, User, Lock, Globe, AlertCircle, Loader2, Wifi, WifiOff } from 'lucide-react';

interface LoginProps {
  onLogin: (success: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [ip, setIp] = useState('192.168.1.1');
  const [user, setUser] = useState('admin');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Attempt real handshake
    const success = await routerService.login(ip, user, pass);
    
    if (success) {
      onLogin(true);
    } else {
      setLoading(false);
      setError(`Cannot establish connection to ${ip}. Check your physical connection or try a different IP.`);
    }
  };

  return (
    <div className="min-h-screen netis-gradient flex items-center justify-center p-4 md:p-6 text-white">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-700">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8 md:mb-12 relative z-10">
            <div className="w-14 h-14 md:w-20 md:h-20 bg-white rounded-[24px] md:rounded-[32px] flex items-center justify-center shadow-xl mb-4 text-blue-600 transition-transform hover:scale-110 duration-500">
              <Cpu size={32} className="md:size-[44px]" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Netis<span className="font-light">Pro</span></h1>
            <p className="text-blue-100/60 text-[10px] md:text-xs mt-2 font-bold tracking-[0.2em] uppercase">Hardware Gateway Control</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 relative z-10">
            {error && (
              <div className="bg-red-500/30 backdrop-blur-md border border-red-500/50 text-red-100 p-4 rounded-2xl flex items-start gap-3 animate-in shake duration-300">
                <WifiOff size={18} className="shrink-0 mt-0.5" />
                <p className="text-[10px] md:text-xs font-semibold leading-relaxed">{error}</p>
              </div>
            )}

            <div className="space-y-1.5 md:space-y-2">
              <label className="text-[9px] md:text-[10px] font-black text-white/50 uppercase tracking-[0.1em] px-2">Gateway IP (Default: 192.168.1.1)</label>
              <div className="relative group">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" size={18} />
                <input 
                  type="text"
                  required
                  autoFocus
                  className="w-full pl-11 pr-4 py-4 md:py-5 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all font-mono text-sm"
                  value={ip}
                  onChange={e => setIp(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <label className="text-[9px] md:text-[10px] font-black text-white/50 uppercase tracking-[0.1em] px-2">Netis Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" size={18} />
                <input 
                  type="text"
                  required
                  className="w-full pl-11 pr-4 py-4 md:py-5 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all font-medium text-sm"
                  value={user}
                  onChange={e => setUser(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <label className="text-[9px] md:text-[10px] font-black text-white/50 uppercase tracking-[0.1em] px-2">Netis Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" size={18} />
                <input 
                  type="password"
                  required
                  className="w-full pl-11 pr-4 py-4 md:py-5 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all font-mono text-sm"
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-4 md:py-5 rounded-2xl font-black text-base md:text-lg transition-all shadow-2xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-4 ${
                loading ? 'bg-blue-500 text-white cursor-wait' : 'bg-white text-blue-600 hover:bg-blue-50'
              }`}
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <ShieldCheck size={24} />}
              {loading ? 'Validating Link...' : 'Enter Dashboard'}
            </button>
          </form>

          {/* Decorative Blobs */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
        </div>
        
        <div className="mt-8 text-center text-white/40 space-y-3">
          <div className="flex items-center justify-center gap-2">
             <Wifi size={14} className="animate-pulse" />
             <p className="text-[10px] font-bold tracking-widest uppercase">Target: Netis Wireless-N Series</p>
          </div>
          <p className="text-[9px] font-medium max-w-[280px] mx-auto opacity-60">Reachability check will fail if the router is not active on this specific IP address.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
