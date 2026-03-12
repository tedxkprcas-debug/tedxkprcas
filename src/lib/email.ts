// Email Service using SMTP (Nodemailer) via Supabase Edge Function
// Admin configures SMTP settings in Admin → Email tab

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

// Send email via Supabase Edge Function
async function sendEmail(data: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  try {
    const { data: response, error } = await supabase.functions.invoke("send-email", {
      body: data,
    });

    if (error) throw error;
    
    console.log("✅ Email sent successfully:", response);
    return { success: true, response };
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    return { success: false, error };
  }
}

// Send registration confirmation email
export async function sendConfirmationEmail(
  _config: any, // Kept for backward compatibility, config is now fetched server-side
  data: {
    to_email: string;
    to_name: string;
    registration_code: string;
    event_name?: string;
    event_date?: string;
    payment_status: string;
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
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .code-box { background: #000; color: #e62b1e; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px; border-radius: 8px; margin: 20px 0; }
    .steps { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .steps h3 { color: #e62b1e; margin-top: 0; }
    .steps ol { padding-left: 20px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
    .status { display: inline-block; padding: 5px 15px; border-radius: 20px; background: #fef3c7; color: #92400e; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎤 ${eventName}</h1>
      <p>Registration Confirmation</p>
    </div>
    <div class="content">
      <p>Dear <strong>${data.to_name}</strong>,</p>
      <p>Thank you for registering for <strong>${eventName}</strong>!</p>
      
      <p><strong>Payment Status:</strong> <span class="status">${data.payment_status}</span></p>
      
      <div class="code-box">
        ${data.registration_code}
      </div>
      <p style="text-align: center; color: #666; font-size: 14px;">Your Registration Code</p>
      
      <div class="steps">
        <h3>📋 What happens next?</h3>
        <ol>
          <li>Our team will verify your payment screenshot</li>
          <li>Once verified, you will receive your event ticket via email</li>
          <li>Keep your registration code safe - you'll need it at the event</li>
          <li>For any queries, contact us at tedxkprcas@gmail.com</li>
        </ol>
      </div>
      
      <p>We look forward to seeing you at the event!</p>
      <p>Best regards,<br><strong>${eventName} Team</strong></p>
    </div>
    <div class="footer">
      <p>This is an automated email. Please do not reply directly.</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
Dear ${data.to_name},

Thank you for registering for ${eventName}!

Your Registration Code: ${data.registration_code}
Payment Status: ${data.payment_status}

What happens next:
1. Our team will verify your payment screenshot
2. Once verified, you will receive your event ticket via email
3. Keep your registration code safe - you'll need it at the event
4. For any queries, contact us at tedxkprcas@gmail.com

We look forward to seeing you at the event!

Best regards,
${eventName} Team
  `.trim();

  return sendEmail({
    to: data.to_email,
    subject: `🎫 Registration Confirmed - ${eventName} | Code: ${data.registration_code}`,
    html,
    text,
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
