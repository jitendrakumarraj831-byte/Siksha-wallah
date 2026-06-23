import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { FloatingContact } from "@/components/floating-contact";
import { Analytics } from "@vercel/analytics/next";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const BASE_URL = "https://www.sikshawallahfbg.in";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "600", "700"],
  preload: true,
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
  weight: ["400", "600", "700"],
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Siksha Wallah | Bihar's Most Trusted Admission Consultancy – Forbesganj",
    template: "%s | Siksha Wallah",
  },
  description:
    "Forbesganj's #1 admission consultancy. Free career counselling for B.Ed, Nursing, MBBS, B.Tech, MBA, LLB & 50+ courses. Complete Bihar Student Credit Card (BSCC) loan support. 5,000+ students guided since 2015. Call: +91 62031 38576",
  keywords: [
    "Siksha Wallah",
    "Siksha Wallah Forbesganj",
    "admission consultancy Bihar",
    "college admission Forbesganj",
    "B.Ed admission Bihar",
    "Nursing admission Bihar",
    "MBBS admission Bihar",
    "B.Tech admission Bihar",
    "MBA admission Bihar",
    "Bihar Student Credit Card",
    "BSCC loan support",
    "free admission counselling Forbesganj",
    "career counselling Bihar",
    "D.El.Ed admission Bihar",
    "GNM ANM admission Bihar",
    "B.Pharma admission Bihar",
    "education consultancy Araria",
    "college guidance Bihar",
  ],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "Siksha Wallah",
    title: "Siksha Wallah | Bihar's Most Trusted Admission Consultancy",
    description:
      "Free admission counselling for B.Ed, Nursing, MBBS, B.Tech, MBA & 50+ courses. Complete BSCC loan support. 5,000+ students guided. Forbesganj, Bihar.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Siksha Wallah – Bihar's Most Trusted Education Consultancy, Forbesganj",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Siksha Wallah | Bihar's Most Trusted Admission Consultancy",
    description:
      "Free admission counselling for B.Ed, Nursing, MBBS, B.Tech, MBA & 50+ courses. BSCC loan support. 5,000+ students guided since 2015.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      { rel: "icon", url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { rel: "icon", url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
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
    "Bihar's most trusted admission consultancy since 2015. Free career counselling for B.Ed, Nursing, MBBS, B.Tech, MBA, LLB & 50+ courses with complete BSCC loan support.",
  url: BASE_URL,
  logo: `${BASE_URL}/icon-512.png`,
  image: `${BASE_URL}/og-image.jpg`,
  telephone: ["+916203138576", "+917858062498"],
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
        <Analytics />
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
