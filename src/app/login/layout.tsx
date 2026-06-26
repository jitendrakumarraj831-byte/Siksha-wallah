import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — Siksha Wallah",
  description:
    "Sign in to your Siksha Wallah account — student dashboard or counsellor portal.",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
