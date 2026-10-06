import { get, set } from 'idb-keyval';

export const DEFAULT_PROFILE = {
  name: "Boșș Raul",
  role: "VISUAL DESIGNER, IT Engineer, Product Manager",
  tagline: "Transforming ideas into digital reality through web design, development, and impactful marketing content.",
  location: "Brașov / REMOTE",
  email: "raulstefan98@gmail.com",
  phone: "+49 30 8920 4110",
  website: "",
  instagram: "",
  status: "Available for commissions & Q3 projects",
  accentColor: "#f59e0b",
  bio: "A lifelong learner driven by curiosity and continuous adaptation. My diverse professional background has equipped me with a flexible mindset and strong interpersonal skills, allowing me to thrive in dynamic environments and collaborate seamlessly with cross-functional teams. I believe that embracing new challenges is the key to delivering meaningful results."
};

export const INITIAL_PROJECTS = [];

export const DEFAULT_SKILLS = [
  { id: "sk-1", name: "Photoshop", percentage: 74, category: "Design" },
  { id: "sk-2", name: "Illustrator", percentage: 85, category: "Design" },
  { id: "sk-3", name: "Lightroom", percentage: 80, category: "Design" },
  { id: "sk-4", name: "Website creation", percentage: 90, category: "Technical" }
];

const STORAGE_KEYS = {
  PROJECTS: "vibe_portfolio_projects_v1",
  PROFILE: "vibe_portfolio_profile_v1",
  SKILLS: "vibe_portfolio_skills_v1"
};

// Fast synchronous localStorage cache helpers to prevent any Flash of Initial Content (FOIC)
export function getCachedProfile() {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (item) {
      const parsed = JSON.parse(item);
      if (parsed && parsed.name) return parsed;
    }
  } catch (e) {}
  return DEFAULT_PROFILE;
}

export function getCachedProjects() {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (item) {
      const parsed = JSON.parse(item);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return [];
}

export function getCachedSkills() {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.SKILLS);
    if (item) {
      const parsed = JSON.parse(item);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return DEFAULT_SKILLS;
}

// Safe IndexedDB load / save helpers with fallback
export async function getStoredProjects() {
  try {
    const data = await get(STORAGE_KEYS.PROJECTS);
    if (data && Array.isArray(data) && data.length > 0) {
      try { localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(data)); } catch (e) {}
      return data;
    }
    return getCachedProjects();
  } catch (err) {
    console.warn("IndexedDB load error, fallback to cache:", err);
    return getCachedProjects();
  }
}

export async function saveStoredProjects(projects) {
  try {
    await set(STORAGE_KEYS.PROJECTS, projects);
    try { localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects)); } catch (e) {}
    return true;
  } catch (err) {
    console.error("IndexedDB save error:", err);
    try { localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects)); } catch (e) {}
    return false;
  }
}

export async function getStoredProfile() {
  try {
    const data = await get(STORAGE_KEYS.PROFILE);
    if (data && data.name) {
      try { localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(data)); } catch (e) {}
      return data;
    }
    return getCachedProfile();
  } catch (err) {
    console.warn("IndexedDB profile load error:", err);
    return getCachedProfile();
  }
}

export async function saveStoredProfile(profile) {
  try {
    await set(STORAGE_KEYS.PROFILE, profile);
    try { localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile)); } catch (e) {}
    return true;
  } catch (err) {
    console.error("IndexedDB profile save error:", err);
    try { localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile)); } catch (e) {}
    return false;
  }
}

export async function getStoredSkills() {
  try {
    const data = await get(STORAGE_KEYS.SKILLS);
    if (data && Array.isArray(data) && data.length > 0) {
      try { localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(data)); } catch (e) {}
      return data;
    }
    return getCachedSkills();
  } catch (err) {
    console.warn("IndexedDB skills load error:", err);
    return getCachedSkills();
  }
}

export async function saveStoredSkills(skills) {
  try {
    await set(STORAGE_KEYS.SKILLS, skills);
    try { localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills)); } catch (e) {}
    return true;
  } catch (err) {
    console.error("IndexedDB skills save error:", err);
    try { localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills)); } catch (e) {}
    return false;
  }
}

// Helper to convert File to optimized base64 DataURL
export function readFileAsDataURL(file, maxWidth = 1600, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(dataUrl);
        } catch (canvasErr) {
          console.warn("Canvas compression error, using raw file:", canvasErr);
          resolve(e.target.result);
        }
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
