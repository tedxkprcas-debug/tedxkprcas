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

export type Sponsor = {
  id?: string;
  name: string;
  logo: string;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type SiteSetting = {
  id?: string;
  key: string;
  value: string;
  created_at?: string;
  updated_at?: string;
};

export type RegistrationFormField = {
  id?: string;
  field_name: string;
  field_label: string;
  field_type: 'text' | 'email' | 'tel' | 'number' | 'select' | 'textarea' | 'checkbox';
  placeholder?: string;
  options?: string[];
  is_required: boolean;
  order: number;
  is_active: boolean;
  show_for_category?: string[]; // 'all', 'student', 'company', 'other'
  created_at?: string;
  updated_at?: string;
};

export type PaymentSettings = {
  id?: string;
  qr_code_url?: string;
  upi_id?: string;
  payment_amount: number;
  payment_instructions?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type Registration = {
  id?: string;
  registration_code?: string;
  name: string;
  email: string;
  phone?: string;
  form_data: Record<string, any>;
  payment_status: 'pending' | 'submitted' | 'verified' | 'rejected';
  payment_screenshot_url?: string;
  user_upi_id?: string;
  payment_amount?: number;
  payment_verified_at?: string;
  payment_verified_by?: string;
  rejection_reason?: string;
  registration_status: 'pending' | 'confirmed' | 'cancelled';
  created_at?: string;
  updated_at?: string;
};

