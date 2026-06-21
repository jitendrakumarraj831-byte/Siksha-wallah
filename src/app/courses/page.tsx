"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Award, BadgeCheck, BookMarked, Briefcase, Building2, CheckCircle2,
  ChevronDown, ChevronUp, Clock, CreditCard, FileText, MessageCircle,
  ShieldCheck, Sparkles, Star,
} from "lucide-react";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { streamTabs, colorMap, type StreamKey } from "@/lib/courses-data";

export default function CoursesPage() {
  const [activeStream, setActiveStream] = useState<StreamKey>("teaching");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const stream = streamTabs.find((s) => s.key === activeStream)!;
  const colors = colorMap[stream.color];

  return (
    <main className="overflow-hidden bg-white text-gray-900">
      <SiteNavbar />

      {/* ── PAGE HERO ── */}
      <section className="relative bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#047857] text-white py-16 md:py-24 overflow-hidden">
        {/* Hexagon/dot pattern overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        {/* Glow blobs */}
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
            Teaching, Medical &amp; Technical — तीनों streams में 40+ courses। हर course की पूरी जानकारी, fees, career scope, और Govt Jobs।
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/916203138576?text=नमस्ते!%20मुझे%20Siksha%20Wallah%20के%20courses%20के%20बारे%20में%20जानकारी%20चाहिए।%20Free%20counselling%20देंगे?"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-7 py-4 font-extrabold text-gray-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-300"
            >
              <MessageCircle size={18} /> Free Counselling लें
            </a>
            <Link
              href="/student-credit-card"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/40 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              <CreditCard size={18} /> BSCC Loan Guide →
            </Link>
          </div>
        </div>
      </section>

      {/* ── STREAM TABS + COURSES ── */}
      <section className="py-20 bg-gray-50">
        <div className="container-shell">
          <div className="text-center mb-10">
            <p className="text-sm font-bold uppercase tracking-widest text-primary-blue mb-2">
              सभी स्ट्रीम्स उपलब्ध हैं (Streams Available)
            </p>
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">अपना Stream चुनें</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              3 main streams — 40+ courses — सभी के लिए expert guidance available
            </p>
          </div>

          {/* Stream Tabs */}
          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {streamTabs.map(({ key, label, icon: Icon, color }) => {
              const c = colorMap[color];
              const isActive = activeStream === key;
              return (
                <button
                  key={key}
                  onClick={() => { setActiveStream(key); setExpandedCard(null); }}
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
                    <h3 className="font-headline text-lg font-extrabold text-blue-900">हमारे Partnered &amp; Approved Colleges</h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-bold text-white"><BadgeCheck size={11} /> NCTE Approved</span>
                  </div>
                  <p className="text-sm text-blue-800 leading-relaxed mb-3">
                    हम केवल <strong>NCTE (National Council for Teacher Education) Approved</strong> colleges के साथ partner हैं — Bihar, Purnea, Katihar, Patna, और West Bengal में।
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[
                      "NCTE Approved colleges in Patna, Purnea & Katihar (Bihar)",
                      "NCTE Recognized institutions in West Bengal",
                      "100% BSCC (Bihar Student Credit Card) facility available",
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
                    <h3 className="font-headline text-lg font-extrabold text-red-900">हमारे Partnered &amp; Approved Colleges</h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-bold text-white"><BadgeCheck size={11} /> INC &amp; PCI Approved</span>
                  </div>
                  <p className="text-sm text-red-800 leading-relaxed mb-3">
                    हम <strong>INC (Indian Nursing Council) &amp; PCI (Pharmacy Council of India) Approved</strong> premier institutes के साथ partner हैं — Bangalore, Madhya Pradesh, और West Bengal में।
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[
                      "INC Approved Nursing colleges in Bangalore & West Bengal",
                      "PCI Approved Pharmacy institutes in Madhya Pradesh",
                      "Premier private medical institutes with hostel facility",
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
                    <h3 className="font-headline text-lg font-extrabold text-orange-900">हमारे Partnered &amp; Approved Colleges</h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-600 px-2.5 py-0.5 text-xs font-bold text-white"><BadgeCheck size={11} /> AICTE &amp; UGC Recognized</span>
                  </div>
                  <p className="text-sm text-orange-800 leading-relaxed mb-3">
                    हम <strong>AICTE (All India Council for Technical Education) &amp; UGC Recognized</strong> top universities के साथ partner हैं — engineering, management, और computer courses के लिए।
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
                            <p className="text-xs text-green-700 font-semibold">Bihar Student Credit Card (BSCC) eligible — get up to ₹4 Lakh loan for this course at only 4% interest. Siksha Wallah guides for complete BSCC application.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Toggle + CTAs */}
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
                      {course.bscc && (
                        <Link
                          href="/student-credit-card"
                          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-green-500 py-2.5 text-sm font-bold text-green-700 transition hover:bg-green-500 hover:text-white"
                        >
                          <CreditCard size={15} /> Apply via BSCC Credit Card →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-14 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-700 p-8 text-white text-center">
            <h3 className="font-headline text-2xl font-extrabold mb-2">सही Course चुनने में मदद चाहिए?</h3>
            <p className="text-emerald-100 mb-6">Our expert counsellors help you pick the best course based on your marks, budget, and career goals — 100% free.</p>
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
