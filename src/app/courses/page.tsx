"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  ChevronLeft, ChevronRight, Clock, CreditCard, CheckCircle2,
  MessageCircle, GraduationCap, ArrowRight, Phone,
} from "lucide-react";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { streamTabs, colorMap, getCourseSlug, type StreamKey, type Course } from "@/lib/courses-data";
import { saveActivity } from "@/services/activity-service";

/* ─── per-stream taglines ─────────────────────────────────────────── */
const STREAM_TAGLINES: Record<StreamKey, string> = {
  teaching:    "सरकारी Teacher बनें — Bihar STET / CTET के साथ guaranteed career",
  medical:     "Doctor · Nurse · Pharmacist — NEET से लेकर direct admission तक",
  paramedical: "Lab · Physio · OT · Radiology — बिना NEET के healthcare career",
  law:         "Advocate · Judge · Corporate Lawyer — BCI Approved colleges",
  technical:   "Engineer · Software Developer · MBA — AICTE / UGC Approved",
};

/* ─── Course Card (inside slider) ────────────────────────────────── */
function CourseCard({ course, streamKey }: { course: Course; streamKey: StreamKey }) {
  const tab = streamTabs.find(s => s.key === streamKey)!;
  const colors = colorMap[tab.color];
  const slug = getCourseSlug(course.name);

  return (
    <div className="flex-shrink-0 w-[272px] sm:w-[288px] flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Top accent */}
      <div className={`h-1.5 bg-gradient-to-r ${colors.accentBar}`} />

      <div className="flex flex-col flex-1 p-5">
        {/* Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black ${colors.badge}`}>
            {course.name}
          </span>
          {course.bscc && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
              <CreditCard size={8} /> BSCC
            </span>
          )}
        </div>

        {/* Full name */}
        <h3 className="font-headline text-sm font-extrabold text-gray-900 leading-snug mb-3">
          {course.full}
        </h3>

        {/* Duration + Fee */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="flex items-center gap-1 text-[11px] text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1">
            <Clock size={10} className="text-gray-400" /> {course.duration}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1">
            <CreditCard size={10} className="text-gray-400" /> {course.fee}
          </span>
        </div>

        {/* Eligibility */}
        <p className="text-[11px] text-gray-500 leading-relaxed mb-3 line-clamp-2">
          <span className="font-semibold text-gray-600">Eligibility: </span>
          {course.eligibility}
        </p>

        {/* Top 3 highlights */}
        <ul className="space-y-1 mb-4 flex-1">
          {course.highlights.slice(0, 3).map((h, i) => (
            <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-600">
              <CheckCircle2 size={11} className={`mt-0.5 flex-shrink-0 ${colors.checkColor}`} />
              {h}
            </li>
          ))}
        </ul>

        {/* Salary */}
        <div className="mb-4 rounded-lg bg-gray-50 border border-gray-100 px-3 py-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Expected Salary</p>
          <p className="text-xs font-extrabold text-green-700">{course.salary}</p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-1.5 mt-auto">
          <div className="flex gap-1.5">
            <Link
              href={`/apply?course=${encodeURIComponent(course.name)}`}
              className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-[#dc143c] py-2.5 text-xs font-bold text-white hover:bg-red-700 transition"
            >
              <GraduationCap size={12} /> Apply
            </Link>
            {slug ? (
              <Link
                href={`/courses/${slug}`}
                className={`flex flex-1 items-center justify-center gap-1 rounded-xl py-2.5 text-xs font-bold text-white transition bg-gradient-to-r ${colors.gradient}`}
              >
                Details <ArrowRight size={11} />
              </Link>
            ) : (
              <a
                href={`https://wa.me/916203138576?text=नमस्ते!%20मुझे%20${encodeURIComponent(course.name)}%20के%20बारे%20में%20जानकारी%20चाहिए।`}
                target="_blank" rel="noopener noreferrer"
                onClick={() => saveActivity({ type: 'whatsapp', title: `💬 WhatsApp — ${course.name}`, description: course.full, page: '/courses' })}
                className="flex flex-1 items-center justify-center gap-1 rounded-xl border-2 border-green-500 py-2.5 text-xs font-bold text-green-700 hover:bg-green-500 hover:text-white transition"
              >
                <MessageCircle size={11} /> Enquire
              </a>
            )}
          </div>
          <a
            href={`https://wa.me/916203138576?text=नमस्ते!%20मुझे%20${encodeURIComponent(course.name)}%20(${encodeURIComponent(course.full)})%20के%20बारे%20में%20fees%20aur%20admission%20की%20जानकारी%20चाहिए।`}
            target="_blank" rel="noopener noreferrer"
            onClick={() => saveActivity({ type: 'whatsapp', title: `💬 WhatsApp — ${course.name}`, description: course.full, page: '/courses' })}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-green-200 bg-green-50 py-2 text-[11px] font-bold text-green-700 hover:bg-green-500 hover:text-white transition"
          >
            <MessageCircle size={11} /> WhatsApp पर पूछें
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Stream Slider Section ───────────────────────────────────────── */
function StreamSlider({ tab }: { tab: typeof streamTabs[0] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const colors = colorMap[tab.color];
  const Icon = tab.icon;

  const CARD_WIDTH = 288 + 16; // card width + gap

  function scroll(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -CARD_WIDTH * 2 : CARD_WIDTH * 2, behavior: "smooth" });
  }

  function onScroll() {
    const el = scrollRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }

  return (
    <section className={`py-10 ${colors.sectionBg}`} id={tab.key}>
      <div className="container-shell">

        {/* Stream header */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${colors.gradient} text-white shadow-md`}>
              <Icon size={22} />
            </div>
            <div>
              <h2 className="font-headline text-xl font-extrabold text-gray-900">{tab.label}</h2>
              <p className="text-xs text-gray-500 max-w-xs">{STREAM_TAGLINES[tab.key as StreamKey]}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-extrabold text-white bg-gradient-to-r ${colors.gradient}`}>
              {tab.courses.length} Courses
            </span>
            {/* Scroll arrows */}
            <button
              onClick={() => scroll("left")}
              disabled={atStart}
              aria-label="Scroll left"
              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition ${
                atStart
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-gray-300 text-gray-700 hover:border-gray-500 hover:bg-white shadow-sm"
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={atEnd}
              aria-label="Scroll right"
              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition ${
                atEnd
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : `border-gray-300 text-gray-700 hover:text-white hover:bg-gradient-to-br ${colors.gradient} hover:border-transparent shadow-sm`
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div className="relative">
          {/* Left fade */}
          {!atStart && (
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-white/80 to-transparent" />
          )}
          {/* Right fade */}
          {!atEnd && (
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-white/80 to-transparent" />
          )}

          <div
            ref={scrollRef}
            onScroll={onScroll}
            className="flex gap-4 overflow-x-auto pb-3 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {tab.courses.map(course => (
              <CourseCard key={course.name} course={course} streamKey={tab.key as StreamKey} />
            ))}

            {/* End CTA card */}
            <div className={`flex-shrink-0 w-[220px] flex flex-col items-center justify-center gap-4 rounded-2xl bg-gradient-to-br ${colors.gradient} p-6 text-center text-white shadow-sm`}>
              <Icon size={32} className="opacity-80" />
              <div>
                <p className="font-extrabold text-sm leading-snug">और भी courses देखें?</p>
                <p className="text-[11px] text-white/75 mt-1">हमारे counsellor से बात करें</p>
              </div>
              <a
                href={`https://wa.me/916203138576?text=नमस्ते!%20मुझे%20${encodeURIComponent(tab.label)}%20के%20लिए%20admission%20guidance%20चाहिए।`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl bg-white/20 border border-white/40 px-4 py-2 text-xs font-bold hover:bg-white/30 transition"
              >
                <MessageCircle size={13} /> WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Scroll hint (mobile only) */}
        <p className="mt-2 text-center text-[11px] text-gray-400 sm:hidden">
          ← Swipe to explore all {tab.courses.length} courses →
        </p>
      </div>
    </section>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────── */
export default function CoursesPage() {
  const totalCourses = streamTabs.reduce((s, t) => s + t.courses.length, 0);

  return (
    <main className="bg-white text-gray-900">
      <SiteNavbar />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#00102e] via-[#001850] to-[#003590] text-white py-14 md:py-20">
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="pointer-events-none absolute -top-40 -right-32 h-[480px] w-[480px] rounded-full bg-amber-400 opacity-10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-500 opacity-[0.13] blur-3xl" />

        <div className="container-shell text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
            <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber-300">Session 2026–27 · Admissions Open</span>
          </div>

          <h1 className="font-headline font-black leading-[1.08] tracking-tight">
            <span className="block text-white text-3xl md:text-5xl">Choose Your Career Stream</span>
            <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent text-4xl md:text-6xl mt-1">
              {totalCourses}+ Verified Courses
            </span>
          </h1>
          <div className="mx-auto mt-3 h-[3px] w-28 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-transparent" />

          <p className="mt-5 text-blue-100 text-base max-w-xl mx-auto">
            Teaching, Medical, Para Medical, Law, और Technical — सभी streams एक जगह।
            हर course पर <span className="font-bold text-white">Free Counselling + BSCC Loan Guidance</span>।
          </p>

          {/* Stream jump links */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {streamTabs.map(({ key, label, shortLabel, icon: Icon, color, courses }) => {
              const c = colorMap[color];
              return (
                <a
                  key={key}
                  href={`#${key}`}
                  className={`inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/[0.08] px-4 py-2.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/[0.18] hover:-translate-y-0.5 active:translate-y-0`}
                >
                  <Icon size={15} />
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{shortLabel}</span>
                  <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-black">{courses.length}</span>
                </a>
              );
            })}
          </div>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-blue-200 font-semibold">
            {[
              `${totalCourses}+ Verified Courses`,
              "200+ Partner Colleges",
              "100% Free Counselling",
              "5,000+ Students Guided",
            ].map(s => (
              <span key={s} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5 STREAM SLIDERS ──────────────────────────────────── */}
      {streamTabs.map((tab, i) => (
        <StreamSlider key={tab.key} tab={tab} />
      ))}

      {/* ── FINAL CTA ──────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#00102e] via-[#001850] to-[#003590] py-14 text-white text-center">
        <div className="container-shell">
          <h2 className="font-headline text-2xl md:text-3xl font-extrabold mb-3">
            कौन सा course सही है — अभी जानें
          </h2>
          <p className="text-blue-100 mb-7 max-w-xl mx-auto text-sm">
            हमारे counsellors आपकी marks, budget और career goal के हिसाब से सही course और college suggest करेंगे — पूरी process 100% free।
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/916203138576?text=नमस्ते!%20मुझे%20सही%20course%20choose%20करने%20में%20guidance%20चाहिए।"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-7 py-4 font-extrabold text-gray-900 hover:bg-amber-300 transition"
            >
              <MessageCircle size={18} /> Free Counselling — WhatsApp
            </a>
            <a
              href="tel:+916203138576"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/40 bg-white/10 px-7 py-4 font-bold text-white hover:bg-white/20 transition"
            >
              <Phone size={18} /> Call +91 62031 38576
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/916203138576?text=नमस्ते!%20मुझे%20course%20admission%20के%20बारे%20में%20guidance%20चाहिए।"
        target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/40 hover:bg-green-600 hover:scale-110 transition"
        aria-label="WhatsApp"
      >
        <MessageCircle size={26} />
      </a>
    </main>
  );
}
