import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp, tooManyRequests } from "@/lib/rate-limit";
import { getAdminAuth } from "@/lib/firebase-admin";
import { isMailerConfigured, sendMail } from "@/lib/mailer";
import { verificationTemplate } from "@/lib/email-templates";

export async function POST(req: NextRequest) {
  const rl = rateLimit(`email-verify:${getClientIp(req)}`, 5, 15 * 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfter);

  const body = await req.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().toLowerCase();
  const name = String(body.name ?? "").trim() || "Student";

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
    const verifyUrl = await adminAuth.generateEmailVerificationLink(email, {
      url: `${siteUrl}/dashboard`,
    });

    const { html, text } = verificationTemplate(name, verifyUrl);

    await sendMail({
      to: email,
      subject: "Siksha Wallah — अपना Email Verify करें",
      html,
      text,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err.code === "auth/user-not-found" || err.code === "auth/invalid-email") {
      return NextResponse.json({ success: true });
    }
    console.error("Email verification send error:", err);
    return NextResponse.json({ error: "Failed to send verification email." }, { status: 500 });
  }
}
