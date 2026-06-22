"use client";

import Link from "next/link";
import { useState } from "react";
import { saveInquiry } from "@/services/inquiry-service";
import { saveActivity } from "@/services/activity-service";
import {
  ArrowRight, BadgeCheck, BookOpen, Building2, Check,
  ChevronDown, CreditCard, GraduationCap, MapPin,
  MessageCircle, Phone, ShieldCheck, Sparkles, Star, Users, X,
  Clock, Award, CheckCircle2,
  Briefcase, BookMarked, ChevronUp, FileCheck2, FileText, ListChecks,
} from "lucide-react";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { CountUp } from "@/components/count-up";
import { AnimateIn } from "@/components/animate-in";
import { streamTabs, colorMap, faqs, type StreamKey } from "@/lib/courses-data";

/* ─── Data imported from @/lib/courses-data ────────── */
/* ─── Multi-step Form ─────────────────────────────── */
const STEPS = ["Name", "Mobile", "Course", "Qualify"];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeStream, setActiveStream] = useState<StreamKey>("teaching");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [bsccEligible, setBsccEligible] = useState<null | boolean>(null);
  const [bsccIncome, setBsccIncome] = useState("");
  const [bsccBihar, setBsccBihar] = useState("");
  const [bsccAge, setBsccAge] = useState("");

  // Multi-step form
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ name: "", mobile: "", course: "", district: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const stream = streamTabs.find((s) => s.key === activeStream)!;
  const colors = colorMap[stream.color];

  function handleBsccCheck(e: React.FormEvent) {
    e.preventDefault();
    const eligible =
      bsccBihar === "yes" &&
      bsccAge !== "" &&
      parseInt(bsccAge) <= 25 &&
      bsccIncome === "below";
    setBsccEligible(eligible);
    saveActivity({
      type: "bscc_check",
      title: "BSCC Eligibility Checked",
      description: eligible ? "✅ Eligible — Bihar resident, age ≤25, income below 4.5L" : "❌ Not eligible",
      page: "/",
      meta: { bihar: bsccBihar, age: bsccAge, income: bsccIncome, result: eligible ? "eligible" : "not_eligible" },
    });
  }

  function nextStep() {
    if (step < STEPS.length - 1) setStep(step + 1);
    else {
      setFormSubmitted(true);
      saveInquiry({ fullName: formData.name, mobile: formData.mobile, course: formData.course, qualification: formData.district, message: `District: ${formData.district}` }).catch(() => {});
      // Log inquiry activity
      saveActivity({
        type: "inquiry",
        title: "📋 New Inquiry Submitted",
        description: `${formData.name} → ${formData.course} (${formData.district})`,
        name: formData.name,
        mobile: formData.mobile,
        course: formData.course,
        page: "/",
      });
      const msg = `नमस्ते! मेरा नाम ${encodeURIComponent(formData.name)} है।%0AMobile: ${formData.mobile}%0AAdmission चाहिए: ${encodeURIComponent(formData.course)}%0AJila: ${encodeURIComponent(formData.district)}%0AKripya guide karein.`;
      // Log WhatsApp click
      saveActivity({
        type: "whatsapp",
        title: "📱 WhatsApp Opened",
        description: `${formData.name} ne WhatsApp click kiya — ${formData.course}`,
        name: formData.name,
        mobile: formData.mobile,
        page: "/",
      });
      window.open(`https://wa.me/916203138576?text=${msg}`, "_blank");
    }
  }

  return (
    <main className="bg-white text-gray-900">

      <SiteNavbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#00102e] via-[#001850] to-[#003590] text-white">

        {/* Subtle dot-grid background */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        {/* Glow orbs */}
        <div className="pointer-events-none absolute -top-40 -right-32 h-[480px] w-[480px] rounded-full bg-amber-400 opacity-[0.10] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-500 opacity-[0.13] blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-indigo-700 opacity-[0.08] blur-3xl" />

        <div className="container-shell relative">

          {/* ── TOP TRUST BADGE STRIP ── */}
          <div className="no-scrollbar flex items-center gap-3 overflow-x-auto border-b border-white/[0.08] py-4">
            {[
              { icon: ShieldCheck,   text: "NCTE / UGC Recognised Colleges" },
              { icon: CreditCard,    text: "Complete BSCC Loan Support" },
              { icon: Users,         text: "5,000+ Students Guided" },
              { icon: Building2,     text: "200+ Partner Colleges" },
              { icon: Award,         text: "9+ Years of Trusted Counselling" },
              { icon: CheckCircle2,  text: "100% Transparent. No Hidden Fees." },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex flex-shrink-0 items-center gap-1.5 rounded-full border border-white/[0.12] bg-white/[0.06] px-4 py-2 text-xs font-semibold text-white/85 backdrop-blur-sm">
                <Icon size={13} className="flex-shrink-0 text-amber-400" />
                {text}
              </div>
            ))}
          </div>

          {/* ── MAIN GRID ── */}
          <div className="grid grid-cols-1 gap-10 py-14 md:py-20 lg:grid-cols-[1.25fr_0.8fr] lg:gap-14 lg:items-start">

            {/* ── LEFT: text + CTAs + floating cards ── */}
            <div className="order-1">

              {/* Platform label pill */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/[0.1] px-4 py-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
                <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber-300">Bihar&apos;s Most Trusted Education Consultancy</span>
              </div>

              {/* H1 */}
              <h1 className="font-headline text-[2.5rem] font-black leading-[1.08] tracking-tight md:text-6xl lg:text-[4.2rem] lg:leading-[1.04]">
                <span className="block text-white [text-shadow:0_2px_20px_rgba(255,255,255,0.15)]">
                  The Right Course.
                </span>
                <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent [filter:drop-shadow(0_4px_24px_rgba(251,191,36,0.45))]">
                  The Right College.
                </span>
                <span className="block text-white [text-shadow:0_2px_20px_rgba(255,255,255,0.15)]">
                  The Right Future.
                </span>
              </h1>

              {/* Accent line */}
              <div className="mt-3 h-[3px] w-28 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-transparent md:w-40" />

              {/* Course highlight pill */}
              <div className="mt-6 inline-flex flex-wrap items-center gap-2 rounded-2xl border border-amber-400/25 bg-amber-400/[0.08] px-5 py-3">
                <GraduationCap size={16} className="flex-shrink-0 text-amber-400" />
                <span className="text-sm font-semibold text-amber-100">
                  B.Ed • D.El.Ed • Nursing • MBA • BCA • MCA
                </span>
                <span className="rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-2.5 py-0.5 text-[11px] font-extrabold text-gray-900">
                  + 40 more courses
                </span>
              </div>

              {/* Sub-heading */}
              <p className="mt-5 max-w-lg text-[1rem] leading-[1.8] text-blue-100 md:text-[1.06rem]">
                Personalised admission counselling, smart college selection,{" "}
                <strong className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent font-extrabold">
                  complete BSCC loan assistance
                </strong>{" "}
                and dedicated career mentorship —{" "}
                <strong className="font-extrabold text-white">all under one trusted roof.</strong>
              </p>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#inquiry"
                  className="group relative flex items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 px-8 py-4 font-extrabold text-gray-900 shadow-xl shadow-amber-500/30 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/50 active:scale-[0.97]"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                  <Sparkles size={17} className="flex-shrink-0" />
                  Book Free Counselling
                  <ArrowRight size={16} className="flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
                <a
                  href="https://wa.me/916203138576"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 rounded-2xl border-2 border-white/25 bg-white/[0.08] px-8 py-4 font-bold text-white backdrop-blur transition-all duration-200 hover:bg-white/[0.15] hover:-translate-y-1 hover:border-white/40 active:scale-[0.97]"
                >
                  <MessageCircle size={17} />
                  Chat on WhatsApp
                </a>
              </div>

              {/* Trust line */}
              <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
                {[
                  "200+ Partner Colleges",
                  "5,000+ Successful Admissions",
                  "9+ Years of Experience",
                  "100% Transparent Counselling",
                ].map((t, i, arr) => (
                  <span key={t} className="flex items-center gap-1.5 text-xs font-medium text-blue-300">
                    <Check size={11} className="text-amber-400" />
                    {t}
                    {i < arr.length - 1 && <span className="ml-1 text-white/15">|</span>}
                  </span>
                ))}
              </div>

              {/* Floating achievement cards — desktop only */}
              <div className="mt-9 hidden gap-3 lg:flex">
                <div className="flex items-center gap-3 rounded-2xl border border-white/[0.12] bg-white/[0.06] px-4 py-3 backdrop-blur-sm">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-green-500/20 ring-1 ring-green-500/30">
                    <CheckCircle2 size={19} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Recently Admitted</p>
                    <p className="mt-0.5 text-[11px] text-blue-300">Rahul K. — B.Ed, Patna University</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/[0.12] bg-white/[0.06] px-4 py-3 backdrop-blur-sm">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-500/20 ring-1 ring-amber-500/30">
                    <CreditCard size={19} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">BSCC Loan Approved</p>
                    <p className="mt-0.5 text-[11px] text-blue-300">Priya S. — ₹4 Lakh loan for GNM Nursing</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Lead Form ── */}
            <div id="inquiry" className="order-2 rounded-3xl border border-white/[0.15] bg-white/[0.08] p-6 shadow-2xl backdrop-blur-xl md:p-8">

              {/* Form header */}
              <div className="mb-6 text-center">
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/[0.1] px-3 py-1.5">
                  <Sparkles size={11} className="text-amber-400" />
                  <span className="text-[11px] font-bold text-amber-300">100% Free • No Hidden Charges</span>
                </div>
                <h3 className="font-headline text-[1.35rem] font-extrabold leading-tight text-white">
                  Free Admission Counselling
                </h3>
                <p className="mt-1.5 text-xs text-blue-300">
                  Share a few details and receive personalised guidance within minutes.
                </p>
              </div>

              {formSubmitted ? (
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 ring-2 ring-green-500/40">
                    <CheckCircle2 size={36} className="text-green-400" />
                  </div>
                  <h3 className="font-headline text-2xl font-extrabold">Thank You</h3>
                  <p className="text-sm text-blue-100">हमारी counselling team जल्द ही WhatsApp पर आपसे संपर्क करेगी।</p>
                  <button
                    onClick={() => { setFormSubmitted(false); setStep(0); setFormData({ name: "", mobile: "", course: "", district: "" }); }}
                    className="rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 px-6 py-3 font-bold text-gray-900 transition-all hover:opacity-90 active:scale-95"
                  >
                    Send Another Enquiry
                  </button>
                </div>
              ) : (
                <>
                  {/* Progress dots */}
                  <div className="mb-6 flex items-center justify-center gap-2">
                    {STEPS.map((_, i) => (
                      <div key={i} className={`h-2 rounded-full transition-all duration-300 ease-out ${
                        i === step ? "w-8 bg-amber-400" : i < step ? "w-3 bg-amber-400/50" : "w-3 bg-white/20"
                      }`} />
                    ))}
                  </div>

                  <div className="space-y-4">
                    {step === 0 && (
                      <>
                        <label className="block text-sm font-bold text-blue-100">
                          Student&apos;s Full Name <span className="text-amber-400">*</span>
                        </label>
                        <input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="अपना पूरा नाम दर्ज करें"
                          autoComplete="name"
                          className="w-full rounded-xl border border-white/20 bg-white/[0.12] px-4 py-3.5 text-white placeholder-blue-300/60 outline-none transition focus:border-amber-400 focus:bg-white/[0.18] focus:ring-2 focus:ring-amber-400/25"
                        />
                      </>
                    )}
                    {step === 1 && (
                      <>
                        <label className="block text-sm font-bold text-blue-100">
                          Mobile Number <span className="text-amber-400">*</span>
                        </label>
                        <input
                          value={formData.mobile}
                          onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                          type="tel"
                          inputMode="numeric"
                          placeholder="Your 10-digit mobile number"
                          autoComplete="tel"
                          className="w-full rounded-xl border border-white/20 bg-white/[0.12] px-4 py-3.5 text-white placeholder-blue-300/60 outline-none transition focus:border-amber-400 focus:bg-white/[0.18] focus:ring-2 focus:ring-amber-400/25"
                        />
                      </>
                    )}
                    {step === 2 && (
                      <>
                        <label className="block text-sm font-bold text-blue-100">
                          Course of Interest <span className="text-amber-400">*</span>
                        </label>
                        <select
                          value={formData.course}
                          onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                          className="w-full rounded-xl border border-white/20 bg-[#001e5a] px-4 py-3.5 text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/25"
                        >
                          <option value="">-- Select a course --</option>
                          <optgroup label="Teaching (शिक्षण)">
                            <option>B.Ed</option><option>D.El.Ed</option><option>B.P.Ed</option><option>M.Ed</option>
                          </optgroup>
                          <optgroup label="Medical & Nursing (चिकित्सा)">
                            <option>MBBS</option><option>BDS</option><option>B.Sc Nursing</option>
                            <option>GNM</option><option>ANM</option><option>B.Pharma</option>
                            <option>D.Pharma</option><option>BMLT</option>
                          </optgroup>
                          <optgroup label="Engineering, IT & Management">
                            <option>B.Tech</option><option>Polytechnic</option><option>ITI</option>
                            <option>BCA</option><option>MCA</option><option>BBA</option><option>MBA</option>
                          </optgroup>
                          <option>Not yet decided — I want guidance</option>
                        </select>
                      </>
                    )}
                    {step === 3 && (
                      <>
                        <label className="block text-sm font-bold text-blue-100">
                          Your District <span className="text-amber-400">*</span>
                        </label>
                        <select
                          value={formData.district}
                          onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                          className="w-full rounded-xl border border-white/20 bg-[#001e5a] px-4 py-3.5 text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/25"
                        >
                          <option value="">-- Select your district --</option>
                          <option>Araria</option><option>Arwal</option><option>Aurangabad</option>
                          <option>Banka</option><option>Begusarai</option><option>Bhagalpur</option>
                          <option>Bhojpur</option><option>Buxar</option><option>Darbhanga</option>
                          <option>East Champaran</option><option>Gaya</option><option>Gopalganj</option>
                          <option>Jamui</option><option>Jehanabad</option><option>Kaimur</option>
                          <option>Katihar</option><option>Khagaria</option><option>Kishanganj</option>
                          <option>Lakhisarai</option><option>Madhepura</option><option>Madhubani</option>
                          <option>Munger</option><option>Muzaffarpur</option><option>Nalanda</option>
                          <option>Nawada</option><option>Patna</option><option>Purnia</option>
                          <option>Rohtas</option><option>Saharsa</option><option>Samastipur</option>
                          <option>Saran</option><option>Sheikhpura</option><option>Sheohar</option>
                          <option>Sitamarhi</option><option>Siwan</option><option>Supaul</option>
                          <option>Vaishali</option><option>West Champaran</option>
                          <option>I&apos;m from outside Bihar</option>
                        </select>
                      </>
                    )}

                    <div className="flex gap-2 pt-1">
                      {step > 0 && (
                        <button
                          onClick={() => setStep(step - 1)}
                          className="flex-1 rounded-xl border border-white/25 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-[0.97]"
                        >
                          ← Back
                        </button>
                      )}
                      <button
                        onClick={nextStep}
                        className="group relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 py-3.5 font-extrabold text-gray-900 shadow-lg shadow-amber-500/25 transition-all hover:-translate-y-0.5 hover:shadow-amber-500/40 active:scale-[0.97]"
                      >
                        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                        {step < STEPS.length - 1 ? (
                          <>Continue <ArrowRight size={15} className="flex-shrink-0 transition-transform group-hover:translate-x-1" /></>
                        ) : (
                          "Get My Free Counselling →"
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="mt-5 text-center text-[11px] text-blue-300/70">
                    100% free • No spam, ever • Your information stays private
                  </p>
                </>
              )}
            </div>
          </div>

          {/* ── STATS BAR ── */}
          <div className="grid grid-cols-2 gap-6 border-t border-white/[0.08] py-10 md:grid-cols-4">
            {([
              { target: 5000, suffix: "+", label: "Students Successfully Guided", icon: Users     },
              { target: 200,  suffix: "+", label: "Approved Partner Colleges",    icon: Building2 },
              { target: 98,   suffix: "%", label: "Parent Satisfaction Rating",   icon: Star      },
              { target: 9,    suffix: "+", label: "Years of Trusted Counselling", icon: Award     },
            ] as const).map(({ target, suffix, label, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="mb-2 flex justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 ring-1 ring-amber-400/20">
                    <Icon size={18} className="text-amber-400" />
                  </div>
                </div>
                <p className="font-headline text-3xl font-black text-amber-400 md:text-4xl">
                  <CountUp target={target} suffix={suffix} />
                </p>
                <p className="mt-1 text-xs text-blue-200 md:text-sm">{label}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── COURSE MARQUEE ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#001f6b] via-[#002f8a] to-[#001f6b] py-4 border-t border-white/10">
        {/* Edge fades */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[#001f6b] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[#001f6b] to-transparent" />
        <div className="flex w-max marquee">
          {([
            { name: "B.Ed",         stream: "teaching"  },
            { name: "D.El.Ed",      stream: "teaching"  },
            { name: "M.Ed",         stream: "teaching"  },
            { name: "B.P.Ed",       stream: "teaching"  },
            { name: "MBBS",         stream: "medical"   },
            { name: "BDS",          stream: "medical"   },
            { name: "B.Sc Nursing", stream: "medical"   },
            { name: "GNM",          stream: "medical"   },
            { name: "ANM",          stream: "medical"   },
            { name: "B.Pharma",     stream: "medical"   },
            { name: "D.Pharma",     stream: "medical"   },
            { name: "BMLT",         stream: "medical"   },
            { name: "B.Tech",       stream: "technical" },
            { name: "Polytechnic",  stream: "technical" },
            { name: "ITI",          stream: "technical" },
            { name: "BCA",          stream: "technical" },
            { name: "MCA",          stream: "technical" },
            { name: "BBA",          stream: "technical" },
            { name: "MBA",          stream: "technical" },
            { name: "B.Ed",         stream: "teaching"  },
            { name: "D.El.Ed",      stream: "teaching"  },
            { name: "M.Ed",         stream: "teaching"  },
            { name: "B.P.Ed",       stream: "teaching"  },
            { name: "MBBS",         stream: "medical"   },
            { name: "BDS",          stream: "medical"   },
            { name: "B.Sc Nursing", stream: "medical"   },
            { name: "GNM",          stream: "medical"   },
            { name: "ANM",          stream: "medical"   },
            { name: "B.Pharma",     stream: "medical"   },
            { name: "D.Pharma",     stream: "medical"   },
            { name: "BMLT",         stream: "medical"   },
            { name: "B.Tech",       stream: "technical" },
            { name: "Polytechnic",  stream: "technical" },
            { name: "ITI",          stream: "technical" },
            { name: "BCA",          stream: "technical" },
            { name: "MCA",          stream: "technical" },
            { name: "BBA",          stream: "technical" },
            { name: "MBA",          stream: "technical" },
          ] as { name: string; stream: string }[]).map((c, i) => (
            <a
              key={i}
              href={`/courses?stream=${c.stream}`}
              className="mx-2 inline-block whitespace-nowrap rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium text-white/90 backdrop-blur-sm transition-colors hover:bg-white/25 hover:border-white/40"
            >
              {c.name}
            </a>
          ))}
        </div>
      </div>

      {/* ── BOTTOM TRUST BAR ── */}
      <div className="border-t border-white/[0.05] bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 py-5">
        <div className="container-shell">
          <div className="flex flex-wrap items-center justify-center gap-5 md:gap-8">
            {[
              { icon: ShieldCheck,  text: "100% Free Initial Counselling",   color: "text-green-400"  },
              { icon: GraduationCap, text: "NCTE / UGC Recognised Colleges",  color: "text-blue-400"   },
              { icon: CreditCard,   text: "End-to-End BSCC Loan Support",     color: "text-amber-400"  },
              { icon: Phone,        text: "Personal Counsellor for Every Student", color: "text-purple-400" },
            ].map(({ icon: Icon, text, color }) => (
              <span key={text} className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                <Icon size={15} className={color} />
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── COURSES SECTION ── */}
      <section id="courses" className="py-24 bg-gray-50">
        <div className="container-shell">
          <AnimateIn type="fade-up" className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-primary-blue mb-2">All Major Streams Covered</p>
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold">Choose Your Stream</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              तीन प्रमुख streams — 40+ recognised courses — हर field में अनुभवी काउंसलर की निःशुल्क सहायता उपलब्ध।
            </p>
          </AnimateIn>

          {/* Stream Tabs */}
          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {streamTabs.map(({ key, label, icon: Icon, color }) => {
              const c = colorMap[color];
              const isActive = activeStream === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveStream(key)}
                  className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold border-2 transition-all ${
                    isActive
                      ? `${c.active} text-white border-transparent shadow-lg`
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              );
            })}
          </div>

          {/* Partnered Colleges Banner */}
          {activeStream === "teaching" && (
            <div className="mb-8 rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
                  <Building2 size={22} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-headline text-lg font-extrabold text-blue-900">Our Approved Teaching Partner Colleges</h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-bold text-white"><BadgeCheck size={11} /> NCTE Approved</span>
                  </div>
                  <p className="text-sm text-blue-800 leading-relaxed mb-3">
                    हम केवल <strong>NCTE (National Council for Teacher Education)-approved</strong> teacher training colleges के साथ काम करते हैं — Bihar (Patna, Purnea, Katihar) सहित अन्य राज्यों में।
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[
                      "NCTE-approved B.Ed and D.El.Ed colleges in Patna, Purnea and Katihar",
                      "NCTE-recognised teacher training institutions in other states",
                      "Complete Bihar Student Credit Card (BSCC) loan support",
                      "Guidance for both Regular and Distance Mode programmes",
                    ].map((point, i) => (
                      <div key={i} className="flex items-start gap-2 rounded-lg bg-white/70 border border-blue-100 px-3 py-2 text-xs text-blue-800 font-medium">
                        <CheckCircle2 size={13} className="mt-0.5 flex-shrink-0 text-blue-500" /> {point}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeStream === "medical" && (
            <div className="mb-8 rounded-2xl border-2 border-red-200 bg-gradient-to-r from-red-50 to-pink-50 p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-md">
                  <Building2 size={22} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-headline text-lg font-extrabold text-red-900">Our Approved Medical & Nursing Partner Colleges</h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-bold text-white"><BadgeCheck size={11} /> INC & PCI Approved</span>
                  </div>
                  <p className="text-sm text-red-800 leading-relaxed mb-3">
                    हम <strong>INC (Indian Nursing Council) और PCI (Pharmacy Council of India) approved</strong> premier institutes के साथ काम करते हैं — Bangalore, Madhya Pradesh, West Bengal और अन्य राज्यों में।
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[
                      "INC-approved Nursing colleges in Bangalore and West Bengal",
                      "PCI-approved Pharmacy institutes in Madhya Pradesh and other states",
                      "Trusted private medical colleges with hostel facilities",
                      "Full support for NEET counselling as well as direct admission",
                    ].map((point, i) => (
                      <div key={i} className="flex items-start gap-2 rounded-lg bg-white/70 border border-red-100 px-3 py-2 text-xs text-red-800 font-medium">
                        <CheckCircle2 size={13} className="mt-0.5 flex-shrink-0 text-red-500" /> {point}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeStream === "technical" && (
            <div className="mb-8 rounded-2xl border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-orange-600 text-white shadow-md">
                  <Building2 size={22} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-headline text-lg font-extrabold text-orange-900">Our Approved Engineering & Management Partner Colleges</h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-600 px-2.5 py-0.5 text-xs font-bold text-white"><BadgeCheck size={11} /> AICTE & UGC Recognised</span>
                  </div>
                  <p className="text-sm text-orange-800 leading-relaxed mb-3">
                    हम <strong>AICTE (All India Council for Technical Education) और UGC-recognised</strong> top universities के साथ काम करते हैं — Engineering, Management और Computer Applications courses के लिए।
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[
                      "AICTE-approved B.Tech and Polytechnic colleges across India",
                      "UGC-recognised universities for BCA, MCA, BBA and MBA",
                      "Complete JEE / DCECE counselling guidance included",
                      "UGC-DEB approved Distance Mode options also available",
                    ].map((point, i) => (
                      <div key={i} className="flex items-start gap-2 rounded-lg bg-white/70 border border-orange-100 px-3 py-2 text-xs text-orange-800 font-medium">
                        <CheckCircle2 size={13} className="mt-0.5 flex-shrink-0 text-orange-500" /> {point}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Course Cards Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stream.courses.map((course) => {
              const isExpanded = expandedCard === course.name;
              return (
                <div
                  key={course.name}
                  className={`group relative rounded-2xl border-2 bg-white shadow-sm transition-all ${colors.card} ${isExpanded ? "border-opacity-100 shadow-lg" : "border-gray-200"}`}
                >
                  {/* Card Header — always visible */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-2">
                      <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${colors.badge}`}>
                        <Award size={12} /> {course.name}
                      </div>
                      {course.bscc && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                          <CreditCard size={10} /> BSCC
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 font-headline text-xl font-extrabold text-gray-900 leading-tight">{course.full}</h3>

                    {/* Core facts — always shown */}
                    <div className="mt-4 space-y-2.5 text-sm text-gray-600">
                      <div className="flex items-start gap-2">
                        <Clock size={14} className="mt-0.5 flex-shrink-0 text-gray-400" />
                        <span><strong className="text-gray-800">Duration:</strong> {course.duration}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 text-gray-400" />
                        <span><strong className="text-gray-800">Eligibility:</strong> {course.eligibility}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CreditCard size={14} className="mt-0.5 flex-shrink-0 text-gray-400" />
                        <span><strong className="text-gray-800">Approx. Fee:</strong> {course.fee}</span>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-5 space-y-4 border-t border-gray-100 pt-4">

                        {/* Key Highlights */}
                        <div className="rounded-xl bg-blue-50 border border-blue-100 p-3">
                          <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600">
                            <Star size={12} /> Key Highlights
                          </div>
                          <ul className="space-y-1">
                            {course.highlights.map((h, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-xs text-blue-800">
                                <CheckCircle2 size={12} className="mt-0.5 flex-shrink-0 text-blue-500" /> {h}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Hindi Description */}
                        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
                          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600">
                            <Sparkles size={12} /> हिंदी में जानें
                          </div>
                          <p className="text-sm leading-relaxed text-amber-900">{course.hindiDesc}</p>
                        </div>

                        {/* Salary */}
                        <div className="flex items-start gap-2">
                          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-green-100">
                            <Award size={13} className="text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Expected Salary</p>
                            <p className="text-sm font-bold text-green-700">{course.salary}</p>
                          </div>
                        </div>

                        {/* Entrance Exam */}
                        <div className="flex items-start gap-2">
                          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100">
                            <FileText size={13} className="text-purple-600" />
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Entrance Exam</p>
                            <p className="text-sm leading-relaxed text-gray-700">{course.entranceExam}</p>
                          </div>
                        </div>

                        {/* Govt Jobs */}
                        <div className="flex items-start gap-2">
                          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-red-100">
                            <ShieldCheck size={13} className="text-red-600" />
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Government Jobs</p>
                            <p className="text-sm leading-relaxed text-gray-700">{course.govtJobs}</p>
                          </div>
                        </div>

                        {/* Top Colleges */}
                        <div>
                          <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
                            <Building2 size={12} /> Top Colleges
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {course.topColleges.map((c, i) => (
                              <span key={i} className="rounded-lg bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">{c}</span>
                            ))}
                          </div>
                        </div>

                        {/* Career Scope */}
                        <div>
                          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
                            <Briefcase size={12} /> Career Scope
                          </div>
                          <p className="text-sm leading-relaxed text-gray-700">{course.careerScope}</p>
                        </div>

                        {/* Study Mode */}
                        <div>
                          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
                            <BookMarked size={12} /> Study Mode
                          </div>
                          <p className="text-sm leading-relaxed text-gray-700">{course.mode}</p>
                        </div>

                        {/* BSCC */}
                        {course.bscc && (
                          <div className="rounded-xl bg-green-50 border border-green-200 p-3 flex items-start gap-2">
                            <CreditCard size={15} className="mt-0.5 flex-shrink-0 text-green-600" />
                            <p className="text-xs text-green-700 font-semibold">Eligible for the Bihar Student Credit Card (BSCC) — secure up to ₹4 Lakh education loan at just 4% interest. Our team provides complete, step-by-step BSCC application support.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Toggle + CTA */}
                    <div className="mt-5 flex flex-col gap-2">
                      <button
                        onClick={() => setExpandedCard(isExpanded ? null : course.name)}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-gray-200 py-2.5 text-sm font-bold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                      >
                        {isExpanded ? (
                          <><ChevronUp size={15} /> Show Less</>
                        ) : (
                          <><ChevronDown size={15} /> View Career Scope & Study Mode</>
                        )}
                      </button>
                      <a
                        href={`https://wa.me/916203138576?text=नमस्ते!%20मुझे%20${encodeURIComponent(course.name)}%20(${encodeURIComponent(course.full)})%20के%20बारे%20में%20जानकारी%20चाहिए।%20Fees%20aur%20admission%20process%20batayein।`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white transition ${colors.btn}`}
                      >
                        <MessageCircle size={15} /> Enquire About Fees & Admission
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View All Courses CTA */}
          <div className="mt-12 text-center">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-blue px-8 py-4 font-extrabold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Explore All Courses <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── BSCC SECTION ── */}
      <section id="bscc" className="py-24 bg-gradient-to-br from-[#003f9f] to-[#001f6b] text-white relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-amber-400 opacity-10 blur-3xl" />
        <div className="container-shell relative">
          {/* Banner */}
          <AnimateIn type="zoom-in" className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-sm font-bold text-amber-300">
              <CreditCard size={16} /> Bihar Government Scheme
            </div>
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold">
              Bihar Student Credit Card{" "}
              <span className="text-amber-400">(BSCC) Loan Support</span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-blue-100 text-lg">
              इस सरकारी योजना के माध्यम से अपनी <strong className="text-white">पढ़ाई, हॉस्टल और भोजन</strong> का खर्च आसानी से संभालें। BSCC के तहत ₹4 लाख तक का education loan — <strong className="text-amber-400">केवल 4% वार्षिक ब्याज</strong> पर। हम पूरी आवेदन प्रक्रिया में निःशुल्क मार्गदर्शन देते हैं।
            </p>
            <div className="mt-6">
              <Link
                href="/student-credit-card"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-7 py-3.5 font-extrabold text-gray-900 transition hover:bg-amber-300 shadow-lg shadow-amber-400/30"
              >
                Learn the Full BSCC Process <ArrowRight size={17} />
              </Link>
            </div>
          </AnimateIn>

          {/* BSCC Benefits Row */}
          <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["Up to ₹4 Lakh Loan", "Covers tuition, hostel, food and study material"],
              ["Only 4% Interest", "Just 1% for women and differently-abled students"],
              ["40+ Eligible Courses", "B.Ed, Nursing, B.Tech, MBBS, Pharmacy and many more"],
              ["No Collateral Needed", "No guarantor, no property mortgage required"],
              ["Repay After Job", "EMIs begin only after you complete your course and start earning"],
            ].map(([title, desc]) => (
              <div key={title as string} className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="mt-0.5 flex-shrink-0 rounded-full bg-green-500 p-1">
                  <Check size={13} />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{title}</p>
                  <p className="text-xs text-blue-200 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* BSCC Step-by-Step Process */}
          <div className="mb-12 rounded-2xl border border-white/15 bg-white/5 p-7 backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400">
                <ListChecks size={18} className="text-gray-900" />
              </div>
              <h3 className="font-headline text-2xl font-extrabold text-amber-400">How Your BSCC Loan Gets Approved — Step by Step</h3>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  num: "01",
                  title: "Document Review at Siksha Wallah",
                  location: "Our Office — College Chowk, Forbesganj",
                  desc: "Bring your original documents to our office. Our counselling team carefully checks your eligibility, verifies every certificate and prepares a complete, error-free file for your BSCC application — ensuring nothing gets rejected later.",
                  icon: FileCheck2,
                  color: "text-blue-300",
                },
                {
                  num: "02",
                  title: "College Selection & Bonafide Certificate",
                  location: "Your Chosen BSCC-Approved College",
                  desc: "We help you shortlist the most suitable BSCC-approved college based on your course, fees and location. Once admission is confirmed, the college issues a Bonafide Certificate — an essential document for your BSCC application.",
                  icon: GraduationCap,
                  color: "text-green-300",
                },
                {
                  num: "03",
                  title: "DRCC Registration & Loan Approval",
                  location: "District Registration & Counselling Centre (DRCC)",
                  desc: "Your final application is submitted at the DRCC office in your district. The approved loan is credited directly into your bank account. Our team accompanies and supports you through every step of the DRCC process.",
                  icon: BadgeCheck,
                  color: "text-amber-300",
                },
              ].map(({ num, title, location, desc, icon: StepIcon, color }) => (
                <div key={num} className="relative">
                  {/* Connector line */}
                  <div className="relative rounded-2xl border border-white/10 bg-white/5 p-5 h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-headline text-5xl font-extrabold text-white/10 leading-none">{num}</span>
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/10 ${color}`}>
                        <StepIcon size={18} />
                      </div>
                    </div>
                    <h4 className="font-headline font-extrabold text-white text-base mb-1">{title}</h4>
                    <p className={`text-xs font-semibold mb-3 ${color}`}>Location: {location}</p>
                    <p className="text-sm text-blue-100 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
              <CheckCircle2 size={20} className="mt-0.5 flex-shrink-0 text-green-400" />
              <p className="text-sm font-semibold text-green-200">
                <strong className="text-green-300">100% Free Assistance:</strong> document preparation से लेकर DRCC approval तक — हमारी team पूरे BSCC application process में आपकी निःशुल्क सहायता करती है। कोई processing fee, कोई hidden charges नहीं।
              </p>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-2 items-start">
            {/* Documents required for BSCC */}
            <div className="space-y-4">
              <h3 className="font-headline text-xl font-extrabold text-amber-400">Documents Required for BSCC Loan</h3>
              {[
                ["Aadhaar Card", "Student's original Aadhaar, linked with an active mobile number"],
                ["10th & 12th Marksheet + Passing Certificate", "Originals along with two clear photocopies of each"],
                ["Domicile Certificate", "Proof of Bihar state residence, issued by SDO/Circle Office"],
                ["Family Income Certificate", "Annual family income should be below ₹4.5 Lakh"],
                ["Bank Account Details", "Student's own savings account (SBI / BOI preferred)"],
                ["College Bonafide Certificate", "Issued by your BSCC-approved enrolled college"],
                ["Passport-Size Photographs", "4 recent colour photos on a white background"],
                ["PAN Card (if available)", "Student's or parent's PAN for KYC verification"],
              ].map(([doc, detail]) => (
                <div key={doc as string} className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5">
                  <Check size={15} className="mt-0.5 flex-shrink-0 text-green-400" />
                  <div>
                    <p className="text-sm font-bold text-white">{doc}</p>
                    <p className="text-xs text-blue-300 mt-0.5">{detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Eligibility Checker */}
            <div className="rounded-2xl border border-white/20 bg-white/10 p-7 backdrop-blur-xl">
              <h3 className="font-headline text-xl font-extrabold mb-5">
                Quick BSCC Eligibility Check
              </h3>

              {bsccEligible === null ? (
                <form onSubmit={handleBsccCheck} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-blue-100">Are you a permanent resident of Bihar?</label>
                    <div className="flex gap-3">
                      {["yes", "no"].map((val) => (
                        <label key={val} className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 py-3 text-sm font-bold transition hover:bg-white/20">
                          <input type="radio" name="bihar" value={val} onChange={(e) => setBsccBihar(e.target.value)} className="accent-amber-400" required />
                          {val === "yes" ? "Yes" : "No"}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-blue-100">What is your family&apos;s annual income?</label>
                    <select
                      value={bsccIncome}
                      onChange={(e) => setBsccIncome(e.target.value)}
                      required
                      className="w-full rounded-xl border border-white/30 bg-[#003f9f] px-4 py-3 text-white outline-none"
                    >
                      <option value="">Select annual family income</option>
                      <option value="below">Below ₹4.5 Lakh</option>
                      <option value="above">Above ₹4.5 Lakh</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-blue-100">Student&apos;s Age</label>
                    <input
                      type="number"
                      value={bsccAge}
                      onChange={(e) => setBsccAge(e.target.value)}
                      placeholder="e.g. 19"
                      min={14}
                      max={35}
                      required
                      className="w-full rounded-xl border border-white/30 bg-white/20 px-4 py-3 text-white placeholder-blue-300 outline-none"
                    />
                  </div>

                  <button type="submit" className="w-full rounded-xl bg-amber-400 py-3.5 font-extrabold text-gray-900 transition hover:bg-amber-300 active:scale-95">
                    Check My Eligibility →
                  </button>
                </form>
              ) : bsccEligible ? (
                <div className="py-4 text-center space-y-4">
                  <CheckCircle2 size={52} className="mx-auto text-green-400" />
                  <h4 className="font-headline text-2xl font-extrabold text-green-300">Good news — you are eligible!</h4>
                  <p className="text-blue-100">आप Bihar Student Credit Card के लिए apply कर सकते हैं। हमारे BSCC विशेषज्ञ document preparation से लेकर DRCC approval तक पूरी प्रक्रिया में आपका मार्गदर्शन करेंगे।</p>
                  <a
                    href="https://wa.me/916203138576?text=नमस्ते!%20मैंने%20आपकी%20website%20पर%20BSCC%20eligibility%20check%20की%20और%20मैं%20eligible%20हूँ।%20कृपया%20application%20process%20के%20बारे%20में%20guide%20करें।"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-bold text-white hover:bg-green-600"
                  >
                    <MessageCircle size={18} /> Start My BSCC Application
                  </a>
                  <button onClick={() => { setBsccEligible(null); setBsccBihar(""); setBsccIncome(""); setBsccAge(""); }} className="block w-full text-center text-sm text-blue-300 underline mt-2">
                    Check Again
                  </button>
                </div>
              ) : (
                <div className="py-4 text-center space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/20">
                    <X size={28} className="text-orange-400" />
                  </div>
                  <h4 className="font-headline text-xl font-extrabold text-orange-300">You may not qualify for BSCC</h4>
                  <p className="text-blue-100 text-sm">BSCC scheme के लिए Bihar का स्थायी निवासी होना, age 25 वर्ष या उससे कम, और family income ₹4.5 लाख से कम होना आवश्यक है। चिंता न करें — हम आपके लिए अन्य education loan विकल्प भी सुझा सकते हैं।</p>
                  <a href="tel:+916203138576" className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-6 py-3 font-bold text-white hover:bg-white/30">
                    <Phone size={16} /> Call to Discuss Other Options
                  </a>
                  <button onClick={() => { setBsccEligible(null); setBsccBihar(""); setBsccIncome(""); setBsccAge(""); }} className="block w-full text-center text-sm text-blue-300 underline">
                    Check Again
                  </button>
                </div>
              )}
            </div>
          </div>{/* end lg:grid-cols-2 */}
        </div>
      </section>

      {/* ── WHY US ── */}
      <section id="why-us" className="py-24 bg-white">
        <div className="container-shell">
          <AnimateIn type="fade-up" className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-widest text-primary-red mb-2">Why Families Trust Us</p>
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold">More Than Admission — A Career You Can Be Proud Of</h2>
          </AnimateIn>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 stagger-child">
            {[
              { icon: ShieldCheck, color: "bg-blue-600", title: "100% Transparent Counselling", desc: "Every fee, every step is explained upfront. No hidden charges, no last-minute surprises." },
              { icon: Users, color: "bg-primary-red", title: "Your Personal Counsellor", desc: "A dedicated admission expert stays with you from the first call until your seat is confirmed." },
              { icon: BadgeCheck, color: "bg-green-600", title: "Full Documentation Support", desc: "We help with every form, certificate and verification so the process stays simple and stress-free." },
              { icon: Sparkles, color: "bg-amber-500", title: "BSCC Loan Specialists", desc: "Complete, end-to-end guidance for the Bihar Student Credit Card — the family doesn't have to navigate it alone." },
            ].map(({ icon: Icon, color, title, desc }, i) => (
              <AnimateIn key={title} type="zoom-in" delay={i * 80}>
              <div className="group rounded-2xl border-2 border-gray-100 bg-gray-50 p-6 text-center transition hover:border-blue-200 hover:bg-white hover:shadow-lg card-lift card-glow">
                <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${color} text-white shadow-md`}>
                  <Icon size={26} />
                </div>
                <h3 className="font-headline text-lg font-extrabold">{title}</h3>
                <p className="mt-2 text-sm text-gray-500">{desc}</p>
              </div>
              </AnimateIn>
            ))}
          </div>

          {/* Process Steps */}
          <AnimateIn type="fade-up" delay={100}>
          <div className="mt-20 rounded-2xl bg-gradient-to-r from-primary-green to-green-600 p-8 md:p-12 text-white">
            <h3 className="font-headline text-3xl font-extrabold text-center mb-10">How We Secure Your Admission — A Simple 4-Step Journey</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { step: "01", title: "Reach Out — Call or WhatsApp", desc: "हमसे संपर्क करें — पहली बातचीत बिल्कुल निःशुल्क।" },
                { step: "02", title: "Share Your Profile", desc: "अपने marks, बजट, documents और career goals के बारे में बताएँ।" },
                { step: "03", title: "Receive Personalised College Options", desc: "हमारे approved colleges की एक verified shortlist पाएँ।" },
                { step: "04", title: "Confirm Your Admission", desc: "Documentation से लेकर admission तक — हर कदम पर हम साथ हैं।" },
              ].map(({ step, title, desc }, i) => (
                <div key={step} className="relative">
                  {i < 3 && <div className="absolute hidden lg:block -right-3 top-7 text-white/30 text-2xl font-bold">→</div>}
                  <div className="rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur">
                    <span className="font-headline text-4xl font-extrabold text-white/30">{step}</span>
                    <h4 className="mt-2 font-headline font-bold text-lg">{title}</h4>
                    <p className="mt-1 text-sm text-green-100">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── SUCCESS STORIES ── */}
      <section className="py-24 bg-gray-50">
        <div className="container-shell">
          <AnimateIn type="fade-up" className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-widest text-primary-blue mb-2">Real Stories. Real Results.</p>
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold">Trusted by Students &amp; Their Families</h2>
          </AnimateIn>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: "Priya Kumari", course: "B.Ed (2024)", place: "Forbesganj", text: "Counsellor ने हर कदम पर बहुत अच्छे से मार्गदर्शन किया। BSCC loan की पूरी प्रक्रिया में भी मदद मिली। पूरा admission बिल्कुल tension-free रहा।" },
              { name: "Aman Raj", course: "B.Pharma (2023)", place: "Araria", text: "शुरू से लेकर अंत तक हर बात पारदर्शी रही। Document verification से लेकर hostel selection तक — हर मोड़ पर सही guidance मिली।" },
              { name: "Sakshi Jha", course: "B.Sc Nursing (2024)", place: "Kishanganj", text: "Nursing career को लेकर बहुत confusion थी। Siksha Wallah की counselling के बाद सही college मिला और BSCC loan भी आसानी से approve हो गया।" },
              { name: "Ravi Shankar", course: "B.Tech (2023)", place: "Forbesganj", text: "Engineering के लिए कौन-सा college सही रहेगा — समझ नहीं आ रहा था। Siksha Wallah की मदद से एक AICTE-approved college में आसानी से admission मिल गया।" },
              { name: "Anjali Devi", course: "GNM (2024)", place: "Purnea", text: "GNM admission की पूरी प्रक्रिया यहाँ बहुत सरल थी। BSCC loan भी मिला, और staff हर सवाल का जवाब बहुत धैर्य से देते हैं।" },
              { name: "Vikash Kumar", course: "D.El.Ed (2023)", place: "Araria", text: "Primary teacher बनना मेरा सपना था। D.El.Ed के लिए सही college चुनने में Siksha Wallah की भूमिका बहुत बड़ी रही। आज मैं एक सरकारी विद्यालय में पढ़ा रहा हूँ।" },
              { name: "Neha Bharti", course: "BBA (2024)", place: "Forbesganj", text: "BBA admission पहली ही कोशिश में confirm हो गया — और कोई extra charge भी नहीं। पूरी प्रक्रिया पर पूरा भरोसा बना रहा।" },
              { name: "Sonu Kumar", course: "B.Pharma (2024)", place: "Supaul", text: "Pharmacy में मेरी रुचि थी, लेकिन सही जानकारी नहीं थी। यहाँ आकर सब कुछ स्पष्ट हो गया और एक अच्छे college में admission मिला।" },
              { name: "Puja Kumari", course: "ANM (2023)", place: "Kishanganj", text: "ANM course के लिए सभी documents की पूरी list और प्रक्रिया यहाँ से मिली। बहुत ही आसान अनुभव — मैं इन्हें पूरे 10 में 10 दूँगी।" },
              { name: "Rahul Paswan", course: "ITI (2024)", place: "Forbesganj", text: "ITI में admission को लेकर परिवार में काफी असमंजस था। Siksha Wallah के counsellor ने हर पहलू समझाया और सही trade चुनने में मदद की।" },
              { name: "Komal Singh", course: "M.Ed (2024)", place: "Araria", text: "M.Ed के लिए Bihar से बाहर जाना पड़ा। Siksha Wallah ने out-of-state college में भी सहज admission दिलाया। शानदार अनुभव रहा।" },
              { name: "Deepak Jha", course: "MBA (2023)", place: "Purnea", text: "MBA के लिए BSCC loan apply किया। पूरी file Siksha Wallah team ने तैयार की और loan बिना किसी परेशानी के approve हो गया।" },
            ].map(({ name, course, place, text }, i) => (
              <AnimateIn
                key={name}
                type={i % 3 === 0 ? "fade-right" : i % 3 === 1 ? "fade-up" : "fade-left"}
                delay={((i % 3) * 100)}
              >
              <article className="rounded-2xl bg-white border-2 border-gray-100 p-7 shadow-sm card-lift card-glow hover:border-blue-100 h-full">
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                </div>
                <p className="text-gray-700 leading-relaxed">"{text}"</p>
                <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-blue font-bold text-white text-lg">
                    {name[0]}
                  </div>
                  <div>
                    <p className="font-headline font-extrabold text-gray-900">{name}</p>
                    <p className="text-sm text-gray-500">{course} · {place}</p>
                  </div>
                </div>
              </article>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOCUMENTS CHECKLIST ── */}
      <section id="documents" className="py-24 bg-white">
        <div className="container-shell">
          <AnimateIn type="fade-up" className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-primary-blue mb-2">Be Admission-Ready</p>
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold">Your Personal Admission Documents Checklist</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              इस checklist में हर document को tick करते जाएँ। जब आप हमारे Forbesganj office आएँ, तो सभी original certificates के साथ 2 photocopies ज़रूर लाएँ।
            </p>
          </AnimateIn>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] items-start">
            {/* Interactive Checklist */}
            <div className="rounded-2xl border-2 border-gray-100 bg-gray-50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between bg-primary-blue px-6 py-4">
                <div className="flex items-center gap-2 text-white">
                  <ListChecks size={20} />
                  <span className="font-headline font-extrabold text-lg">My Document Checklist</span>
                </div>
                <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-bold text-white">
                  {Object.values(checkedDocs).filter(Boolean).length} of {[
                    "10th-marksheet", "12th-marksheet", "graduation", "aadhaar",
                    "residential", "income", "caste", "photos", "tc", "migration"
                  ].length} Ready
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full bg-gray-200">
                <div
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{
                    width: `${(Object.values(checkedDocs).filter(Boolean).length / 10) * 100}%`,
                  }}
                />
              </div>

              {/* Document Groups */}
              <div className="p-5 space-y-5">
                {[
                  {
                    group: "Academic Documents",
                    color: "bg-blue-100 text-blue-700",
                    docs: [
                      { id: "10th-marksheet", label: "Class 10 Marksheet & Passing Certificate", note: "Original board certificate is required for verification.", required: true },
                      { id: "12th-marksheet", label: "Class 12 Marksheet & Passing Certificate", note: "All-subject marksheet plus passing/migration certificate.", required: true },
                      { id: "graduation", label: "Graduation Degree & Marksheets (All Years)", note: "Needed for B.Ed, M.Ed, MBA, MCA and all postgraduate courses.", required: false },
                    ],
                  },
                  {
                    group: "Identity & Residence Documents",
                    color: "bg-green-100 text-green-700",
                    docs: [
                      { id: "aadhaar", label: "Student's Aadhaar Card", note: "Should be linked with an active mobile number.", required: true },
                      { id: "residential", label: "Residential / Domicile Certificate", note: "Bihar domicile certificate from SDO or Circle Office.", required: true },
                      { id: "income", label: "Family Income Certificate", note: "Issued by the local CO/SDO. Annual income should be below ₹4.5 Lakh for BSCC eligibility.", required: true },
                      { id: "caste", label: "Caste Certificate (SC / ST / OBC, if applicable)", note: "Required for reserved-category seats and scholarship benefits.", required: false },
                    ],
                  },
                  {
                    group: "Other Essential Documents",
                    color: "bg-amber-100 text-amber-700",
                    docs: [
                      { id: "photos", label: "Passport-Size Photographs", note: "6–8 recent colour photographs on a white background.", required: true },
                      { id: "tc", label: "Transfer Certificate (TC)", note: "From the last school or college you attended.", required: true },
                      { id: "migration", label: "Migration Certificate (if from another board)", note: "Required when admitting to a state university after CBSE/ISC.", required: false },
                    ],
                  },
                ].map(({ group, color, docs }) => (
                  <div key={group}>
                    <h3 className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-extrabold uppercase tracking-wider mb-3 ${color}`}>
                      <FileText size={12} /> {group}
                    </h3>
                    <div className="space-y-2">
                      {docs.map(({ id, label, note, required }) => (
                        <label
                          key={id}
                          htmlFor={id}
                          className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-all ${
                            checkedDocs[id]
                              ? "border-green-300 bg-green-50"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div className="relative mt-0.5 flex-shrink-0">
                            <input
                              type="checkbox"
                              id={id}
                              checked={!!checkedDocs[id]}
                              onChange={() => setCheckedDocs((prev) => ({ ...prev, [id]: !prev[id] }))}
                              className="sr-only"
                            />
                            <div className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-all ${
                              checkedDocs[id] ? "border-green-500 bg-green-500" : "border-gray-300"
                            }`}>
                              {checkedDocs[id] && <Check size={12} className="text-white" strokeWidth={3} />}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-sm font-bold ${checkedDocs[id] ? "text-green-700 line-through" : "text-gray-900"}`}>
                                {label}
                              </span>
                              {required && (
                                <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600">MUST HAVE</span>
                              )}
                            </div>
                            <p className="mt-0.5 text-xs text-gray-500">{note}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                {/* CTA after checklist */}
                <div className="rounded-xl bg-primary-blue p-4 text-white flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-bold text-sm">All documents ready? Let&apos;s take the next step together.</p>
                    <p className="text-xs text-blue-200">Visit our Forbesganj office for a free, no-obligation document verification.</p>
                  </div>
                  <a
                    href="https://wa.me/916203138576?text=नमस्ते!%20मैंने%20अपने%20admission%20documents%20collect%20कर%20लिए%20हैं।%20आगे%20का%20process%20बताएं।"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-primary-blue hover:bg-blue-50 transition"
                  >
                    <MessageCircle size={15} /> Share on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Right panel — course-wise special docs */}
            <div className="space-y-5">
              <h3 className="font-headline text-2xl font-extrabold text-gray-900">Additional Documents by Course</h3>
              {[
                {
                  course: "B.Ed / M.Ed",
                  color: "border-blue-200 bg-blue-50",
                  badge: "bg-blue-100 text-blue-700",
                  extras: [
                    "Graduation Degree & marksheets (all years)",
                    "Character Certificate from last institution",
                    "CTET/STET score card (if available, for preference)",
                    "Teaching Experience Certificate (for lateral entry if applicable)",
                  ],
                },
                {
                  course: "B.Sc Nursing / GNM / ANM",
                  color: "border-red-200 bg-red-50",
                  badge: "bg-red-100 text-red-700",
                  extras: [
                    "Medical Fitness Certificate from MBBS Doctor",
                    "PCB (Physics, Chemistry, Biology) 12th marksheet mandatory",
                    "Date of Birth Certificate (birth certificate or 10th admit card)",
                    "HIV/Hepatitis B test report (required by some colleges)",
                  ],
                },
                {
                  course: "B.Pharma / D.Pharma",
                  color: "border-green-200 bg-green-50",
                  badge: "bg-green-100 text-green-700",
                  extras: [
                    "12th PCB or PCM marksheet (Biology/Maths required)",
                    "NEET score card (for some private pharmacy colleges)",
                    "Gap Certificate (if gap year after 12th)",
                    "Pharmacy Council registration form (provided at admission)",
                  ],
                },
                {
                  course: "D.El.Ed",
                  color: "border-amber-200 bg-amber-50",
                  badge: "bg-amber-100 text-amber-700",
                  extras: [
                    "12th Marksheet & Certificate (any stream, 50% marks)",
                    "Character Certificate from 12th school Principal",
                    "Domicile & Caste certificate for Bihar state merit list",
                    "SCERT application form (filled & signed)",
                  ],
                },
              ].map(({ course, color, badge, extras }) => (
                <div key={course} className={`rounded-xl border-2 p-5 ${color}`}>
                  <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-extrabold mb-3 ${badge}`}>
                    <BookOpen size={11} /> {course}
                  </span>
                  <ul className="space-y-2">
                    {extras.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 text-gray-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 p-5">
                <p className="font-bold text-amber-800 text-sm mb-1">Not sure which documents you need?</p>
                <p className="text-xs text-amber-700 mb-3">Give us a quick call — our counsellor will share a personalised document list for your chosen course in under 2 minutes.</p>
                <a href="tel:+916203138576" className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-amber-600 transition">
                  <Phone size={14} /> Call +91 6203138576
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ACCORDION ── */}
      <section id="faq" className="py-24 bg-gray-50">
        <div className="container-shell">
          {/* Header */}
          <div className="mb-14 overflow-hidden rounded-3xl bg-gradient-to-br from-[#001f6b] via-[#003f9f] to-[#0060c7] px-8 py-12 text-center shadow-2xl relative">
            {/* Decorative blobs */}
            <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-orange-400 opacity-20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-blue-300 opacity-20 blur-3xl" />
            {/* Badge */}
            <div className="relative mb-5 inline-flex items-center gap-2 rounded-full border border-orange-400/40 bg-orange-400/15 px-5 py-2">
              <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-orange-300">Frequently Asked Questions</span>
            </div>
            {/* Heading */}
            <h2 className="relative font-headline text-3xl md:text-5xl font-black text-white leading-tight">
              Every Question, Answered{" "}
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300 bg-clip-text text-transparent">
                Honestly
              </span>
            </h2>
            <p className="relative mt-4 text-blue-200 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Course selection से लेकर BSCC loan तक, admission प्रक्रिया से लेकर सरकारी नौकरी तक —<br className="hidden md:block" />
              <strong className="text-white">Siksha Wallah</strong> के विशेषज्ञ आपके हर सवाल का स्पष्ट और ईमानदार जवाब देते हैं।
            </p>
            {/* Stats row */}
            <div className="relative mt-8 flex flex-wrap justify-center gap-6">
              {[
                { num: "17+", label: "Common Questions" },
                { num: "5", label: "Topic Categories" },
                { num: "100%", label: "Free Counselling" },
              ].map(({ num, label }) => (
                <div key={label} className="flex flex-col items-center">
                  <span className="font-headline text-2xl font-black text-orange-400">{num}</span>
                  <span className="text-xs text-blue-200 font-medium mt-0.5">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_1.8fr] items-start">
            {/* Left — contact strip */}
            <AnimateIn type="fade-right">
            <div className="sticky top-24">
              <div className="rounded-2xl bg-[#003f9f] p-6 text-white mb-6">
                <p className="font-headline text-lg font-extrabold mb-1">Prefer to speak in person?</p>
                <p className="text-blue-200 text-sm mb-5">Didn&apos;t find your answer here? Our counsellors are just one call away — free, friendly and honest.</p>
                <div className="space-y-3">
                  {[
                    { num: "6203138576", name: "Rajesh Kr. Sah", role: "Primary Admission Contact" },
                    { num: "7858062498", name: "Office Contact", role: "" },
                  ].map(({ num, name, role }) => (
                    <a key={num} href={`tel:+91${num}`} className="flex items-center gap-3 rounded-xl bg-white/10 border border-white/20 p-3 transition hover:bg-white/20">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-amber-400 text-gray-900">
                        <Phone size={15} />
                      </div>
                      <div>
                        <div className="font-bold text-sm">+91 {num}</div>
                        <div className="text-xs text-blue-200">{role ? `${name} · ${role}` : name}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
              {/* Category quick links */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Browse by Topic</p>
                <div className="space-y-2">
                  {[
                    { label: "Counselling & Services", color: "bg-blue-100 text-blue-700", range: "1–4" },
                    { label: "Choosing the Right Course", color: "bg-green-100 text-green-700", range: "5–9" },
                    { label: "Admission Process", color: "bg-purple-100 text-purple-700", range: "10–12" },
                    { label: "BSCC Loan Support", color: "bg-amber-100 text-amber-700", range: "13–15" },
                    { label: "Fees & Expenses", color: "bg-rose-100 text-rose-700", range: "16–17" },
                  ].map(({ label, color, range }) => (
                    <div key={label} className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold ${color}`}>
                      <span>{label}</span>
                      <span className="opacity-60">Q {range}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            </AnimateIn>

            {/* Right — accordion */}
            <AnimateIn type="fade-left" delay={100}>
            <div className="space-y-3">
              {faqs.map(({ q, a }, i) => (
                <div key={i} className={`rounded-2xl border-2 overflow-hidden transition-all ${openFaq === i ? "border-[#003f9f] shadow-md" : "border-gray-200 bg-white"}`}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left transition hover:bg-blue-50/50"
                  >
                    <div className="flex items-start gap-3">
                      <span className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold ${openFaq === i ? "bg-[#003f9f] text-white" : "bg-gray-100 text-gray-500"}`}>
                        {i + 1}
                      </span>
                      <span className="font-headline font-bold text-base text-gray-900 leading-snug">{q}</span>
                    </div>
                    <ChevronDown size={20} className={`flex-shrink-0 mt-0.5 text-[#003f9f] transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 pt-0 text-gray-600 text-sm leading-relaxed border-t border-blue-100 bg-blue-50/30">
                      <div className="pt-4 whitespace-pre-line">{a}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── CONTACT & LOCATION ── */}
      <section id="contact" className="py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container-shell">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left — contact info */}
            <AnimateIn type="fade-right">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest mb-3 text-amber-400">Visit Our Counselling Centre</p>
              <h2 className="font-headline text-4xl md:text-5xl font-extrabold mb-6">
                Meet Our Counsellors Face-to-Face
              </h2>

              {/* Location card */}
              <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary-blue">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h3 className="font-headline text-lg font-extrabold text-white">Our Office Address</h3>
                    <p className="mt-1 text-gray-300">College Chowk, Near HP Petrol Pump</p>
                    <p className="text-gray-300">Forbesganj, Araria — Bihar 854318</p>
                    <a
                      href="https://maps.google.com/?q=College+Chowk+Forbesganj+Araria+Bihar"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-amber-400 hover:text-amber-300"
                    >
                      Get Directions on Google Maps →
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {[["6203138576", "Rajesh Kr. Sah — Primary Admission Contact"], ["7858062498", "Office Contact"]].map(([num, label]) => (
                  <a key={num} href={`tel:+91${num}`} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10 hover:border-amber-400/40">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-blue">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-white">+91 {num}</p>
                      <p className="text-xs text-gray-400">{label}</p>
                    </div>
                  </a>
                ))}
              </div>

              <a
                href="https://wa.me/916203138576"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-xl bg-green-500 px-6 py-3.5 font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-400"
              >
                <MessageCircle size={20} /> Chat on WhatsApp
              </a>
            </div>
            </AnimateIn>

            {/* Right — Contact form with Firestore save */}
            <AnimateIn type="fade-left" delay={100}>
            <div className="rounded-2xl bg-white p-8 text-gray-900 shadow-xl">
              <h3 className="font-headline text-2xl font-extrabold mb-2">Plan Your Admission with Us</h3>
              <p className="text-gray-500 text-sm mb-6">Share a few quick details — our counsellor will personally call you back within 30 minutes.</p>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const f = e.currentTarget as HTMLFormElement;
                  const name = (f.elements.namedItem("cname") as HTMLInputElement).value;
                  const mobile = (f.elements.namedItem("cmobile") as HTMLInputElement).value;
                  const course = (f.elements.namedItem("ccourse") as HTMLSelectElement).value;
                  const qualify = (f.elements.namedItem("cqualify") as HTMLSelectElement).value;
                  try {
                    await saveInquiry({ fullName: name, mobile, course, message: `Qualification: ${qualify}` });
                  } catch (_) {}
                  const msg = `New Inquiry from Siksha Wallah!%0AName: ${name}%0AMobile: ${mobile}%0ACourse: ${course}%0AQualification: ${qualify}`;
                  window.open(`https://wa.me/916203138576?text=${msg}`, "_blank");
                  f.reset();
                }}
                className="space-y-4"
              >
                <input name="cname" required placeholder="Student's Full Name" className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 outline-none focus:border-primary-blue transition" />
                <input name="cmobile" required type="tel" placeholder="Your Mobile Number" className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 outline-none focus:border-primary-blue transition" />
                <select name="ccourse" className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-gray-600 outline-none focus:border-primary-blue bg-white transition">
                  <option value="">-- Select a Course --</option>
                  <option>B.Ed / D.El.Ed</option>
                  <option>B.Sc Nursing / GNM / ANM</option>
                  <option>B.Pharma / D.Pharma</option>
                  <option>MBBS / BDS</option>
                  <option>BBA / MBA</option>
                  <option>B.Tech / Polytechnic / ITI</option>
                  <option>BCA / MCA</option>
                  <option>Not yet decided — I want guidance</option>
                </select>
                <select name="cqualify" className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-gray-600 outline-none focus:border-primary-blue bg-white transition">
                  <option value="">-- Highest Qualification --</option>
                  <option>10th Pass</option>
                  <option>12th Pass (Arts)</option>
                  <option>12th Pass (Science)</option>
                  <option>12th Pass (Commerce)</option>
                  <option>Graduation</option>
                  <option>Post Graduation</option>
                </select>
                <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary-blue py-4 font-extrabold text-white transition hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95">
                  Book My Free Counselling <ArrowRight size={18} />
                </button>
              </form>
              <p className="mt-4 text-center text-xs text-gray-400">100% Free • No Spam • No Hidden Charges • Your details stay confidential</p>
            </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
