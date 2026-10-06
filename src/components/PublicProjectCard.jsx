import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Briefcase, User, Calendar, Wrench, ExternalLink, Maximize2, Image as ImageIcon } from 'lucide-react';

export default function PublicProjectCard({
  project,
  index,
  accentColor,
  onOpenZoom
}) {
  const accent = accentColor || '#e63946';
  const images = project?.images || [];
  const [activeIdx, setActiveIdx] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const currentPhoto = images[activeIdx] || images[0];
  const isEven = index % 2 === 0;

  // Smooth photo transition
  const handlePhotoSelect = (idx) => {
    if (idx === activeIdx || idx < 0 || idx >= images.length) return;
    setIsFading(true);
    setTimeout(() => {
      setActiveIdx(idx);
      setIsFading(false);
    }, 180);
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    if (images.length > 1) {
      handlePhotoSelect((activeIdx + 1) % images.length);
    }
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
    if (images.length > 1) {
      handlePhotoSelect((activeIdx - 1 + images.length) % images.length);
    }
  };

  return (
    <article className="group relative bg-[#09090b]/80 border border-white/10 hover:border-white/20 rounded-sm shadow-2xl backdrop-blur-xl overflow-hidden transition-all duration-500">
      
      {/* Top Project Sub-Header Bar */}
      <div className="flex items-center justify-between px-6 sm:px-10 py-3.5 border-b border-white/5 bg-black/40 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="font-bold tracking-widest text-white flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
            <span>№ {(index + 1).toString().padStart(2, '0')}</span>
          </span>
          <span className="text-neutral-500 hidden sm:inline">//</span>
          <span className="text-neutral-400 uppercase tracking-widest">
            {project.category}
          </span>
        </div>

        <div className="flex items-center gap-3 text-neutral-400">
          <span>ARCHIVE {project.year || '2026'}</span>
          {project.featured && (
            <span 
              className="text-[9px] font-bold px-2 py-0.5 text-white tracking-widest uppercase rounded-none"
              style={{ backgroundColor: accent }}
            >
              FEATURED
            </span>
          )}
        </div>
      </div>

      {/* Main Grid: Artwork + Case Study Typography */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
        
        {/* ======================================================== */}
        {/* ARTWORK CANVAS (65% width on desktop) - FLOATING & LARGE */}
        {/* ======================================================== */}
        <div className={`lg:col-span-8 relative flex flex-col justify-between p-4 sm:p-8 bg-black/60 overflow-hidden ${
          isEven ? 'lg:order-1' : 'lg:order-2'
        }`}>
          
          {/* Ambient Glow behind the photo */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20 filter blur-3xl"
            style={{
              background: `radial-gradient(circle at center, ${accent} 0%, transparent 70%)`
            }}
          />

          {/* Central Image Container with Floating Gradient Masks */}
          <div className="relative flex-1 flex items-center justify-center min-h-[440px] sm:min-h-[560px] lg:min-h-[640px] max-h-[720px] overflow-hidden group/img">
            
            {/* Soft Edge Gradient Masks (Floating Edge Feathering) */}
            <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_50px_rgba(9,9,11,0.6)]" />
            <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-[#09090b]/40 to-transparent pointer-events-none z-10" />
            <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-[#09090b]/40 to-transparent pointer-events-none z-10" />

            {/* Main Visual */}
            {currentPhoto ? (
              <img
                key={activeIdx}
                src={currentPhoto}
                alt={project.title}
                onClick={() => onOpenZoom && onOpenZoom(currentPhoto, project.title)}
                className={`w-full h-full object-contain max-h-[620px] transition-all duration-500 ease-out cursor-zoom-in filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] ${
                  isFading ? 'opacity-0 scale-98 blur-xs' : 'opacity-100 scale-100 blur-0'
                }`}
                title="Click to view full-resolution"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600 font-mono text-xs gap-2">
                <ImageIcon size={32} />
                <span>NO VISUAL AVAILABLE</span>
              </div>
            )}

            {/* Left / Right Arrow Controls */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/10 hover:border-white/30 transition-all opacity-80 hover:opacity-100 hover:scale-105"
                  title="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/10 hover:border-white/30 transition-all opacity-80 hover:opacity-100 hover:scale-105"
                  title="Next image"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Bottom Status Tag */}
            <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2">
              {images.length > 1 && (
                <span className="px-2.5 py-1 bg-black/75 backdrop-blur-md border border-white/10 text-xs font-mono text-neutral-200 rounded-full tracking-wider shadow-lg">
                  {activeIdx + 1} / {images.length}
                </span>
              )}

              {onOpenZoom && currentPhoto && (
                <button
                  onClick={() => onOpenZoom(currentPhoto, project.title)}
                  className="p-1.5 bg-black/75 backdrop-blur-md border border-white/10 text-neutral-300 hover:text-white rounded-full transition-colors"
                  title="Inspect Fullscreen"
                >
                  <Maximize2 size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Borderless In-Page Thumbnail Switcher */}
          {images.length > 1 && (
            <div className="mt-4 pt-3 flex items-center justify-center gap-2.5 overflow-x-auto pb-1 z-20 scrollbar-none">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => handlePhotoSelect(i)}
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-xs overflow-hidden transition-all duration-300 cursor-pointer ${
                    activeIdx === i
                      ? 'scale-105 ring-2 shadow-xl opacity-100'
                      : 'opacity-40 hover:opacity-90 hover:scale-100 ring-0'
                  }`}
                  style={{
                    ringColor: activeIdx === i ? accent : 'transparent'
                  }}
                >
                  <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                  {activeIdx === i && (
                    <div className="absolute bottom-0 inset-x-0 h-1" style={{ backgroundColor: accent }} />
                  )}
                </button>
              ))}
            </div>
          )}

        </div>

        {/* ======================================================== */}
        {/* EDITORIAL CASE STUDY & METADATA (35% width)              */}
        {/* ======================================================== */}
        <div className={`lg:col-span-4 p-6 sm:p-10 flex flex-col justify-between space-y-6 bg-[#0a0a0d]/90 border-t lg:border-t-0 ${
          isEven ? 'lg:order-2 lg:border-l border-white/5' : 'lg:order-1 lg:border-r border-white/5'
        }`}>
          <div>
            {/* Category / Discipline */}
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-2 tracking-widest uppercase">
              <span className="font-bold" style={{ color: accent }}>{project.category}</span>
              <span>•</span>
              <span>{project.year || '2026'}</span>
            </div>

            {/* Display Title */}
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading uppercase tracking-tight text-white leading-[1.05] mb-5">
              {project.title}
            </h3>

            {/* Case Study Narrative Description */}
            <div className="text-neutral-300 text-sm font-light leading-relaxed whitespace-pre-line space-y-3">
              <p className="border-l-2 pl-3.5 border-white/20 italic text-neutral-200">
                {project.description || 'Monolithic visual exploration crafted with high typographic precision, balanced spatial hierarchy, and material tactility.'}
              </p>
            </div>

            {/* Structured Metadata Cards */}
            <div className="mt-8 pt-6 border-t border-white/10 space-y-3 text-xs font-mono">
              {project.client && (
                <div className="flex items-center justify-between py-2 px-3 bg-white/[0.02] border border-white/5 rounded-xs">
                  <span className="text-neutral-500 flex items-center gap-1.5 uppercase">
                    <Briefcase size={12} style={{ color: accent }} /> CLIENT
                  </span>
                  <span className="text-white font-semibold text-right">{project.client}</span>
                </div>
              )}

              {project.role && (
                <div className="flex items-center justify-between py-2 px-3 bg-white/[0.02] border border-white/5 rounded-xs">
                  <span className="text-neutral-500 flex items-center gap-1.5 uppercase">
                    <User size={12} style={{ color: accent }} /> ROLE
                  </span>
                  <span className="text-white font-semibold text-right">{project.role}</span>
                </div>
              )}

              {project.year && (
                <div className="flex items-center justify-between py-2 px-3 bg-white/[0.02] border border-white/5 rounded-xs">
                  <span className="text-neutral-500 flex items-center gap-1.5 uppercase">
                    <Calendar size={12} style={{ color: accent }} /> ARCHIVE YEAR
                  </span>
                  <span className="text-white font-semibold text-right">{project.year}</span>
                </div>
              )}

              {/* Tools & Specifications */}
              {project.tools && project.tools.length > 0 && (
                <div className="pt-2">
                  <span className="text-neutral-500 flex items-center gap-1.5 uppercase mb-2">
                    <Wrench size={12} style={{ color: accent }} /> TOOLS & SPECIFICATIONS
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tools.map((t, idx) => (
                      <span 
                        key={idx} 
                        className="px-2 py-0.5 bg-white/5 border border-white/10 text-neutral-200 rounded-xs text-[11px] font-mono tracking-wide"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Reference Link */}
          {project.externalLink && (
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-500 uppercase">EXTERNAL REF</span>
              <a
                href={project.externalLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-white hover:underline font-semibold"
                style={{ color: accent }}
              >
                <span>VIEW CASE STUDY</span>
                <ExternalLink size={13} />
              </a>
            </div>
          )}

        </div>

      </div>

    </article>
  );
}
