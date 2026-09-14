"use client";

import Link from "next/link";
import { GraduationCap, Phone, MessageCircle, MapPin, Mail, Clock } from "lucide-react";
import { saveActivity } from "@/services/activity-service";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Explore Courses" },
  { href: "/blog", label: "Career Guidance Blog" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Our Team" },
  { href: "/auth/login", label: "Student Login" },
  { href: "/apply", label: "Book Free Counselling" },
];

// These used to be "/courses#teaching"-style anchors, which all resolved to the
// same single page and gave the course detail pages no inbound links at all.
// Linking straight to each detail page puts a crawlable link to every popular
// course on every page of the site.
const COURSES = [
  { label: "B.Ed",          href: "/courses/bed" },
  { label: "D.El.Ed",       href: "/courses/deled" },
  { label: "B.Sc Nursing",  href: "/courses/bsc-nursing" },
  { label: "GNM Nursing",   href: "/courses/gnm" },
  { label: "ANM Nursing",   href: "/courses/anm" },
  { label: "MBBS",          href: "/courses/mbbs" },
  { label: "B.Pharma",      href: "/courses/bpharma" },
  { label: "D.Pharma",      href: "/courses/dpharma" },
  { label: "B.Tech",        href: "/courses/btech" },
  { label: "Polytechnic",   href: "/courses/polytechnic" },
  { label: "BBA / MBA",     href: "/courses/mba" },
  { label: "LLB",           href: "/courses/llb" },
];

// Developer credit shown in the footer bottom bar.
const DEVELOPER = {
  name: "Jitendra Kumar",
  phones: ["8651070831", "8541849118"],
};

const PHONES = [
  { num: "6203138576", label: "Rajesh Kr. Sah — Primary Admission Contact" },
  { num: "7858062498", label: "Office Contact" },
];

export function SiteFooter() {
  return (
    <footer className="bg-gray-950 text-gray-400" aria-label="Site footer">
      <div className="bg-gradient-to-r from-[#001f6b] via-[#003f9f] to-[#0060c7] py-8">
        <div className="container-shell flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="font-headline text-xl font-extrabold text-white">Free Career Counselling — Speak to an Admission Expert Today</p>
            <p className="mt-1 text-sm text-blue-100">No consultation fees. No obligation. Honest, personalised guidance for every student and family.</p>
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
              onClick={() => saveActivity({ type: "whatsapp", title: "💬 WhatsApp Click — Footer CTA", description: "Footer top banner WhatsApp button", page: window.location.pathname })}
              className="flex items-center gap-2 rounded-xl border-2 border-white/40 bg-white/10 px-5 py-2.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              <MessageCircle size={15} aria-hidden="true" /> Chat on WhatsApp
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
                  SIKSHA<span className="text-amber-400">WALLAH</span>
                </span>
              </div>
            </Link>
            <p className="mb-5 text-sm leading-relaxed">
              Forbesganj&apos;s most trusted education consultancy since 2015 — 11+ years of honest guidance. Over 5,000 students personally guided into the right course, the right college and a secure career — across Bihar and beyond.
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
              <a
                href="mailto:sikshawallah.info@gmail.com"
                className="flex items-center gap-2 transition hover:text-white"
              >
                <Mail size={14} className="shrink-0 text-amber-400" aria-hidden="true" />
                <span>sikshawallah.info@gmail.com</span>
              </a>
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
            <h3 className="mb-4 font-headline font-bold text-white">Helpful Links</h3>
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
            <h3 className="mb-4 font-headline font-bold text-white">Courses We Guide For</h3>
            <ul className="space-y-2 text-sm" role="list">
              {COURSES.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="transition duration-200 hover:pl-1 hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link href="/courses#all-courses" className="font-semibold text-amber-400 transition hover:text-amber-300">
                  View all 40+ courses →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-headline font-bold text-white">Talk to Our Counsellors</h3>
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
                  onClick={() => saveActivity({ type: "whatsapp", title: "💬 WhatsApp Click — Footer Link", description: "Footer quick-links WhatsApp", page: window.location.pathname })}
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

      <div className="border-t border-gray-800 py-5">
        <div className="container-shell flex flex-col items-center gap-3 text-xs">
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-semibold" aria-label="Legal">
            <Link href="/portal/privacy" className="transition hover:text-white">Privacy Policy</Link>
            <span className="text-gray-700" aria-hidden="true">·</span>
            <Link href="/portal/terms" className="transition hover:text-white">Terms &amp; Conditions</Link>
          </nav>
          <div className="flex w-full flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
            <p>© {new Date().getFullYear()} Siksha Wallah Education Consultancy. All rights reserved. | College Chowk, Forbesganj, Araria, Bihar — 854318</p>
            <p className="text-gray-500">Trusted guidance for B.Ed • D.El.Ed • Nursing • Pharmacy • Engineering • Management</p>
          </div>
          <p className="w-full border-t border-gray-800 pt-4 text-center text-gray-500">
            Design and developed by{" "}
            <span className="whitespace-nowrap font-semibold text-gray-300">{DEVELOPER.name}</span>
            <span className="mx-1.5 text-gray-700" aria-hidden="true">·</span>
            {DEVELOPER.phones.map((num, i) => (
              <span key={num}>
                {i > 0 && <span className="mx-1.5 text-gray-700" aria-hidden="true">·</span>}
                <a
                  href={`tel:+91${num}`}
                  className="whitespace-nowrap transition hover:text-white"
                  aria-label={`Call the developer ${DEVELOPER.name} at +91 ${num}`}
                >
                  +91 {num}
                </a>
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
