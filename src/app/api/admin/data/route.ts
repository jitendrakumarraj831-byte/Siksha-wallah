import { NextRequest, NextResponse } from "next/server";
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
        const snap = await db.collection("activities").orderBy("createdAt", "desc").limit(200).get();
        return NextResponse.json({ success: true, data: snap.docs.map((d) => ({ id: d.id, ...serialize(d.data()) })) });
      }
      case "students": {
        const [usersSnap, appsSnap] = await Promise.all([
          db.collection("users").where("role", "==", "student").get(),
          db.collection("course_applications").get(),
        ]);
        const apps = appsSnap.docs.map((d) => ({ id: d.id, ...serialize(d.data()) })) as any[];
        const appsByUser: Record<string, any[]> = {};
        for (const a of apps) {
          if (a.userId) (appsByUser[a.userId] ||= []).push(a);
        }
        const students = usersSnap.docs.map((d) => ({
          id: d.id,
          ...serialize(d.data()),
          applications: appsByUser[d.id] || [],
        }));
        return NextResponse.json({ success: true, data: students });
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
