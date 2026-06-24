import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, getAdminAuth } from "@/lib/firebase-admin";

async function verifyStudent(request: NextRequest): Promise<string | null> {
  try {
    const auth = getAdminAuth();
    if (!auth) return null;
    const header = request.headers.get("authorization") || "";
    const token = header.replace("Bearer ", "").trim();
    if (!token) return null;
    const decoded = await auth.verifyIdToken(token);
    return decoded.uid;
  } catch {
    return null;
  }
}

// GET /api/student/applications?uid=xxx
export async function GET(request: NextRequest) {
  try {
    const uid = request.nextUrl.searchParams.get("uid");
    if (!uid) return NextResponse.json({ error: "uid required" }, { status: 400 });

    const callerUid = await verifyStudent(request);
    if (!callerUid || callerUid !== uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getAdminDb();
    if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

    const snap = await db
      .collection("course_applications")
      .where("userId", "==", uid)
      .orderBy("createdAt", "desc")
      .get();

    const apps = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        // Convert Firestore Timestamp to serializable format
        createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : data.createdAt ?? null,
        noteUpdatedAt: data.noteUpdatedAt?.toMillis ? data.noteUpdatedAt.toMillis() : data.noteUpdatedAt ?? null,
      };
    });

    return NextResponse.json({ success: true, data: apps });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
