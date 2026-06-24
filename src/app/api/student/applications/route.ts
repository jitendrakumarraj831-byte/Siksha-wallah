import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, getAdminAuth } from "@/lib/firebase-admin";

async function verifyStudent(request: NextRequest): Promise<{ uid: string; email?: string } | null> {
  try {
    const auth = getAdminAuth();
    if (!auth) return null;
    const header = request.headers.get("authorization") || "";
    const token = header.replace("Bearer ", "").trim();
    if (!token) return null;
    const decoded = await auth.verifyIdToken(token);
    return { uid: decoded.uid, email: decoded.email };
  } catch {
    return null;
  }
}

function serializeDoc(d: FirebaseFirestore.QueryDocumentSnapshot) {
  const data = d.data();
  return {
    id: d.id,
    ...data,
    createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : data.createdAt ?? null,
    noteUpdatedAt: data.noteUpdatedAt?.toMillis ? data.noteUpdatedAt.toMillis() : data.noteUpdatedAt ?? null,
  };
}

// GET /api/student/applications?uid=xxx
export async function GET(request: NextRequest) {
  try {
    const uid = request.nextUrl.searchParams.get("uid");
    if (!uid) return NextResponse.json({ error: "uid required" }, { status: 400 });

    const caller = await verifyStudent(request);
    if (!caller || caller.uid !== uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getAdminDb();
    if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

    // Query 1: applications explicitly linked to this user's UID
    const byUid = await db
      .collection("course_applications")
      .where("userId", "==", uid)
      .orderBy("createdAt", "desc")
      .get();

    const seenIds = new Set<string>();
    const apps: Record<string, any>[] = [];

    for (const d of byUid.docs) {
      seenIds.add(d.id);
      apps.push(serializeDoc(d));
    }

    // Query 2: applications submitted with the same email but WITHOUT a userId
    // (covers the case where the student applied before logging in)
    if (caller.email) {
      const byEmail = await db
        .collection("course_applications")
        .where("email", "==", caller.email)
        .orderBy("createdAt", "desc")
        .get();

      for (const d of byEmail.docs) {
        if (seenIds.has(d.id)) continue;
        const data = d.data();
        // Only include if not already claimed by a different user
        if (!data.userId || data.userId === uid) {
          seenIds.add(d.id);
          apps.push(serializeDoc(d));
          // Backfill userId so future queries pick it up via the primary index
          d.ref.update({ userId: uid }).catch(() => {});
        }
      }
    }

    // Sort merged list by createdAt desc
    apps.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));

    return NextResponse.json({ success: true, data: apps });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
