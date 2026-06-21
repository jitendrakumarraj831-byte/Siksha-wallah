import Link from "next/link";
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { blogArticles } from "@/lib/blog-data";

const CATEGORY_COLORS: Record<string, string> = {
  Teaching: "bg-amber-100 text-amber-800",
  Medical: "bg-amber-100 text-amber-800",
  Technical: "bg-amber-100 text-amber-800",
  Finance: "bg-amber-100 text-amber-800",
};

export default function BlogPage() {
  return (
    <>
      <SiteNavbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#00102e] via-[#001850] to-[#003590] text-white py-16">
          {/* Dot-grid */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          {/* Glow orbs */}
          <div className="pointer-events-none absolute -top-40 -right-32 h-[480px] w-[480px] rounded-full bg-amber-400 opacity-[0.10] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-500 opacity-[0.13] blur-3xl" />
          <div className="container-shell text-center relative">
            {/* Label pill */}
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
            <p className="mt-6 max-w-xl mx-auto text-blue-100 leading-relaxed">
              B.Ed, Nursing, BSCC loan, और career guidance के बारे में expert articles — Bihar students के लिए।
            </p>
          </div>
        </section>

        {/* Articles */}
        <section className="py-16 bg-gray-50">
          <div className="container-shell">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col"
                >
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          CATEGORY_COLORS[article.category] ?? "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {article.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock size={11} /> {article.readTime}
                      </span>
                    </div>
                    <h2 className="font-headline font-bold text-gray-900 text-lg leading-snug mb-2 group-hover:text-amber-600 transition-colors">
                      {article.titleHi ?? article.title}
                    </h2>
                    <p className="text-sm text-gray-500 leading-relaxed flex-1">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-1 mt-4 text-amber-600 text-sm font-semibold">
                      पढ़ें <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-white border-t border-gray-200">
          <div className="container-shell text-center">
            <h2 className="font-headline text-2xl font-bold text-gray-900 mb-2">
              Admission में मदद चाहिए?
            </h2>
            <p className="text-gray-500 mb-6">
              हमारे विशेषज्ञ काउंसलर से बात करें — बिल्कुल निःशुल्क।
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link
                href="/contact"
                className="rounded-xl bg-gray-900 px-6 py-3 font-bold text-white hover:bg-gray-800 transition shadow-md"
              >
                Contact Us →
              </Link>
              <a
                href="https://wa.me/916203138576"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border-2 border-green-500 px-6 py-3 font-bold text-green-600 hover:bg-green-50 transition"
              >
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
