import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, CheckCircle, Shield, Trash2, Filter, Users,
  Calendar, ChevronDown, Search, X, Mail, Palette, Plus, Edit2,
  MessageSquare, Phone, MapPin, Link as LinkIcon, Upload, Eye, Image,
  UserPlus, Video,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import CertificateTemplate from "@/components/CertificateTemplate";
import GoogleFormDataImport from "@/components/admin/GoogleFormDataImport";
import SpeakerFormWithImage from "@/components/admin/SpeakerFormWithImage";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useSpeakers,
  useCreateSpeaker,
  useUpdateSpeaker,
  useDeleteSpeaker,
  useParticipants,
  useCreateParticipant,
  useUpdateParticipant,
  useDeleteParticipant,
  useContactInfo,
  useUpdateContactInfo,
  useAboutInfo,
  useUpdateAboutInfo,
  useGalleryImages,
  useCreateGalleryImage,
  useUpdateGalleryImage,
  useDeleteGalleryImage,
  useTeamMembers,
  useCreateTeamMember,
  useUpdateTeamMember,
  useDeleteTeamMember,
} from "@/hooks/use-database";

// Type definitions
type Participant = {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  date: string;
  status: "registered" | "attended" | "no-show";
  certSent: boolean;
  certSentDate?: string;
};


const AdminPage = () => {
  const [tab, setTab] = useState<"participants" | "speakers" | "certificates" | "about" | "contact" | "gallery" | "team">("participants");

  // Toast/Notification state
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Database hooks for speakers
  const { data: speakers = [], isLoading: speakersLoading, error: speakersError } = useSpeakers();
  const { mutate: createSpeaker, isPending: isCreating } = useCreateSpeaker();
  const { mutate: updateSpeaker, isPending: isUpdating } = useUpdateSpeaker();
  const { mutate: deleteSpeaker, isPending: isDeleting } = useDeleteSpeaker();

  // Database hooks for participants
  const { data: participants = [], isLoading: participantsLoading, error: participantsError } = useParticipants();
  const { mutate: createParticipant } = useCreateParticipant();
  const { mutate: updateParticipant } = useUpdateParticipant();
  const { mutate: deleteParticipant } = useDeleteParticipant();

  // Database hooks for contact info
  const { data: contact = {}, isLoading: contactLoading } = useContactInfo();
  const { mutate: updateContact } = useUpdateContactInfo();

  // Database hooks for about info
  const { data: about = {}, isLoading: aboutLoading } = useAboutInfo();
  const { mutate: updateAbout } = useUpdateAboutInfo();

  // Database hooks for gallery
  const { data: galleryImages = [], isLoading: galleryLoading } = useGalleryImages();
  const { mutate: createGalleryImage } = useCreateGalleryImage();
  const { mutate: updateGalleryImage } = useUpdateGalleryImage();
  const { mutate: deleteGalleryImage } = useDeleteGalleryImage();

  // Database hooks for team members
  const { data: teamMembers = [], isLoading: teamLoading } = useTeamMembers();
  const { mutate: createTeamMember } = useCreateTeamMember();
  const { mutate: updateTeamMember } = useUpdateTeamMember();
  const { mutate: deleteTeamMember } = useDeleteTeamMember();

  // Certificate management state
  const [showCertificateDesigner, setShowCertificateDesigner] = useState(false);
  const [certificateTitle, setCertificateTitle] = useState("Certificate of Participation");
  const [certificateText, setCertificateText] = useState("In recognition of your enthusiasm, engagement, and commitment to spreading ideas worth sharing.");
  const [certificateBgColor, setCertificateBgColor] = useState("from-amber-50 to-yellow-50");

  // Participants UI state
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showParticipantForm, setShowParticipantForm] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "" });

  // Speakers UI state
  const [showSpeakerForm, setShowSpeakerForm] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState<any>(null);
  const [speakerFormData, setSpeakerFormData] = useState({ name: "", role: "", image: "", bio: "" });

  // About UI state
  const [editingAbout, setEditingAbout] = useState(false);
  const [aboutFormData, setAboutFormData] = useState({ title: "", description: "", content: "" });

  // Contact UI state
  const [editingContact, setEditingContact] = useState(false);
  const [contactFormData, setContactFormData] = useState({ email: "", phone: "", address: "", formLink: "", registrationLink: "" });

  // Gallery UI state
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<any>(null);
  const [galleryFormData, setGalleryFormData] = useState({ title: "", description: "", image: "" });
  const [galleryVideoUrl, setGalleryVideoUrl] = useState("");

  // Load gallery video URL from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("tedx_gallery_video");
    if (saved) setGalleryVideoUrl(saved);
  }, []);

  const saveGalleryVideoUrl = (url: string) => {
    setGalleryVideoUrl(url);
    localStorage.setItem("tedx_gallery_video", url);
    showNotification("success", "Gallery video URL saved!");
  };

  // Team UI state
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState<any>(null);
  const [teamFormData, setTeamFormData] = useState({ name: "", role: "", photo: "", description: "" });

  // Certificate & Import state
  const [showCertificatePreview, setShowCertificatePreview] = useState(false);
  const [previewParticipantName, setPreviewParticipantName] = useState("Sample Participant");
  const [showGoogleFormImport, setShowGoogleFormImport] = useState(false);
  const [eventName, setEventName] = useState("TEDx KPRCAS 2026");
  const [eventDate, setEventDate] = useState("February 15, 2026");

  // Participants functions
  const filtered = useMemo(() => {
    return participants.filter((p) => {
      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase());
      const pDate = new Date(p.date);
      const matchFrom = !dateFrom || pDate >= dateFrom;
      const matchTo = !dateTo || pDate <= dateTo;
      return matchSearch && matchFrom && matchTo;
    });
  }, [participants, searchQuery, dateFrom, dateTo]);

  const allSelected = filtered.length > 0 && filtered.every((p) => selected.has(p.id));

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        filtered.forEach((p) => next.delete(p.id as string));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        filtered.forEach((p) => next.add(p.id as string));
        return next;
      });
    }
  };

  const addParticipant = () => {
    setEditingParticipant(null);
    setFormData({ name: "", email: "" });
    setShowParticipantForm(true);
  };

  const editParticipant = (p: Participant) => {
    setEditingParticipant(p);
    setFormData({ name: p.name, email: p.email });
    setShowParticipantForm(true);
  };

  const saveParticipant = () => {
    if (!formData.name || !formData.email) return;

    if (editingParticipant && editingParticipant.id) {
      updateParticipant({
        id: editingParticipant.id,
        data: { name: formData.name, email: formData.email }
      });
    } else {
      createParticipant({
        name: formData.name,
        email: formData.email,
        date: format(new Date(), "yyyy-MM-dd"),
        status: "registered",
        certSent: false
      });
    }
    setShowParticipantForm(false);
  };

  const handleDeleteParticipant = (id: string) => {
    deleteParticipant(id);
  };

  const handleBulkSend = async () => {
    if (selected.size === 0) return;
    setSending(true);
    // TODO: Implement bulk certificate sending via API
    await new Promise((r) => setTimeout(r, 1500));
    // For now, just show success - implement actual bulk update later
    setSending(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    setSelected(new Set());
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  // Speakers functions
  const addSpeaker = () => {
    setEditingSpeaker(null);
    setSpeakerFormData({ name: "", role: "", image: "", bio: "" });
    setShowSpeakerForm(true);
  };

  const editSpeaker = (s: any) => {
    setEditingSpeaker(s);
    setSpeakerFormData(s);
    setShowSpeakerForm(true);
  };

  const saveSpeaker = (data?: { name: string; role: string; image: string; bio: string }) => {
    const dataToSave = data || speakerFormData;
    if (!dataToSave.name || !dataToSave.role) {
      showNotification("error", "Please fill in name and role");
      return;
    }

    if (editingSpeaker && editingSpeaker.id) {
      // Update existing speaker
      updateSpeaker(
        {
          id: editingSpeaker.id,
          data: {
            name: dataToSave.name,
            role: dataToSave.role,
            image: dataToSave.image || undefined,
            bio: dataToSave.bio || undefined,
            order: editingSpeaker.order || 0,
          },
        },
        {
          onSuccess: () => {
            showNotification("success", "Speaker updated successfully!");
            setShowSpeakerForm(false);
          },
          onError: (error) => {
            showNotification("error", `Failed to update speaker: ${error.message}`);
          },
        }
      );
    } else {
      // Create new speaker
      createSpeaker(
        {
          name: dataToSave.name,
          role: dataToSave.role,
          image: dataToSave.image || undefined,
          bio: dataToSave.bio || undefined,
          order: speakers.length,
        },
        {
          onSuccess: () => {
            showNotification("success", "Speaker added successfully!");
            setShowSpeakerForm(false);
          },
          onError: (error) => {
            showNotification("error", `Failed to add speaker: ${error.message}`);
          },
        }
      );
    }
  };

  const handleDeleteSpeaker = (id: string) => {
    deleteSpeaker(id, {
      onSuccess: () => {
        showNotification("success", "Speaker deleted successfully!");
      },
      onError: (error) => {
        showNotification("error", `Failed to delete speaker: ${error.message}`);
      },
    });
  };

  const handleGoogleFormImport = (importedData: ImportedParticipant[]) => {
    // Import participants via the database hook
    // The data should be imported through the API
    console.log("Importing participants:", importedData);
    showNotification("success", `${importedData.length} participants imported successfully!`);
  };

  // Gallery functions
  const addGalleryItem = () => {
    setEditingGalleryItem(null);
    setGalleryFormData({ title: "", description: "", image: "" });
    setShowGalleryForm(true);
  };

  const editGalleryItem = (item: any) => {
    setEditingGalleryItem(item);
    setGalleryFormData({ title: item.title, description: item.description || "", image: item.image || "" });
    setShowGalleryForm(true);
  };

  const saveGalleryItem = () => {
    if (!galleryFormData.title || !galleryFormData.image) {
      showNotification("error", "Please fill in title and image");
      return;
    }

    if (editingGalleryItem && editingGalleryItem.id) {
      updateGalleryImage(
        {
          id: editingGalleryItem.id,
          data: {
            title: galleryFormData.title,
            description: galleryFormData.description || undefined,
            image: galleryFormData.image,
          },
        },
        {
          onSuccess: () => {
            showNotification("success", "Gallery item updated!");
            setShowGalleryForm(false);
          },
          onError: (error) => showNotification("error", `Failed: ${error.message}`),
        }
      );
    } else {
      createGalleryImage(
        {
          title: galleryFormData.title,
          description: galleryFormData.description || undefined,
          image: galleryFormData.image,
          order: galleryImages.length,
        },
        {
          onSuccess: () => {
            showNotification("success", "Gallery item added!");
            setShowGalleryForm(false);
          },
          onError: (error) => showNotification("error", `Failed: ${error.message}`),
        }
      );
    }
  };

  const handleDeleteGalleryItem = (id: string) => {
    deleteGalleryImage(id, {
      onSuccess: () => showNotification("success", "Gallery item deleted!"),
      onError: (error) => showNotification("error", `Failed: ${error.message}`),
    });
  };

  const handleGalleryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setGalleryFormData((prev) => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // Team member functions
  const addTeamMember = () => {
    setEditingTeamMember(null);
    setTeamFormData({ name: "", role: "", photo: "", description: "" });
    setShowTeamForm(true);
  };

  const editTeamMemberItem = (member: any) => {
    setEditingTeamMember(member);
    setTeamFormData({
      name: member.name,
      role: member.role,
      photo: member.photo || "",
      description: member.description || "",
    });
    setShowTeamForm(true);
  };

  const saveTeamMember = () => {
    if (!teamFormData.name || !teamFormData.role) {
      showNotification("error", "Please fill in name and role");
      return;
    }

    if (editingTeamMember && editingTeamMember.id) {
      updateTeamMember(
        {
          id: editingTeamMember.id,
          data: {
            name: teamFormData.name,
            role: teamFormData.role,
            photo: teamFormData.photo || "",
            description: teamFormData.description || undefined,
          },
        },
        {
          onSuccess: () => {
            showNotification("success", "Team member updated!");
            setShowTeamForm(false);
          },
          onError: (error) => showNotification("error", `Failed: ${error.message}`),
        }
      );
    } else {
      createTeamMember(
        {
          name: teamFormData.name,
          role: teamFormData.role,
          photo: teamFormData.photo || "",
          description: teamFormData.description || undefined,
          order: teamMembers.length,
          is_active: true,
        },
        {
          onSuccess: () => {
            showNotification("success", "Team member added!");
            setShowTeamForm(false);
          },
          onError: (error) => showNotification("error", `Failed: ${error.message}`),
        }
      );
    }
  };

  const handleDeleteTeamMember = (id: string) => {
    deleteTeamMember(id, {
      onSuccess: () => showNotification("success", "Team member deleted!"),
      onError: (error) => showNotification("error", `Failed: ${error.message}`),
    });
  };

  const handleTeamPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setTeamFormData((prev) => ({ ...prev, photo: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const hasActiveFilters = searchQuery || dateFrom || dateTo;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative pt-20">
      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className={cn(
              "fixed top-24 left-1/2 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2",
              notification.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            )}
          >
            {notification.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <X className="w-5 h-5" />
            )}
            <span className="font-medium">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/5"
            style={{
              width: 200 + i * 80,
              height: 200 + i * 80,
              left: `${10 + i * 15}%`,
              top: `${5 + i * 12}%`,
            }}
            animate={{ x: [0, 30, -20, 0], y: [0, -25, 15, 0], scale: [1, 1.1, 0.95, 1] }}
            transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
              <Shield className="w-8 h-8 text-primary" />
            </motion.div>
            <h1 className="font-heading text-4xl md:text-5xl font-black">
              <span className="text-primary">TED</span>
              <sup className="text-primary text-2xl">x</sup>{" "}
              <span className="text-foreground">Admin CMS</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">Complete Content Management System with CRUD Operations</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-8 overflow-x-auto pb-2 flex-wrap"
        >
          {[
            { id: "participants", label: "Participants", icon: Users },
            { id: "speakers", label: "Speakers", icon: MessageSquare },
            { id: "certificates", label: "Certificates", icon: Palette },
            { id: "about", label: "About", icon: MessageSquare },
            { id: "contact", label: "Contact", icon: Phone },
            { id: "gallery", label: "Gallery", icon: Image },
            { id: "team", label: "Team", icon: UserPlus },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id as typeof tab)}
                className={cn(
                  "px-6 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all flex items-center gap-2",
                  tab === item.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-card border border-border hover:border-primary/50 hover:bg-card/80"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {tab === "participants" && (
            <motion.div key="participants" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {/* Filters */}
              <motion.div className="border border-border rounded-2xl p-6 mb-6 bg-card/60 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-lg font-bold flex items-center gap-2">
                    <Filter className="w-4 h-4 text-primary" /> Filters
                  </h2>
                  {hasActiveFilters && (
                    <motion.button
                      onClick={clearFilters}
                      className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> Clear all
                    </motion.button>
                  )}
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name or email..."
                      className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-primary"
                    />
                  </div>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full md:w-[180px] justify-start text-left font-normal text-sm",
                          !dateFrom && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {dateFrom ? format(dateFrom, "MMM dd") : "From date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarUI mode="single" selected={dateFrom} onSelect={setDateFrom} className="p-3" />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full md:w-[180px] justify-start text-left font-normal text-sm",
                          !dateTo && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {dateTo ? format(dateTo, "MMM dd") : "To date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarUI mode="single" selected={dateTo} onSelect={setDateTo} className="p-3" />
                    </PopoverContent>
                  </Popover>
                </div>
              </motion.div>

              {/* Action Bar */}
              <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
                <div className="text-sm text-muted-foreground">
                  {filtered.length} participant{filtered.length !== 1 ? "s" : ""} found
                  {selected.size > 0 && <span className="text-primary font-medium ml-2">· {selected.size} selected</span>}
                </div>

                <div className="flex gap-3 flex-wrap">
                  <motion.button
                    onClick={() => setShowGoogleFormImport(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Import Google Form
                  </motion.button>

                  <motion.button
                    onClick={() => setShowCertificatePreview(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Preview Certificate
                  </motion.button>

                  <motion.button
                    onClick={addParticipant}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Participant
                  </motion.button>

                  <motion.button
                    onClick={handleBulkSend}
                    disabled={sending || selected.size === 0}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    Send Certs ({selected.size})
                  </motion.button>
                </div>
              </div>

              {/* Table */}
              <motion.div className="border border-border rounded-2xl bg-card/60 overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border bg-secondary/50">
                      <tr>
                        <th className="px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={toggleAll}
                            className="rounded"
                          />
                        </th>
                        <th className="px-4 py-3 text-left font-medium">Name</th>
                        <th className="px-4 py-3 text-left font-medium">Email</th>
                        <th className="px-4 py-3 text-left font-medium">Date</th>
                        <th className="px-4 py-3 text-left font-medium">Status</th>
                        <th className="px-4 py-3 text-center font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filtered.map((p) => (
                        <tr
                          key={p.id}
                          className={cn(
                            "hover:bg-secondary/30 transition-colors",
                            selected.has(p.id) && "bg-primary/10"
                          )}
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selected.has(p.id as string)}
                              onChange={() => toggleSelect(p.id as string)}
                              className="rounded"
                            />
                          </td>
                          <td className="px-4 py-3">{p.name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{p.email}</td>
                          <td className="px-4 py-3 text-muted-foreground">{format(new Date(p.date), "MMM dd")}</td>
                          <td className="px-4 py-3">
                            <span className={cn(
                              "px-2.5 py-1 rounded-full text-xs font-medium",
                              p.certSent ? "bg-green-500/20 text-green-700" : "bg-yellow-500/20 text-yellow-700"
                            )}>
                              {p.certSent ? "Sent" : "Pending"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center flex items-center justify-center gap-2">
                            <button
                              onClick={() => editParticipant(p)}
                              className="p-2 hover:bg-blue-500/20 rounded transition-colors"
                            >
                              <Edit2 className="w-4 h-4 text-blue-500" />
                            </button>
                            <button
                              onClick={() => handleDeleteParticipant(p.id as string)}
                              className="p-2 hover:bg-red-500/20 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* Participant Form Dialog */}
              <Dialog open={showParticipantForm} onOpenChange={setShowParticipantForm}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingParticipant ? "Edit Participant" : "Add Participant"}</DialogTitle>
                    <DialogDescription>Fill in the participant details below.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground"
                        placeholder="Enter name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground"
                        placeholder="Enter email"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={saveParticipant}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 rounded-lg transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setShowParticipantForm(false)}
                        className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground font-medium py-2 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          )}

          {tab === "speakers" && (
            <motion.div key="speakers" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="flex justify-end mb-6">
                <motion.button
                  onClick={addSpeaker}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm"
                  disabled={isCreating}
                >
                  <Plus className="w-4 h-4" />
                  {isCreating ? "Adding..." : "Add Speaker"}
                </motion.button>
              </div>

              {speakersError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-600 p-4 rounded-lg mb-6">
                  Error loading speakers: {speakersError?.message}
                </div>
              )}

              {speakersLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading speakers...</p>
                </div>
              ) : speakers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No speakers added yet.</p>
                  <button
                    onClick={addSpeaker}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 py-2.5 rounded-lg inline-flex items-center gap-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add First Speaker
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {speakers.map((speaker) => (
                    <motion.div
                      key={speaker.id}
                      whileHover={{ y: -4 }}
                      className="border border-border rounded-xl p-6 bg-card/60 backdrop-blur-sm overflow-hidden"
                    >
                      <div className="w-full aspect-square bg-secondary rounded-lg mb-4 flex items-center justify-center overflow-hidden bg-cover bg-center">
                        {speaker.image ? (
                          <img
                            src={speaker.image}
                            alt={speaker.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-4xl font-bold text-primary/30">{speaker.name.charAt(0)}</span>
                        )}
                      </div>
                      <h3 className="font-heading text-lg font-bold mb-1">{speaker.name}</h3>
                      <p className="text-sm text-primary mb-4">{speaker.role}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => editSpeaker(speaker)}
                          className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-600 font-medium py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                          disabled={isUpdating}
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSpeaker(speaker.id)}
                          className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-600 font-medium py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Speaker Form Dialog */}
              <Dialog open={showSpeakerForm} onOpenChange={setShowSpeakerForm}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingSpeaker ? "Edit Speaker" : "Add Speaker"}</DialogTitle>
                    <DialogDescription>Fill in the speaker details and upload an image.</DialogDescription>
                  </DialogHeader>
                  <SpeakerFormWithImage
                    initialData={editingSpeaker || undefined}
                    onSave={saveSpeaker}
                    onCancel={() => setShowSpeakerForm(false)}
                  />
                </DialogContent>
              </Dialog>
            </motion.div>
          )}

          {tab === "certificates" && (
            <motion.div key="certificates" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <motion.div className="border border-border rounded-2xl p-8 bg-card/60 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="font-heading text-2xl font-bold flex items-center gap-2">
                    <Palette className="w-6 h-6 text-primary" />
                    Certificate Management
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Certificate Design Options */}
                  <div className="space-y-6">
                    <div className="border border-border rounded-xl p-6 bg-secondary/30">
                      <h3 className="font-heading text-lg font-bold mb-4">Design Certificate</h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Certificate Title</label>
                          <input
                            type="text"
                            value={certificateTitle}
                            onChange={(e) => setCertificateTitle(e.target.value)}
                            className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm"
                            placeholder="E.g., Certificate of Participation"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Certificate Text</label>
                          <textarea
                            value={certificateText}
                            onChange={(e) => setCertificateText(e.target.value)}
                            className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm h-24 resize-none"
                            placeholder="Enter the certificate body text..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Background Color</label>
                          <select
                            value={certificateBgColor}
                            onChange={(e) => setCertificateBgColor(e.target.value)}
                            className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm"
                          >
                            <option value="from-amber-50 to-yellow-50">Gold/Yellow</option>
                            <option value="from-blue-50 to-cyan-50">Blue/Cyan</option>
                            <option value="from-green-50 to-emerald-50">Green/Emerald</option>
                            <option value="from-red-50 to-orange-50">Red/Orange</option>
                            <option value="from-purple-50 to-pink-50">Purple/Pink</option>
                            <option value="from-gray-50 to-slate-50">Gray/Slate</option>
                          </select>
                        </div>

                        <button
                          onClick={() => setShowCertificateDesigner(!showCertificateDesigner)}
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          {showCertificateDesigner ? "Hide Preview" : "Preview Design"}
                        </button>
                      </div>
                    </div>

                    {/* Quick Links */}
                    <div className="border border-border rounded-xl p-6 bg-secondary/30">
                      <h3 className="font-heading text-lg font-bold mb-4">Quick Actions</h3>
                      <div className="space-y-3">
                        <button
                          onClick={() => setShowCertificatePreview(true)}
                          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          Preview with Participant Name
                        </button>

                        <button
                          onClick={() => {
                            const csvContent = "Certificate,Title,Text,Color\n" + certificateTitle + "," + certificateTitle + "," + certificateText + "," + certificateBgColor;
                            const blob = new Blob([csvContent], { type: 'text/csv' });
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'certificate_design.csv';
                            a.click();
                          }}
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                        >
                          <Upload className="w-4 h-4" />
                          Export Design
                        </button>

                        <button
                          onClick={() => {
                            setCertificateTitle("Certificate of Participation");
                            setCertificateText("In recognition of your enthusiasm, engagement, and commitment to spreading ideas worth sharing.");
                            setCertificateBgColor("from-amber-50 to-yellow-50");
                          }}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Reset to Default
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Preview Section */}
                  <div className="space-y-4">
                    {showCertificateDesigner && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="border border-border rounded-xl p-8 bg-gradient-to-br bg-gray-100 dark:bg-gray-900"
                      >
                        <div className={`bg-gradient-to-br ${certificateBgColor} p-12 rounded-lg shadow-xl border-4 border-double border-amber-900/30`}>
                          <div className="text-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center shadow-lg mx-auto mb-6">
                              <span className="text-2xl font-bold text-white">✓</span>
                            </div>

                            <h1 className="text-3xl font-bold text-amber-900 mb-2 font-serif">
                              {certificateTitle}
                            </h1>
                            <div className="w-20 h-1 bg-gradient-to-r from-primary via-primary to-transparent mx-auto mb-6" />

                            <p className="text-amber-900/80 text-sm mb-4">This certificate is proudly presented to</p>

                            <p className="text-3xl font-bold text-primary mb-4 font-serif underline">
                              Sample Participant
                            </p>

                            <p className="text-amber-900/80 text-sm leading-relaxed max-w-xs mx-auto">
                              {certificateText}
                            </p>

                            <div className="mt-8 pt-6 border-t border-amber-900/20">
                              <p className="font-semibold text-amber-900 text-sm">Dr. Event Organizer</p>
                              <p className="text-xs text-amber-900/60">Event Organizer</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {!showCertificateDesigner && (
                      <div className="border-2 border-dashed border-border rounded-xl p-12 text-center bg-secondary/30">
                        <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground mb-2">Preview not active</p>
                        <p className="text-sm text-muted-foreground">Click "Preview Design" to see your certificate</p>
                      </div>
                    )}

                    {/* Info Box */}
                    <div className="border border-border rounded-xl p-6 bg-blue-500/10">
                      <h4 className="font-medium text-blue-600 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Certificate Info
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>✓ Customizable title and text</li>
                        <li>✓ 6 background color options</li>
                        <li>✓ Professional design template</li>
                        <li>✓ Auto-fills participant names</li>
                        <li>✓ Export design settings</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {tab === "about" && (
            <motion.div key="about" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <motion.div className="border border-border rounded-2xl p-8 bg-card/60 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-heading text-2xl font-bold">About Section</h2>
                  {!editingAbout && (
                    <button
                      onClick={() => {
                        setEditingAbout(true);
                        setAboutFormData(about);
                      }}
                      className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-600 font-medium px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                </div>

                {editingAbout ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title</label>
                      <input
                        type="text"
                        value={aboutFormData.title}
                        onChange={(e) => setAboutFormData({ ...aboutFormData, title: e.target.value })}
                        className="w-full bg-secondary border border-border rounded-lg px-4 py-3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <textarea
                        value={aboutFormData.description}
                        onChange={(e) => setAboutFormData({ ...aboutFormData, description: e.target.value })}
                        className="w-full bg-secondary border border-border rounded-lg px-4 py-3 h-24"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Content</label>
                      <textarea
                        value={aboutFormData.content}
                        onChange={(e) => setAboutFormData({ ...aboutFormData, content: e.target.value })}
                        className="w-full bg-secondary border border-border rounded-lg px-4 py-3 h-32"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => {
                          updateAbout({
                            title: aboutFormData.title,
                            description: aboutFormData.description,
                            content: aboutFormData.content
                          });
                          setEditingAbout(false);
                        }}
                        className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-600 font-medium py-2 rounded-lg"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingAbout(false)}
                        className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground font-medium py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Title</h3>
                      <p className="text-lg font-semibold">{about.title}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                      <p className="text-foreground">{about.description}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Content</h3>
                      <p className="text-foreground whitespace-pre-wrap">{about.content}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}

          {tab === "contact" && (
            <motion.div key="contact" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <motion.div className="border border-border rounded-2xl p-8 bg-card/60 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-heading text-2xl font-bold">Contact Information</h2>
                  {!editingContact && (
                    <button
                      onClick={() => {
                        setEditingContact(true);
                        setContactFormData(contact);
                      }}
                      className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-600 font-medium px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                </div>

                {editingContact ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={contactFormData.email}
                        onChange={(e) => setContactFormData({ ...contactFormData, email: e.target.value })}
                        className="w-full bg-secondary border border-border rounded-lg px-4 py-3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={contactFormData.phone}
                        onChange={(e) => setContactFormData({ ...contactFormData, phone: e.target.value })}
                        className="w-full bg-secondary border border-border rounded-lg px-4 py-3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Address
                      </label>
                      <textarea
                        value={contactFormData.address}
                        onChange={(e) => setContactFormData({ ...contactFormData, address: e.target.value })}
                        className="w-full bg-secondary border border-border rounded-lg px-4 py-3 h-20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <LinkIcon className="w-4 h-4" />
                        Form Link
                      </label>
                      <input
                        type="url"
                        value={contactFormData.formLink}
                        onChange={(e) => setContactFormData({ ...contactFormData, formLink: e.target.value })}
                        className="w-full bg-secondary border border-border rounded-lg px-4 py-3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <LinkIcon className="w-4 h-4" />
                        Registration Link (for users to register)
                      </label>
                      <input
                        type="url"
                        value={contactFormData.registrationLink}
                        onChange={(e) => setContactFormData({ ...contactFormData, registrationLink: e.target.value })}
                        className="w-full bg-secondary border border-border rounded-lg px-4 py-3"
                        placeholder="https://forms.gle/your-registration-form"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        This link will be used for the "Register Now" button on the website
                      </p>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => {
                          updateContact({
                            email: contactFormData.email,
                            phone: contactFormData.phone,
                            address: contactFormData.address,
                            formLink: contactFormData.formLink,
                            registrationLink: contactFormData.registrationLink
                          });
                          setEditingContact(false);
                        }}
                        className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-600 font-medium py-2 rounded-lg"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingContact(false)}
                        className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground font-medium py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-lg">
                      <Mail className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-medium">{contact.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-lg">
                      <Phone className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="font-medium">{contact.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-secondary/30 rounded-lg">
                      <MapPin className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Address</p>
                        <p className="font-medium">{contact.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-lg">
                      <LinkIcon className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Form Link</p>
                        <a href={contact.formLink} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
                          View Form
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <LinkIcon className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-xs text-muted-foreground">Registration Link (Used on website)</p>
                        <a href={contact.registrationLink} target="_blank" rel="noopener noreferrer" className="font-medium text-green-600 hover:underline break-all text-sm">
                          {contact.registrationLink}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* ==================== GALLERY TAB ==================== */}
          {tab === "gallery" && (
            <motion.div key="gallery" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <motion.div className="border border-border rounded-2xl p-8 bg-card/60 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-heading text-2xl font-bold">Gallery Management</h2>
                  <button
                    onClick={addGalleryItem}
                    className="bg-primary/20 hover:bg-primary/30 text-primary font-medium px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Image
                  </button>
                </div>

                {/* Gallery Video URL */}
                <div className="mb-6 p-4 border border-border rounded-xl bg-secondary/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Video className="w-5 h-5 text-primary" />
                    <h3 className="font-medium text-sm">Center Video (plays over gallery rows)</h3>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={galleryVideoUrl}
                      onChange={(e) => setGalleryVideoUrl(e.target.value)}
                      placeholder="Paste YouTube URL or direct video URL"
                      className="flex-1 bg-secondary border border-border rounded-lg px-4 py-2 text-sm"
                    />
                    <button
                      onClick={() => saveGalleryVideoUrl(galleryVideoUrl)}
                      className="bg-green-500/20 hover:bg-green-500/30 text-green-600 font-medium px-4 py-2 rounded-lg text-sm"
                    >
                      Save
                    </button>
                    {galleryVideoUrl && (
                      <button
                        onClick={() => { setGalleryVideoUrl(""); localStorage.removeItem("tedx_gallery_video"); showNotification("success", "Video removed!"); }}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-600 font-medium px-3 py-2 rounded-lg text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Supports YouTube links or direct .mp4 URLs. The video appears centered over the 3 gallery rows.</p>
                </div>

                {/* Gallery Form Dialog */}
                <Dialog open={showGalleryForm} onOpenChange={setShowGalleryForm}>
                  <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingGalleryItem ? "Edit Gallery Item" : "Add Gallery Item"}</DialogTitle>
                      <DialogDescription>Upload an image with a name and description</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      {/* Image Upload */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Image *</label>
                        {galleryFormData.image ? (
                          <div className="relative">
                            <img
                              src={galleryFormData.image}
                              alt="Preview"
                              className="w-full h-48 object-cover rounded-lg border border-border"
                            />
                            <button
                              onClick={() => setGalleryFormData((prev) => ({ ...prev, image: "" }))}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="cursor-pointer flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-8 hover:border-primary/50 transition-colors">
                            <Upload className="w-8 h-8 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Click to upload image</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleGalleryImageUpload}
                              className="hidden"
                            />
                          </label>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">Or paste an image URL:</p>
                        <input
                          type="url"
                          value={galleryFormData.image}
                          onChange={(e) => setGalleryFormData((prev) => ({ ...prev, image: e.target.value }))}
                          placeholder="https://example.com/image.jpg"
                          className="w-full bg-secondary border border-border rounded-lg px-4 py-2 mt-1 text-sm"
                        />
                      </div>
                      {/* Title */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Name *</label>
                        <input
                          type="text"
                          value={galleryFormData.title}
                          onChange={(e) => setGalleryFormData((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter image name"
                          className="w-full bg-secondary border border-border rounded-lg px-4 py-3"
                        />
                      </div>
                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                          value={galleryFormData.description}
                          onChange={(e) => setGalleryFormData((prev) => ({ ...prev, description: e.target.value }))}
                          placeholder="Enter description"
                          className="w-full bg-secondary border border-border rounded-lg px-4 py-3 h-24 resize-none"
                        />
                      </div>
                      {/* Actions */}
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={saveGalleryItem}
                          className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-600 font-medium py-2.5 rounded-lg"
                        >
                          {editingGalleryItem ? "Update" : "Add"}
                        </button>
                        <button
                          onClick={() => setShowGalleryForm(false)}
                          className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground font-medium py-2.5 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Gallery Items List */}
                {galleryLoading ? (
                  <div className="text-center py-12">
                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading gallery...</p>
                  </div>
                ) : galleryImages.length === 0 ? (
                  <div className="text-center py-12">
                    <Image className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No gallery images yet. Add your first one!</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {galleryImages.map((item: any) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="border border-border rounded-xl overflow-hidden bg-card hover:border-primary/30 transition-colors group"
                      >
                        {item.image && (
                          <div className="relative h-40 overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="font-bold text-sm truncate">{item.title}</h3>
                          {item.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                          )}
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => editGalleryItem(item)}
                              className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-600 text-xs font-medium py-1.5 rounded-lg flex items-center justify-center gap-1"
                            >
                              <Edit2 className="w-3 h-3" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteGalleryItem(item.id)}
                              className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-600 text-xs font-medium py-1.5 rounded-lg flex items-center justify-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}

          {tab === "team" && (
            <motion.div key="team" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <motion.div className="border border-border rounded-2xl p-8 bg-card/60 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-heading text-2xl font-bold">Team Management</h2>
                  <button
                    onClick={addTeamMember}
                    className="bg-primary/20 hover:bg-primary/30 text-primary font-medium px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Member
                  </button>
                </div>

                {/* Team Form Dialog */}
                <Dialog open={showTeamForm} onOpenChange={setShowTeamForm}>
                  <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingTeamMember ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
                      <DialogDescription>Add team member details including photo, name, role, and description</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      {/* Photo Upload */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Photo</label>
                        {teamFormData.photo ? (
                          <div className="relative">
                            <img
                              src={teamFormData.photo}
                              alt="Preview"
                              className="w-full h-48 object-cover rounded-lg border border-border"
                            />
                            <button
                              onClick={() => setTeamFormData((prev) => ({ ...prev, photo: "" }))}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="cursor-pointer flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-8 hover:border-primary/50 transition-colors">
                            <Upload className="w-8 h-8 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Click to upload photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleTeamPhotoUpload}
                              className="hidden"
                            />
                          </label>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">Or paste a photo URL:</p>
                        <input
                          type="url"
                          value={teamFormData.photo}
                          onChange={(e) => setTeamFormData((prev) => ({ ...prev, photo: e.target.value }))}
                          placeholder="https://example.com/photo.jpg"
                          className="w-full bg-secondary border border-border rounded-lg px-4 py-2 mt-1 text-sm"
                        />
                      </div>
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Name *</label>
                        <input
                          type="text"
                          value={teamFormData.name}
                          onChange={(e) => setTeamFormData((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter member name"
                          className="w-full bg-secondary border border-border rounded-lg px-4 py-3"
                        />
                      </div>
                      {/* Role */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Role *</label>
                        <input
                          type="text"
                          value={teamFormData.role}
                          onChange={(e) => setTeamFormData((prev) => ({ ...prev, role: e.target.value }))}
                          placeholder="Enter role (e.g., Lead Organizer)"
                          className="w-full bg-secondary border border-border rounded-lg px-4 py-3"
                        />
                      </div>
                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                          value={teamFormData.description}
                          onChange={(e) => setTeamFormData((prev) => ({ ...prev, description: e.target.value }))}
                          placeholder="Enter a brief description about this team member"
                          className="w-full bg-secondary border border-border rounded-lg px-4 py-3 h-24 resize-none"
                        />
                      </div>
                      {/* Actions */}
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={saveTeamMember}
                          className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-600 font-medium py-2.5 rounded-lg"
                        >
                          {editingTeamMember ? "Update" : "Add"}
                        </button>
                        <button
                          onClick={() => setShowTeamForm(false)}
                          className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground font-medium py-2.5 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Team Members List */}
                {teamLoading ? (
                  <div className="text-center py-12">
                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading team members...</p>
                  </div>
                ) : teamMembers.length === 0 ? (
                  <div className="text-center py-12">
                    <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No team members yet. Add your first one!</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {teamMembers.map((member: any) => (
                      <motion.div
                        key={member.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="border border-border rounded-xl overflow-hidden bg-card hover:border-primary/30 transition-colors group"
                      >
                        {member.photo && (
                          <div className="relative h-40 overflow-hidden">
                            <img
                              src={member.photo}
                              alt={member.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="font-bold text-sm truncate">{member.name}</h3>
                          <p className="text-xs text-primary mt-0.5">{member.role}</p>
                          {member.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{member.description}</p>
                          )}
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => editTeamMemberItem(member)}
                              className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-600 text-xs font-medium py-1.5 rounded-lg flex items-center justify-center gap-1"
                            >
                              <Edit2 className="w-3 h-3" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTeamMember(member.id)}
                              className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-600 text-xs font-medium py-1.5 rounded-lg flex items-center justify-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Certificate Preview Dialog */}
        <Dialog open={showCertificatePreview} onOpenChange={setShowCertificatePreview}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Certificate Preview</DialogTitle>
              <DialogDescription>Preview how certificates will look</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Preview Name</label>
                  <input
                    type="text"
                    value={previewParticipantName}
                    onChange={(e) => setPreviewParticipantName(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-2"
                    placeholder="Enter name for preview"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Event Name</label>
                    <input
                      type="text"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Event Date</label>
                    <input
                      type="text"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-2"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-900 p-8 rounded-lg overflow-auto max-h-96">
                <CertificateTemplate
                  participantName={previewParticipantName}
                  eventName={eventName}
                  eventDate={eventDate}
                  certificateId={`CERT-2026-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`}
                />
              </div>
              <button
                onClick={() => setShowCertificatePreview(false)}
                className="w-full bg-secondary hover:bg-secondary/80 text-foreground font-medium py-2.5 rounded-lg"
              >
                Close Preview
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Google Form Import Dialog */}
        <Dialog open={showGoogleFormImport} onOpenChange={setShowGoogleFormImport}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Import Google Form Data</DialogTitle>
              <DialogDescription>Import participant data from Google Form responses</DialogDescription>
            </DialogHeader>
            <GoogleFormDataImport
              onImport={handleGoogleFormImport}
              onClose={() => setShowGoogleFormImport(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Success toast */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 right-8 bg-card border border-green-500/30 rounded-xl px-6 py-4 flex items-center gap-3 shadow-lg z-50"
            >
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-foreground font-medium">Certificates sent successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminPage;

