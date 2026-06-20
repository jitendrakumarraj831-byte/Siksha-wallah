import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, course, message } = await req.json();

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone are required." }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const body = `
New Inquiry — Siksha Wallah

Name:    ${name}
Phone:   ${phone}
Email:   ${email || "—"}
Course:  ${course || "—"}

Message:
${message || "—"}
    `.trim();

    await transporter.sendMail({
      from: `"Siksha Wallah Website" <${process.env.GMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.GMAIL_USER,
      subject: `New Inquiry: ${name} — ${course || "General"}`,
      text: body,
      replyTo: email || undefined,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact email error:", err);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
