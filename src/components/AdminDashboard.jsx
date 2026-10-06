import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Edit3, 
  Sliders, 
  Layers, 
  User, 
  Cloud, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Star,
  Image as ImageIcon,
  Save
} from 'lucide-react';

export default function AdminDashboard({
  profile,
  projects,
  skills,
  onSaveProfile,
  onSaveProject,
  onDeleteProject,
  onOpenNewProject,
  onOpenEditProject,
  onSaveSkills,
  onNavigateHome,
  onOpenProfileModal,
  cloudStatus
}) {
  const accent = profile.accentColor || '#e63946';

  const [adminTab, setAdminTab] = useState('projects'); // 'projects' | 'skills' | 'profile'

  // Local skills state for interactive slider editing
  const [localSkills, setLocalSkills] = useState([...skills]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillPercentage, setNewSkillPercentage] = useState(85);
  const [newSkillCategory, setNewSkillCategory] = useState('Design');
  const [skillsSaveNotice, setSkillsSaveNotice] = useState('');

  // Handle skill percentage change
  const handleSkillChange = (id, newPercentage) => {
    const updated = localSkills.map(s => 
      s.id === id ? { ...s, percentage: Number(newPercentage) } : s
    );
    setLocalSkills(updated);
    onSaveSkills(updated);
  };

  // Add new skill
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const newSkill = {
      id: `sk-${Date.now()}`,
      name: newSkillName.trim(),
      percentage: Number(newSkillPercentage),
      category: newSkillCategory.trim() || 'Design'
    };

    const updated = [...localSkills, newSkill];
    setLocalSkills(updated);
    onSaveSkills(updated);

    setNewSkillName('');
    setNewSkillPercentage(85);
    setSkillsSaveNotice('Skill added and synced to cloud!');
    setTimeout(() => setSkillsSaveNotice(''), 2500);
  };

  // Delete skill
  const handleDeleteSkill = (id) => {
    const updated = localSkills.filter(s => s.id !== id);
    setLocalSkills(updated);
    onSaveSkills(updated);
    setSkillsSaveNotice('Skill removed and updated in cloud.');
    setTimeout(() => setSkillsSaveNotice(''), 2500);
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-neutral-200 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Top Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2 px-3.5 py-2 border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-mono text-white rounded-xs transition-colors"
            >
              <ArrowLeft size={14} style={{ color: accent }} />
              <span>VIEW LIVE PORTFOLIO</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-heading uppercase text-white tracking-tight">
                  ADMIN STUDIO // CMS
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xs">
                  /ADMIN
                </span>
              </div>
              <p className="text-xs font-mono text-neutral-400 mt-0.5">
                Manage your works, visual skills bars, and portfolio identity in real time
              </p>
            </div>
          </div>

          {/* Right Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 bg-white/[0.03] border border-white/10 rounded-xs">
              <Cloud size={13} className="text-emerald-400" />
              <span className="text-emerald-400 font-medium">REALTIME CLOUD SYNC ACTIVE</span>
            </div>

            <button
              onClick={onOpenProfileModal}
              className="p-2 border border-white/20 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white rounded-xs"
              title="Identity & Color Settings"
            >
              <Sliders size={14} />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-white/10 mb-8 pb-1">
          <button
            onClick={() => setAdminTab('projects')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono tracking-wider transition-all border-b-2 ${
              adminTab === 'projects'
                ? 'border-current text-white font-bold bg-white/5'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
            style={{ borderColor: adminTab === 'projects' ? accent : 'transparent' }}
          >
            <Layers size={14} />
            <span>PROJECTS ARCHIVE ({projects.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('skills')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono tracking-wider transition-all border-b-2 ${
              adminTab === 'skills'
                ? 'border-current text-white font-bold bg-white/5'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
            style={{ borderColor: adminTab === 'skills' ? accent : 'transparent' }}
          >
            <Sparkles size={14} />
            <span>SKILLS & MASTERY BARS ({localSkills.length})</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: PROJECTS MANAGER                                  */}
        {/* ======================================================== */}
        {adminTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold font-heading uppercase text-white">
                  CURATED WORKS ({projects.length})
                </h2>
                <p className="text-xs font-mono text-neutral-400">
                  Upload photos, edit narratives, and toggle featured works
                </p>
              </div>

              <button
                onClick={onOpenNewProject}
                className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold text-white rounded-xs shadow-md transition-all hover:brightness-110 active:scale-95"
                style={{ backgroundColor: accent }}
              >
                <Plus size={14} />
                <span>+ ADD NEW WORK</span>
              </button>
            </div>

            {/* Projects Table / Cards */}
            <div className="grid grid-cols-1 gap-4">
              {projects.map((proj, idx) => {
                const coverImg = (proj.images && proj.images[proj.coverIndex || 0]) || proj.images?.[0];

                return (
                  <div
                    key={proj.id}
                    className="p-4 bg-[#121216] border border-white/10 hover:border-white/25 rounded-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs text-neutral-500 w-6">
                        {(idx + 1).toString().padStart(2, '0')}
                      </span>

                      {/* Thumbnail */}
                      <div className="w-16 h-16 bg-neutral-900 border border-white/10 rounded-xs overflow-hidden shrink-0">
                        {coverImg ? (
                          <img src={coverImg} alt={proj.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-600">
                            <ImageIcon size={18} />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white uppercase">
                            {proj.title}
                          </h3>
                          {proj.featured && (
                            <span 
                              className="text-[9px] font-mono font-bold px-1.5 py-0.2 text-white uppercase rounded-xs"
                              style={{ backgroundColor: accent }}
                            >
                              FEATURED
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs font-mono text-neutral-400 mt-1">
                          <span className="uppercase" style={{ color: accent }}>{proj.category}</span>
                          <span>•</span>
                          <span>{proj.year || '2025'}</span>
                          {proj.client && (
                            <>
                              <span>•</span>
                              <span>Client: {proj.client}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{proj.images?.length || 0} Photos</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end md:self-auto">
                      <button
                        onClick={() => onOpenEditProject(proj)}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-white/20 bg-white/5 hover:bg-white/15 text-xs font-mono text-neutral-200 hover:text-white rounded-xs transition-colors"
                      >
                        <Edit3 size={13} />
                        <span>EDIT WORK</span>
                      </button>

                      <button
                        onClick={() => onDeleteProject(proj.id)}
                        className="p-2 border border-red-500/20 bg-red-500/5 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-xs transition-colors"
                        title="Delete project"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: SKILLS & PROGRESS BARS MANAGER                    */}
        {/* ======================================================== */}
        {adminTab === 'skills' && (
          <div className="space-y-8">
            
            {/* Add Skill Form */}
            <div className="p-6 bg-[#121216] border border-white/15 rounded-xs">
              <h2 className="text-base font-bold font-heading uppercase text-white mb-1">
                + ADD NEW SKILL / CAPABILITY
              </h2>
              <p className="text-xs font-mono text-neutral-400 mb-6">
                This will automatically appear with an animated progress bar on your main portfolio page
              </p>

              {skillsSaveNotice && (
                <div className="mb-4 p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono rounded-xs">
                  {skillsSaveNotice}
                </div>
              )}

              <form onSubmit={handleAddSkill} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                <div className="sm:col-span-5">
                  <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase">
                    SKILL NAME
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Medium Format Photography"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/15 px-3 py-2 text-sm text-white font-mono rounded-xs focus:outline-none focus:border-white/40"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase">
                    CATEGORY
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Visual / Design"
                    value={newSkillCategory}
                    onChange={(e) => setNewSkillCategory(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/15 px-3 py-2 text-sm text-white font-mono rounded-xs focus:outline-none focus:border-white/40"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase">
                    PROFICIENCY ({newSkillPercentage}%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newSkillPercentage}
                    onChange={(e) => setNewSkillPercentage(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/15 px-3 py-2 text-sm text-white font-mono rounded-xs focus:outline-none focus:border-white/40"
                  />
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 text-xs font-mono font-bold text-white rounded-xs shadow-md transition-all hover:brightness-110 active:scale-95"
                    style={{ backgroundColor: accent }}
                  >
                    ADD SKILL
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Skills Sliders List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold font-mono uppercase text-white tracking-wider">
                  ACTIVE SKILLS LIST ({localSkills.length})
                </h3>
                <span className="text-xs font-mono text-neutral-500">
                  Adjust sliders to update percentages in real time
                </span>
              </div>

              <div className="space-y-4">
                {localSkills.map((skill, sIdx) => (
                  <div
                    key={skill.id || sIdx}
                    className="p-5 bg-[#121216] border border-white/10 rounded-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    {/* Skill Info */}
                    <div className="w-full md:w-1/3">
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-500 font-mono text-xs">
                          {(sIdx + 1).toString().padStart(2, '0')}.
                        </span>
                        <span className="text-sm font-semibold uppercase text-white">
                          {skill.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400 uppercase mt-0.5 block">
                        Category: {skill.category || 'General'}
                      </span>
                    </div>

                    {/* Interactive Slider & Live Bar Preview */}
                    <div className="w-full md:w-1/2 space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-neutral-500">Proficiency:</span>
                        <span className="font-bold text-white" style={{ color: accent }}>
                          {skill.percentage}%
                        </span>
                      </div>

                      {/* Slider Input */}
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={skill.percentage}
                        onChange={(e) => handleSkillChange(skill.id, e.target.value)}
                        className="w-full accent-red-600 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
                      />

                      {/* Progress Bar Preview */}
                      <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${skill.percentage}%`, backgroundColor: accent }}
                        />
                      </div>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="p-2 border border-red-500/20 text-red-400 hover:text-red-300 hover:border-red-500/50 rounded-xs transition-colors self-end md:self-center"
                      title="Delete skill"
                    >
                      <Trash2 size={14} />
                    </button>

                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
