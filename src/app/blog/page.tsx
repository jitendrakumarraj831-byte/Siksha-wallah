"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BookOpen, Clock, ArrowRight, GraduationCap,
  Stethoscope, Cpu, Wallet, MessageCircle, Sparkles,
  TrendingUp, Users, FileText, Star, ChevronRight,
} from "lucide-react";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { blogArticles } from "@/lib/blog-data";
import { saveActivity } from "@/services/activity-service";

/* ── Category config ─────────────────────────────── */
const CATEGORIES = [
  { key: "all",       label: "All Articles",         icon: BookOpen,      color: "from-blue-500 to-indigo-600"  },
  { key: "Teaching",  label: "Teaching Careers",     icon: GraduationCap, color: "from-blue-500 to-blue-700"    },
  { key: "Medical",   label: "Medical & Nursing",    icon: Stethoscope,   color: "from-red-500 to-red-700"      },
  { key: "Technical", label: "Engineering & Tech",   icon: Cpu,           color: "from-violet-500 to-violet-700"},
  { key: "Finance",   label: "Loans & Scholarships", icon: Wallet,        color: "from-amber-500 to-orange-600" },
];

const CATEGORY_STYLES: Record<string, { badge: string; bar: string; glow: string }> = {
  Teaching:  { badge: "bg-blue-100 text-blue-800",    bar: "from-blue-500 to-blue-700",       glow: "shadow-blue-200"   },
  Medical:   { badge: "bg-red-100 text-red-800",      bar: "from-red-500 to-red-700",         glow: "shadow-red-200"    },
  Technical: { badge: "bg-violet-100 text-violet-800",bar: "from-violet-500 to-violet-700",   glow: "shadow-violet-200" },
  Finance:   { badge: "bg-amber-100 text-amber-800",  bar: "from-amber-500 to-orange-600",    glow: "shadow-amber-200"  },
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Teaching:  GraduationCap,
  Medical:   Stethoscope,
  Technical: Cpu,
  Finance:   Wallet,
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = activeCategory === "all"
    ? blogArticles
    : blogArticles.filter((a) => a.category === activeCategory);

  const allFeatured = filtered.filter((a) => a.featured);

  // Hero = first featured of Finance category (BSCC — universal), else first featured
  const hero = activeCategory === "all"
    ? (allFeatured.find((a) => a.category === "Finance") ?? allFeatured[0])
    : allFeatured[0];

  const secondary = allFeatured.filter((a) => a.slug !== hero?.slug);
  const featuredSlugs = new Set(allFeatured.map((a) => a.slug));
  const rest = filtered.filter((a) => !featuredSlugs.has(a.slug));

  return (
    <>
      <SiteNavbar />
      <main>

        {/* ── HERO BANNER ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#00102e] via-[#001850] to-[#003590] py-16 text-white">
          <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          <div className="pointer-events-none absolute -top-40 -right-32 h-[480px] w-[480px] rounded-full bg-amber-400 opacity-[0.10] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-500 opacity-[0.13] blur-3xl" />

          <div className="container-shell relative text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/[0.1] px-4 py-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
              <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber-300">Career Guidance Blog</span>
            </div>
            <h1 className="font-headline font-black tracking-tight leading-[1.1]">
              <span className="block text-[1.5rem] md:text-[2.2rem] lg:text-[2.6rem] text-white/80">Admission और Career की</span>
              <span className="block text-[2.8rem] md:text-[4.2rem] lg:text-[5rem] bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">सही जानकारी यहाँ है।</span>
              <span className="block text-[1.4rem] md:text-[1.9rem] lg:text-[2.2rem] text-white">Bihar के students के लिए — <span className="text-amber-300">मुफ़्त।</span></span>
            </h1>
            <div className="mx-auto mt-4 h-[3px] w-28 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-transparent md:w-40" />
            <p className="mx-auto mt-6 max-w-xl leading-relaxed text-blue-100">
              B.Ed, Nursing, BSCC loan, Engineering admissions और career planning पर expert articles — विशेष रूप से{" "}
              <strong className="text-white">Araria, Forbesganj और Bihar के हर ज़िले के students</strong> के लिए।
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
              {[
                { icon: FileText,    value: `${blogArticles.length}+`, label: "Helpful Articles" },
                { icon: Users,       value: "5,000+",                  label: "Students Helped"  },
                { icon: TrendingUp,  value: "Free",                    label: "Expert Advice"    },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-2 rounded-2xl border border-white/[0.12] bg-white/[0.06] px-5 py-2.5">
                  <Icon size={15} className="text-amber-400" />
                  <span className="font-bold text-white">{value}</span>
                  <span className="text-sm text-blue-300">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CATEGORY TABS ── */}
        <div className="sticky top-0 z-30 border-b border-gray-200 bg-white shadow-sm">
          <div className="container-shell">
            <div className="no-scrollbar flex gap-1 overflow-x-auto py-3">
              {CATEGORIES.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`flex flex-shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all duration-200 ${
                    activeCategory === key
                      ? "bg-gradient-to-r from-[#001f6b] to-[#003f9f] text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={14} />
                  {label}
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${
                    activeCategory === key ? "bg-amber-400 text-gray-900" : "bg-gray-200 text-gray-600"
                  }`}>
                    {key === "all" ? blogArticles.length : blogArticles.filter((a) => a.category === key).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── ARTICLES SECTION ── */}
        <section className="bg-gray-50 py-12">
          <div className="container-shell">

            {filtered.length === 0 ? (
              <div className="py-20 text-center text-gray-400">No articles are available in this category yet. Please check back soon.</div>
            ) : (
              <>
                {/* ══ HERO FEATURED ARTICLE ══ */}
                {hero && (
                  <div className="mb-5">
                    <div className="mb-4 flex items-center gap-2">
                      <Star size={15} className="fill-amber-400 text-amber-400" />
                      <span className="text-sm font-extrabold uppercase tracking-widest text-amber-600">Must Read</span>
                    </div>

                    <Link
                      href={`/blog/${hero.slug}`}
                      className={`group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${CATEGORY_STYLES[hero.category]?.glow ?? ""} md:flex-row`}
                    >
                      {/* Left: Big colorful panel */}
                      <div className={`relative flex min-h-[220px] w-full flex-col justify-between bg-gradient-to-br p-8 text-white md:min-h-[280px] md:w-[45%] ${
                        CATEGORY_STYLES[hero.category]?.bar ?? "from-blue-500 to-blue-700"
                      }`}>
                        {/* Category icon watermark */}
                        {(() => { const Icon = CATEGORY_ICONS[hero.category]; return Icon ? <Icon size={120} className="pointer-events-none absolute -bottom-6 -right-6 opacity-[0.08]" /> : null; })()}

                        <div className="relative">
                          <div className="mb-4 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1 text-xs font-extrabold text-gray-900">
                              <Star size={10} className="fill-gray-900" /> MUST READ
                            </span>
                            <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold">
                              {hero.category}
                            </span>
                          </div>
                          <h2 className="font-headline text-2xl font-extrabold leading-tight text-white md:text-3xl">
                            {hero.titleHi ?? hero.title}
                          </h2>
                          <p className="mt-3 text-sm leading-relaxed text-white/80 md:text-base line-clamp-3">
                            {hero.excerpt}
                          </p>
                        </div>

                        <div className="relative mt-6 flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-sm text-white/80">
                            <Clock size={13} /> {hero.readTime}
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-white/80">
                            <BookOpen size={13} /> Counsellor-Reviewed
                          </div>
                        </div>
                      </div>

                      {/* Right: Detail panel */}
                      <div className="flex flex-1 flex-col justify-between p-8">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                            {new Date(hero.date).toLocaleDateString("hi-IN", { year: "numeric", month: "long", day: "numeric" })}
                          </p>
                          <h3 className="font-headline text-xl font-extrabold leading-snug text-gray-900 group-hover:text-amber-600 transition-colors md:text-2xl">
                            {hero.title}
                          </h3>
                          <p className="mt-4 text-sm leading-relaxed text-gray-500 md:text-base">
                            {hero.excerpt}
                          </p>

                          {/* Key points teaser */}
                          <div className="mt-6 space-y-2">
                            {["पात्रता और योग्यता की पूरी जानकारी", "Step-by-step आवेदन प्रक्रिया", "Counsellor से free guidance"].map((point) => (
                              <div key={point} className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">✓</span>
                                {point}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-8">
                          <span className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 px-6 py-3 text-sm font-extrabold text-gray-900 shadow-md shadow-amber-200 transition group-hover:shadow-lg group-hover:from-amber-300 group-hover:to-orange-300">
                            पूरा आर्टिकल पढ़ें <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}

                {/* ══ SECONDARY FEATURED ARTICLES ══ */}
                {secondary.length > 0 && (
                  <div className="mb-10">
                    <div className="mb-4 mt-8 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles size={15} className="text-blue-500" />
                        <span className="text-sm font-extrabold uppercase tracking-widest text-blue-600">Featured Guides</span>
                      </div>
                    </div>
                    <div className={`grid gap-4 ${secondary.length === 1 ? "" : secondary.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
                      {secondary.map((article) => {
                        const style = CATEGORY_STYLES[article.category];
                        const CatIcon = CATEGORY_ICONS[article.category];
                        return (
                          <Link
                            key={article.slug}
                            href={`/blog/${article.slug}`}
                            className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${style?.glow ?? ""}`}
                          >
                            {/* Colorful top section */}
                            <div className={`relative overflow-hidden bg-gradient-to-br p-6 text-white ${style?.bar ?? "from-blue-500 to-blue-700"}`}>
                              {CatIcon && <CatIcon size={64} className="pointer-events-none absolute -right-3 -bottom-3 opacity-[0.12]" />}
                              <div className="relative">
                                <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${style?.badge ?? "bg-gray-100 text-gray-700"}`}>
                                  {article.category}
                                </span>
                                <p className="mt-3 font-headline text-base font-extrabold leading-snug text-white md:text-lg">
                                  {article.titleHi ?? article.title}
                                </p>
                              </div>
                            </div>

                            {/* Bottom section */}
                            <div className="flex flex-1 flex-col justify-between p-5">
                              <p className="text-sm leading-relaxed text-gray-500 line-clamp-2">
                                {article.excerpt}
                              </p>
                              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                  <Clock size={11} /> {article.readTime}
                                </div>
                                <span className="flex items-center gap-1 text-sm font-bold text-amber-600 group-hover:gap-2 transition-all">
                                  पढ़ें <ChevronRight size={14} />
                                </span>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ══ DIVIDER ══ */}
                {rest.length > 0 && (
                  <div className="mb-6 flex items-center gap-4">
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-gray-400">
                      सभी Articles
                    </span>
                    <div className="h-px flex-1 bg-gray-200" />
                  </div>
                )}

                {/* ══ ALL ARTICLES GRID ══ */}
                {rest.length > 0 && (
                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {rest.map((article) => {
                      const style = CATEGORY_STYLES[article.category];
                      return (
                        <Link
                          key={article.slug}
                          href={`/blog/${article.slug}`}
                          className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                          <div className={`h-1.5 w-full bg-gradient-to-r ${style?.bar ?? "from-blue-500 to-blue-700"}`} />
                          <div className="flex flex-1 flex-col p-5">
                            <div className="mb-3 flex items-center gap-2">
                              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${style?.badge ?? "bg-gray-100 text-gray-700"}`}>
                                {article.category}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-gray-400">
                                <Clock size={11} /> {article.readTime}
                              </span>
                            </div>
                            <h2 className="font-headline text-base font-bold leading-snug text-gray-900 group-hover:text-amber-600 transition-colors flex-1">
                              {article.titleHi ?? article.title}
                            </h2>
                            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-500">
                              {article.excerpt}
                            </p>
                            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                              <span className="text-[11px] text-gray-400">
                                {new Date(article.date).toLocaleDateString("hi-IN", { month: "short", day: "numeric", year: "numeric" })}
                              </span>
                              <span className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                                Read Article <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* ── CTA BANNER ── */}
            <div className="mt-14 overflow-hidden rounded-3xl bg-gradient-to-br from-[#001f6b] via-[#003f9f] to-[#0060c7] p-8 text-white md:p-10">
              <div className="relative">
                <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-amber-400 opacity-20 blur-2xl" />
                <div className="relative flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-amber-400/20 ring-2 ring-amber-400/30">
                    <Sparkles size={30} className="text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-headline text-xl font-extrabold md:text-2xl">
                      पढ़ने के बाद कोई सवाल है? Counsellor से बात करें।
                    </h3>
                    <p className="mt-1.5 text-sm text-blue-200">
                      Admission guidance, college selection और BSCC loan assistance —{" "}
                      <strong className="text-white">पूरी प्रक्रिया बिल्कुल निःशुल्क।</strong>
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <a
                      href="https://wa.me/916203138576"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => saveActivity({ type: 'whatsapp', title: '💬 WhatsApp Click — Blog Article', description: 'In-article counselling WhatsApp CTA', page: '/blog' })}
                      className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 px-6 py-3.5 font-extrabold text-gray-900 shadow-lg shadow-amber-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.97]"
                    >
                      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                      <MessageCircle size={16} />
                      Counsellor से बात करें
                    </a>
                    <Link
                      href="/contact"
                      className="flex items-center justify-center gap-2 rounded-2xl border-2 border-white/25 bg-white/[0.08] px-6 py-3.5 font-bold text-white backdrop-blur transition-all hover:bg-white/[0.15] active:scale-[0.97]"
                    >
                      Office Visit करें
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="border-t border-gray-200 bg-white py-14">
          <div className="container-shell text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-50 px-4 py-1.5">
              <GraduationCap size={14} className="text-amber-600" />
              <span className="text-xs font-bold text-amber-700">Siksha Wallah — 100% Free Counselling</span>
            </div>
            <h2 className="font-headline text-2xl font-extrabold text-gray-900 md:text-3xl">
              Admission के लिए <span className="text-[#003f9f]">personal guidance</span> चाहिए?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-gray-500">
              हमारे अनुभवी काउंसलर से बात करें — B.Ed, Nursing, MBA, BCA, BSCC loan, हर सवाल का सही जवाब।
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/#inquiry"
                className="group relative flex items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 px-7 py-4 font-extrabold text-gray-900 shadow-lg shadow-amber-500/30 transition-all hover:-translate-y-1 hover:shadow-xl active:scale-[0.97]"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                <Sparkles size={16} />
                Free Counselling Book करें
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="https://wa.me/916203138576"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => saveActivity({ type: 'whatsapp', title: '💬 WhatsApp Click — Blog CTA', description: 'Bottom CTA WhatsApp button on Blog page', page: '/blog' })}
                className="flex items-center gap-2 rounded-2xl border-2 border-gray-200 px-7 py-4 font-bold text-gray-700 transition-all hover:border-green-300 hover:bg-green-50 hover:text-green-700 active:scale-[0.97]"
              >
                <MessageCircle size={16} className="text-green-500" />
                WhatsApp पर Chat करें
              </a>
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
