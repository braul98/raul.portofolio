import React, { useState, useRef } from 'react';
import { X, Upload, Trash2, Check, Star, Plus, Link, AlertCircle, Loader2 } from 'lucide-react';
import { readFileAsDataURL } from '../storage';
import { uploadImageToStorage } from '../firebase';

const CATEGORY_PRESETS = [
  'Photography',
  'Editorial',
  'Architecture',
  'Branding',
  'Product Design',
  '3D & Spatial',
  'Typography'
];

export default function ProjectEditModal({
  initialProject,
  onSave,
  onClose,
  accentColor
}) {
  const accent = accentColor || '#e63946';
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState({
    id: initialProject?.id || `proj-${Date.now()}`,
    title: initialProject?.title || '',
    category: initialProject?.category || 'Photography',
    year: initialProject?.year || new Date().getFullYear().toString(),
    client: initialProject?.client || '',
    role: initialProject?.role || '',
    featured: initialProject?.featured || false,
    coverIndex: initialProject?.coverIndex || 0,
    description: initialProject?.description || '',
    images: initialProject?.images ? [...initialProject.images] : [],
    tools: initialProject?.tools ? initialProject.tools.join(', ') : '',
    externalLink: initialProject?.externalLink || ''
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Process files from click or drag & drop
  const processFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;

    setIsProcessing(true);
    setErrorMsg('');

    try {
      const newImages = [];
      for (const file of files) {
        if (!file.type || !file.type.startsWith('image/')) continue;
        
        // Fast cloud upload attempt (with 2.5s fallback)
        const cloudUpload = await uploadImageToStorage(file);
        if (cloudUpload.success && cloudUpload.url) {
          newImages.push(cloudUpload.url);
        } else {
          // Optimized, instant client-side canvas compression (under 150KB, crystal clear)
          const dataUrl = await readFileAsDataURL(file, 1600, 0.85);
          newImages.push(dataUrl);
        }
      }

      if (newImages.length === 0) {
        setErrorMsg('Please select valid image files (JPG, PNG, WEBP, or AVIF).');
      } else {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...newImages]
        }));
      }
    } catch (err) {
      console.error('File process error:', err);
      setErrorMsg('Failed to process image. Please try another image or URL.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Add image from URL
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, imageUrlInput.trim()]
    }));
    setImageUrlInput('');
  };

  // Remove photo
  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => {
      const updated = prev.images.filter((_, i) => i !== indexToRemove);
      let newCoverIdx = prev.coverIndex;
      if (newCoverIdx >= updated.length) {
        newCoverIdx = Math.max(0, updated.length - 1);
      }
      return {
        ...prev,
        images: updated,
        coverIndex: newCoverIdx
      };
    });
  };

  // Set as primary cover
  const handleSetCover = (idx) => {
    setFormData(prev => ({
      ...prev,
      coverIndex: idx
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMsg('Please enter a project title.');
      return;
    }

    const cleanedTools = formData.tools
      ? formData.tools.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    onSave({
      ...formData,
      tools: cleanedTools
    });
  };

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      
      <div className="relative w-full max-w-4xl bg-[#0f0f13] border border-white/20 rounded-xs shadow-2xl my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#14141a]">
          <div>
            <h2 className="text-base font-mono font-bold tracking-wider uppercase text-white">
              {initialProject ? 'EDIT PROJECT' : 'CREATE NEW PROJECT'}
            </h2>
            <span className="text-xs font-mono text-neutral-400">
              Upload photography, configure case study and set print layout
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white border border-white/10 hover:border-white/30 rounded-xs transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Error notice */}
        {errorMsg && (
          <div className="bg-red-500/10 border-b border-red-500/30 px-6 py-2.5 flex items-center gap-2 text-xs font-mono text-red-300">
            <AlertCircle size={14} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Section 1: Upload Images */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
                PHOTOS & ARTWORKS ({formData.images.length})
              </label>
              <span className="text-[11px] font-mono text-neutral-500">
                Stored locally in browser database
              </span>
            </div>

            {/* Dropzone with click and drag & drop */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files) {
                  processFiles(e.dataTransfer.files);
                }
              }}
              className={`border-2 border-dashed rounded-xs p-6 text-center cursor-pointer transition-all ${
                isDragging 
                  ? 'border-white bg-white/10 scale-[1.01]' 
                  : 'border-white/20 hover:border-white/40 bg-white/[0.02]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  processFiles(e.target.files);
                  e.target.value = '';
                }}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                <div 
                  className="w-10 h-10 rounded-xs flex items-center justify-center text-white shadow-md"
                  style={{ backgroundColor: accent }}
                >
                  {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                </div>
                <div className="text-xs font-mono text-white font-medium">
                  {isProcessing ? 'Processing & Optimizing Photos...' : 'Drop images here or click to browse'}
                </div>
                <div className="text-[11px] font-mono text-neutral-400">
                  PNG, JPG, WEBP, AVIF — multiple files supported
                </div>
              </div>
            </div>

            {/* URL input fallback */}
            <div className="mt-3 flex gap-2">
              <input
                type="url"
                placeholder="Or paste external image URL..."
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="flex-1 bg-white/[0.03] border border-white/10 px-3 py-1.5 text-xs font-mono text-white placeholder-neutral-500 rounded-xs focus:outline-none focus:border-white/30"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-3 py-1.5 border border-white/20 text-xs font-mono text-neutral-300 hover:text-white hover:border-white/40 bg-white/5 rounded-xs"
              >
                Add URL
              </button>
            </div>

            {/* Uploaded Thumbnails Preview */}
            {formData.images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {formData.images.map((img, idx) => (
                  <div 
                    key={idx}
                    className={`relative aspect-square border rounded-xs overflow-hidden group bg-neutral-900 ${
                      formData.coverIndex === idx ? 'ring-2 ring-white' : 'border-white/10'
                    }`}
                  >
                    <img src={img} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                    
                    {/* Cover badge */}
                    {formData.coverIndex === idx && (
                      <span 
                        className="absolute top-1 left-1 text-[9px] font-mono font-bold px-1 py-0.5 text-white tracking-widest uppercase rounded-xs"
                        style={{ backgroundColor: accent }}
                      >
                        COVER
                      </span>
                    )}

                    {/* Actions on hover */}
                    <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                      {formData.coverIndex !== idx && (
                        <button
                          type="button"
                          onClick={() => handleSetCover(idx)}
                          className="px-2 py-0.5 bg-white text-black text-[10px] font-mono rounded-xs font-semibold hover:bg-neutral-200"
                        >
                          Make Cover
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-1 text-red-400 hover:text-red-300"
                        title="Delete this photo"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Core Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                PROJECT TITLE *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. MONOLITHIC PAVILION"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/15 px-3 py-2 text-sm text-white font-mono rounded-xs focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                CATEGORY / DISCIPLINE
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Architecture"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="flex-1 bg-white/[0.03] border border-white/15 px-3 py-2 text-sm text-white font-mono rounded-xs focus:outline-none focus:border-white/40"
                />
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {CATEGORY_PRESETS.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className="text-[10px] font-mono px-1.5 py-0.5 bg-white/5 border border-white/10 text-neutral-400 hover:text-white rounded-xs"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                YEAR
              </label>
              <input
                type="text"
                placeholder="2026"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/15 px-3 py-2 text-xs text-white font-mono rounded-xs focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                CLIENT / CONTEXT
              </label>
              <input
                type="text"
                placeholder="e.g. Gallery Berlin"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/15 px-3 py-2 text-xs text-white font-mono rounded-xs focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                YOUR ROLE
              </label>
              <input
                type="text"
                placeholder="e.g. Art Direction"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/15 px-3 py-2 text-xs text-white font-mono rounded-xs focus:outline-none focus:border-white/40"
              />
            </div>
          </div>

          {/* Tools & Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                TOOLS & SPECS (COMMA-SEPARATED)
              </label>
              <input
                type="text"
                placeholder="Leica M11, Capture One, InDesign"
                value={formData.tools}
                onChange={(e) => setFormData({ ...formData, tools: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/15 px-3 py-2 text-xs text-white font-mono rounded-xs focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                EXTERNAL PROJECT URL
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={formData.externalLink}
                onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/15 px-3 py-2 text-xs text-white font-mono rounded-xs focus:outline-none focus:border-white/40"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
              CASE STUDY DESCRIPTION (PRINT & WEB)
            </label>
            <textarea
              rows={4}
              placeholder="Provide context, artistic vision, typography choices, and technical execution details..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white/[0.03] border border-white/15 px-3 py-2 text-xs text-white font-mono rounded-xs focus:outline-none focus:border-white/40 leading-relaxed resize-y"
            />
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="featured-check"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 accent-red-600 rounded-xs cursor-pointer"
            />
            <label htmlFor="featured-check" className="text-xs font-mono text-neutral-300 cursor-pointer select-none">
              Mark as <strong style={{ color: accent }}>Featured Project</strong> (Highlight in Gallery & PDF cover index)
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-white/20 text-xs font-mono text-neutral-400 hover:text-white rounded-xs transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-6 py-2 text-xs font-mono font-bold text-white rounded-xs shadow-lg transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
              style={{ backgroundColor: accent }}
            >
              SAVE PROJECT
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
