import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL("https://sikshawallah.com"),
  title: {
    default: "Siksha Wallah | Admission Consultancy Forbesganj, Bihar",
    template: "%s | Siksha Wallah",
  },
  description:
    "Forbesganj's most trusted admission consultancy since 2015. Expert guidance for B.Ed, D.El.Ed, Nursing, Pharmacy, Engineering & Management courses. 5,000+ students guided.",
  keywords: [
    "Siksha Wallah Forbesganj",
    "college admission Bihar",
    "B.Ed admission Araria",
    "D.El.Ed admission Bihar",
    "Bihar Student Credit Card",
    "nursing admission Forbesganj",
    "career counselling Bihar",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://sikshawallah.com",
    siteName: "Siksha Wallah",
    title: "Siksha Wallah | Admission Consultancy Forbesganj, Bihar",
    description:
      "Expert admission guidance for B.Ed, Nursing, Engineering & Management. 5,000+ students guided since 2015.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Siksha Wallah" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Siksha Wallah | Admission Consultancy Forbesganj",
    description: "Expert admission guidance. 5,000+ students guided since 2015.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://sikshawallah.com" },
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
      <body>
        <AuthProvider>{children}</AuthProvider>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
