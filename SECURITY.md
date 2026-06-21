# Security & Deployment Runbook

This project was hardened for production. A few steps require **you** to set
secrets and deploy the Firestore rules. Follow this runbook in order.

## 1. Set environment variables (required)

In Firebase App Hosting (or your host), set these **server-side** secrets:

| Variable | Purpose |
| --- | --- |
| `ADMIN_USERNAME` | Office login username (default `admin`) |
| `ADMIN_PASSWORD` | Office login password — **change from the default** |
| `ADMIN_SESSION_SECRET` | Long random string to sign the admin session cookie. Generate: `openssl rand -hex 32` |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Payments |
| `GMAIL_USER` / `GMAIL_APP_PASSWORD` / `CONTACT_EMAIL` | Contact emails |

> The old `NEXT_PUBLIC_ADMIN_USERNAME` / `NEXT_PUBLIC_ADMIN_PASSWORD` are **no
> longer used** and must be removed — they shipped credentials to the browser.

`FIREBASE_SERVICE_ACCOUNT_KEY` is **not** needed on Firebase App Hosting /
GCP (Application Default Credentials are automatic). Only set it (full
service-account JSON) if you host elsewhere.

## 2. Admin authentication (already hardened)

- Credentials are validated server-side in `POST /api/admin/login`, which issues
  an **HMAC-signed, httpOnly** session cookie.
- `middleware.ts` verifies that signature on every `/admin/*` request, so the
  cookie can't be forged in DevTools and `localStorage` is no longer an auth
  boundary.

## 3. Firestore rules rollout (do this carefully)

The new `firestore.rules` **deny all client reads** of private collections
(inquiries, applications, users, activities). The office dashboard now reads/
writes these through the cookie-gated server API (`/api/admin/data`,
`/api/admin/update`) which uses the Admin SDK and bypasses rules.

**Order matters:**

1. Deploy the app code first (this branch).
2. Log in to the office dashboard and confirm data loads — i.e. the Admin SDK
   is working. Quick check while logged in:
   `GET /api/admin/data?type=inquiries` should return `{ "success": true, ... }`.
   (Until then, the dashboard transparently falls back to direct reads.)
3. Once confirmed, deploy the rules:
   ```bash
   firebase deploy --only firestore:rules
   ```
4. Re-test the dashboard (inquiries, applications, students, activity) and the
   public forms (apply, contact, inquiry) after locking.

If something is wrong, roll back rules in the Firebase Console (Firestore →
Rules → history) — the app keeps working via the client fallback under the
previous open rules.

## 4. Firebase Storage rules

Set in Firebase Console → Storage → Rules (mirrors document ownership):

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /documents/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 5. API protection (already added)

`/api/contact`, `/api/payment/*`, and `/api/admin/login` are rate-limited
in-memory per IP. For multi-instance hosting, back the limiter with Redis/Upstash
(`src/lib/rate-limit.ts`).

## Remaining notes

- The static `/courses` page links to WhatsApp inquiry, not the Firestore-backed
  `/courses/[courseId]` → checkout flow, so that payment flow is currently
  unreachable via normal navigation. Wire it up or remove it as desired.
- The activity feed and applications list are now fetched on load + manual
  refresh (no longer real-time) so they can be served by the secure admin API.
