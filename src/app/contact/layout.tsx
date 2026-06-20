import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Siksha Wallah Forbesganj",
  description:
    "Get in touch with Siksha Wallah for admission guidance. Visit us at College Chowk, Forbesganj, Araria, Bihar. Call: 6203138576 | WhatsApp available.",
  openGraph: {
    title: "Contact Siksha Wallah | Admission Guidance Forbesganj",
    description:
      "College Chowk, Forbesganj. Call 6203138576. Get expert admission counselling for B.Ed, Nursing, Engineering & more.",
    url: "https://sikshawallah.com/contact",
  },
  alternates: { canonical: "https://sikshawallah.com/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
