
import React from 'react';
import { X, ExternalLink, Chrome, Terminal, ShieldCheck, Info } from 'lucide-react';

interface ConnectionGuideProps {
  onClose: () => void;
}

const ConnectionGuide: React.FC<ConnectionGuideProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="netis-gradient p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-bold text-xl">Connection Guide</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[80vh] space-y-8">
          {/* Extension Method */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600">
              <Chrome size={20} strokeWidth={2.5} />
              <h4 className="font-bold uppercase tracking-wider text-xs">Method 1: Browser Extension (Fastest)</h4>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <p className="text-sm text-blue-900 leading-relaxed">
                Modern browsers block websites from accessing your home network for security. An extension can temporarily bypass this for your router.
              </p>
              <ol className="mt-4 space-y-3">
                <li className="flex gap-3 text-xs text-blue-800">
                  <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center shrink-0 font-bold">1</span>
                  Install <strong>'Allow CORS'</strong> from the Chrome Web Store.
                </li>
                <li className="flex gap-3 text-xs text-blue-800">
                  <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center shrink-0 font-bold">2</span>
                  Click the extension icon and toggle it to <strong>ON</strong>.
                </li>
                <li className="flex gap-3 text-xs text-blue-800">
                  <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center shrink-0 font-bold">3</span>
                  Refresh this page and try <strong>Live Mode</strong> again.
                </li>
              </ol>
              <a 
                href="https://chromewebstore.google.com/detail/allow-cors-access-control/lhobafcepgpndahocajbbajabbebeiid" 
                target="_blank" 
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-all w-full justify-center"
              >
                Go to Web Store <ExternalLink size={14} />
              </a>
            </div>
          </section>

          {/* Local Method */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-600">
              <Terminal size={20} strokeWidth={2.5} />
              <h4 className="font-bold uppercase tracking-wider text-xs">Method 2: Run Locally (Secure)</h4>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <p className="text-sm text-slate-600 leading-relaxed">
                Running the app from your own machine removes the "Cross-Origin" restriction entirely.
              </p>
              <div className="mt-4 space-y-2">
                <code className="block bg-slate-900 text-slate-300 p-3 rounded-lg text-[10px] font-mono">
                  # Copy source files to your folder<br/>
                  npx serve .
                </code>
                <p className="text-[10px] text-slate-400 italic">Access via http://localhost:3000</p>
              </div>
            </div>
          </section>

          <div className="flex gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
            <Info size={18} className="text-amber-600 shrink-0" />
            <p className="text-[10px] text-amber-800 font-medium">
              <strong>Note:</strong> Some Netis routers require HTTP Basic Auth or specific tokens. If the extension doesn't work, ensure you are logged into your router's web portal in another tab first.
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-bold active:scale-95 transition-all"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionGuide;
