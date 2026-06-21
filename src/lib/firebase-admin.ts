import { initializeApp, getApps, getApp, cert, applicationDefault, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

// Server-only Firebase Admin SDK. Used by cookie-gated admin API routes to read
// private collections, so Firestore security rules can deny all client reads.
//
// Credentials:
//  - On Firebase App Hosting / GCP: Application Default Credentials (no config).
//  - Elsewhere: set FIREBASE_SERVICE_ACCOUNT_KEY to the service-account JSON.

let cached: Firestore | null = null;

export function getAdminDb(): Firestore | null {
  if (cached) return cached;
  try {
    let app: App;
    if (getApps().length) {
      app = getApp();
    } else {
      const saJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
      app = saJson
        ? initializeApp({ credential: cert(JSON.parse(saJson)) })
        : initializeApp({ credential: applicationDefault() });
    }
    cached = getFirestore(app);
    return cached;
  } catch (e) {
    console.error("firebase-admin init failed (falling back to client SDK):", e);
    return null;
  }
}

// Convert Firestore Timestamp fields to epoch millis so the client can render
// them with `new Date(number)` (admin Timestamps don't survive JSON intact).
export function serialize<T extends Record<string, any>>(data: T): T {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(data)) {
    out[k] = v && typeof v === "object" && typeof v.toMillis === "function" ? v.toMillis() : v;
  }
  return out as T;
}
