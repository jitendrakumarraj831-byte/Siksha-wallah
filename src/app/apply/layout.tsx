import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply for Admission — Siksha Wallah Forbesganj",
  description:
    "Apply for B.Ed, Nursing, MBBS, B.Tech, MBA & 50+ courses with Siksha Wallah. Free counselling, BSCC loan support. Submit your application in 4 simple steps.",
  openGraph: {
    title: "Apply for Admission | Siksha Wallah Forbesganj",
    description:
      "Submit your admission application online. Expert counsellors will guide you through course selection, college admission and BSCC loan process.",
    url: "https://www.sikshawallahfbg.in/apply",
  },
  alternates: { canonical: "https://www.sikshawallahfbg.in/apply" },
  robots: { index: false, follow: false },
};

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
