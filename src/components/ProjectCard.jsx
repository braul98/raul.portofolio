import React from 'react';
import { Edit3, Trash2, ArrowUpRight, Star, Image as ImageIcon } from 'lucide-react';

export default function ProjectCard({
  project,
  index,
  accentColor,
  layoutMode,
  onSelect,
  onEdit,
  onDelete
}) {
  const accent = accentColor || '#e63946';
  const coverImage = (project.images && project.images[project.coverIndex || 0]) || project.images?.[0];
  const imageCount = project.images?.length || 0;

  // List View Layout
  if (layoutMode === 'list') {
    return (
      <div 
        onClick={() => onSelect(project)}
        className="group border-b border-white/10 hover:border-white/30 py-4 px-2 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer transition-all hover:bg-white/[0.02]"
      >
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-neutral-500 w-8">
            {(index + 1).toString().padStart(2, '0')}
          </span>
          {coverImage && (
            <div className="w-14 h-14 bg-neutral-900 border border-white/10 overflow-hidden shrink-0">
              <img 
                src={coverImage} 
                alt={project.title} 
                className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500" 
              />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-white group-hover:text-white transition-colors tracking-tight">
                {project.title}
              </h3>
              {project.featured && (
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
              )}
            </div>
            <p className="text-xs text-neutral-400 font-mono mt-0.5 line-clamp-1">
              {project.client ? `${project.client} — ` : ''}{project.category}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-6 text-xs font-mono text-neutral-400">
          <span>{project.year || '2025'}</span>
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onEdit(project)}
              className="p-1.5 text-neutral-400 hover:text-white transition-colors"
              title="Edit project"
            >
              <Edit3 size={13} />
            </button>
            <button
              onClick={() => onDelete(project.id)}
              className="p-1.5 text-neutral-400 hover:text-red-400 transition-colors"
              title="Delete project"
            >
              <Trash2 size={13} />
            </button>
          </div>
          <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" style={{ color: accent }} />
        </div>
      </div>
    );
  }

  // Grid / Editorial Layout
  return (
    <article 
      onClick={() => onSelect(project)}
      className="group relative flex flex-col bg-[#0f0f12] border border-white/10 hover:border-white/30 rounded-xs overflow-hidden transition-all duration-300 hover:shadow-2xl cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-neutral-950 overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={project.title}
            className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 filter grayscale contrast-125 group-hover:grayscale-0"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600 font-mono text-xs gap-2">
            <ImageIcon size={28} />
            <span>NO IMAGE UPLOADED</span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-black/80 backdrop-blur-md text-white border border-white/15 rounded-xs tracking-wider">
              № {(index + 1).toString().padStart(2, '0')}
            </span>
            {project.featured && (
              <span 
                className="font-mono text-[9px] font-bold px-2 py-0.5 text-white tracking-widest uppercase rounded-xs shadow-sm"
                style={{ backgroundColor: accent }}
              >
                FEATURED
              </span>
            )}
          </div>

          {imageCount > 1 && (
            <span className="font-mono text-[10px] px-2 py-0.5 bg-black/80 backdrop-blur-md text-neutral-300 border border-white/15 rounded-xs">
              +{imageCount - 1} SHOTS
            </span>
          )}
        </div>

        {/* Hover Quick Edit / Delete Overlay */}
        <div 
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-black/85 backdrop-blur-md p-1 border border-white/20 rounded-xs"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onEdit(project)}
            className="p-1.5 text-neutral-300 hover:text-white transition-colors"
            title="Edit project details & photos"
          >
            <Edit3 size={13} />
          </button>
          <button
            onClick={() => onDelete(project.id)}
            className="p-1.5 text-neutral-300 hover:text-red-400 transition-colors"
            title="Delete project"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Content Meta */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs font-mono text-neutral-400 mb-1.5">
            <span className="uppercase tracking-wider">{project.category}</span>
            <span>{project.year || '2025'}</span>
          </div>

          <h3 className="text-lg font-bold tracking-tight text-white uppercase group-hover:text-white transition-colors flex items-center justify-between">
            <span>{project.title}</span>
            <ArrowUpRight 
              size={15} 
              className="text-neutral-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" 
              style={{ color: accent }}
            />
          </h3>

          {project.description && (
            <p className="mt-2 text-xs text-neutral-400 line-clamp-2 font-light leading-relaxed">
              {project.description}
            </p>
          )}
        </div>

        {/* Bottom Tags / Client */}
        {(project.client || (project.tools && project.tools.length > 0)) && (
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-neutral-500">
            <span className="truncate max-w-[160px]">
              {project.client ? `CLIENT: ${project.client}` : ''}
            </span>
            {project.tools?.[0] && (
              <span className="px-1.5 py-0.5 bg-white/5 rounded-xs text-neutral-400">
                {project.tools[0]}
              </span>
            )}
          </div>
        )}
      </div>

    </article>
  );
}
