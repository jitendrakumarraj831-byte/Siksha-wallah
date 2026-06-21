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
  const [formData, setFormData] = useState({ name: "", mobile: "", course: "", qualify: "" });
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
      saveInquiry({ fullName: formData.name, mobile: formData.mobile, course: formData.course, qualification: formData.qualify, message: `Qualification: ${formData.qualify}` }).catch(() => {});
      // Log inquiry activity
      saveActivity({
        type: "inquiry",
        title: "📋 New Inquiry Submitted",
        description: `${formData.name} → ${formData.course} (${formData.qualify})`,
        name: formData.name,
        mobile: formData.mobile,
        course: formData.course,
        page: "/",
      });
      const msg = `नमस्ते! मेरा नाम ${encodeURIComponent(formData.name)} है।%0AMobile: ${formData.mobile}%0AमुझेAdmission चाहिए: ${encodeURIComponent(formData.course)}%0AYogyta: ${encodeURIComponent(formData.qualify)}%0AKripya guide karein.`;
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
    <main className="overflow-hidden bg-white text-gray-900">

      <SiteNavbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#001f6b] via-[#003f9f] to-[#0060c7] text-white">
        {/* Grid overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
        {/* Glow blobs */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-amber-400 opacity-20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -left-24 h-64 w-64 rounded-full bg-blue-300 opacity-20 blur-3xl" />

        <div className="container-shell relative py-14 md:py-28">
          {/*
            Mobile layout (default flex-col):  text → form → stats
            Desktop (lg grid):                 [text + stats]  |  [form spanning both rows]
          */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_.85fr] lg:gap-12 lg:items-start">

            {/* ── LEFT: badge + heading + sub + CTAs ── */}
            <div className="order-1">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
                <BadgeCheck size={16} className="text-amber-400" />
                College Chowk, Near HP Petrol Pump, Forbesganj, Araria
              </div>

              {/* H1 — bilingual, premium gradient on second line */}
              <h1 className="font-headline text-[2.1rem] leading-[1.15] tracking-tight md:text-5xl lg:text-[3.6rem] lg:leading-[1.08] font-black">
                Right College, Sahi Guidance!
                <br />
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
                  अब Admission Ki No Tension!
                </span>
              </h1>

              {/* Sub-heading */}
              <p className="mt-5 max-w-xl text-base md:text-[1.05rem] text-blue-100 leading-[1.75]">
                B.Ed, D.El.Ed, MBBS से MBA तक —{" "}
                <strong className="text-white font-extrabold">100% Transparent Guidance</strong>{" "}
                और Direct Admission Support,{" "}
                <strong className="text-white font-extrabold">बिना किसी Hidden Charges के!</strong>
              </p>

              {/* CTA buttons */}
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <a
                  href="#inquiry"
                  className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-amber-400 px-7 py-4 font-extrabold text-gray-900 shadow-lg shadow-amber-500/40 transition-all duration-200 ease-out hover:-translate-y-[3px] hover:bg-amber-300 hover:shadow-xl hover:shadow-amber-500/50 active:translate-y-0 active:scale-[0.97] active:shadow-md"
                >
                  {/* Shine sweep on hover */}
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                  Free Expert सलाह लें
                  <ArrowRight size={18} className="flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
                <a
                  href="https://wa.me/916203138576"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-white/40 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur transition-all duration-200 ease-out hover:bg-white/20 hover:-translate-y-[2px] hover:border-white/60 active:scale-[0.97]"
                >
                  <MessageCircle size={18} /> WhatsApp करें
                </a>
              </div>
            </div>

            {/* ── RIGHT: glassmorphism quick inquiry (order-2 on mobile, spans 2 rows on lg) ── */}
            <div
              id="inquiry"
              className="order-2 rounded-2xl border border-white/20 bg-white/10 p-6 md:p-7 backdrop-blur-xl shadow-2xl lg:row-span-2"
            >
              {formSubmitted ? (
                <div className="flex flex-col items-center gap-4 py-10 text-center">
                  <CheckCircle2 size={56} className="text-green-400" />
                  <h3 className="font-headline text-2xl font-extrabold">धन्यवाद! 🎉</h3>
                  <p className="text-blue-100">हमारा counsellor जल्द ही आपसे WhatsApp पर संपर्क करेगा।</p>
                  <button
                    onClick={() => { setFormSubmitted(false); setStep(0); setFormData({ name: "", mobile: "", course: "", qualify: "" }); }}
                    className="rounded-xl bg-amber-400 px-6 py-3 font-bold text-gray-900 transition-all duration-200 hover:bg-amber-300 hover:-translate-y-0.5 active:scale-95"
                  >
                    New Inquiry
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-headline text-xl font-extrabold">Free Consultation</h3>
                    <span className="rounded-full bg-amber-400/20 px-2.5 py-0.5 text-xs font-bold text-amber-300">
                      {step + 1} / {STEPS.length}
                    </span>
                  </div>

                  {/* Progress bar — wider steps feel faster */}
                  <div className="mb-5 h-1.5 w-full rounded-full bg-white/20">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all duration-500 ease-out"
                      style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                    />
                  </div>

                  {/* Step content */}
                  <div className="space-y-3">
                    {step === 0 && (
                      <>
                        <label className="block text-sm font-bold text-blue-100">
                          आपका पूरा नाम <span className="text-amber-400">*</span>
                        </label>
                        <input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="जैसे: Rahul Kumar"
                          autoComplete="name"
                          className="w-full rounded-xl border border-white/30 bg-white/20 px-4 py-3.5 text-white placeholder-blue-300 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
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
                          placeholder="10-digit number दर्ज करें"
                          autoComplete="tel"
                          className="w-full rounded-xl border border-white/30 bg-white/20 px-4 py-3.5 text-white placeholder-blue-300 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
                        />
                      </>
                    )}
                    {step === 2 && (
                      <>
                        <label className="block text-sm font-bold text-blue-100">
                          कौन सा Course चाहिए? <span className="text-amber-400">*</span>
                        </label>
                        <select
                          value={formData.course}
                          onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                          className="w-full rounded-xl border border-white/30 bg-[#003f9f] px-4 py-3.5 text-white outline-none transition focus:border-amber-400"
                        >
                          <option value="">-- Course Select करें --</option>
                          <optgroup label="Teaching">
                            <option>B.Ed</option><option>D.El.Ed</option><option>M.Ed</option>
                          </optgroup>
                          <optgroup label="Medical & Nursing">
                            <option>MBBS</option><option>BDS</option><option>B.Sc Nursing</option>
                            <option>GNM</option><option>ANM</option><option>B.Pharma</option>
                          </optgroup>
                          <optgroup label="Technical & Management">
                            <option>B.Tech</option><option>Polytechnic</option><option>ITI</option>
                            <option>BCA</option><option>MCA</option><option>BBA</option><option>MBA</option>
                          </optgroup>
                          <option>अभी decide नहीं किया</option>
                        </select>
                      </>
                    )}
                    {step === 3 && (
                      <>
                        <label className="block text-sm font-bold text-blue-100">
                          आपकी Qualification <span className="text-amber-400">*</span>
                        </label>
                        <select
                          value={formData.qualify}
                          onChange={(e) => setFormData({ ...formData, qualify: e.target.value })}
                          className="w-full rounded-xl border border-white/30 bg-[#003f9f] px-4 py-3.5 text-white outline-none transition focus:border-amber-400"
                        >
                          <option value="">-- Qualification Select करें --</option>
                          <option>10th Pass</option>
                          <option>12th Pass (Arts)</option>
                          <option>12th Pass (Science)</option>
                          <option>12th Pass (Commerce)</option>
                          <option>Graduation</option>
                          <option>Post Graduation</option>
                        </select>
                      </>
                    )}

                    <div className="flex gap-2 pt-1">
                      {step > 0 && (
                        <button
                          onClick={() => setStep(step - 1)}
                          className="flex-1 rounded-xl border border-white/40 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10 active:scale-[0.97]"
                        >
                          ← Back
                        </button>
                      )}
                      <button
                        onClick={nextStep}
                        className="group relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl bg-amber-400 py-3.5 font-extrabold text-gray-900 transition-all duration-200 ease-out hover:bg-amber-300 hover:-translate-y-[2px] hover:shadow-lg hover:shadow-amber-500/40 active:translate-y-0 active:scale-[0.97]"
                      >
                        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                        {step < STEPS.length - 1 ? (
                          <>
                            Next
                            <ArrowRight size={16} className="flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                          </>
                        ) : (
                          "Submit & WhatsApp करें 🚀"
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="mt-4 text-center text-xs text-blue-300">
                    🔒 100% Free · No Spam · आपकी जानकारी सुरक्षित है
                  </p>
                </>
              )}
            </div>

            {/* ── STATS — order-3 on mobile (below form), stays in left col on lg ── */}
            <div className="order-3 grid grid-cols-3 gap-3 border-t border-white/20 pt-6 lg:border-t lg:pt-7">
              {([
                { target: 5000, suffix: "+", label: "Students Guided" },
                { target: 200,  suffix: "+", label: "Colleges Network" },
                { target: 98,   suffix: "%", label: "Success Rate" },
              ] as const).map(({ target, suffix, label }) => (
                <div key={label} className="text-center sm:text-left">
                  <p className="font-headline text-2xl font-black text-amber-400 md:text-3xl">
                    <CountUp target={target} suffix={suffix} />
                  </p>
                  <p className="mt-0.5 text-xs text-blue-200 md:text-sm">{label}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── COURSE MARQUEE ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#001f6b] via-[#002f8a] to-[#001f6b] py-4 border-t border-white/10">
        {/* Edge fades */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[#001f6b] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[#001f6b] to-transparent" />
        <div className="flex w-max marquee">
          {[
            "B.Ed", "D.El.Ed", "MBBS", "BDS", "B.Tech", "MBA", "BCA", "BBA",
            "Nursing", "B.Pharma", "GNM", "ANM", "MCA", "Polytechnic", "ITI", "M.Ed",
            "B.Ed", "D.El.Ed", "MBBS", "BDS", "B.Tech", "MBA", "BCA", "BBA",
            "Nursing", "B.Pharma", "GNM", "ANM", "MCA", "Polytechnic", "ITI", "M.Ed",
          ].map((course, i) => (
            <span
              key={i}
              className="mx-2 inline-block whitespace-nowrap rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium text-white/90 backdrop-blur-sm"
            >
              {course}
            </span>
          ))}
        </div>
      </div>

      {/* ── TRUST BAR ── */}
      <div className="bg-gray-900 py-4">
        <div className="container-shell">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-semibold text-gray-300">
            {[
              [ShieldCheck, "NCTE & UGC Approved"],
              [Award, "9+ Years Experience"],
              [Users, "5000+ Students Placed"],
              [CheckCircle2, "Zero Hidden Charges"],
            ].map(([Icon, text], i) => (
              <span key={i} className="flex items-center gap-2">
                {/* @ts-ignore */}
                <Icon size={16} className="text-amber-400" />
                {text as string}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── COURSES SECTION ── */}
      <section id="courses" className="py-24 bg-gray-50">
        <div className="container-shell">
          <AnimateIn type="fade-up" className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-primary-blue mb-2">सभी स्ट्रीम्स उपलब्ध हैं (Streams Available)</p>
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold">अपना Stream चुनें</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              3 main streams — 40+ courses — सभी के लिए expert guidance available
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
                    <h3 className="font-headline text-lg font-extrabold text-blue-900">हमारे Partnered & Approved Colleges</h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-bold text-white"><BadgeCheck size={11} /> NCTE Approved</span>
                  </div>
                  <p className="text-sm text-blue-800 leading-relaxed mb-3">
                    हम केवल <strong>NCTE (National Council for Teacher Education) Approved</strong> colleges के साथ partner हैं — Bihar (Patna, Purnea, Katihar) और अन्य राज्यों में।
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[
                      "NCTE Approved B.Ed/D.El.Ed in Patna, Purnea & Katihar (Bihar)",
                      "NCTE Recognized institutions across other states",
                      "100% Bihar Student Credit Card (BSCC) facility support",
                      "Regular & Distance mode — both options guided",
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
                    <h3 className="font-headline text-lg font-extrabold text-red-900">हमारे Partnered & Approved Colleges</h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-bold text-white"><BadgeCheck size={11} /> INC & PCI Approved</span>
                  </div>
                  <p className="text-sm text-red-800 leading-relaxed mb-3">
                    हम <strong>INC (Indian Nursing Council) & PCI (Pharmacy Council of India) Approved</strong> premier institutes के साथ partner हैं — Bangalore, Madhya Pradesh, West Bengal और all states में।
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[
                      "INC Approved Nursing colleges in Bangalore & West Bengal",
                      "PCI Approved Pharmacy institutes in Madhya Pradesh & all other states",
                      "Premier private medical institutes with hostel facilities",
                      "NEET counselling & direct admission both available",
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
                    <h3 className="font-headline text-lg font-extrabold text-orange-900">हमारे Partnered & Approved Colleges</h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-600 px-2.5 py-0.5 text-xs font-bold text-white"><BadgeCheck size={11} /> AICTE & UGC Recognized</span>
                  </div>
                  <p className="text-sm text-orange-800 leading-relaxed mb-3">
                    हम <strong>AICTE (All India Council for Technical Education) & UGC Recognized</strong> top universities के साथ partner हैं — engineering, management, और computer courses के लिए।
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[
                      "AICTE Approved B.Tech & Polytechnic colleges across India",
                      "UGC Recognized universities for BCA, MCA, BBA & MBA",
                      "JEE / DCECE counselling guidance included",
                      "Distance mode also available for UGC-DEB approved courses",
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
                            <p className="text-xs text-green-700 font-semibold">Bihar Student Credit Card (BSCC) eligible — get up to ₹4 Lakh loan for this course at only 4% interest. Siksha Wallah guides for complete BSCC application.</p>
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
                          <><ChevronUp size={15} /> Hide Details</>
                        ) : (
                          <><ChevronDown size={15} /> View Career Scope & Mode</>
                        )}
                      </button>
                      <a
                        href={`https://wa.me/916203138576?text=नमस्ते!%20मुझे%20${encodeURIComponent(course.name)}%20(${encodeURIComponent(course.full)})%20के%20बारे%20में%20जानकारी%20चाहिए।%20Fees%20aur%20admission%20process%20batayein।`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white transition ${colors.btn}`}
                      >
                        <MessageCircle size={15} /> Inquire Fee & Admission
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
              सभी कोर्सेज देखें <ArrowRight size={18} />
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
              <span className="text-amber-400">(BSCC)</span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-blue-100 text-lg">
              सरकारी योजना के तहत <strong className="text-white">Free Education, Fooding, और Lodging</strong> पाएं।
              BSCC से ₹4 Lakh तक का education loan — <strong className="text-amber-400">4% सालाना ब्याज</strong> पर।
            </p>
            <div className="mt-6">
              <Link
                href="/student-credit-card"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-7 py-3.5 font-extrabold text-gray-900 transition hover:bg-amber-300 shadow-lg shadow-amber-400/30"
              >
                पूरा प्रोसेस जानें <ArrowRight size={17} />
              </Link>
            </div>
          </AnimateIn>

          {/* BSCC Benefits Row */}
          <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["₹4 Lakh Loan", "Tuition, hostel, food, books — all covered"],
              ["4% Interest", "1% for women & differently-abled"],
              ["40+ Courses", "B.Ed, Nursing, B.Tech, MBBS & more"],
              ["No Collateral", "No guarantor, no property mortgage"],
              ["Pay After Job", "Repay only after you start earning"],
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
              <h3 className="font-headline text-2xl font-extrabold text-amber-400">BSCC Application Process — Step by Step</h3>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  num: "01",
                  title: "Document Verification at Siksha Wallah",
                  location: "College Chowk, Forbesganj (Our Office)",
                  desc: "Visit our office with your original documents. Our expert team verifies your eligibility, checks all certificates, and prepares a complete document file for BSCC application. We ensure nothing is missing before proceeding.",
                  icon: FileCheck2,
                  color: "text-blue-300",
                },
                {
                  num: "02",
                  title: "College Selection & Bonafide Certificate",
                  location: "Selected BSCC-Approved College",
                  desc: "We help you select the right BSCC-approved college based on your course and location preference. After securing admission, the college provides a Bonafide Certificate confirming your enrollment — required for BSCC loan application.",
                  icon: GraduationCap,
                  color: "text-green-300",
                },
                {
                  num: "03",
                  title: "DRCC Office Registration & Approval",
                  location: "District Registration & Counselling Centre (DRCC)",
                  desc: "Your complete application is submitted at the DRCC office (District Headquarter). The loan is processed through your bank account directly. Siksha Wallah team accompanies and guides you through the entire DRCC process.",
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
                    <p className={`text-xs font-semibold mb-3 ${color}`}>📍 {location}</p>
                    <p className="text-sm text-blue-100 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
              <CheckCircle2 size={20} className="mt-0.5 flex-shrink-0 text-green-400" />
              <p className="text-sm font-semibold text-green-200">
                <strong className="text-green-300">100% Free Guidance:</strong> हमारी team पूरे BSCC application process में आपकी निःशुल्क (free) सहायता करती है — document preparation से DRCC approval तक। कोई extra charge नहीं।
              </p>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-2 items-start">
            {/* Documents required for BSCC */}
            <div className="space-y-4">
              <h3 className="font-headline text-xl font-extrabold text-amber-400">BSCC के लिए Required Documents</h3>
              {[
                ["Aadhaar Card", "Student's original Aadhaar linked to mobile"],
                ["10th & 12th Marksheet + Certificate", "Original & photocopy both required"],
                ["Domicile Certificate", "Bihar state residence proof"],
                ["Income Certificate", "Family annual income below ₹4.5 Lakh"],
                ["Bank Account Details", "Student's own savings account (SBI/BOI preferred)"],
                ["College Bonafide Certificate", "Issued by BSCC-approved enrolled college"],
                ["Passport Size Photos", "4 recent color photographs on white background"],
                ["PAN Card (if available)", "Student's or parent's PAN for verification"],
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
                Check BSCC Eligibility
              </h3>

              {bsccEligible === null ? (
                <form onSubmit={handleBsccCheck} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-blue-100">क्या आप Bihar के निवासी हैं?</label>
                    <div className="flex gap-3">
                      {["yes", "no"].map((val) => (
                        <label key={val} className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 py-3 text-sm font-bold transition hover:bg-white/20">
                          <input type="radio" name="bihar" value={val} onChange={(e) => setBsccBihar(e.target.value)} className="accent-amber-400" required />
                          {val === "yes" ? "हाँ (Yes)" : "नहीं (No)"}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-blue-100">परिवार की वार्षिक आय?</label>
                    <select
                      value={bsccIncome}
                      onChange={(e) => setBsccIncome(e.target.value)}
                      required
                      className="w-full rounded-xl border border-white/30 bg-[#003f9f] px-4 py-3 text-white outline-none"
                    >
                      <option value="">Select Income</option>
                      <option value="below">₹4.5 Lakh से कम</option>
                      <option value="above">₹4.5 Lakh से अधिक</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-blue-100">आपकी उम्र (Age)</label>
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
                    Check Eligibility Now →
                  </button>
                </form>
              ) : bsccEligible ? (
                <div className="py-4 text-center space-y-4">
                  <CheckCircle2 size={52} className="mx-auto text-green-400" />
                  <h4 className="font-headline text-2xl font-extrabold text-green-300">🎉 आप Eligible हैं!</h4>
                  <p className="text-blue-100">आप Bihar Student Credit Card के लिए apply कर सकते हैं। हमारे experts आपको पूरा process guide करेंगे।</p>
                  <a
                    href="https://wa.me/916203138576?text=नमस्ते!%20मैंने%20आपकी%20website%20पर%20BSCC%20eligibility%20check%20की%20और%20मैं%20eligible%20हूँ।%20कृपया%20application%20process%20के%20बारे%20में%20guide%20करें।"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-bold text-white hover:bg-green-600"
                  >
                    <MessageCircle size={18} /> BSCC Apply करें
                  </a>
                  <button onClick={() => { setBsccEligible(null); setBsccBihar(""); setBsccIncome(""); setBsccAge(""); }} className="block w-full text-center text-sm text-blue-300 underline mt-2">
                    फिर से Check करें
                  </button>
                </div>
              ) : (
                <div className="py-4 text-center space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/20">
                    <X size={28} className="text-orange-400" />
                  </div>
                  <h4 className="font-headline text-xl font-extrabold text-orange-300">Currently Not Eligible</h4>
                  <p className="text-blue-100 text-sm">BSCC के लिए Bihar domicile, age ≤ 25, और family income ≤ ₹4.5L जरूरी है। लेकिन हम आपके लिए education loan के अन्य options खोज सकते हैं।</p>
                  <a href="tel:+916203138576" className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-6 py-3 font-bold text-white hover:bg-white/30">
                    <Phone size={16} /> Call for Other Options
                  </a>
                  <button onClick={() => { setBsccEligible(null); setBsccBihar(""); setBsccIncome(""); setBsccAge(""); }} className="block w-full text-center text-sm text-blue-300 underline">
                    फिर से Check करें
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
            <p className="text-sm font-bold uppercase tracking-widest text-primary-red mb-2">हमारी विशेषता</p>
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold">सिर्फ Admission नहीं, सही Career</h2>
          </AnimateIn>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 stagger-child">
            {[
              { icon: ShieldCheck, color: "bg-blue-600", title: "100% Transparent", desc: "No hidden charges. Every fee clearly explained upfront." },
              { icon: Users, color: "bg-primary-red", title: "Dedicated Counsellor", desc: "One personal expert with you from inquiry to admission." },
              { icon: BadgeCheck, color: "bg-green-600", title: "Document Assistance", desc: "We handle all paperwork, forms, and verifications." },
              { icon: Sparkles, color: "bg-amber-500", title: "BSCC Specialist", desc: "Complete guidance for Bihar Student Credit Card scheme." },
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
            <h3 className="font-headline text-3xl font-extrabold text-center mb-10">Admission कैसे मिलता है? Simple 4 Steps</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { step: "01", title: "Call या WhatsApp करें", desc: "हमसे contact करें — free में बात करें" },
                { step: "02", title: "प्रोफाइल और डॉक्यूमेंट शेयर करें", desc: "Marks, budget, documents, और goals बताएं" },
                { step: "03", title: "सर्वश्रेष्ठ कॉलेज विकल्प चुनें", desc: "Top colleges और courses की verified list मिलेगी" },
                { step: "04", title: "Admission Confirm", desc: "Documents से admission तक — हम साथ हैं" },
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
            <p className="text-sm font-bold uppercase tracking-widest text-primary-blue mb-2">Success Stories</p>
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold">हमारे Students की Achievements</h2>
          </AnimateIn>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: "Priya Kumari", course: "B.Ed (2024)", place: "Forbesganj", text: "Counsellor ने बहुत अच्छे से guide किया। BSCC loan में भी help मिली। Admission एकदम tension-free था।" },
              { name: "Aman Raj", course: "B.Pharma (2023)", place: "Araria", text: "शुरू से आखिर तक सब transparent रहा। Documents से लेकर hostel तक — perfect support मिला।" },
              { name: "Sakshi Jha", course: "B.Sc Nursing (2024)", place: "Kishanganj", text: "Nursing में career के लिए confused था। यहाँ की guidance से सही college मिला और BSCC भी apply हुआ।" },
              { name: "Ravi Shankar", course: "B.Tech (2023)", place: "Forbesganj", text: "Engineering के लिए कौन सा college सही रहेगा — पता नहीं था। Siksha Wallah ने सब sort कर दिया। AICTE approved college मिला।" },
              { name: "Anjali Devi", course: "GNM (2024)", place: "Purnea", text: "GNM admission का पूरा process यहाँ बहुत आसान था। BSCC loan भी मिला। Staff बहुत helpful है।" },
              { name: "Vikash Kumar", course: "D.El.Ed (2023)", place: "Araria", text: "Primary teacher बनना था। D.El.Ed के लिए सही college ढूंढने में Siksha Wallah ने बहुत मदद की। अब मैं govt school में पढ़ा रहा हूँ।" },
              { name: "Neha Bharti", course: "BBA (2024)", place: "Forbesganj", text: "BBA admission पहली बार में ही confirm हो गई। बिना किसी extra charge के पूरा process हुआ। बहुत trust है इन पर।" },
              { name: "Sonu Kumar", course: "B.Pharma (2024)", place: "Supaul", text: "Pharmacy में interest था लेकिन कोई proper guidance नहीं थी। यहाँ आकर सब clear हो गया। College भी अच्छा मिला।" },
              { name: "Puja Kumari", course: "ANM (2023)", place: "Kishanganj", text: "ANM course के लिए सब documents की list और process यहाँ से मिली। बहुत आसान था। 10 में से 10 दूँगी।" },
              { name: "Rahul Paswan", course: "ITI (2024)", place: "Forbesganj", text: "ITI में admission के लिए घर वाले confused थे। Siksha Wallah के counsellor ने सब explain किया और सही trade choose करने में help की।" },
              { name: "Komal Singh", course: "M.Ed (2024)", place: "Araria", text: "M.Ed admission के लिए Bihar से बाहर जाना पड़ा। Siksha Wallah ने out-of-state college में भी admission दिलाया। Great experience!" },
              { name: "Deepak Jha", course: "MBA (2023)", place: "Purnea", text: "MBA के लिए BSCC loan apply किया। पूरी file Siksha Wallah team ने prepare की। बिना tension के loan approve हो गया।" },
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
            <p className="text-sm font-bold uppercase tracking-widest text-primary-blue mb-2">Admission Preparation</p>
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold">Required Documents Checklist</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              Tick off each document as you gather it. Bring all originals + 2 photocopies to the Siksha Wallah office.
            </p>
          </AnimateIn>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] items-start">
            {/* Interactive Checklist */}
            <div className="rounded-2xl border-2 border-gray-100 bg-gray-50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between bg-primary-blue px-6 py-4">
                <div className="flex items-center gap-2 text-white">
                  <ListChecks size={20} />
                  <span className="font-headline font-extrabold text-lg">Document Checklist</span>
                </div>
                <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-bold text-white">
                  {Object.values(checkedDocs).filter(Boolean).length} / {[
                    "10th-marksheet", "12th-marksheet", "graduation", "aadhaar",
                    "residential", "income", "caste", "photos", "tc", "migration"
                  ].length} Done
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
                      { id: "10th-marksheet", label: "10th Marksheet & Passing Certificate", note: "Original board certificate required", required: true },
                      { id: "12th-marksheet", label: "12th Marksheet & Passing Certificate", note: "All subjects marksheet + passing/migration cert.", required: true },
                      { id: "graduation", label: "Graduation Degree & All Year Marksheets", note: "Required for B.Ed, M.Ed, MBA, MCA, and all PG courses", required: false },
                    ],
                  },
                  {
                    group: "Identity & Residence Documents",
                    color: "bg-green-100 text-green-700",
                    docs: [
                      { id: "aadhaar", label: "Aadhaar Card (Student)", note: "Must be linked to active mobile number", required: true },
                      { id: "residential", label: "Residential / Domicile Certificate", note: "Bihar domicile certificate from SDO/Circle Office", required: true },
                      { id: "income", label: "Income Certificate", note: "Annual family income certificate from CO/SDO (₹4.5L limit for BSCC)", required: true },
                      { id: "caste", label: "Caste Certificate (SC/ST/OBC if applicable)", note: "Required for reserved category seats & scholarships", required: false },
                    ],
                  },
                  {
                    group: "Other Essential Documents",
                    color: "bg-amber-100 text-amber-700",
                    docs: [
                      { id: "photos", label: "Passport Size Photographs", note: "6–8 recent color photos on white background", required: true },
                      { id: "tc", label: "Transfer Certificate (TC)", note: "From your last attended school/college", required: true },
                      { id: "migration", label: "Migration Certificate (if from another board)", note: "Required if 12th was from CBSE/ISC for state university admission", required: false },
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
                                <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600">REQUIRED</span>
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
                    <p className="font-bold text-sm">Documents ready? Visit us or call!</p>
                    <p className="text-xs text-blue-200">We verify all documents for FREE at our Forbesganj office.</p>
                  </div>
                  <a
                    href="https://wa.me/916203138576?text=नमस्ते!%20मैंने%20अपने%20admission%20documents%20collect%20कर%20लिए%20हैं।%20आगे%20का%20process%20बताएं।"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-primary-blue hover:bg-blue-50 transition"
                  >
                    <MessageCircle size={15} /> WhatsApp Now
                  </a>
                </div>
              </div>
            </div>

            {/* Right panel — course-wise special docs */}
            <div className="space-y-5">
              <h3 className="font-headline text-2xl font-extrabold text-gray-900">Course-Specific Additional Requirements</h3>
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
                <p className="font-bold text-amber-800 text-sm mb-1">Not sure what to bring?</p>
                <p className="text-xs text-amber-700 mb-3">Call us and our team will give you a complete custom document list for your specific course in 2 minutes.</p>
                <a href="tel:+916203138576" className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-amber-600 transition">
                  <Phone size={14} /> Call: 6203138576
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ACCORDION ── */}
      <section id="faq" className="py-24 bg-gray-50">
        <div className="container-shell">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] items-start">
            <AnimateIn type="fade-right">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-primary-blue mb-3">FAQ</p>
              <h2 className="font-headline text-4xl font-extrabold">अक्सर पूछे जाने वाले सवाल</h2>
              <p className="mt-4 text-gray-500">Direct बात करना चाहते हैं?</p>
              <div className="mt-6 space-y-3">
                {[["6203138576", "Rajesh Kr. Sah"], ["7858062498", "Md. Naseem Ansari"], ["9162653235", "Gautam Kumar"]].map(([num, name]) => (
                  <a key={num} href={`tel:+91${num}`} className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 font-semibold text-gray-700 transition hover:border-primary-blue hover:text-primary-blue">
                    <Phone size={18} className="text-primary-blue" />
                    <div>
                      <div className="font-bold">+91 {num}</div>
                      <div className="text-xs text-gray-400">{name}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            </AnimateIn>

            <AnimateIn type="fade-left" delay={100}>
            <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 overflow-hidden">
              {faqs.map(({ q, a }, i) => (
                <div key={q}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-headline font-bold text-lg text-gray-900 hover:bg-gray-50 transition"
                  >
                    <span>{q}</span>
                    <ChevronDown size={22} className={`flex-shrink-0 text-primary-blue transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                      {a}
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
              <p className="text-sm font-bold uppercase tracking-widest mb-3 text-amber-400">हमसे मिलें</p>
              <h2 className="font-headline text-4xl md:text-5xl font-extrabold mb-6">
                Visit Us or Call Now
              </h2>

              {/* Location card */}
              <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary-blue">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h3 className="font-headline text-lg font-extrabold text-white">Office Address</h3>
                    <p className="mt-1 text-gray-300">College Chowk, Near HP Petrol Pump</p>
                    <p className="text-gray-300">Forbesganj, Araria — Bihar</p>
                    <a
                      href="https://maps.google.com/?q=College+Chowk+Forbesganj+Araria+Bihar"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-amber-400 hover:text-amber-300"
                    >
                      Open in Google Maps →
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {[["6203138576", "Rajesh Kr. Sah — Head Counsellor"], ["7858062498", "Md. Naseem Ansari — Nursing & BSCC"], ["9162653235", "Gautam Kumar — Technical & Management"]].map(([num, label]) => (
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
                <MessageCircle size={20} /> WhatsApp पर Chat करें
              </a>
            </div>
            </AnimateIn>

            {/* Right — Contact form with Firestore save */}
            <AnimateIn type="fade-left" delay={100}>
            <div className="rounded-2xl bg-white p-8 text-gray-900 shadow-xl">
              <h3 className="font-headline text-2xl font-extrabold mb-2">Admission Plan बनाइए</h3>
              <p className="text-gray-500 text-sm mb-6">Fill the form — हमारा counsellor 30 minutes में call करेगा।</p>
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
                <input name="cname" required placeholder="पूरा नाम (Full Name)" className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 outline-none focus:border-primary-blue transition" />
                <input name="cmobile" required type="tel" placeholder="Mobile Number" className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 outline-none focus:border-primary-blue transition" />
                <select name="ccourse" className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-gray-600 outline-none focus:border-primary-blue bg-white transition">
                  <option value="">-- Course Select करें --</option>
                  <option>B.Ed / D.El.Ed</option>
                  <option>B.Sc Nursing / GNM / ANM</option>
                  <option>B.Pharma / D.Pharma</option>
                  <option>MBBS / BDS</option>
                  <option>BBA / MBA</option>
                  <option>B.Tech / Polytechnic / ITI</option>
                  <option>BCA / MCA</option>
                  <option>अभी decide नहीं किया</option>
                </select>
                <select name="cqualify" className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-gray-600 outline-none focus:border-primary-blue bg-white transition">
                  <option value="">-- Current Qualification --</option>
                  <option>10th Pass</option>
                  <option>12th Pass (Arts)</option>
                  <option>12th Pass (Science)</option>
                  <option>12th Pass (Commerce)</option>
                  <option>Graduation</option>
                  <option>Post Graduation</option>
                </select>
                <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary-blue py-4 font-extrabold text-white transition hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95">
                  Free Counselling Book करें <ArrowRight size={18} />
                </button>
              </form>
              <p className="mt-4 text-center text-xs text-gray-400">100% Free. No spam. No hidden charges.</p>
            </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
