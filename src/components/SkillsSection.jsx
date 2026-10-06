import React from 'react';
import { Sparkles, Layers, Sliders } from 'lucide-react';

export default function SkillsSection({ skills, accentColor, onNavigateToAdmin }) {
  const accent = accentColor || '#e63946';

  if (!skills || skills.length === 0) return null;

  return (
    <section id="skills" className="no-print py-16 sm:py-24 border-t border-white/10 bg-[#0e0e11] scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
              <span className="tracking-widest uppercase">CORE CAPABILITIES & MASTERY</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold font-heading uppercase text-white tracking-tight">
              SKILLS & EXPERTISE
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
            <span>INDEX: {skills.length} DISCIPLINES</span>
          </div>
        </div>

        {/* Skills Progress Bars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {skills.map((skill, index) => (
            <div key={skill.id || index} className="group flex flex-col space-y-2.5">
              
              {/* Skill Info Row */}
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2.5">
                  <span className="text-neutral-500 text-[11px]">
                    {(index + 1).toString().padStart(2, '0')}.
                  </span>
                  <span className="text-sm font-semibold uppercase text-white tracking-wide group-hover:text-white transition-colors">
                    {skill.name}
                  </span>
                  {skill.category && (
                    <span className="text-[10px] px-1.5 py-0.2 bg-white/5 border border-white/10 text-neutral-400 rounded-xs uppercase">
                      {skill.category}
                    </span>
                  )}
                </div>

                <span className="font-bold tracking-wider" style={{ color: accent }}>
                  {skill.percentage}%
                </span>
              </div>

              {/* Progress Bar Track */}
              <div className="w-full h-2 bg-neutral-900 border border-white/10 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${Math.min(100, Math.max(0, skill.percentage))}%`,
                    backgroundColor: accent,
                    boxShadow: `0 0 10px ${accent}40`
                  }}
                />
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
