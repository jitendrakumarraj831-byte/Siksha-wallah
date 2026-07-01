import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, ADMIN_COOKIE } from "@/lib/admin-session";
import { getAdminDb, isBackendUnavailableError } from "@/lib/firebase-admin";

// DELETE /api/admin/applications — permanently remove a single admission
// application. Cookie-gated (office session). Does not touch the student's
// account or their uploaded documents (those are keyed by uid, not by
// application, and may be shared across other applications).
export async function DELETE(request: NextRequest) {
  const session = await verifyAdminToken(request.cookies.get(ADMIN_COOKIE)?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getAdminDb();
  if (!db) return NextResponse.json({ error: "Admin backend unavailable" }, { status: 503 });

  let body: { id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const id = body.id;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  try {
    await db.collection("course_applications").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Delete failed";
    console.error("admin/applications DELETE error:", msg);
    if (isBackendUnavailableError(e)) {
      return NextResponse.json({ error: "Admin backend unavailable." }, { status: 503 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
