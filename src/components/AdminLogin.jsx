import React, { useState } from 'react';
import { Lock, ArrowLeft, KeyRound, AlertCircle } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess, onBackHome, accentColor }) {
  const accent = accentColor || '#e63946';
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin.trim() === '5542') {
      setError(false);
      sessionStorage.setItem('portfolio_admin_auth', 'true');
      onLoginSuccess();
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] flex flex-col justify-center items-center px-4 selection:bg-red-600 selection:text-white">
      
      {/* Back to site button */}
      <div className="absolute top-6 left-6 sm:top-10 sm:left-10">
        <button
          onClick={onBackHome}
          className="flex items-center gap-2 px-3 py-1.5 border border-white/10 hover:border-white/30 text-xs font-mono text-neutral-400 hover:text-white rounded-xs transition-colors"
        >
          <ArrowLeft size={13} style={{ color: accent }} />
          <span>RETURN TO PORTFOLIO</span>
        </button>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-sm bg-[#121216] border border-white/15 p-8 rounded-xs shadow-2xl">
        
        {/* Icon & Title */}
        <div className="flex flex-col items-center text-center mb-8">
          <div 
            className="w-12 h-12 rounded-xs border border-white/20 flex items-center justify-center text-white mb-4 shadow-lg"
            style={{ backgroundColor: `${accent}20`, borderColor: accent }}
          >
            <Lock size={20} style={{ color: accent }} />
          </div>

          <h1 className="text-lg font-bold font-heading uppercase text-white tracking-wider">
            ADMIN STUDIO ACCESS
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-1">
            Enter authorized security PIN to manage works
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xs flex items-center gap-2 text-xs font-mono text-red-300 animate-shake">
            <AlertCircle size={14} className="shrink-0" />
            <span>Invalid security PIN. Access denied.</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-mono text-neutral-400 mb-2 uppercase tracking-wider">
              SECURITY PIN
            </label>
            <div className="relative">
              <input
                type="password"
                required
                autoFocus
                maxLength={10}
                placeholder="••••"
                value={pin}
                onChange={(e) => {
                  setError(false);
                  setPin(e.target.value);
                }}
                className="w-full bg-white/[0.03] border border-white/20 focus:border-white/50 text-white text-center text-lg tracking-[0.4em] py-3 rounded-xs font-mono focus:outline-none transition-colors"
              />
              <KeyRound size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 text-xs font-mono font-bold uppercase tracking-wider text-white rounded-xs shadow-xl transition-all hover:brightness-110 active:scale-95"
            style={{ backgroundColor: accent }}
          >
            UNLOCK DASHBOARD
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">
            PORTFOLIO CMS // PRIVATE ENDPOINT
          </span>
        </div>

      </div>

    </div>
  );
}
