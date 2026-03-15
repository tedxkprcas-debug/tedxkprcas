import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Trash2,
  Download,
  X,
  ExternalLink,
  AlertCircle,
  Hash,
  Copy,
  Mail,
  Loader2,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  useRegistrations,
  useVerifyPayment,
  useRejectPayment,
  useDeleteRegistration,
  useGetRegistrationByCode,
  useSiteSetting,
  useSendVerifiedEmail,
  useUpdateRegistration,
  useUpdateSiteSetting,
} from "@/hooks/use-database";
import type { Registration } from "@/lib/supabase";
import { sendTicketEmail, sendConfirmationEmail } from "@/lib/email";

type Props = {
  showNotification: (type: "success" | "error", message: string) => void;
};

const PAYMENT_STATUS_OPTIONS = [
  { value: "all", label: "All Payments" },
  { value: "pending", label: "Pending" },
  { value: "submitted", label: "Submitted" },
  { value: "verified", label: "Verified" },
  { value: "rejected", label: "Rejected" },
];

const RegistrationsAdmin = ({ showNotification }: Props) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [codeSearch, setCodeSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [registrationPrefix, setRegistrationPrefix] = useState("TEDX");
  
  // Email compose state
  const [emailMessage, setEmailMessage] = useState(`Congratulations! Your payment has been verified and your registration is now confirmed.

Please find your event ticket attached. Here are the important details:

📅 Event: TEDx KPRCAS
📍 Venue: KPR College of Arts and Science, Coimbatore
⏰ Time: To be announced

Important Instructions:
• Please arrive 30 minutes before the event starts
• Carry a valid photo ID for verification
• Show your registration code at the entry gate

We look forward to seeing you at the event!`);
  const [ticketUrl, setTicketUrl] = useState("");
  
  // Registration code edit state
  const [isEditingCode, setIsEditingCode] = useState(false);
  const [editingCodeValue, setEditingCodeValue] = useState("");

  // Database hooks
  const { data: registrations = [], isLoading } = useRegistrations();
  const { mutate: updateRegistration, isPending: isUpdatingRegistration } = useUpdateRegistration();
  const { mutate: verifyPayment, isPending: isVerifying } = useVerifyPayment();
  const { mutate: rejectPayment, isPending: isRejecting } = useRejectPayment();
  const { mutate: deleteRegistration } = useDeleteRegistration();
  const { mutate: getByCode, isPending: isSearchingCode } = useGetRegistrationByCode();
  const { mutate: sendVerifiedEmail, isPending: isSendingVerifiedEmail } = useSendVerifiedEmail();
  const { data: registrationCodeSetting } = useSiteSetting("registration_code_prefix");
  const { mutate: updateSiteSetting } = useUpdateSiteSetting();

  // Email settings (check if email is configured)
  const { data: gmailEmail } = useSiteSetting("gmail_email");
  const { data: gmailAppPassword } = useSiteSetting("gmail_app_password");

  // Check if email is configured
  const isEmailConfigured = !!(gmailEmail && gmailAppPassword);

  // Sync registration prefix from site settings
  useEffect(() => {
    if (registrationCodeSetting) {
      setRegistrationPrefix(registrationCodeSetting.toUpperCase());
    }
  }, [registrationCodeSetting]);

  // Search by registration code
  const handleCodeSearch = () => {
    if (!codeSearch.trim()) {
      showNotification("error", "Please enter a registration code");
      return;
    }
    
    getByCode(codeSearch.toUpperCase(), {
      onSuccess: (data) => {
        setSelectedRegistration(data);
        showNotification("success", "Registration found!");
      },
      onError: () => {
        showNotification("error", "No registration found with this code");
      },
    });
  };

  const saveRegistrationPrefix = () => {
    if (!registrationPrefix.trim()) {
      showNotification("error", "Prefix cannot be empty");
      return;
    }

    updateSiteSetting(
      { key: "registration_code_prefix", value: registrationPrefix.toUpperCase() },
      {
        onSuccess: () => showNotification("success", "Registration ID prefix updated"),
        onError: () => showNotification("error", "Failed to update prefix"),
      }
    );
  };

  // Filtered registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const matchSearch =
        !searchQuery ||
        reg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.registration_code?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchPayment =
        paymentFilter === "all" || reg.payment_status === paymentFilter;

      return matchSearch && matchPayment;
    });
  }, [registrations, searchQuery, paymentFilter]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: registrations.length,
      pending: registrations.filter((r) => r.payment_status === "pending").length,
      submitted: registrations.filter((r) => r.payment_status === "submitted").length,
      verified: registrations.filter((r) => r.payment_status === "verified").length,
      rejected: registrations.filter((r) => r.payment_status === "rejected").length,
    };
  }, [registrations]);

  // Handle verify payment
  const handleVerify = (registration: Registration) => {
    verifyPayment(
      { id: registration.id!, verifiedBy: "admin" },
      {
        onSuccess: () => {
          showNotification("success", "Payment verified successfully");
          // Auto-send ticket email if configured
          if (isEmailConfigured) {
            handleSendTicketEmail(registration);
          }
          setSelectedRegistration(null);
        },
        onError: () => showNotification("error", "Failed to verify payment"),
      }
    );
  };

  // Handle send ticket email
  const handleSendTicketEmail = async (registration: Registration) => {
    if (!isEmailConfigured) {
      showNotification("error", "Email not configured. Go to Email Settings to set up SMTP.");
      return;
    }

    setIsSendingEmail(true);
    try {
      const result = await sendTicketEmail(
        {}, // Config is now handled server-side via SMTP settings
        {
          to_email: registration.email,
          to_name: registration.name,
          registration_code: registration.registration_code || "",
          event_name: "TEDx KPRCAS",
        }
      );

      if (result.success) {
        showNotification("success", `Ticket email sent to ${registration.email}`);
      } else {
        showNotification("error", "Failed to send ticket email. Check SMTP settings.");
      }
    } catch (error) {
      console.error("Email error:", error);
      showNotification("error", "Failed to send ticket email");
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Handle reject payment
  const handleReject = () => {
    if (!selectedRegistration || !rejectionReason.trim()) {
      showNotification("error", "Please provide a rejection reason");
      return;
    }

    rejectPayment(
      { id: selectedRegistration.id!, reason: rejectionReason },
      {
        onSuccess: () => {
          showNotification("success", "Payment rejected");
          setShowRejectDialog(false);
          setSelectedRegistration(null);
          setRejectionReason("");
        },
        onError: () => showNotification("error", "Failed to reject payment"),
      }
    );
  };

  // Handle delete
  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this registration?")) return;
    deleteRegistration(id, {
      onSuccess: () => showNotification("success", "Registration deleted"),
      onError: () => showNotification("error", "Failed to delete registration"),
    });
  };

  // Export to CSV
  const handleExport = () => {
    const headers = [
      "Registration Code",
      "Name",
      "Email",
      "Phone",
      "Payment Status",
      "UPI ID",
      "Amount",
      "Registration Date",
    ];
    const rows = filteredRegistrations.map((reg) => [
      reg.registration_code || "",
      reg.name,
      reg.email,
      reg.phone || "",
      reg.payment_status,
      reg.user_upi_id || "",
      reg.payment_amount?.toString() || "",
      reg.created_at ? format(new Date(reg.created_at), "yyyy-MM-dd HH:mm") : "",
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrations-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get payment status badge
  const getPaymentStatusBadge = (status: Registration["payment_status"]) => {
    switch (status) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-500">
            <CheckCircle className="w-3 h-3" />
            Verified
          </span>
        );
      case "submitted":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-500/10 text-yellow-500">
            <Clock className="w-3 h-3" />
            Submitted
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-500/10 text-red-500">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading registrations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Registration ID prefix */}
      <div className="bg-card rounded-lg border p-4">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex-1">
            <Label className="text-sm">Registration ID Prefix</Label>
            <Input
              value={registrationPrefix}
              onChange={(e) => setRegistrationPrefix(e.target.value.toUpperCase())}
              className="font-mono uppercase mt-1"
              placeholder="TEDX"
            />
            <p className="text-xs text-muted-foreground mt-1">
              This prefix is used when generating new Registration IDs (e.g., {registrationPrefix || "TEDX"}-2026-ABC123).
            </p>
          </div>
          <Button onClick={saveRegistrationPrefix} className="bg-tedx-red hover:bg-tedx-red/90">
            Save Prefix
          </Button>
        </div>
      </div>

      {/* Quick Search by Registration Code */}
      <div className="bg-gradient-to-r from-tedx-red/5 to-orange-500/5 rounded-xl border border-tedx-red/20 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Hash className="w-5 h-5 text-tedx-red" />
          <h3 className="font-semibold">Quick Lookup by Registration ID</h3>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Input
              placeholder={`Enter Registration ID (e.g., ${registrationPrefix || "TEDX"}-2026-ABC123)`}
              value={codeSearch}
              onChange={(e) => setCodeSearch(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleCodeSearch()}
              className="font-mono uppercase"
            />
          </div>
          <Button
            onClick={handleCodeSearch}
            disabled={isSearchingCode}
            className="bg-tedx-red hover:bg-tedx-red/90"
          >
            {isSearchingCode ? "Searching..." : "Find"}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-muted-foreground">{stats.pending}</p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Submitted</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.submitted}</p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Verified</p>
          <p className="text-2xl font-bold text-green-500">{stats.verified}</p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Rejected</p>
          <p className="text-2xl font-bold text-red-500">{stats.rejected}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, phone, or registration code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAYMENT_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Registrations Table */}
      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4 font-medium">Reg. Code</th>
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium">Contact</th>
                <th className="text-left p-4 font-medium">Payment</th>
                <th className="text-left p-4 font-medium">Date</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground">
                    No registrations found
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((reg) => (
                  <motion.tr
                    key={reg.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b last:border-0 hover:bg-muted/30"
                  >
                    <td className="p-4">
                      {reg.registration_code ? (
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-xs bg-tedx-red/10 text-tedx-red px-2 py-1 rounded">
                            {reg.registration_code}
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(reg.registration_code!);
                              toast({ title: "Copied!", description: "Registration code copied" });
                            }}
                            className="p-1 hover:bg-muted rounded"
                            title="Copy code"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{reg.name}</div>
                      {reg.user_upi_id && (
                        <div className="text-xs text-muted-foreground">
                          UPI: {reg.user_upi_id}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{reg.email}</div>
                      {reg.phone && (
                        <div className="text-sm text-muted-foreground">{reg.phone}</div>
                      )}
                    </td>
                    <td className="p-4">
                      {getPaymentStatusBadge(reg.payment_status)}
                      {reg.payment_amount && (
                        <div className="text-xs text-muted-foreground mt-1">
                          ₹{reg.payment_amount}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {reg.created_at && format(new Date(reg.created_at), "MMM dd, yyyy")}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedRegistration(reg)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(reg.id!)}
                          className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Details Dialog */}
      <Dialog
        open={!!selectedRegistration && !showRejectDialog && !showEmailDialog}
        onOpenChange={(open) => !open && setSelectedRegistration(null)}
      >
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registration Details</DialogTitle>
            <DialogDescription>
              View and manage registration information
            </DialogDescription>
          </DialogHeader>

          {selectedRegistration && (
            <div className="space-y-6 py-4">
              {/* Registration Code - Prominent Display */}
              {selectedRegistration.registration_code && (
                <div className="bg-gradient-to-r from-tedx-red/10 to-orange-500/10 rounded-xl p-4 border border-tedx-red/20">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                      Registration ID
                    </Label>
                    <button
                      onClick={() => {
                        setIsEditingCode(true);
                        setEditingCodeValue(selectedRegistration.registration_code || "");
                      }}
                      className="text-xs px-2 py-1 hover:bg-tedx-red/20 rounded transition-colors text-tedx-red font-medium"
                    >
                      Edit
                    </button>
                  </div>
                  
                  {isEditingCode ? (
                    <div className="space-y-2 mt-2">
                      <Input
                        value={editingCodeValue}
                        onChange={(e) => setEditingCodeValue(e.target.value.toUpperCase())}
                        placeholder="Enter registration code"
                        className="font-mono"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            // Generate new code format: TEDX-2026-ABC123
                            const year = new Date().getFullYear();
                            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                            let code = '';
                            for (let i = 0; i < 6; i++) {
                              code += chars.charAt(Math.floor(Math.random() * chars.length));
                            }
                            setEditingCodeValue(`TEDX-${year}-${code}`);
                          }}
                          variant="outline"
                          className="flex-1"
                        >
                          Regenerate
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            if (!editingCodeValue.trim()) {
                              showNotification("error", "Registration code cannot be empty");
                              return;
                            }
                            
                            updateRegistration(
                              {
                                id: selectedRegistration.id!,
                                data: { registration_code: editingCodeValue },
                              },
                              {
                                onSuccess: () => {
                                  setIsEditingCode(false);
                                  setSelectedRegistration({
                                    ...selectedRegistration,
                                    registration_code: editingCodeValue,
                                  });
                                  showNotification("success", "Registration ID updated successfully!");
                                },
                                onError: () => {
                                  showNotification("error", "Failed to update registration ID");
                                },
                              }
                            );
                          }}
                          disabled={isUpdatingRegistration}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          {isUpdatingRegistration ? "Saving..." : "Save"}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setIsEditingCode(false)}
                          variant="outline"
                          disabled={isUpdatingRegistration}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-xl font-bold text-tedx-red">
                        {selectedRegistration.registration_code}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedRegistration.registration_code!);
                          toast({ title: "Copied!", description: "Registration code copied to clipboard" });
                        }}
                        className="p-1.5 hover:bg-tedx-red/10 rounded-lg transition-colors"
                        title="Copy registration code"
                      >
                        <Copy className="w-4 h-4 text-tedx-red" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Basic Info */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Contact Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Name</Label>
                    <p className="font-medium">{selectedRegistration.name}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Email</Label>
                    <p className="font-medium">{selectedRegistration.email}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Phone</Label>
                    <p className="font-medium">{selectedRegistration.phone || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Registered On</Label>
                    <p className="font-medium">
                      {selectedRegistration.created_at &&
                        format(new Date(selectedRegistration.created_at), "MMM dd, yyyy HH:mm")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Form Data */}
              {selectedRegistration.form_data &&
                Object.keys(selectedRegistration.form_data).length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                      Additional Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(selectedRegistration.form_data).map(([key, value]) => (
                        <div key={key}>
                          <Label className="text-xs text-muted-foreground capitalize">
                            {key.replace(/_/g, " ")}
                          </Label>
                          <p className="font-medium">{String(value) || "-"}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Payment Info */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Payment Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <div className="mt-1">
                      {getPaymentStatusBadge(selectedRegistration.payment_status)}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Amount</Label>
                    <p className="font-medium">
                      ₹{selectedRegistration.payment_amount || "-"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">User UPI ID</Label>
                    <p className="font-medium">{selectedRegistration.user_upi_id || "-"}</p>
                  </div>
                  {selectedRegistration.payment_verified_at && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Verified At</Label>
                      <p className="font-medium">
                        {format(
                          new Date(selectedRegistration.payment_verified_at),
                          "MMM dd, yyyy HH:mm"
                        )}
                      </p>
                    </div>
                  )}
                </div>

                {/* Payment Screenshot */}
                {selectedRegistration.payment_screenshot_url && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Payment Screenshot</Label>
                    <div className="relative rounded-lg overflow-hidden border">
                      <img
                        src={selectedRegistration.payment_screenshot_url}
                        alt="Payment Screenshot"
                        className="max-h-64 w-full object-contain bg-muted"
                      />
                      <a
                        href={selectedRegistration.payment_screenshot_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-2 right-2 p-2 bg-background/80 rounded-lg hover:bg-background"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Rejection Reason */}
                {selectedRegistration.rejection_reason && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-500">Rejection Reason</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedRegistration.rejection_reason}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              {selectedRegistration.payment_status === "submitted" && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => handleVerify(selectedRegistration)}
                    disabled={isVerifying}
                    className="flex-1 bg-green-500 hover:bg-green-600"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify Payment
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowRejectDialog(true)}
                    className="flex-1 border-red-500 text-red-500 hover:bg-red-500/10"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}

              {/* Send Ticket Email for Verified Payments */}
              {selectedRegistration.payment_status === "verified" && (
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setShowEmailDialog(true)}
                      disabled={!isEmailConfigured}
                      className="flex-1 bg-blue-500 hover:bg-blue-600"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Confirmation Email
                    </Button>
                  </div>
                  {!isEmailConfigured && (
                    <p className="text-xs text-amber-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Configure email in Admin → Email tab
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Payment</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this payment
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejection_reason">Rejection Reason *</Label>
              <textarea
                id="rejection_reason"
                placeholder="Enter the reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={isRejecting || !rejectionReason.trim()}
              className="bg-red-500 hover:bg-red-600"
            >
              {isRejecting ? "Rejecting..." : "Reject Payment"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Compose Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-500" />
              Send Confirmation Email
            </DialogTitle>
            <DialogDescription>
              Compose and send a confirmation email to the registered user
            </DialogDescription>
          </DialogHeader>

          {selectedRegistration && (
            <div className="space-y-4 py-4">
              {/* Recipient Info */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">To:</span>
                  <span className="font-medium">{selectedRegistration.name}</span>
                  <span className="text-muted-foreground">({selectedRegistration.email})</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Registration ID:</span>
                  <span className="font-mono text-tedx-red">{selectedRegistration.registration_code}</span>
                </div>
              </div>

              {/* Ticket URL (optional) */}
              <div className="space-y-2">
                <Label htmlFor="ticket_url">
                  Ticket PDF URL <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="ticket_url"
                  placeholder="https://example.com/ticket.pdf"
                  value={ticketUrl}
                  onChange={(e) => setTicketUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  If you have a PDF ticket, paste the URL here. User will get a download button.
                </p>
              </div>

              {/* Email Message */}
              <div className="space-y-2">
                <Label htmlFor="email_message">Email Message *</Label>
                <textarea
                  id="email_message"
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  className="flex min-h-[250px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Write your message to the attendee..."
                />
                <p className="text-xs text-muted-foreground">
                  This message will be sent to the user along with their registration code.
                </p>
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="border rounded-lg p-4 bg-white text-black max-h-40 overflow-y-auto">
                  <p className="text-sm whitespace-pre-wrap">{emailMessage}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!selectedRegistration || !emailMessage.trim()) {
                  showNotification("error", "Please enter an email message");
                  return;
                }
                
                sendVerifiedEmail(
                  {
                    registration: selectedRegistration,
                    ticketUrl: ticketUrl || undefined,
                    customMessage: emailMessage,
                  },
                  {
                    onSuccess: () => {
                      showNotification("success", `Email sent to ${selectedRegistration.email}`);
                      setShowEmailDialog(false);
                      setSelectedRegistration(null);
                    },
                    onError: () => {
                      showNotification("error", "Failed to send email. Check SMTP settings.");
                    },
                  }
                );
              }}
              disabled={isSendingVerifiedEmail || !emailMessage.trim()}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {isSendingVerifiedEmail ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Email
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegistrationsAdmin;
