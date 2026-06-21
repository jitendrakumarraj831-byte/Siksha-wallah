// Client helpers for the office dashboard. They prefer the cookie-gated server
// API (which uses firebase-admin and works once Firestore rules are locked) and
// fall back to the direct client-SDK call so the dashboard keeps working before
// the rules migration is completed. See SECURITY.md.

export async function adminFetchData<T>(type: string, fallback: () => Promise<T>): Promise<T> {
  try {
    const res = await fetch(`/api/admin/data?type=${type}`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      if (json?.success) return json.data as T;
    }
  } catch {
    /* fall through */
  }
  return fallback();
}

export async function adminUpdate(
  collection: "inquiries" | "course_applications",
  id: string,
  changes: { status?: string; note?: string },
  fallback: () => Promise<void>,
): Promise<void> {
  try {
    const res = await fetch("/api/admin/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collection, id, ...changes }),
    });
    if (res.ok) return;
  } catch {
    /* fall through */
  }
  return fallback();
}
