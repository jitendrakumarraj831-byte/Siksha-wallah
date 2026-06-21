import type { MetadataRoute } from "next";

const BASE_URL = "https://sikshawallah.com";

const BLOG_SLUGS = [
  "bed-admission-bihar-2025",
  "bihar-student-credit-card-guide",
  "bsc-nursing-gnm-comparison-bihar",
  "deled-vs-bed-difference",
  "btech-admission-bihar-2025",
];

const COURSE_IDS = [
  "bed", "deled", "med",
  "mbbs", "bds", "bsc-nursing", "gnm", "anm", "bpharma",
  "btech", "polytechnic", "iti", "bca", "mca", "bba", "mba",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = [
    { path: "/", priority: 1.0, freq: "weekly" },
    { path: "/courses", priority: 0.9, freq: "weekly" },
    { path: "/student-credit-card", priority: 0.9, freq: "monthly" },
    { path: "/about", priority: 0.8, freq: "monthly" },
    { path: "/contact", priority: 0.8, freq: "monthly" },
    { path: "/blog", priority: 0.8, freq: "weekly" },
    { path: "/apply", priority: 0.9, freq: "monthly" },
    { path: "/forum", priority: 0.6, freq: "weekly" },
  ].map(({ path, priority, freq }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: freq as MetadataRoute.Sitemap[0]["changeFrequency"],
    priority,
  }));

  const coursePages = COURSE_IDS.map((id) => ({
    url: `${BASE_URL}/courses/${id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const blogPages = BLOG_SLUGS.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...coursePages, ...blogPages];
}
