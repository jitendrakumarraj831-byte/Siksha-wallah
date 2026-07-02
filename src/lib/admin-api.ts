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

export interface AdminFetchResult<T> {
  data: T;
  /** true when the secure Admin SDK API answered; false when we fell back. */
  ok: boolean;
  /** human-readable reason when the API did not answer (backend down / 401). */
  error?: string;
}

/**
 * Like `adminFetchData` but reports whether the secure API actually answered, so
 * office pages can show a clear "admin backend unavailable" message instead of a
 * silent empty list when firebase-admin isn't configured or the session expired.
 * Still returns the client fallback's data so anything readable is shown.
 */
export async function adminFetchDataResult<T>(
  type: string,
  fallback: () => Promise<T>,
): Promise<AdminFetchResult<T>> {
  try {
    const res = await fetch(`/api/admin/data?type=${type}`, { cache: "no-store", credentials: "include" });
    if (res.ok) {
      const json = await res.json().catch(() => null);
      if (json?.success) return { data: json.data as T, ok: true };
      return { data: await fallback(), ok: false, error: "Admin backend returned an unexpected response." };
    }
    if (res.status === 401) {
      return { data: await fallback(), ok: false, error: "Session expired — please sign in again." };
    }
    const j = await res.json().catch(() => ({} as { error?: string }));
    return {
      data: await fallback(),
      ok: false,
      error: j.error || "Admin backend unavailable. Check FIREBASE_SERVICE_ACCOUNT_KEY (see /api/admin/debug).",
    };
  } catch {
    return { data: await fallback(), ok: false, error: "Could not reach the admin backend." };
  }
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
  changes: {
    status?: string; note?: string;
    paymentStatus?: string; amountPaid?: number; amountDue?: number;
    paymentDate?: string; paymentMode?: string;
  },
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

// Destructive deletes — separate small helpers (rather than overloading
// adminUpdate) since callers must show a confirm-before-delete UI, not an
// optimistic update.
async function adminDelete(path: string, body: Record<string, string>): Promise<void> {
  let res: Response;
  try {
    res = await fetch(path, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Network error — delete नहीं हो पाया। Internet check करके दोबारा करें।");
  }
  if (res.ok) return;
  if (res.status === 401) throw new Error("Session expire हो गई है। दोबारा login करें।");
  if (res.status === 503) throw new Error("Admin backend abhi available nahi hai. Thodi der baad try karein.");
  const data = await res.json().catch(() => ({} as { error?: string }));
  throw new Error(data.error || "Delete नहीं हो पाया। दोबारा कोशिश करें।");
}

/** Permanently deletes a student's entire account: Auth login, profile,
 *  every application and every uploaded document. Irreversible. */
export async function adminDeleteStudent(uid: string): Promise<void> {
  return adminDelete("/api/admin/students", { uid });
}

/** Permanently deletes one admission application. Irreversible. */
export async function adminDeleteApplication(id: string): Promise<void> {
  return adminDelete("/api/admin/applications", { id });
}

/** Permanently deletes one uploaded document (Firestore record + Cloudinary file). Irreversible. */
export async function adminDeleteDocument(id: string): Promise<void> {
  return adminDelete("/api/admin/documents", { id });
}
