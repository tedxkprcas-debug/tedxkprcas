import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, CheckCircle, Shield, Trash2, Filter, Users,
  Calendar, ChevronDown, Search, X, Mail, Palette
} from "lucide-react";
import CertificateEditor, { CertificateConfig } from "@/components/admin/CertificateEditor";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Mock registration data
const MOCK_PARTICIPANTS = [
  { id: 1, name: "Ahmed Hassan", email: "ahmed@example.com", date: "2026-02-01", status: "registered" },
  { id: 2, name: "Sara Ali", email: "sara@example.com", date: "2026-02-01", status: "registered" },
  { id: 3, name: "Omar Khalid", email: "omar@example.com", date: "2026-02-03", status: "registered" },
  { id: 4, name: "Fatima Noor", email: "fatima@example.com", date: "2026-02-05", status: "registered" },
  { id: 5, name: "Yusuf Khan", email: "yusuf@example.com", date: "2026-02-05", status: "registered" },
  { id: 6, name: "Layla Ibrahim", email: "layla@example.com", date: "2026-02-07", status: "registered" },
  { id: 7, name: "Hassan Tariq", email: "hassan@example.com", date: "2026-02-08", status: "registered" },
  { id: 8, name: "Nadia Saeed", email: "nadia@example.com", date: "2026-02-10", status: "registered" },
  { id: 9, name: "Bilal Farooq", email: "bilal@example.com", date: "2026-02-11", status: "registered" },
  { id: 10, name: "Zara Malik", email: "zara@example.com", date: "2026-02-13", status: "registered" },
];

type Participant = typeof MOCK_PARTICIPANTS[number] & { certSent?: boolean };

const AdminPage = () => {
  const [participants, setParticipants] = useState<Participant[]>(MOCK_PARTICIPANTS);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [certEditorOpen, setCertEditorOpen] = useState(false);
  const [certConfig, setCertConfig] = useState<CertificateConfig | undefined>();

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

  const toggleSelect = (id: number) => {
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
        filtered.forEach((p) => next.delete(p.id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        filtered.forEach((p) => next.add(p.id));
        return next;
      });
    }
  };

  const handleBulkSend = async () => {
    if (selected.size === 0) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setParticipants((prev) =>
      prev.map((p) => (selected.has(p.id) ? { ...p, certSent: true } : p))
    );
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

  const hasActiveFilters = searchQuery || dateFrom || dateTo;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
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

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
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
              <span className="text-foreground">Admin</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">Registration & Certificate Management</p>
          <div className="flex items-center gap-4 mt-3">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="h-[2px] w-32 bg-primary origin-left"
            />
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px hsl(var(--primary) / 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCertEditorOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary text-sm font-medium transition-colors"
            >
              <Palette className="w-4 h-4" />
              Edit Certificate
            </motion.button>
          </div>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border border-border rounded-2xl p-6 mb-6 bg-card/60 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-bold flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary" /> Filters
            </h2>
            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={clearFilters}
                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
              >
                <X className="w-3 h-3" /> Clear all
              </motion.button>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-primary focus:shadow-[0_0_15px_hsl(var(--primary)/0.15)] transition-all"
              />
            </div>

            {/* Date From */}
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
                  {dateFrom ? format(dateFrom, "MMM dd, yyyy") : "From date"}
                  <ChevronDown className="ml-auto h-3 w-3 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarUI
                  mode="single"
                  selected={dateFrom}
                  onSelect={setDateFrom}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>

            {/* Date To */}
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
                  {dateTo ? format(dateTo, "MMM dd, yyyy") : "To date"}
                  <ChevronDown className="ml-auto h-3 w-3 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarUI
                  mode="single"
                  selected={dateTo}
                  onSelect={setDateTo}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </motion.div>

        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3"
        >
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {filtered.length} participant{filtered.length !== 1 ? "s" : ""}
              {selected.size > 0 && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-primary font-medium"
                >
                  {" "}· {selected.size} selected
                </motion.span>
              )}
            </span>
          </div>

          <motion.button
            onClick={handleBulkSend}
            disabled={sending || selected.size === 0}
            whileHover={{ scale: 1.03, boxShadow: "0 0 25px hsl(var(--primary) / 0.4)" }}
            whileTap={{ scale: 0.97 }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-bold px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
          >
            <AnimatePresence mode="wait">
              {sending ? (
                <motion.div
                  key="spin"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, rotate: 360 }}
                  transition={{ rotate: { duration: 1, repeat: Infinity, ease: "linear" } }}
                  className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                />
              ) : success ? (
                <motion.div key="ok" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <CheckCircle className="w-4 h-4" />
                </motion.div>
              ) : (
                <motion.div key="send" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Send className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
            {sending
              ? "Sending..."
              : success
              ? "Sent!"
              : `Send Certificate${selected.size > 1 ? "s" : ""} (${selected.size})`}
          </motion.button>
        </motion.div>

        {/* Participants Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="border border-border rounded-2xl bg-card/60 backdrop-blur-sm overflow-hidden"
        >
          {/* Table Header */}
          <div className="grid grid-cols-[40px_1fr_1fr_120px_100px] md:grid-cols-[48px_1.5fr_1.5fr_140px_120px] items-center gap-2 px-4 md:px-6 py-3 border-b border-border bg-secondary/50 text-xs text-muted-foreground font-medium uppercase tracking-wider">
            <div className="flex items-center justify-center">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={toggleAll}
                className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                  allSelected
                    ? "bg-primary border-primary"
                    : "border-border hover:border-primary/50"
                )}
              >
                {allSelected && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </motion.div>
                )}
              </motion.button>
            </div>
            <span>Name</span>
            <span>Email</span>
            <span>Date</span>
            <span className="text-center">Status</span>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            <AnimatePresence>
              {filtered.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No participants found</p>
                </motion.div>
              ) : (
                filtered.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => toggleSelect(p.id)}
                    className={cn(
                      "grid grid-cols-[40px_1fr_1fr_120px_100px] md:grid-cols-[48px_1.5fr_1.5fr_140px_120px] items-center gap-2 px-4 md:px-6 py-3.5 cursor-pointer transition-colors group",
                      selected.has(p.id)
                        ? "bg-primary/5 hover:bg-primary/10"
                        : "hover:bg-secondary/50"
                    )}
                  >
                    {/* Checkbox */}
                    <div className="flex items-center justify-center">
                      <div
                        className={cn(
                          "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                          selected.has(p.id)
                            ? "bg-primary border-primary"
                            : "border-border group-hover:border-primary/50"
                        )}
                      >
                        {selected.has(p.id) && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <CheckCircle className="w-3 h-3 text-primary-foreground" />
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* Name */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-heading font-bold text-xs shrink-0">
                        {p.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-foreground truncate">{p.name}</span>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-1.5 min-w-0 text-muted-foreground">
                      <Mail className="w-3 h-3 shrink-0 hidden md:block" />
                      <span className="text-sm truncate">{p.email}</span>
                    </div>

                    {/* Date */}
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(p.date), "MMM dd, yyyy")}
                    </span>

                    {/* Status */}
                    <div className="flex justify-center">
                      {p.certSent ? (
                        <motion.span
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full"
                        >
                          <CheckCircle className="w-3 h-3" /> Sent
                        </motion.span>
                      ) : (
                        <span className="inline-flex items-center text-xs font-medium text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                          Pending
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Success toast */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.8 }}
              className="fixed bottom-8 right-8 bg-card border border-primary/30 rounded-xl px-6 py-4 flex items-center gap-3 shadow-[0_0_30px_hsl(var(--primary)/0.2)] z-50"
            >
              <CheckCircle className="w-5 h-5 text-primary" />
              <span className="text-foreground font-medium">Certificates sent successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Certificate Editor Modal */}
      <CertificateEditor
        open={certEditorOpen}
        onClose={() => setCertEditorOpen(false)}
        onSave={(cfg) => setCertConfig(cfg)}
        config={certConfig}
      />
    </div>
  );
};

export default AdminPage;
