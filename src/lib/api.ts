import {
  supabase,
  Participant,
  Speaker,
  Certificate,
  ContactInfo,
  AboutInfo,
  Event,
  GalleryImage,
  TeamMember,
  Sponsor,
  VenuePartner,
  RegistrationFormField,
  PaymentSettings,
  Registration,
} from "./supabase";
import { sendRegistrationPendingEmail, sendTicketEmail, sendCustomEmail } from "./email";

// ==================== PARTICIPANTS ====================

export const participantService = {
  async getAll() {
    const { data, error } = await supabase
      .from("participants")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Participant[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("participants")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Participant;
  },

  async create(participant: Omit<Participant, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase
      .from("participants")
      .insert([participant])
      .select()
      .single();

    if (error) throw error;
    return data as Participant;
  },

  async update(id: string, participant: Partial<Participant>) {
    const { data, error } = await supabase
      .from("participants")
      .update(participant)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Participant;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("participants")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  async bulkUpdate(ids: string[], updates: Partial<Participant>) {
    const { data, error } = await supabase
      .from("participants")
      .update(updates)
      .in("id", ids)
      .select();

    if (error) throw error;
    return data as Participant[];
  },

  async importFromGoogle(participants: Omit<Participant, "id" | "created_at" | "updated_at">[]) {
    const { data, error } = await supabase
      .from("participants")
      .insert(participants)
      .select();

    if (error) throw error;
    return data as Participant[];
  },
};

// ==================== SPEAKERS ====================

export const speakerService = {
  async getAll() {
    const { data, error } = await supabase
      .from("speakers")
      .select("*")
      .order("order", { ascending: true });

    if (error) throw error;
    return data as Speaker[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("speakers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Speaker;
  },

  async create(speaker: Omit<Speaker, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase
      .from("speakers")
      .insert([speaker])
      .select()
      .single();

    if (error) throw error;
    return data as Speaker;
  },

  async update(id: string, speaker: Partial<Speaker>) {
    const { data, error } = await supabase
      .from("speakers")
      .update(speaker)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Speaker;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("speakers")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  async uploadImage(file: File, speakerId: string) {
    const fileExt = file.name.split(".").pop();
    const filePath = `speaker-${speakerId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("speaker-images")
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("speaker-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  },
};

// ==================== CERTIFICATES ====================

export const certificateService = {
  async getLatest() {
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code === "PGRST116") {
      // No rows found, return default
      return {
        title: "Certificate of Participation",
        text: "In recognition of your enthusiasm, engagement, and commitment to spreading ideas worth sharing.",
        bgColor: "from-amber-50 to-yellow-50",
      } as Certificate;
    }

    if (error) throw error;
    return data as Certificate;
  },

  async update(updates: Omit<Certificate, "id" | "created_at" | "updated_at">) {
    // Get existing certificate
    const { data: existing } = await supabase
      .from("certificates")
      .select("*")
      .limit(1)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from("certificates")
        .update(updates)
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      return data as Certificate;
    } else {
      const { data, error } = await supabase
        .from("certificates")
        .insert([updates])
        .select()
        .single();

      if (error) throw error;
      return data as Certificate;
    }
  },
};

// ==================== CONTACT INFO ====================

export const contactService = {
  async get() {
    const { data, error } = await supabase
      .from("contact_info")
      .select("*")
      .limit(1)
      .single();

    if (error && error.code === "PGRST116") {
      // No rows found, return default
      return {
        email: "contact@kprcas.edu.in",
        phone: "+91-XXXX-XXXX-XX",
        address: "KPR College of Arts and Science, Coimbatore",
        formLink: "https://forms.gle/example",
        registrationLink: "https://forms.gle/example",
      } as ContactInfo;
    }

    if (error) throw error;
    return data as ContactInfo;
  },

  async update(updates: Omit<ContactInfo, "id" | "created_at" | "updated_at">) {
    const { data: existing } = await supabase
      .from("contact_info")
      .select("*")
      .limit(1)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from("contact_info")
        .update(updates)
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      return data as ContactInfo;
    } else {
      const { data, error } = await supabase
        .from("contact_info")
        .insert([updates])
        .select()
        .single();

      if (error) throw error;
      return data as ContactInfo;
    }
  },
};

// ==================== ABOUT INFO ====================

export const aboutService = {
  async get() {
    const { data, error } = await supabase
      .from("about_info")
      .select("*")
      .limit(1)
      .single();

    if (error && error.code === "PGRST116") {
      // No rows found, return default
      return {
        title: "About TEDx KPRCAS",
        description: "TEDx is an independent event that brings people together to share a TED-like experience.",
        content: "In the spirit of ideas worth spreading, TED has created a program called TEDx.",
        about_ted_title: "About TED",
        about_ted_content: "TED is a nonprofit organization devoted to spreading ideas worth sharing through short, powerful talks in a radically shareable video format. TED stands for Technology, Entertainment, Design.",
        about_tedx_title: "About TEDx",
        about_tedx_content: "TEDx is an independent event that brings people together to share a TED-like experience. In the spirit of ideas worth spreading, TED has created a program called TEDx.",
        why_at_kprcas_title: "Why at KPRCAS",
        why_at_kprcas_content: "KPR College of Arts, Science and Research is committed to fostering innovation, creativity, and critical thinking.",
      } as AboutInfo;
    }

    if (error) throw error;
    return data as AboutInfo;
  },

  async update(updates: Omit<AboutInfo, "id" | "created_at" | "updated_at">) {
    const { data: existing } = await supabase
      .from("about_info")
      .select("*")
      .limit(1)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from("about_info")
        .update(updates)
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      return data as AboutInfo;
    } else {
      const { data, error } = await supabase
        .from("about_info")
        .insert([updates])
        .select()
        .single();

      if (error) throw error;
      return data as AboutInfo;
    }
  },
};

// ==================== EVENTS ====================

export const eventService = {
  async getAll() {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: false });

    if (error) throw error;
    return data as Event[];
  },

  async getCurrent() {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code === "PGRST116") {
      return null;
    }

    if (error) throw error;
    return data as Event;
  },

  async create(event: Omit<Event, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase
      .from("events")
      .insert([event])
      .select()
      .single();

    if (error) throw error;
    return data as Event;
  },

  async update(id: string, event: Partial<Event>) {
    const { data, error } = await supabase
      .from("events")
      .update(event)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Event;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};

// ==================== GALLERY ====================

export const galleryService = {
  async getAll() {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("order", { ascending: true });

    if (error) throw error;
    return data as GalleryImage[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as GalleryImage;
  },

  async create(item: Omit<GalleryImage, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase
      .from("gallery")
      .insert([item])
      .select()
      .single();

    if (error) throw error;
    return data as GalleryImage;
  },

  async update(id: string, item: Partial<GalleryImage>) {
    const { data, error } = await supabase
      .from("gallery")
      .update(item)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as GalleryImage;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("gallery")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};

// ==================== TEAM MEMBERS ====================

export const teamService = {
  async getAll() {
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("is_active", true)
      .order("order", { ascending: true });

    if (error) throw error;
    return data as TeamMember[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as TeamMember;
  },

  async create(member: Omit<TeamMember, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase
      .from("team_members")
      .insert([member])
      .select()
      .single();

    if (error) throw error;
    return data as TeamMember;
  },

  async update(id: string, member: Partial<TeamMember>) {
    const { data, error } = await supabase
      .from("team_members")
      .update(member)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as TeamMember;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};

// ==================== SPONSORS ====================

export const siteSettingsService = {
  async get(key: string): Promise<string> {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("key", key)
      .limit(1)
      .maybeSingle();

    if (error) return "";
    return data?.value || "";
  },

  async set(key: string, value: string) {
    const { data: existing } = await supabase
      .from("site_settings")
      .select("*")
      .eq("key", key)
      .limit(1)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from("site_settings")
        .update({ value, updated_at: new Date().toISOString() })
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from("site_settings")
        .insert([{ key, value }])
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  },

  async remove(key: string) {
    const { error } = await supabase
      .from("site_settings")
      .delete()
      .eq("key", key);
    if (error) throw error;
  },

  async uploadVideo(file: File) {
    const fileExt = file.name.split(".").pop();
    const filePath = `theme-video-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("site-assets")
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw new Error(
      `Upload failed: ${uploadError.message}. Please run this SQL in Supabase SQL Editor: INSERT INTO storage.buckets (id, name, public) VALUES ('site-assets', 'site-assets', true) ON CONFLICT (id) DO NOTHING;`
    );

    const { data } = supabase.storage
      .from("site-assets")
      .getPublicUrl(filePath);

    return data.publicUrl;
  },
};

// ==================== THEME STATS ====================

interface ThemeStat {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const themeStatsService = {
  async getAll() {
    const { data, error } = await supabase
      .from("theme_stats")
      .select("*")
      .eq("is_active", true)
      .order("order", { ascending: true });

    if (error) throw error;
    return data as ThemeStat[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("theme_stats")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as ThemeStat;
  },

  async create(themeStat: Omit<ThemeStat, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase
      .from("theme_stats")
      .insert([themeStat])
      .select()
      .single();

    if (error) throw error;
    return data as ThemeStat;
  },

  async update(id: string, themeStat: Partial<ThemeStat>) {
    const { data, error } = await supabase
      .from("theme_stats")
      .update(themeStat)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as ThemeStat;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("theme_stats")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};

export const sponsorService = {
  async getAll() {
    const { data, error } = await supabase
      .from("sponsors")
      .select("*")
      .eq("is_active", true)
      .order("order", { ascending: true });

    if (error) throw error;
    return data as Sponsor[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("sponsors")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Sponsor;
  },

  async create(sponsor: Omit<Sponsor, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase
      .from("sponsors")
      .insert([sponsor])
      .select()
      .single();

    if (error) throw error;
    return data as Sponsor;
  },

  async update(id: string, sponsor: Partial<Sponsor>) {
    const { data, error } = await supabase
      .from("sponsors")
      .update(sponsor)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Sponsor;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("sponsors")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};

// ==================== VENUE PARTNERS ====================

export const venuePartnerService = {
  async getAll() {
    const { data, error } = await supabase
      .from("venue_partners")
      .select("*")
      .order("order", { ascending: true });

    if (error) throw error;
    return data as VenuePartner[];
  },

  async create(partner: Omit<VenuePartner, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase
      .from("venue_partners")
      .insert([partner])
      .select()
      .single();

    if (error) throw error;
    return data as VenuePartner;
  },

  async update(id: string, partner: Partial<VenuePartner>) {
    const { data, error } = await supabase
      .from("venue_partners")
      .update(partner)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as VenuePartner;
  },

  async delete(id: string) {
    const { error } = await supabase.from("venue_partners").delete().eq("id", id);
    if (error) throw error;
    return true;
  },
};

// ==================== REGISTRATION FORM FIELDS ====================

export const registrationFormFieldService = {
  async getAll() {
    const { data, error } = await supabase
      .from("registration_form_fields")
      .select("*")
      .eq("is_active", true)
      .order("order", { ascending: true });

    if (error) throw error;
    return data as RegistrationFormField[];
  },

  async getAllIncludingInactive() {
    const { data, error } = await supabase
      .from("registration_form_fields")
      .select("*")
      .order("order", { ascending: true });

    if (error) throw error;
    return data as RegistrationFormField[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("registration_form_fields")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as RegistrationFormField;
  },

  async create(field: Omit<RegistrationFormField, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase
      .from("registration_form_fields")
      .insert([field])
      .select()
      .single();

    if (error) throw error;
    return data as RegistrationFormField;
  },

  async update(id: string, field: Partial<RegistrationFormField>) {
    const { data, error } = await supabase
      .from("registration_form_fields")
      .update(field)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as RegistrationFormField;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("registration_form_fields")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};

// ==================== PAYMENT SETTINGS ====================

export const paymentSettingsService = {
  async get() {
    const { data, error } = await supabase
      .from("payment_settings")
      .select("*")
      .eq("is_active", true)
      .limit(1)
      .single();

    if (error && error.code === "PGRST116") {
      return {
        upi_id: "",
        payment_amount: 0,
        payment_instructions: "",
        is_active: true,
      } as PaymentSettings;
    }

    if (error) throw error;
    return data as PaymentSettings;
  },

  async update(settings: Partial<PaymentSettings>) {
    const { data: existing } = await supabase
      .from("payment_settings")
      .select("*")
      .limit(1)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from("payment_settings")
        .update(settings)
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      return data as PaymentSettings;
    } else {
      const { data, error } = await supabase
        .from("payment_settings")
        .insert([{ ...settings, is_active: true }])
        .select()
        .single();

      if (error) throw error;
      return data as PaymentSettings;
    }
  },

  async uploadQRCode(file: File) {
    const fileExt = file.name.split(".").pop();
    const filePath = `payment-qr-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("site-assets")
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("site-assets")
      .getPublicUrl(filePath);

    return data.publicUrl;
  },
};

// ==================== REGISTRATIONS ====================

// Generate a unique registration code like PREFIX-2026-ABC123 (prefix is configurable via site_settings)
async function generateRegistrationCode(): Promise<string> {
  const year = new Date().getFullYear();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const prefix = (await siteSettingsService.get("registration_code_prefix")) || "TEDX";
  return `${prefix}-${year}-${code}`;
}

// Send registration data to Google Sheets via Apps Script web app
async function sendToGoogleSheet(data: {
  name: string;
  email: string;
  phone?: string;
  user_type?: string;
  form_data?: Record<string, any>;
  registration_code?: string;
  registration_number?: number;
  payment_status?: string;
  user_upi_id?: string;
  transaction_id?: string;
  created_at?: string;
}) {
  try {
    // Get the Google Sheet Apps Script URL from site settings
    const sheetUrl = await siteSettingsService.get("google_sheet_webhook_url");
    
    if (!sheetUrl) {
      console.log("Google Sheet webhook URL not configured, skipping...");
      return;
    }

    // Format date and time for better readability in Google Sheets
    const now = new Date();
    const dateString = now.toLocaleDateString('en-IN'); // DD/MM/YYYY
    const timeString = now.toLocaleTimeString('en-IN'); // HH:MM:SS
    const isoTimestamp = now.toISOString(); // Keep for reference

    // Flatten form_data for the sheet
    const flatData: Record<string, any> = {
      timestamp: `${dateString} ${timeString}`, // Human-readable format
      iso_timestamp: isoTimestamp, // ISO format for accuracy
      registration_number: data.registration_number || "",
      name: data.name,
      email: data.email,
      phone: data.phone || "",
      user_type: data.user_type || data.form_data?.user_type || "",
      registration_code: data.registration_code || "",
      payment_status: data.payment_status || "pending",
      user_upi_id: data.user_upi_id || "",
      transaction_id: data.transaction_id || "",
    };

    // Add all form_data fields
    if (data.form_data) {
      Object.entries(data.form_data).forEach(([key, value]) => {
        if (key !== "user_type") { // Already added
          flatData[key] = typeof value === "object" ? JSON.stringify(value) : value;
        }
      });
    }

    // Send to Google Sheets Apps Script
    const response = await fetch(sheetUrl, {
      method: "POST",
      mode: "no-cors", // Apps Script doesn't support CORS
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(flatData),
    });

    console.log("✅ Data sent to Google Sheet successfully");
    return true;
  } catch (error) {
    console.error("Failed to send data to Google Sheet:", error);
    // Don't throw - we don't want to fail registration if sheet fails
    return false;
  }
}

export const registrationService = {
  async getAll() {
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Registration[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Registration;
  },

  async getByRegistrationCode(code: string) {
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .eq("registration_code", code.toUpperCase())
      .single();

    if (error) throw error;
    return data as Registration;
  },

  async searchByCode(code: string) {
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .ilike("registration_code", `%${code}%`)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Registration[];
  },

  async create(registration: Omit<Registration, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase
      .from("registrations")
      .insert([registration])
      .select()
      .single();

    if (error) throw error;
    
    // Send to Google Sheet in background (don't await to not slow down registration)
    sendToGoogleSheet({
      name: registration.name,
      email: registration.email,
      phone: registration.phone,
      user_type: registration.user_type,
      form_data: registration.form_data,
      registration_number: data.registration_number,
      payment_status: registration.payment_status,
      created_at: data.created_at,
    });
    
    return data as Registration;
  },

  async update(id: string, registration: Partial<Registration>) {
    const { data, error } = await supabase
      .from("registrations")
      .update(registration)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Registration;
  },

  async submitPaymentWithCode(id: string, paymentData: {
    payment_screenshot_url: string;
    user_upi_id: string;
    payment_amount: number;
    transaction_id?: string;
  }) {
    // Generate unique registration code
    const registration_code = await generateRegistrationCode();
    
    const { data, error } = await supabase
      .from("registrations")
      .update({
        ...paymentData,
        registration_code,
        payment_status: "submitted",
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    
    // Send to Google Sheet with all payment details
    sendToGoogleSheet({
      name: data.name,
      email: data.email,
      phone: data.phone,
      user_type: data.user_type,
      form_data: data.form_data,
      registration_number: data.registration_number,
      registration_code: registration_code,
      payment_status: "submitted",
      user_upi_id: paymentData.user_upi_id,
      transaction_id: paymentData.transaction_id || "",
    });
    
    // AUTO-SEND: Registration pending email to user
    sendRegistrationPendingEmail(null, {
      to_email: data.email,
      to_name: data.name,
      registration_code: registration_code,
      event_name: "TEDx KPRCAS",
    }).then(() => {
      console.log("✅ Registration pending email sent to:", data.email);
    }).catch((err) => {
      console.error("❌ Failed to send registration pending email:", err);
    });
    
    return data as Registration;
  },

  // Send ticket email after admin verifies payment
  async sendVerifiedEmail(registration: Registration, ticketUrl?: string, customMessage?: string) {
    if (customMessage) {
      // Send custom email from admin
      return sendCustomEmail(null, {
        to_email: registration.email,
        to_name: registration.name,
        subject: `🎫 Payment Verified - TEDx KPRCAS | ${registration.registration_code}`,
        message: customMessage,
        registration_code: registration.registration_code,
        ticket_url: ticketUrl,
        event_name: "TEDx KPRCAS",
      });
    } else {
      // Send default ticket email
      return sendTicketEmail(null, {
        to_email: registration.email,
        to_name: registration.name,
        registration_code: registration.registration_code || "",
        ticket_url: ticketUrl,
        event_name: "TEDx KPRCAS",
      });
    }
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("registrations")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  async uploadPaymentScreenshot(file: File, registrationId: string) {
    const fileExt = file.name.split(".").pop();
    const filePath = `payment-${registrationId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("payment-screenshots")
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("payment-screenshots")
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  async verifyPayment(id: string, verifiedBy: string) {
    const { data, error } = await supabase
      .from("registrations")
      .update({
        payment_status: "verified",
        payment_verified_at: new Date().toISOString(),
        payment_verified_by: verifiedBy,
        registration_status: "confirmed",
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Registration;
  },

  async rejectPayment(id: string, reason: string) {
    const { data, error } = await supabase
      .from("registrations")
      .update({
        payment_status: "rejected",
        rejection_reason: reason,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Registration;
  },
};

