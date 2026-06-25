// Client helpers for the office dashboard.
//
// Reads prefer the cookie-gated server API (firebase-admin, works once Firestore
// rules are locked) and fall back to a direct client-SDK read so the dashboard
// keeps working before the rules migration is completed.
//
// Writes go ONLY through the server API. The office "login" is a signed cookie,
// not a Firebase Auth user, so from Firestore's perspective it is anonymous —
// and the rules (correctly) deny anonymous writes to inquiries/applications.
// Routing writes through /api/admin/update (Admin SDK, cookie-gated) is the only
// secure way to persist status/note changes. On failure we THROW so the caller
// can surface a clear error instead of silently losing the edit.

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

export type AdminUpdatableCollection = "inquiries" | "course_applications";

/**
 * Persist a status and/or note change via the cookie-gated Admin SDK API.
 * Throws an Error with a human-readable message on any failure (auth expired,
 * admin backend down, validation) so the UI can revert + inform the user.
 */
export async function adminUpdate(
  collection: AdminUpdatableCollection,
  id: string,
  changes: { status?: string; note?: string },
): Promise<void> {
  let res: Response;
  try {
    res = await fetch("/api/admin/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ collection, id, ...changes }),
    });
  } catch {
    throw new Error("Network error — change save नहीं हो पाया। Internet check करके दोबारा करें।");
  }

  if (res.ok) return;

  if (res.status === 401) {
    throw new Error("Session expire हो गई है। दोबारा login करें।");
  }
  if (res.status === 503) {
    throw new Error("Admin backend abhi available nahi hai. Thodi der baad try karein.");
  }
  const data = await res.json().catch(() => ({} as { error?: string }));
  throw new Error(data.error || "Change save नहीं हो पाया। दोबारा कोशिश करें।");
}
