import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp, tooManyRequests } from "@/lib/rate-limit";
import { isMailerConfigured, sendMail } from "@/lib/mailer";
import { welcomeTemplate } from "@/lib/email-templates";

export async function POST(req: NextRequest) {
  const rl = rateLimit(`welcome:${getClientIp(req)}`, 5, 60 * 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfter);

  const body = await req.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().toLowerCase();
  const name = String(body.name ?? "").trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !name) {
    return NextResponse.json({ error: "Valid email and name required." }, { status: 400 });
  }

  if (!isMailerConfigured()) {
    // Non-fatal: welcome email is nice-to-have, don't block registration
    return NextResponse.json({ success: true });
  }

  try {
    const { html, text } = welcomeTemplate(name, email);
    await sendMail({
      to: email,
      subject: "Siksha Wallah में आपका स्वागत है! 🎉",
      html,
      text,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Welcome email error:", err);
    // Non-fatal — registration already succeeded
    return NextResponse.json({ success: true });
  }
}
