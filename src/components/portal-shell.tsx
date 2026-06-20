"use client";

import Link from "next/link";
import { useState } from "react";
import { GraduationCap, Menu, Phone, X, LogOut, User } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";

const navLinks = [
  ["Courses", "/courses"],
  ["BSCC Scheme", "/bscc"],
  ["About Us", "/about"],
  ["Contact", "/contact"],
];

export function PortalShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, userProfile, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-[#07152f]">
      {/* Top announcement bar */}
      <div className="bg-[#003f9f] py-2 text-center text-xs font-bold text-white">
        Admissions Open 2026 · Free Counselling: +91 62031 38576 · College Chowk, Forbesganj
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur shadow-sm">
        <div className="container-shell flex h-[72px] items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#003f9f] text-white shadow-sm">
              <GraduationCap size={22} />
            </span>
            <span className="font-headline text-lg font-extrabold tracking-tight">
              SIKSHA<span className="text-[#dc143c]">WALLAH</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-7 text-sm font-semibold lg:flex">
            {navLinks.map(([label, href]) => (
              <Link key={href} href={href} className="transition hover:text-[#003f9f]">
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden items-center gap-2 lg:flex">
            <a href="tel:+916203138576" className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-[#003f9f]">
              <Phone size={14} /> 6203138576
            </a>
            {isAuthenticated ? (
              <>
                <Link
                  href={userProfile?.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                  className="flex items-center gap-1.5 rounded-xl border-2 border-[#003f9f] px-4 py-2 text-sm font-bold text-[#003f9f] hover:bg-[#003f9f] hover:text-white transition"
                >
                  <User size={14} /> {userProfile?.name?.split(" ")[0] || "Dashboard"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-200 transition"
                >
                  <LogOut size={14} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="rounded-xl border-2 border-[#003f9f] px-4 py-2 text-sm font-bold text-[#003f9f] hover:bg-[#003f9f] hover:text-white transition">
                  Student Login
                </Link>
                <Link href="/auth/register" className="rounded-xl bg-[#dc143c] px-4 py-2 text-sm font-bold text-white hover:bg-red-700 transition">
                  Apply Now →
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="rounded-lg p-2 lg:hidden"
            aria-label="Menu"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="border-t border-slate-200 bg-white px-6 py-5 lg:hidden">
            <div className="flex flex-col gap-4 text-sm font-semibold">
              {navLinks.map(([label, href]) => (
                <Link key={href} href={href} onClick={() => setOpen(false)} className="text-gray-700 hover:text-[#003f9f]">
                  {label}
                </Link>
              ))}
              <div className="mt-2 flex flex-col gap-2 border-t border-gray-100 pt-4">
                {isAuthenticated ? (
                  <>
                    <Link href={userProfile?.role === "admin" ? "/admin/dashboard" : "/dashboard"} className="rounded-xl border-2 border-[#003f9f] px-4 py-2.5 text-center font-bold text-[#003f9f]">
                      My Dashboard
                    </Link>
                    <button onClick={handleLogout} className="rounded-xl bg-gray-100 px-4 py-2.5 text-center font-bold text-gray-700">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setOpen(false)} className="rounded-xl border-2 border-[#003f9f] px-4 py-2.5 text-center font-bold text-[#003f9f]">
                      Student Login
                    </Link>
                    <Link href="/auth/register" onClick={() => setOpen(false)} className="rounded-xl bg-[#dc143c] px-4 py-2.5 text-center font-bold text-white">
                      Apply Now →
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Page Content */}
      {children}

      {/* Footer */}
      <footer className="bg-gray-950 py-12 text-gray-400">
        <div className="container-shell grid gap-8 md:grid-cols-4">
          <div>
            <p className="font-headline text-lg font-extrabold text-white">
              SIKSHA<span className="text-[#dc143c]">WALLAH</span>
            </p>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              Forbesganj's most trusted admission consultancy. 5,000+ students guided since 2015.
            </p>
          </div>

          <div>
            <p className="mb-3 font-bold text-white">Quick Links</p>
            <div className="flex flex-col gap-2 text-sm">
              {[["Courses", "/courses"], ["BSCC Scheme", "/bscc"], ["About Us", "/about"], ["Contact", "/contact"]].map(([label, href]) => (
                <Link key={href} href={href} className="hover:text-white transition">{label}</Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 font-bold text-white">Student Portal</p>
            <div className="flex flex-col gap-2 text-sm">
              {[["Login", "/auth/login"], ["Register", "/auth/register"], ["Dashboard", "/dashboard"], ["My Documents", "/dashboard/documents"]].map(([label, href]) => (
                <Link key={href} href={href} className="hover:text-white transition">{label}</Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 font-bold text-white">Contact</p>
            <div className="flex flex-col gap-2 text-sm">
              <p className="text-gray-500">College Chowk, Near HP Petrol Pump<br />Forbesganj, Araria, Bihar</p>
              {["6203138576", "7858062498", "9472813581"].map((num) => (
                <a key={num} href={`tel:+91${num}`} className="flex items-center gap-1.5 hover:text-white transition">
                  <Phone size={13} /> +91 {num}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="container-shell mt-8 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs md:flex-row md:justify-between">
          <p>© 2026 Siksha Wallah. All rights reserved.</p>
          <p>
            <Link href="/admin/login" className="hover:text-white transition">Office Login</Link>
            {" · "}
            <Link href="/auth/login" className="hover:text-white transition">Student Login</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
