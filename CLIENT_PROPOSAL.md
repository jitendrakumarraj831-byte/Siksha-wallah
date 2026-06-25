# Siksha-Wallah — Project Delivery & Pricing Proposal

**Online Admission & Counselling Platform — Complete Web Application**

| | |
|---|---|
| **Prepared for** | [Client / Consultancy Name] |
| **Prepared by** | Jitendra Kumar |
| **Contact** | jitendrakumarraj831@gmail.com |
| **Date** | 25 June 2026 |
| **Version** | 1.0 (Production-Ready) |

> _Yeh editable master copy hai. Ek polished PDF version bhi diya gaya hai
> (`Siksha-Wallah-Proposal.pdf`) jo seedhe client ko bheja ja sakta hai.
> Price ya koi detail badalni ho to yahan edit karke PDF dobara bana lein._

---

## 1. Project ka Parichay

**Siksha-Wallah** ek poora online admission & counselling platform hai jo ek
education consultancy ke liye banaya gaya hai. Isme do hisse hain:

- **Student Website** — student 5 streams ke 38 courses dekh sakte hain, online
  apply kar sakte hain, apna account bana sakte hain, documents upload kar sakte
  hain, aur seedhe counsellor se **live chat** kar sakte hain.
- **Office / Admin Panel** — ek private dashboard jahan se consultancy har lead,
  application aur message ko ek jagah manage karti hai (phone & WhatsApp
  follow-up ke saath).

| 25 | 12 | 38 | 14 | ~16,000 |
|----|----|----|----|---------|
| Total Pages | Backend APIs | Courses (5 streams) | Blog Articles | Lines of Code |

---

## 2. Kya-Kya Bana Hua Hai (Delivered Features)

### Student Side ✅
| Feature | Details |
|---------|---------|
| Homepage | Hero, animated counters, 5 stream cards, partner colleges, success stories, FAQ |
| Course Catalog | 5 streams, 38 courses — eligibility, fees, duration, career scope, govt jobs; har course ka detail page |
| Online Apply Form | Multi-step form jo lead seedhe database mein save karta hai |
| Student Account | Real sign-up / login / password reset / email verification (Firebase Auth) |
| Student Dashboard | Profile, document upload, application status — har student sirf apna data dekhta hai |
| Live Counsellor Chat | Real-time chat (student ⇄ office) — koi third-party tool nahi, koi extra subscription nahi |
| Contact + Blog | Contact form (email), WhatsApp/phone links, aur 14 blog articles |
| Mobile + PWA | Mobile-first design, "Add to Home Screen" installable |

### Office / Admin Panel ✅
| Feature | Details |
|---------|---------|
| Secure Login | JWT + bcrypt session, middleware se protected |
| Lead Dashboard | Live counts — total inquiries, aaj ke leads, pending follow-up, admitted |
| Lead Management | Status workflow (Pending → Called → Admitted), staff notes, 1-click call & WhatsApp |
| Students & Applications | Saare registered students aur submitted applications ki list |
| Counsellor Chat (office side) | Student ke messages ka reply admin panel se |
| Activity Log | Site par ho rahe events ka timeline |

**Technical foundation:** Next.js 15, React 19, TypeScript (100%), Tailwind CSS,
Firebase Firestore (security rules ke saath), Nodemailer email, SEO
(sitemap/robots/OG), Vercel Analytics.

---

## 3. Website ke Saare Pages (25 Pages)

| Section | Pages | Count |
|---------|-------|-------|
| Public / Student-facing | Home, About, Courses, Course-detail, Apply, Contact, Blog, Blog-article, Login-chooser, Portal | **10** |
| Authentication | Register, Login, Forgot-password, Reset-password | **4** |
| Student Dashboard | Dashboard Home, Profile, Documents, Messages (Chat) | **4** |
| Office / Admin Panel | Login, Dashboard, Applications, Students, Activity, Messages, (auto-redirect) | **7** |
| **Total** | + 1 custom 404 page • 12 backend API endpoints | **25** |

---

## 4. Doosre Developer is Type ki Website ka Kitna Charge Karte Hain?

Neeche Indian market (2026) ke real rates hain — taaki is platform ki sahi value
samajh aaye. Yeh ek **full-stack application** hai (sirf simple website nahi):
student login, admin CRM, real-time chat, email, 25 pages.

| Kaun Banata Hai | Is type ke project ka charge |
|-----------------|------------------------------|
| Fresher / Junior freelancer (Tier 2-3 city) | ₹40,000 – ₹90,000 |
| Mid-level freelancer | ₹1,20,000 – ₹2,50,000 |
| Web studio / Small company | ₹2,50,000 – ₹4,50,000 |
| Professional agency (metro city) | ₹5,00,000 – ₹10,00,000+ |

> ### 💎 Is Project ki Professional Market Value: **₹2,50,000 – ₹4,00,000**
> Ek experienced freelancer / studio se banwane par (one-time, complete platform).

---

## 5. Aapke Liye Investment

| Item | Price |
|------|-------|
| **Complete Platform — jaisa abhi banaya gaya (25 pages, admin panel, chat, sab kuch)** | **₹ ____________** _(market value ₹2.5L–₹4L; final price aapse tay)_ |
| Annual Maintenance (optional) — updates, bug-fixes, support | ₹30,000 – ₹1,20,000 / saal |

> **Note:** Upar wala "Complete Platform" price ek-baar ka (one-time) hai. Domain
> aur hosting ka kharcha alag hota hai (Section 7) — wo provider ko jaata hai,
> developer ko nahi.

---

## 6. Phase 2 — Optional Add-ons (Abhi Nahi Bane) 🔜

Ye features **abhi platform mein nahi hain**. Inki library install hai (future
kaam tez hoga), par working feature baad mein banega. Agar chahiye to inhe alag
se quote kiya jaata hai — isse expectation bilkul clear rehta hai.

| Add-on | Abhi ki Sthiti | Banane ka Charge |
|--------|----------------|------------------|
| Online Payment (Razorpay) | ❌ Nahi bana | ₹15,000 – ₹40,000 |
| AI Admission Advisor (Google Gemini) | ❌ Nahi bana | ₹25,000 – ₹75,000 |
| Community Forum | ❌ Nahi bana | ₹30,000 – ₹70,000 |

---

## 7. Running Cost (Provider ko, Developer ko Nahi)

| Cheez | Kharcha |
|-------|---------|
| Domain (.in / .com) | ₹800 – ₹1,500 / saal |
| Hosting (Vercel / Firebase) | Shuru mein FREE; scale par ₹2,000 – ₹8,000 / mahina |
| Email service (optional, bade volume par) | ₹0 – ₹2,000 / mahina |

---

## 8. Agla Kadam (Next Steps)

1. Price aur scope confirm karein.
2. Domain, Firebase & email credentials share karein (setup ke liye).
3. Deployment (Vercel/Firebase) + custom domain live.
4. Admin account banakar handover + training.

> **Is proposal mein shaamil:** Complete source code, README + Quick-Start guide,
> deployment, admin handover. **Phase 2 add-ons** (payment/AI/forum) is price mein
> shaamil nahi hain.

---

*Siksha-Wallah — Online Admission & Counselling Platform*
*Prepared by Jitendra Kumar • jitendrakumarraj831@gmail.com • 25 June 2026*
*Built with Next.js 15 & Firebase • Mobile-first • SEO-ready • Production-ready*
