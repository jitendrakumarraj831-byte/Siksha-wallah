import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, ADMIN_COOKIE } from "@/lib/admin-session";
import { getAdminDb } from "@/lib/firebase-admin";

// Cookie-gated diagnostic endpoint. Visit /api/admin/debug while logged in
// to check if Firebase Admin SDK is initialised correctly.
export async function GET(request: NextRequest) {
  const session = await verifyAdminToken(request.cookies.get(ADMIN_COOKIE)?.value);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hasSaKey = !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const saKeyLength = process.env.FIREBASE_SERVICE_ACCOUNT_KEY?.length ?? 0;

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
    }
  } catch (e) {
    sdkStatus = "read_failed";
    sdkError = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json({
    ok: canRead,
    sdkStatus,
    sdkError,
    env: {
      hasSaKey,
      saKeyLength,
      hasSessionSecret: !!process.env.ADMIN_SESSION_SECRET,
      nodeEnv: process.env.NODE_ENV,
    },
    session: { user: session.u },
  });
}
