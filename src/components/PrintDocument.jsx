import React from 'react';

export default function PrintDocument({
  profile,
  projects,
  selectedProjectIds,
  options = {
    includeCover: true,
    includeColophon: true,
    grayscalePhotos: false
  }
}) {
  const accent = profile.accentColor || '#e63946';

  // Filter projects by selected IDs
  const activeProjects = projects.filter(p => selectedProjectIds.includes(p.id));

  return (
    <div className="print-document bg-white text-[#09090b] font-sans">
      
      {/* ======================================================== */}
      {/* PAGE 1: EDITORIAL COVER & TABLE OF CONTENTS              */}
      {/* ======================================================== */}
      {options.includeCover && (
        <section className="print-page page-break relative min-h-[297mm] p-[16mm] flex flex-col justify-between bg-white border border-neutral-200 print:border-none box-border">
          
          {/* Top Running Header */}
          <div className="flex items-center justify-between border-b border-black/80 pb-3 text-[9pt] font-mono tracking-widest uppercase">
            <div className="flex items-center gap-2 font-bold">
              <span className="w-2 h-2 inline-block" style={{ backgroundColor: accent }} />
              <span>{profile.name || 'PORTFOLIO ARCHIVE'}</span>
            </div>
            <div className="text-neutral-600">
              {profile.role || 'VISUAL DESIGN ARCHIVE'}
            </div>
            <div>
              EDITION // {new Date().getFullYear()}
            </div>
          </div>

          {/* Central Typographic Statement */}
          <div className="my-auto py-12">
            <div className="text-[11pt] font-mono tracking-widest text-neutral-500 uppercase mb-3 flex items-center gap-2">
              <span style={{ color: accent }}>№ VOL. 01</span>
              <span>—</span>
              <span>SELECTED CASE STUDIES & WORKS</span>
            </div>

            <h1 className="text-[44pt] font-bold tracking-tighter uppercase leading-[0.92] text-black">
              {profile.name || 'PORTFOLIO'}
            </h1>

            <div className="w-16 h-1 mt-6 mb-6" style={{ backgroundColor: accent }} />

            <p className="text-[13pt] text-neutral-700 max-w-xl font-normal leading-relaxed">
              {profile.tagline || 'A curated monograph of visual systems, editorial photography, and spatial design.'}
            </p>

            {profile.bio && (
              <p className="mt-4 text-[10pt] text-neutral-600 max-w-xl leading-relaxed italic border-l-2 pl-3 border-neutral-300">
                "{profile.bio}"
              </p>
            )}
          </div>

          {/* Bottom: Table of Contents / Index */}
          <div className="border-t border-black/80 pt-6">
            <div className="flex items-center justify-between text-[9pt] font-mono tracking-widest uppercase mb-4 text-neutral-500 font-bold">
              <span>TABLE OF CONTENTS // {activeProjects.length} WORKS</span>
              <span>LOCATION: {profile.location || 'INTERNATIONAL'}</span>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[9pt] font-mono">
              {activeProjects.map((p, idx) => (
                <div key={p.id} className="flex items-center justify-between border-b border-neutral-200 pb-1">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold" style={{ color: accent }}>
                      {(idx + 1).toString().padStart(2, '0')}.
                    </span>
                    <span className="font-semibold text-black uppercase truncate">{p.title}</span>
                  </div>
                  <span className="text-neutral-500 text-[8pt] uppercase shrink-0 ml-2">
                    {p.category}
                  </span>
                </div>
              ))}
            </div>

            {/* Colophon footer info on cover */}
            <div className="mt-8 pt-3 border-t border-neutral-200 flex items-center justify-between text-[8pt] font-mono text-neutral-500">
              <span>DOC REF: {new Date().toISOString().slice(0, 10)}</span>
              <span>CONTACT: {profile.email || 'DIRECT INQUIRIES'}</span>
              <span>PAGE 01</span>
            </div>
          </div>

        </section>
      )}

      {/* ======================================================== */}
      {/* PAGES 2..N: INDIVIDUAL PROJECT SPREADS                   */}
      {/* ======================================================== */}
      {activeProjects.map((proj, pIdx) => {
        const coverImg = proj.images?.[proj.coverIndex || 0] || proj.images?.[0];
        const secondaryImg = proj.images?.[1];
        const actualPageNum = (options.includeCover ? 2 : 1) + pIdx;

        return (
          <section 
            key={proj.id} 
            className="print-page page-break relative min-h-[297mm] p-[16mm] flex flex-col justify-between bg-white border border-neutral-200 print:border-none box-border"
          >
            {/* Running Header */}
            <div className="flex items-center justify-between border-b border-neutral-300 pb-2.5 text-[8.5pt] font-mono tracking-wider uppercase text-neutral-600">
              <div className="flex items-center gap-2">
                <span className="font-bold text-black">{profile.name}</span>
                <span>/</span>
                <span style={{ color: accent }}>№ {(pIdx + 1).toString().padStart(2, '0')}</span>
              </div>
              <div className="font-bold text-black uppercase">
                {proj.title}
              </div>
              <div>
                PAGE {actualPageNum.toString().padStart(2, '0')}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="my-auto py-4 space-y-4">
              
              {/* Primary High-Res Photo */}
              <div className="w-full aspect-[16/10] bg-neutral-100 overflow-hidden border border-neutral-200 flex items-center justify-center">
                {coverImg ? (
                  <img
                    src={coverImg}
                    alt={proj.title}
                    className={`w-full h-full object-cover ${options.grayscalePhotos ? 'grayscale contrast-125' : ''}`}
                  />
                ) : (
                  <div className="font-mono text-[9pt] text-neutral-400">NO MEDIA AVAILABLE</div>
                )}
              </div>

              {/* Secondary Photo Row if present */}
              {secondaryImg && (
                <div className="grid grid-cols-2 gap-3 h-36 overflow-hidden">
                  <div className="border border-neutral-200 bg-neutral-100 overflow-hidden">
                    <img 
                      src={secondaryImg} 
                      alt="Detail Shot" 
                      className={`w-full h-full object-cover ${options.grayscalePhotos ? 'grayscale contrast-125' : ''}`} 
                    />
                  </div>
                  {proj.images?.[2] ? (
                    <div className="border border-neutral-200 bg-neutral-100 overflow-hidden">
                      <img 
                        src={proj.images[2]} 
                        alt="Angle Shot" 
                        className={`w-full h-full object-cover ${options.grayscalePhotos ? 'grayscale contrast-125' : ''}`} 
                      />
                    </div>
                  ) : (
                    <div className="p-3 bg-neutral-50 border border-neutral-200 flex flex-col justify-center text-[8pt] font-mono text-neutral-600">
                      <span className="font-bold uppercase mb-1" style={{ color: accent }}>FIELD NOTES</span>
                      <span>Documentation and architectural study capturing raw spatial materiality.</span>
                    </div>
                  )}
                </div>
              )}

              {/* Editorial Typography & Metadata */}
              <div className="grid grid-cols-12 gap-6 pt-2">
                
                {/* Title & Case Study Description */}
                <div className="col-span-8">
                  <div className="flex items-center gap-2 text-[8.5pt] font-mono text-neutral-500 mb-1">
                    <span className="uppercase font-bold" style={{ color: accent }}>{proj.category}</span>
                    <span>•</span>
                    <span>RELEASE YEAR {proj.year || '2025'}</span>
                  </div>

                  <h2 className="text-[20pt] font-bold uppercase tracking-tight text-black leading-tight mb-2">
                    {proj.title}
                  </h2>

                  <p className="text-[9.5pt] text-neutral-700 font-normal leading-relaxed whitespace-pre-line text-justify">
                    {proj.description || 'Comprehensive case study documentation exploring minimalist design principles, material constraints, and typographic hierarchy.'}
                  </p>
                </div>

                {/* Metadata Sidebar */}
                <div className="col-span-4 border-l border-neutral-200 pl-4 space-y-2 text-[8pt] font-mono">
                  {proj.client && (
                    <div className="border-b border-neutral-100 pb-1">
                      <span className="text-neutral-500 block text-[7pt] uppercase">CLIENT / COMMISSION</span>
                      <span className="font-semibold text-black">{proj.client}</span>
                    </div>
                  )}

                  {proj.role && (
                    <div className="border-b border-neutral-100 pb-1">
                      <span className="text-neutral-500 block text-[7pt] uppercase">ROLE & RESPONSIBILITY</span>
                      <span className="font-semibold text-black">{proj.role}</span>
                    </div>
                  )}

                  {proj.tools && proj.tools.length > 0 && (
                    <div>
                      <span className="text-neutral-500 block text-[7pt] uppercase mb-1">TOOLS & SPECS</span>
                      <div className="flex flex-wrap gap-1">
                        {proj.tools.map((t, idx) => (
                          <span key={idx} className="bg-neutral-100 text-neutral-800 px-1 py-0.5 rounded-none text-[7pt]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {proj.externalLink && (
                    <div className="pt-1">
                      <span className="text-neutral-500 block text-[7pt] uppercase">REFERENCE</span>
                      <span className="text-neutral-800 text-[7pt] truncate block">{proj.externalLink}</span>
                    </div>
                  )}
                </div>

              </div>

            </div>

            {/* Running Footer */}
            <div className="border-t border-neutral-300 pt-2 flex items-center justify-between text-[8pt] font-mono text-neutral-500">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
                <span>ARCHIVE CATALOG // {profile.name}</span>
              </span>
              <span>{profile.website || profile.email}</span>
              <span>CASE STUDY {(pIdx + 1).toString().padStart(2, '0')} / {activeProjects.length.toString().padStart(2, '0')}</span>
            </div>

          </section>
        );
      })}

      {/* ======================================================== */}
      {/* FINAL PAGE: COLOPHON & CONTACT SPREAD                    */}
      {/* ======================================================== */}
      {options.includeColophon && (
        <section className="print-page page-break relative min-h-[297mm] p-[16mm] flex flex-col justify-between bg-white border border-neutral-200 print:border-none box-border">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-black/80 pb-3 text-[9pt] font-mono tracking-widest uppercase">
            <span className="font-bold">{profile.name}</span>
            <span className="text-neutral-600">COLOPHON & INQUIRIES</span>
            <span>FINAL SPREAD</span>
          </div>

          {/* Central Body */}
          <div className="my-auto py-10 space-y-8">
            <div>
              <span className="text-[10pt] font-mono tracking-widest uppercase text-neutral-500 block mb-2" style={{ color: accent }}>
                [ INQUIRIES & COMMISSIONS ]
              </span>
              <h2 className="text-[32pt] font-bold tracking-tight uppercase leading-tight text-black mb-4">
                LET'S CREATE TOGETHER.
              </h2>
              <p className="text-[12pt] text-neutral-700 max-w-xl leading-relaxed">
                Available for independent art direction, commissioned architectural documentation, brand identity systems, and high-contrast editorial publications.
              </p>
            </div>

            {/* Direct Contact Grid */}
            <div className="grid grid-cols-2 gap-8 border-y border-neutral-300 py-6 text-[10pt] font-mono">
              <div>
                <span className="text-neutral-500 block text-[8pt] uppercase mb-1">DIRECT EMAIL</span>
                <span className="font-bold text-black text-[11pt]">{profile.email || 'hello@studio.design'}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[8pt] uppercase mb-1">LOCATION & BASE</span>
                <span className="font-bold text-black text-[11pt]">{profile.location || 'BERLIN / GLOBAL'}</span>
              </div>
              {profile.phone && (
                <div>
                  <span className="text-neutral-500 block text-[8pt] uppercase mb-1">TELEPHONE</span>
                  <span className="font-bold text-black">{profile.phone}</span>
                </div>
              )}
              {profile.website && (
                <div>
                  <span className="text-neutral-500 block text-[8pt] uppercase mb-1">WEBSITE / PORTAL</span>
                  <span className="font-bold text-black">{profile.website}</span>
                </div>
              )}
            </div>

            {/* Typography & Design Spec Details */}
            <div className="space-y-2 text-[8.5pt] font-mono text-neutral-600">
              <span className="font-bold uppercase text-black block">COLOPHON NOTES:</span>
              <p>
                Typeset in Space Grotesk, Plus Jakarta Sans, and Space Mono. Formatted for high-fidelity A4 printing with calibrated ink density. All photographic works and rights reserved © {new Date().getFullYear()} {profile.name}.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-black/80 pt-4 flex items-center justify-between text-[8.5pt] font-mono text-neutral-500">
            <span>© {new Date().getFullYear()} {profile.name}</span>
            <span style={{ color: accent }}>END OF PORTFOLIO ARCHIVE</span>
            <span>PRINT TERMINUS</span>
          </div>

        </section>
      )}

    </div>
  );
}
