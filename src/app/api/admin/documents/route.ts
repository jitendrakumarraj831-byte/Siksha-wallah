import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { verifyAdminToken, ADMIN_COOKIE } from "@/lib/admin-session";

async function checkAdmin(request: NextRequest): Promise<boolean> {
  const session = await verifyAdminToken(request.cookies.get(ADMIN_COOKIE)?.value).catch(() => null);
  return !!session;
}

// GET /api/admin/documents?uid=xxx (optional uid filter)
export async function GET(request: NextRequest) {
  if (!(await checkAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getAdminDb();
    if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

    const uid = request.nextUrl.searchParams.get("uid");
    let snap;
    if (uid) {
      snap = await db.collection("documents").where("uid", "==", uid).get();
    } else {
      snap = await db.collection("documents").orderBy("uploadedAt", "desc").limit(500).get();
    }

    // Enrich with student name
    const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Batch fetch student names
    const uids = [...new Set(docs.map((d: any) => d.uid))];
    const studentMap: Record<string, string> = {};
    for (const studentUid of uids) {
      try {
        const userSnap = await db.collection("users").doc(studentUid as string).get();
        if (userSnap.exists) {
          const data = userSnap.data();
          studentMap[studentUid as string] = data?.name || data?.email || (studentUid as string);
        }
      } catch {}
    }

    const enriched = docs.map((d: any) => ({
      ...d,
      studentName: studentMap[d.uid] || d.uid,
    }));

    return NextResponse.json({ success: true, data: enriched });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PATCH /api/admin/documents — approve or reject a document
export async function PATCH(request: NextRequest) {
  if (!(await checkAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status, remarks } = body;

    if (!id || !status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "id and valid status required" }, { status: 400 });
    }

    const db = getAdminDb();
    if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

    const docRef = db.collection("documents").doc(id);
    const snap = await docRef.get();
    if (!snap.exists) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const updateData: any = {
      status,
      verifiedAt: Date.now(),
      verifiedBy: "office",
    };
    if (remarks !== undefined) updateData.remarks = remarks;

    await docRef.update(updateData);

    // Create notification for the student
    const docData = snap.data()!;
    try {
      await db.collection("notifications").add({
        uid: docData.uid,
        title: status === "approved"
          ? `Document Approved: ${docData.name}`
          : `Document Rejected: ${docData.name}`,
        message: status === "approved"
          ? `Your ${docData.name} has been verified and approved.`
          : `Your ${docData.name} was rejected. ${remarks ? "Reason: " + remarks : "Please re-upload a clearer copy."}`,
        type: status === "approved" ? "success" : "warning",
        read: false,
        createdAt: Date.now(),
        docId: id,
        docType: docData.type,
      });
    } catch {}

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
