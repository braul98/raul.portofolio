import React, { useState } from 'react';
import { X, Save, Download, Upload, RotateCcw, Palette, User, Mail, MapPin, Globe } from 'lucide-react';
import { DEFAULT_PROFILE, INITIAL_PROJECTS } from '../storage';

const COLOR_PRESETS = [
  { name: 'Crimson Red', hex: '#e63946' },
  { name: 'Electric Scarlet', hex: '#ff2a2a' },
  { name: 'Carmine Rose', hex: '#f43f5e' },
  { name: 'Signal Orange', hex: '#ff5400' },
  { name: 'Industrial Amber', hex: '#f59e0b' },
  { name: 'Monochrome Noir', hex: '#ffffff' }
];

export default function ProfileModal({
  profile,
  projects,
  onSaveProfile,
  onRestoreData,
  onResetDefaults,
  onClose
}) {
  const [formData, setFormData] = useState({ ...profile });
  const [accentColor, setAccentColor] = useState(profile.accentColor || '#e63946');
  const [importStatus, setImportStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile({
      ...formData,
      accentColor
    });
    onClose();
  };

  // Export JSON backup
  const handleExportBackup = () => {
    const backupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      profile: { ...formData, accentColor },
      projects
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON backup
  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.profile && parsed.projects) {
          onRestoreData(parsed.profile, parsed.projects);
          setImportStatus('Backup restored successfully!');
          setTimeout(() => onClose(), 1200);
        } else {
          setImportStatus('Invalid backup file structure.');
        }
      } catch (err) {
        setImportStatus('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      
      <div className="relative w-full max-w-3xl bg-[#0f0f13] border border-white/20 rounded-xs shadow-2xl my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#14141a]">
          <div>
            <h2 className="text-base font-mono font-bold tracking-wider uppercase text-white">
              PORTFOLIO CONFIGURATION & IDENTITY
            </h2>
            <span className="text-xs font-mono text-neutral-400">
              Customize typography, signature accent color, and manage backups
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white border border-white/10 hover:border-white/30 rounded-xs transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {importStatus && (
          <div className="bg-white/10 px-6 py-2 text-xs font-mono text-center text-white border-b border-white/10">
            {importStatus}
          </div>
        )}

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Accent Color Palette */}
          <div>
            <label className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 mb-3">
              <Palette size={14} style={{ color: accentColor }} />
              <span>SIGNATURE ACCENT COLOR (MONOCHROME + ACCENT)</span>
            </label>

            <div className="flex flex-wrap items-center gap-3">
              {COLOR_PRESETS.map((p) => (
                <button
                  key={p.hex}
                  type="button"
                  onClick={() => setAccentColor(p.hex)}
                  className={`flex items-center gap-2 px-3 py-1.5 border text-xs font-mono rounded-xs transition-all ${
                    accentColor === p.hex
                      ? 'border-white text-white font-bold bg-white/10 scale-105'
                      : 'border-white/15 text-neutral-400 hover:border-white/30'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.hex }} />
                  <span>{p.name}</span>
                </button>
              ))}

              <div className="flex items-center gap-1.5 ml-auto border border-white/15 px-2 py-1 bg-white/5 rounded-xs">
                <span className="text-[10px] font-mono text-neutral-400">HEX:</span>
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-20 bg-transparent text-xs font-mono text-white focus:outline-none uppercase"
                />
              </div>
            </div>
          </div>

          {/* Identity Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                YOUR FULL NAME / STUDIO
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/15 px-3 py-2 text-sm font-mono text-white rounded-xs focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                PRIMARY DISCIPLINE / TITLE
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/15 px-3 py-2 text-sm font-mono text-white rounded-xs focus:outline-none focus:border-white/40"
              />
            </div>
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
              PORTFOLIO TAGLINE (PRINT COVER & HERO)
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full bg-white/[0.03] border border-white/15 px-3 py-2 text-xs font-mono text-white rounded-xs focus:outline-none focus:border-white/40"
            />
          </div>

          {/* Detailed Statement / Bio */}
          <div>
            <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
              ARTIST STATEMENT / EDITORIAL BIO
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-white/[0.03] border border-white/15 px-3 py-2 text-xs font-mono text-white rounded-xs focus:outline-none focus:border-white/40 leading-relaxed"
            />
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                LOCATION / TIMEZONE
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/15 px-3 py-2 text-xs font-mono text-white rounded-xs focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/15 px-3 py-2 text-xs font-mono text-white rounded-xs focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                AVAILABILITY STATUS
              </label>
              <input
                type="text"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/15 px-3 py-2 text-xs font-mono text-white rounded-xs focus:outline-none focus:border-white/40"
              />
            </div>
          </div>

          {/* Secondary links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                WEBSITE DOMAIN
              </label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/15 px-3 py-2 text-xs font-mono text-white rounded-xs focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                INSTAGRAM / SOCIAL HANDLE
              </label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/15 px-3 py-2 text-xs font-mono text-white rounded-xs focus:outline-none focus:border-white/40"
              />
            </div>
          </div>

          {/* Backup & Data Recovery */}
          <div className="pt-6 border-t border-white/10 space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 block">
              PORTFOLIO DATA BACKUP & PORTABILITY
            </span>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleExportBackup}
                className="flex items-center gap-1.5 px-3 py-2 border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-mono text-neutral-300 hover:text-white rounded-xs transition-colors"
              >
                <Download size={13} />
                <span>EXPORT DATA (JSON)</span>
              </button>

              <label className="flex items-center gap-1.5 px-3 py-2 border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-mono text-neutral-300 hover:text-white rounded-xs cursor-pointer transition-colors">
                <Upload size={13} />
                <span>IMPORT DATA (JSON)</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Reset all projects and profile back to starter sample works?")) {
                    onResetDefaults();
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 border border-red-500/30 text-xs font-mono text-red-400 hover:text-red-300 hover:border-red-500/60 rounded-xs transition-colors ml-auto"
              >
                <RotateCcw size={13} />
                <span>RESET TO SAMPLES</span>
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-white/20 text-xs font-mono text-neutral-400 hover:text-white rounded-xs"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-xs font-mono font-bold text-white rounded-xs shadow-lg transition-all hover:brightness-110 active:scale-95"
              style={{ backgroundColor: accentColor }}
            >
              SAVE SETTINGS
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
