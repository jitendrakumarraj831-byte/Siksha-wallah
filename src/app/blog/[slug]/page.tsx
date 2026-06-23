import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Phone } from "lucide-react";
import type { Metadata } from "next";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { getBlogArticle, blogArticles } from "@/lib/blog-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getBlogArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `https://www.sikshawallahfbg.in/blog/${article.slug}`,
    },
    alternates: { canonical: `https://www.sikshawallahfbg.in/blog/${article.slug}` },
  };
}

function renderMarkdown(md: string) {
  const lines = md.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;
  let inTable = false;
  let tableRows: string[][] = [];

  const flushTable = () => {
    if (tableRows.length < 2) return;
    const [header, , ...body] = tableRows;
    elements.push(
      <div key={key++} className="overflow-x-auto my-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-blue-50">
              {header.map((cell, i) => (
                <th key={i} className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-800">
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                {row.map((cell, ci) => (
                  <td key={ci} className="border border-gray-200 px-3 py-2 text-gray-700">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
    inTable = false;
  };

  const parseInline = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : p
    );
  };

  for (const line of lines) {
    if (line.startsWith("|")) {
      inTable = true;
      tableRows.push(
        line
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim())
      );
      continue;
    }
    if (inTable) flushTable();

    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="font-headline text-xl font-bold text-gray-800 mt-6 mb-2">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="font-headline text-2xl font-bold text-primary-blue mt-8 mb-3">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("#### ")) {
      elements.push(
        <h4 key={key++} className="font-semibold text-gray-800 mt-4 mb-1">
          {line.slice(5)}
        </h4>
      );
    } else if (line.startsWith("- ")) {
      elements.push(
        <li key={key++} className="ml-4 list-disc text-gray-700 leading-relaxed">
          {parseInline(line.slice(2))}
        </li>
      );
    } else if (/^\d+\.\s/.test(line)) {
      elements.push(
        <li key={key++} className="ml-4 list-decimal text-gray-700 leading-relaxed">
          {parseInline(line.replace(/^\d+\.\s/, ""))}
        </li>
      );
    } else if (line.trim() === "") {
      elements.push(<br key={key++} />);
    } else {
      elements.push(
        <p key={key++} className="text-gray-700 leading-relaxed">
          {parseInline(line)}
        </p>
      );
    }
  }
  if (inTable) flushTable();
  return elements;
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getBlogArticle(slug);
  if (!article) notFound();

  return (
    <>
      <SiteNavbar />
      <main className="bg-gray-50 min-h-screen">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#00102e] via-[#001850] to-[#003590] text-white py-14">
          {/* dot-grid */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          <div className="pointer-events-none absolute -top-20 right-0 h-64 w-64 rounded-full bg-amber-400 opacity-[0.10] blur-3xl" />
          <div className="container-shell max-w-3xl relative">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-blue-300 hover:text-white text-sm mb-6 transition"
            >
              <ArrowLeft size={14} /> सभी Articles पर वापस जाएँ
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold border border-amber-400/40 bg-amber-400/15 text-amber-300 px-3 py-1 rounded-full">
                {article.category}
              </span>
              <span className="flex items-center gap-1 text-blue-300 text-xs">
                <Clock size={11} /> {article.readTime} read
              </span>
            </div>
            <h1 className="font-headline text-3xl md:text-5xl font-black leading-tight mb-3 text-white">
              {article.titleHi ?? article.title}
            </h1>
            <p className="text-blue-200 text-sm leading-relaxed">{article.excerpt}</p>
          </div>
        </div>

        {/* Content */}
        <div className="container-shell max-w-3xl py-10">
          <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 prose-custom">
            {renderMarkdown(article.content)}
          </article>

          {/* Sidebar CTA */}
          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl text-gray-900 p-6 text-center">
            <h3 className="font-headline text-xl font-bold mb-2 text-amber-900">
              Have a question after reading this article?
            </h3>
            <p className="text-amber-700 text-sm mb-4">
              Our admission counsellors are happy to help — visit our Forbesganj office or simply give us a call.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <a
                href="tel:+916203138576"
                className="inline-flex items-center gap-2 bg-amber-400 text-gray-900 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-300 transition"
              >
                <Phone size={14} /> Call +91 6203138576
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border-2 border-amber-400 text-amber-800 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-100 transition"
              >
                Book Free Counselling →
              </Link>
            </div>
          </div>

          {/* Related */}
          <div className="mt-10">
            <h3 className="font-headline text-lg font-bold text-gray-800 mb-4">Continue Reading</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {blogArticles
                .filter((a) => a.slug !== slug)
                .slice(0, 2)
                .map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition group"
                  >
                    <span className="text-xs font-bold text-amber-600">{related.category}</span>
                    <p className="font-semibold text-gray-800 text-sm mt-1 group-hover:text-amber-600 transition leading-snug">
                      {related.titleHi ?? related.title}
                    </p>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
