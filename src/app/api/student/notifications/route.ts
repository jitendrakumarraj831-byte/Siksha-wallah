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

// GET /api/student/notifications?uid=xxx
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

    const snap = await db.collection("notifications")
      .where("uid", "==", uid)
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    const notifications = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ success: true, data: notifications });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PATCH /api/student/notifications — mark as read
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, id, markAllRead } = body;

    if (!uid) return NextResponse.json({ error: "uid required" }, { status: 400 });

    const callerUid = await verifyStudent(request);
    if (!callerUid || callerUid !== uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getAdminDb();
    if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

    if (markAllRead) {
      const snap = await db.collection("notifications")
        .where("uid", "==", uid)
        .where("read", "==", false)
        .get();
      const batch = db.batch();
      snap.docs.forEach((d) => batch.update(d.ref, { read: true }));
      await batch.commit();
    } else if (id) {
      const docRef = db.collection("notifications").doc(id);
      const snap = await docRef.get();
      if (snap.exists && snap.data()?.uid === uid) {
        await docRef.update({ read: true });
      }
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
