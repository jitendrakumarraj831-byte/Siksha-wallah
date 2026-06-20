# Siksha-Wallah

An educational platform built with Next.js 15, Firebase, and Razorpay — enabling students to explore courses, apply online, manage their dashboard, and make payments.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| Payments | Razorpay |
| AI | Google Genkit (AI Admission Advisor) |
| Email | Nodemailer |

---

## Features

### Student Side
- **Home Page** — Hero section with stats, featured courses, trust indicators
- **Courses** — Browse all courses, individual course detail pages
- **Apply** — Online admission application form
- **Auth** — Register, Login, Forgot Password (Firebase Auth)
- **Dashboard** — Student profile, documents, application status
- **Student Portal** — Section-based portal shell (`/portal/[section]`)
- **Student Credit Card** — Dedicated credit card page for students
- **Blog** — Articles list and individual blog post pages
- **Forum** — Community discussion page
- **Contact** — Contact form with email via Nodemailer API
- **Payment** — Razorpay checkout and payment success flow

### Admin Side
- **Admin Dashboard** — Overview panel
- **Applications** — View and manage student applications
- **Students** — Student management
- **Activity** — Recent activity log
- **Analytics** — Analytics page
- **Communications** — Messaging/communications panel
- **Courses** — Course management
- **Payments** — Payment records

### AI Feature
- **AI Admission Advisor** — Powered by Google Genkit + Gemini, guides students through the admission process

### SEO & PWA
- `sitemap.ts` — Auto-generated sitemap
- `robots.ts` — Robots.txt
- `manifest.ts` — PWA manifest
- `not-found.tsx` — Custom 404 page

---

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Home
│   ├── about/
│   ├── apply/
│   ├── auth/                   # login, register, forgot-password
│   ├── blog/
│   ├── contact/
│   ├── courses/
│   ├── dashboard/              # profile, documents
│   ├── forum/
│   ├── payment/                # checkout, success
│   ├── portal/[section]/
│   ├── student-credit-card/
│   ├── admin/                  # dashboard, students, applications, etc.
│   ├── api/
│   │   ├── contact/            # Email sending
│   │   └── payment/            # Razorpay create-order & verify
│   └── lib/
│       └── placeholder-images.ts
│
├── components/
│   ├── site-navbar.tsx         # Main navigation bar
│   ├── site-footer.tsx         # Footer
│   ├── auth-provider.tsx       # Firebase auth context
│   ├── portal-shell.tsx        # Student portal layout
│   ├── floating-contact.tsx    # Floating contact button
│   ├── animate-in.tsx          # Scroll animation wrapper
│   ├── count-up.tsx            # Animated number counter
│   └── ui/                     # shadcn/ui base components
│       (alert, badge, button, card, input, label,
│        select, separator, sheet, skeleton, table, tabs, textarea)
│
├── services/                   # Firebase Firestore service layer
│   ├── activity-service.ts
│   ├── application-service.ts
│   ├── course-service.ts
│   ├── forum-service.ts
│   ├── inquiry-service.ts
│   ├── payment-service.ts
│   └── student-service.ts
│
├── lib/
│   ├── firebase.ts             # Firebase app initialization
│   ├── auth-service.ts         # Firebase Auth helpers
│   ├── courses-data.ts         # Static course data
│   ├── blog-data.ts            # Static blog data
│   └── utils.ts                # Tailwind class utilities
│
├── ai/
│   ├── genkit.ts               # Genkit setup
│   ├── dev.ts                  # Genkit dev server entry
│   └── flows/
│       └── ai-admission-advisor-flow.ts
│
├── hooks/
│   ├── use-mobile.tsx
│   └── use-toast.ts
│
└── middleware.ts               # Auth route protection
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (port 9002)
npm run dev

# Start AI Genkit dev server (separate terminal)
npm run genkit:dev

# Build for production
npm run build

# Type check
npm run typecheck
```

---

## Environment Variables

Create a `.env.local` file in the root:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=

# Email (Nodemailer)
EMAIL_USER=
EMAIL_PASS=

# Google AI (Genkit)
GOOGLE_GENAI_API_KEY=
```

---

## Database Collections (Firestore)

| Collection | Description |
|------------|-------------|
| `users` | User profiles |
| `courses` | Course information |
| `applications` | Admission applications |
| `payments` | Payment records |
| `forum_posts` | Forum discussions |
| `activities` | Admin activity log |
| `inquiries` | Contact form submissions |

---

## Deployment

Deploy on **Vercel**:

1. Push code to GitHub
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Add all environment variables from `.env.local`
4. Click **Deploy**

---

Made with love for Indian students by Siksha-Wallah
