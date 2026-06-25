# Siksha-Wallah — Online Admission & Counselling Platform

**Status:** Production-Ready · **Version:** 1.0.0 · **Type:** Full-stack web application

Siksha-Wallah is a complete admission-counselling platform for an education
consultancy. Students discover courses across 5 streams, submit applications
online, create an account, upload documents, and chat directly with a
counsellor. The office (admin) side gives the consultancy a full CRM to manage
every lead, application, and conversation in one place.

> **For the client:** This document is the official handover guide. It explains
> exactly what has been built, the technology used, every page in the site, how
> to run it, and what is required to take it live.

---

## 1. What This Platform Does (Plain Summary)

| Audience | What they get |
|----------|---------------|
| **Students / Parents** | Browse 38 courses across 5 streams, read details & career scope, apply online, register an account, upload documents, track their application, and chat live with a counsellor. |
| **The Office (Admin)** | A private dashboard to see every inquiry/lead, follow up by phone or WhatsApp, manage students & applications, reply to chats, and view an activity log of everything happening on the site. |
| **The Business** | A professional, mobile-first, SEO-ready website that converts visitors into leads and centralises all admission operations. |

**हिंदी में संक्षेप:** यह एक पूरा एडमिशन-काउंसलिंग प्लेटफ़ॉर्म है। स्टूडेंट
कोर्स देख सकते हैं, ऑनलाइन अप्लाई कर सकते हैं, अकाउंट बना सकते हैं, डॉक्यूमेंट
अपलोड कर सकते हैं और काउंसलर से चैट कर सकते हैं। ऑफिस के लिए एक एडमिन पैनल है
जहाँ से सारे लीड, एप्लिकेशन और मैसेज मैनेज होते हैं।

---

## 2. Features — Built & Working ✅

### Student-Facing Website
| Feature | Details |
|---------|---------|
| **Homepage** | Hero section, animated stat counters, trust indicators, 5 stream cards, partner-college showcase, success-story carousel, FAQ. |
| **Course Catalog** | 5 streams (Teaching, Medical & Nursing, Para-Medical, Law, Technical & Management), **38 courses** with eligibility, duration, fees, career scope and government-job info. Individual detail page per course. |
| **Online Application Form** | Multi-step form (name, mobile, course, qualification, district) that saves the lead directly to the database. |
| **Student Accounts** | Real sign-up / login, password reset, and email verification powered by Firebase Authentication. |
| **Student Dashboard** | Profile management, document upload, and application status — each student sees only their own data. |
| **Live Counsellor Chat** | Real-time in-app chat between a student and the office, built on Firestore (no third-party chat tool, no extra subscription). |
| **Contact Page** | Contact form that emails the office, plus direct WhatsApp and phone links. |
| **Blog** | Content section with **14 ready articles** (admission tips, course guides, success stories). |
| **Student Portal** | Dynamic section-based portal page for college/course information. |
| **Mobile-First Design** | Fully responsive — built to look right on phones first. |
| **PWA / Installable** | Web-app manifest so the site can be "Added to Home Screen". |

### Office / Admin Panel
| Feature | Details |
|---------|---------|
| **Secure Admin Login** | Cookie-based session protected by JWT + bcrypt; routes guarded by middleware. |
| **Dashboard Overview** | Live counts — total inquiries, today's leads, pending follow-ups, admitted. |
| **Lead Management** | Full inquiry list with status workflow (Pending → Called → Admitted), internal staff notes, one-click phone (`tel:`) and WhatsApp messaging. |
| **Student Directory** | List of all registered students with their details. |
| **Application Tracking** | View submitted applications and their status. |
| **Counsellor Chat (office side)** | Reply to student messages from the admin panel. |
| **Activity Log** | Timeline of site events — inquiries, applications, page activity. |

### Technical Foundation
| Area | Details |
|------|---------|
| **Framework** | Next.js 15 (App Router) with Turbopack. |
| **Type Safety** | 100% TypeScript; form validation with Zod. |
| **Database** | Firebase Firestore with security rules enforcing per-user data access. |
| **Email** | Transactional email (verification, password reset, welcome, contact) via Nodemailer. |
| **Security** | JWT admin sessions, bcrypt hashing, API rate-limiting, Firestore rules, HTTPS. |
| **SEO** | Auto-generated `sitemap.xml`, `robots.txt`, Open Graph image, custom 404. |
| **Analytics** | Vercel Analytics integration. |

---

## 3. Not Yet Built — Optional Phase 2 (Roadmap) 🔜

These are **planned add-ons, not yet implemented**. The required libraries are
already installed, which makes future development faster, but **no working
feature exists for them today.** They are listed here so expectations are clear.

| Add-on | Current State | Effort to Complete |
|--------|---------------|--------------------|
| **Online Payments (Razorpay)** | Library installed; **no payment flow, order, or verification code exists yet.** | Medium |
| **AI Admission Advisor (Google Gemini / Genkit)** | Library installed; **no AI flow or chatbot is wired into the app yet.** | Medium |
| **Community Forum** | **Not present** in the application. | Medium–High |

> If the client needs payments or the AI advisor, these should be quoted and
> built as a separate Phase 2.

---

## 4. The Pages — Full Map

The site has **25 distinct pages (routes)** plus a custom 404 screen, and **12
backend API endpoints**.

### Public & Student-Facing (10 pages)
| # | Route | Page |
|---|-------|------|
| 1 | `/` | Homepage |
| 2 | `/about` | About the consultancy |
| 3 | `/courses` | Course browser (5 streams, tabbed) |
| 4 | `/courses/[courseId]` | Single course detail |
| 5 | `/apply` | Online application form |
| 6 | `/contact` | Contact & enquiry |
| 7 | `/blog` | Blog listing |
| 8 | `/blog/[slug]` | Blog article |
| 9 | `/login` | Login chooser (student / office) |
| 10 | `/portal/[section]` | Student portal sections |

### Authentication (4 pages)
| # | Route | Page |
|---|-------|------|
| 11 | `/auth/register` | Create student account |
| 12 | `/auth/login` | Student login |
| 13 | `/auth/forgot-password` | Request password reset |
| 14 | `/auth/reset-password` | Set a new password |

### Student Dashboard (4 pages)
| # | Route | Page |
|---|-------|------|
| 15 | `/dashboard` | Student home |
| 16 | `/dashboard/profile` | Profile settings |
| 17 | `/dashboard/documents` | Document upload |
| 18 | `/dashboard/messages` | Chat with counsellor |

### Office / Admin Panel (7 pages)
| # | Route | Page |
|---|-------|------|
| 19 | `/admin` | Redirects to dashboard |
| 20 | `/admin/login` | Admin login |
| 21 | `/admin/dashboard` | Lead dashboard & overview |
| 22 | `/admin/applications` | Applications list |
| 23 | `/admin/students` | Student directory |
| 24 | `/admin/activity` | Activity log |
| 25 | `/admin/messages` | Counsellor chat (office side) |

_+ `not-found.tsx` — custom 404 page._

### Backend API Endpoints (12)
`admin/login` · `admin/logout` · `admin/data` · `admin/update` · `admin/chat` ·
`admin/debug` · `auth/send-verification` · `auth/send-reset` · `auth/welcome` ·
`contact` · `student/applications` · `student/documents`

---

## 5. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 15.5.9 |
| UI | React | 19 |
| Language | TypeScript | 5 |
| Styling | Tailwind CSS + shadcn/ui (Radix) | 3.4 |
| Database | Firebase Firestore | 11.9 |
| Auth (students) | Firebase Authentication | — |
| Auth (admin) | JWT + bcrypt | — |
| Email | Nodemailer | 9.0 |
| Validation | Zod | 3.24 |
| Analytics | Vercel Analytics | 2.0 |
| Runtime | Node.js | 18+ |

**Project size:** ~16,000 lines of code across ~90 TypeScript/React files.

---

## 6. Running the Project Locally

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local (see Section 7) and add your keys

# 3. Start the dev server (http://localhost:9002)
npm run dev

# 4. Production build
npm run build
npm start

# 5. Type-check
npm run typecheck
```

---

## 7. Environment Variables Required

Create a file named `.env.local` in the project root:

```env
# Firebase — client (from Firebase Console → Project Settings)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase — server (service-account JSON, used by the Admin SDK)
FIREBASE_SERVICE_ACCOUNT_KEY=

# Email (Gmail app-password or any SMTP provider)
EMAIL_USER=
EMAIL_PASSWORD=

# Admin security (use a random 32+ character string)
ADMIN_SECRET_KEY=
```

> Razorpay and Google AI keys are **only needed if/when Phase 2 (payments / AI)
> is built** — the live site does not require them today.

---

## 8. Deployment

The project is ready for either platform:

**Firebase App Hosting**
```bash
npm install -g firebase-tools
firebase login
firebase deploy
```

**Vercel**
```bash
# Push to GitHub, import the repo at vercel.com,
# add the environment variables from Section 7, deploy.
```

### ⚠️ Deploy the Firestore security rules (required)

App Hosting / Vercel only deploy the **app** — they do **not** push
`firestore.rules`. The rules must be deployed separately, and **re-deployed
every time `firestore.rules` changes**. If you skip this, any feature that
reads/writes a new collection from the browser (e.g. the **counsellor chat**,
which uses the `messages` collection) will fail with `PERMISSION_DENIED`.

```bash
firebase use <your-firebase-project-id>   # one-time
firebase deploy --only firestore:rules
```

`firebase.json` and `firestore.indexes.json` (in the repo root) tell the CLI
where the rules and indexes live.

---

## 9. Database Collections (Firestore)

| Collection | Holds |
|-----------|-------|
| `inquiries` | Leads from the apply / contact forms |
| `course_applications` | Submitted applications |
| `users` | Registered student profiles |
| `documents` | Uploaded student documents |
| `messages` | Student ⇄ counsellor chat |
| `activities` | Site event / activity log |
| `courses` | Course data (also bundled in code) |

Access to each collection is restricted by the rules in `firestore.rules`.

---

## 10. Going Live — Checklist

- [ ] Add all environment variables (Section 7)
- [ ] Set a strong, random `ADMIN_SECRET_KEY`
- [ ] Create the first admin account
- [ ] Deploy `firestore.rules`
- [ ] Connect a custom domain + SSL
- [ ] Test on a real phone: apply form, registration, login, chat, contact email
- [ ] Verify the office can see leads and reply to chats

---

## 11. Handover Notes

- **Source of truth for course content:** `src/lib/courses-data.ts`
- **Blog content:** `src/lib/blog-data.ts`
- **Success stories:** `src/lib/reviews-data.ts`
- **Email templates:** `src/lib/email-templates.ts`
- All business data lives in code files above + Firestore, so content can be
  edited without touching the layout.

For the fastest setup path, see **`QUICK_START.md`**.

---

*Built with Next.js 15 and Firebase · Mobile-first · SEO-ready · Production-ready.*
