import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Edit3, ExternalLink, Calendar, User, Briefcase, Wrench, Sparkles } from 'lucide-react';

export default function ProjectDetailModal({
  project,
  allProjects,
  onClose,
  onEdit,
  accentColor
}) {
  const accent = accentColor || '#e63946';
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const images = project?.images || [];
  const currentPhoto = images[selectedPhotoIdx] || images[0];

  // Current project index in all projects
  const currentIndex = allProjects.findIndex(p => p.id === project.id);

  // Smooth photo transition handler
  const handlePhotoChange = (newIdx) => {
    if (newIdx === selectedPhotoIdx || newIdx < 0 || newIdx >= images.length) return;
    setIsFading(true);
    setTimeout(() => {
      setSelectedPhotoIdx(newIdx);
      setIsFading(false);
    }, 180);
  };

  const handleNextPhoto = (e) => {
    e?.stopPropagation();
    if (images.length > 1) {
      handlePhotoChange((selectedPhotoIdx + 1) % images.length);
    }
  };

  const handlePrevPhoto = (e) => {
    e?.stopPropagation();
    if (images.length > 1) {
      handlePhotoChange((selectedPhotoIdx - 1 + images.length) % images.length);
    }
  };

  // Keyboard navigation for photos & escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNextPhoto();
      if (e.key === 'ArrowLeft') handlePrevPhoto();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIdx, images.length, onClose]);

  return (
    <div 
      onClick={onClose}
      className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-2 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-300"
    >
      
      {/* Main Expansive Modal Container (Borderless, Floating Glass Feel) */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[94vw] lg:max-w-7xl bg-[#09090b]/90 border border-white/10 rounded-sm shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden my-auto max-h-[94vh] flex flex-col backdrop-blur-3xl"
      >
        
        {/* Top Minimalist Floating Bar */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-b border-white/5 bg-black/40">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs px-2.5 py-0.5 bg-white/5 text-white rounded-none tracking-widest font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accent }} />
              <span>CASE STUDY № {(currentIndex + 1).toString().padStart(2, '0')}</span>
            </span>
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest hidden sm:inline">
              // {project.category}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {onEdit && (
              <button
                onClick={() => onEdit(project)}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono text-neutral-300 hover:text-white border border-white/15 hover:border-white/40 bg-white/5 rounded-xs transition-colors"
              >
                <Edit3 size={12} />
                <span>EDIT</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 rounded-xs transition-all"
              title="Close (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body: Split Immersive Layout */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 min-h-0">
          
          {/* ======================================================== */}
          {/* LEFT: EXPANSIVE BORDERLESS ARTWORK SHOWCASE (65% width)  */}
          {/* ======================================================== */}
          <div className="lg:col-span-8 relative flex flex-col justify-between p-4 sm:p-8 bg-black/60 overflow-hidden">
            
            {/* Ambient Background Glow behind artwork */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-20 filter blur-3xl transition-opacity duration-700"
              style={{
                background: `radial-gradient(circle at center, ${accent} 0%, transparent 65%)`
              }}
            />

            {/* Central Floating Image Canvas */}
            <div className="relative flex-1 flex items-center justify-center min-h-[50vh] sm:min-h-[64vh] max-h-[72vh] overflow-hidden group">
              
              {/* Floating Edge Gradient Masks (Soft Vignette Feathering) */}
              <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_60px_rgba(9,9,11,0.7)]" />
              <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-[#09090b]/60 to-transparent pointer-events-none z-10" />
              <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-[#09090b]/60 to-transparent pointer-events-none z-10" />
              <div className="absolute left-0 inset-y-0 w-12 bg-gradient-to-r from-[#09090b]/60 to-transparent pointer-events-none z-10" />
              <div className="absolute right-0 inset-y-0 w-12 bg-gradient-to-l from-[#09090b]/60 to-transparent pointer-events-none z-10" />

              {/* Main Image with Smooth Cross-fade and Floating Shadow */}
              {currentPhoto ? (
                <img
                  key={selectedPhotoIdx}
                  src={currentPhoto}
                  alt={project.title}
                  className={`w-full h-full object-contain max-h-[70vh] transition-all duration-500 ease-out filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] ${
                    isFading ? 'opacity-0 scale-98 blur-xs' : 'opacity-100 scale-100 blur-0'
                  }`}
                />
              ) : (
                <span className="font-mono text-xs text-neutral-600">No media available</span>
              )}

              {/* Left / Right Arrow Floating Controls */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevPhoto}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/10 hover:border-white/30 transition-all opacity-80 hover:opacity-100 hover:scale-105"
                    title="Previous photo (←)"
                  >
                    <ChevronLeft size={22} />
                  </button>

                  <button
                    onClick={handleNextPhoto}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/10 hover:border-white/30 transition-all opacity-80 hover:opacity-100 hover:scale-105"
                    title="Next photo (→)"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}

              {/* Photo Counter Pill */}
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 z-20 px-3 py-1 bg-black/75 backdrop-blur-md border border-white/10 text-xs font-mono text-neutral-200 rounded-full tracking-wider shadow-lg">
                  {selectedPhotoIdx + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Seamless Borderless Thumbnail Strip */}
            {images.length > 1 && (
              <div className="mt-4 pt-4 flex items-center justify-center gap-3 overflow-x-auto pb-1 z-20 scrollbar-none">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => handlePhotoChange(i)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xs overflow-hidden transition-all duration-300 cursor-pointer ${
                      selectedPhotoIdx === i
                        ? 'scale-105 ring-2 shadow-xl opacity-100'
                        : 'opacity-40 hover:opacity-90 hover:scale-100 ring-0'
                    }`}
                    style={{
                      ringColor: selectedPhotoIdx === i ? accent : 'transparent'
                    }}
                  >
                    <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                    {selectedPhotoIdx === i && (
                      <div className="absolute bottom-0 inset-x-0 h-1" style={{ backgroundColor: accent }} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* RIGHT: EDITORIAL & IMMERSIVE CASE STUDY TEXT (35% width) */}
          {/* ======================================================== */}
          <div className="lg:col-span-4 p-6 sm:p-10 flex flex-col justify-between space-y-8 bg-[#09090b]/80 border-t lg:border-t-0 lg:border-l border-white/5">
            <div>
              {/* Category & Status Eyebrow */}
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-3 tracking-widest uppercase">
                <span className="font-bold" style={{ color: accent }}>{project.category}</span>
                <span>•</span>
                <span>RELEASE YEAR {project.year || '2026'}</span>
              </div>

              {/* Title */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading uppercase tracking-tight text-white leading-[1.02] mb-6">
                {project.title}
              </h2>

              {/* Description - Editorial Narrative Typography */}
              <div className="text-neutral-300 text-sm sm:text-base font-light leading-relaxed whitespace-pre-line space-y-4">
                <p className="border-l-2 pl-4 border-white/20 italic text-neutral-200">
                  {project.description || 'Monolithic visual exploration crafted with high typographic precision, balanced spatial hierarchy, and material tactility.'}
                </p>
              </div>

              {/* Metadata Cards */}
              <div className="mt-8 pt-6 border-t border-white/10 space-y-3.5 text-xs font-mono">
                {project.client && (
                  <div className="flex items-center justify-between py-2 px-3 bg-white/[0.02] border border-white/5 rounded-xs">
                    <span className="text-neutral-500 flex items-center gap-2 uppercase">
                      <Briefcase size={13} style={{ color: accent }} /> CLIENT
                    </span>
                    <span className="text-white font-semibold text-right">{project.client}</span>
                  </div>
                )}

                {project.role && (
                  <div className="flex items-center justify-between py-2 px-3 bg-white/[0.02] border border-white/5 rounded-xs">
                    <span className="text-neutral-500 flex items-center gap-2 uppercase">
                      <User size={13} style={{ color: accent }} /> DISCIPLINE / ROLE
                    </span>
                    <span className="text-white font-semibold text-right">{project.role}</span>
                  </div>
                )}

                {project.year && (
                  <div className="flex items-center justify-between py-2 px-3 bg-white/[0.02] border border-white/5 rounded-xs">
                    <span className="text-neutral-500 flex items-center gap-2 uppercase">
                      <Calendar size={13} style={{ color: accent }} /> ARCHIVE YEAR
                    </span>
                    <span className="text-white font-semibold text-right">{project.year}</span>
                  </div>
                )}

                {/* Tools & Specifications */}
                {project.tools && project.tools.length > 0 && (
                  <div className="pt-3">
                    <span className="text-neutral-500 flex items-center gap-2 uppercase mb-2.5">
                      <Wrench size={13} style={{ color: accent }} /> TOOLS & SPECIFICATIONS
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tools.map((t, idx) => (
                        <span 
                          key={idx} 
                          className="px-2.5 py-1 bg-white/5 border border-white/10 text-neutral-200 rounded-xs text-[11px] font-mono tracking-wide"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Footer Info */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400">
              <span className="text-[11px] text-neutral-500">
                [ ← ] [ → ] TO BROWSE • [ ESC ] CLOSE
              </span>

              {project.externalLink && (
                <a
                  href={project.externalLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-white hover:underline font-semibold"
                  style={{ color: accent }}
                >
                  <span>LIVE PROJECT</span>
                  <ExternalLink size={13} />
                </a>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
