"use client";

import Link from "next/link";
import { useState, useRef, useCallback } from "react";
import { saveInquiry } from "@/services/inquiry-service";
import { saveActivity } from "@/services/activity-service";
import {
  ArrowRight, BadgeCheck, BookOpen, Building2, Check,
  ChevronDown, ChevronLeft, ChevronRight, CreditCard, GraduationCap, MapPin,
  MessageCircle, Phone, ShieldCheck, Sparkles, Star, Users, X,
  Clock, Award, CheckCircle2,
  Briefcase, BookMarked, ChevronUp, FileText, ListChecks,
} from "lucide-react";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { CountUp } from "@/components/count-up";
import { AnimateIn } from "@/components/animate-in";
import { ReviewsCarousel } from "@/components/reviews-carousel";
import { streamTabs, colorMap, faqs, getCourseSlug, type StreamKey } from "@/lib/courses-data";
import { successStories } from "@/lib/reviews-data";

/* ─── Home page per-stream slider ────────────────────────────────── */
function HomeStreamSlider({ tab }: { tab: typeof streamTabs[0] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; scrollLeft: number } | null>(null);
  const c = colorMap[tab.color];
  const Icon = tab.icon;
  const CARD_W = 244 + 16;

  function scroll(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -CARD_W * 2 : CARD_W * 2, behavior: "smooth" });
  }
  function onScroll() {
    const el = scrollRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }
  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, scrollLeft: el.scrollLeft };
    el.setPointerCapture(e.pointerId);
  }, []);
  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current || !scrollRef.current) return;
    scrollRef.current.scrollLeft = dragStart.current.scrollLeft - (e.clientX - dragStart.current.x);
  }, []);
  const onPointerUp = useCallback(() => { setIsDragging(false); dragStart.current = null; }, []);

  return (
    <div className="mb-6">
      {/* ── Stream highlight header ── */}
      <div className={`bg-gradient-to-r ${c.gradient} mx-0`}>
        <div className="container-shell flex items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white shadow-inner">
              <Icon size={20} />
            </div>
            <div>
              <p className="font-headline text-lg font-extrabold text-white leading-none">{tab.label}</p>
              <p className="text-[11px] text-white/70 mt-0.5">{tab.courses.length} courses available</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/courses#${tab.key}`}
              className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-white/90 hover:text-white bg-white/15 hover:bg-white/25 border border-white/30 px-3 py-1.5 rounded-lg transition"
            >
              सभी देखें <ArrowRight size={11} />
            </Link>
            <button
              onClick={() => scroll("left")}
              disabled={atStart}
              aria-label="Scroll left"
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition ${
                atStart ? "border-white/20 text-white/30 cursor-not-allowed" : "border-white/50 text-white hover:bg-white/20"
              }`}
            >
              <ChevronLeft size={17} />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={atEnd}
              aria-label="Scroll right"
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition ${
                atEnd ? "border-white/20 text-white/30 cursor-not-allowed" : "border-white/50 text-white hover:bg-white/20"
              }`}
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Cards row ── */}
      <div className={`relative ${c.sectionBg} py-4`}>
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-10 bg-gradient-to-r from-white/60 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 bg-gradient-to-l from-white/60 to-transparent" />
        <div
          ref={scrollRef}
          onScroll={onScroll}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          className="flex gap-4 overflow-x-auto px-4 pb-2 select-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", cursor: isDragging ? "grabbing" : "grab" }}
        >
          {tab.courses.map((course) => {
            const slug = getCourseSlug(course.name);
            return (
              <div
                key={course.name}
                className="flex-shrink-0 w-[220px] rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className={`h-1.5 bg-gradient-to-r ${c.accentBar}`} />
                <div className="p-4 flex flex-col h-full">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black ${c.badge}`}>{course.name}</span>
                    {course.bscc && <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full">BSCC</span>}
                  </div>
                  <p className="text-xs font-extrabold text-gray-900 leading-snug mb-2 line-clamp-2">{course.full}</p>
                  <div className="flex gap-1.5 mb-2 flex-wrap">
                    <span className="flex items-center gap-1 text-[10px] text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-1.5 py-0.5"><Clock size={9} /> {course.duration}</span>
                    <span className="flex items-center gap-1 text-[10px] text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-1.5 py-0.5"><CreditCard size={9} /> {course.fee}</span>
                  </div>
                  <p className="text-[10px] font-bold text-green-700 mb-3">{course.salary}</p>
                  <div className="flex gap-1.5 mt-auto">
                    <Link href={`/apply?course=${encodeURIComponent(course.name)}`}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#dc143c] py-2 text-[11px] font-bold text-white hover:bg-red-700 transition">
                      <GraduationCap size={10} /> Apply
                    </Link>
                    {slug ? (
                      <Link href={`/courses/${slug}`}
                        className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-2 text-[11px] font-bold text-white transition bg-gradient-to-r ${c.gradient}`}>
                        Details
                      </Link>
                    ) : (
                      <a href={`https://wa.me/916203138576?text=नमस्ते!%20${encodeURIComponent(course.name)}%20के%20बारे%20में%20जानकारी%20चाहिए।`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-green-400 py-2 text-[11px] font-bold text-green-700 hover:bg-green-500 hover:text-white transition">
                        <MessageCircle size={10} /> Enquire
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Multi-step Form ─────────────────────────────── */
const STEPS = ["Name", "Mobile", "Course", "Qualify"];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [bsccEligible, setBsccEligible] = useState<null | boolean>(null);
  const [bsccIncome, setBsccIncome] = useState("");
  const [bsccBihar, setBsccBihar] = useState("");
  const [bsccAge, setBsccAge] = useState("");

  // Multi-step form
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ name: "", mobile: "", course: "", district: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);


  function handleBsccCheck(e: React.FormEvent) {
    e.preventDefault();
    const eligible =
      bsccBihar === "yes" &&
      bsccAge !== "" &&
      parseInt(bsccAge) <= 25 &&
      bsccIncome === "below";
    setBsccEligible(eligible);
    saveActivity({
      type: "course_view",
      title: "BSCC Eligibility Checked",
      description: eligible ? "Eligible — Bihar resident, age ≤25, income below 4.5L" : "Not eligible",
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
              { icon: Award,         text: "11+ Years of Trusted Counselling" },
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
                <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber-300">Session 2026–27 &nbsp;·&nbsp; Free Counselling Open</span>
              </div>

              {/* H1 — 3-tier Hindi headline */}
              <h1 className="font-headline font-black tracking-tight leading-[1.12]">
                <span className="block text-[1.9rem] text-white/75 md:text-[2.8rem] lg:text-[3.2rem] [text-shadow:0_2px_16px_rgba(255,255,255,0.08)]">
                  किस Course में है
                </span>
                <span className="block text-[3.2rem] md:text-[4.8rem] lg:text-[5.6rem] bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent [filter:drop-shadow(0_4px_28px_rgba(251,191,36,0.50))]">
                  आपका Future?
                </span>
                <span className="block text-[1.7rem] text-white md:text-[2.4rem] lg:text-[2.8rem] [text-shadow:0_2px_16px_rgba(255,255,255,0.12)]">
                  हम बताएंगे —{" "}
                  <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">मुफ़्त।</span>
                </span>
              </h1>

              {/* Accent line */}
              <div className="mt-4 h-[3px] w-28 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-transparent md:w-44" />

              {/* Course highlight pill */}
              <div className="mt-6 inline-flex flex-wrap items-center gap-2 rounded-2xl border border-amber-400/25 bg-amber-400/[0.08] px-5 py-3">
                <GraduationCap size={16} className="flex-shrink-0 text-amber-400" />
                <span className="text-sm font-semibold text-amber-100">
                  B.Ed • Nursing • MBBS • LLB • B.Tech • MBA
                </span>
                <span className="rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-2.5 py-0.5 text-[11px] font-extrabold text-gray-900">
                  50+ Courses
                </span>
              </div>

              {/* Sub-heading */}
              <p className="mt-5 max-w-lg text-[1rem] leading-[1.85] text-blue-100 md:text-[1.05rem]">
                Teaching, Medical, Law, Engineering, Para Medical —{" "}
                <strong className="font-extrabold text-white">50+ courses, 200+ verified colleges</strong>{" "}
                aur{" "}
                <strong className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent font-extrabold">
                  BSCC Loan support
                </strong>{" "}
                — सब एक जगह, बिल्कुल निःशुल्क।
              </p>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#inquiry"
                  className="group relative flex items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 px-8 py-4 font-extrabold text-gray-900 shadow-xl shadow-amber-500/30 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/50 active:scale-[0.97]"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                  <Sparkles size={17} className="flex-shrink-0" />
                  अभी Free Counselling लें
                  <ArrowRight size={16} className="flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
                <a
                  href="https://wa.me/916203138576"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 rounded-2xl border-2 border-white/25 bg-white/[0.08] px-8 py-4 font-bold text-white backdrop-blur transition-all duration-200 hover:bg-white/[0.15] hover:-translate-y-1 hover:border-white/40 active:scale-[0.97]"
                >
                  <MessageCircle size={17} />
                  WhatsApp पर बात करें
                </a>
              </div>

              {/* Trust line */}
              <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
                {[
                  "200+ Verified Colleges",
                  "5,000+ Successful Admissions",
                  "11+ Years of Experience",
                  "100% Transparent · No Hidden Fee",
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
              { target: 11,   suffix: "+", label: "Years of Trusted Counselling", icon: Award     },
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
              { icon: Phone,        text: "Personal Counsellor for Every Student", color: "text-red-400" },
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
      <section id="courses" className="py-12 bg-gray-50">
        <AnimateIn type="fade-up" className="text-center mb-10 container-shell">
          <p className="text-sm font-bold uppercase tracking-widest text-primary-blue mb-2">Session 2026–27 · Admissions Open</p>
          <h2 className="font-headline text-4xl md:text-5xl font-extrabold">
            अपने भविष्य की{" "}
            <span className="bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
              दिशा चुनें
            </span>
          </h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            5 streams · 50+ courses · 200+ partner colleges · 100% free counselling
          </p>
        </AnimateIn>

        {streamTabs.map((tab) => (
          <HomeStreamSlider key={tab.key} tab={tab} />
        ))}

        <div className="mt-6 text-center container-shell">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-xl bg-primary-blue px-8 py-4 font-extrabold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            Explore All Courses <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── BSCC SECTION ── */}
      <section id="bscc" className="relative overflow-hidden bg-gradient-to-br from-[#00102e] via-[#001850] to-[#003590] py-16 md:py-24 text-white">
        {/* Same dot-grid as hero */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="pointer-events-none absolute -top-32 -right-24 h-[400px] w-[400px] rounded-full bg-amber-400 opacity-[0.10] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-blue-500 opacity-[0.12] blur-3xl" />

        <div className="container-shell relative">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

            {/* ── LEFT: heading + benefits + CTA ── */}
            <div>
              {/* Badge */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/[0.10] px-4 py-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
                <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber-300">Bihar Government Scheme</span>
              </div>

              {/* Heading */}
              <h2 className="font-headline text-[2rem] font-black leading-[1.1] tracking-tight md:text-[2.6rem]">
                Bihar Student Credit Card{" "}
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
                  (BSCC) Loan Support
                </span>
              </h2>
              <div className="mt-3 h-[3px] w-20 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-transparent" />

              <p className="mt-5 text-blue-100 leading-relaxed">
                इस सरकारी योजना से अपनी <strong className="text-white">पढ़ाई, हॉस्टल और भोजन</strong> का खर्च संभालें। ₹4 लाख तक का loan — <strong className="text-amber-400">केवल 4% वार्षिक ब्याज</strong> पर। हम पूरी आवेदन प्रक्रिया में <strong className="text-white">निःशुल्क मार्गदर्शन</strong> देते हैं।
              </p>

              {/* Benefit chips */}
              <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: CreditCard,   title: "Up to ₹4 Lakh Loan",      desc: "Tuition, hostel, food और study material" },
                  { icon: BadgeCheck,   title: "Only 4% Interest",         desc: "Women के लिए सिर्फ 1% ब्याज" },
                  { icon: GraduationCap,title: "50+ Eligible Courses",     desc: "Teaching, Medical, Law, Engineering और more" },
                  { icon: ShieldCheck,  title: "No Collateral Needed",     desc: "कोई guarantor या property mortgage नहीं" },
                  { icon: Clock,        title: "Repay After Employment",   desc: "Course पूरा होने के बाद EMI शुरू होती है" },
                  { icon: CheckCircle2, title: "100% Free Assistance",     desc: "Document से DRCC approval तक — कोई fee नहीं" },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3 rounded-xl border border-white/[0.10] bg-white/[0.05] p-3.5 hover:bg-white/[0.09] transition">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-400/[0.15]">
                      <Icon size={15} className="text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{title}</p>
                      <p className="text-[11px] text-blue-300 mt-0.5 leading-snug">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/apply"
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3 font-extrabold text-gray-900 transition hover:bg-amber-300 shadow-lg shadow-amber-500/25 hover:-translate-y-0.5"
                >
                  Book Free Counselling <ArrowRight size={16} />
                </Link>
                <a
                  href="https://wa.me/916203138576?text=नमस्ते!%20मुझे%20BSCC%20Loan%20के%20बारे%20में%20जानकारी%20चाहिए।%20Please%20help%20karein।"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-white/25 bg-white/[0.07] px-6 py-3 font-bold text-white transition hover:bg-white/[0.14] hover:-translate-y-0.5"
                >
                  <MessageCircle size={16} /> Ask on WhatsApp
                </a>
              </div>
            </div>

            {/* ── RIGHT: Eligibility Checker ── */}
            <div className="rounded-2xl border border-white/20 bg-white/[0.07] p-7 backdrop-blur-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-amber-400">
                  <CheckCircle2 size={18} className="text-gray-900" />
                </div>
                <h3 className="font-headline text-xl font-extrabold">Quick BSCC Eligibility Check</h3>
              </div>

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
                      className="w-full rounded-xl border border-white/30 bg-[#001850] px-4 py-3 text-white outline-none"
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
      <section id="why-us" className="py-16 md:py-24 bg-white">
        <div className="container-shell">

          {/* Heading */}
          <AnimateIn type="fade-up" className="text-center mb-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-600">हम क्यों अलग हैं</span>
            </div>
            <h2 className="font-headline text-[2rem] font-black leading-tight tracking-tight text-gray-900 md:text-5xl">
              Admission नहीं —{" "}
              <span className="bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                एक सुरक्षित भविष्य
              </span>
            </h2>
            <p className="mt-3 max-w-xl mx-auto text-gray-500">
              हज़ारों Bihar के students ने Siksha Wallah पर भरोसा किया — क्योंकि हम सिर्फ college नहीं, सही दिशा देते हैं।
            </p>
          </AnimateIn>

          {/* ── Stats Strip ── */}
          <AnimateIn type="fade-up" delay={60}>
          <div className="mb-12 grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-blue-100 shadow-sm">
            {[
              { target: 5000, suffix: "+",      label: "Successful Admissions" },
              { target: 200,  suffix: "+",      label: "Partner Colleges" },
              { target: 2,    suffix: " Cr+",   label: "BSCC Loans Sanctioned" },
              { target: 11,   suffix: "+ Yrs",  label: "Forbesganj में अनुभव" },
            ].map(({ target, suffix, label }) => (
              <div key={label} className="flex flex-col items-center justify-center gap-1 bg-blue-50 py-6 px-4 text-center">
                <p className="font-headline text-3xl font-black text-blue-700 md:text-4xl">
                  <CountUp target={target} suffix={suffix} />
                </p>
                <p className="text-xs font-semibold text-gray-500 leading-snug">{label}</p>
              </div>
            ))}
          </div>
          </AnimateIn>

          {/* ── 6 USP Cards ── */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-14">
            {[
              {
                icon: ShieldCheck, border: "border-l-blue-500",   iconBg: "bg-blue-50",   iconColor: "text-blue-600",
                title: "निःशुल्क काउंसेलिंग",
                desc: "Call से लेकर admission confirm होने तक — कोई charge नहीं, कोई hidden fee नहीं। पहला कदम बिल्कुल मुफ़्त।",
              },
              {
                icon: Building2,   border: "border-l-green-500",  iconBg: "bg-green-50",  iconColor: "text-green-600",
                title: "200+ Verified Colleges",
                desc: "सिर्फ NCTE, INC, AICTE, BCI और PCI approved institutes — किसी unverified college में admission नहीं।",
              },
              {
                icon: CreditCard,  border: "border-l-amber-500",  iconBg: "bg-amber-50",  iconColor: "text-amber-600",
                title: "BSCC Loan Experts",
                desc: "₹2 Cr+ loans sanctioned — document preparation से DRCC approval तक हमारी team पूरी तरह साथ है।",
              },
              {
                icon: BadgeCheck,  border: "border-l-blue-500",   iconBg: "bg-blue-50",   iconColor: "text-blue-600",
                title: "पारदर्शी Fee Structure",
                desc: "पहले दिन से सब कुछ clear — कोई surprise नहीं, कोई बाद में अचानक fee नहीं। 100% transparent process।",
              },
              {
                icon: Users,       border: "border-l-red-500",    iconBg: "bg-red-50",    iconColor: "text-red-600",
                title: "Personal Counsellor",
                desc: "एक call — एक dedicated counsellor — admission confirm होने तक वही एक व्यक्ति आपके साथ रहेगा।",
              },
              {
                icon: Award,       border: "border-l-amber-500",  iconBg: "bg-amber-50",  iconColor: "text-amber-600",
                title: "9+ साल का अनुभव",
                desc: "Forbesganj में 11 साल से active — 5,000+ परिवारों का भरोसा, बिना किसी complaint के।",
              },
            ].map(({ icon: Icon, border, iconBg, iconColor, title, desc }, i) => (
              <AnimateIn key={title} type="zoom-in" delay={i * 60}>
              <div className={`group flex gap-4 rounded-2xl border-2 border-gray-100 border-l-4 ${border} bg-white p-5 shadow-sm transition hover:shadow-md hover:-translate-y-0.5`}>
                <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
                  <Icon size={20} className={iconColor} />
                </div>
                <div>
                  <h3 className="font-headline text-base font-extrabold text-gray-900">{title}</h3>
                  <p className="mt-1 text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
              </AnimateIn>
            ))}
          </div>

          {/* ── 4-Step Process ── */}
          <AnimateIn type="fade-up" delay={80}>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#00102e] via-[#001850] to-[#003590] p-8 md:p-12 text-white">
            {/* dot grid */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.06]"
              style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
            <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-amber-400 opacity-[0.08] blur-3xl" />

            <div className="relative mb-8 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-bold tracking-widest text-amber-300">
                ✦ Simple Process
              </span>
              <h3 className="mt-3 font-headline text-2xl font-extrabold md:text-3xl">
                Admission कैसे होता है —{" "}
                <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">4 Simple Steps</span>
              </h3>
            </div>

            <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { step: "01", icon: Phone,        title: "Call या WhatsApp करें",            desc: "पहली बातचीत बिल्कुल निःशुल्क। हम आपकी situation समझेंगे।",             color: "text-blue-300",  bg: "bg-blue-500/20" },
                { step: "02", icon: FileText,     title: "अपनी Profile Share करें",          desc: "Marks, बजट, stream और career goal बताएँ — हम सही options निकालेंगे।", color: "text-green-300", bg: "bg-green-500/20" },
                { step: "03", icon: Building2,    title: "Verified College Options पाएँ",    desc: "आपके लिए NCTE/INC/AICTE approved colleges की shortlist ready होगी।",   color: "text-amber-300", bg: "bg-amber-500/20" },
                { step: "04", icon: BadgeCheck,   title: "Admission Confirm करें",           desc: "Documents से DRCC तक — हर step पर हम साथ। Seat confirm होने तक।",    color: "text-red-300",   bg: "bg-red-500/20"  },
              ].map(({ step, icon: StepIcon, title, desc, color, bg }, i) => (
                <div key={step} className="relative">
                  {i < 3 && (
                    <div className="absolute hidden lg:flex items-center -right-2 top-7 z-10">
                      <ArrowRight size={16} className="text-white/20" />
                    </div>
                  )}
                  <div className="h-full rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="font-headline text-4xl font-black text-white/10 leading-none">{step}</span>
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 ${bg}`}>
                        <StepIcon size={17} className={color} />
                      </div>
                    </div>
                    <h4 className="font-headline font-extrabold text-white text-sm leading-snug mb-1.5">{title}</h4>
                    <p className="text-xs text-blue-200 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative mt-7 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-6 py-4">
              <p className="text-sm font-semibold text-blue-100">
                अभी शुरू करें — <strong className="text-white">पहली call बिल्कुल free है।</strong>
              </p>
              <a
                href="https://wa.me/916203138576?text=नमस्ते!%20मुझे%20admission%20guidance%20चाहिए।%20Please%20help%20karein।"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-extrabold text-gray-900 transition hover:bg-amber-300"
              >
                <MessageCircle size={15} /> WhatsApp पर बात करें
              </a>
            </div>
          </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── SUCCESS STORIES CAROUSEL ── */}
      <ReviewsCarousel 
        reviews={successStories}
        title="छात्रों के असली अनुभव"
        subtitle="5,000+ परिवारों ने हम पर भरोसा किया — यह उन्हीं की आवाज़ है।"
      />

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
                    { label: "Admission Process", color: "bg-blue-100 text-blue-700", range: "10–12" },
                    { label: "BSCC Loan Support", color: "bg-amber-100 text-amber-700", range: "13–15" },
                    { label: "Fees & Expenses", color: "bg-red-100 text-red-700", range: "16–17" },
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
      <section id="contact" className="relative overflow-hidden py-24 bg-gradient-to-br from-[#00102e] via-[#001850] to-[#003590] text-white">
        {/* dot-grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="pointer-events-none absolute -top-32 -right-24 h-[400px] w-[400px] rounded-full bg-amber-400 opacity-[0.10] blur-3xl" />
        <div className="container-shell relative">
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
                    <p className="mt-1 text-blue-200">College Chowk, Near HP Petrol Pump</p>
                    <p className="text-blue-200">Forbesganj, Araria — Bihar 854318</p>
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
                      <p className="text-xs text-blue-300">{label}</p>
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
