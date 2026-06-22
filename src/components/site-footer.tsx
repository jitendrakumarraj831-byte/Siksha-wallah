import Link from "next/link";
import { GraduationCap, Phone, MessageCircle, MapPin, Mail, Clock } from "lucide-react";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Explore Courses" },
  { href: "/student-credit-card", label: "BSCC Loan Assistance" },
  { href: "/blog", label: "Career Guidance Blog" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Our Team" },
  { href: "/auth/login", label: "Student Login" },
  { href: "/apply", label: "Book Free Counselling" },
];

const COURSES = [
  "B.Ed / D.El.Ed",
  "M.Ed",
  "B.Sc Nursing / GNM / ANM",
  "B.Pharma / D.Pharma",
  "MBBS / BDS",
  "BBA / MBA",
  "B.Tech / Polytechnic",
  "BCA / MCA / ITI",
];

const PHONES = [
  { num: "6203138576", label: "Rajesh Kr. Sah — Senior Admission Counsellor" },
  { num: "7858062498", label: "Md. Naseem Ansari — Nursing & BSCC Counsellor" },
  { num: "9162653235", label: "Gautam Kumar — Technical & Management Counsellor" },
];

export function SiteFooter() {
  return (
    <footer className="bg-gray-950 text-gray-400" aria-label="Site footer">
      {/* Top CTA Banner */}
      <div className="bg-gradient-to-r from-primary-blue to-blue-700 py-8">
        <div className="container-shell flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="font-headline text-xl font-extrabold text-white">Free Career Counselling — Speak to an Admission Expert Today</p>
            <p className="mt-1 text-sm text-blue-200">No consultation fees. No obligation. Honest, personalised guidance for every student.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 sm:justify-end">
            <a
              href="tel:+916203138576"
              className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-primary-blue transition hover:bg-blue-50"
            >
              <Phone size={15} aria-hidden="true" /> Speak to a Counsellor
            </a>
            <a
              href="https://wa.me/916203138576?text=नमस्ते!%20मुझे%20Free%20Admission%20Counselling%20चाहिए।%20Please%20guide%20karein।"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border-2 border-white/40 bg-white/10 px-5 py-2.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              <MessageCircle size={15} aria-hidden="true" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-shell py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" aria-label="Siksha Wallah — Home">
              <div className="mb-4 flex items-center gap-2.5 text-white">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-blue shadow">
                  <GraduationCap size={20} aria-hidden="true" />
                </span>
                <span className="font-headline text-lg font-extrabold">
                  SIKSHA<span className="text-primary-red">WALLAH</span>
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-5">
              Forbesganj&apos;s most trusted education consultancy since 2015. Over 5,000 students personally guided into the right course, the right college and a secure career — across Bihar and beyond.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0 text-amber-400" aria-hidden="true" />
                <span>College Chowk, Near HP Petrol Pump, Forbesganj, Araria — Bihar 854318</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="shrink-0 text-amber-400" aria-hidden="true" />
                <span>Mon–Sat: 9:00 AM – 6:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="shrink-0 text-amber-400" aria-hidden="true" />
                <span>sikshawallah.info@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-headline font-bold text-white">Helpful Links</h3>
            <ul className="space-y-2 text-sm" role="list">
              {QUICK_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="transition hover:text-white hover:pl-1 duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h3 className="mb-4 font-headline font-bold text-white">Courses We Guide For</h3>
            <ul className="space-y-2 text-sm" role="list">
              {COURSES.map((c) => (
                <li key={c}>
                  <Link href="/courses" className="transition hover:text-white hover:pl-1 duration-200">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-headline font-bold text-white">Talk to Our Counsellors</h3>
            <ul className="space-y-3 text-sm" role="list">
              {PHONES.map(({ num, label }) => (
                <li key={num}>
                  <a
                    href={`tel:+91${num}`}
                    className="group flex items-start gap-2 transition hover:text-white"
                    aria-label={`Call ${label} at ${num}`}
                  >
                    <Phone size={13} className="mt-0.5 shrink-0 text-amber-400 group-hover:scale-110 transition-transform" aria-hidden="true" />
                    <div>
                      <span className="block font-semibold text-gray-300 group-hover:text-white">+91 {num}</span>
                      <span className="text-xs text-gray-500">{label}</span>
                    </div>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="https://wa.me/916203138576"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-semibold text-green-400 transition hover:text-green-300"
                >
                  <MessageCircle size={13} aria-hidden="true" /> WhatsApp Our Counsellors
                </a>
              </li>
            </ul>

            <div className="mt-6">
              <Link
                href="/apply"
                className="inline-flex items-center gap-2 rounded-xl bg-primary-red px-5 py-2.5 text-sm font-bold text-white shadow transition hover:bg-red-700"
              >
                Book Free Counselling →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 py-5">
        <div className="container-shell flex flex-col items-center gap-2 text-center text-xs sm:flex-row sm:justify-between sm:text-left">
          <p>© {new Date().getFullYear()} Siksha Wallah Education Consultancy. All rights reserved. | College Chowk, Forbesganj, Araria, Bihar — 854318</p>
          <p className="text-gray-500">Trusted guidance for B.Ed • D.El.Ed • Nursing • Pharmacy • Engineering • Management</p>
        </div>
      </div>
    </footer>
  );
}
