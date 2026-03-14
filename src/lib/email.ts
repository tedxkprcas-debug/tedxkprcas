// Email Service using Nodemailer via Node.js API
// Backend: server/server.js

import { supabase } from "./supabase";

// SMTP configuration (admin sets these in site settings)
export interface SMTPConfig {
  smtp_host: string;
  smtp_port: string;
  smtp_user: string;
  smtp_pass: string;
  from_email: string;
  from_name?: string;
}

// API endpoint for email service
// Simple logic: use relative path for production, localhost server for development
const getEmailEndpoint = (): string => {
  if (typeof window === 'undefined') {
    return '/api/send-email';
  }
  
  const hostname = window.location.hostname;
  
  // Development: use local server
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3001/api/send-email';
  }
  
  // Production: use relative path (Vercel API route)
  return '/api/send-email';
};

// Send email via Node.js API endpoint or Vercel API route
async function sendEmail(data: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  try {
    const endpoint = getEmailEndpoint();
    console.log(`📧 Sending to: ${endpoint}`);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("✅ Email sent successfully:", result);
    return { success: true, response: result };
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    return { success: false, error };
  }
}

// Send registration confirmation email (after payment submission - pending verification)
export async function sendRegistrationPendingEmail(
  _config: any, // Kept for backward compatibility, config is now fetched server-side
  data: {
    to_email: string;
    to_name: string;
    registration_code: string;
    event_name?: string;
    event_date?: string;
  }
) {
  const eventName = data.event_name || "TEDx KPRCAS";
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #e62b1e 0%, #000 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .code-box { background: #000; color: #e62b1e; padding: 20px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 4px; border-radius: 8px; margin: 20px 0; font-family: monospace; }
    .status-badge { display: inline-block; padding: 8px 20px; border-radius: 25px; background: #fef3c7; color: #92400e; font-weight: bold; font-size: 14px; }
    .steps-box { background: white; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #e62b1e; }
    .steps-box h3 { color: #e62b1e; margin-top: 0; font-size: 18px; }
    .step-item { display: flex; align-items: flex-start; gap: 15px; padding: 12px 0; border-bottom: 1px solid #eee; }
    .step-item:last-child { border-bottom: none; }
    .step-number { background: #e62b1e; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; flex-shrink: 0; }
    .step-text { color: #333; }
    .step-text strong { color: #000; }
    .highlight-box { background: #fef3c7; padding: 15px 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
    .highlight-box code { background: #000; color: #e62b1e; padding: 5px 15px; border-radius: 4px; font-size: 16px; font-weight: bold; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎤 ${eventName}</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Registration Submitted Successfully!</p>
    </div>
    <div class="content">
      <p>Dear <strong>${data.to_name}</strong>,</p>
      <p>Thank you for registering for <strong>${eventName}</strong>! Your payment has been submitted and is now under review.</p>
      
      <p style="text-align: center; margin: 25px 0;">
        <span class="status-badge">⏳ Payment Verification Pending</span>
      </p>
      
      <p style="text-align: center; color: #666; font-size: 14px; margin-bottom: 5px;">Your Registration ID</p>
      <div class="code-box">${data.registration_code}</div>
      
      <div class="steps-box">
        <h3>📋 What happens next?</h3>
        <div class="step-item">
          <div class="step-number">1</div>
          <div class="step-text">Our team will <strong>verify your payment within 24-48 hours</strong></div>
        </div>
        <div class="step-item">
          <div class="step-number">2</div>
          <div class="step-text">You'll receive a <strong>confirmation email with your ticket</strong></div>
        </div>
        <div class="step-item">
          <div class="step-number">3</div>
          <div class="step-text">Use your Registration ID <strong>(${data.registration_code})</strong> to check status</div>
        </div>
        <div class="step-item">
          <div class="step-number">4</div>
          <div class="step-text"><strong>Show your ticket</strong> at the venue on the event day</div>
        </div>
      </div>
      
      <div class="highlight-box">
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #92400e;">Save your Registration ID:</p>
        <code>${data.registration_code}</code>
      </div>
      
      <p>If you have any questions, contact us at <a href="mailto:tedxkprcas@kprcas.ac.in" style="color: #e62b1e;">tedxkprcas@gmail.com</a></p>
      
      <p>We look forward to seeing you at the event!</p>
      <p>Best regards,<br><strong>${eventName} Team</strong></p>
    </div>
    <div class="footer">
      <p>This is an automated email. Please do not reply directly.</p>
      <p>© ${new Date().getFullYear()} ${eventName}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
Dear ${data.to_name},

Thank you for registering for ${eventName}!
Your payment has been submitted and is now under review.

📋 Your Registration ID: ${data.registration_code}

What happens next:
1. Our team will verify your payment within 24-48 hours
2. You'll receive a confirmation email with your ticket
3. Use your Registration ID (${data.registration_code}) to check status
4. Show your ticket at the venue on the event day

Save this Registration ID: ${data.registration_code}

For any queries, contact us at tedxkprcas@gmail.com

We look forward to seeing you at the event!

Best regards,
${eventName} Team
  `.trim();

  return sendEmail({
    to: data.to_email,
    subject: `🎫 Registration Submitted - ${eventName} | ID: ${data.registration_code}`,
    html,
    text,
  });
}

// Legacy function - keeping for backward compatibility
export async function sendConfirmationEmail(
  _config: any,
  data: {
    to_email: string;
    to_name: string;
    registration_code: string;
    event_name?: string;
    event_date?: string;
    payment_status: string;
  }
) {
  // Redirect to the new pending email function
  return sendRegistrationPendingEmail(_config, {
    to_email: data.to_email,
    to_name: data.to_name,
    registration_code: data.registration_code,
    event_name: data.event_name,
    event_date: data.event_date,
  });
}

// Send ticket email when payment is verified
export async function sendTicketEmail(
  _config: any, // Kept for backward compatibility
  data: {
    to_email: string;
    to_name: string;
    registration_code: string;
    ticket_url?: string;
    event_name?: string;
    event_date?: string;
    event_venue?: string;
    event_time?: string;
  }
) {
  const eventName = data.event_name || "TEDx KPRCAS";
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #e62b1e 0%, #000 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .header h1 { margin: 0; font-size: 28px; }
    .confetti { font-size: 40px; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .ticket-box { background: linear-gradient(135deg, #000 0%, #1a1a1a 100%); color: white; padding: 25px; border-radius: 12px; margin: 20px 0; border: 2px dashed #e62b1e; }
    .ticket-code { color: #e62b1e; font-size: 28px; font-weight: bold; letter-spacing: 4px; text-align: center; padding: 15px; background: rgba(230, 43, 30, 0.1); border-radius: 8px; margin: 15px 0; }
    .ticket-details { display: grid; gap: 10px; }
    .ticket-detail { display: flex; align-items: center; gap: 10px; }
    .ticket-detail span:first-child { color: #e62b1e; }
    .instructions { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #e62b1e; }
    .instructions h3 { color: #e62b1e; margin-top: 0; }
    .btn { display: inline-block; background: #e62b1e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 10px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
    .verified { background: #10b981; color: white; padding: 5px 15px; border-radius: 20px; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="confetti">🎉</div>
      <h1>${eventName}</h1>
      <p>Your Ticket is Ready!</p>
    </div>
    <div class="content">
      <p>Dear <strong>${data.to_name}</strong>,</p>
      <p>Congratulations! Your payment has been <span class="verified">✓ Verified</span></p>
      <p>Your registration for <strong>${eventName}</strong> is now confirmed!</p>
      
      <div class="ticket-box">
        <div style="text-align: center; margin-bottom: 15px;">
          <span style="font-size: 14px; color: #999;">REGISTRATION CODE</span>
        </div>
        <div class="ticket-code">${data.registration_code}</div>
        <div class="ticket-details">
          <div class="ticket-detail">
            <span>📅 Date:</span>
            <span>${data.event_date || "To be announced"}</span>
          </div>
          <div class="ticket-detail">
            <span>⏰ Time:</span>
            <span>${data.event_time || "To be announced"}</span>
          </div>
          <div class="ticket-detail">
            <span>📍 Venue:</span>
            <span>${data.event_venue || "To be announced"}</span>
          </div>
        </div>
      </div>
      
      ${data.ticket_url ? `<p style="text-align: center;"><a href="${data.ticket_url}" class="btn">📥 Download Ticket PDF</a></p>` : ""}
      
      <div class="instructions">
        <h3>📋 Important Instructions</h3>
        <ul>
          <li>Please arrive <strong>30 minutes</strong> before the event starts</li>
          <li>Carry a <strong>valid photo ID</strong> for verification</li>
          <li>Show your <strong>registration code</strong> at the entry gate</li>
          <li>Photography/videography rules will be announced at the venue</li>
        </ul>
      </div>
      
      <p>For any queries, contact us at <a href="mailto:tedxkprcas@gmail.com">tedxkprcas@gmail.com</a></p>
      
      <p>See you at the event! 🎤</p>
      <p>Best regards,<br><strong>${eventName} Team</strong></p>
    </div>
    <div class="footer">
      <p>This is an automated email. Please do not reply directly.</p>
      <p>© ${new Date().getFullYear()} ${eventName}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
🎉 Congratulations ${data.to_name}!

Your payment has been verified and your registration is confirmed for ${eventName}!

📋 Your Ticket Details:
- Registration Code: ${data.registration_code}
- Event: ${eventName}
- Date: ${data.event_date || "TBA"}
- Time: ${data.event_time || "TBA"}
- Venue: ${data.event_venue || "TBA"}

${data.ticket_url ? `📥 Download your ticket: ${data.ticket_url}` : ""}

Important Instructions:
1. Please arrive 30 minutes before the event starts
2. Carry a valid photo ID for verification
3. Show your registration code at the entry gate
4. Photography/videography rules will be announced at the venue

For any queries, contact us at tedxkprcas@gmail.com

See you at the event!

Best regards,
${eventName} Team
  `.trim();

  return sendEmail({
    to: data.to_email,
    subject: `🎫 Your Ticket for ${eventName} - Payment Verified!`,
    html,
    text,
  });
}

// Send custom email from admin (for verified payments with custom message)
export async function sendCustomEmail(
  _config: any,
  data: {
    to_email: string;
    to_name: string;
    subject: string;
    message: string; // Custom message from admin
    registration_code?: string;
    ticket_url?: string;
    event_name?: string;
  }
) {
  const eventName = data.event_name || "TEDx KPRCAS";
  
  // Convert newlines to <br> for HTML
  const messageHtml = data.message.replace(/\n/g, '<br>');
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #e62b1e 0%, #000 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .message-box { background: white; padding: 25px; border-radius: 8px; margin: 20px 0; }
    .code-box { background: #000; color: #e62b1e; padding: 15px; text-align: center; font-size: 22px; font-weight: bold; letter-spacing: 3px; border-radius: 8px; margin: 20px 0; font-family: monospace; }
    .btn { display: inline-block; background: #e62b1e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 15px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎤 ${eventName}</h1>
    </div>
    <div class="content">
      <p>Dear <strong>${data.to_name}</strong>,</p>
      
      <div class="message-box">
        ${messageHtml}
      </div>
      
      ${data.registration_code ? `
      <p style="color: #666; font-size: 14px; text-align: center; margin-bottom: 5px;">Your Registration ID</p>
      <div class="code-box">${data.registration_code}</div>
      ` : ''}
      
      ${data.ticket_url ? `
      <p style="text-align: center;">
        <a href="${data.ticket_url}" class="btn">📥 Download Your Ticket</a>
      </p>
      ` : ''}
      
      <p>Best regards,<br><strong>${eventName} Team</strong></p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} ${eventName}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
Dear ${data.to_name},

${data.message}

${data.registration_code ? `Registration ID: ${data.registration_code}` : ''}
${data.ticket_url ? `Download your ticket: ${data.ticket_url}` : ''}

Best regards,
${eventName} Team
  `.trim();

  return sendEmail({
    to: data.to_email,
    subject: data.subject,
    html,
    text,
  });
}
