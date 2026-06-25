import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, ADMIN_COOKIE } from "@/lib/admin-session";
import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

// Office "online" heartbeat. Every open admin page pings this on an interval; the
// student side reads the result via the public /api/office-status to know whether
// a counsellor is available right now. Cookie-gated + Admin SDK like the rest of
// /api/admin/* — so no Firestore rules change is needed for this collection.
const COLLECTION = "presence";
const DOC = "office";

export async function POST(request: NextRequest) {
  const session = await verifyAdminToken(request.cookies.get(ADMIN_COOKIE)?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getAdminDb();
  if (!db) return NextResponse.json({ error: "Admin backend unavailable" }, { status: 503 });

  try {
    await db.collection(COLLECTION).doc(DOC).set(
      { online: true, lastSeen: FieldValue.serverTimestamp(), by: session.u },
      { merge: true },
    );
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Heartbeat failed";
    console.error("admin/presence error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
