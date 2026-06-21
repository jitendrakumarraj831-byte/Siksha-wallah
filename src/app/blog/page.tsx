"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BookOpen, Clock, ArrowRight, GraduationCap,
  Stethoscope, Cpu, Wallet, MessageCircle, Sparkles,
  TrendingUp, Users, FileText,
} from "lucide-react";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { blogArticles } from "@/lib/blog-data";

/* ── Category config ─────────────────────────────── */
const CATEGORIES = [
  { key: "all",       label: "सभी Articles",  icon: BookOpen,      color: "from-blue-500 to-indigo-600"   },
  { key: "Teaching",  label: "Teaching",       icon: GraduationCap, color: "from-blue-500 to-blue-700"     },
  { key: "Medical",   label: "Medical",        icon: Stethoscope,   color: "from-red-500 to-rose-600"      },
  { key: "Technical", label: "Technical",      icon: Cpu,           color: "from-violet-500 to-purple-700" },
  { key: "Finance",   label: "Finance",        icon: Wallet,        color: "from-amber-500 to-orange-600"  },
];

const CATEGORY_STYLES: Record<string, { badge: string; bar: string }> = {
  Teaching:  { badge: "bg-blue-100 text-blue-800",   bar: "from-blue-500 to-blue-700"     },
  Medical:   { badge: "bg-red-100 text-red-800",     bar: "from-red-500 to-rose-600"      },
  Technical: { badge: "bg-violet-100 text-violet-800", bar: "from-violet-500 to-purple-700" },
  Finance:   { badge: "bg-amber-100 text-amber-800", bar: "from-amber-500 to-orange-600"  },
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = activeCategory === "all"
    ? blogArticles
    : blogArticles.filter((a) => a.category === activeCategory);

  const featured = filtered[0];
  const rest     = filtered.slice(1);

  return (
    <>
      <SiteNavbar />
      <main>

        {/* ── HERO ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#00102e] via-[#001850] to-[#003590] py-16 text-white">
          <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          <div className="pointer-events-none absolute -top-40 -right-32 h-[480px] w-[480px] rounded-full bg-amber-400 opacity-[0.10] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-500 opacity-[0.13] blur-3xl" />

          <div className="container-shell relative text-center">
            {/* Label */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/[0.1] px-4 py-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
              <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber-300">Education Blog</span>
            </div>
            {/* H1 */}
            <h1 className="font-headline text-[2.5rem] font-black leading-[1.08] tracking-tight md:text-6xl lg:text-[4rem]">
              <span className="block text-white [text-shadow:0_2px_20px_rgba(255,255,255,0.15)]">Admission Tips &amp;</span>
              <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">Career Guidance Blog</span>
            </h1>
            <div className="mx-auto mt-3 h-[3px] w-28 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-transparent md:w-40" />
            <p className="mx-auto mt-6 max-w-xl leading-relaxed text-blue-100">
              B.Ed, Nursing, BSCC loan, Engineering और career guidance के बारे में{" "}
              <strong className="text-white">expert articles</strong> — Bihar students के लिए।
            </p>

            {/* Blog stats */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
              {[
                { icon: FileText, value: `${blogArticles.length}+`, label: "Articles" },
                { icon: Users,    value: "5000+",  label: "Readers" },
                { icon: TrendingUp, value: "Free", label: "Expert Advice" },
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

        {/* ── CATEGORY FILTER TABS ── */}
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
        <section className="bg-gray-50 py-14">
          <div className="container-shell">

            {filtered.length === 0 ? (
              <div className="py-20 text-center text-gray-400">इस category में कोई article नहीं है।</div>
            ) : (
              <>
                {/* ── FEATURED ARTICLE (first) ── */}
                {featured && (
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="group mb-10 flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl md:flex-row"
                  >
                    {/* Colored banner */}
                    <div className={`relative flex min-h-[180px] w-full flex-col justify-between bg-gradient-to-br p-7 text-white md:min-h-0 md:w-[42%] ${
                      CATEGORY_STYLES[featured.category]?.bar ?? "from-blue-500 to-blue-700"
                    }`}>
                      <div>
                        <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-widest">
                          ⭐ Featured Article
                        </span>
                        <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-white/80">
                          <Clock size={12} /> {featured.readTime}
                          <span className="ml-2 rounded-full bg-white/20 px-2.5 py-0.5">{featured.category}</span>
                        </div>
                      </div>
                      <div className="mt-6 hidden items-center gap-1.5 text-sm font-semibold text-white/90 md:flex">
                        <BookOpen size={14} /> Expert Guide
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col justify-between p-7">
                      <div>
                        <h2 className="font-headline text-xl font-extrabold leading-snug text-gray-900 group-hover:text-amber-600 transition-colors md:text-2xl">
                          {featured.titleHi ?? featured.title}
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-gray-500 md:text-base">
                          {featured.excerpt}
                        </p>
                      </div>
                      <div className="mt-6 flex items-center justify-between">
                        <span className="text-xs text-gray-400">{new Date(featured.date).toLocaleDateString("hi-IN", { year: "numeric", month: "long", day: "numeric" })}</span>
                        <span className="flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-gray-900 transition group-hover:bg-amber-300">
                          पूरा पढ़ें <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                )}

                {/* ── REST ARTICLES GRID ── */}
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
                          {/* Top color bar */}
                          <div className={`h-2 w-full bg-gradient-to-r ${style?.bar ?? "from-blue-500 to-blue-700"}`} />

                          <div className="flex flex-1 flex-col p-5">
                            {/* Meta row */}
                            <div className="mb-3 flex items-center gap-2">
                              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${style?.badge ?? "bg-gray-100 text-gray-700"}`}>
                                {article.category}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-gray-400">
                                <Clock size={11} /> {article.readTime}
                              </span>
                            </div>

                            {/* Title */}
                            <h2 className="font-headline text-base font-bold leading-snug text-gray-900 group-hover:text-amber-600 transition-colors flex-1">
                              {article.titleHi ?? article.title}
                            </h2>

                            {/* Excerpt */}
                            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-500">
                              {article.excerpt}
                            </p>

                            {/* Footer */}
                            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                              <span className="text-[11px] text-gray-400">
                                {new Date(article.date).toLocaleDateString("hi-IN", { month: "short", day: "numeric", year: "numeric" })}
                              </span>
                              <span className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                                पढ़ें <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
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

            {/* ── MID-PAGE WHATSAPP CTA BANNER ── */}
            <div className="mt-14 overflow-hidden rounded-3xl bg-gradient-to-br from-[#001f6b] via-[#003f9f] to-[#0060c7] p-8 text-white md:p-10">
              <div className="relative">
                <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-amber-400 opacity-20 blur-2xl" />
                <div className="relative flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-amber-400/20 ring-2 ring-amber-400/30">
                    <Sparkles size={30} className="text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-headline text-xl font-extrabold md:text-2xl">
                      Article पढ़ा? अब Expert से बात करें!
                    </h3>
                    <p className="mt-1.5 text-sm text-blue-200">
                      Admission guidance, college selection और BSCC loan — सब कुछ{" "}
                      <strong className="text-white">बिल्कुल निःशुल्क।</strong>
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <a
                      href="https://wa.me/916203138576"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 px-6 py-3.5 font-extrabold text-gray-900 shadow-lg shadow-amber-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.97]"
                    >
                      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                      <MessageCircle size={16} />
                      WhatsApp Expert
                    </a>
                    <Link
                      href="/contact"
                      className="flex items-center justify-center gap-2 rounded-2xl border-2 border-white/25 bg-white/[0.08] px-6 py-3.5 font-bold text-white backdrop-blur transition-all hover:bg-white/[0.15] active:scale-[0.97]"
                    >
                      Contact Us
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
              <span className="text-xs font-bold text-amber-700">Siksha Wallah — Free Counselling</span>
            </div>
            <h2 className="font-headline text-2xl font-extrabold text-gray-900 md:text-3xl">
              Admission में <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Expert Guidance</span> चाहिए?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-gray-500">
              हमारे काउंसलर से बात करें — B.Ed, Nursing, MBA, BCA, BSCC loan — सब के लिए।
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/#inquiry"
                className="group relative flex items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 px-7 py-4 font-extrabold text-gray-900 shadow-lg shadow-amber-500/30 transition-all hover:-translate-y-1 hover:shadow-xl active:scale-[0.97]"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                <Sparkles size={16} />
                Free Counselling लें
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="https://wa.me/916203138576"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-2xl border-2 border-gray-200 px-7 py-4 font-bold text-gray-700 transition-all hover:border-green-300 hover:bg-green-50 hover:text-green-700 active:scale-[0.97]"
              >
                <MessageCircle size={16} className="text-green-500" />
                WhatsApp करें
              </a>
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
