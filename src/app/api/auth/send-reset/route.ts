import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp, tooManyRequests } from "@/lib/rate-limit";
import { getAdminAuth } from "@/lib/firebase-admin";
import { isMailerConfigured, sendMail } from "@/lib/mailer";
import { passwordResetTemplate } from "@/lib/email-templates";

export async function POST(req: NextRequest) {
  const rl = rateLimit(`pwd-reset:${getClientIp(req)}`, 5, 15 * 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfter);

  const body = await req.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email address required." }, { status: 400 });
  }

  if (!isMailerConfigured()) {
    // SMTP not configured — tell client to fall back to Firebase built-in.
    return NextResponse.json({ success: false, useFirebase: true });
  }

  const adminAuth = getAdminAuth();
  if (!adminAuth) {
    // Admin SDK not available — tell client to fall back to Firebase built-in.
    return NextResponse.json({ success: false, useFirebase: true });
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://sikshawallahfbg.in").replace(/\/$/, "");

  try {
    const actionUrl = await adminAuth.generatePasswordResetLink(email, {
      url: `${siteUrl}/auth/login`,
    });

    const parsed = new URL(actionUrl);
    const oobCode = parsed.searchParams.get("oobCode");
    const resetUrl = oobCode
      ? `${siteUrl}/auth/reset-password?oobCode=${encodeURIComponent(oobCode)}`
      : actionUrl;

    const { html, text } = passwordResetTemplate(resetUrl);

    await sendMail({
      to: email,
      subject: "Siksha Wallah — Password Reset Link",
      html,
      text,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    // Don't reveal whether an account exists — treat unknown email as success.
    if (err.code === "auth/user-not-found" || err.code === "auth/invalid-email") {
      return NextResponse.json({ success: true });
    }
    // SMTP send or admin link generation failed for some other reason. Rather
    // than a hard 500, tell the client to fall back to Firebase's built-in
    // sender so the user still receives a working reset link seamlessly.
    console.error("Password reset (SMTP route) failed, falling back to Firebase:", err);
    return NextResponse.json({ success: false, useFirebase: true });
  }
}
