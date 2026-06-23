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

// Robustly parse the service-account JSON from an env var. Vercel/CI paste
// quirks we defend against:
//  - surrounding single/double quotes around the whole value
//  - the JSON base64-encoded (some setups encode to avoid newline issues)
//  - private_key stored with escaped "\\n" instead of real newlines
//  - literal newlines inside the JSON string that break JSON.parse
function parseServiceAccount(raw: string): Record<string, any> {
  let s = raw.trim();

  // Strip a single pair of surrounding quotes if present.
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }

  // If it doesn't look like JSON, try base64-decoding it.
  if (!s.startsWith("{")) {
    try {
      const decoded = Buffer.from(s, "base64").toString("utf8").trim();
      if (decoded.startsWith("{")) s = decoded;
    } catch {
      /* not base64 — fall through */
    }
  }

  let parsed: Record<string, any>;
  try {
    parsed = JSON.parse(s);
  } catch {
    // JSON.parse fails when private_key contains real (unescaped) newlines.
    // Re-escape control characters inside string literals, then retry.
    parsed = JSON.parse(s.replace(/[\n\r\t]/g, (c) =>
      c === "\n" ? "\\n" : c === "\r" ? "\\r" : "\\t"));
  }

  // Firebase Admin SDK needs real newlines in the PEM private key.
  if (parsed.private_key && parsed.private_key.includes("\\n")) {
    parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
  }
  return parsed;
}

function getAdminApp(): App {
  if (getApps().length) return getApp();
  const saJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY?.trim();
  if (saJson) {
    return initializeApp({ credential: cert(parseServiceAccount(saJson)) });
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
