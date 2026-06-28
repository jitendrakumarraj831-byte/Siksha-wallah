import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, ADMIN_COOKIE } from "@/lib/admin-session";
import { getAdminDb, getAdminInitError } from "@/lib/firebase-admin";
import { isMailerConfigured, verifyMailer, smtpConfigShape } from "@/lib/mailer";

// Cookie-gated diagnostic endpoint. Visit /api/admin/debug while logged in
// to check if Firebase Admin SDK is initialised correctly.
export async function GET(request: NextRequest) {
  const session = await verifyAdminToken(request.cookies.get(ADMIN_COOKIE)?.value);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rawKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const hasSaKey = !!rawKey;
  const saKeyLength = rawKey?.length ?? 0;

  // Inspect the key shape without leaking secrets.
  let keyShape: Record<string, any> = {};
  if (rawKey) {
    const trimmed = rawKey.trim();
    keyShape = {
      startsWith: trimmed.slice(0, 1),
      looksLikeJson: trimmed.startsWith("{"),
      hasEscapedNewlines: rawKey.includes("\\n"),
      hasRealNewlines: /[\n\r]/.test(rawKey),
      mentionsPrivateKey: rawKey.includes("private_key"),
      mentionsClientEmail: rawKey.includes("client_email"),
    };
  }

  let sdkStatus = "not_initialized";
  let sdkError: string | null = null;
  let canRead = false;

  try {
    const db = getAdminDb();
    if (db) {
      sdkStatus = "initialized";
      // Try a lightweight read to confirm connectivity
      await db.collection("activities").limit(1).get();
      canRead = true;
    } else {
      sdkStatus = "init_failed_null";
      sdkError = getAdminInitError();
    }
  } catch (e) {
    sdkStatus = "read_failed";
    sdkError = e instanceof Error ? e.message : String(e);
  }

  // SMTP diagnostics — confirms whether the Titan/SMTP sender can actually
  // connect & authenticate. This is the path used for password-reset and
  // verification emails when configured; if it fails the code falls back to
  // Firebase's built-in sender.
  const smtp = smtpConfigShape();
  let smtpVerify: { ok: boolean; error?: string } = { ok: false, error: "SMTP not configured" };
  if (isMailerConfigured()) {
    smtpVerify = await verifyMailer();
  }

  return NextResponse.json({
    ok: canRead,
    sdkStatus,
    sdkError,
    env: {
      hasSaKey,
      saKeyLength,
      keyShape,
      hasSessionSecret: !!process.env.ADMIN_SESSION_SECRET,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? null,
      nodeEnv: process.env.NODE_ENV,
    },
    smtp: { ...smtp, verify: smtpVerify },
    emailSendPath: isMailerConfigured() && smtpVerify.ok
      ? "SMTP (custom branded email)"
      : "Firebase built-in sender (SMTP unavailable)",
    session: { user: session.u },
  });
}
