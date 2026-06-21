"use client";

import Link from "next/link";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Award, BadgeCheck, BookMarked, Briefcase, Building2, CheckCircle2,
  ChevronDown, ChevronUp, Clock, CreditCard, FileText, MessageCircle,
  ShieldCheck, Sparkles, Star, GraduationCap, Stethoscope, Cpu,
} from "lucide-react";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { streamTabs, colorMap, type StreamKey } from "@/lib/courses-data";

/* ─── per-stream config ─────────────────────────────────────────────── */
const SECTION_META: Record<StreamKey, {
  id: string;
  icon: React.ReactNode;
  tagline: string;
  approval: string;
  approvalBadge: string;
  partnerNote: string;
  partnerPoints: string[];
  sectionBg: string;
  headerBg: string;
  headerText: string;
  badgeBg: string;
  borderColor: string;
  pointBorder: string;
  pointText: string;
  checkColor: string;
  tabActive: string;
  tabBorder: string;
}> = {
  teaching: {
    id: "teaching",
    icon: <GraduationCap size={20} />,
    tagline: "Become a Govt Teacher — Bihar STET / BTET qualified",
    approval: "NCTE Approved",
    approvalBadge: "bg-blue-600",
    partnerNote: "हम केवल NCTE Approved colleges के साथ partner हैं — Bihar, Purnea, Katihar, Patna, और West Bengal में।",
    partnerPoints: [
      "NCTE Approved colleges in Patna, Purnea & Katihar (Bihar)",
      "NCTE Recognized institutions in West Bengal",
      "100% BSCC (Bihar Student Credit Card) facility available",
      "Regular & Distance mode — both options guided",
    ],
    sectionBg: "bg-blue-50/40",
    headerBg: "bg-gradient-to-r from-blue-700 to-indigo-700",
    headerText: "text-blue-50",
    badgeBg: "bg-blue-100 text-blue-700",
    borderColor: "border-blue-200",
    pointBorder: "border-blue-100",
    pointText: "text-blue-800",
    checkColor: "text-blue-500",
    tabActive: "bg-blue-600 text-white border-blue-600",
    tabBorder: "border-blue-600",
  },
  medical: {
    id: "medical",
    icon: <Stethoscope size={20} />,
    tagline: "Doctor, Nurse, Pharmacist — Healthcare ka safar shuru karo",
    approval: "INC & PCI Approved",
    approvalBadge: "bg-red-600",
    partnerNote: "हम INC & PCI Approved premier institutes के साथ partner हैं — Bangalore, Madhya Pradesh, और West Bengal में।",
    partnerPoints: [
      "INC Approved Nursing colleges in Bangalore & West Bengal",
      "PCI Approved Pharmacy institutes in Madhya Pradesh",
      "Premier private medical institutes with hostel facility",
      "NEET counselling & direct admission both available",
    ],
    sectionBg: "bg-red-50/40",
    headerBg: "bg-gradient-to-r from-red-700 to-rose-700",
    headerText: "text-red-50",
    badgeBg: "bg-red-100 text-red-700",
    borderColor: "border-red-200",
    pointBorder: "border-red-100",
    pointText: "text-red-800",
    checkColor: "text-red-500",
    tabActive: "bg-red-600 text-white border-red-600",
    tabBorder: "border-red-600",
  },
  technical: {
    id: "technical",
    icon: <Cpu size={20} />,
    tagline: "Engineer, Manager, IT Professional — Technical career banao",
    approval: "AICTE & UGC Approved",
    approvalBadge: "bg-orange-600",
    partnerNote: "हम AICTE & UGC Recognized top universities के साथ partner हैं — engineering, management, और computer courses के लिए।",
    partnerPoints: [
      "AICTE Approved B.Tech & Polytechnic colleges across India",
      "UGC Recognized universities for BCA, MCA, BBA & MBA",
      "JEE / DCECE counselling guidance included",
      "Distance mode also available for UGC-DEB approved courses",
    ],
    sectionBg: "bg-orange-50/40",
    headerBg: "bg-gradient-to-r from-orange-600 to-amber-600",
    headerText: "text-orange-50",
    badgeBg: "bg-orange-100 text-orange-700",
    borderColor: "border-orange-200",
    pointBorder: "border-orange-100",
    pointText: "text-orange-800",
    checkColor: "text-orange-500",
    tabActive: "bg-orange-600 text-white border-orange-600",
    tabBorder: "border-orange-600",
  },
};

const STREAM_ORDER: StreamKey[] = ["teaching", "medical", "technical"];

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
  const colors = colorMap[streamTabs.find((s) => s.key === streamKey)!.color];

  return (
    <div
      className={`group relative rounded-2xl border-2 bg-white shadow-sm transition-all duration-200 ${colors.card} ${
        isExpanded ? "shadow-lg" : "border-gray-200"
      }`}
    >
      <div className="p-5 md:p-6">
        {/* Top row */}
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

        <h3 className="mt-3 font-headline text-xl font-extrabold text-gray-900 leading-tight">
          {course.full}
        </h3>

        <div className="mt-4 space-y-2 text-sm text-gray-600">
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

        {/* Expanded details */}
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
                  Bihar Student Credit Card (BSCC) eligible — get up to ₹4 Lakh loan for this course at only 4% interest. Siksha Wallah guides for complete BSCC application.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="mt-5 flex flex-col gap-2">
          <button
            onClick={onToggle}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-gray-200 py-2.5 text-sm font-bold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
          >
            {isExpanded ? <><ChevronUp size={15} /> Hide Details</> : <><ChevronDown size={15} /> View Career Scope & Mode</>}
          </button>
          <a
            href={`https://wa.me/916203138576?text=नमस्ते!%20मुझे%20${encodeURIComponent(course.name)}%20(${encodeURIComponent(course.full)})%20के%20बारे%20में%20जानकारी%20चाहिए।%20Fees%20aur%20admission%20process%20batayein।`}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white transition ${colors.btn}`}
          >
            <MessageCircle size={15} /> Inquire Fee & Admission
          </a>
          {course.bscc && (
            <Link
              href="/student-credit-card"
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-green-500 py-2.5 text-sm font-bold text-green-700 transition hover:bg-green-500 hover:text-white"
            >
              <CreditCard size={15} /> Apply via BSCC →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────── */
function CoursesInner() {
  const searchParams = useSearchParams();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<StreamKey>("teaching");
  const sectionRefs = useRef<Record<StreamKey, HTMLElement | null>>({
    teaching: null,
    medical: null,
    technical: null,
  });
  const tabBarRef = useRef<HTMLDivElement>(null);

  /* scroll → update active tab */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id as StreamKey);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    STREAM_ORDER.forEach((key) => {
      const el = sectionRefs.current[key];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  /* ?stream= param from hero marquee */
  useEffect(() => {
    const s = searchParams.get("stream") as StreamKey | null;
    if (s && STREAM_ORDER.includes(s)) {
      setTimeout(() => scrollToSection(s), 200);
    }
  }, [searchParams]);

  function scrollToSection(key: StreamKey) {
    const el = sectionRefs.current[key];
    if (!el) return;
    const tabH = tabBarRef.current?.offsetHeight ?? 64;
    const top = el.getBoundingClientRect().top + window.scrollY - tabH - 16;
    window.scrollTo({ top, behavior: "smooth" });
  }

  return (
    <main className="bg-white text-gray-900">
      <SiteNavbar />

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#047857] text-white py-16 md:py-24 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-teal-400 opacity-20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -left-20 h-64 w-64 rounded-full bg-emerald-300 opacity-15 blur-3xl" />
        <div className="container-shell text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
            <BadgeCheck size={16} className="text-amber-400" /> NCTE • INC • PCI • AICTE Approved Colleges
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold mt-4 leading-tight bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
            सभी कोर्सेज — एक जगह
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-emerald-100 text-lg">
            Teaching, Medical &amp; Technical — 3 streams में 19+ courses। हर course की पूरी जानकारी, fees, career scope, और Govt Jobs।
          </p>
          {/* Quick jump */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {STREAM_ORDER.map((key) => {
              const meta = SECTION_META[key];
              return (
                <button
                  key={key}
                  onClick={() => scrollToSection(key)}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
                >
                  {meta.icon}
                  {streamTabs.find((s) => s.key === key)!.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STICKY TAB BAR ── */}
      <div
        ref={tabBarRef}
        className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm"
      >
        <div className="container-shell">
          <div className="flex overflow-x-auto no-scrollbar">
            {STREAM_ORDER.map((key) => {
              const meta = SECTION_META[key];
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => scrollToSection(key)}
                  className={`flex shrink-0 items-center gap-2 border-b-[3px] px-5 py-4 text-sm font-bold transition-all ${
                    isActive
                      ? `${meta.tabBorder} text-gray-900`
                      : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {meta.icon}
                  <span className="hidden sm:inline">{streamTabs.find((s) => s.key === key)!.label}</span>
                  <span className="sm:hidden">{key === "teaching" ? "Teaching" : key === "medical" ? "Medical" : "Technical"}</span>
                  <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${isActive ? meta.badgeBg : "bg-gray-100 text-gray-500"}`}>
                    {streamTabs.find((s) => s.key === key)!.courses.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 3 STREAM SECTIONS ── */}
      {STREAM_ORDER.map((key) => {
        const tab = streamTabs.find((s) => s.key === key)!;
        const meta = SECTION_META[key];

        return (
          <section
            key={key}
            id={key}
            ref={(el) => { sectionRefs.current[key] = el; }}
            className={`py-14 md:py-20 ${meta.sectionBg}`}
          >
            <div className="container-shell">

              {/* Section header */}
              <div className={`mb-8 rounded-2xl ${meta.headerBg} p-7 text-white shadow-lg`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1 rounded-full ${meta.approvalBadge} bg-opacity-30 border border-white/30 px-3 py-1 text-xs font-bold text-white`}>
                        <BadgeCheck size={12} /> {meta.approval}
                      </span>
                    </div>
                    <h2 className="font-headline text-2xl md:text-3xl font-extrabold">
                      {tab.label}
                    </h2>
                    <p className={`mt-1 text-sm ${meta.headerText} opacity-90`}>{meta.tagline}</p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                    <span className="text-4xl font-black">{tab.courses.length}</span>
                    <span className="text-xs font-semibold opacity-80">Courses Available</span>
                  </div>
                </div>
              </div>

              {/* Partner banner */}
              <div className={`mb-8 rounded-2xl border-2 ${meta.borderColor} bg-white p-5`}>
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${meta.approvalBadge} text-white`}>
                    <Building2 size={18} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${meta.pointText} mb-3`}>{meta.partnerNote}</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {meta.partnerPoints.map((pt, i) => (
                        <div key={i} className={`flex items-start gap-2 rounded-lg bg-gray-50 border ${meta.pointBorder} px-3 py-2 text-xs ${meta.pointText} font-medium`}>
                          <CheckCircle2 size={12} className={`mt-0.5 flex-shrink-0 ${meta.checkColor}`} /> {pt}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Course cards grid */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {tab.courses.map((course) => (
                  <CourseCard
                    key={course.name}
                    course={course}
                    streamKey={key}
                    isExpanded={expandedCard === `${key}-${course.name}`}
                    onToggle={() =>
                      setExpandedCard(
                        expandedCard === `${key}-${course.name}` ? null : `${key}-${course.name}`,
                      )
                    }
                  />
                ))}
              </div>

              {/* Section bottom CTA */}
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border-2 border-dashed border-gray-200 bg-white px-6 py-5">
                <div>
                  <p className="font-bold text-gray-800">{tab.label} me admission chahiye?</p>
                  <p className="text-sm text-gray-500">Our expert counsellor aapko best college guide karenge — 100% free.</p>
                </div>
                <a
                  href={`https://wa.me/916203138576?text=नमस्ते!%20मुझे%20${encodeURIComponent(tab.label)}%20के%20लिए%20admission%20guidance%20चाहिए।%20Please%20help%20karein।`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-green-500 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-green-600"
                >
                  <MessageCircle size={16} /> WhatsApp Expert
                </a>
              </div>
            </div>
          </section>
        );
      })}

      {/* ── FINAL CTA ── */}
      <section className="bg-gradient-to-r from-emerald-700 to-teal-700 py-14 text-white text-center">
        <div className="container-shell">
          <h2 className="font-headline text-3xl font-extrabold mb-3">
            सही Course चुनने में मदद चाहिए?
          </h2>
          <p className="text-emerald-100 mb-7 max-w-xl mx-auto">
            Our expert counsellors help you pick the best course based on your marks, budget, and career goals — 100% free.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/916203138576?text=नमस्ते!%20मुझे%20सही%20course%20choose%20करने%20में%20guidance%20चाहिए।%20Please%20help%20karein।"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-7 py-4 font-extrabold text-gray-900 transition hover:bg-amber-300"
            >
              <MessageCircle size={18} /> WhatsApp Expert
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/40 bg-white/10 px-7 py-4 font-bold text-white transition hover:bg-white/20"
            >
              हमसे मिलें →
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
