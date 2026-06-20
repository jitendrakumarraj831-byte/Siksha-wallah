"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GraduationCap, Phone, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/student-credit-card", label: "BSCC Guide" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export function SiteNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur shadow-sm">
      <div className="container-shell flex h-[72px] items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-blue text-white shadow-md">
            <GraduationCap size={22} />
          </span>
          <span className="font-headline text-xl font-extrabold tracking-tight">
            SIKSHA<span className="text-primary-red">WALLAH</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 text-sm font-semibold lg:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`transition hover:text-primary-blue ${
                pathname === href ? "text-primary-blue" : "text-gray-700"
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
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-bold text-gray-700 transition hover:border-primary-blue hover:text-primary-blue"
          >
            <Phone size={14} /> 6203138576
          </a>
          <Link
            href="/auth/login"
            className="rounded-lg border-2 border-primary-blue px-4 py-2 text-sm font-bold text-primary-blue transition hover:bg-primary-blue hover:text-white"
          >
            Student Login
          </Link>
          <Link
            href="/auth/register"
            className="rounded-lg bg-primary-red px-5 py-2 text-sm font-bold text-white transition hover:bg-red-700 shadow-md shadow-red-200"
          >
            Apply Now →
          </Link>
        </div>

        {/* Hamburger */}
        <button
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="rounded-lg p-2 lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-6 py-5 lg:hidden">
          <div className="flex flex-col gap-4 font-semibold text-sm">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={
                  pathname === href
                    ? "font-bold text-primary-blue"
                    : "text-gray-700"
                }
              >
                {label}
              </Link>
            ))}
            <Link
              href="/auth/login"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg border-2 border-primary-blue px-4 py-2.5 text-center font-bold text-primary-blue"
            >
              Student Login
            </Link>
            <Link
              href="/auth/register"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg bg-primary-red px-4 py-2.5 text-center font-bold text-white"
            >
              Apply Now →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
