import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply for Admission Online — Forbesganj, Bihar",
  description:
    "Apply for B.Ed, Nursing, MBBS, B.Tech, MBA & 50+ courses with Siksha Wallah. Free counselling, BSCC loan support. Submit your application in 4 simple steps.",
  openGraph: {
    title: "Apply for Admission | Siksha Wallah Forbesganj",
    description:
      "Submit your admission application online. Expert counsellors will guide you through course selection, college admission and BSCC loan process.",
    url: "https://www.sikshawallahfbg.in/apply",
  },
  alternates: { canonical: "https://www.sikshawallahfbg.in/apply" },
  // /apply is a public landing page and is listed in sitemap.xml, so it must be
  // indexable. It previously carried `index: false, follow: false`, which both
  // contradicted the sitemap entry (Search Console reported it under
  // "Excluded by 'noindex' tag") and stopped Googlebot following the course
  // links on this page.
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
