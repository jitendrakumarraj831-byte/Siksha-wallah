import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp, tooManyRequests } from "@/lib/rate-limit";
import { isMailerConfigured, sendMail, EMAIL_FROM } from "@/lib/mailer";
import { getAdminDb } from "@/lib/firebase-admin";

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

    // Always save to Firestore for admin view
    try {
      const db = getAdminDb();
      if (db) {
        await db.collection("contacts").add({
          name, phone, email: email || null, course: course || null,
          message: message || null, read: false, createdAt: Date.now(),
        });
      }
    } catch (firestoreErr) {
      console.error("Contact Firestore save error:", firestoreErr instanceof Error ? firestoreErr.message : firestoreErr);
    }

    if (!isMailerConfigured()) {
      return NextResponse.json({ success: true });
    }

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

    const contactTo = process.env.CONTACT_EMAIL || EMAIL_FROM();

    await sendMail({
      to: contactTo,
      subject: `New Inquiry: ${name} — ${course || "General"}`,
      html: `<pre style="font-family:monospace;font-size:14px;">${bodyText}</pre>`,
      text: bodyText,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact email error:", err);
    return NextResponse.json({ error: "Failed to send message. Please try calling us directly." }, { status: 500 });
  }
}
