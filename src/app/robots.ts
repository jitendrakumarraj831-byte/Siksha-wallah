import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/dashboard/", "/api/", "/auth/"],
      },
    ],
    sitemap: "https://sikshawallah.com/sitemap.xml",
    host: "https://sikshawallah.com",
  };
}
