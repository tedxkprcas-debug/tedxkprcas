import { createClient } from "@supabase/supabase-js";

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

// Log for debugging
console.log("Supabase URL configured:", !!supabaseUrl);
console.log("Supabase Key configured:", !!supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing Supabase credentials. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env.local"
  );
  console.error("Current URL:", supabaseUrl);
  console.error("Current Key:", supabaseKey ? "***" : "NOT SET");
}

// Create Supabase client - it will only work if both credentials are present
let supabase: any;

try {
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log("✅ Supabase client initialized successfully");
  } else {
    throw new Error("Supabase credentials are missing or invalid");
  }
} catch (error) {
  console.error("❌ Failed to initialize Supabase:", error);
  // Create a dummy client to prevent app from crashing
  supabase = {
    from: () => ({ select: () => Promise.reject(new Error("Supabase not configured")) }),
  };
}

export { supabase };

// Database types
export type Participant = {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  date: string;
  status: "registered" | "attended" | "no-show";
  certSent: boolean;
  certSentDate?: string;
  created_at?: string;
  updated_at?: string;
};

export type Speaker = {
  id?: string;
  name: string;
  role: string;
  image?: string;
  bio?: string;
  order: number;
  created_at?: string;
  updated_at?: string;
};

export type Certificate = {
  id?: string;
  title: string;
  text: string;
  bgColor: string;
  created_at?: string;
  updated_at?: string;
};

export type ContactInfo = {
  id?: string;
  email: string;
  phone: string;
  address: string;
  formLink: string;
  registrationLink: string;
  created_at?: string;
  updated_at?: string;
};

export type AboutInfo = {
  id?: string;
  title: string;
  description: string;
  content: string;
  created_at?: string;
  updated_at?: string;
};

export type Event = {
  id?: string;
  name: string;
  date: string;
  description?: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
};

export type GalleryImage = {
  id?: string;
  title: string;
  description?: string;
  image: string;
  order: number;
  created_at?: string;
  updated_at?: string;
};

export type TeamMember = {
  id?: string;
  name: string;
  role: string;
  photo: string;
  description?: string;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

