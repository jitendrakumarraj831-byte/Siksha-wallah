import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { FloatingContact } from "@/components/floating-contact";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const BASE_URL = "https://sikshawallah.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Siksha Wallah | Admission Consultancy Forbesganj, Bihar",
    template: "%s | Siksha Wallah",
  },
  description:
    "Forbesganj's most trusted admission consultancy since 2015. Expert guidance for B.Ed, D.El.Ed, Nursing, Pharmacy, Engineering & Management courses. 5,000+ students guided. Bihar Student Credit Card (BSCC) specialist.",
  keywords: [
    "Siksha Wallah Forbesganj",
    "college admission Bihar",
    "B.Ed admission Araria",
    "D.El.Ed admission Bihar",
    "Bihar Student Credit Card",
    "BSCC loan guide",
    "nursing admission Forbesganj",
    "career counselling Bihar",
    "admission consultancy Forbesganj",
    "B.Tech admission Bihar",
    "GNM ANM admission Bihar",
    "B.Pharma admission Bihar",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "Siksha Wallah",
    title: "Siksha Wallah | Admission Consultancy Forbesganj, Bihar",
    description:
      "Expert admission guidance for B.Ed, Nursing, Engineering & Management. 5,000+ students guided since 2015. Free BSCC loan guidance.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Siksha Wallah | Admission Consultancy Forbesganj",
    description: "Expert admission guidance. 5,000+ students guided since 2015. Free BSCC loan support.",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: BASE_URL },
  verification: {},
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Siksha Wallah",
  description: "Forbesganj's most trusted admission consultancy since 2015. Expert guidance for B.Ed, D.El.Ed, Nursing, Pharmacy, Engineering & Management courses.",
  url: BASE_URL,
  telephone: ["+916203138576", "+917858062498", "+919162653235"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "College Chowk, Near HP Petrol Pump",
    addressLocality: "Forbesganj",
    addressRegion: "Bihar",
    addressCountry: "IN",
    postalCode: "854318",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "26.3033",
    longitude: "87.2632",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "09:00",
    closes: "18:00",
  },
  sameAs: [],
  priceRange: "Free Consultation",
  currenciesAccepted: "INR",
  paymentAccepted: "Cash, UPI, Online",
  areaServed: ["Araria", "Forbesganj", "Bihar", "India"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700&family=Space+Grotesk:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body>
        <AuthProvider>
          {children}
          <FloatingContact />
        </AuthProvider>
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
