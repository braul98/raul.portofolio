import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FilterBar from './components/FilterBar';
import PublicProjectCard from './components/PublicProjectCard';
import ProjectCard from './components/ProjectCard';
import SkillsSection from './components/SkillsSection';
import AdminDashboard from './components/AdminDashboard';
import ProjectDetailModal from './components/ProjectDetailModal';
import ProjectEditModal from './components/ProjectEditModal';
import ProfileModal from './components/ProfileModal';
import PdfStudio from './components/PdfStudio';
import PrintDocument from './components/PrintDocument';
import {
  DEFAULT_PROFILE,
  INITIAL_PROJECTS,
  DEFAULT_SKILLS,
  getStoredProfile,
  getStoredProjects,
  getStoredSkills,
  saveStoredProfile,
  saveStoredProjects,
  saveStoredSkills
} from './storage';
import {
  fetchProjectsFromCloud,
  syncProjectsToCloud,
  saveProjectToCloud,
  deleteProjectFromCloud,
  fetchProfileFromCloud,
  saveProfileToCloud,
  fetchSkillsFromCloud,
  syncSkillsToCloud
} from './firebase';

export default function App() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [skills, setSkills] = useState(DEFAULT_SKILLS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cloudStatus, setCloudStatus] = useState('syncing'); // 'syncing' | 'synced' | 'local'

  // URL-based Route: '/' (home/public) vs '/admin'
  const [currentRoute, setCurrentRoute] = useState(() => 
    window.location.pathname.startsWith('/admin') ? 'admin' : 'home'
  );

  // UI Navigation on public view
  const [activeTab, setActiveTab] = useState('gallery'); // 'gallery' | 'pdf-studio'
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutMode, setLayoutMode] = useState('editorial'); // 'editorial' | 'grid' | 'list'

  // Modals
  const [detailProject, setDetailProject] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Sync browser back/forward buttons with currentRoute
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname.startsWith('/admin') ? 'admin' : 'home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Programmatic navigation between '/' and '/admin'
  const navigateTo = (route) => {
    setCurrentRoute(route);
    const targetUrl = route === 'admin' ? '/admin' : '/';
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({}, '', targetUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load persistent data: IndexedDB first for instant UI, then sync with Firebase Cloud
  useEffect(() => {
    async function loadData() {
      try {
        const [loadedProfile, loadedProjects, loadedSkills] = await Promise.all([
          getStoredProfile(),
          getStoredProjects(),
          getStoredSkills()
        ]);

        if (loadedProfile) setProfile(loadedProfile);
        if (loadedProjects) setProjects(loadedProjects);
        if (loadedSkills) setSkills(loadedSkills);

        // Sync with Firebase Realtime Database
        try {
          const [cloudProfile, cloudProjects, cloudSkills] = await Promise.all([
            fetchProfileFromCloud(),
            fetchProjectsFromCloud(),
            fetchSkillsFromCloud()
          ]);

          if (cloudProfile && cloudProfile.name) {
            setProfile(cloudProfile);
            await saveStoredProfile(cloudProfile);
          } else if (loadedProfile) {
            saveProfileToCloud(loadedProfile);
          }

          if (cloudProjects && cloudProjects.length > 0) {
            setProjects(cloudProjects);
            await saveStoredProjects(cloudProjects);
          } else if (loadedProjects && loadedProjects.length > 0) {
            syncProjectsToCloud(loadedProjects);
          }

          if (cloudSkills && cloudSkills.length > 0) {
            setSkills(cloudSkills);
            await saveStoredSkills(cloudSkills);
          } else if (loadedSkills && loadedSkills.length > 0) {
            syncSkillsToCloud(loadedSkills);
          }

          setCloudStatus('synced');
        } catch (cloudErr) {
          console.warn('Firebase cloud sync fallback to local:', cloudErr);
          setCloudStatus('local');
        }
      } catch (err) {
        console.error('Error loading portfolio data:', err);
        setCloudStatus('local');
      } finally {
        setIsLoaded(true);
      }
    }
    loadData();
  }, []);

  // Sync profile changes to IndexedDB & Firebase
  const handleSaveProfile = async (newProfile) => {
    setProfile(newProfile);
    await saveStoredProfile(newProfile);
    await saveProfileToCloud(newProfile);
  };

  // Save new or updated project to IndexedDB & Firebase
  const handleSaveProject = async (projectData) => {
    const existingIndex = projects.findIndex(p => p.id === projectData.id);
    let updated;
    if (existingIndex >= 0) {
      updated = [...projects];
      updated[existingIndex] = projectData;
    } else {
      updated = [projectData, ...projects];
    }
    setProjects(updated);
    await saveStoredProjects(updated);
    await syncProjectsToCloud(updated);
    setEditingProject(null);
    if (detailProject && detailProject.id === projectData.id) {
      setDetailProject(projectData);
    }
  };

  // Delete project from IndexedDB & Firebase
  const handleDeleteProject = async (projectId) => {
    const target = projects.find(p => p.id === projectId);
    const confirmText = target ? `Delete "${target.title}"?` : 'Delete this project?';
    if (!window.confirm(confirmText)) return;

    const updated = projects.filter(p => p.id !== projectId);
    setProjects(updated);
    await saveStoredProjects(updated);
    await syncProjectsToCloud(updated);
    if (detailProject && detailProject.id === projectId) {
      setDetailProject(null);
    }
  };

  // Sync skills changes
  const handleSaveSkills = async (newSkills) => {
    setSkills(newSkills);
    await saveStoredSkills(newSkills);
    await syncSkillsToCloud(newSkills);
  };

  // Reset to default sample works
  const handleResetDefaults = async () => {
    setProfile(DEFAULT_PROFILE);
    setProjects(INITIAL_PROJECTS);
    setSkills(DEFAULT_SKILLS);
    await saveStoredProfile(DEFAULT_PROFILE);
    await saveStoredProjects(INITIAL_PROJECTS);
    await saveStoredSkills(DEFAULT_SKILLS);
    await saveProfileToCloud(DEFAULT_PROFILE);
    await syncProjectsToCloud(INITIAL_PROJECTS);
    await syncSkillsToCloud(DEFAULT_SKILLS);
  };

  // Restore imported data
  const handleRestoreData = async (restoredProfile, restoredProjects) => {
    setProfile(restoredProfile);
    setProjects(restoredProjects);
    await saveStoredProfile(restoredProfile);
    await saveStoredProjects(restoredProjects);
    await saveProfileToCloud(restoredProfile);
    await syncProjectsToCloud(restoredProjects);
  };

  // Global print trigger
  const handleTriggerPrint = () => {
    window.print();
  };

  // Categories list
  const uniqueCategories = Array.from(new Set(projects.map(p => p.category))).filter(Boolean);

  // Filtered projects
  const filteredProjects = projects.filter(p => {
    const matchesCat = selectedCategory === 'ALL' || p.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery.trim() ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const accent = profile.accentColor || '#e63946';

  // ========================================================
  // RENDER: ADMIN DASHBOARD ROUTE (/admin)
  // ========================================================
  if (currentRoute === 'admin') {
    return (
      <div className="min-h-screen bg-[#0c0c0e] text-[#ededed]">
        <AdminDashboard
          profile={profile}
          projects={projects}
          skills={skills}
          onSaveProfile={handleSaveProfile}
          onSaveProject={handleSaveProject}
          onDeleteProject={handleDeleteProject}
          onOpenNewProject={() => setEditingProject({})}
          onOpenEditProject={(p) => setEditingProject(p)}
          onSaveSkills={handleSaveSkills}
          onNavigateHome={() => navigateTo('home')}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
          cloudStatus={cloudStatus}
        />

        {/* Project Edit Modal */}
        {editingProject && (
          <ProjectEditModal
            initialProject={editingProject.id ? editingProject : null}
            onSave={handleSaveProject}
            onClose={() => setEditingProject(null)}
            accentColor={accent}
          />
        )}

        {/* Profile Settings Modal */}
        {isProfileModalOpen && (
          <ProfileModal
            profile={profile}
            projects={projects}
            onSaveProfile={handleSaveProfile}
            onRestoreData={handleRestoreData}
            onResetDefaults={handleResetDefaults}
            onClose={() => setIsProfileModalOpen(false)}
          />
        )}
      </div>
    );
  }

  // ========================================================
  // RENDER: PUBLIC MODERN SHOWCASE ROUTE (/)
  // ========================================================
  return (
    <div className="min-h-screen bg-[#0c0c0e] text-[#ededed] flex flex-col selection:bg-red-600 selection:text-white">
      
      {/* Universal Navigation */}
      <Navbar
        profile={profile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewProject={() => navigateTo('admin')}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onTriggerPrint={handleTriggerPrint}
        projectCount={projects.length}
        cloudStatus={cloudStatus}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'gallery' ? (
          <div>
            {/* Hero Bio Banner */}
            <Hero
              profile={profile}
              projects={projects}
              onOpenProfile={() => navigateTo('admin')}
            />

            {/* Filter & Layout Bar */}
            <FilterBar
              categories={uniqueCategories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              layoutMode={layoutMode}
              setLayoutMode={setLayoutMode}
              totalCount={projects.length}
              accentColor={accent}
            />

            {/* Projects Gallery - Large Full-Color Modern Editorial Showcase */}
            <section className="no-print py-12 sm:py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-8">
                
                {filteredProjects.length === 0 ? (
                  <div className="py-24 text-center border border-dashed border-white/10 rounded-xs">
                    <p className="text-sm font-mono text-neutral-400">
                      No works matching the selected criteria.
                    </p>
                    <button
                      onClick={() => { setSelectedCategory('ALL'); setSearchQuery(''); }}
                      className="mt-3 text-xs font-mono px-3 py-1.5 border border-white/20 text-white rounded-xs hover:bg-white/5"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : layoutMode === 'editorial' ? (
                  /* Editorial Stack: Big full-color showcase with text next to image */
                  <div className="space-y-16 sm:space-y-24">
                    {filteredProjects.map((proj, idx) => (
                      <PublicProjectCard
                        key={proj.id}
                        project={proj}
                        index={idx}
                        accentColor={accent}
                        onSelect={(p) => setDetailProject(p)}
                      />
                    ))}
                  </div>
                ) : (
                  /* Grid or List View */
                  <div className={
                    layoutMode === 'list'
                      ? 'space-y-2'
                      : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  }>
                    {filteredProjects.map((proj, idx) => (
                      <ProjectCard
                        key={proj.id}
                        project={proj}
                        index={idx}
                        accentColor={accent}
                        layoutMode={layoutMode}
                        onSelect={(p) => setDetailProject(p)}
                        onEdit={(p) => {
                          setEditingProject(p);
                          navigateTo('admin');
                        }}
                        onDelete={handleDeleteProject}
                      />
                    ))}
                  </div>
                )}

              </div>
            </section>

            {/* Dynamic Skills & Progress Bars Section */}
            <SkillsSection
              skills={skills}
              accentColor={accent}
              onNavigateToAdmin={() => navigateTo('admin')}
            />

            {/* Bottom Monograph Footer with Admin Link */}
            <footer className="no-print border-t border-white/10 py-14 bg-black/50 text-neutral-400 text-xs font-mono">
              <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-2.5 text-white">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
                  <span className="font-semibold">{profile.name} ARCHIVE</span>
                  <span className="text-neutral-600">//</span>
                  <span className="text-neutral-400">{profile.role || 'VISUAL PORTFOLIO'}</span>
                </div>

                <div className="flex items-center gap-5">
                  <button
                    onClick={() => setActiveTab('pdf-studio')}
                    className="hover:text-white transition-colors"
                  >
                    Export PDF Monograph
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => navigateTo('admin')}
                    className="px-3 py-1 border border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-xs transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
                    <span>ADMIN STUDIO (/admin)</span>
                  </button>
                </div>
              </div>
            </footer>
          </div>
        ) : (
          /* PDF Studio Tab */
          <PdfStudio
            profile={profile}
            projects={projects}
            onTriggerPrint={handleTriggerPrint}
          />
        )}
      </main>

      {/* ======================================================== */}
      {/* PRINT-ONLY ROOT: Always rendered for browser window.print()*/}
      {/* ======================================================== */}
      <div className="print-only">
        <PrintDocument
          profile={profile}
          projects={projects}
          selectedProjectIds={projects.map(p => p.id)}
          options={{
            includeCover: true,
            includeColophon: true,
            grayscalePhotos: false
          }}
        />
      </div>

      {/* ======================================================== */}
      {/* MODALS                                                   */}
      {/* ======================================================== */}
      
      {/* Project Case Study Lightbox */}
      {detailProject && (
        <ProjectDetailModal
          project={detailProject}
          allProjects={projects}
          onClose={() => setDetailProject(null)}
          onEdit={(p) => {
            setDetailProject(null);
            setEditingProject(p || detailProject);
            navigateTo('admin');
          }}
          accentColor={accent}
        />
      )}

      {/* Profile & Customization Modal */}
      {isProfileModalOpen && (
        <ProfileModal
          profile={profile}
          projects={projects}
          onSaveProfile={handleSaveProfile}
          onRestoreData={handleRestoreData}
          onResetDefaults={handleResetDefaults}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

    </div>
  );
}
