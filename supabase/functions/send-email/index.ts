// Supabase Edge Function for sending emails via SMTP
// Deploy with: supabase functions deploy send-email
// Supports: Gmail SMTP, Outlook, or any SMTP provider

// @ts-nocheck - This file uses Deno runtime APIs
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Max-Age": "86400",
};

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { 
      status: 200,
      headers: corsHeaders 
    });
  }

  try {
    // Get Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch SMTP settings from site_settings table
    const { data: settings, error: settingsError } = await supabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["smtp_host", "smtp_port", "smtp_user", "smtp_pass", "smtp_from_email", "smtp_from_name", "smtp_secure"]);

    if (settingsError) {
      console.error("Settings error:", settingsError);
    }

    // Parse settings into object
    const smtpConfig: Record<string, string> = {};
    settings?.forEach((s: { key: string; value: string }) => {
      smtpConfig[s.key] = s.value;
    });

    // Try environment variables if database settings not found
    const host = smtpConfig.smtp_host || Deno.env.get("SMTP_HOST") || "smtp.gmail.com";
    const port = parseInt(smtpConfig.smtp_port || Deno.env.get("SMTP_PORT") || "587");
    const user = smtpConfig.smtp_user || Deno.env.get("SMTP_USER") || Deno.env.get("VITE_APP_EMAIL") || "";
    const pass = smtpConfig.smtp_pass || Deno.env.get("SMTP_PASS") || Deno.env.get("VITE_APP_PASSWORD") || "";
    const fromEmail = smtpConfig.smtp_from_email || Deno.env.get("SMTP_FROM_EMAIL") || Deno.env.get("VITE_APP_EMAIL") || user;
    const fromName = smtpConfig.smtp_from_name || Deno.env.get("SMTP_FROM_NAME") || "TEDx KPRCAS";
    const secure = smtpConfig.smtp_secure === "true" || port === 465;

    // Check if SMTP is configured
    if (!host || !user || !pass) {
      return new Response(
        JSON.stringify({ 
          error: "SMTP not configured", 
          message: "Please configure SMTP settings in Admin → Email tab or set environment variables" 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const { to, subject, html, text }: EmailRequest = await req.json();

    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, subject, html" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`📧 Sending email to: ${to}`);
    console.log(`📧 SMTP Host: ${host}:${port}`);

    // Create SMTP client
    const client = new SMTPClient({
      connection: {
        hostname: host,
        port: port,
        tls: secure,
        auth: {
          username: user,
          password: pass,
        },
      },
    });

    // Send email
    await client.send({
      from: `"${fromName}" <${fromEmail}>`,
      to: to,
      subject: subject,
      content: text || html.replace(/<[^>]*>/g, ""),
      html: html,
    });

    // Close connection
    await client.close();

    console.log(`✅ Email sent successfully to: ${to}`);

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Email error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to send email", 
        message: error.message || "Unknown error",
        details: String(error)
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
