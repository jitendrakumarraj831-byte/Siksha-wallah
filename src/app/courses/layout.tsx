import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Courses — B.Ed, Nursing, Engineering & More | Siksha Wallah",
  description:
    "Explore B.Ed, D.El.Ed, B.Sc Nursing, GNM, B.Pharma, B.Tech, BBA, MBA and more. Get admission guidance with Bihar Student Credit Card support.",
  keywords: [
    "B.Ed admission Bihar",
    "D.El.Ed admission",
    "BSc Nursing admission Bihar",
    "B.Tech admission Araria",
    "BBA MBA admission Bihar",
  ],
  openGraph: {
    title: "Courses | Siksha Wallah Forbesganj",
    description:
      "Teaching, Medical, Technical — explore all professional courses with BSCC financing options.",
    url: "https://www.sikshawallahfbg.in/courses",
  },
  alternates: { canonical: "https://www.sikshawallahfbg.in/courses" },
};

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
