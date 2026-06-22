import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { rateLimit, getClientIp, tooManyRequests } from "@/lib/rate-limit";
import { getAdminAuth } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  const rl = rateLimit(`pwd-reset:${getClientIp(req)}`, 5, 15 * 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfter);

  const body = await req.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email address required." }, { status: 400 });
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://sikshawallahfbg.in").replace(/\/$/, "");

  if (!gmailUser || !gmailPass) {
    return NextResponse.json({ error: "Email service not configured." }, { status: 500 });
  }

  const adminAuth = getAdminAuth();
  if (!adminAuth) {
    return NextResponse.json({ error: "Auth service not available." }, { status: 500 });
  }

  try {
    // Generate secure reset link via Firebase Admin (no email sent by Firebase)
    const actionUrl = await adminAuth.generatePasswordResetLink(email, {
      url: `${siteUrl}/auth/login`,
    });

    // Extract oobCode and build a direct app URL so user lands on our reset page
    const parsed = new URL(actionUrl);
    const oobCode = parsed.searchParams.get("oobCode");
    const resetUrl = oobCode
      ? `${siteUrl}/auth/reset-password?oobCode=${encodeURIComponent(oobCode)}`
      : actionUrl;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
    });

    const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#f59e0b,#f97316);padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:-0.5px;">SIKSHA WALLAH</h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px;letter-spacing:0.05em;">शिक्षा का सही रास्ता</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <h2 style="margin:0 0 12px;color:#1e293b;font-size:22px;font-weight:700;">Reset Your Password</h2>
            <p style="margin:0 0 20px;color:#475569;font-size:15px;line-height:1.6;">
              We received a request to reset the password for your Siksha Wallah account. Click the button below to set a new password.
            </p>
            <div style="text-align:center;margin:28px 0;">
              <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#f97316);color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:14px 36px;border-radius:10px;letter-spacing:0.02em;">
                Reset My Password
              </a>
            </div>
            <p style="margin:0 0 8px;color:#64748b;font-size:13px;line-height:1.6;">
              This link will expire in <strong>1 hour</strong>. If you didn't request a password reset, you can safely ignore this email — your account remains secure.
            </p>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
            <p style="margin:0;color:#94a3b8;font-size:12px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${resetUrl}" style="color:#f97316;word-break:break-all;">${resetUrl}</a>
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="margin:0;color:#94a3b8;font-size:12px;">
              © ${new Date().getFullYear()} Siksha Wallah. All rights reserved.<br>
              This is an automated message — please do not reply.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const text = `Reset Your Siksha Wallah Password\n\nClick the link below to reset your password:\n${resetUrl}\n\nThis link expires in 1 hour. If you didn't request this, ignore this email.\n\n© ${new Date().getFullYear()} Siksha Wallah`;

    await transporter.sendMail({
      from: `"Siksha Wallah" <${gmailUser}>`,
      to: email,
      subject: "Reset Your Siksha Wallah Password",
      html,
      text,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    // Don't reveal whether the email exists — always return success for security
    if (err.code === "auth/user-not-found" || err.code === "auth/invalid-email") {
      return NextResponse.json({ success: true });
    }
    console.error("Password reset error:", err);
    return NextResponse.json({ error: "Failed to send reset email. Please try again." }, { status: 500 });
  }
}
