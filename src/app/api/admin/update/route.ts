import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, ADMIN_COOKIE } from "@/lib/admin-session";
import { getAdminDb, isBackendUnavailableError } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

// Cookie-gated write API for the office dashboard (status/note updates), so
// Firestore rules can deny client writes to private collections.

const ALLOWED = {
  inquiries: { statuses: ["pending", "called", "admission_done"] },
  course_applications: {
    statuses: ["new", "contacted", "documents_pending", "admission_done", "not_interested"],
  },
} as const;

const PAYMENT_STATUSES = ["pending", "partial", "paid"] as const;
const MAX_AMOUNT = 100_000_000; // sanity ceiling, not a business rule

type Coll = keyof typeof ALLOWED;

export async function POST(request: NextRequest) {
  const session = await verifyAdminToken(request.cookies.get(ADMIN_COOKIE)?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getAdminDb();
  if (!db) return NextResponse.json({ error: "Admin backend unavailable" }, { status: 503 });

  let body: {
    collection?: string; id?: string; status?: string; note?: string;
    paymentStatus?: string; amountPaid?: number; amountDue?: number;
    paymentDate?: string; paymentMode?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { collection, id, status, note, paymentStatus, amountPaid, amountDue, paymentDate, paymentMode } = body;
  if (!collection || !id || !(collection in ALLOWED)) {
    return NextResponse.json({ error: "Invalid collection or id" }, { status: 400 });
  }

  const update: Record<string, unknown> = {};
  if (status !== undefined) {
    if (!ALLOWED[collection as Coll].statuses.includes(status as never)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    update.status = status;
  }
  if (note !== undefined) {
    update.note = String(note).slice(0, 2000);
    update.noteUpdatedAt = FieldValue.serverTimestamp();
  }

  // Payment fields — course_applications only; office-only writes, students
  // never call this endpoint (see /api/student/applications, read-only).
  if (collection === "course_applications") {
    let touchedPayment = false;
    if (paymentStatus !== undefined) {
      if (!PAYMENT_STATUSES.includes(paymentStatus as never)) {
        return NextResponse.json({ error: "Invalid payment status" }, { status: 400 });
      }
      update.paymentStatus = paymentStatus;
      touchedPayment = true;
    }
    if (amountPaid !== undefined) {
      const n = Number(amountPaid);
      if (!Number.isFinite(n) || n < 0 || n > MAX_AMOUNT) {
        return NextResponse.json({ error: "Invalid amount paid" }, { status: 400 });
      }
      update.amountPaid = n;
      touchedPayment = true;
    }
    if (amountDue !== undefined) {
      const n = Number(amountDue);
      if (!Number.isFinite(n) || n < 0 || n > MAX_AMOUNT) {
        return NextResponse.json({ error: "Invalid amount due" }, { status: 400 });
      }
      update.amountDue = n;
      touchedPayment = true;
    }
    if (paymentDate !== undefined) {
      update.paymentDate = String(paymentDate).slice(0, 40);
      touchedPayment = true;
    }
    if (paymentMode !== undefined) {
      update.paymentMode = String(paymentMode).slice(0, 60);
      touchedPayment = true;
    }
    if (touchedPayment) update.paymentUpdatedAt = FieldValue.serverTimestamp();
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  try {
    await db.collection(collection).doc(id).update(update);
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Update failed";
    console.error("admin/update error:", msg);
    if (isBackendUnavailableError(e)) {
      return NextResponse.json({ error: "Admin backend unavailable. Check FIREBASE_SERVICE_ACCOUNT_KEY (see /api/admin/debug)." }, { status: 503 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
