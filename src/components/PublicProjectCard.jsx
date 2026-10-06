import React from 'react';
import { ArrowUpRight, Calendar, User, Briefcase, ExternalLink, Image as ImageIcon } from 'lucide-react';

export default function PublicProjectCard({
  project,
  index,
  accentColor,
  onSelect
}) {
  const accent = accentColor || '#e63946';
  const coverImage = (project.images && project.images[project.coverIndex || 0]) || project.images?.[0];
  const isEven = index % 2 === 0;

  return (
    <article
      onClick={() => onSelect(project)}
      className="group relative bg-[#0f0f13] border border-white/10 hover:border-white/30 rounded-xs overflow-hidden transition-all duration-300 hover:shadow-2xl cursor-pointer"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
        
        {/* Large Image Showcase (60% width on desktop) - Full Natural Color */}
        <div className={`lg:col-span-7 relative min-h-[360px] sm:min-h-[440px] bg-neutral-950 overflow-hidden ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
          {coverImage ? (
            <img
              src={coverImage}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600 font-mono text-xs gap-2">
              <ImageIcon size={32} />
              <span>NO VISUAL AVAILABLE</span>
            </div>
          )}

          {/* Badges on artwork */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2.5 py-1 bg-black/85 backdrop-blur-md text-white border border-white/15 rounded-xs tracking-wider">
              № {(index + 1).toString().padStart(2, '0')}
            </span>
            {project.featured && (
              <span 
                className="font-mono text-[10px] font-bold px-2 py-0.8 text-white tracking-widest uppercase rounded-xs shadow-md"
                style={{ backgroundColor: accent }}
              >
                FEATURED
              </span>
            )}
          </div>

          {project.images?.length > 1 && (
            <div className="absolute bottom-4 right-4 px-2.5 py-1 bg-black/85 backdrop-blur-md border border-white/15 text-xs font-mono text-neutral-200 rounded-xs">
              +{project.images.length - 1} VIEWS
            </div>
          )}
        </div>

        {/* Narrative & Details Area (40% width adjacent to image) */}
        <div className={`lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
          <div>
            {/* Category & Year Header */}
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-3 pb-3 border-b border-white/10">
              <span className="uppercase font-semibold tracking-wider" style={{ color: accent }}>
                {project.category}
              </span>
              <span>{project.year || '2025'}</span>
            </div>

            {/* Title */}
            <h3 className="text-2xl sm:text-3xl font-bold font-heading uppercase text-white tracking-tight leading-tight group-hover:text-white transition-colors flex items-center justify-between gap-2">
              <span>{project.title}</span>
              <ArrowUpRight 
                size={20} 
                className="shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                style={{ color: accent }}
              />
            </h3>

            {/* Narrative Excerpt */}
            {project.description && (
              <p className="mt-4 text-sm text-neutral-300 font-light leading-relaxed line-clamp-4">
                {project.description}
              </p>
            )}

            {/* Metadata Badges */}
            <div className="mt-6 space-y-2 pt-4 border-t border-white/10 text-xs font-mono text-neutral-400">
              {project.client && (
                <div className="flex items-center justify-between py-0.5">
                  <span className="text-neutral-500">CLIENT</span>
                  <span className="text-white font-medium">{project.client}</span>
                </div>
              )}
              {project.role && (
                <div className="flex items-center justify-between py-0.5">
                  <span className="text-neutral-500">ROLE</span>
                  <span className="text-white font-medium">{project.role}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tools & Call to Action */}
          <div>
            {project.tools && project.tools.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-6">
                {project.tools.slice(0, 4).map((tool, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[10px] font-mono px-2 py-0.5 bg-white/5 border border-white/10 text-neutral-300 rounded-xs"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs font-mono">
              <span className="text-neutral-400 group-hover:text-white transition-colors flex items-center gap-1">
                <span>VIEW CASE STUDY</span>
                <ArrowUpRight size={13} style={{ color: accent }} />
              </span>
              <span className="text-neutral-500 text-[11px]">CLICK TO EXPAND</span>
            </div>
          </div>

        </div>

      </div>
    </article>
  );
}
