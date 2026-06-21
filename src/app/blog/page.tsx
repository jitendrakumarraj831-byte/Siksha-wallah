import Link from "next/link";
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { blogArticles } from "@/lib/blog-data";

const CATEGORY_COLORS: Record<string, string> = {
  Teaching: "bg-blue-100 text-blue-800",
  Medical: "bg-green-100 text-green-800",
  Technical: "bg-purple-100 text-purple-800",
  Finance: "bg-amber-100 text-amber-800",
};

export default function BlogPage() {
  return (
    <>
      <SiteNavbar />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-blue to-blue-800 text-white py-16">
          <div className="container-shell text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold mb-4">
              <BookOpen size={14} /> Education Blog
            </div>
            <h1 className="font-headline text-4xl font-extrabold mb-3 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">Siksha Wallah Blog</h1>
            <p className="text-blue-100 max-w-xl mx-auto">
              Bihar admissions, BSCC loan guide, course comparisons — expert articles in Hindi &amp;
              English.
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
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
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
                    <h2 className="font-headline font-bold text-gray-900 text-lg leading-snug mb-2 group-hover:text-primary-blue transition-colors">
                      {article.titleHi ?? article.title}
                    </h2>
                    <p className="text-sm text-gray-500 leading-relaxed flex-1">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-1 mt-4 text-primary-blue text-sm font-semibold">
                      पढ़ें <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-white border-t border-gray-100">
          <div className="container-shell text-center">
            <h2 className="font-headline text-2xl font-bold text-gray-900 mb-2">
              Admission में मदद चाहिए?
            </h2>
            <p className="text-gray-500 mb-6">
              हमारे expert counsellors से बात करें — बिल्कुल मुफ्त।
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link
                href="/contact"
                className="rounded-xl bg-primary-blue px-6 py-3 font-bold text-white hover:bg-blue-800 transition shadow-md"
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
