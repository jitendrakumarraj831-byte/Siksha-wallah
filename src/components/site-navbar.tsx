"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { GraduationCap, Phone, Menu, X, ChevronRight } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/student-credit-card", label: "BSCC Guide" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-gray-200 bg-white/98 shadow-md backdrop-blur-md"
          : "border-gray-100 bg-white/95 backdrop-blur shadow-sm"
      }`}
    >
      <div className="container-shell flex h-[68px] items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Siksha Wallah — Home">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-blue text-white shadow-md">
            <GraduationCap size={20} aria-hidden="true" />
          </span>
          <span className="font-headline text-lg font-extrabold tracking-tight leading-none">
            SIKSHA<span className="text-primary-red">WALLAH</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                pathname === href
                  ? "bg-blue-50 text-primary-blue"
                  : "text-gray-700 hover:bg-gray-50 hover:text-primary-blue"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <a
            href="tel:+916203138576"
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-bold text-gray-700 transition hover:border-primary-blue hover:text-primary-blue"
            aria-label="Call us at 6203138576"
          >
            <Phone size={13} aria-hidden="true" /> 6203138576
          </a>
          <Link
            href="/admin/login"
            className="rounded-lg border-2 border-gray-200 px-3.5 py-2 text-sm font-bold text-gray-600 transition hover:border-gray-400 hover:text-gray-900"
          >
            Office Login
          </Link>
          <Link
            href="/auth/login"
            className="rounded-lg border-2 border-primary-blue px-3.5 py-2 text-sm font-bold text-primary-blue transition hover:bg-primary-blue hover:text-white"
          >
            Student Login
          </Link>
          <Link
            href="/apply"
            className="rounded-lg bg-primary-red px-4 py-2 text-sm font-bold text-white shadow-sm shadow-red-200 transition hover:bg-red-700 hover:shadow-red-300"
          >
            Apply Now
          </Link>
        </div>

        {/* Hamburger */}
        <button
          aria-label={menuOpen ? "Close menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-700 transition hover:bg-gray-50 lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`overflow-hidden border-t border-gray-100 bg-white transition-all duration-300 lg:hidden ${
          menuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobile navigation">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
                pathname === href
                  ? "bg-blue-50 text-primary-blue"
                  : "text-gray-800 hover:bg-gray-50"
              }`}
            >
              {label}
              <ChevronRight size={15} className="text-gray-400" aria-hidden="true" />
            </Link>
          ))}

          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">
            <Link
              href="/admin/login"
              className="flex items-center justify-center rounded-xl border-2 border-gray-200 py-2.5 text-sm font-bold text-gray-700 transition hover:border-gray-400"
            >
              Office Login
            </Link>
            <Link
              href="/auth/login"
              className="flex items-center justify-center rounded-xl border-2 border-primary-blue py-2.5 text-sm font-bold text-primary-blue transition hover:bg-primary-blue hover:text-white"
            >
              Student Login
            </Link>
            <Link
              href="/apply"
              className="col-span-2 flex items-center justify-center rounded-xl bg-primary-red py-3 text-sm font-bold text-white transition hover:bg-red-700"
            >
              Apply Now →
            </Link>
            <a
              href="tel:+916203138576"
              className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-gray-50 py-2.5 text-sm font-semibold text-gray-700"
            >
              <Phone size={14} aria-hidden="true" /> Call: 6203138576
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
