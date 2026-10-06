import React from 'react';
import { ArrowDownRight, Globe, Mail, MapPin } from 'lucide-react';

export default function Hero({ profile, projects, onOpenProfile }) {
  const accent = profile.accentColor || '#e63946';

  const categories = Array.from(new Set(projects.map(p => p.category))).slice(0, 4);

  return (
    <section className="no-print pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Top Metabar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-neutral-400 mb-6 pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span style={{ color: accent }}>№ 01</span>
            <span>//</span>
            <span className="tracking-widest uppercase">{profile.role || 'VISUAL ARCHIVE'}</span>
          </div>

          <div className="flex items-center gap-4">
            {profile.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={11} style={{ color: accent }} />
                <span>{profile.location}</span>
              </span>
            )}
            <span className="hidden sm:inline text-neutral-600">|</span>
            <span className="text-neutral-400">INDEX: 2024—2026</span>
          </div>
        </div>

        {/* Large Editorial Headline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-8">
          <div className="lg:col-span-8">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white uppercase leading-[0.95]">
              {profile.name || 'PORTFOLIO ARCHIVE'}
            </h1>
            <p className="mt-4 text-base sm:text-xl text-neutral-300 font-normal max-w-2xl leading-relaxed">
              {profile.tagline || 'Curated portfolio of visual systems, editorial experiments, and architectural case studies.'}
            </p>
          </div>

          {/* Quick Details Sidebar */}
          <div className="lg:col-span-4 flex flex-col justify-between border-l border-white/10 lg:pl-8 py-1 space-y-4">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block mb-1">
                DISCIPLINES
              </span>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat, i) => (
                  <span 
                    key={i} 
                    className="text-xs font-mono px-2 py-0.5 bg-white/5 border border-white/10 text-neutral-300 rounded-xs"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-500">CURATED WORKS</span>
              <span className="text-white font-bold" style={{ color: accent }}>
                {projects.length.toString().padStart(2, '0')} PIECES
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-1.5 text-xs font-mono text-neutral-300 hover:text-white transition-colors"
                >
                  <Mail size={12} style={{ color: accent }} />
                  <span>CONTACT</span>
                </a>
              )}
              {profile.website && (
                <a
                  href={`https://${profile.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs font-mono text-neutral-300 hover:text-white transition-colors"
                >
                  <Globe size={12} style={{ color: accent }} />
                  <span>{profile.website}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bio Strip */}
        {profile.bio && (
          <div className="p-4 bg-white/[0.02] border border-white/10 rounded-xs flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed max-w-4xl">
              <strong className="text-white font-mono uppercase text-xs mr-2" style={{ color: accent }}>
                [ STATEMENT ]
              </strong>
              {profile.bio}
            </p>
            {onOpenProfile && (
              <button
                onClick={onOpenProfile}
                className="text-xs font-mono text-neutral-400 hover:text-white whitespace-nowrap flex items-center gap-1 transition-colors self-end md:self-auto"
              >
                <span>EDIT BIO</span>
                <ArrowDownRight size={13} style={{ color: accent }} />
              </button>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
