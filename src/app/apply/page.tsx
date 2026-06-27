"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { saveApplication } from "@/services/application-service";
import { saveActivity } from "@/services/activity-service";
import { saveInquiry } from "@/services/inquiry-service";
import { useAuth } from "@/components/auth-provider";
import {
  GraduationCap, User, Phone, Mail, BookOpen, MapPin, CheckCircle2,
  Send, Loader, AlertCircle, ArrowRight, MessageCircle, FileText,
} from "lucide-react";

const COURSES = [
  // Teaching
  "B.Ed", "D.El.Ed", "M.Ed", "B.P.Ed",
  // Medical
  "MBBS", "BDS", "B.Sc Nursing", "GNM", "ANM", "B.Pharma", "D.Pharma", "BMLT", "BASLP",
  // Technical
  "B.Tech", "Polytechnic", "ITI", "Diploma",
  // Management
  "BBA", "MBA", "BCA", "MCA",
  // General
  "BA", "B.Com", "B.Sc", "MA", "M.Com", "M.Sc",
  // Other
  "BSCC Guidance Only",
];

const QUALIFICATIONS = [
  "8th Pass", "10th Pass", "12th Pass (Arts)", "12th Pass (Science)",
  "12th Pass (Commerce)", "12th Pass (PCB)", "12th Pass (PCM)",
  "Graduation", "Post Graduation", "Other",
];

const DISTRICTS_BIHAR = [
  "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur",
  "Bhojpur", "Buxar", "Darbhanga", "Gaya", "Gopalganj", "Jamui",
  "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai",
  "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada",
  "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran",
  "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali",
  "West Champaran", "East Champaran",
];

type FormData = {
  fullName: string; mobile: string; email: string; fatherName: string;
  dob: string; gender: string; address: string; district: string; state: string;
  course: string; qualification: string; passingYear: string;
  percentage: string; schoolCollege: string; preferredCollege: string;
  bsccRequired: boolean; message: string;
};

// Common documents every student should check
const ALL_DOCS = [
  "Aadhaar Card (आधार कार्ड)",
  "10th Marksheet (दसवीं अंकपत्र)",
  "12th Marksheet (बारहवीं अंकपत्र)",
  "Graduation Marksheet (स्नातक अंकपत्र)",
  "Caste Certificate (जाति प्रमाण पत्र)",
  "Income Certificate (आय प्रमाण पत्र)",
  "Domicile / Residence Certificate (निवास प्रमाण पत्र)",
  "Passport Size Photos (4 copies)",
  "Bank Passbook / Account Details",
];

const EMPTY: FormData = {
  fullName: "", mobile: "", email: "", fatherName: "",
  dob: "", gender: "", address: "", district: "", state: "Bihar",
  course: "", qualification: "", passingYear: "",
  percentage: "", schoolCollege: "", preferredCollege: "",
  bsccRequired: false, message: "",
};

function ApplyForm() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const [form, setForm] = useState<FormData>(EMPTY);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [appId, setAppId] = useState("");
  const [availableDocs, setAvailableDocs] = useState<string[]>([]);
  const [tcAccepted, setTcAccepted] = useState(false);

  // Pre-fill course from URL param ?course=
  useEffect(() => {
    const courseParam = searchParams.get("course");
    if (courseParam) {
      setForm(f => ({ ...f, course: f.course || courseParam }));
    }
  }, [searchParams]);

  // Pre-fill form fields when logged-in student visits
  useEffect(() => {
    if (user && userProfile) {
      setForm(f => ({
        ...f,
        fullName: f.fullName || userProfile.name || "",
        mobile: f.mobile || userProfile.phone || "",
        email: f.email || userProfile.email || "",
      }));
    }
  }, [user, userProfile]);

  const set = (k: keyof FormData, v: string | boolean) =>
    setForm(f => ({ ...f, [k]: v }));

  function toggleDoc(label: string) {
    setAvailableDocs(prev =>
      prev.includes(label) ? prev.filter(d => d !== label) : [...prev, label]
    );
  }

  function validateStep1() {
    if (!form.fullName.trim()) return "कृपया अपना पूरा नाम दर्ज करें।";
    if (!form.mobile.trim() || form.mobile.length < 10) return "कृपया एक सही 10-अंकों का mobile number दर्ज करें।";
    if (!form.gender) return "कृपया gender का चयन करें।";
    return "";
  }

  function validateStep2() {
    if (!form.course) return "कृपया उस course का चयन करें जिसमें आप admission लेना चाहते हैं।";
    if (!form.qualification) return "कृपया अपनी current qualification का चयन करें।";
    return "";
  }

  function nextStep() {
    setError("");
    if (step === 1) {
      const e = validateStep1();
      if (e) { setError(e); return; }
    }
    if (step === 2) {
      const e = validateStep2();
      if (e) { setError(e); return; }
    }
    if (step === 3) {
      if (!tcAccepted) { setError("कृपया Terms & Conditions स्वीकार करें।"); return; }
    }
    setStep(s => s + 1);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step !== 4) return;
    const e1 = validateStep1();
    if (e1) { setError(e1); return; }
    const e2 = validateStep2();
    if (e2) { setError(e2); return; }
    if (!tcAccepted) { setError("कृपया Terms & Conditions स्वीकार करें।"); return; }
    setLoading(true);
    setError("");
    try {
      const id = await saveApplication({
        userId: user?.uid || undefined,
        fullName: form.fullName,
        mobile: form.mobile,
        email: form.email || user?.email || undefined,
        fatherName: form.fatherName || undefined,
        dob: form.dob || undefined,
        gender: form.gender || undefined,
        address: form.address || undefined,
        district: form.district || undefined,
        state: form.state || undefined,
        course: form.course,
        qualification: form.qualification,
        passingYear: form.passingYear || undefined,
        percentage: form.percentage || undefined,
        schoolCollege: form.schoolCollege || undefined,
        preferredCollege: form.preferredCollege || undefined,
        bsccRequired: form.bsccRequired,
        message: form.message || undefined,
        availableDocs: availableDocs.length > 0 ? availableDocs : undefined,
      });
      setAppId(id.slice(0, 8).toUpperCase());
      saveInquiry({
        fullName: form.fullName,
        mobile: form.mobile,
        email: form.email || undefined,
        course: form.course,
        qualification: form.qualification,
        message: form.message || `Apply page — Ref: ${id.slice(0, 8).toUpperCase()}`,
        status: "pending",
      }).catch(() => {});
      saveActivity({
        type: "application",
        title: "📋 Admission Application Submitted",
        description: `${form.fullName} ne ${form.course} ke liye apply kiya`,
        name: form.fullName,
        mobile: form.mobile,
        email: form.email || undefined,
        course: form.course,
        userId: user?.uid || undefined,
        refId: id,
        page: "/apply",
      }).catch(() => {});
      setSubmitted(true);
    } catch {
      setError("तकनीकी कारणवश आवेदन अभी जमा नहीं हो पाया। कृपया हमें सीधे कॉल करें — हमारी team आपकी सहायता के लिए तैयार है।");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <>
        <SiteNavbar />
        <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 px-4 py-12">
          <div className="mx-auto w-full max-w-lg">
            {/* Success header */}
            <div className="text-center mb-6">
              <div className="mb-4 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 size={48} className="text-green-500" />
                </div>
              </div>
              <h1 className="font-headline text-2xl font-extrabold text-gray-900 mb-1">
                Application <span className="text-green-600">Submitted!</span>
              </h1>
              <p className="text-sm text-gray-500">आपका आवेदन सफलतापूर्वक जमा हो गया।</p>
            </div>

            {/* Reference ID */}
            <div className="mb-4 rounded-2xl border-2 border-[#003f9f] bg-white px-6 py-4 text-center">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Application Reference ID</p>
              <p className="font-headline text-3xl font-extrabold text-[#003f9f]">#{appId}</p>
              <p className="text-xs text-gray-400 mt-1">यह ID save करके रखें — status track करने के काम आएगी।</p>
            </div>

            {/* IMPORTANT: Office visit notice */}
            <div className="mb-4 rounded-2xl border-2 border-amber-400 bg-amber-50 p-5">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🏢</span>
                <div>
                  <p className="font-extrabold text-amber-900 text-base mb-1">Office में Original Documents लेकर आएं</p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Form submit होने के बाद admission process complete करने के लिए आपको <strong>Siksha Wallah Office</strong> में अपने सभी original documents लेकर आना होगा।
                  </p>
                  <div className="mt-3 rounded-xl bg-amber-100 border border-amber-200 px-4 py-3">
                    <p className="text-xs font-extrabold text-amber-900 mb-1.5">📍 Office Address:</p>
                    <p className="text-xs text-amber-800">College Chowk, Near HP Petrol Pump,<br />Forbesganj, Araria, Bihar</p>
                    <p className="text-xs text-amber-800 mt-1">⏰ Mon–Sat: 9:00 AM – 7:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents you marked as available */}
            {availableDocs.length > 0 && (
              <div className="mb-4 rounded-2xl border-2 border-gray-200 bg-white p-5">
                <p className="font-extrabold text-gray-800 text-sm mb-3">📋 आपने जो Documents Available बताए:</p>
                <div className="space-y-1.5">
                  {ALL_DOCS.map(doc => (
                    <div key={doc} className="flex items-center gap-2 text-sm">
                      {availableDocs.includes(doc)
                        ? <><span className="text-green-500 font-bold">✅</span><span className="text-gray-700">{doc}</span></>
                        : <><span className="text-gray-300">⬜</span><span className="text-gray-400 line-through">{doc}</span></>
                      }
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-red-600 font-semibold">
                  ⚠️ Office आते समय जो documents ✅ नहीं हैं उन्हें भी साथ लाने की कोशिश करें।
                </p>
              </div>
            )}

            {/* Counsellor contact */}
            <p className="text-center text-sm text-gray-600 mb-3">
              हमारा counsellor <strong>30 मिनट के भीतर</strong> आपसे संपर्क करेगा।
            </p>
            <div className="flex flex-col gap-2 mb-5">
              <a
                href={`https://wa.me/916203138576?text=नमस्ते!%20मैंने%20${encodeURIComponent(form.course)}%20के%20लिए%20apply%20किया%20है।%20नाम:%20${encodeURIComponent(form.fullName)}%20।%20Reference%20ID:%20%23${appId}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-green-500 py-3 font-extrabold text-white hover:bg-green-600 transition"
              >
                <MessageCircle size={18} fill="currentColor" /> WhatsApp पर बात करें
              </a>
              <a href="tel:+916203138576"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#003f9f] py-3 font-extrabold text-white hover:bg-blue-700 transition"
              >
                <Phone size={18} /> Call करें — +91 62031 38576
              </a>
            </div>
            <div className="text-center space-y-2">
              {user ? (
                <Link href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#003f9f] px-6 py-3 text-sm font-extrabold text-white hover:bg-blue-700 transition">
                  My Dashboard देखें — Application Track करें →
                </Link>
              ) : (
                <>
                  <Link href="/auth/register"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#003f9f] px-6 py-3 text-sm font-extrabold text-white hover:bg-blue-700 transition">
                    Account बनाएं — Application Track करें →
                  </Link>
                  <p className="text-xs text-gray-400">
                    पहले से account है?{' '}
                    <Link href="/auth/login" className="font-bold text-[#003f9f] hover:underline">Login करें</Link>
                  </p>
                </>
              )}
            </div>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteNavbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#00102e] via-[#001850] to-[#003590] py-14 text-white text-center">
          {/* Dot-grid */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          {/* Glow orbs */}
          <div className="pointer-events-none absolute -top-40 -right-32 h-[480px] w-[480px] rounded-full bg-amber-400 opacity-[0.10] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-500 opacity-[0.13] blur-3xl" />
          <div className="container-shell relative">
            {/* Label pill */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/[0.1] px-4 py-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
              <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber-300">Online Admission Application</span>
            </div>
            {/* H1 */}
            <h1 className="font-headline font-black tracking-tight leading-[1.1]">
              <span className="block text-[1.5rem] md:text-[2.2rem] lg:text-[2.6rem] text-white/80">सिर्फ़ 4 Steps में</span>
              <span className="block text-[2.8rem] md:text-[4.2rem] lg:text-[5rem] bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">Admission शुरू करें।</span>
              <span className="block text-[1.4rem] md:text-[1.9rem] lg:text-[2.2rem] text-white">पहली Counselling <span className="text-amber-300 font-extrabold">बिल्कुल मुफ़्त।</span></span>
            </h1>
            <div className="mx-auto mt-4 h-[3px] w-28 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-transparent md:w-40" />
            <p className="mt-6 max-w-xl mx-auto text-blue-100 leading-relaxed">
              अपनी जानकारी भरें — हमारी अनुभवी counselling team आपको सही course, सही college और (यदि eligible हो तो) BSCC loan तक पूरी guidance देगी।
            </p>
            {/* Step pills */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {[
                "Personal Details",
                "Course & Qualification",
                "Documents Checklist",
                "Review & Submit",
              ].map((pill, i) => (
                <span key={pill} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.07] px-4 py-2 text-xs font-semibold text-blue-100">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-extrabold text-gray-900">{i + 1}</span>
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Login status banner */}
        {!authLoading && (
          <div className={`border-b py-3 text-sm text-center font-semibold ${user ? "bg-green-50 border-green-100 text-green-700" : "bg-amber-50 border-amber-100 text-amber-700"}`}>
            {user
              ? `You are signed in as ${userProfile?.name || user.email} — this application will be saved to your personal dashboard.`
              : <>You are applying as a guest. To track this application and stay updated, please{" "}
                  <Link href="/auth/login" className="underline font-bold hover:text-amber-900">log in</Link>
                  {" "}or{" "}
                  <Link href="/auth/register" className="underline font-bold hover:text-amber-900">create a free account</Link>.
                </>
            }
          </div>
        )}

        {/* Progress bar */}
        <div className="bg-white border-b border-gray-100 py-4">
          <div className="container-shell">
            <div className="flex items-center gap-1 max-w-2xl mx-auto">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className="flex items-center gap-1 flex-1">
                  <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-extrabold transition ${step >= s ? "bg-amber-400 text-gray-900" : "bg-gray-100 text-gray-400"}`}>
                    {step > s ? "✓" : s}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:block ${step >= s ? "text-amber-600" : "text-gray-400"}`}>
                    {s === 1 ? "Personal" : s === 2 ? "Course" : s === 3 ? "Documents" : "Submit"}
                  </span>
                  {s < 4 && <div className={`flex-1 h-0.5 ${step > s ? "bg-amber-400" : "bg-gray-200"}`} />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="py-12 bg-gray-50">
          <div className="container-shell">
            <div className="max-w-2xl mx-auto">
              {error && (
                <div className="mb-6 flex gap-3 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                  <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} onKeyDown={e => { if (e.key === "Enter" && step < 4) e.preventDefault(); }}>
                {/* ── STEP 1: Personal ── */}
                {step === 1 && (
                  <div className="rounded-2xl bg-white border-t-4 border-[#003f9f] border-x-2 border-b-2 border-x-gray-100 border-b-gray-100 p-7 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#003f9f] text-white">
                        <User size={20} />
                      </div>
                      <div>
                        <h2 className="font-headline text-xl font-extrabold text-gray-900">Personal Details</h2>
                        <p className="text-xs text-gray-400">Basic information about the student</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Full Name (पूरा नाम) *</label>
                          <div className="relative">
                            <User size={15} className="absolute left-3.5 top-3.5 text-gray-400" />
                            <input
                              required value={form.fullName}
                              onChange={e => set("fullName", e.target.value)}
                              placeholder="अपना पूरा नाम लिखें"
                              className="w-full rounded-xl border-2 border-gray-200 pl-10 pr-4 py-3 text-sm outline-none focus:border-[#003f9f] transition"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Father&apos;s Name (पिता का नाम)</label>
                          <input
                            value={form.fatherName}
                            onChange={e => set("fatherName", e.target.value)}
                            placeholder="पिता का पूरा नाम"
                            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#003f9f] transition"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Mobile Number *</label>
                          <div className="relative">
                            <Phone size={15} className="absolute left-3.5 top-3.5 text-gray-400" />
                            <input
                              required type="tel" value={form.mobile}
                              onChange={e => set("mobile", e.target.value)}
                              placeholder="Active 10-digit mobile number"
                              maxLength={10}
                              className="w-full rounded-xl border-2 border-gray-200 pl-10 pr-4 py-3 text-sm outline-none focus:border-[#003f9f] transition"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Email Address (optional)</label>
                          <div className="relative">
                            <Mail size={15} className="absolute left-3.5 top-3.5 text-gray-400" />
                            <input
                              type="email" value={form.email}
                              onChange={e => set("email", e.target.value)}
                              placeholder="your@email.com"
                              className="w-full rounded-xl border-2 border-gray-200 pl-10 pr-4 py-3 text-sm outline-none focus:border-[#003f9f] transition"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Date of Birth</label>
                          <input
                            type="date" value={form.dob}
                            onChange={e => set("dob", e.target.value)}
                            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#003f9f] transition"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Gender *</label>
                          <select
                            value={form.gender}
                            onChange={e => set("gender", e.target.value)}
                            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#003f9f] bg-white transition"
                          >
                            <option value="">-- Select --</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Address (पूरा पता)</label>
                        <input
                          value={form.address}
                          onChange={e => set("address", e.target.value)}
                          placeholder="गाँव / मोहल्ला, Post Office, पिन कोड…"
                          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#003f9f] transition"
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-sm font-semibold text-gray-700">District (जिला)</label>
                          <select
                            value={form.district}
                            onChange={e => set("district", e.target.value)}
                            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#003f9f] bg-white transition"
                          >
                            <option value="">-- Select your district --</option>
                            {DISTRICTS_BIHAR.map(d => <option key={d}>{d}</option>)}
                            <option>Outside Bihar</option>
                          </select>
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-semibold text-gray-700">State</label>
                          <input
                            value={form.state}
                            onChange={e => set("state", e.target.value)}
                            placeholder="Bihar"
                            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#003f9f] transition"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="button" onClick={nextStep}
                      className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-[#003f9f] py-4 font-extrabold text-white hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                    >
                      Continue to Course & Qualification <ArrowRight size={18} />
                    </button>
                  </div>
                )}

                {/* ── STEP 2: Academic & Course ── */}
                {step === 2 && (
                  <div className="rounded-2xl bg-white border-t-4 border-[#003f9f] border-x-2 border-b-2 border-x-gray-100 border-b-gray-100 p-7 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#003f9f] text-white">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <h2 className="font-headline text-xl font-extrabold text-gray-900">Course & Qualification</h2>
                        <p className="text-xs text-gray-400">Your educational background and course of interest</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Course of Interest *</label>
                        <select
                          value={form.course}
                          onChange={e => set("course", e.target.value)}
                          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#003f9f] bg-white transition"
                        >
                          <option value="">-- Select a course --</option>
                          <optgroup label="Teaching">
                            {["B.Ed", "D.El.Ed", "M.Ed", "B.P.Ed"].map(c => <option key={c}>{c}</option>)}
                          </optgroup>
                          <optgroup label="Medical & Nursing">
                            {["MBBS", "BDS", "B.Sc Nursing", "GNM", "ANM", "B.Pharma", "D.Pharma", "BMLT", "BASLP"].map(c => <option key={c}>{c}</option>)}
                          </optgroup>
                          <optgroup label="Technical">
                            {["B.Tech", "Polytechnic", "ITI", "Diploma"].map(c => <option key={c}>{c}</option>)}
                          </optgroup>
                          <optgroup label="Management & Commerce">
                            {["BBA", "MBA", "BCA", "MCA", "B.Com", "M.Com"].map(c => <option key={c}>{c}</option>)}
                          </optgroup>
                          <optgroup label="General Degree">
                            {["BA", "B.Sc", "MA", "M.Sc"].map(c => <option key={c}>{c}</option>)}
                          </optgroup>
                          <option>BSCC Loan Guidance Only</option>
                          <option>Not yet decided — I would like career guidance</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Current / Highest Qualification *</label>
                        <select
                          value={form.qualification}
                          onChange={e => set("qualification", e.target.value)}
                          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#003f9f] bg-white transition"
                        >
                          <option value="">-- Select your qualification --</option>
                          {QUALIFICATIONS.map(q => <option key={q}>{q}</option>)}
                        </select>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Year of Passing</label>
                          <input
                            value={form.passingYear}
                            onChange={e => set("passingYear", e.target.value)}
                            placeholder="e.g. 2023"
                            maxLength={4}
                            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#003f9f] transition"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Percentage / Marks Obtained</label>
                          <input
                            value={form.percentage}
                            onChange={e => set("percentage", e.target.value)}
                            placeholder="e.g. 65% or 450/500"
                            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#003f9f] transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Last Attended School / College</label>
                        <input
                          value={form.schoolCollege}
                          onChange={e => set("schoolCollege", e.target.value)}
                          placeholder="जिस संस्थान से अंतिम पढ़ाई पूरी की"
                          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#003f9f] transition"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Preferred College (optional)</label>
                        <input
                          value={form.preferredCollege}
                          onChange={e => set("preferredCollege", e.target.value)}
                          placeholder="यदि कोई विशेष college पसंद है, तो यहाँ बताएँ"
                          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#003f9f] transition"
                        />
                      </div>

                      <label className="flex items-center gap-3 cursor-pointer rounded-xl border-2 border-gray-200 px-4 py-3 hover:border-blue-200 transition">
                        <input
                          type="checkbox"
                          checked={form.bsccRequired}
                          onChange={e => set("bsccRequired", e.target.checked)}
                          className="h-5 w-5 rounded accent-[#003f9f]"
                        />
                        <div>
                          <p className="text-sm font-bold text-gray-800">I am interested in the Bihar Student Credit Card (BSCC) loan</p>
                          <p className="text-xs text-gray-400">₹4 लाख तक का education loan, 4% ब्याज दर — हम eligibility और प्रक्रिया की पूरी जानकारी देंगे।</p>
                        </div>
                      </label>

                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Any specific question or note (optional)</label>
                        <textarea
                          value={form.message}
                          onChange={e => set("message", e.target.value)}
                          rows={3}
                          placeholder="कोई विशेष आवश्यकता या सवाल हो तो यहाँ लिखें…"
                          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#003f9f] transition resize-none"
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <button
                        type="button" onClick={() => { setStep(1); setError(""); }}
                        className="flex-1 rounded-xl border-2 border-gray-200 py-4 text-sm font-bold text-gray-600 hover:border-gray-300 transition"
                      >
                        ← Back
                      </button>
                      <button
                        type="button" onClick={nextStep}
                        className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-[#003f9f] py-4 font-extrabold text-white hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                      >
                        Review My Application <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                )}

                {/* ── STEP 3: Document Checklist ── */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-white border-2 border-blue-100 shadow-sm p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <FileText size={20} className="text-[#003f9f]" />
                        <div>
                          <h2 className="font-headline text-base font-extrabold text-gray-900">Documents Checklist</h2>
                          <p className="text-xs text-gray-500">जो documents आपके पास हैं उन पर ✅ करें</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {ALL_DOCS.map(doc => (
                          <label key={doc} className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 cursor-pointer transition ${availableDocs.includes(doc) ? "border-green-400 bg-green-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"}`}>
                            <input
                              type="checkbox"
                              checked={availableDocs.includes(doc)}
                              onChange={() => toggleDoc(doc)}
                              className="h-4 w-4 accent-green-500"
                            />
                            <span className={`text-sm font-semibold ${availableDocs.includes(doc) ? "text-green-800" : "text-gray-700"}`}>{doc}</span>
                            {availableDocs.includes(doc) && <span className="ml-auto text-green-500 font-bold text-xs">✅ है</span>}
                          </label>
                        ))}
                      </div>
                      <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800">
                        <strong>📌 ध्यान दें:</strong> Form submit होने के बाद आपको Office में आकर सभी original documents verify कराने होंगे। जो documents नहीं हैं उन्हें जल्द तैयार करें।
                      </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="rounded-2xl border-2 border-gray-200 bg-white p-5">
                      <h3 className="font-extrabold text-gray-900 text-sm mb-3">📋 Terms & Conditions</h3>
                      <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-xs text-gray-600 space-y-2 max-h-40 overflow-y-auto mb-4">
                        <p>1. <strong>Data Confidentiality:</strong> आपके द्वारा दी गई सभी जानकारी पूरी तरह गोपनीय रहेगी। आपका data सिर्फ Siksha Wallah Consultancy के पास रहेगा — किसी तीसरे पक्ष को share नहीं किया जाएगा।</p>
                        <p>2. <strong>Office Visit Mandatory:</strong> Online form submit करने के बाद admission process complete करने के लिए आपको अपने सभी original documents लेकर Siksha Wallah Office (College Chowk, Forbesganj) में आना अनिवार्य है।</p>
                        <p>3. <strong>Free Counselling:</strong> हमारी सभी counselling services पूरी तरह निःशुल्क हैं। किसी भी stage पर कोई hidden charges नहीं लिए जाएंगे।</p>
                        <p>4. <strong>Application Status:</strong> Form submit होने के बाद आप अपना application status student dashboard में track कर सकते हैं।</p>
                        <p>5. <strong>Authenticity:</strong> आप confirm करते हैं कि form में भरी गई सारी जानकारी सही और सत्य है।</p>
                      </div>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tcAccepted}
                          onChange={e => setTcAccepted(e.target.checked)}
                          className="mt-0.5 h-4 w-4 accent-[#003f9f]"
                        />
                        <span className="text-sm font-semibold text-gray-700">
                          मैं उपरोक्त सभी Terms & Conditions पढ़ और समझ चुका/चुकी हूँ और इन्हें स्वीकार करता/करती हूँ।
                        </span>
                      </label>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button" onClick={() => { setStep(2); setError(""); }}
                        className="flex-1 rounded-xl border-2 border-gray-200 py-4 text-sm font-bold text-gray-600 hover:border-gray-300 transition"
                      >
                        ← Back
                      </button>
                      <button
                        type="button" onClick={nextStep}
                        className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-[#003f9f] py-4 font-extrabold text-white hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                      >
                        Review & Submit <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                )}

                {/* ── STEP 4: Review & Submit ── */}
                {step === 4 && (
                  <div className="space-y-4">

                    {/* Personal Details card */}
                    <div className="rounded-2xl bg-white border-2 border-gray-100 shadow-sm overflow-hidden">
                      <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50 px-5 py-3">
                        <User size={16} className="text-[#003f9f]" />
                        <h2 className="font-headline text-sm font-extrabold uppercase tracking-wider text-[#003f9f]">
                          Personal Details
                        </h2>
                      </div>
                      <div className="grid grid-cols-2 gap-px bg-gray-100">
                        {[
                          { label: "Full Name", value: form.fullName },
                          { label: "Father's Name", value: form.fatherName },
                          { label: "Mobile", value: form.mobile },
                          { label: "Email", value: form.email },
                          { label: "Gender", value: form.gender },
                          { label: "Date of Birth", value: form.dob },
                          { label: "District", value: form.district },
                          { label: "State", value: form.state },
                        ].filter(r => r.value).map(r => (
                          <div key={r.label} className="bg-white px-4 py-3">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{r.label}</p>
                            <p className="mt-0.5 text-sm font-bold text-gray-800 break-words">{r.value}</p>
                          </div>
                        ))}
                        {form.address && (
                          <div className="col-span-2 bg-white px-4 py-3">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Address</p>
                            <p className="mt-0.5 text-sm font-bold text-gray-800">{form.address}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Academic & Course card */}
                    <div className="rounded-2xl bg-white border-2 border-blue-100 shadow-sm overflow-hidden">
                      <div className="flex items-center gap-3 border-b border-blue-100 bg-blue-50 px-5 py-3">
                        <GraduationCap size={16} className="text-[#003f9f]" />
                        <h2 className="font-headline text-sm font-extrabold uppercase tracking-wider text-[#003f9f]">
                          Academic &amp; Course
                        </h2>
                      </div>
                      {/* Course highlight */}
                      <div className="border-b border-blue-100 bg-blue-50/50 px-5 py-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Selected Course</p>
                        <p className="mt-1 text-lg font-extrabold text-[#003f9f]">{form.course || "—"}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-px bg-gray-100">
                        {[
                          { label: "Qualification", value: form.qualification },
                          { label: "Year of Passing", value: form.passingYear },
                          { label: "Percentage / Marks", value: form.percentage },
                          { label: "BSCC Loan Interest", value: form.bsccRequired ? "Yes" : "No" },
                        ].filter(r => r.value).map(r => (
                          <div key={r.label} className="bg-white px-4 py-3">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{r.label}</p>
                            <p className="mt-0.5 text-sm font-bold text-gray-800">{r.value}</p>
                          </div>
                        ))}
                        {form.schoolCollege && (
                          <div className="col-span-2 bg-white px-4 py-3">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">School / College</p>
                            <p className="mt-0.5 text-sm font-bold text-gray-800">{form.schoolCollege}</p>
                          </div>
                        )}
                        {form.preferredCollege && (
                          <div className="col-span-2 bg-white px-4 py-3">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Preferred College</p>
                            <p className="mt-0.5 text-sm font-bold text-gray-800">{form.preferredCollege}</p>
                          </div>
                        )}
                      </div>
                      {form.message && (
                        <div className="border-t border-blue-100 bg-blue-50/30 px-5 py-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Message</p>
                          <p className="mt-0.5 text-sm text-gray-700">{form.message}</p>
                        </div>
                      )}
                    </div>

                    {/* Documents summary */}
                    <div className="rounded-2xl bg-green-50 border-2 border-green-200 px-5 py-4">
                      <p className="font-bold text-green-900 text-sm mb-2">✅ Available Documents ({availableDocs.length}/{ALL_DOCS.length})</p>
                      {availableDocs.length > 0
                        ? <div className="flex flex-wrap gap-1.5">{availableDocs.map(d => <span key={d} className="rounded-lg bg-green-100 border border-green-300 px-2 py-0.5 text-xs font-semibold text-green-800">{d.split(" (")[0]}</span>)}</div>
                        : <p className="text-xs text-green-700">कोई document mark नहीं किया।</p>
                      }
                    </div>

                    <div className="rounded-2xl bg-amber-50 border-2 border-amber-200 px-5 py-4 text-sm text-amber-800">
                      <p className="font-bold mb-1">🏢 Submit के बाद क्या होगा?</p>
                      <ul className="space-y-1 text-xs">
                        <li>• एक counsellor <strong>30 मिनट के भीतर</strong> call/WhatsApp करेगा।</li>
                        <li>• आपको <strong>original documents लेकर Office आना होगा</strong> — College Chowk, Forbesganj।</li>
                        <li>• आपकी सारी जानकारी सिर्फ Siksha Wallah के पास रहेगी — पूरी तरह confidential।</li>
                      </ul>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button" onClick={() => { setStep(3); setError(""); }}
                        className="flex-1 rounded-xl border-2 border-gray-200 py-4 text-sm font-bold text-gray-600 hover:border-gray-300 transition"
                      >
                        ← Edit
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-[#003f9f] py-4 font-extrabold text-white hover:bg-blue-700 transition disabled:opacity-60 shadow-lg shadow-blue-200 active:scale-95"
                      >
                        {loading
                          ? <Loader size={18} className="animate-spin" />
                          : <><Send size={18} /> Submit My Application</>
                        }
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>

        {/* Help strip */}
        <section className="bg-[#001f6b] py-10 text-white text-center">
          <p className="font-headline text-lg font-bold mb-3">Need help filling the form? Our counsellors are happy to assist — free of cost.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="tel:+916203138576" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-extrabold text-[#003f9f] hover:bg-blue-50">
              <Phone size={16} /> Call +91 6203138576
            </a>
            <a
              href="https://wa.me/916203138576?text=नमस्ते!%20मैं%20किसी%20course%20के%20लिए%20apply%20करना%20चाहता/चाहती%20हूँ।%20Kripya%20guide%20karein।"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-2.5 text-sm font-extrabold text-white hover:bg-green-600"
            >
              <MessageCircle size={16} fill="currentColor" /> Chat on WhatsApp
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <ApplyForm />
    </Suspense>
  );
}

