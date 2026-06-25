# Security Model & Hardening Runbook

This document explains how access control works in Siksha Wallah and the exact
order to roll out the hardened Firestore rules without downtime.

## Who can access what

| Actor | How they authenticate | What they can touch |
|-------|----------------------|---------------------|
| **Guest / visitor** | none | Create-only: submit `inquiries`, `course_applications`, `activities`. Read public `courses`. |
| **Student** | Firebase Auth (email + password) | Read/write **only their own** `users` profile, `documents`, `messages`; read **only their own** `course_applications`. |
| **Office / counsellor** | Signed **httpOnly cookie** (`sw_admin_session`), HMAC-signed server-side — **not** a Firebase Auth user | Reads/writes private collections through the cookie-gated **Admin SDK** API (`/api/admin/*`), which **bypasses** Firestore rules. |

Because the office is not a Firebase user, it reaches Firestore from the browser
as an *anonymous* client. The hardened rules therefore grant it **no** client
access — it must go through `/api/admin/*`, where the signed cookie is verified
and the Admin SDK performs the read/write.

## Why the rules are safe to lock down

- **Office reads** (`inquiries`, `course_applications`, `users`, `activities`,
  conversation lists) → `/api/admin/data` and `/api/admin/chat` (Admin SDK).
- **Office writes** (status / note) → `/api/admin/update` (Admin SDK).
- **Student reads** their own applications → `/api/student/applications`
  (Firebase ID-token verified), with a client owner-read fallback that the rules
  still permit (`userId == auth.uid`).
- **Student profile / documents / chat** → owner-scoped client access, allowed by
  the rules.

## ⚠️ Deploy order (do NOT skip)

The hardened rules remove world-readable access to all personal data. The office
dashboard then depends entirely on the Admin SDK. Roll out in this order:

1. **Configure the Admin SDK backend.**
   - Firebase App Hosting: nothing to do — Application Default Credentials work.
   - Vercel / other: set `FIREBASE_SERVICE_ACCOUNT_KEY` to the full
     service-account JSON, then redeploy.
2. **Configure office login.** Set `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and a
   random 32+ char `ADMIN_SESSION_SECRET`. (In production, login is disabled
   until these are set — fail closed.)
3. **Verify the backend.** Log into `/admin`, then open `/api/admin/debug`.
   It must return `{ "ok": true }`. If not, fix the service-account key first —
   the page shows a precise diagnosis.
4. **Deploy the rules:**
   ```bash
   firebase use <your-firebase-project-id>
   firebase deploy --only firestore:rules
   ```
5. **Smoke test:** office dashboard lists inquiries / applications / students /
   activity; office can change a status and a note and it **persists after
   refresh**; a student sees only their own applications; counsellor chat works.

If the office dashboard shows no data after step 4, the Admin SDK backend is not
configured — revisit steps 1–3. (Until the rules are deployed, the app keeps
working on the previous open rules, so there is no rush between steps.)

## Required production environment variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_FIREBASE_*` | Firebase client config |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Admin SDK (office + student APIs). Auto on App Hosting. |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD` | Office login (fail closed if unset in prod) |
| `ADMIN_SESSION_SECRET` | Signs the office session cookie (32+ random chars) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM` | Transactional email |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for password-reset links |

## Notes

- The office session cookie is `httpOnly`, `sameSite=lax`, `secure` in
  production, signed with HMAC-SHA256 and verified in both the Edge middleware
  and Node route handlers, so it cannot be forged from the browser.
- Office login is rate-limited (5 attempts / 5 min per IP).
- `localStorage` only holds a display hint (`sw_admin_session`); it is **not**
  used for authorization — the signed cookie is the only source of truth.
