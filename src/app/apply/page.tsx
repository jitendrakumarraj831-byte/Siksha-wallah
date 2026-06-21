"use client";

import { useState, useEffect } from "react";
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

const EMPTY: FormData = {
  fullName: "", mobile: "", email: "", fatherName: "",
  dob: "", gender: "", address: "", district: "", state: "Bihar",
  course: "", qualification: "", passingYear: "",
  percentage: "", schoolCollege: "", preferredCollege: "",
  bsccRequired: false, message: "",
};

export default function ApplyPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const [form, setForm] = useState<FormData>(EMPTY);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [appId, setAppId] = useState("");

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

  function validateStep1() {
    if (!form.fullName.trim()) return "पूरा नाम जरूरी है";
    if (!form.mobile.trim() || form.mobile.length < 10) return "10 अंकों का मोबाइल नंबर जरूरी है";
    if (!form.gender) return "Gender select करें";
    return "";
  }

  function validateStep2() {
    if (!form.course) return "Course select करें";
    if (!form.qualification) return "Qualification select करें";
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
    setStep(s => s + 1);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const e2 = validateStep2();
    if (e2) { setError(e2); return; }
    setLoading(true);
    setError("");
    try {
      const id = await saveApplication({
        userId: user?.uid || undefined,
        fullName: form.fullName,
        mobile: form.mobile,
        email: form.email || undefined,
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
      setError("Submit करने में error आई। Please call करें।");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <>
        <SiteNavbar />
        <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-lg text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 size={56} className="text-green-500" />
              </div>
            </div>
            <h1 className="font-headline text-3xl font-extrabold bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent mb-2">
              आवेदन सफलतापूर्वक जमा हो गया! 🎉
            </h1>
            <p className="text-gray-600 mb-4">
              आपकी application हमें मिल गई है। हमारा counsellor <strong>30 मिनट में</strong> आपको call या WhatsApp करेगा।
            </p>
            <div className="mb-6 rounded-2xl border-2 border-green-200 bg-white px-6 py-4">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Application Reference ID</p>
              <p className="font-headline text-2xl font-extrabold text-[#003f9f]">#{appId}</p>
              <p className="text-xs text-gray-400 mt-1">इसे note करें — यह आपकी application ID है</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <a
                href={`https://wa.me/916203138576?text=नमस्ते!%20मैंने%20${encodeURIComponent(form.course)}%20के%20लिए%20application%20submit%20की%20है।%20मेरा%20नाम%20${encodeURIComponent(form.fullName)}%20है।%20Reference%20ID:%20%23${appId}%20।%20Kripya%20guide%20karein।`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-extrabold text-white hover:bg-green-600 transition"
              >
                <MessageCircle size={18} fill="currentColor" /> WhatsApp पर Connect करें
              </a>
              <a href="tel:+916203138576" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#003f9f] px-6 py-3 font-extrabold text-white hover:bg-blue-700 transition">
                <Phone size={18} /> Call Now
              </a>
            </div>
            {user
              ? <Link href="/dashboard" className="text-sm font-bold text-[#003f9f] hover:underline">📊 My Dashboard पर जाएं →</Link>
              : <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition">← वापस Homepage पर जाएं</Link>
            }
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
              <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber-300">Admission Apply करें</span>
            </div>
            {/* H1 */}
            <h1 className="font-headline text-[2.5rem] font-black leading-[1.08] tracking-tight md:text-6xl lg:text-[4rem]">
              <span className="block text-white [text-shadow:0_2px_20px_rgba(255,255,255,0.15)]">Online Apply करें —</span>
              <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">सिर्फ 3 आसान Steps में!</span>
            </h1>
            <div className="mx-auto mt-3 h-[3px] w-28 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-transparent md:w-40" />
            <p className="mt-6 max-w-xl mx-auto text-blue-100 leading-relaxed">
              अपनी details भरें, documents upload करें, और हमारा team आपको guide करेगा।
            </p>
            {/* Step pills */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {[
                "Step 1: Details",
                "Step 2: Documents",
                "Step 3: Review & Submit",
              ].map((pill, i) => (
                <span key={pill} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.07] px-4 py-2 text-xs font-semibold text-blue-100">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-extrabold text-gray-900">{i + 1}</span>
                  {pill.replace(/^Step \d+: /, "")}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Login status banner */}
        {!authLoading && (
          <div className={`border-b py-3 text-sm text-center font-semibold ${user ? "bg-green-50 border-green-100 text-green-700" : "bg-amber-50 border-amber-100 text-amber-700"}`}>
            {user
              ? `✅ आप logged in हैं (${userProfile?.name || user.email}) — application आपके dashboard में save होगी`
              : <>⚠️ Guest के रूप में apply कर रहे हैं — application track करने के लिए{" "}
                  <Link href="/auth/login" className="underline font-bold hover:text-amber-900">login करें</Link>
                  {" "}या{" "}
                  <Link href="/auth/register" className="underline font-bold hover:text-amber-900">register करें</Link>
                </>
            }
          </div>
        )}

        {/* Progress bar */}
        <div className="bg-white border-b border-gray-100 py-4">
          <div className="container-shell">
            <div className="flex items-center gap-2 max-w-lg mx-auto">
              {[1, 2, 3].map(s => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-extrabold transition ${step >= s ? "bg-amber-400 text-gray-900" : "bg-gray-100 text-gray-400"}`}>
                    {step > s ? "✓" : s}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:block ${step >= s ? "text-amber-600" : "text-gray-400"}`}>
                    {s === 1 ? "Personal Details" : s === 2 ? "Academic & Course" : "Review & Submit"}
                  </span>
                  {s < 3 && <div className={`flex-1 h-0.5 ${step > s ? "bg-amber-400" : "bg-gray-200"}`} />}
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

              <form onSubmit={handleSubmit}>
                {/* ── STEP 1: Personal ── */}
                {step === 1 && (
                  <div className="rounded-2xl bg-white border-t-4 border-[#003f9f] border-x-2 border-b-2 border-x-gray-100 border-b-gray-100 p-7 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#003f9f] text-white">
                        <User size={20} />
                      </div>
                      <div>
                        <h2 className="font-headline text-xl font-extrabold text-gray-900">Personal Details</h2>
                        <p className="text-xs text-gray-400">आपकी basic information</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-sm font-semibold text-gray-700">पूरा नाम (Full Name) *</label>
                          <div className="relative">
                            <User size={15} className="absolute left-3.5 top-3.5 text-gray-400" />
                            <input
                              required value={form.fullName}
                              onChange={e => set("fullName", e.target.value)}
                              placeholder="Aapka poora naam"
                              className="w-full rounded-xl border-2 border-gray-200 pl-10 pr-4 py-3 text-sm outline-none focus:border-[#003f9f] transition"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-semibold text-gray-700">पिता का नाम</label>
                          <input
                            value={form.fatherName}
                            onChange={e => set("fatherName", e.target.value)}
                            placeholder="Father's name"
                            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#003f9f] transition"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-sm font-semibold text-gray-700">मोबाइल नंबर *</label>
                          <div className="relative">
                            <Phone size={15} className="absolute left-3.5 top-3.5 text-gray-400" />
                            <input
                              required type="tel" value={form.mobile}
                              onChange={e => set("mobile", e.target.value)}
                              placeholder="10-digit mobile"
                              maxLength={10}
                              className="w-full rounded-xl border-2 border-gray-200 pl-10 pr-4 py-3 text-sm outline-none focus:border-[#003f9f] transition"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Email (Optional)</label>
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
                          <label className="mb-1.5 block text-sm font-semibold text-gray-700">जन्म तिथि (DOB)</label>
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
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">पता (Address)</label>
                        <input
                          value={form.address}
                          onChange={e => set("address", e.target.value)}
                          placeholder="Village / Mohalla, Post Office..."
                          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#003f9f] transition"
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-sm font-semibold text-gray-700">जिला (District)</label>
                          <select
                            value={form.district}
                            onChange={e => set("district", e.target.value)}
                            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#003f9f] bg-white transition"
                          >
                            <option value="">-- Bihar District --</option>
                            {DISTRICTS_BIHAR.map(d => <option key={d}>{d}</option>)}
                            <option>Other State</option>
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
                      Next — Academic Details <ArrowRight size={18} />
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
                        <h2 className="font-headline text-xl font-extrabold text-gray-900">Academic & Course Details</h2>
                        <p className="text-xs text-gray-400">Educational background and course preference</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Course जिसमें Apply करना है *</label>
                        <select
                          value={form.course}
                          onChange={e => set("course", e.target.value)}
                          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#003f9f] bg-white transition"
                        >
                          <option value="">-- Course Select करें --</option>
                          <optgroup label="🎓 Teaching">
                            {["B.Ed", "D.El.Ed", "M.Ed", "B.P.Ed"].map(c => <option key={c}>{c}</option>)}
                          </optgroup>
                          <optgroup label="🏥 Medical & Nursing">
                            {["MBBS", "BDS", "B.Sc Nursing", "GNM", "ANM", "B.Pharma", "D.Pharma", "BMLT", "BASLP"].map(c => <option key={c}>{c}</option>)}
                          </optgroup>
                          <optgroup label="💻 Technical">
                            {["B.Tech", "Polytechnic", "ITI", "Diploma"].map(c => <option key={c}>{c}</option>)}
                          </optgroup>
                          <optgroup label="📊 Management & Commerce">
                            {["BBA", "MBA", "BCA", "MCA", "B.Com", "M.Com"].map(c => <option key={c}>{c}</option>)}
                          </optgroup>
                          <optgroup label="📚 General Degree">
                            {["BA", "B.Sc", "MA", "M.Sc"].map(c => <option key={c}>{c}</option>)}
                          </optgroup>
                          <option>BSCC Guidance Only</option>
                          <option>Not Sure — Need Guidance</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Current Qualification *</label>
                        <select
                          value={form.qualification}
                          onChange={e => set("qualification", e.target.value)}
                          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#003f9f] bg-white transition"
                        >
                          <option value="">-- Qualification Select करें --</option>
                          {QUALIFICATIONS.map(q => <option key={q}>{q}</option>)}
                        </select>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Passing Year</label>
                          <input
                            value={form.passingYear}
                            onChange={e => set("passingYear", e.target.value)}
                            placeholder="2023"
                            maxLength={4}
                            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#003f9f] transition"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Percentage / Marks</label>
                          <input
                            value={form.percentage}
                            onChange={e => set("percentage", e.target.value)}
                            placeholder="e.g. 65% या 450/500"
                            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#003f9f] transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">School / College का नाम</label>
                        <input
                          value={form.schoolCollege}
                          onChange={e => set("schoolCollege", e.target.value)}
                          placeholder="Jahan se last padhai ki"
                          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#003f9f] transition"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">College Preference (Optional)</label>
                        <input
                          value={form.preferredCollege}
                          onChange={e => set("preferredCollege", e.target.value)}
                          placeholder="Koi preferred college hai to likhein"
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
                          <p className="text-sm font-bold text-gray-800">BSCC (Bihar Student Credit Card) Loan चाहिए</p>
                          <p className="text-xs text-gray-400">₹4 Lakh तक interest-free loan — check करें eligibility</p>
                        </div>
                      </label>

                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Extra Message / Question (Optional)</label>
                        <textarea
                          value={form.message}
                          onChange={e => set("message", e.target.value)}
                          rows={3}
                          placeholder="Koi special requirement ya question..."
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
                        Review Application <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                )}

                {/* ── STEP 3: Review & Submit ── */}
                {step === 3 && (
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
                          { label: "नाम", value: form.fullName },
                          { label: "पिता का नाम", value: form.fatherName },
                          { label: "Mobile", value: form.mobile },
                          { label: "Email", value: form.email },
                          { label: "Gender", value: form.gender },
                          { label: "DOB", value: form.dob },
                          { label: "जिला", value: form.district },
                          { label: "State", value: form.state },
                        ].filter(r => r.value).map(r => (
                          <div key={r.label} className="bg-white px-4 py-3">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{r.label}</p>
                            <p className="mt-0.5 text-sm font-bold text-gray-800 break-words">{r.value}</p>
                          </div>
                        ))}
                        {form.address && (
                          <div className="col-span-2 bg-white px-4 py-3">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">पता</p>
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
                          { label: "Passing Year", value: form.passingYear },
                          { label: "Percentage", value: form.percentage },
                          { label: "BSCC Required", value: form.bsccRequired ? "✅ हाँ" : "नहीं" },
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

                    <div className="rounded-2xl bg-amber-50 border-2 border-amber-200 px-5 py-4 text-sm text-amber-800">
                      <p className="font-bold mb-1">📞 क्या होगा Submit के बाद?</p>
                      <ul className="space-y-1 text-xs">
                        <li>✅ आपकी application हमारे system में save होगी</li>
                        <li>✅ हमारा counsellor 30 मिनट में call/WhatsApp करेगा</li>
                        <li>✅ Free guidance — कोई charge नहीं</li>
                      </ul>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button" onClick={() => { setStep(2); setError(""); }}
                        className="flex-1 rounded-xl border-2 border-gray-200 py-4 text-sm font-bold text-gray-600 hover:border-gray-300 transition"
                      >
                        ← Edit
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-[#dc143c] py-4 font-extrabold text-white hover:bg-red-700 transition disabled:opacity-60 shadow-lg shadow-red-200 active:scale-95"
                      >
                        {loading
                          ? <Loader size={18} className="animate-spin" />
                          : <><Send size={18} /> Application Submit करें</>
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
          <p className="font-headline text-lg font-bold mb-3">सवाल है? हमें कॉल करें — निःशुल्क मार्गदर्शन</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="tel:+916203138576" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-extrabold text-[#003f9f] hover:bg-blue-50">
              <Phone size={16} /> +91 6203138576
            </a>
            <a
              href="https://wa.me/916203138576?text=नमस्ते!%20मैं%20किसी%20course%20के%20लिए%20apply%20करना%20चाहता/चाहती%20हूँ।%20Kripya%20guide%20karein।"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-2.5 text-sm font-extrabold text-white hover:bg-green-600"
            >
              <MessageCircle size={16} fill="currentColor" /> WhatsApp करें
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

