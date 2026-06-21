// HMAC-signed admin session token. Verifiable in both the Edge runtime
// (middleware) and the Node runtime (route handlers) via the Web Crypto API,
// so the admin session cookie cannot be forged from the browser/DevTools.

const encoder = new TextEncoder();

export const ADMIN_COOKIE = "sw_admin_session";

function getSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (s && s.length >= 16) return s;
  // Dev-only fallback. Production MUST set ADMIN_SESSION_SECRET (>= 16 chars).
  if (process.env.NODE_ENV === "production") {
    console.error(
      "ADMIN_SESSION_SECRET is not set — admin sessions are insecure. Set it in your environment.",
    );
  }
  return "dev-insecure-admin-secret-change-me";
}

function base64url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let str = "";
  for (const b of arr) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlToString(b64: string): string {
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  return atob(b64.replace(/-/g, "+").replace(/_/g, "/") + pad);
}

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return base64url(sig);
}

export interface AdminSession {
  u: string;
  exp: number;
}

export async function signAdminToken(
  username: string,
  ttlMs = 24 * 60 * 60 * 1000,
): Promise<string> {
  const payload: AdminSession = { u: username, exp: Date.now() + ttlMs };
  const body = base64url(encoder.encode(JSON.stringify(payload)));
  const sig = await hmac(body);
  return `${body}.${sig}`;
}

export async function verifyAdminToken(
  token?: string | null,
): Promise<AdminSession | null> {
  if (!token || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;

  const expected = await hmac(body);
  // Constant-time comparison.
  if (sig.length !== expected.length) return null;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  if (diff !== 0) return null;

  try {
    const payload = JSON.parse(base64urlToString(body)) as AdminSession;
    if (!payload?.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}
