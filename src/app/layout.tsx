import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Siksha Wallah | Admissions & Career Guidance",
  description:
    "Expert admission guidance for B.Ed, D.El.Ed, Nursing, Pharmacy, Management and professional courses in India and abroad.",
  keywords: [
    "Siksha Wallah",
    "college admission Forbesganj",
    "B.Ed admission",
    "D.El.Ed admission",
    "career counselling",
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
