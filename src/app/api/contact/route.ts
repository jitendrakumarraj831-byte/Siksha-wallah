import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { rateLimit, getClientIp, tooManyRequests } from "@/lib/rate-limit";

function sanitize(value: unknown): string {
  return String(value ?? "").replace(/[<>]/g, "").trim().slice(0, 500);
}

export async function POST(req: NextRequest) {
  // Abuse protection: 5 submissions / 10 min per IP.
  const rl = rateLimit(`contact:${getClientIp(req)}`, 5, 10 * 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfter);

  try {
    const body = await req.json();
    const name = sanitize(body.name);
    const phone = sanitize(body.phone);
    const email = sanitize(body.email);
    const course = sanitize(body.course);
    const message = sanitize(body.message);

    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Valid name is required." }, { status: 400 });
    }
    if (!phone || !/^\d{10}$/.test(phone.replace(/\s/g, ""))) {
      return NextResponse.json({ error: "Valid 10-digit phone number is required." }, { status: 400 });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailPass) {
      console.warn("Email not configured — logging inquiry instead");
      return NextResponse.json({ success: true });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
    });

    const bodyText = [
      "New Inquiry — Siksha Wallah",
      "",
      `Name:    ${name}`,
      `Phone:   ${phone}`,
      `Email:   ${email || "—"}`,
      `Course:  ${course || "—"}`,
      "",
      "Message:",
      message || "—",
    ].join("\n");

    await transporter.sendMail({
      from: `"Siksha Wallah Website" <${gmailUser}>`,
      to: process.env.CONTACT_EMAIL || gmailUser,
      subject: `New Inquiry: ${name} — ${course || "General"}`,
      text: bodyText,
      replyTo: email || undefined,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact email error:", err);
    return NextResponse.json({ error: "Failed to send message. Please try calling us directly." }, { status: 500 });
  }
}
