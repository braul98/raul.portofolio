import { get, set } from 'idb-keyval';

export const DEFAULT_PROFILE = {
  name: "ALEXANDER VANCE",
  role: "VISUAL DESIGNER & ART DIRECTOR",
  tagline: "Specializing in brand identities, high-contrast editorial photography, and spatial design.",
  location: "BERLIN / REMOTE",
  email: "alexander.vance@studio.design",
  phone: "+49 30 8920 4110",
  website: "vance.studio",
  instagram: "@alexvance_visuals",
  status: "Available for commissions & Q3 projects",
  accentColor: "#e63946", // Signature red
  bio: "Working at the intersection of Swiss typography, brutalist clarity, and tactile material culture. Over 8 years curating brand systems, exhibition catalogs, and physical/digital publications for international cultural institutions and independent studios."
};

export const INITIAL_PROJECTS = [
  {
    id: "proj-1",
    title: "NEO-BRUTALIST PAVILION",
    category: "Architecture",
    year: "2026",
    client: "Galerie Moderne",
    role: "Lead Visualist & Documentation",
    featured: true,
    coverIndex: 0,
    description: "Monolithic concrete exploration in urban acoustics. Captured using medium format monochrome photography with harsh noon shadows and pure geometric perspective.",
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop"
    ],
    tools: ["Phase One IQ4", "Capture One", "Editorial Print"]
  },
  {
    id: "proj-2",
    title: "RED SHIFT : VOL. 04",
    category: "Editorial",
    year: "2025",
    client: "Kyoto Art Review",
    role: "Art Direction & Typography",
    featured: true,
    coverIndex: 0,
    description: "A limited-run 180-page dual-tone monograph documenting avant-garde kinetic sculptures. Printed with Japanese soy ink in deep carbon black and fluorescent vermilion red.",
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop"
    ],
    tools: ["InDesign", "Custom Glyphs", "Risograph"]
  },
  {
    id: "proj-3",
    title: "KRONOS CHRONOMETER",
    category: "Product Design",
    year: "2025",
    client: "Atelier Horlogerie",
    role: "Industrial Identity & Case Study",
    featured: true,
    coverIndex: 0,
    description: "Tactile industrial timepiece crafted from bead-blasted titanium and matte sapphire. The high-contrast study balances extreme macro reflections with architectural geometry.",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop"
    ],
    tools: ["Macro 90mm", "Continuous Light", "3D CAD"]
  },
  {
    id: "proj-4",
    title: "SHADOW & CONCRETE",
    category: "Photography",
    year: "2024",
    client: "Self-Initiated Archive",
    role: "Curator & Photographer",
    featured: false,
    coverIndex: 0,
    description: "An ongoing photographic survey examining light refraction through cast-concrete staircases and brutalist municipal structures across Eastern Europe.",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1486718448742-163732cd1544?q=80&w=1200&auto=format&fit=crop"
    ],
    tools: ["Leica M11 Monochrom", "Summicron 35mm", "Silver Gelatin"]
  },
  {
    id: "proj-5",
    title: "SYNTEX IDENTITY SYSTEM",
    category: "Branding",
    year: "2024",
    client: "Syntex Cybernetics",
    role: "Brand Architect",
    featured: false,
    coverIndex: 0,
    description: "Holistic typographic identity for a robotics research laboratory. Built on a rigorous 16-column grid with laser-etched black aluminum signage and signature crimson telemetry accents.",
    images: [
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop"
    ],
    tools: ["Brand Guidelines", "Signage Specs", "Type Design"]
  }
];

const STORAGE_KEYS = {
  PROJECTS: "vibe_portfolio_projects_v1",
  PROFILE: "vibe_portfolio_profile_v1"
};

// Safe IndexedDB load / save helpers with fallback
export async function getStoredProjects() {
  try {
    const data = await get(STORAGE_KEYS.PROJECTS);
    if (data && Array.isArray(data) && data.length > 0) {
      return data;
    }
    // Initialize defaults if empty
    await set(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    return INITIAL_PROJECTS;
  } catch (err) {
    console.warn("IndexedDB load error, fallback to initial:", err);
    return INITIAL_PROJECTS;
  }
}

export async function saveStoredProjects(projects) {
  try {
    await set(STORAGE_KEYS.PROJECTS, projects);
    return true;
  } catch (err) {
    console.error("IndexedDB save error:", err);
    return false;
  }
}

export async function getStoredProfile() {
  try {
    const data = await get(STORAGE_KEYS.PROFILE);
    if (data && data.name) {
      return data;
    }
    await set(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
    return DEFAULT_PROFILE;
  } catch (err) {
    console.warn("IndexedDB profile load error:", err);
    return DEFAULT_PROFILE;
  }
}

export async function saveStoredProfile(profile) {
  try {
    await set(STORAGE_KEYS.PROFILE, profile);
    return true;
  } catch (err) {
    console.error("IndexedDB profile save error:", err);
    return false;
  }
}

// Helper to convert File to base64 DataURL with lightweight client-side downscale
export function readFileAsDataURL(file, maxWidth = 1920) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // If smaller than maxWidth, return original
        if (img.width <= maxWidth) {
          resolve(e.target.result);
          return;
        }
        // Downscale slightly to maintain crisp quality while staying lightweight
        const canvas = document.createElement("canvas");
        const scale = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL(file.type || "image/jpeg", 0.92));
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
