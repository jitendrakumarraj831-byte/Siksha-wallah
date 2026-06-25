import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, ADMIN_COOKIE } from "@/lib/admin-session";
import { getAdminDb, isBackendUnavailableError } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

// Cookie-gated write API for the office dashboard (status/note updates), so
// Firestore rules can deny client writes to private collections.

const ALLOWED = {
  inquiries: { statuses: ["pending", "called", "admission_done"] },
  course_applications: {
    statuses: ["new", "contacted", "documents_pending", "admission_done", "not_interested"],
  },
} as const;

type Coll = keyof typeof ALLOWED;

export async function POST(request: NextRequest) {
  const session = await verifyAdminToken(request.cookies.get(ADMIN_COOKIE)?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getAdminDb();
  if (!db) return NextResponse.json({ error: "Admin backend unavailable" }, { status: 503 });

  let body: { collection?: string; id?: string; status?: string; note?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { collection, id, status, note } = body;
  if (!collection || !id || !(collection in ALLOWED)) {
    return NextResponse.json({ error: "Invalid collection or id" }, { status: 400 });
  }

  const update: Record<string, unknown> = {};
  if (status !== undefined) {
    if (!ALLOWED[collection as Coll].statuses.includes(status as never)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    update.status = status;
  }
  if (note !== undefined) {
    update.note = String(note).slice(0, 2000);
    update.noteUpdatedAt = FieldValue.serverTimestamp();
  }
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  try {
    await db.collection(collection).doc(id).update(update);
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Update failed";
    console.error("admin/update error:", msg);
    if (isBackendUnavailableError(e)) {
      return NextResponse.json({ error: "Admin backend unavailable. Check FIREBASE_SERVICE_ACCOUNT_KEY (see /api/admin/debug)." }, { status: 503 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
