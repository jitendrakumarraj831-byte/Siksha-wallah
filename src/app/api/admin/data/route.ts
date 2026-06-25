import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { verifyAdminToken, ADMIN_COOKIE } from "@/lib/admin-session";
import { getAdminDb, serialize } from "@/lib/firebase-admin";

// Cookie-gated read API for the office dashboard. With this in place, Firestore
// rules can deny all client reads of private collections.
export async function GET(request: NextRequest) {
  try {
    const session = await verifyAdminToken(request.cookies.get(ADMIN_COOKIE)?.value);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: "Admin backend unavailable" }, { status: 503 });
    }

    const type = request.nextUrl.searchParams.get("type");

    switch (type) {
      case "inquiries": {
        const snap = await db.collection("inquiries").orderBy("createdAt", "desc").limit(500).get();
        return NextResponse.json({ success: true, data: snap.docs.map((d) => ({ id: d.id, ...serialize(d.data()) })) });
      }
      case "applications": {
        const snap = await db.collection("course_applications").orderBy("createdAt", "desc").limit(500).get();
        return NextResponse.json({ success: true, data: snap.docs.map((d) => ({ id: d.id, ...serialize(d.data()) })) });
      }
      case "activities": {
        // Paginated: ?limit=200&before=<millis>. `before` pages backward through
        // older activities (range filter on the same field as the orderBy, so no
        // composite index is needed).
        const limitParam = Number(request.nextUrl.searchParams.get("limit"));
        const max = Math.min(Math.max(Number.isFinite(limitParam) ? limitParam : 200, 1), 500);
        const before = Number(request.nextUrl.searchParams.get("before"));
        let q: FirebaseFirestore.Query = db.collection("activities").orderBy("createdAt", "desc");
        if (Number.isFinite(before) && before > 0) {
          q = q.where("createdAt", "<", Timestamp.fromMillis(before));
        }
        const snap = await q.limit(max).get();
        return NextResponse.json({ success: true, data: snap.docs.map((d) => ({ id: d.id, ...serialize(d.data()) })) });
      }
      case "students": {
        const [usersSnap, appsSnap, docsSnap] = await Promise.all([
          db.collection("users").where("role", "==", "student").get(),
          db.collection("course_applications").get(),
          db.collection("documents").get(),
        ]);
        const apps = appsSnap.docs.map((d) => ({ id: d.id, ...serialize(d.data()) })) as any[];
        const appsByUser: Record<string, any[]> = {};
        for (const a of apps) {
          if (a.userId) (appsByUser[a.userId] ||= []).push(a);
        }
        const docsByUser: Record<string, any[]> = {};
        for (const d of docsSnap.docs) {
          const data = serialize(d.data()) as any;
          if (data.uid) (docsByUser[data.uid] ||= []).push({ id: d.id, ...data });
        }
        const students = usersSnap.docs.map((d) => ({
          id: d.id,
          ...serialize(d.data()),
          applications: appsByUser[d.id] || [],
          documents: docsByUser[d.id] || [],
        }));
        return NextResponse.json({ success: true, data: students });
      }
      case "documents": {
        const uid = request.nextUrl.searchParams.get("uid");
        let snap;
        if (uid) {
          snap = await db.collection("documents").where("uid", "==", uid).orderBy("uploadedAt", "desc").get();
        } else {
          snap = await db.collection("documents").orderBy("uploadedAt", "desc").limit(500).get();
        }
        return NextResponse.json({ success: true, data: snap.docs.map((d) => ({ id: d.id, ...serialize(d.data()) })) });
      }
      default:
        return NextResponse.json({ error: "Unknown data type" }, { status: 400 });
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to load data";
    console.error("admin/data error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
