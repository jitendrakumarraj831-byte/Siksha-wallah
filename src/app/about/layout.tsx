import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Siksha Wallah Forbesganj",
  description:
    "Learn about Siksha Wallah — Forbesganj's most trusted admission consultancy since 2015. Meet our expert counsellors and our mission to guide Bihar students.",
  openGraph: {
    title: "About Siksha Wallah | Admission Consultancy Forbesganj",
    description:
      "5,000+ students guided since 2015. Meet the team behind Bihar's trusted education consultancy.",
    url: "https://sikshawallah.com/about",
  },
  alternates: { canonical: "https://sikshawallah.com/about" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
