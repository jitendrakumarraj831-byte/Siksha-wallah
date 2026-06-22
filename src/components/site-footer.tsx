import Link from "next/link";
import { GraduationCap, Phone, MessageCircle, MapPin, Mail, Clock } from "lucide-react";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "All Courses" },
  { href: "/student-credit-card", label: "BSCC Guide" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/auth/login", label: "Student Login" },
  { href: "/apply", label: "Apply Now" },
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
  { num: "6203138576", label: "Rajesh Kr. Sah (Primary)" },
  { num: "7858062498", label: "Md. Naseem Ansari" },
  { num: "9162653235", label: "Gautam Kumar" },
];

export function SiteFooter() {
  return (
    <footer className="bg-gray-950 text-gray-400" aria-label="Site footer">
      <div className="bg-gradient-to-r from-primary-blue via-blue-700 to-cyan-700 py-8">
        <div className="container-shell flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="font-headline text-xl font-extrabold text-white">Admission guidance chahiye? Aaj hi team se baat kariye.</p>
            <p className="mt-1 text-sm text-blue-100">Free counselling, verified college options, and BSCC support from one trusted team.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 sm:justify-end">
            <a
              href="tel:+916203138576"
              className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-primary-blue transition hover:bg-blue-50"
            >
              <Phone size={15} aria-hidden="true" /> Call Now
            </a>
            <a
              href="https://wa.me/916203138576?text=नमस्ते!%20मुझे%20Free%20Admission%20Counselling%20चाहिए।%20Please%20guide%20karein।"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border-2 border-white/40 bg-white/10 px-5 py-2.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              <MessageCircle size={15} aria-hidden="true" /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="container-shell py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
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
            <p className="mb-5 text-sm leading-relaxed">
              Forbesganj&apos;s trusted admission consultancy for students who want clear guidance, transparent support, and the right next step.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0 text-amber-400" aria-hidden="true" />
                <span>College Chowk, Near HP Petrol Pump, Forbesganj, Araria, Bihar 854318</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="shrink-0 text-amber-400" aria-hidden="true" />
                <span>Mon-Sat: 9:00 AM - 7:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="shrink-0 text-amber-400" aria-hidden="true" />
                <span>sikshawallah.info@gmail.com</span>
              </div>
              <a
                href="https://maps.google.com/?q=College+Chowk+Forbesganj+Araria+Bihar"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 pt-1 text-sm font-semibold text-amber-400 transition hover:text-amber-300"
              >
                <MapPin size={14} aria-hidden="true" /> Open in Google Maps
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-headline font-bold text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm" role="list">
              {QUICK_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="transition duration-200 hover:pl-1 hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-headline font-bold text-white">Popular Courses</h3>
            <ul className="space-y-2 text-sm" role="list">
              {COURSES.map((course) => (
                <li key={course}>
                  <Link href="/courses" className="transition duration-200 hover:pl-1 hover:text-white">
                    {course}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-headline font-bold text-white">Talk To Us</h3>
            <ul className="space-y-3 text-sm" role="list">
              {PHONES.map(({ num, label }) => (
                <li key={num}>
                  <a
                    href={`tel:+91${num}`}
                    className="group flex items-start gap-2 rounded-xl border border-gray-800 bg-gray-900/60 p-3 transition hover:border-gray-700 hover:text-white"
                    aria-label={`Call ${label} at ${num}`}
                  >
                    <Phone size={13} className="mt-0.5 shrink-0 text-amber-400 transition-transform group-hover:scale-110" aria-hidden="true" />
                    <div>
                      <span className="block font-semibold text-gray-200 group-hover:text-white">+91 {num}</span>
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
                  <MessageCircle size={13} aria-hidden="true" /> WhatsApp Chat
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

      <div className="border-t border-gray-800 py-5">
        <div className="container-shell flex flex-col items-center gap-2 text-center text-xs sm:flex-row sm:justify-between sm:text-left">
          <p>© {new Date().getFullYear()} Siksha Wallah. All rights reserved. | College Chowk, Forbesganj, Araria, Bihar</p>
          <p className="text-gray-500">B.Ed • D.El.Ed • Nursing • Pharmacy • Engineering • Management</p>
        </div>
      </div>
    </footer>
  );
}
