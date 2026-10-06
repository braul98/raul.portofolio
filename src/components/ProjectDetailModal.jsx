import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Edit3, ExternalLink, Calendar, User, Briefcase, Wrench } from 'lucide-react';

export default function ProjectDetailModal({
  project,
  allProjects,
  onClose,
  onEdit,
  accentColor
}) {
  const accent = accentColor || '#e63946';
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);

  // Find index in current project list
  const currentIndex = allProjects.findIndex(p => p.id === project.id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && prevProject) {
        onEdit(null); // Just close edit state if open
        // handled in parent if we change project, or we can emit
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, prevProject]);

  const images = project.images || [];
  const currentPhoto = images[selectedPhotoIdx] || images[0];

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-2 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      
      {/* Container */}
      <div className="relative w-full max-w-6xl bg-[#0e0e11] border border-white/15 rounded-xs shadow-2xl overflow-hidden my-auto max-h-[96vh] flex flex-col">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#121216]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs px-2 py-0.5 border border-white/20 text-neutral-300 rounded-xs">
              CASE STUDY № {(currentIndex + 1).toString().padStart(2, '0')}
            </span>
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest hidden sm:inline">
              {project.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(project)}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono text-neutral-300 hover:text-white border border-white/15 hover:border-white/40 rounded-xs transition-colors"
            >
              <Edit3 size={12} />
              <span>EDIT</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white border border-white/10 hover:border-white/30 rounded-xs transition-colors"
              title="Close (Esc)"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Modal Body: Split Layout */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
          
          {/* Left Column: High-Res Image Display */}
          <div className="lg:col-span-7 p-4 sm:p-6 flex flex-col justify-between bg-black/40">
            {/* Primary Main Photo */}
            <div className="relative aspect-[4/3] bg-neutral-950 border border-white/10 rounded-xs overflow-hidden flex items-center justify-center">
              {currentPhoto ? (
                <img
                  src={currentPhoto}
                  alt={project.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="font-mono text-xs text-neutral-600">No image available</span>
              )}

              {/* Photo Index Tag */}
              {images.length > 1 && (
                <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/80 backdrop-blur-md border border-white/15 text-[11px] font-mono text-white rounded-xs">
                  {selectedPhotoIdx + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Carousel if multiple images */}
            {images.length > 1 && (
              <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPhotoIdx(i)}
                    className={`relative w-16 h-16 shrink-0 border rounded-xs overflow-hidden transition-all ${
                      selectedPhotoIdx === i
                        ? 'border-2 scale-105'
                        : 'border-white/20 opacity-60 hover:opacity-100'
                    }`}
                    style={{ borderColor: selectedPhotoIdx === i ? accent : undefined }}
                  >
                    <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Case Study Editorial Text & Specs */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-2">
                <span>{project.year || '2025'}</span>
                <span>•</span>
                <span className="uppercase" style={{ color: accent }}>{project.category}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white mb-4">
                {project.title}
              </h2>

              <div className="prose prose-invert max-w-none text-neutral-300 text-sm font-light leading-relaxed mb-6 whitespace-pre-line">
                {project.description || 'No detailed case study description provided for this work.'}
              </div>

              {/* Project Metadata Table */}
              <div className="space-y-3 pt-6 border-t border-white/10 text-xs font-mono">
                {project.client && (
                  <div className="flex items-center justify-between py-1 border-b border-white/5">
                    <span className="text-neutral-500 flex items-center gap-1.5">
                      <Briefcase size={12} /> CLIENT
                    </span>
                    <span className="text-white font-medium">{project.client}</span>
                  </div>
                )}

                {project.role && (
                  <div className="flex items-center justify-between py-1 border-b border-white/5">
                    <span className="text-neutral-500 flex items-center gap-1.5">
                      <User size={12} /> ROLE
                    </span>
                    <span className="text-white font-medium">{project.role}</span>
                  </div>
                )}

                {project.year && (
                  <div className="flex items-center justify-between py-1 border-b border-white/5">
                    <span className="text-neutral-500 flex items-center gap-1.5">
                      <Calendar size={12} /> YEAR
                    </span>
                    <span className="text-white font-medium">{project.year}</span>
                  </div>
                )}

                {project.tools && project.tools.length > 0 && (
                  <div className="pt-2">
                    <span className="text-neutral-500 flex items-center gap-1.5 mb-2">
                      <Wrench size={12} /> TOOLS & SPECIFICATIONS
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tools.map((t, i) => (
                        <span 
                          key={i} 
                          className="px-2 py-0.5 bg-white/5 border border-white/10 text-neutral-300 rounded-xs text-[11px]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>PRESS ESC TO CLOSE</span>
              {project.externalLink && (
                <a
                  href={project.externalLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-white hover:underline"
                  style={{ color: accent }}
                >
                  <span>LIVE PROJECT</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
