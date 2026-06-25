import { NextRequest, NextResponse } from "next/server";
import { signAdminToken, ADMIN_COOKIE } from "@/lib/admin-session";
import { rateLimit, getClientIp, tooManyRequests } from "@/lib/rate-limit";

// Server-side credentials — NOT exposed to the browser (no NEXT_PUBLIC_).
//
// SECURITY: we never ship a working credential to production. In production the
// office login is DISABLED until ADMIN_USERNAME and ADMIN_PASSWORD are set in
// the server environment (fail closed) — far safer than accepting a default
// password that is visible in the public source. A zero-config fallback is kept
// for local development only so `npm run dev` works with no setup.
const DEV_FALLBACK = { username: "admin", password: "Siksha@2025!" };

function getConfiguredCredentials(): { username: string; password: string } | null {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (username && password) return { username, password };
  if (process.env.NODE_ENV !== "production") return DEV_FALLBACK;
  return null; // production + unconfigured → login disabled
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function POST(request: NextRequest) {
  // Brute-force protection: 5 attempts / 5 min per IP.
  const ip = getClientIp(request);
  const rl = rateLimit(`admin-login:${ip}`, 5, 5 * 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfter);

  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const username = String(body.username ?? "").trim();
  const password = String(body.password ?? "");

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
  }

  const creds = getConfiguredCredentials();
  if (!creds) {
    console.error(
      "Admin login is disabled: ADMIN_USERNAME and ADMIN_PASSWORD are not set in the production environment.",
    );
    return NextResponse.json(
      { error: "Office login is not configured yet. Please set ADMIN_USERNAME and ADMIN_PASSWORD in the server environment, then redeploy." },
      { status: 503 },
    );
  }

  const valid = safeEqual(username, creds.username) && safeEqual(password, creds.password);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await signAdminToken(username);
  const res = NextResponse.json({ success: true, user: username });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60,
  });
  return res;
}
