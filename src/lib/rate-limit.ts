// Lightweight in-memory fixed-window rate limiter.
// Note: state is per server instance (resets on cold start). With the project's
// single-instance App Hosting config this is effective; for multi-instance or
// stronger guarantees, back this with Redis/Upstash.

type Entry = { count: number; reset: number };

const store = new Map<string, Entry>();
let lastSweep = 0;

function sweep(now: number) {
  // Opportunistic cleanup so the map can't grow unbounded.
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [k, e] of store) {
    if (now > e.reset) store.delete(k);
  }
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfter: number; // seconds
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const e = store.get(key);
  if (!e || now > e.reset) {
    store.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }
  if (e.count >= limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((e.reset - now) / 1000) };
  }
  e.count++;
  return { ok: true, remaining: limit - e.count, retryAfter: 0 };
}

export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export function tooManyRequests(retryAfter: number): Response {
  return new Response(
    JSON.stringify({ error: "Too many requests. Please try again shortly." }),
    {
      status: 429,
      headers: { "Content-Type": "application/json", "Retry-After": String(retryAfter) },
    },
  );
}
