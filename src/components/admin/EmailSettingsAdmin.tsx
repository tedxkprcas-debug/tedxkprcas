import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Key, Loader2, Info, Send, ExternalLink, AlertTriangle, Server, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  useSiteSetting,
  useUpdateSiteSetting,
} from "@/hooks/use-database";
import { supabase } from "@/lib/supabase";

type Props = {
  showNotification: (type: "success" | "error", message: string) => void;
};

const EmailSettingsAdmin = ({ showNotification }: Props) => {
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [smtpFromEmail, setSmtpFromEmail] = useState("");
  const [smtpFromName, setSmtpFromName] = useState("TEDx KPRCAS");
  const [smtpSecure, setSmtpSecure] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testEmail, setTestEmail] = useState("");

  // Load saved settings
  const { data: savedHost } = useSiteSetting("smtp_host");
  const { data: savedPort } = useSiteSetting("smtp_port");
  const { data: savedUser } = useSiteSetting("smtp_user");
  const { data: savedPass } = useSiteSetting("smtp_pass");
  const { data: savedFromEmail } = useSiteSetting("smtp_from_email");
  const { data: savedFromName } = useSiteSetting("smtp_from_name");
  const { data: savedSecure } = useSiteSetting("smtp_secure");

  const { mutate: updateSetting, isPending } = useUpdateSiteSetting();

  // Load settings into form
  useEffect(() => {
    if (savedHost) setSmtpHost(savedHost);
    if (savedPort) setSmtpPort(savedPort);
    if (savedUser) setSmtpUser(savedUser);
    if (savedPass) setSmtpPass(savedPass);
    if (savedFromEmail) setSmtpFromEmail(savedFromEmail);
    if (savedFromName) setSmtpFromName(savedFromName);
    if (savedSecure) setSmtpSecure(savedSecure === "true");
  }, [savedHost, savedPort, savedUser, savedPass, savedFromEmail, savedFromName, savedSecure]);

  const handleSave = async () => {
    try {
      const settings = [
        { key: "smtp_host", value: smtpHost },
        { key: "smtp_port", value: smtpPort },
        { key: "smtp_user", value: smtpUser },
        { key: "smtp_pass", value: smtpPass },
        { key: "smtp_from_email", value: smtpFromEmail || smtpUser },
        { key: "smtp_from_name", value: smtpFromName },
        { key: "smtp_secure", value: smtpSecure.toString() },
      ];

      for (const setting of settings) {
        await new Promise<void>((resolve, reject) => {
          updateSetting(setting, { onSuccess: () => resolve(), onError: reject });
        });
      }
      
      showNotification("success", "SMTP settings saved successfully");
    } catch {
      showNotification("error", "Failed to save SMTP settings");
    }
  };

  const handleTestEmail = async () => {
    if (!smtpHost || !smtpUser || !smtpPass) {
      showNotification("error", "Please fill in all required SMTP fields first");
      return;
    }

    if (!testEmail) {
      showNotification("error", "Please enter a test email address");
      return;
    }

    setIsTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-email", {
        body: {
          to: testEmail,
          subject: "🧪 Test Email from TEDx KPRCAS",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #e62b1e;">✅ Email Configuration Working!</h2>
              <p>This is a test email from your TEDx KPRCAS website.</p>
              <p>If you received this email, your SMTP settings are configured correctly.</p>
              <hr style="border: 1px solid #eee; margin: 20px 0;" />
              <p style="color: #666; font-size: 14px;">
                <strong>SMTP Host:</strong> ${smtpHost}<br />
                <strong>Port:</strong> ${smtpPort}<br />
                <strong>Secure:</strong> ${smtpSecure ? "Yes" : "No"}
              </p>
            </div>
          `,
          text: "Test email from TEDx KPRCAS. Your SMTP settings are working correctly!",
        },
      });

      if (error) throw error;
      
      showNotification("success", `Test email sent to ${testEmail}`);
    } catch (error: any) {
      console.error("Test email error:", error);
      showNotification("error", error.message || "Failed to send test email. Check your SMTP settings.");
    } finally {
      setIsTesting(false);
    }
  };

  const isConfigured = smtpHost && smtpUser && smtpPass;

  // Common SMTP presets
  const applyPreset = (preset: string) => {
    switch (preset) {
      case "gmail":
        setSmtpHost("smtp.gmail.com");
        setSmtpPort("587");
        setSmtpSecure(false);
        break;
      case "outlook":
        setSmtpHost("smtp-mail.outlook.com");
        setSmtpPort("587");
        setSmtpSecure(false);
        break;
      case "yahoo":
        setSmtpHost("smtp.mail.yahoo.com");
        setSmtpPort("587");
        setSmtpSecure(false);
        break;
      case "zoho":
        setSmtpHost("smtp.zoho.com");
        setSmtpPort("587");
        setSmtpSecure(false);
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-500" />
            SMTP Email Configuration
          </h3>
          <p className="text-sm text-muted-foreground">
            Configure SMTP to send confirmation and ticket emails
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSetupGuide(!showSetupGuide)}
        >
          <Info className="w-4 h-4 mr-1" />
          Setup Guide
        </Button>
      </div>

      {/* Status indicator */}
      {isConfigured ? (
        <div className="flex items-center gap-2 text-green-500 bg-green-500/10 px-3 py-2 rounded-md">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm">SMTP configured</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-amber-500 bg-amber-500/10 px-3 py-2 rounded-md">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm">SMTP not configured - emails will not be sent</span>
        </div>
      )}

      {/* Setup Guide */}
      {showSetupGuide && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 space-y-3"
        >
          <h4 className="font-medium text-blue-400 flex items-center gap-2">
            <Info className="w-4 h-4" />
            SMTP Setup Guide
          </h4>
          
          <div className="space-y-3 text-sm text-muted-foreground">
            <div>
              <strong className="text-foreground">For Gmail:</strong>
              <ol className="list-decimal list-inside ml-2 mt-1 space-y-1">
                <li>Enable 2-Factor Authentication on your Google account</li>
                <li>Go to <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">App Passwords</a></li>
                <li>Create a new app password for "Mail"</li>
                <li>Use that password in the SMTP Password field</li>
              </ol>
            </div>
            
            <div>
              <strong className="text-foreground">For Outlook/Hotmail:</strong>
              <ol className="list-decimal list-inside ml-2 mt-1 space-y-1">
                <li>Use Host: smtp-mail.outlook.com, Port: 587</li>
                <li>Use your full email as username</li>
                <li>Use your account password</li>
              </ol>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded p-2 mt-2">
              <strong className="text-amber-400">⚠️ Important:</strong> Deploy the Edge Function first:
              <code className="block bg-black/30 p-2 rounded mt-1 text-xs">
                supabase functions deploy send-email
              </code>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Presets */}
      <div className="flex gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground self-center">Quick Setup:</span>
        {["gmail", "outlook", "yahoo", "zoho"].map((preset) => (
          <Button
            key={preset}
            variant="outline"
            size="sm"
            onClick={() => applyPreset(preset)}
            className="capitalize"
          >
            {preset}
          </Button>
        ))}
      </div>

      {/* Settings Form */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="smtp-host">SMTP Host *</Label>
          <div className="relative">
            <Server className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="smtp-host"
              placeholder="smtp.gmail.com"
              value={smtpHost}
              onChange={(e) => setSmtpHost(e.target.value)}
              className="pl-10 font-mono"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="smtp-port">Port *</Label>
          <Input
            id="smtp-port"
            placeholder="587"
            value={smtpPort}
            onChange={(e) => setSmtpPort(e.target.value)}
            className="font-mono"
          />
          <p className="text-xs text-muted-foreground">
            Usually 587 (TLS) or 465 (SSL)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="smtp-user">Username/Email *</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="smtp-user"
              placeholder="your-email@gmail.com"
              value={smtpUser}
              onChange={(e) => setSmtpUser(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="smtp-pass">Password / App Password *</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="smtp-pass"
              type="password"
              placeholder="••••••••••••••••"
              value={smtpPass}
              onChange={(e) => setSmtpPass(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="from-email">From Email (optional)</Label>
          <Input
            id="from-email"
            placeholder="noreply@yourdomain.com"
            value={smtpFromEmail}
            onChange={(e) => setSmtpFromEmail(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Defaults to SMTP username if empty
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="from-name">From Name</Label>
          <Input
            id="from-name"
            placeholder="TEDx KPRCAS"
            value={smtpFromName}
            onChange={(e) => setSmtpFromName(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2 col-span-full">
          <Switch
            id="smtp-secure"
            checked={smtpSecure}
            onCheckedChange={setSmtpSecure}
          />
          <Label htmlFor="smtp-secure">Use SSL/TLS (for port 465)</Label>
        </div>
      </div>

      <Button
        onClick={handleSave}
        disabled={isPending}
        className="w-full"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          "Save SMTP Settings"
        )}
      </Button>

      {/* Test Email Section */}
      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Test Email Configuration</h4>
        <div className="flex gap-3">
          <Input
            placeholder="test@example.com"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            className="flex-1"
          />
          <Button
            variant="outline"
            onClick={handleTestEmail}
            disabled={isTesting || !isConfigured}
          >
            {isTesting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Test
              </>
            )}
          </Button>
        </div>
        {!isConfigured && (
          <p className="text-xs text-amber-500 mt-2">
            Configure SMTP settings above first
          </p>
        )}
      </div>
    </div>
  );
};

export default EmailSettingsAdmin;
