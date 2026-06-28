import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

// Public read of the office "online" status — just whether a counsellor is
// available, so no auth required. Backed by the `presence/office` doc that the
// office heartbeat (/api/admin/presence) keeps fresh. "Online" = seen recently.
export const dynamic = "force-dynamic";

const ONLINE_WINDOW_MS = 2 * 60 * 1000; // heartbeat is ~45s → 2 missed beats tolerance
const CACHE_MS = 15 * 1000; // serve a memoised result for 15s between Firestore reads

// CDN/browser cache so the many polling clients are served from the edge instead
// of invoking this function (and reading Firestore) on every single request.
const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=15, s-maxage=15, stale-while-revalidate=30",
};

// Module-scoped memo — shared across warm invocations on the same instance, so
// a burst of polls collapses to a single Firestore read per CACHE_MS window.
let memo: { lastSeen: number | null; ts: number } | null = null;

export async function GET() {
  const now = Date.now();

  if (memo && now - memo.ts < CACHE_MS) {
    const online = !!memo.lastSeen && now - memo.lastSeen < ONLINE_WINDOW_MS;
    return NextResponse.json({ online, lastSeen: memo.lastSeen }, { headers: CACHE_HEADERS });
  }

  const db = getAdminDb();
  if (!db) return NextResponse.json({ online: false, lastSeen: null });

  try {
    const snap = await db.collection("presence").doc("office").get();
    const data = snap.data();
    const lastSeen =
      data?.lastSeen && typeof data.lastSeen.toMillis === "function" ? data.lastSeen.toMillis() : null;
    memo = { lastSeen, ts: now };
    const online = !!lastSeen && now - lastSeen < ONLINE_WINDOW_MS;
    return NextResponse.json({ online, lastSeen }, { headers: CACHE_HEADERS });
  } catch (e: unknown) {
    console.error("office-status error:", e instanceof Error ? e.message : e);
    return NextResponse.json({ online: false, lastSeen: null });
  }
}
