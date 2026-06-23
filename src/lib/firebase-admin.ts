import { initializeApp, getApps, getApp, cert, applicationDefault, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

// Server-only Firebase Admin SDK. Used by cookie-gated admin API routes to read
// private collections, so Firestore security rules can deny all client reads.
//
// Credentials:
//  - On Firebase App Hosting / GCP: Application Default Credentials (no config).
//  - Elsewhere: set FIREBASE_SERVICE_ACCOUNT_KEY to the service-account JSON.

let cached: Firestore | null = null;
let cachedAuth: Auth | null = null;

function getAdminApp(): App {
  if (getApps().length) return getApp();
  const saJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY?.trim();
  if (saJson) {
    const parsed = JSON.parse(saJson);
    // Vercel sometimes stores private_key with escaped newlines (\\n instead of \n).
    // Firebase Admin SDK requires actual newline characters in the PEM key.
    if (parsed.private_key && !parsed.private_key.includes("\n")) {
      parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
    }
    return initializeApp({ credential: cert(parsed) });
  }
  return initializeApp({ credential: applicationDefault() });
}

export function getAdminDb(): Firestore | null {
  if (cached) return cached;
  try {
    cached = getFirestore(getAdminApp());
    return cached;
  } catch (e) {
    console.error("firebase-admin init failed (falling back to client SDK):", e);
    return null;
  }
}

export function getAdminAuth(): Auth | null {
  if (cachedAuth) return cachedAuth;
  try {
    cachedAuth = getAuth(getAdminApp());
    return cachedAuth;
  } catch (e) {
    console.error("firebase-admin auth init failed:", e);
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
