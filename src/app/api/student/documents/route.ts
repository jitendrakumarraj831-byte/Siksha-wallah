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

async function deleteFromCloudinary(publicId: string, resourceType = 'image'): Promise<void> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret || !publicId) return;

  const timestamp = Math.floor(Date.now() / 1000);
  const str = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;

  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-1', encoder.encode(str));
  const signature = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0')).join('');

  const body = new URLSearchParams();
  body.append('public_id', publicId);
  body.append('timestamp', String(timestamp));
  body.append('api_key', apiKey);
  body.append('signature', signature);

  // resourceType is 'image' for jpg/png, 'raw' for pdf (when using auto upload)
  const type = ['image', 'raw', 'video'].includes(resourceType) ? resourceType : 'image';
  await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${type}/destroy`,
    { method: 'POST', body }
  ).catch(() => {});
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

// POST /api/student/documents — save document metadata after Cloudinary upload
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, name, type, url, publicId, resourceType, fileSize, mimeType } = body;
    if (!uid || !name || !type || !url) {
      return NextResponse.json({ error: "uid, name, type, url required" }, { status: 400 });
    }

    const callerUid = await verifyStudent(request);
    if (!callerUid || callerUid !== uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Server-side validation — students upload a single PDF of at most 2 MB.
    // Mirrors the client-side checks so a tampered request can't bypass them.
    const sizeNum = Number(fileSize);
    if (Number.isFinite(sizeNum) && sizeNum > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Please upload a single PDF containing all required documents. Maximum allowed size is 2 MB." },
        { status: 400 },
      );
    }
    const claimedPdf =
      mimeType
        ? mimeType === "application/pdf"
        : (typeof url === "string" && url.toLowerCase().split("?")[0].endsWith(".pdf")) || resourceType === "raw";
    if (!claimedPdf) {
      return NextResponse.json(
        { error: "Only PDF files are allowed. Please upload a single PDF containing all required documents." },
        { status: 400 },
      );
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
      const existingData = existingDoc.data();
      const existingStatus = existingData.status || "pending";
      if (existingStatus === "approved") {
        // Also delete the newly uploaded Cloudinary file since we're rejecting the replacement
        if (publicId) await deleteFromCloudinary(publicId, resourceType);
        return NextResponse.json({ error: "Approved document cannot be replaced. Contact the office." }, { status: 403 });
      }
      // Delete old Cloudinary file before replacing
      if (existingData.publicId) {
        await deleteFromCloudinary(existingData.publicId, existingData.resourceType);
      }
      await existingDoc.ref.delete();
    }

    const ref = await db.collection("documents").add({
      uid, name, type, url,
      publicId: publicId || null,
      resourceType: resourceType || 'image',
      fileSize: fileSize || null,
      mimeType: mimeType || null,
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

    const docData = snap.data()!;
    const docStatus = docData.status || "pending";
    if (docStatus === "approved") {
      return NextResponse.json({ error: "Approved documents cannot be deleted. Contact office." }, { status: 403 });
    }

    // Delete from Cloudinary first
    const body = await request.json().catch(() => ({}));
    const publicId = body.publicId || docData.publicId;
    if (publicId) {
      await deleteFromCloudinary(publicId, docData.resourceType || 'image');
    }

    await docRef.delete();
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
