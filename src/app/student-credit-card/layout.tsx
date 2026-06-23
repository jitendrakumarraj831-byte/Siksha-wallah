import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bihar Student Credit Card Guide — BSCC Loan | Siksha Wallah",
  description:
    "Complete guide to Bihar Student Credit Card (BSCC). Eligibility, documents, ₹4 lakh loan, 4% interest, step-by-step application process explained in Hindi.",
  keywords: [
    "Bihar Student Credit Card",
    "BSCC loan",
    "Bihar student loan",
    "student credit card eligibility Bihar",
    "BSCC documents required",
  ],
  openGraph: {
    title: "Bihar Student Credit Card (BSCC) Guide | Siksha Wallah",
    description:
      "₹4 lakh education loan at 4% interest. Full eligibility checker, documents list & application guide.",
    url: "https://www.sikshawallahfbg.in/student-credit-card",
  },
  alternates: { canonical: "https://www.sikshawallahfbg.in/student-credit-card" },
};

export default function BSCCLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
