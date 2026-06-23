"use client";

import Link from "next/link";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Award, BadgeCheck, BookMarked, Briefcase, Building2, CheckCircle2,
  ChevronDown, ChevronUp, Clock, CreditCard, FileText, MessageCircle,
  ShieldCheck, Sparkles, Star, GraduationCap, Stethoscope, Cpu,
  Activity, Scale,
} from "lucide-react";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { streamTabs, colorMap, type StreamKey } from "@/lib/courses-data";

/* ─── per-stream metadata ─────────────────────────────────────────────── */
const STREAM_META: Record<StreamKey, {
  approval: string;
  tagline: string;
  partnerNote: string;
  partnerPoints: string[];
}> = {
  teaching: {
    approval: "NCTE Approved",
    tagline: "Build a respected teaching career — qualify for Bihar STET / BTET and government school roles.",
    partnerNote: "हम केवल NCTE-Approved teacher training colleges के साथ काम करते हैं — Bihar (Patna, Purnea, Katihar) और West Bengal में।",
    partnerPoints: [
      "NCTE-approved B.Ed and D.El.Ed colleges across Patna, Purnea and Katihar",
      "NCTE-recognised institutions in West Bengal for wider choice",
      "100% support for Bihar Student Credit Card (BSCC) loan application",
      "Regular and Distance mode — guidance for whichever suits your situation",
    ],
  },
  medical: {
    approval: "INC / PCI / NMC Approved",
    tagline: "Begin your healthcare career — secure admission as a doctor, nurse or pharmacist.",
    partnerNote: "हम INC, PCI और NMC-approved premier institutes के साथ partner हैं — Bangalore, MP, West Bengal और Bihar में।",
    partnerPoints: [
      "INC-approved Nursing colleges in Bangalore and West Bengal",
      "PCI-approved Pharmacy institutes in Madhya Pradesh",
      "NMC-approved medical colleges for MBBS/BAMS through NEET",
      "Full guidance for NEET counselling and direct admission routes",
    ],
  },
  paramedical: {
    approval: "University / State Council Approved",
    tagline: "Specialized healthcare roles — physiotherapy, radiology, lab tech, OT — without NEET.",
    partnerNote: "हम state-approved और university-affiliated para medical colleges के साथ काम करते हैं — Bihar, Jharkhand और Madhya Pradesh में।",
    partnerPoints: [
      "State-approved para medical degree and diploma colleges across Bihar",
      "University-affiliated colleges in Jharkhand and MP",
      "No NEET required — 12th Biology (PCB) is sufficient for all courses",
      "100% BSCC loan support for eligible para medical courses",
    ],
  },
  law: {
    approval: "BCI Approved",
    tagline: "Become an advocate, corporate lawyer or civil judge — Bihar's most respected career path.",
    partnerNote: "हम BCI (Bar Council of India) approved top law colleges के साथ काम करते हैं — Patna, Jharkhand और अन्य राज्यों में।",
    partnerPoints: [
      "BCI-approved law colleges in Patna, Muzaffarpur and Bhagalpur",
      "CLAT guidance for Chanakya National Law University (CNLU) Patna",
      "Both 3-year LLB and 5-year integrated BA.LLB / BBA.LLB available",
      "BSCC loan support available for eligible law students",
    ],
  },
  technical: {
    approval: "AICTE / UGC Approved",
    tagline: "Shape a future as an engineer, manager or IT professional — choose the right technical pathway.",
    partnerNote: "हम AICTE और UGC recognised top universities के साथ partner हैं — Engineering, Management और Computer Applications के लिए।",
    partnerPoints: [
      "AICTE-approved B.Tech and Polytechnic colleges across India",
      "UGC-recognised universities for BCA, MCA, BBA and MBA",
      "Complete JEE / DCECE counselling guidance included",
      "Distance mode also available through UGC-DEB approved programmes",
    ],
  },
};

/* ─── Course Card ─────────────────────────────────────────────────────── */
function CourseCard({
  course,
  streamKey,
  isExpanded,
  onToggle,
}: {
  course: (typeof streamTabs)[0]["courses"][0];
  streamKey: StreamKey;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const tab = streamTabs.find((s) => s.key === streamKey)!;
  const colors = colorMap[tab.color];

  return (
    <div
      className={`group relative rounded-2xl border bg-white overflow-hidden transition-all duration-200 ${
        isExpanded
          ? "border-gray-200 shadow-lg"
          : "border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5"
      }`}
    >
      {/* Colored top accent bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${colors.accentBar}`} />

      <div className="p-5 md:p-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className={`inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full ${colors.badge}`}>
            <Award size={11} /> {course.name}
          </span>
          {course.bscc && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
              <CreditCard size={9} /> BSCC Loan
            </span>
          )}
        </div>

        <h3 className="font-headline text-lg font-extrabold text-gray-900 leading-snug mb-4">
          {course.full}
        </h3>

        {/* Info chips */}
        <div className="flex flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5 text-xs text-gray-600">
            <Clock size={11} className="text-gray-400" /> {course.duration}
          </div>
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5 text-xs text-gray-600">
            <CreditCard size={11} className="text-gray-400" /> {course.fee}
          </div>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed">
          <span className="font-semibold text-gray-700">Eligibility: </span>
          {course.eligibility}
        </p>

        {/* ── Expanded details ── */}
        {isExpanded && (
          <div className="mt-5 space-y-4 border-t border-gray-100 pt-4">
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

            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
              <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600">
                <Sparkles size={12} /> हिंदी में जानें
              </div>
              <p className="text-sm leading-relaxed text-amber-900">{course.hindiDesc}</p>
            </div>

            <div className="flex items-start gap-2">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-green-100">
                <Award size={13} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Expected Salary</p>
                <p className="text-sm font-bold text-green-700">{course.salary}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100">
                <FileText size={13} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Entrance Exam</p>
                <p className="text-sm leading-relaxed text-gray-700">{course.entranceExam}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-red-100">
                <ShieldCheck size={13} className="text-red-600" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Government Jobs</p>
                <p className="text-sm leading-relaxed text-gray-700">{course.govtJobs}</p>
              </div>
            </div>

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

            <div>
              <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
                <Briefcase size={12} /> Career Scope
              </div>
              <p className="text-sm leading-relaxed text-gray-700">{course.careerScope}</p>
            </div>

            <div>
              <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
                <BookMarked size={12} /> Study Mode
              </div>
              <p className="text-sm leading-relaxed text-gray-700">{course.mode}</p>
            </div>

            {course.bscc && (
              <div className="rounded-xl bg-green-50 border border-green-200 p-3 flex items-start gap-2">
                <CreditCard size={15} className="mt-0.5 flex-shrink-0 text-green-600" />
                <p className="text-xs text-green-700 font-semibold">
                  Eligible for Bihar Student Credit Card (BSCC) — up to ₹4 Lakh education loan at 4% interest. Our team guides you through the complete application, end to end.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-5 flex flex-col gap-2">
          <button
            onClick={onToggle}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-gray-200 py-2.5 text-sm font-bold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
          >
            {isExpanded
              ? <><ChevronUp size={15} /> Hide Details</>
              : <><ChevronDown size={15} /> View Career Scope & Details</>}
          </button>
          <a
            href={`https://wa.me/916203138576?text=नमस्ते!%20मुझे%20${encodeURIComponent(course.name)}%20(${encodeURIComponent(course.full)})%20के%20बारे%20में%20जानकारी%20चाहिए।%20Fees%20aur%20admission%20process%20batayein।`}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white transition ${colors.btn}`}
          >
            <MessageCircle size={15} /> Enquire About Fees & Admission
          </a>
          {course.bscc && (
            <Link
              href="/student-credit-card"
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-green-500 py-2.5 text-sm font-bold text-green-700 transition hover:bg-green-500 hover:text-white"
            >
              <CreditCard size={15} /> Check BSCC Loan Eligibility →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Stream Picker helpers ───────────────────────────────────────────── */
const STREAM_TAGLINES: Record<StreamKey, string> = {
  teaching:    "Govt Teacher बनें",
  medical:     "Doctor · Nurse · Pharma",
  paramedical: "Lab · Physio · Radiology",
  law:         "Advocate · Judge · Legal",
  technical:   "Engineer · IT · MBA",
};

function getGlowColor(color: string): string {
  const glows: Record<string, string> = {
    blue:   "rgba(59,130,246,0.40)",
    red:    "rgba(239,68,68,0.40)",
    teal:   "rgba(20,184,166,0.40)",
    purple: "rgba(147,51,234,0.40)",
    orange: "rgba(249,115,22,0.40)",
  };
  return glows[color] ?? "rgba(255,255,255,0.18)";
}

/* ─── Stream Picker Card ──────────────────────────────────────────────── */
function StreamCard({
  tab,
  isActive,
  onClick,
}: {
  tab: (typeof streamTabs)[0];
  isActive: boolean;
  onClick: () => void;
}) {
  const colors = colorMap[tab.color];
  const Icon = tab.icon;

  return (
    <button
      onClick={onClick}
      style={isActive ? { boxShadow: `0 0 0 2px rgba(255,255,255,0.22), 0 20px 48px -8px ${getGlowColor(tab.color)}` } : undefined}
      className={`group relative flex w-[calc(50%-8px)] sm:w-48 flex-col items-start gap-0 overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer text-left ${
        isActive
          ? "bg-white/[0.18] border-white/30 -translate-y-2 scale-[1.03]"
          : "border-white/[0.10] bg-white/[0.05] hover:bg-white/[0.12] hover:border-white/[0.22] hover:-translate-y-1.5 hover:shadow-xl"
      }`}
    >
      {/* Colored top accent bar */}
      <div className={`h-[3px] w-full bg-gradient-to-r ${colors.accentBar} ${isActive ? "opacity-100" : "opacity-50 group-hover:opacity-80"} transition-opacity`} />

      <div className="flex flex-col gap-3 p-5 w-full">
        {/* Icon circle */}
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
          isActive
            ? `bg-gradient-to-br ${colors.gradient} shadow-lg`
            : "bg-white/[0.08] group-hover:bg-white/[0.14]"
        }`}>
          <Icon size={22} className={isActive ? "text-white" : "text-gray-300 group-hover:text-white"} />
        </div>

        {/* Labels */}
        <div>
          <p className={`text-sm font-extrabold leading-tight ${isActive ? "text-white" : "text-gray-100 group-hover:text-white"}`}>
            {tab.label}
          </p>
          <p className={`mt-0.5 text-[11px] font-medium ${isActive ? "text-white/70" : "text-gray-500 group-hover:text-gray-400"}`}>
            {STREAM_TAGLINES[tab.key as StreamKey]}
          </p>
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
            isActive
              ? `bg-gradient-to-r ${colors.gradient} text-white shadow-sm`
              : "bg-white/[0.08] text-gray-400 group-hover:bg-white/[0.14] group-hover:text-gray-200"
          }`}>
            {tab.courses.length} Courses
          </span>
          {isActive && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-300">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              Active
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────── */
function CoursesInner() {
  const searchParams = useSearchParams();
  const [activeStream, setActiveStream] = useState<StreamKey>("teaching");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const contentRef = useRef<HTMLElement | null>(null);
  const tabBarRef = useRef<HTMLDivElement>(null);

  /* ?stream= param from hero / external link */
  useEffect(() => {
    const s = searchParams.get("stream") as StreamKey | null;
    const validKeys = streamTabs.map((t) => t.key);
    if (s && validKeys.includes(s)) setActiveStream(s);
  }, [searchParams]);

  /* Reset expanded card when stream changes */
  useEffect(() => {
    setExpandedCard(null);
  }, [activeStream]);

  function handleStreamSelect(key: StreamKey) {
    setActiveStream(key);
    /* Scroll to content on mobile when picking from the visual picker */
    if (contentRef.current && window.scrollY < 300) {
      const tabH = tabBarRef.current?.offsetHeight ?? 64;
      const top = contentRef.current.getBoundingClientRect().top + window.scrollY - tabH - 16;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  const activeTab = streamTabs.find((t) => t.key === activeStream)!;
  const meta = STREAM_META[activeStream];
  const colors = colorMap[activeTab.color];

  const totalCourses = streamTabs.reduce((s, t) => s + t.courses.length, 0);

  return (
    <main className="bg-white text-gray-900">
      <SiteNavbar />

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#00102e] via-[#001850] to-[#003590] text-white py-16 md:py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
        <div className="pointer-events-none absolute -top-40 -right-32 h-[480px] w-[480px] rounded-full bg-amber-400 opacity-[0.10] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-500 opacity-[0.13] blur-3xl" />

        <div className="container-shell text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/[0.1] px-4 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
            <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber-300">Session 2026–27</span>
          </div>

          <h1 className="font-headline text-[2.5rem] font-black leading-[1.08] tracking-tight md:text-6xl lg:text-[4rem]">
            <span className="block text-white [text-shadow:0_2px_20px_rgba(255,255,255,0.15)]">Choose the Right Course</span>
            <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">for a Confident Career</span>
          </h1>
          <div className="mx-auto mt-3 h-[3px] w-28 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-transparent md:w-40" />

          <p className="mt-6 max-w-2xl mx-auto text-blue-100 text-lg">
            Teaching, Medical, Para Medical, Law, Engineering और Management —{" "}
            <span className="font-bold text-white">{totalCourses}+ verified courses</span>, अनुभवी काउंसलर के साथ।
          </p>

          {/* Stream stats row */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {streamTabs.map(({ key, label, icon: Icon, courses, color }) => (
              <button
                key={key}
                onClick={() => handleStreamSelect(key)}
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/20 bg-white/[0.08] px-4 py-2.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/[0.16] hover:-translate-y-0.5"
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{key === "paramedical" ? "Para Med" : label.split(" ")[0]}</span>
                <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-black">{courses.length}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── STREAM PICKER ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#00102e] via-[#001850] to-[#003590] py-16 md:py-24">
        {/* Dot grid — identical to hero */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
        {/* Glow orbs — identical to hero */}
        <div className="pointer-events-none absolute -top-40 -right-32 h-[480px] w-[480px] rounded-full bg-amber-400 opacity-[0.10] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-500 opacity-[0.13] blur-3xl" />
        {/* Extra centre glow for depth */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-indigo-600 opacity-[0.08] blur-[80px]" />

        <div className="container-shell relative text-center">

          {/* Session badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/[0.10] px-4 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
            <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber-300">Session 2026–27 &nbsp;·&nbsp; Admissions Open</span>
          </div>

          {/* Heading */}
          <h2 className="font-headline text-[2rem] font-black leading-[1.1] tracking-tight text-white md:text-5xl">
            अपने भविष्य की{" "}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
              दिशा चुनें
            </span>
          </h2>

          {/* Underline accent — same as hero */}
          <div className="mx-auto mt-3 h-[3px] w-24 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-transparent md:w-36" />

          {/* Stats row */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold text-blue-100">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              50+ Courses
            </span>
            <span className="hidden sm:block h-4 w-px bg-white/20" />
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              200+ Partner Colleges
            </span>
            <span className="hidden sm:block h-4 w-px bg-white/20" />
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              100% Free Counselling
            </span>
          </div>

          {/* Stream cards */}
          <div className="mt-10 flex flex-wrap justify-center gap-3 md:gap-4">
            {streamTabs.map((tab) => (
              <StreamCard
                key={tab.key}
                tab={tab}
                isActive={activeStream === tab.key}
                onClick={() => handleStreamSelect(tab.key)}
              />
            ))}
          </div>

          {/* Helper hint */}
          <p className="mt-7 text-xs text-blue-300/70">
            किसी भी stream पर click करें — courses, fees और career scope तुरंत दिखेगा
          </p>
        </div>
      </section>

      {/* ── STICKY COMPACT TAB BAR ────────────────────────────────── */}
      <div ref={tabBarRef} className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="container-shell py-2">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
            {streamTabs.map(({ key, label, shortLabel, icon: Icon, color, courses }) => {
              const isActive = activeStream === key;
              const c = colorMap[color];
              return (
                <button
                  key={key}
                  onClick={() => setActiveStream(key)}
                  className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? `bg-gradient-to-r ${c.gradient} text-white shadow-sm`
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={13} />
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{shortLabel}</span>
                  <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-black ${
                    isActive ? "bg-white/25 text-white" : "bg-gray-100 text-gray-400"
                  }`}>
                    {courses.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── ACTIVE STREAM CONTENT ─────────────────────────────────── */}
      <section
        ref={contentRef}
        className={`py-12 md:py-18 ${colors.sectionBg} transition-all duration-300`}
      >
        <div className="container-shell">

          {/* Stream header card */}
          <div className={`mb-8 rounded-2xl bg-gradient-to-r ${colors.gradient} p-7 text-white shadow-xl`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 border border-white/30 px-3 py-1 text-xs font-bold text-white">
                    <BadgeCheck size={12} /> {meta.approval}
                  </span>
                </div>
                <h2 className="font-headline text-2xl md:text-3xl font-extrabold flex items-center gap-3">
                  {(() => { const Icon = activeTab.icon; return <Icon size={28} className="opacity-90" />; })()}
                  {activeTab.label}
                </h2>
                <p className="mt-1.5 text-sm text-white/85 max-w-xl">{meta.tagline}</p>
              </div>
              <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                <span className="text-5xl font-black">{activeTab.courses.length}</span>
                <span className="text-xs font-semibold text-white/70">Verified Courses</span>
              </div>
            </div>
          </div>

          {/* Partner info banner */}
          <div className={`mb-8 rounded-2xl border-2 ${colors.pointBorder} bg-white p-5 shadow-sm`}>
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${colors.gradient} text-white`}>
                <Building2 size={18} />
              </div>
              <div className="flex-1">
                <p className={`text-sm ${colors.pointText} mb-3`}>{meta.partnerNote}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {meta.partnerPoints.map((pt, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-2 rounded-lg bg-gray-50 border ${colors.pointBorder} px-3 py-2 text-xs ${colors.pointText} font-medium`}
                    >
                      <CheckCircle2 size={12} className={`mt-0.5 flex-shrink-0 ${colors.checkColor}`} /> {pt}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Course cards grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {activeTab.courses.map((course) => (
              <CourseCard
                key={course.name}
                course={course}
                streamKey={activeStream}
                isExpanded={expandedCard === `${activeStream}-${course.name}`}
                onToggle={() =>
                  setExpandedCard(
                    expandedCard === `${activeStream}-${course.name}`
                      ? null
                      : `${activeStream}-${course.name}`,
                  )
                }
              />
            ))}
          </div>

          {/* Bottom stream CTA */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border-2 border-dashed border-gray-200 bg-white px-6 py-5">
            <div>
              <p className="font-bold text-gray-800">Looking for admission in {activeTab.label}?</p>
              <p className="text-sm text-gray-500">
                हमारे अनुभवी counsellors आपके अंक, बजट और लक्ष्य के अनुसार सही college चुनने में मदद करेंगे — पूरी प्रक्रिया 100% निःशुल्क।
              </p>
            </div>
            <a
              href={`https://wa.me/916203138576?text=नमस्ते!%20मुझे%20${encodeURIComponent(activeTab.label)}%20के%20लिए%20admission%20guidance%20चाहिए।%20Please%20help%20karein।`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-green-500 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-green-600"
            >
              <MessageCircle size={16} /> Speak to a Counsellor
            </a>
          </div>
        </div>
      </section>

      {/* ── OTHER STREAMS QUICK LINKS ─────────────────────────────── */}
      <section className="bg-gray-900 py-10">
        <div className="container-shell">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
            Explore Other Streams
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {streamTabs
              .filter((t) => t.key !== activeStream)
              .map(({ key, label, icon: Icon, color, courses }) => {
                const c = colorMap[color];
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveStream(key);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex items-center gap-2.5 rounded-2xl border border-gray-700 bg-gray-800 px-5 py-3 text-sm font-bold text-gray-200 transition hover:bg-gray-700 hover:text-white hover:border-gray-500"
                  >
                    <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${c.icon}`}>
                      <Icon size={14} />
                    </span>
                    {label}
                    <span className="rounded-full bg-gray-700 px-2 py-0.5 text-[10px] font-black text-gray-300">
                      {courses.length}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-emerald-700 to-teal-700 py-14 text-white text-center">
        <div className="container-shell">
          <h2 className="font-headline text-3xl font-extrabold mb-3">
            Still confused about which course is right for you?
          </h2>
          <p className="text-emerald-100 mb-7 max-w-xl mx-auto">
            हमारे अनुभवी काउंसलर आपके अंक, बजट और career लक्ष्यों को समझकर सबसे उपयुक्त course और college की सलाह देंगे — पूरी प्रक्रिया 100% निःशुल्क।
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/916203138576?text=नमस्ते!%20मुझे%20सही%20course%20choose%20करने%20में%20guidance%20चाहिए।%20Please%20help%20karein।"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-7 py-4 font-extrabold text-gray-900 transition hover:bg-amber-300"
            >
              <MessageCircle size={18} /> Get Free Course Counselling
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/40 bg-white/10 px-7 py-4 font-bold text-white transition hover:bg-white/20"
            >
              Visit Our Office →
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/916203138576?text=नमस्ते!%20मुझे%20Siksha%20Wallah%20से%20admission%20guidance%20चाहिए।%20Please%20contact%20karein।"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/40 transition hover:bg-green-600 hover:scale-110"
        aria-label="WhatsApp"
      >
        <MessageCircle size={26} />
      </a>
    </main>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={null}>
      <CoursesInner />
    </Suspense>
  );
}
