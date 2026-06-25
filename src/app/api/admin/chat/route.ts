import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, ADMIN_COOKIE } from "@/lib/admin-session";
import { getAdminDb, serialize, isBackendUnavailableError } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

const BACKEND_DOWN_MSG = "Admin backend unavailable. Check FIREBASE_SERVICE_ACCOUNT_KEY (see /api/admin/debug).";

// Cookie-gated chat API for the office dashboard. Students read/write their own
// thread directly via the client SDK; the office side goes through here (Admin
// SDK) because the admin login is a signed cookie, not a Firebase auth user.
const COLLECTION = "messages";

export async function GET(request: NextRequest) {
  const session = await verifyAdminToken(request.cookies.get(ADMIN_COOKIE)?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getAdminDb();
  if (!db) return NextResponse.json({ error: "Admin backend unavailable" }, { status: 503 });

  const studentId = request.nextUrl.searchParams.get("studentId");

  try {
    if (studentId) {
      // One conversation thread (oldest → newest). Single-field where → no index.
      const snap = await db.collection(COLLECTION).where("studentId", "==", studentId).get();
      const messages = snap.docs
        .map((d) => ({ id: d.id, ...serialize(d.data()) }))
        .sort((a: any, b: any) => (a.createdAt || 0) - (b.createdAt || 0));

      // Mark the student's messages as read by the office.
      const batch = db.batch();
      let dirty = false;
      for (const d of snap.docs) {
        const data = d.data();
        if (data.sender === "student" && !data.readByAdmin) {
          batch.update(d.ref, { readByAdmin: true });
          dirty = true;
        }
      }
      if (dirty) await batch.commit();

      return NextResponse.json({ success: true, data: messages });
    }

    // Conversation list: latest message + unread count, grouped per student.
    const snap = await db.collection(COLLECTION).orderBy("createdAt", "desc").limit(2000).get();
    const convs: Record<string, any> = {};
    for (const d of snap.docs) {
      const m = serialize(d.data()) as any;
      const sid = m.studentId;
      if (!sid) continue;
      if (!convs[sid]) {
        convs[sid] = {
          studentId: sid,
          studentName: m.studentName || "Student",
          studentEmail: m.studentEmail || "",
          lastMessage: m.text || "",
          lastSender: m.sender,
          lastAt: m.createdAt || 0,
          unread: 0,
        };
      }
      if (m.sender === "student" && !m.readByAdmin) convs[sid].unread += 1;
    }
    const list = Object.values(convs).sort((a: any, b: any) => (b.lastAt || 0) - (a.lastAt || 0));
    return NextResponse.json({ success: true, data: list });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to load messages";
    console.error("admin/chat GET error:", msg);
    if (isBackendUnavailableError(e)) return NextResponse.json({ error: BACKEND_DOWN_MSG }, { status: 503 });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await verifyAdminToken(request.cookies.get(ADMIN_COOKIE)?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getAdminDb();
  if (!db) return NextResponse.json({ error: "Admin backend unavailable" }, { status: 503 });

  let body: { studentId?: string; studentName?: string; text?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const studentId = String(body.studentId ?? "").trim();
  const text = String(body.text ?? "").trim().slice(0, 2000);
  if (!studentId || !text) {
    return NextResponse.json({ error: "studentId and text are required" }, { status: 400 });
  }

  try {
    await db.collection(COLLECTION).add({
      studentId,
      studentName: String(body.studentName ?? "Student").slice(0, 120),
      sender: "admin",
      text,
      readByAdmin: true,
      readByStudent: false,
      createdAt: FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Send failed";
    console.error("admin/chat POST error:", msg);
    if (isBackendUnavailableError(e)) return NextResponse.json({ error: BACKEND_DOWN_MSG }, { status: 503 });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
