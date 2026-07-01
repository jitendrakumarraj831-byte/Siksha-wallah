import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, ADMIN_COOKIE } from "@/lib/admin-session";
import { getAdminDb, getAdminAuth, isBackendUnavailableError } from "@/lib/firebase-admin";
import { deleteCloudinaryAsset } from "@/lib/cloudinary-admin";

// DELETE /api/admin/students — permanently wipe a student's entire account:
// Firebase Auth login, users/{uid} profile, every course_applications row and
// every documents row (+ their Cloudinary files) tied to that uid. Cookie-gated
// (office session) and irreversible — the UI must confirm before calling this.
export async function DELETE(request: NextRequest) {
  const session = await verifyAdminToken(request.cookies.get(ADMIN_COOKIE)?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getAdminDb();
  if (!db) return NextResponse.json({ error: "Admin backend unavailable" }, { status: 503 });

  let body: { uid?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const uid = body.uid;
  if (!uid) return NextResponse.json({ error: "uid required" }, { status: 400 });

  try {
    const [appsSnap, docsSnap] = await Promise.all([
      db.collection("course_applications").where("userId", "==", uid).get(),
      db.collection("documents").where("uid", "==", uid).get(),
    ]);

    // Best-effort: remove the uploaded files from Cloudinary before dropping
    // the Firestore records that reference them.
    await Promise.all(
      docsSnap.docs.map((d) => {
        const data = d.data();
        return deleteCloudinaryAsset(data.publicId, data.resourceType || "image");
      }),
    );

    const batch = db.batch();
    for (const d of appsSnap.docs) batch.delete(d.ref);
    for (const d of docsSnap.docs) batch.delete(d.ref);
    batch.delete(db.collection("users").doc(uid));
    await batch.commit();

    // Auth deletion is separate — a missing/already-deleted Auth user shouldn't
    // block the Firestore cleanup above from having succeeded.
    let authWarning: string | undefined;
    const auth = getAdminAuth();
    if (auth) {
      try {
        await auth.deleteUser(uid);
      } catch (e: unknown) {
        const code = (e as { code?: string })?.code;
        if (code !== "auth/user-not-found") {
          authWarning = e instanceof Error ? e.message : "Could not delete the login account.";
        }
      }
    }

    return NextResponse.json({
      success: true,
      deletedApplications: appsSnap.size,
      deletedDocuments: docsSnap.size,
      ...(authWarning ? { warning: authWarning } : {}),
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Delete failed";
    console.error("admin/students DELETE error:", msg);
    if (isBackendUnavailableError(e)) {
      return NextResponse.json({ error: "Admin backend unavailable." }, { status: 503 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
