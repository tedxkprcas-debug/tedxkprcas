import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Upload,
  Loader2,
  QrCode,
  CreditCard,
  User,
  AlertCircle,
  Copy,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  useRegistrationFormFields,
  usePaymentSettings,
  useCreateRegistration,
  useUploadPaymentScreenshot,
  useSubmitPaymentWithCode,
  useSiteSetting,
} from "@/hooks/use-database";
import type { RegistrationFormField, Registration } from "@/lib/supabase";
import { sendConfirmationEmail } from "@/lib/email";

type RegistrationStep = "form" | "payment" | "upload" | "success";

const USER_CATEGORIES = [
  { value: "student", label: "Student", icon: "🎓", description: "Currently enrolled in an educational institution" },
  { value: "company", label: "Company/Organization", icon: "🏢", description: "Working professional or business representative" },
  { value: "other", label: "Other", icon: "👤", description: "Independent participant or freelancer" },
];

const Register = () => {
  const [step, setStep] = useState<RegistrationStep>("form");
  const [userType, setUserType] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [registrationCode, setRegistrationCode] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [userUpiId, setUserUpiId] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  // Fetch form fields and payment settings
  const { data: formFields = [], isLoading: fieldsLoading } = useRegistrationFormFields();
  const { data: paymentSettings, isLoading: paymentLoading } = usePaymentSettings();

  // Email settings for confirmation (check if SMTP is configured)
  const { data: smtpHost } = useSiteSetting("smtp_host");
  const { data: smtpUser } = useSiteSetting("smtp_user");
  const isEmailConfigured = !!(smtpHost && smtpUser);

  // Filter form fields based on selected user type
  const filteredFormFields = useMemo(() => {
    if (!userType) return [];
    return formFields.filter((field) => {
      const categories = field.show_for_category || ["all"];
      return categories.includes("all") || categories.includes(userType);
    });
  }, [formFields, userType]);

  // Mutations
  const { mutateAsync: createRegistration } = useCreateRegistration();
  const { mutateAsync: uploadScreenshot } = useUploadPaymentScreenshot();
  const { mutateAsync: submitPaymentWithCode } = useSubmitPaymentWithCode();

  // Handle form field change
  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    // Clear error when user types
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!userType) {
      newErrors.userType = "Please select your registration type";
      setErrors(newErrors);
      return false;
    }

    filteredFormFields.forEach((field) => {
      if (field.is_required) {
        const value = formData[field.field_name];
        if (!value || (typeof value === "string" && !value.trim())) {
          newErrors[field.field_name] = `${field.field_label} is required`;
        }
      }

      // Email validation
      if (field.field_type === "email" && formData[field.field_name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.field_name])) {
          newErrors[field.field_name] = "Please enter a valid email address";
        }
      }

      // Phone validation
      if (field.field_type === "tel" && formData[field.field_name]) {
        const phoneRegex = /^[\d\s+\-()]{10,}$/;
        if (!phoneRegex.test(formData[field.field_name])) {
          newErrors[field.field_name] = "Please enter a valid phone number";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Extract basic fields
      const name = formData.name || "";
      const email = formData.email || "";
      const phone = formData.phone || "";

      // Other fields go into form_data (including user_type)
      const { name: _, email: __, phone: ___, ...otherFields } = formData;

      const registration = await createRegistration({
        name,
        email,
        phone,
        form_data: { ...otherFields, user_type: userType },
        payment_status: "pending",
        registration_status: "pending",
      });

      setRegistrationId(registration.id!);
      setUserEmail(email);
      setStep("payment");
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.message?.includes("duplicate")) {
        setErrors({ email: "This email is already registered" });
      } else {
        setErrors({ submit: "Failed to submit registration. Please try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ screenshot: "File size must be less than 5MB" });
        return;
      }
      setPaymentScreenshot(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrors({});
    }
  };

  // Copy registration code to clipboard
  const copyRegistrationCode = () => {
    if (registrationCode) {
      navigator.clipboard.writeText(registrationCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  // Handle payment submission
  const handlePaymentSubmit = async () => {
    if (!paymentScreenshot) {
      setErrors({ screenshot: "Please upload payment screenshot" });
      return;
    }
    if (!userUpiId.trim()) {
      setErrors({ upiId: "Please enter your UPI ID" });
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload screenshot
      const screenshotUrl = await uploadScreenshot({
        file: paymentScreenshot,
        registrationId: registrationId!,
      });

      // Submit payment and generate unique registration code
      const result = await submitPaymentWithCode({
        id: registrationId!,
        paymentData: {
          payment_screenshot_url: screenshotUrl,
          user_upi_id: userUpiId,
          payment_amount: paymentSettings?.payment_amount || 0,
          transaction_id: transactionId || undefined,
        },
      });

      // Store the registration code
      setRegistrationCode(result.registration_code || null);
      
      // Send confirmation email if configured
      if (isEmailConfigured && userEmail) {
        try {
          await sendConfirmationEmail(
            {}, // Config is now handled server-side via SMTP settings
            {
              to_email: userEmail,
              to_name: formData.name || formData.full_name || "Participant",
              registration_code: result.registration_code || "",
              event_name: "TEDx KPRCAS",
              payment_status: "Submitted - Awaiting Verification",
            }
          );
          console.log("✅ Confirmation email sent to", userEmail);
        } catch (emailError) {
          console.error("Email sending failed:", emailError);
          // Don't block registration if email fails
        }
      }
      
      setStep("success");
    } catch (error) {
      console.error("Payment submission error:", error);
      setErrors({ submit: "Failed to submit payment details. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clean up preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Render form field based on type
  const renderField = (field: RegistrationFormField) => {
    const value = formData[field.field_name] || "";
    const error = errors[field.field_name];

    switch (field.field_type) {
      case "select":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.field_name}>
              {field.field_label}
              {field.is_required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={value}
              onValueChange={(val) => handleFieldChange(field.field_name, val)}
            >
              <SelectTrigger className={cn(error && "border-red-500")}>
                <SelectValue placeholder={field.placeholder || `Select ${field.field_label}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case "textarea":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.field_name}>
              {field.field_label}
              {field.is_required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <textarea
              id={field.field_name}
              className={cn(
                "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                error && "border-red-500"
              )}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleFieldChange(field.field_name, e.target.value)}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case "checkbox":
        return (
          <div key={field.id} className="flex items-center space-x-2">
            <Checkbox
              id={field.field_name}
              checked={value === true}
              onCheckedChange={(checked) => handleFieldChange(field.field_name, checked)}
            />
            <Label htmlFor={field.field_name} className="cursor-pointer">
              {field.field_label}
              {field.is_required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {error && <p className="text-sm text-red-500 ml-6">{error}</p>}
          </div>
        );

      default:
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.field_name}>
              {field.field_label}
              {field.is_required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.field_name}
              type={field.field_type}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleFieldChange(field.field_name, e.target.value)}
              className={cn(error && "border-red-500")}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );
    }
  };

  // Loading state
  if (fieldsLoading || paymentLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-tedx-red" />
          <p className="mt-4 text-muted-foreground">Loading registration form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-14 sm:h-16 px-4">
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="TEDx KPRCAS" className="h-8 sm:h-10 w-auto" />
          </Link>
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 pb-12 px-4">
        <div className="max-w-lg mx-auto">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {["form", "payment", "upload", "success"].map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    step === s
                      ? "bg-tedx-red text-white"
                      : ["form", "payment", "upload", "success"].indexOf(step) > i
                      ? "bg-green-500 text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {["form", "payment", "upload", "success"].indexOf(step) > i ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < 3 && (
                  <div
                    className={cn(
                      "w-8 sm:w-12 h-0.5 mx-1",
                      ["form", "payment", "upload", "success"].indexOf(step) > i
                        ? "bg-green-500"
                        : "bg-muted"
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Registration Form */}
            {step === "form" && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-tedx-red/10 mb-4">
                    <User className="h-8 w-8 text-tedx-red" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground">Register for TEDx KPRCAS</h1>
                  <p className="text-muted-foreground mt-2">Fill in your details to book your ticket</p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                  {/* User Type Selection */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">
                      I am registering as a <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-1 gap-3">
                      {USER_CATEGORIES.map((category) => (
                        <button
                          key={category.value}
                          type="button"
                          onClick={() => {
                            setUserType(category.value);
                            setErrors((prev) => {
                              const newErrors = { ...prev };
                              delete newErrors.userType;
                              return newErrors;
                            });
                          }}
                          className={cn(
                            "flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left",
                            userType === category.value
                              ? "border-tedx-red bg-tedx-red/10"
                              : "border-border hover:border-tedx-red/50 bg-card"
                          )}
                        >
                          <span className="text-2xl">{category.icon}</span>
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{category.label}</p>
                            <p className="text-sm text-muted-foreground">{category.description}</p>
                          </div>
                          {userType === category.value && (
                            <CheckCircle className="h-5 w-5 text-tedx-red" />
                          )}
                        </button>
                      ))}
                    </div>
                    {errors.userType && (
                      <p className="text-sm text-red-500">{errors.userType}</p>
                    )}
                  </div>

                  {/* Form Fields - Only show after selecting user type */}
                  {userType && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-6"
                    >
                      <div className="h-px bg-border" />
                      {filteredFormFields.map(renderField)}
                    </motion.div>
                  )}

                  {errors.submit && (
                    <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-500">
                      <AlertCircle className="h-4 w-4" />
                      <p className="text-sm">{errors.submit}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-tedx-red hover:bg-tedx-dark-red"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Continue to Payment
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>
            )}

            {/* Step 2: Payment QR Code */}
            {step === "payment" && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-tedx-red/10 mb-4">
                    <QrCode className="h-8 w-8 text-tedx-red" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground">Make Payment</h1>
                  <p className="text-muted-foreground mt-2">
                    Scan the QR code or use UPI ID to pay
                  </p>
                </div>

                <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                  {/* Payment Amount */}
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Amount to Pay</p>
                    <p className="text-3xl font-bold text-tedx-red">
                      ₹{paymentSettings?.payment_amount || 0}
                    </p>
                  </div>

                  {/* QR Code - Uploaded by Admin */}
                  {paymentSettings?.qr_code_url ? (
                    <div className="flex justify-center">
                      <div className="bg-white p-4 rounded-lg">
                        <img
                          src={paymentSettings.qr_code_url}
                          alt="Payment QR Code"
                          className="w-48 h-48 object-contain"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                        <QrCode className="h-12 w-12 text-muted-foreground" />
                      </div>
                    </div>
                  )}

                  {/* UPI ID */}
                  {paymentSettings?.upi_id && (
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Or pay using UPI ID</p>
                      <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-lg">
                        <CreditCard className="h-4 w-4" />
                        <code className="font-mono text-sm">{paymentSettings.upi_id}</code>
                      </div>
                    </div>
                  )}

                  {/* Instructions */}
                  {paymentSettings?.payment_instructions && (
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {paymentSettings.payment_instructions}
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => setStep("upload")}
                  className="w-full mt-6 bg-tedx-red hover:bg-tedx-dark-red"
                >
                  I've Made the Payment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {/* Step 3: Upload Screenshot */}
            {step === "upload" && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-tedx-red/10 mb-4">
                    <Upload className="h-8 w-8 text-tedx-red" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground">Upload Payment Proof</h1>
                  <p className="text-muted-foreground mt-2">
                    Upload your payment screenshot and enter your UPI ID
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Screenshot Upload */}
                  <div className="space-y-2">
                    <Label>Payment Screenshot *</Label>
                    <div
                      className={cn(
                        "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-tedx-red/50",
                        errors.screenshot ? "border-red-500" : "border-border"
                      )}
                      onClick={() => document.getElementById("screenshot-input")?.click()}
                    >
                      <input
                        id="screenshot-input"
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      {previewUrl ? (
                        <div className="space-y-4">
                          <img
                            src={previewUrl}
                            alt="Payment Screenshot"
                            className="max-h-48 mx-auto rounded-lg"
                          />
                          <p className="text-sm text-muted-foreground">
                            Click to change image
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload screenshot
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG up to 5MB
                          </p>
                        </div>
                      )}
                    </div>
                    {errors.screenshot && (
                      <p className="text-sm text-red-500">{errors.screenshot}</p>
                    )}
                  </div>

                  {/* UPI ID Input */}
                  <div className="space-y-2">
                    <Label htmlFor="user-upi">Your UPI ID *</Label>
                    <Input
                      id="user-upi"
                      placeholder="yourname@upi"
                      value={userUpiId}
                      onChange={(e) => {
                        setUserUpiId(e.target.value);
                        if (errors.upiId) {
                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.upiId;
                            return newErrors;
                          });
                        }
                      }}
                      className={cn(errors.upiId && "border-red-500")}
                    />
                    {errors.upiId && <p className="text-sm text-red-500">{errors.upiId}</p>}
                  </div>

                  {/* Transaction ID Input */}
                  <div className="space-y-2">
                    <Label htmlFor="transaction-id">Transaction ID / Payment Reference (Optional)</Label>
                    <Input
                      id="transaction-id"
                      placeholder="Enter UPI transaction ID if available"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the UPI transaction reference number from your payment app
                    </p>
                  </div>

                  {errors.submit && (
                    <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-500">
                      <AlertCircle className="h-4 w-4" />
                      <p className="text-sm">{errors.submit}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setStep("payment")}
                      className="flex-1"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      onClick={handlePaymentSubmit}
                      className="flex-1 bg-tedx-red hover:bg-tedx-dark-red"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-6">
                    <CheckCircle className="h-10 w-10 text-green-500" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    Registration Submitted!
                  </h1>
                  <p className="text-muted-foreground mb-6">
                    Thank you for registering for TEDx KPRCAS. Your payment is being verified.
                  </p>

                  {/* Registration Code */}
                  {registrationCode && (
                    <div className="bg-gradient-to-r from-tedx-red/10 to-orange-500/10 rounded-xl border border-tedx-red/20 p-6 mb-6">
                      <p className="text-sm text-muted-foreground mb-2">Your Registration ID</p>
                      <div className="flex items-center justify-center gap-3">
                        <code className="text-2xl md:text-3xl font-mono font-bold text-tedx-red tracking-wider">
                          {registrationCode}
                        </code>
                        <button
                          onClick={copyRegistrationCode}
                          className="p-2 hover:bg-tedx-red/10 rounded-lg transition-colors"
                          title="Copy to clipboard"
                        >
                          {codeCopied ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <Copy className="w-5 h-5 text-tedx-red" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
                        Save this ID! You'll need it to check your registration status.
                      </p>
                    </div>
                  )}

                  {/* Email Notification */}
                  <div className="bg-card rounded-xl border border-border p-4 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">Confirmation sent to</p>
                      <p className="text-sm text-muted-foreground">{userEmail}</p>
                    </div>
                  </div>

                  <div className="bg-card rounded-xl border border-border p-6 mb-6">
                    <h3 className="font-semibold mb-4">What happens next?</h3>
                    <ul className="text-sm text-muted-foreground space-y-2 text-left">
                      <li className="flex items-start gap-2">
                        <span className="text-tedx-red">1.</span>
                        Our team will verify your payment within 24-48 hours
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-tedx-red">2.</span>
                        You'll receive a confirmation email with your ticket
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-tedx-red">3.</span>
                        Use your Registration ID ({registrationCode}) to check status
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-tedx-red">4.</span>
                        Show your ticket at the venue on the event day
                      </li>
                    </ul>
                  </div>

                  <Link to="/">
                    <Button className="bg-tedx-red hover:bg-tedx-dark-red">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Register;
