import React, { useState, useEffect } from 'react';
import PublicNavbar from './components/PublicNavbar';
import Hero from './components/Hero';
import PublicProjectCard from './components/PublicProjectCard';
import SkillsSection from './components/SkillsSection';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ProjectDetailModal from './components/ProjectDetailModal';
import ProjectEditModal from './components/ProjectEditModal';
import ProfileModal from './components/ProfileModal';
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
  fetchProfileFromCloud,
  saveProfileToCloud,
  fetchSkillsFromCloud,
  syncSkillsToCloud
} from './firebase';
import { Mail, MapPin, Globe, ArrowUpRight, X } from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [skills, setSkills] = useState(DEFAULT_SKILLS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cloudStatus, setCloudStatus] = useState('syncing');

  // URL-based Route: '/' (home/public) vs '/admin'
  const [currentRoute, setCurrentRoute] = useState(() => 
    window.location.pathname.startsWith('/admin') ? 'admin' : 'home'
  );

  // Admin authentication state (PIN 5542)
  const [isAdminAuthed, setIsAdminAuthed] = useState(() => 
    typeof window !== 'undefined' && sessionStorage.getItem('portfolio_admin_auth') === 'true'
  );

  // Lightbox for full-pixel image zoom
  const [zoomedImage, setZoomedImage] = useState(null);

  // Modals for admin editing
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

  // Sync profile changes
  const handleSaveProfile = async (newProfile) => {
    setProfile(newProfile);
    await saveStoredProfile(newProfile);
    await saveProfileToCloud(newProfile);
  };

  // Save new or updated project
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

  // Delete project
  const handleDeleteProject = async (projectId) => {
    const target = projects.find(p => p.id === projectId);
    const confirmText = target ? `Delete "${target.title}"?` : 'Delete this project?';
    if (!window.confirm(confirmText)) return;

    const updated = projects.filter(p => p.id !== projectId);
    setProjects(updated);
    await saveStoredProjects(updated);
    await syncProjectsToCloud(updated);
  };

  // Reorder projects in list
  const handleReorderProjects = async (reorderedProjects) => {
    setProjects(reorderedProjects);
    await saveStoredProjects(reorderedProjects);
    await syncProjectsToCloud(reorderedProjects);
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

  // Print PDF
  const handleTriggerPrint = () => {
    window.print();
  };

  const accent = profile.accentColor || '#e63946';

  // ========================================================
  // ROUTE: /admin (PASSWORD GATED WITH PIN 5542)
  // ========================================================
  if (currentRoute === 'admin') {
    // If not authenticated, show PIN gate
    if (!isAdminAuthed) {
      return (
        <AdminLogin
          onLoginSuccess={() => setIsAdminAuthed(true)}
          onBackHome={() => navigateTo('home')}
          accentColor={accent}
        />
      );
    }

    // Authenticated Admin Dashboard
    return (
      <div className="min-h-screen bg-[#0c0c0e] text-[#ededed]">
        <AdminDashboard
          profile={profile}
          projects={projects}
          skills={skills}
          onSaveProfile={handleSaveProfile}
          onSaveProject={handleSaveProject}
          onDeleteProject={handleDeleteProject}
          onReorderProjects={handleReorderProjects}
          onOpenNewProject={() => setEditingProject({})}
          onOpenEditProject={(p) => setEditingProject(p)}
          onSaveSkills={handleSaveSkills}
          onNavigateHome={() => navigateTo('home')}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
          onTriggerPrint={handleTriggerPrint}
          onLogout={() => {
            sessionStorage.removeItem('portfolio_admin_auth');
            setIsAdminAuthed(false);
          }}
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

        {/* Print-only root for PDF generation inside Admin */}
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
      </div>
    );
  }

  // ========================================================
  // ROUTE: / (100% CLEAN PUBLIC SHOWCASE: WORKS + SKILLS ONLY)
  // ========================================================
  return (
    <div className="min-h-screen bg-[#0c0c0e] text-[#ededed] flex flex-col selection:bg-red-600 selection:text-white">
      
      {/* Clean Public Navbar with smooth scroll links */}
      <PublicNavbar profile={profile} />

      {/* Main Public Content */}
      <main className="flex-1">
        
        {/* Hero Banner */}
        <Hero
          profile={profile}
          projects={projects}
          onOpenProfile={null}
        />

        {/* Works Section: Large, High-Res, Full-Color Visual Showcase */}
        <section id="works" className="no-print py-16 sm:py-24 scroll-mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14 pb-6 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
                  <span className="tracking-widest uppercase">CURATED SELECTION</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-bold font-heading uppercase text-white tracking-tight">
                  FEATURED WORKS
                </h2>
              </div>

              <div className="text-xs font-mono text-neutral-400">
                <span>INDEX // {projects.length.toString().padStart(2, '0')} CASE STUDIES</span>
              </div>
            </div>

            {/* Large Full-Color Project Showcase with In-Page Photo Switcher & Adjacent Text */}
            <div className="space-y-16 sm:space-y-24">
              {projects.map((proj, idx) => (
                <PublicProjectCard
                  key={proj.id}
                  project={proj}
                  index={idx}
                  accentColor={accent}
                  onOpenZoom={(url, title) => setZoomedImage({ url, title })}
                />
              ))}
            </div>

          </div>
        </section>

        {/* Skills Section: Animated Progress Bars */}
        <SkillsSection
          skills={skills}
          accentColor={accent}
        />

        {/* Clean Contact & Colophon Footer */}
        <footer id="contact" className="no-print border-t border-white/10 py-16 sm:py-24 bg-[#0a0a0c] text-neutral-400 scroll-mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
              
              <div className="md:col-span-6 space-y-4">
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block" style={{ color: accent }}>
                  [ INQUIRIES & COMMISSIONS ]
                </span>
                <h3 className="text-2xl sm:text-4xl font-bold font-heading uppercase text-white tracking-tight">
                  LET'S BUILD TOGETHER.
                </h3>
                <p className="text-sm text-neutral-400 max-w-md font-light leading-relaxed">
                  Available for independent art direction, commissioned architectural documentation, brand identity systems, and editorial design.
                </p>
              </div>

              <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-mono">
                {profile.email && (
                  <div>
                    <span className="text-neutral-500 uppercase block mb-1">DIRECT INQUIRIES</span>
                    <a href={`mailto:${profile.email}`} className="text-white hover:underline text-sm font-semibold">
                      {profile.email}
                    </a>
                  </div>
                )}

                {profile.location && (
                  <div>
                    <span className="text-neutral-500 uppercase block mb-1">LOCATION & BASE</span>
                    <span className="text-white text-sm font-semibold">
                      {profile.location}
                    </span>
                  </div>
                )}

                {profile.website && (
                  <div>
                    <span className="text-neutral-500 uppercase block mb-1">PORTAL</span>
                    <a href={`https://${profile.website}`} target="_blank" rel="noreferrer" className="text-white hover:underline">
                      {profile.website}
                    </a>
                  </div>
                )}

                {profile.instagram && (
                  <div>
                    <span className="text-neutral-500 uppercase block mb-1">SOCIAL ARCHIVE</span>
                    <span className="text-white">
                      {profile.instagram}
                    </span>
                  </div>
                )}
              </div>

            </div>

            {/* Bottom Colophon Bar */}
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500">
              <div className="flex items-center gap-2 text-white">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
                <span>© {new Date().getFullYear()} {profile.name}</span>
                <span className="text-neutral-600">//</span>
                <span className="text-neutral-400">ALL RIGHTS RESERVED</span>
              </div>

              <div>
                <span>EDITORIAL MONOGRAPH // DIGITAL ARCHIVE</span>
              </div>
            </div>

          </div>
        </footer>

      </main>

      {/* Pure Fullscreen Image Zoom (Only opens if photo is clicked for pixel inspection) */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 cursor-zoom-out animate-in fade-in duration-200"
        >
          <button
            onClick={() => setZoomedImage(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            title="Close Zoom"
          >
            <X size={20} />
          </button>
          <img
            src={zoomedImage.url}
            alt={zoomedImage.title}
            className="max-w-[95vw] max-h-[92vh] object-contain drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
          />
        </div>
      )}

    </div>
  );
}
