import type { MetadataRoute } from "next";
import { blogArticles } from "@/lib/blog-data";
import { COURSE_ID_MAP } from "@/lib/courses-data";

const BASE_URL = "https://www.sikshawallahfbg.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = [
    { path: "/", priority: 1.0, freq: "weekly" },
    { path: "/courses", priority: 0.9, freq: "weekly" },
    { path: "/about", priority: 0.8, freq: "monthly" },
    { path: "/contact", priority: 0.8, freq: "monthly" },
    { path: "/blog", priority: 0.8, freq: "weekly" },
    { path: "/apply", priority: 0.9, freq: "monthly" },
  ].map(({ path, priority, freq }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: freq as MetadataRoute.Sitemap[0]["changeFrequency"],
    priority,
  }));

  // Derived from the live data so the sitemap never drifts out of sync with the
  // actual course detail pages (generated from COURSE_ID_MAP).
  const coursePages = Object.keys(COURSE_ID_MAP).map((id) => ({
    url: `${BASE_URL}/courses/${id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  // Derived from the live blog data so every published article is listed and no
  // stale/renamed slug is referenced.
  const blogPages = blogArticles.map((article) => ({
    url: `${BASE_URL}/blog/${article.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...coursePages, ...blogPages];
}
