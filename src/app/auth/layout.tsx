import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Portal — Siksha Wallah",
  description:
    "Sign in or create your free Siksha Wallah student account to track applications, upload documents and stay connected with your counsellor.",
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
