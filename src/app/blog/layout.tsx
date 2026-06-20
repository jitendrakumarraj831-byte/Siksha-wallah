import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Education Tips & Bihar Admission Guides | Siksha Wallah",
  description:
    "Expert articles on B.Ed, Nursing, Engineering admissions in Bihar. BSCC loan guide, D.El.Ed vs B.Ed, top colleges and more — in Hindi & English.",
  openGraph: {
    title: "Blog | Siksha Wallah",
    description: "Bihar education guides, admission tips, BSCC loan info — in Hindi & English.",
    url: "https://sikshawallah.com/blog",
  },
  alternates: { canonical: "https://sikshawallah.com/blog" },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
