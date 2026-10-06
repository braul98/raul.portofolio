import React from 'react';

export default function PublicNavbar({ profile }) {
  const accent = profile.accentColor || '#e63946';

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="no-print sticky top-0 z-40 bg-[#0c0c0e]/85 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand Monogram & Name */}
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-none border border-white/20 flex items-center justify-center font-mono font-bold text-xs tracking-widest text-white transition-all"
            style={{ borderColor: accent }}
          >
            {profile.name ? profile.name.slice(0, 2).toUpperCase() : 'PF'}
          </div>
          <div>
            <div className="text-xs font-mono font-semibold tracking-wider text-white uppercase">
              {profile.name || 'PORTFOLIO ARCHIVE'}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400">
              <span 
                className="w-1.5 h-1.5 rounded-full animate-pulse" 
                style={{ backgroundColor: accent }} 
              />
              <span className="truncate max-w-[150px] sm:max-w-none">{profile.status || 'Available for commissions'}</span>
            </div>
          </div>
        </div>

        {/* Right: Smooth Scroll Links */}
        <nav className="flex items-center gap-6 sm:gap-8 text-xs font-mono tracking-wider">
          <button
            onClick={() => scrollToSection('works')}
            className="text-neutral-400 hover:text-white transition-colors uppercase cursor-pointer"
          >
            WORKS
          </button>
          
          <button
            onClick={() => scrollToSection('skills')}
            className="text-neutral-400 hover:text-white transition-colors uppercase cursor-pointer flex items-center gap-1"
          >
            <span>SKILLS</span>
            <span className="w-1 h-1 rounded-full" style={{ backgroundColor: accent }} />
          </button>

          <button
            onClick={() => scrollToSection('contact')}
            className="text-neutral-400 hover:text-white transition-colors uppercase cursor-pointer"
          >
            CONTACT
          </button>
        </nav>

      </div>
    </header>
  );
}
