import React, { useState } from 'react';
import { Printer, CheckSquare, Square, Settings, Eye, HelpCircle, FileCheck, Info } from 'lucide-react';
import PrintDocument from './PrintDocument';

export default function PdfStudio({
  profile,
  projects,
  onTriggerPrint
}) {
  const accent = profile.accentColor || '#e63946';

  const [selectedIds, setSelectedIds] = useState(projects.map(p => p.id));
  const [includeCover, setIncludeCover] = useState(true);
  const [includeColophon, setIncludeColophon] = useState(true);
  const [grayscalePhotos, setGrayscalePhotos] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const toggleSelectAll = () => {
    if (selectedIds.length === projects.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(projects.map(p => p.id));
    }
  };

  const toggleProject = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const totalPages = (includeCover ? 1 : 0) + selectedIds.length + (includeColophon ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#111115] text-neutral-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Studio Top Controls Bar */}
        <div className="no-print bg-[#16161c] border border-white/10 p-5 rounded-xs mb-8 shadow-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            {/* Left: Summary Title */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
                <span>PDF PUBLISHING ENGINE // A4 EDITORIAL FORMAT</span>
              </div>
              <h2 className="text-xl font-bold font-heading text-white uppercase tracking-tight">
                MONOGRAPH PRINT PREVIEW
              </h2>
              <p className="text-xs font-mono text-neutral-400 mt-0.5">
                Total Output: <strong className="text-white">{totalPages} Pages</strong> • Selected Works: <strong className="text-white">{selectedIds.length} of {projects.length}</strong>
              </p>
            </div>

            {/* Options Toggle Bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
              <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={includeCover}
                  onChange={(e) => setIncludeCover(e.target.checked)}
                  className="w-4 h-4 accent-red-600 rounded-xs"
                />
                <span>Include Cover Page</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={includeColophon}
                  onChange={(e) => setIncludeColophon(e.target.checked)}
                  className="w-4 h-4 accent-red-600 rounded-xs"
                />
                <span>Include Colophon / Contact</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={grayscalePhotos}
                  onChange={(e) => setGrayscalePhotos(e.target.checked)}
                  className="w-4 h-4 accent-red-600 rounded-xs"
                />
                <span>B&W Photo Filter</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="flex items-center gap-1.5 px-3 py-2 border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-mono text-neutral-300 hover:text-white rounded-xs transition-colors"
                title="View PDF export tips"
              >
                <HelpCircle size={14} />
                <span className="hidden sm:inline">PDF Tips</span>
              </button>

              <button
                onClick={onTriggerPrint}
                className="flex items-center gap-2 px-5 py-2 text-xs font-mono font-bold text-white rounded-xs shadow-xl transition-all hover:brightness-110 active:scale-95"
                style={{ backgroundColor: accent }}
              >
                <Printer size={15} />
                <span>SAVE AS PDF / PRINT</span>
              </button>
            </div>

          </div>

          {/* Quick PDF export guidelines dropdown */}
          {showInstructions && (
            <div className="mt-4 pt-4 border-t border-white/10 text-xs font-mono bg-white/[0.02] p-3 rounded-xs text-neutral-300 space-y-1.5 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 font-bold text-white mb-1">
                <Info size={14} style={{ color: accent }} />
                <span>HOW TO EXPORT THE PERFECT VECTOR PDF:</span>
              </div>
              <p>1. Click <strong>"SAVE AS PDF / PRINT"</strong> above.</p>
              <p>2. In your browser's Print window, choose <strong>Destination: "Save as PDF"</strong>.</p>
              <p>3. Under <strong>More Settings</strong>, turn ON <strong>"Background graphics"</strong> (this preserves backgrounds & colors).</p>
              <p>4. Set <strong>Margins</strong> to <strong>"None"</strong> or <strong>"Default"</strong>, Paper size to <strong>A4</strong>.</p>
              <p className="text-neutral-400 italic">Result: 100% crisp vector typography and full high-resolution imagery without any blur!</p>
            </div>
          )}

          {/* Project Selection Chips */}
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
            <button
              onClick={toggleSelectAll}
              className="px-2 py-1 bg-white/10 hover:bg-white/15 text-[11px] font-mono text-white rounded-xs"
            >
              {selectedIds.length === projects.length ? 'Deselect All' : 'Select All Works'}
            </button>

            <span className="text-neutral-500 text-xs font-mono mr-2">| Include:</span>

            {projects.map((p) => {
              const isSelected = selectedIds.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => toggleProject(p.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-xs border transition-all ${
                    isSelected
                      ? 'border-white/40 bg-white/15 text-white font-medium'
                      : 'border-white/10 bg-transparent text-neutral-500 hover:text-neutral-300'
                  }`}
                  style={{
                    borderColor: isSelected ? accent : undefined
                  }}
                >
                  {isSelected ? <CheckSquare size={12} style={{ color: accent }} /> : <Square size={12} />}
                  <span className="truncate max-w-[130px]">{p.title}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Live A4 Print Canvas Container */}
        <div className="flex flex-col items-center justify-center space-y-10 pb-16">
          <div className="text-xs font-mono text-neutral-400 tracking-wider">
            PREVIEWING {totalPages} A4 SPREADS
          </div>

          {/* Actual Print Document rendered inside stylized preview containers */}
          <div className="w-full max-w-[210mm] shadow-2xl transition-all">
            <PrintDocument
              profile={profile}
              projects={projects}
              selectedProjectIds={selectedIds}
              options={{
                includeCover,
                includeColophon,
                grayscalePhotos
              }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
