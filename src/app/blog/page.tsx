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
  const rest = filtered.slice(1);

  return (
    <>
      <SiteNavbar />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-[#00102e] via-[#001850] to-[#003590] py-16 text-white">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
          />
          <div className="pointer-events-none absolute -top-40 -right-32 h-[480px] w-[480px] rounded-full bg-amber-400 opacity-[0.10] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-500 opacity-[0.13] blur-3xl" />

          <div className="container-shell relative text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/[0.1] px-4 py-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
              <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber-300">Education Blog</span>
            </div>
            <h1 className="font-headline text-[2.5rem] font-black leading-[1.08] tracking-tight md:text-6xl lg:text-[4rem]">
              <span className="block text-white [text-shadow:0_2px_20px_rgba(255,255,255,0.15)]">Admission Tips &amp;</span>
              <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">Career Guidance Blog</span>
            </h1>
            <div className="mx-auto mt-3 h-[3px] w-28 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-transparent md:w-40" />
            <p className="mx-auto mt-6 max-w-xl leading-relaxed text-blue-100">
              B.Ed, Nursing, BSCC loan, Engineering और career guidance के बारे में <strong className="text-white">expert articles</strong> — Bihar students के लिए।
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
              {[
                { icon: FileText, value: `${blogArticles.length}+`, label: "Articles" },
                { icon: Users, value: "5000+", label: "Readers" },
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

        <div className="sticky top-[72px] z-30 border-b border-gray-200 bg-white shadow-sm">
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

        <section className="bg-gray-50 py-14">
          <div className="container-shell">
            {filtered.length === 0 ? (
              <div className="py-20 text-center text-gray-400">इस category में कोई article नहीं है।</div>
            ) : (
              <>
                {featured && (
                  <article className="mb-10 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                    <div className={`h-2 bg-gradient-to-r ${CATEGORY_STYLES[featured.category]?.bar ?? "from-blue-500 to-indigo-600"}`} />
                    <div className="grid gap-8 p-6 md:grid-cols-[1.15fr_0.85fr] md:p-8">
                      <div>
                        <div className="mb-4 flex flex-wrap items-center gap-3">
                          <span className={`rounded-full px-3 py-1 text-xs font-bold ${CATEGORY_STYLES[featured.category]?.badge ?? "bg-blue-100 text-blue-800"}`}>
                            {featured.category}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400">
                            <Clock size={12} /> {featured.readTime}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400">
                            <Sparkles size={12} /> Featured
                          </span>
                        </div>
                        <h2 className="font-headline text-3xl font-black text-gray-900 md:text-4xl">{featured.title}</h2>
                        <p className="mt-4 text-base leading-relaxed text-gray-600">{featured.excerpt}</p>
                        <div className="mt-6 flex flex-wrap gap-2">
                          {featured.tags.map((tag) => (
                            <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <Link
                          href={`/blog/${featured.slug}`}
                          className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-[#003f9f] px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-blue-700"
                        >
                          पूरा Article पढ़ें <ArrowRight size={16} />
                        </Link>
                      </div>

                      <div className="rounded-3xl bg-gradient-to-br from-[#eef4ff] via-white to-[#fff7e6] p-6">
                        <div className="flex h-full flex-col justify-between gap-6 rounded-2xl border border-white/70 bg-white/70 p-6 shadow-sm backdrop-blur">
                          <div>
                            <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#003f9f] text-white shadow-md">
                              <BookOpen size={24} />
                            </div>
                            <h3 className="font-headline text-xl font-extrabold text-gray-900">Why This Matters</h3>
                            <p className="mt-2 text-sm leading-relaxed text-gray-600">
                              Practical guidance curated for Bihar students who want faster decisions, safer admissions, and clearer next steps.
                            </p>
                          </div>
                          <a
                            href="https://wa.me/916203138576?text=नमस्ते!%20मुझे%20article%20ke%20basis%20par%20admission%20guidance%20chahiye."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-5 py-3 text-sm font-bold text-green-700 transition hover:bg-green-100"
                          >
                            <MessageCircle size={16} /> WhatsApp Guidance
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                )}

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {rest.map((article) => (
                    <article key={article.slug} className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                      <div className={`h-1.5 bg-gradient-to-r ${CATEGORY_STYLES[article.category]?.bar ?? "from-blue-500 to-indigo-600"}`} />
                      <div className="p-6">
                        <div className="mb-3 flex flex-wrap items-center gap-3">
                          <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${CATEGORY_STYLES[article.category]?.badge ?? "bg-blue-100 text-blue-800"}`}>
                            {article.category}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400">
                            <Clock size={12} /> {article.readTime}
                          </span>
                        </div>
                        <h3 className="font-headline text-xl font-extrabold leading-snug text-gray-900">{article.title}</h3>
                        <p className="mt-3 text-sm leading-relaxed text-gray-600">{article.excerpt}</p>
                        <div className="mt-5 flex flex-wrap gap-2">
                          {article.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-500">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <Link
                          href={`/blog/${article.slug}`}
                          className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#003f9f] transition hover:text-blue-700"
                        >
                          Read article <ArrowRight size={14} />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="container-shell">
            <div className="rounded-3xl bg-gradient-to-r from-[#001f6b] via-[#003f9f] to-[#0060c7] px-6 py-10 text-center text-white shadow-xl md:px-10">
              <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-blue-100">
                <Sparkles size={12} className="text-amber-300" /> Need Personal Help?
              </div>
              <h2 className="font-headline text-3xl font-black md:text-4xl">Confused about your next step?</h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-blue-100 md:text-base">
                Course choice, college selection, BSCC loan, ya direct admission process ke liye team se seedha baat kariye.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href="tel:+916203138576"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-extrabold text-[#003f9f] transition hover:bg-blue-50"
                >
                  Call Now
                </a>
                <a
                  href="https://wa.me/916203138576?text=नमस्ते!%20मुझे%20blog%20articles%20ke%20basis%20par%20course%20guidance%20chahiye."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-white/20"
                >
                  <MessageCircle size={16} /> WhatsApp Expert
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
