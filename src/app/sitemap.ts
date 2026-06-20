import type { MetadataRoute } from "next";

const BASE_URL = "https://sikshawallah.com";

const BLOG_SLUGS = [
  "bed-admission-bihar-2025",
  "bihar-student-credit-card-guide",
  "bsc-nursing-gnm-comparison-bihar",
  "deled-vs-bed-difference",
  "btech-admission-bihar-2025",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["/", "/about", "/courses", "/student-credit-card", "/contact", "/blog"].map(
    (path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.8,
    })
  );

  const blogPages = BLOG_SLUGS.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages];
}
