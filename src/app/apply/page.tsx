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
            <h1 className="font-headline text-3xl font-extrabold text-gray-900 mb-2">
              Application Submit हो गई! 🎉
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
                href={`https://wa.me/916203138576?text=Hi! Maine course application submit ki hai. Mera naam ${form.fullName} hai aur main ${form.course} ke liye apply kiya hun. Reference: #${appId}`}
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
        <section className="bg-gradient-to-br from-[#001f6b] to-[#003f9f] py-14 text-white text-center">
          <div className="container-shell">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold">
              <FileText size={15} className="text-amber-400" /> Online Course Application Form
            </div>
            <h1 className="font-headline text-4xl md:text-5xl font-extrabold mt-3">
              Course के लिए <span className="text-amber-400">Apply करें</span>
            </h1>
            <p className="mt-3 text-blue-100 max-w-xl mx-auto">
              अपनी सारी details भरें। हमारा expert counsellor 30 मिनट में contact करेगा — Free Guidance।
            </p>
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
                  <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-extrabold transition ${step >= s ? "bg-[#003f9f] text-white" : "bg-gray-100 text-gray-400"}`}>
                    {step > s ? "✓" : s}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:block ${step >= s ? "text-[#003f9f]" : "text-gray-400"}`}>
                    {s === 1 ? "Personal Details" : s === 2 ? "Academic & Course" : "Review & Submit"}
                  </span>
                  {s < 3 && <div className={`flex-1 h-0.5 ${step > s ? "bg-[#003f9f]" : "bg-gray-200"}`} />}
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
                  <div className="rounded-2xl bg-white border-2 border-gray-100 p-7 shadow-sm">
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
                          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Mobile Number *</label>
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
                  <div className="rounded-2xl bg-white border-2 border-gray-100 p-7 shadow-sm">
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
                    <div className="rounded-2xl bg-white border-2 border-gray-100 p-7 shadow-sm">
                      <h2 className="font-headline text-xl font-extrabold text-gray-900 mb-5">
                        Application Review करें
                      </h2>

                      <div className="space-y-4">
                        {/* Personal */}
                        <div className="rounded-xl bg-gray-50 p-4">
                          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#003f9f] mb-3">Personal Details</h3>
                          <div className="grid gap-2 sm:grid-cols-2 text-sm">
                            <Row label="नाम" value={form.fullName} />
                            <Row label="पिता का नाम" value={form.fatherName} />
                            <Row label="Mobile" value={form.mobile} />
                            <Row label="Email" value={form.email} />
                            <Row label="Gender" value={form.gender} />
                            <Row label="DOB" value={form.dob} />
                            <Row label="जिला" value={form.district} />
                            <Row label="State" value={form.state} />
                            {form.address && <Row label="पता" value={form.address} span />}
                          </div>
                        </div>

                        {/* Academic */}
                        <div className="rounded-xl bg-blue-50 p-4">
                          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#003f9f] mb-3">Academic & Course</h3>
                          <div className="grid gap-2 sm:grid-cols-2 text-sm">
                            <Row label="Course" value={form.course} highlight />
                            <Row label="Qualification" value={form.qualification} />
                            <Row label="Passing Year" value={form.passingYear} />
                            <Row label="Percentage" value={form.percentage} />
                            <Row label="School/College" value={form.schoolCollege} />
                            <Row label="Preferred College" value={form.preferredCollege} />
                            <Row label="BSCC Required" value={form.bsccRequired ? "✅ हाँ चाहिए" : "नहीं"} />
                          </div>
                          {form.message && (
                            <div className="mt-3 rounded-lg bg-white/60 px-3 py-2 text-xs text-gray-600">
                              <span className="font-semibold">Message:</span> {form.message}
                            </div>
                          )}
                        </div>
                      </div>
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
        <section className="bg-[#003f9f] py-10 text-white text-center">
          <p className="font-headline text-lg font-bold mb-3">सवाल है? हमें call करें — Free Guidance</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="tel:+916203138576" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-extrabold text-[#003f9f] hover:bg-blue-50">
              <Phone size={16} /> +91 6203138576
            </a>
            <a
              href="https://wa.me/916203138576?text=Hi! Main course ke liye apply karna chahta/chahti hun."
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

function Row({ label, value, highlight, span }: { label: string; value?: string | boolean; highlight?: boolean; span?: boolean }) {
  if (!value) return null;
  return (
    <div className={span ? "sm:col-span-2" : ""}>
      <span className="text-xs text-gray-400 font-semibold">{label}:</span>{" "}
      <span className={`font-bold ${highlight ? "text-[#003f9f]" : "text-gray-800"}`}>
        {String(value)}
      </span>
    </div>
  );
}
