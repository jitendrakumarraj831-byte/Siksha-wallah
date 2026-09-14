import type { MetadataRoute } from "next";
import { blogArticles } from "@/lib/blog-data";
import { ALL_COURSE_LINKS } from "@/lib/courses-data";

const BASE_URL = "https://www.sikshawallahfbg.in";

// Bump this whenever the static page copy or the course catalogue actually
// changes. It used to be `new Date()`, which told Google every URL on the site
// had been modified at the moment of each sitemap fetch. Google discounts a
// <lastmod> that always reports "just now", and the pages that depend on the
// sitemap alone for discovery are exactly the ones that sat in
// "Discovered – currently not indexed". A stable, honest date is trusted.
const CONTENT_REVISION = new Date("2026-09-14T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { path: "/", priority: 1.0, freq: "weekly" },
    { path: "/courses", priority: 0.9, freq: "weekly" },
    { path: "/about", priority: 0.8, freq: "monthly" },
    { path: "/contact", priority: 0.8, freq: "monthly" },
    { path: "/blog", priority: 0.8, freq: "weekly" },
    { path: "/apply", priority: 0.9, freq: "monthly" },
  ].map(({ path, priority, freq }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: CONTENT_REVISION,
    changeFrequency: freq as MetadataRoute.Sitemap[0]["changeFrequency"],
    priority,
  }));

  // Derived from the live data so the sitemap never drifts out of sync with the
  // actual course detail pages (generated from COURSE_ID_MAP).
  const coursePages = ALL_COURSE_LINKS.map(({ slug }) => ({
    url: `${BASE_URL}/courses/${slug}`,
    lastModified: CONTENT_REVISION,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Derived from the live blog data so every published article is listed and no
  // stale/renamed slug is referenced. Each article carries its own publish date,
  // so <lastmod> here reflects the real content date rather than build time.
  const blogPages = blogArticles.map((article) => ({
    url: `${BASE_URL}/blog/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Legal pages. Linked from the footer of every page, so they were being
  // crawled but were missing from the sitemap.
  const legalPages = ["privacy", "terms", "refund"].map((section) => ({
    url: `${BASE_URL}/portal/${section}`,
    lastModified: CONTENT_REVISION,
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));

  return [...staticPages, ...coursePages, ...blogPages, ...legalPages];
}
