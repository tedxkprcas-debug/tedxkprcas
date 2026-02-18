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
} from "./supabase";

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

