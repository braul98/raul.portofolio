import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FilterBar from './components/FilterBar';
import ProjectCard from './components/ProjectCard';
import ProjectDetailModal from './components/ProjectDetailModal';
import ProjectEditModal from './components/ProjectEditModal';
import ProfileModal from './components/ProfileModal';
import PdfStudio from './components/PdfStudio';
import PrintDocument from './components/PrintDocument';
import {
  DEFAULT_PROFILE,
  INITIAL_PROJECTS,
  getStoredProfile,
  getStoredProjects,
  saveStoredProfile,
  saveStoredProjects
} from './storage';
import {
  fetchProjectsFromCloud,
  syncProjectsToCloud,
  saveProjectToCloud,
  deleteProjectFromCloud,
  fetchProfileFromCloud,
  saveProfileToCloud
} from './firebase';

export default function App() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cloudStatus, setCloudStatus] = useState('syncing'); // 'syncing' | 'synced' | 'local'

  // UI Navigation & View State
  const [activeTab, setActiveTab] = useState('gallery'); // 'gallery' | 'pdf-studio'
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutMode, setLayoutMode] = useState('grid'); // 'grid' | 'editorial' | 'list'

  // Modals
  const [detailProject, setDetailProject] = useState(null);
  const [editingProject, setEditingProject] = useState(null); // null when closed, {} when new, project object when editing
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Load persistent data: IndexedDB first for instant UI, then sync with Firebase Cloud
  useEffect(() => {
    async function loadData() {
      try {
        const [loadedProfile, loadedProjects] = await Promise.all([
          getStoredProfile(),
          getStoredProjects()
        ]);
        if (loadedProfile) setProfile(loadedProfile);
        if (loadedProjects) setProjects(loadedProjects);

        // Now attempt sync with Firebase Realtime Database
        try {
          const [cloudProfile, cloudProjects] = await Promise.all([
            fetchProfileFromCloud(),
            fetchProjectsFromCloud()
          ]);

          if (cloudProfile && cloudProfile.name) {
            setProfile(cloudProfile);
            await saveStoredProfile(cloudProfile);
          } else if (loadedProfile) {
            // First time initialization in cloud
            saveProfileToCloud(loadedProfile);
          }

          if (cloudProjects && cloudProjects.length > 0) {
            setProjects(cloudProjects);
            await saveStoredProjects(cloudProjects);
          } else if (loadedProjects && loadedProjects.length > 0) {
            // Seed cloud with initial projects
            syncProjectsToCloud(loadedProjects);
          }

          setCloudStatus('synced');
        } catch (cloudErr) {
          console.warn('Firebase cloud sync unavailable, using local mode:', cloudErr);
          setCloudStatus('local');
        }
      } catch (err) {
        console.error('Error loading stored portfolio data:', err);
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

  // Reset to default sample works
  const handleResetDefaults = async () => {
    setProfile(DEFAULT_PROFILE);
    setProjects(INITIAL_PROJECTS);
    await saveStoredProfile(DEFAULT_PROFILE);
    await saveStoredProjects(INITIAL_PROJECTS);
    await saveProfileToCloud(DEFAULT_PROFILE);
    await syncProjectsToCloud(INITIAL_PROJECTS);
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

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-[#ededed] flex flex-col selection:bg-red-600 selection:text-white">
      
      {/* Universal Navigation */}
      <Navbar
        profile={profile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewProject={() => setEditingProject({})}
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
              onOpenProfile={() => setIsProfileModalOpen(true)}
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

            {/* Projects Gallery */}
            <section className="no-print py-10 sm:py-14">
              <div className="max-w-7xl mx-auto px-4 sm:px-8">
                
                {filteredProjects.length === 0 ? (
                  <div className="py-20 text-center border border-dashed border-white/10 rounded-xs">
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
                ) : (
                  <div className={
                    layoutMode === 'list'
                      ? 'space-y-1'
                      : layoutMode === 'editorial'
                      ? 'grid grid-cols-1 md:grid-cols-2 gap-8'
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
                        onEdit={(p) => setEditingProject(p)}
                        onDelete={handleDeleteProject}
                      />
                    ))}
                  </div>
                )}

              </div>
            </section>

            {/* Bottom Monograph Footer */}
            <footer className="no-print border-t border-white/10 py-12 bg-black/40 text-neutral-400 text-xs font-mono">
              <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-white">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
                  <span>{profile.name} ARCHIVE</span>
                  <span className="text-neutral-600">//</span>
                  <span className="text-neutral-400">INDEX {new Date().getFullYear()}</span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setActiveTab('pdf-studio')}
                    className="hover:text-white transition-colors underline"
                  >
                    Open PDF Studio
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => setEditingProject({})}
                    className="hover:text-white transition-colors underline"
                  >
                    + Add New Work
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
          }}
          accentColor={accent}
        />
      )}

      {/* Project Add / Edit Modal */}
      {editingProject && (
        <ProjectEditModal
          initialProject={editingProject.id ? editingProject : null}
          onSave={handleSaveProject}
          onClose={() => setEditingProject(null)}
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
