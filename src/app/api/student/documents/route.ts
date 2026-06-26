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

// GET /api/student/documents?uid=xxx
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
    const { uid, name, type, url, storagePath, fileSize, mimeType } = body;
    if (!uid || !name || !type || !url) {
      return NextResponse.json({ error: "uid, name, type, url required" }, { status: 400 });
    }

    const callerUid = await verifyStudent(request);
    if (!callerUid || callerUid !== uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getAdminDb();
    if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

    // Check if a document of the same type already exists for this student
    const existing = await db.collection("documents")
      .where("uid", "==", uid)
      .where("type", "==", type)
      .get();

    // If replacing, only allow replacing rejected or pending documents
    if (!existing.empty) {
      const existingDoc = existing.docs[0];
      const existingStatus = existingDoc.data().status || "pending";
      if (existingStatus === "approved") {
        return NextResponse.json({ error: "Approved document cannot be replaced. Contact the office." }, { status: 403 });
      }
      // Delete the old doc record before saving new one
      await existingDoc.ref.delete();
    }

    const ref = await db.collection("documents").add({
      uid, name, type, url, storagePath: storagePath || null,
      fileSize: fileSize || null, mimeType: mimeType || null,
      status: "pending",
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

    const docStatus = snap.data()?.status || "pending";
    if (docStatus === "approved") {
      return NextResponse.json({ error: "Approved documents cannot be deleted. Contact office." }, { status: 403 });
    }

    await docRef.delete();
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
