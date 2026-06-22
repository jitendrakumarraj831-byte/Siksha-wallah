"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { GraduationCap, Phone, Menu, X, ChevronRight, MessageCircle } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/student-credit-card", label: "BSCC Loan" },
  { href: "/blog", label: "Career Guidance" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export function SiteNavbar({ transparent = false }: { transparent?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isTransparent = !scrolled && !menuOpen;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "border-gray-200 bg-white/96 shadow-md backdrop-blur-md"
            : isTransparent
              ? "border-white/10 bg-transparent"
              : "border-gray-100 bg-white/95 shadow-sm backdrop-blur"
        }`}
      >
        <div className="container-shell flex h-[72px] items-center justify-between gap-3">
          <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Siksha Wallah — Home">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary-blue text-white shadow-md shadow-blue-900/20">
              <GraduationCap size={20} aria-hidden="true" />
            </span>
            <div className="leading-none">
              <span
                className={`font-headline block text-lg font-extrabold tracking-tight transition-colors duration-300 ${
                  isTransparent ? "text-white" : "text-gray-900"
                }`}
              >
                SIKSHA<span className="text-primary-red">WALLAH</span>
              </span>
              <span className={`text-[11px] font-semibold ${isTransparent ? "text-blue-100" : "text-gray-500"}`}>
                Trusted Admission & BSCC Guidance
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  pathname === href
                    ? isTransparent
                      ? "bg-white/18 text-white"
                      : "bg-blue-50 text-primary-blue"
                    : isTransparent
                      ? "text-white/85 hover:bg-white/10 hover:text-white"
                      : "text-gray-700 hover:bg-gray-50 hover:text-primary-blue"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <a
              href="tel:+916203138576"
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-bold transition ${
                isTransparent
                  ? "border-white/30 text-white hover:border-white hover:bg-white/10"
                  : "border-gray-200 text-gray-700 hover:border-primary-blue hover:text-primary-blue"
              }`}
              aria-label="Call our counsellor at 6203138576"
            >
              <Phone size={13} aria-hidden="true" /> 6203138576
            </a>
            <a
              href="https://wa.me/916203138576?text=नमस्ते!%20मुझे%20admission%20guidance%20chahiye.%20Please%20guide%20karein."
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-bold transition ${
                isTransparent
                  ? "border-white/30 text-white hover:border-white hover:bg-white/10"
                  : "border-gray-200 text-gray-700 hover:border-green-500 hover:text-green-600"
              }`}
            >
              <MessageCircle size={13} aria-hidden="true" /> Chat on WhatsApp
            </a>
            <Link
              href="/auth/login"
              className={`rounded-lg border-2 px-3.5 py-2 text-sm font-bold transition ${
                isTransparent
                  ? "border-white/40 bg-white/10 text-white hover:bg-white/20 hover:border-white/60"
                  : "border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white"
              }`}
            >
              Student Login
            </Link>
            <Link
              href="/apply"
              className="rounded-lg bg-primary-red px-4 py-2 text-sm font-bold text-white shadow-sm shadow-red-200 transition hover:bg-red-700 hover:shadow-red-300"
            >
              Book Free Counselling
            </Link>
          </div>

          <button
            aria-label={menuOpen ? "Close menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition lg:hidden ${
              isTransparent
                ? "border-white/30 text-white hover:bg-white/10"
                : "border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>

        <div
          id="mobile-menu"
          className={`overflow-hidden border-t border-gray-100 bg-white transition-all duration-300 lg:hidden ${
            menuOpen ? "max-h-[720px] opacity-100" : "max-h-0 opacity-0"
          }`}
          aria-hidden={!menuOpen}
        >
          <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobile navigation">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  pathname === href ? "bg-blue-50 text-primary-blue" : "text-gray-800 hover:bg-gray-50"
                }`}
              >
                {label}
                <ChevronRight size={15} className="text-gray-400" aria-hidden="true" />
              </Link>
            ))}

            <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
              <a
                href="https://wa.me/916203138576?text=नमस्ते!%20मुझे%20admission%20guidance%20chahiye.%20Please%20guide%20karein."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-green-200 bg-green-50 py-2.5 text-sm font-bold text-green-700 transition hover:bg-green-100"
              >
                <MessageCircle size={14} aria-hidden="true" /> Chat with a Counsellor on WhatsApp
              </a>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/admin/login"
                  className="flex items-center justify-center rounded-xl border-2 border-gray-200 py-2.5 text-sm font-bold text-gray-700 transition hover:border-gray-400"
                >
                  Counsellor Portal
                </Link>
                <Link
                  href="/auth/login"
                  className="flex items-center justify-center rounded-xl border-2 border-primary-blue py-2.5 text-sm font-bold text-primary-blue transition hover:bg-primary-blue hover:text-white"
                >
                  Student Login
                </Link>
              </div>
              <Link
                href="/apply"
                className="flex items-center justify-center rounded-xl bg-primary-red py-3 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Book Free Counselling →
              </Link>
              <a
                href="tel:+916203138576"
                className="flex items-center justify-center gap-2 rounded-xl bg-gray-50 py-2.5 text-sm font-semibold text-gray-700"
              >
                <Phone size={14} aria-hidden="true" /> Speak to a Counsellor: 6203138576
              </a>
            </div>
          </nav>
        </div>
      </header>
      <div aria-hidden="true" className="h-[72px]" />
    </>
  );
}
