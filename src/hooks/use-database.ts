import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import {
  participantService,
  speakerService,
  certificateService,
  contactService,
  aboutService,
  eventService,
  galleryService,
  teamService,
  sponsorService,
  siteSettingsService,
  registrationFormFieldService,
  paymentSettingsService,
  registrationService,
} from "@/lib/api";
import type {
  Participant,
  Speaker,
  Certificate,
  ContactInfo,
  AboutInfo,
  Event,
  GalleryImage,
  TeamMember,
  Sponsor,
  RegistrationFormField,
  PaymentSettings,
  Registration,
} from "@/lib/supabase";

// ==================== PARTICIPANTS HOOKS ====================

export function useParticipants() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["participants"],
    queryFn: () => participantService.getAll(),
    staleTime: 0, // Instant updates
  });

  // Set up real-time subscription
  useEffect(() => {
    const subscription = supabase
      .channel("participants-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "participants",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["participants"] });
          console.log("🔄 Participants updated from database");
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  return query;
}

export function useParticipant(id: string) {
  return useQuery({
    queryKey: ["participants", id],
    queryFn: () => participantService.getById(id),
  });
}

export function useCreateParticipant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Participant, "id" | "created_at" | "updated_at">) =>
      participantService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants"] });
    },
  });
}

export function useUpdateParticipant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Participant> }) =>
      participantService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants"] });
    },
  });
}

export function useDeleteParticipant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => participantService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants"] });
    },
  });
}

export function useBulkUpdateParticipants() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, updates }: { ids: string[]; updates: Partial<Participant> }) =>
      participantService.bulkUpdate(ids, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants"] });
    },
  });
}

export function useImportParticipants() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Participant, "id" | "created_at" | "updated_at">[]) =>
      participantService.importFromGoogle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants"] });
    },
  });
}

// ==================== SPEAKERS HOOKS ====================

export function useSpeakers() {
  const queryClient = useQueryClient();
  const subscriptionRef = useRef<any>(null);
  
  const query = useQuery({
    queryKey: ["speakers"],
    queryFn: () => speakerService.getAll(),
    staleTime: 0, // Set to 0 for instant updates
  });

  // Set up real-time subscription - only once
  useEffect(() => {
    // Prevent duplicate subscriptions
    if (subscriptionRef.current) {
      console.log("📡 Speakers subscription already exists");
      return;
    }

    console.log("📡 Setting up speakers real-time subscription...");

    // Subscribe to changes in the speakers table
    subscriptionRef.current = supabase
      .channel("speakers-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "speakers",
        },
        (payload) => {
          console.log("🔄 Speakers updated from database:", payload);
          // Invalidate the cache immediately
          queryClient.invalidateQueries({ queryKey: ["speakers"] });
        }
      )
      .subscribe((status) => {
        console.log("📡 Speakers subscription status:", status);
      });

    return () => {
      if (subscriptionRef.current) {
        console.log("🛑 Unsubscribing from speakers channel");
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [queryClient]);

  return query;
}

export function useSpeaker(id: string) {
  return useQuery({
    queryKey: ["speakers", id],
    queryFn: () => speakerService.getById(id),
  });
}

export function useCreateSpeaker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Speaker, "id" | "created_at" | "updated_at">) =>
      speakerService.create(data),
    onSuccess: () => {
      console.log("✅ Speaker created successfully");
      // Immediately invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["speakers"] });
    },
    onError: (error) => {
      console.error("❌ Failed to create speaker:", error);
    },
  });
}

export function useUpdateSpeaker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Speaker> }) =>
      speakerService.update(id, data),
    onSuccess: () => {
      console.log("✅ Speaker updated successfully");
      // Immediately invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["speakers"] });
    },
    onError: (error) => {
      console.error("❌ Failed to update speaker:", error);
    },
  });
}

export function useDeleteSpeaker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => speakerService.delete(id),
    onSuccess: () => {
      console.log("✅ Speaker deleted successfully");
      // Immediately invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["speakers"] });
    },
    onError: (error) => {
      console.error("❌ Failed to delete speaker:", error);
    },
  });
}

export function useUploadSpeakerImage() {
  return useMutation({
    mutationFn: ({ file, speakerId }: { file: File; speakerId: string }) =>
      speakerService.uploadImage(file, speakerId),
  });
}

// ==================== CERTIFICATES HOOKS ====================

export function useCertificate() {
  return useQuery({
    queryKey: ["certificate"],
    queryFn: () => certificateService.getLatest(),
  });
}

export function useUpdateCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Certificate, "id" | "created_at" | "updated_at">) =>
      certificateService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificate"] });
    },
  });
}

// ==================== CONTACT INFO HOOKS ====================

export function useContactInfo() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["contact"],
    queryFn: () => contactService.get(),
    staleTime: 0, // Instant updates
  });

  useEffect(() => {
    const subscription = supabase
      .channel("contact-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "contact_info",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["contact"] });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  return query;
}

export function useUpdateContactInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ContactInfo, "id" | "created_at" | "updated_at">) =>
      contactService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact"] });
    },
  });
}

// ==================== ABOUT INFO HOOKS ====================

export function useAboutInfo() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["about"],
    queryFn: () => aboutService.get(),
    staleTime: 0, // Instant updates
  });

  useEffect(() => {
    const subscription = supabase
      .channel("about-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "about_info",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["about"] });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  return query;
}

export function useUpdateAboutInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<AboutInfo, "id" | "created_at" | "updated_at">) =>
      aboutService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about"] });
    },
  });
}

// ==================== EVENTS HOOKS ====================

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: () => eventService.getAll(),
  });
}

export function useCurrentEvent() {
  return useQuery({
    queryKey: ["currentEvent"],
    queryFn: () => eventService.getCurrent(),
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Event, "id" | "created_at" | "updated_at">) =>
      eventService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Event> }) =>
      eventService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => eventService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

// ==================== GALLERY HOOKS ====================

export function useGalleryImages() {
  const queryClient = useQueryClient();
  const subscriptionRef = useRef<any>(null);

  const query = useQuery({
    queryKey: ["gallery"],
    queryFn: () => galleryService.getAll(),
    staleTime: 0,
  });

  useEffect(() => {
    if (subscriptionRef.current) return;

    console.log("📡 Setting up gallery real-time subscription...");
    subscriptionRef.current = supabase
      .channel("gallery-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "gallery",
        },
        (payload: any) => {
          console.log("🔄 Gallery updated from database:", payload);
          queryClient.invalidateQueries({ queryKey: ["gallery"] });
        }
      )
      .subscribe((status: string) => {
        console.log("📡 Gallery subscription status:", status);
      });

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [queryClient]);

  return query;
}

export function useCreateGalleryImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<GalleryImage, "id" | "created_at" | "updated_at">) =>
      galleryService.create(data),
    onSuccess: () => {
      console.log("✅ Gallery image created successfully");
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
    onError: (error) => {
      console.error("❌ Failed to create gallery image:", error);
    },
  });
}

export function useUpdateGalleryImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<GalleryImage> }) =>
      galleryService.update(id, data),
    onSuccess: () => {
      console.log("✅ Gallery image updated successfully");
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
    onError: (error) => {
      console.error("❌ Failed to update gallery image:", error);
    },
  });
}

export function useDeleteGalleryImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => galleryService.delete(id),
    onSuccess: () => {
      console.log("✅ Gallery image deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
    onError: (error) => {
      console.error("❌ Failed to delete gallery image:", error);
    },
  });
}

// ==================== TEAM MEMBERS HOOKS ====================

export function useTeamMembers() {
  const queryClient = useQueryClient();
  const subscriptionRef = useRef<any>(null);

  const query = useQuery({
    queryKey: ["team_members"],
    queryFn: () => teamService.getAll(),
    staleTime: 0,
  });

  useEffect(() => {
    if (subscriptionRef.current) return;

    console.log("📡 Setting up team members real-time subscription...");
    subscriptionRef.current = supabase
      .channel("team-members-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "team_members",
        },
        (payload: any) => {
          console.log("🔄 Team members updated from database:", payload);
          queryClient.invalidateQueries({ queryKey: ["team_members"] });
        }
      )
      .subscribe((status: string) => {
        console.log("📡 Team members subscription status:", status);
      });

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [queryClient]);

  return query;
}

export function useCreateTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<TeamMember, "id" | "created_at" | "updated_at">) =>
      teamService.create(data),
    onSuccess: () => {
      console.log("✅ Team member created successfully");
      queryClient.invalidateQueries({ queryKey: ["team_members"] });
    },
    onError: (error) => {
      console.error("❌ Failed to create team member:", error);
    },
  });
}

export function useUpdateTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TeamMember> }) =>
      teamService.update(id, data),
    onSuccess: () => {
      console.log("✅ Team member updated successfully");
      queryClient.invalidateQueries({ queryKey: ["team_members"] });
    },
    onError: (error) => {
      console.error("❌ Failed to update team member:", error);
    },
  });
}

export function useDeleteTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => teamService.delete(id),
    onSuccess: () => {
      console.log("✅ Team member deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["team_members"] });
    },
    onError: (error) => {
      console.error("❌ Failed to delete team member:", error);
    },
  });
}

// ==================== SPONSORS HOOKS ====================

export function useSponsors() {
  const queryClient = useQueryClient();
  const subscriptionRef = useRef<any>(null);

  const query = useQuery({
    queryKey: ["sponsors"],
    queryFn: () => sponsorService.getAll(),
    staleTime: 0,
  });

  useEffect(() => {
    if (subscriptionRef.current) return;

    console.log("📡 Setting up sponsors real-time subscription...");
    subscriptionRef.current = supabase
      .channel("sponsors-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sponsors",
        },
        (payload: any) => {
          console.log("🔄 Sponsors updated from database:", payload);
          queryClient.invalidateQueries({ queryKey: ["sponsors"] });
        }
      )
      .subscribe((status: string) => {
        console.log("📡 Sponsors subscription status:", status);
      });

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [queryClient]);

  return query;
}

export function useCreateSponsor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Sponsor, "id" | "created_at" | "updated_at">) =>
      sponsorService.create(data),
    onSuccess: () => {
      console.log("✅ Sponsor created successfully");
      queryClient.invalidateQueries({ queryKey: ["sponsors"] });
    },
    onError: (error) => {
      console.error("❌ Failed to create sponsor:", error);
    },
  });
}

export function useUpdateSponsor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Sponsor> }) =>
      sponsorService.update(id, data),
    onSuccess: () => {
      console.log("✅ Sponsor updated successfully");
      queryClient.invalidateQueries({ queryKey: ["sponsors"] });
    },
    onError: (error) => {
      console.error("❌ Failed to update sponsor:", error);
    },
  });
}

export function useDeleteSponsor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sponsorService.delete(id),
    onSuccess: () => {
      console.log("✅ Sponsor deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["sponsors"] });
    },
    onError: (error) => {
      console.error("❌ Failed to delete sponsor:", error);
    },
  });
}

// ==================== SITE SETTINGS HOOKS ====================

export function useSiteSetting(key: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["site_settings", key],
    queryFn: () => siteSettingsService.get(key),
    staleTime: 0,
  });

  useEffect(() => {
    const subscription = supabase
      .channel(`site-settings-${key}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "site_settings",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["site_settings", key] });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, key]);

  return query;
}

export function useUpdateSiteSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      siteSettingsService.set(key, value),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["site_settings", variables.key] });
    },
  });
}

export function useDeleteSiteSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (key: string) => siteSettingsService.remove(key),
    onSuccess: (_, key) => {
      queryClient.invalidateQueries({ queryKey: ["site_settings", key] });
    },
  });
}

// ==================== REGISTRATION FORM FIELDS HOOKS ====================

export function useRegistrationFormFields() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["registration_form_fields"],
    queryFn: () => registrationFormFieldService.getAll(),
    staleTime: 0,
  });

  useEffect(() => {
    const subscription = supabase
      .channel("registration-form-fields-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "registration_form_fields",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["registration_form_fields"] });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  return query;
}

export function useAllRegistrationFormFields() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["registration_form_fields_all"],
    queryFn: () => registrationFormFieldService.getAllIncludingInactive(),
    staleTime: 0,
  });

  useEffect(() => {
    const subscription = supabase
      .channel("registration-form-fields-all-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "registration_form_fields",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["registration_form_fields_all"] });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  return query;
}

export function useCreateRegistrationFormField() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<RegistrationFormField, "id" | "created_at" | "updated_at">) =>
      registrationFormFieldService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registration_form_fields"] });
      queryClient.invalidateQueries({ queryKey: ["registration_form_fields_all"] });
    },
  });
}

export function useUpdateRegistrationFormField() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RegistrationFormField> }) =>
      registrationFormFieldService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registration_form_fields"] });
      queryClient.invalidateQueries({ queryKey: ["registration_form_fields_all"] });
    },
  });
}

export function useDeleteRegistrationFormField() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => registrationFormFieldService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registration_form_fields"] });
      queryClient.invalidateQueries({ queryKey: ["registration_form_fields_all"] });
    },
  });
}

// ==================== PAYMENT SETTINGS HOOKS ====================

export function usePaymentSettings() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["payment_settings"],
    queryFn: () => paymentSettingsService.get(),
    staleTime: 0,
  });

  useEffect(() => {
    const subscription = supabase
      .channel("payment-settings-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "payment_settings",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["payment_settings"] });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  return query;
}

export function useUpdatePaymentSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<PaymentSettings>) => paymentSettingsService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment_settings"] });
    },
  });
}

export function useUploadPaymentQRCode() {
  return useMutation({
    mutationFn: (file: File) => paymentSettingsService.uploadQRCode(file),
  });
}

// ==================== REGISTRATIONS HOOKS ====================

export function useRegistrations() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["registrations"],
    queryFn: () => registrationService.getAll(),
    staleTime: 0,
  });

  useEffect(() => {
    const subscription = supabase
      .channel("registrations-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "registrations",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["registrations"] });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  return query;
}

export function useRegistration(id: string) {
  return useQuery({
    queryKey: ["registrations", id],
    queryFn: () => registrationService.getById(id),
    enabled: !!id,
  });
}

export function useCreateRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Registration, "id" | "created_at" | "updated_at">) =>
      registrationService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
    },
  });
}

export function useUpdateRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Registration> }) =>
      registrationService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
    },
  });
}

export function useDeleteRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => registrationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
    },
  });
}

export function useUploadPaymentScreenshot() {
  return useMutation({
    mutationFn: ({ file, registrationId }: { file: File; registrationId: string }) =>
      registrationService.uploadPaymentScreenshot(file, registrationId),
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, verifiedBy }: { id: string; verifiedBy: string }) =>
      registrationService.verifyPayment(id, verifiedBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
    },
  });
}

export function useRejectPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      registrationService.rejectPayment(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
    },
  });
}

export function useSearchRegistrationByCode(code: string) {
  return useQuery({
    queryKey: ["registrations", "search", code],
    queryFn: () => registrationService.searchByCode(code),
    enabled: code.length >= 3,
  });
}

export function useGetRegistrationByCode() {
  return useMutation({
    mutationFn: (code: string) => registrationService.getByRegistrationCode(code),
  });
}

export function useSubmitPaymentWithCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, paymentData }: { 
      id: string; 
      paymentData: {
        payment_screenshot_url: string;
        user_upi_id: string;
        payment_amount: number;
        transaction_id?: string;
      }
    }) => registrationService.submitPaymentWithCode(id, paymentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
    },
  });
}
