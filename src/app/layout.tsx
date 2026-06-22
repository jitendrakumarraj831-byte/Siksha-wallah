import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { FloatingContact } from "@/components/floating-contact";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const BASE_URL = "https://sikshawallah.com";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Siksha Wallah | Trusted Education Consultancy in Forbesganj, Bihar",
    template: "%s | Siksha Wallah",
  },
  description:
    "Personalised admission guidance from Forbesganj's most trusted education consultancy. Choose the right course and college for B.Ed, D.El.Ed, Nursing, Pharmacy, Engineering, Management and more — with complete Bihar Student Credit Card (BSCC) loan support. 5,000+ students placed since 2015.",
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
    title: "Siksha Wallah | Trusted Education Consultancy in Forbesganj, Bihar",
    description:
      "Personalised admission counselling for B.Ed, Nursing, Engineering, Management and 40+ courses. Free BSCC loan assistance. Trusted by 5,000+ families since 2015.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Siksha Wallah | Trusted Education Consultancy in Forbesganj",
    description: "Personalised admission counselling and free BSCC loan support. Trusted by 5,000+ families since 2015.",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#003f9f",
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Siksha Wallah",
  description:
    "Forbesganj's most trusted education consultancy since 2015. Personalised admission guidance for B.Ed, D.El.Ed, Nursing, Pharmacy, Engineering & Management courses, with complete Bihar Student Credit Card (BSCC) loan support.",
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
    closes: "19:00",
  },
  sameAs: [],
  priceRange: "Free Consultation",
  currenciesAccepted: "INR",
  paymentAccepted: "Cash, UPI, Online",
  areaServed: ["Araria", "Forbesganj", "Bihar", "India"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} scroll-smooth`}>
      <head>
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
