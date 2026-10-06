import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { 
  getDatabase, 
  ref, 
  get, 
  set, 
  remove, 
  child 
} from "firebase/database";
import { 
  getStorage, 
  ref as storageRef, 
  uploadBytes, 
  getDownloadURL 
} from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyAXk_emJsnP4C7YrQM7JdAT_PI0ve47YpI",
  authDomain: "raulportofolio.firebaseapp.com",
  databaseURL: "https://raulportofolio-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "raulportofolio",
  storageBucket: "raulportofolio.firebasestorage.app",
  messagingSenderId: "684840231428",
  appId: "1:684840231428:web:3a0b44a15f6951fc0d0b51",
  measurementId: "G-M7CLZ2PNBS"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);

// Safe Analytics init
export let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

/**
 * Upload an image file to Firebase Cloud Storage.
 * Falls back to local if storage bucket is not configured.
 */
export async function uploadImageToStorage(file) {
  try {
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const path = `portfolio-photos/${Date.now()}_${cleanFileName}`;
    const sRef = storageRef(storage, path);
    
    // 2.5-second timeout race so local upload never hangs if Storage bucket is uninitialized
    const uploadTask = uploadBytes(sRef, file, {
      contentType: file.type || "image/jpeg"
    });
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Storage timeout - using fast local processing")), 2500)
    );

    const snapshot = await Promise.race([uploadTask, timeout]);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return { success: true, url: downloadUrl };
  } catch (error) {
    // Graceful fallback to canvas data URL
    return { success: false, error: error.message };
  }
}

/**
 * Fetch all projects from Realtime Database 'portfolio/projects'.
 */
export async function fetchProjectsFromCloud() {
  try {
    const dbRef = ref(rtdb);
    const snapshot = await get(child(dbRef, "portfolio/projects"));
    if (snapshot.exists()) {
      const data = snapshot.val();
      if (Array.isArray(data)) return data.filter(Boolean);
      return Object.values(data);
    }
    return null;
  } catch (error) {
    console.warn("RTDB fetch projects error:", error);
    return null;
  }
}

/**
 * Save / Update all projects array in Realtime Database.
 */
export async function syncProjectsToCloud(projects) {
  try {
    const projectsRef = ref(rtdb, "portfolio/projects");
    await set(projectsRef, projects);
    return true;
  } catch (error) {
    console.warn("RTDB sync projects error:", error);
    return false;
  }
}

/**
 * Save or update a single project.
 */
export async function saveProjectToCloud(project) {
  try {
    const projectRef = ref(rtdb, `portfolio/projects/${project.id}`);
    await set(projectRef, project);
    return true;
  } catch (error) {
    console.warn("RTDB save project error:", error);
    return false;
  }
}

/**
 * Delete a single project.
 */
export async function deleteProjectFromCloud(projectId) {
  try {
    const projectRef = ref(rtdb, `portfolio/projects/${projectId}`);
    await remove(projectRef);
    return true;
  } catch (error) {
    console.warn("RTDB delete project error:", error);
    return false;
  }
}

/**
 * Fetch profile settings from Realtime Database 'portfolio/profile'.
 */
export async function fetchProfileFromCloud() {
  try {
    const dbRef = ref(rtdb);
    const snapshot = await get(child(dbRef, "portfolio/profile"));
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.warn("RTDB fetch profile error:", error);
    return null;
  }
}

/**
 * Save profile settings to Realtime Database.
 */
export async function saveProfileToCloud(profile) {
  try {
    const profileRef = ref(rtdb, "portfolio/profile");
    await set(profileRef, profile);
    return true;
  } catch (error) {
    console.warn("RTDB save profile error:", error);
    return false;
  }
}

/**
 * Fetch skills list from Realtime Database 'portfolio/skills'.
 */
export async function fetchSkillsFromCloud() {
  try {
    const dbRef = ref(rtdb);
    const snapshot = await get(child(dbRef, "portfolio/skills"));
    if (snapshot.exists()) {
      const data = snapshot.val();
      if (Array.isArray(data)) return data.filter(Boolean);
      return Object.values(data);
    }
    return null;
  } catch (error) {
    console.warn("RTDB fetch skills error:", error);
    return null;
  }
}

/**
 * Sync skills array to Realtime Database.
 */
export async function syncSkillsToCloud(skills) {
  try {
    const skillsRef = ref(rtdb, "portfolio/skills");
    await set(skillsRef, skills);
    return true;
  } catch (error) {
    console.warn("RTDB sync skills error:", error);
    return false;
  }
}
