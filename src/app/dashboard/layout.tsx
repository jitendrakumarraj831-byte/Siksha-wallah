import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Dashboard — Siksha Wallah Student Portal",
  description:
    "Your personal admission dashboard. Track applications, manage documents and chat with your counsellor.",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
