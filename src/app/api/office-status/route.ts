import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

// Public read of the office "online" status — just whether a counsellor is
// available, so no auth required. Backed by the `presence/office` doc that the
// office heartbeat (/api/admin/presence) keeps fresh. "Online" = seen recently.
export const dynamic = "force-dynamic";

const ONLINE_WINDOW_MS = 2 * 60 * 1000; // heartbeat is ~45s → 2 missed beats tolerance

export async function GET() {
  const db = getAdminDb();
  if (!db) return NextResponse.json({ online: false, lastSeen: null });

  try {
    const snap = await db.collection("presence").doc("office").get();
    const data = snap.data();
    const lastSeen =
      data?.lastSeen && typeof data.lastSeen.toMillis === "function" ? data.lastSeen.toMillis() : null;
    const online = !!lastSeen && Date.now() - lastSeen < ONLINE_WINDOW_MS;
    return NextResponse.json({ online, lastSeen });
  } catch (e: unknown) {
    console.error("office-status error:", e instanceof Error ? e.message : e);
    return NextResponse.json({ online: false, lastSeen: null });
  }
}
