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
      url: `https://sikshawallah.com/blog/${article.slug}`,
    },
    alternates: { canonical: `https://sikshawallah.com/blog/${article.slug}` },
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
        <div className="bg-gradient-to-br from-primary-blue to-blue-800 text-white py-12">
          <div className="container-shell max-w-3xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm mb-6 transition"
            >
              <ArrowLeft size={14} /> Back to Blog
            </Link>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                {article.category}
              </span>
              <span className="flex items-center gap-1 text-blue-200 text-xs">
                <Clock size={11} /> {article.readTime} read
              </span>
            </div>
            <h1 className="font-headline text-3xl md:text-4xl font-extrabold leading-tight mb-2 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
              {article.titleHi ?? article.title}
            </h1>
            <p className="text-blue-100 text-sm">{article.excerpt}</p>
          </div>
        </div>

        {/* Content */}
        <div className="container-shell max-w-3xl py-10">
          <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 prose-custom">
            {renderMarkdown(article.content)}
          </article>

          {/* Sidebar CTA */}
          <div className="mt-8 bg-primary-blue rounded-2xl text-white p-6 text-center">
            <h3 className="font-headline text-xl font-bold mb-2">
              Admission Guidance चाहिए?
            </h3>
            <p className="text-blue-100 text-sm mb-4">
              Siksha Wallah के experts से मिलें — College Chowk, Forbesganj
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <a
                href="tel:+916203138576"
                className="inline-flex items-center gap-2 bg-white text-primary-blue px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition"
              >
                <Phone size={14} /> 6203138576
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border-2 border-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-white/10 transition"
              >
                Contact Us →
              </Link>
            </div>
          </div>

          {/* Related */}
          <div className="mt-10">
            <h3 className="font-headline text-lg font-bold text-gray-800 mb-4">और पढ़ें</h3>
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
                    <span className="text-xs font-bold text-primary-blue">{related.category}</span>
                    <p className="font-semibold text-gray-800 text-sm mt-1 group-hover:text-primary-blue transition leading-snug">
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
