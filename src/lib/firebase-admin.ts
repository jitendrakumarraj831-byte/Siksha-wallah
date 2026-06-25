import { initializeApp, getApps, getApp, cert, applicationDefault, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

// Server-only Firebase Admin SDK. Used by cookie-gated admin API routes to read
// private collections, so Firestore security rules can deny all client reads.
//
// Credentials:
//  - On Firebase App Hosting / GCP: Application Default Credentials (no config).
//  - Elsewhere: set FIREBASE_SERVICE_ACCOUNT_KEY to the service-account JSON.

// Use a named app ("sw-admin") to avoid conflicts with any default-app instance
// that might be left in a partially-initialized state from a previous warm
// serverless invocation (the cause of FUNCTION_INVOCATION_FAILED crashes).
const APP_NAME = "sw-admin";

let cached: Firestore | null = null;
let cachedAuth: Auth | null = null;
let lastInitError: string | null = null;

// Robustly parse the service-account JSON from an env var. Handles:
//  - surrounding single/double quotes
//  - base64-encoded value (some CI setups encode to avoid newline issues)
//  - private_key with escaped "\\n" instead of real newlines
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
    // Retry after re-escaping any bare control characters inside string values.
    parsed = JSON.parse(s.replace(/[\n\r\t]/g, (c) =>
      c === "\n" ? "\\n" : c === "\r" ? "\\r" : "\\t"));
  }

  // Firebase Admin SDK needs actual newlines in the PEM private key.
  if (parsed.private_key && parsed.private_key.includes("\\n")) {
    parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
  }
  return parsed;
}

function getAdminApp(): App {
  // Return existing named app if already initialized.
  try {
    return getApp(APP_NAME);
  } catch {
    /* app not yet initialized — fall through to init */
  }

  const saJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY?.trim();
  if (saJson) {
    return initializeApp({ credential: cert(parseServiceAccount(saJson)) }, APP_NAME);
  }
  return initializeApp({ credential: applicationDefault() }, APP_NAME);
}

export function getAdminDb(): Firestore | null {
  if (cached) return cached;
  try {
    cached = getFirestore(getAdminApp());
    lastInitError = null;
    return cached;
  } catch (e) {
    lastInitError = e instanceof Error ? e.message : String(e);
    console.error("firebase-admin getAdminDb failed:", lastInitError);
    return null;
  }
}

export function getAdminAuth(): Auth | null {
  if (cachedAuth) return cachedAuth;
  try {
    cachedAuth = getAuth(getAdminApp());
    return cachedAuth;
  } catch (e) {
    console.error("firebase-admin getAdminAuth failed:", e instanceof Error ? e.message : e);
    return null;
  }
}

export function getAdminInitError(): string | null {
  return lastInitError;
}

// True when an error means the Admin SDK backend isn't usable (no/invalid
// service-account credentials, no project id). The SDK initialises lazily, so
// these surface at query time rather than at getAdminDb(); routes use this to
// answer 503 "backend unavailable" with a friendly message instead of leaking a
// raw GCP credentials error to the office UI as a 500.
export function isBackendUnavailableError(e: unknown): boolean {
  const msg = (e instanceof Error ? e.message : String(e)).toLowerCase();
  return (
    msg.includes("project id") ||
    msg.includes("default credentials") ||
    msg.includes("credential") ||
    msg.includes("unauthenticated") ||
    msg.includes("could not load") ||
    msg.includes("failed to determine") ||
    msg.includes("getting metadata")
  );
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
