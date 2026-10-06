import React from 'react';
import { Plus, Printer, Sliders, LayoutGrid, FileText, Sparkles, Cloud, CloudOff } from 'lucide-react';

export default function Navbar({
  profile,
  activeTab,
  setActiveTab,
  onOpenNewProject,
  onOpenProfile,
  onTriggerPrint,
  projectCount,
  cloudStatus = 'synced'
}) {
  const accent = profile.accentColor || '#e63946';

  return (
    <header className="no-print sticky top-0 z-40 bg-[#0c0c0e]/85 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand Monogram & Status */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveTab('gallery')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div 
              className="w-8 h-8 rounded-none border border-white/20 flex items-center justify-center font-mono font-bold text-xs tracking-widest text-white transition-all group-hover:border-white"
              style={{ borderColor: activeTab === 'gallery' ? accent : undefined }}
            >
              {profile.name ? profile.name.slice(0, 2).toUpperCase() : 'PF'}
            </div>
            <div>
              <div className="text-xs font-mono font-semibold tracking-wider text-white uppercase group-hover:text-white/80 transition-colors">
                {profile.name || 'PORTFOLIO ARCHIVE'}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400">
                <span 
                  className="w-1.5 h-1.5 rounded-full animate-pulse" 
                  style={{ backgroundColor: accent }} 
                />
                <span className="truncate max-w-[130px] sm:max-w-none">{profile.status || 'Available'}</span>
                
                <span className="text-neutral-600 hidden sm:inline">•</span>
                
                <div className="hidden sm:flex items-center gap-1 text-[9px] text-neutral-400 tracking-wider">
                  {cloudStatus === 'synced' ? (
                    <>
                      <Cloud size={11} className="text-emerald-400" />
                      <span className="text-emerald-400/90 font-semibold">FIREBASE CONNECTED</span>
                    </>
                  ) : cloudStatus === 'syncing' ? (
                    <>
                      <Cloud size={11} className="animate-pulse text-amber-400" />
                      <span className="text-amber-400">SYNCING...</span>
                    </>
                  ) : (
                    <>
                      <CloudOff size={11} className="text-neutral-500" />
                      <span>LOCAL MODE</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Center: View Mode Switcher */}
        <div className="hidden md:flex items-center bg-black/40 border border-white/10 p-1 rounded-sm">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono tracking-wider transition-all rounded-xs ${
              activeTab === 'gallery'
                ? 'bg-white/10 text-white font-medium shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <LayoutGrid size={13} style={{ color: activeTab === 'gallery' ? accent : 'inherit' }} />
            <span>ARCHIVE VIEW</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-white/5 border border-white/10 rounded-xs text-neutral-300">
              {projectCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('pdf-studio')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono tracking-wider transition-all rounded-xs ${
              activeTab === 'pdf-studio'
                ? 'bg-white/10 text-white font-medium shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FileText size={13} style={{ color: activeTab === 'pdf-studio' ? accent : 'inherit' }} />
            <span>PDF EXPORT STUDIO</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            onClick={onOpenNewProject}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 text-xs font-mono text-white transition-all rounded-xs focus:outline-none"
            title="Upload and create a new project"
          >
            <Plus size={14} style={{ color: accent }} />
            <span className="hidden sm:inline">ADD PROJECT</span>
          </button>

          <button
            onClick={onOpenProfile}
            className="p-2 border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 text-neutral-300 hover:text-white transition-all rounded-xs focus:outline-none"
            title="Portfolio settings, bio, accent color & backups"
          >
            <Sliders size={14} />
          </button>

          <button
            onClick={onTriggerPrint}
            className="flex items-center gap-2 px-3.5 py-1.5 font-mono text-xs font-bold text-white transition-all rounded-xs shadow-md hover:brightness-110 active:scale-95 focus:outline-none"
            style={{ backgroundColor: accent }}
            title="Instant Print / Export to PDF"
          >
            <Printer size={13} />
            <span className="tracking-wide">EXPORT PDF</span>
          </button>
        </div>

      </div>

      {/* Mobile Tab Switcher */}
      <div className="flex md:hidden mt-3 pt-2.5 border-t border-white/5 items-center justify-around text-xs font-mono">
        <button
          onClick={() => setActiveTab('gallery')}
          className={`flex items-center gap-1.5 py-1 px-3 ${activeTab === 'gallery' ? 'text-white border-b-2' : 'text-neutral-400'}`}
          style={{ borderColor: activeTab === 'gallery' ? accent : 'transparent' }}
        >
          <LayoutGrid size={13} />
          <span>ARCHIVE ({projectCount})</span>
        </button>
        <button
          onClick={() => setActiveTab('pdf-studio')}
          className={`flex items-center gap-1.5 py-1 px-3 ${activeTab === 'pdf-studio' ? 'text-white border-b-2' : 'text-neutral-400'}`}
          style={{ borderColor: activeTab === 'pdf-studio' ? accent : 'transparent' }}
        >
          <FileText size={13} />
          <span>PDF STUDIO</span>
        </button>
      </div>
    </header>
  );
}
