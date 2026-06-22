"use client";

import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";

export function PortalShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6f8fc] text-[#07152f]">
      <SiteNavbar />
      {children}
      <SiteFooter />
    </div>
  );
}
