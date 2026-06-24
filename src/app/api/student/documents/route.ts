import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, getAdminAuth } from "@/lib/firebase-admin";

// Verify the student's Firebase ID token from Authorization header
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

// GET /api/student/documents?uid=xxx  — returns documents for that student
export async function GET(request: NextRequest) {
  try {
    const uid = request.nextUrl.searchParams.get("uid");
    if (!uid) return NextResponse.json({ error: "uid required" }, { status: 400 });

    // Verify the caller owns this uid
    const callerUid = await verifyStudent(request);
    if (!callerUid || callerUid !== uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getAdminDb();
    if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

    const snap = await db.collection("documents").where("uid", "==", uid).get();
    const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ success: true, data: docs });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST /api/student/documents — save document metadata after Storage upload
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid } = body;
    if (!uid) return NextResponse.json({ error: "uid required" }, { status: 400 });

    const callerUid = await verifyStudent(request);
    if (!callerUid || callerUid !== uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getAdminDb();
    if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

    const ref = await db.collection("documents").add({
      ...body,
      uploadedAt: Date.now(),
    });
    return NextResponse.json({ success: true, id: ref.id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE /api/student/documents?id=xxx&uid=xxx
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    const uid = request.nextUrl.searchParams.get("uid");
    if (!id || !uid) return NextResponse.json({ error: "id and uid required" }, { status: 400 });

    const callerUid = await verifyStudent(request);
    if (!callerUid || callerUid !== uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getAdminDb();
    if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

    const docRef = db.collection("documents").doc(id);
    const snap = await docRef.get();
    if (!snap.exists || snap.data()?.uid !== uid) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    await docRef.delete();
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
