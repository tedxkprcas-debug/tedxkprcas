import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  participantService,
  speakerService,
  certificateService,
  contactService,
  aboutService,
  eventService,
} from "@/lib/api";
import type {
  Participant,
  Speaker,
  Certificate,
  ContactInfo,
  AboutInfo,
  Event,
} from "@/lib/supabase";

// ==================== PARTICIPANTS HOOKS ====================

export function useParticipants() {
  return useQuery({
    queryKey: ["participants"],
    queryFn: () => participantService.getAll(),
  });
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
  return useQuery({
    queryKey: ["speakers"],
    queryFn: () => speakerService.getAll(),
  });
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
      queryClient.invalidateQueries({ queryKey: ["speakers"] });
    },
  });
}

export function useUpdateSpeaker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Speaker> }) =>
      speakerService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["speakers"] });
    },
  });
}

export function useDeleteSpeaker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => speakerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["speakers"] });
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
  return useQuery({
    queryKey: ["contact"],
    queryFn: () => contactService.get(),
  });
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
  return useQuery({
    queryKey: ["about"],
    queryFn: () => aboutService.get(),
  });
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
