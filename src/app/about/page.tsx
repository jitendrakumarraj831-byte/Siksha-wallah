"use client";

import { PortalShell } from "@/components/portal-shell";
import {
  GraduationCap, Users, Award, BadgeCheck, MapPin, Phone,
  MessageCircle, Star, Heart, Target, ShieldCheck, CheckCircle2,
} from "lucide-react";
import Link from "next/link";

const team = [
  {
    name: "Rajesh Kumar Sah",
    role: "Founder & Chief Counsellor",
    phone: "6203138576",
    exp: "9+ Years",
    bio: "Forbesganj ke sabse trusted education counsellor. 5,000+ students ki career guidance ki hai. B.Ed aur Nursing admissions mein specialist.",
  },
  {
    name: "Counsellor 2",
    role: "BSCC & Nursing Specialist",
    phone: "7858062498",
    exp: "5+ Years",
    bio: "Bihar Student Credit Card scheme aur Nursing admissions mein expert. Hundreds of students ko BSCC loan dilaya hai.",
  },
  {
    name: "Counsellor 3",
    role: "Technical & Management Advisor",
    phone: "9472813581",
    exp: "4+ Years",
    bio: "B.Tech, BBA, MBA, BCA aur Polytechnic admissions ke liye dedicated counsellor. Bihar ke top engineering colleges mein guidance.",
  },
];

const milestones = [
  { year: "2015", event: "Siksha Wallah ki foundation, College Chowk, Forbesganj se shuruat" },
  { year: "2017", event: "500+ students successfully admitted to top colleges" },
  { year: "2019", event: "Bihar Student Credit Card (BSCC) guidance centre bane" },
  { year: "2021", event: "1,000+ students mark crossed, Medical & Nursing division added" },
  { year: "2023", event: "200+ college partnerships established across Bihar & Jharkhand" },
  { year: "2026", event: "5,000+ students guided — Araria district ka #1 consultancy" },
];

export default function AboutPage() {
  return (
    <PortalShell>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#001f6b] via-[#003f9f] to-[#0060c7] py-20 text-white">
        <div className="container-shell text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold">
            <MapPin size={15} className="text-amber-400" /> College Chowk, Forbesganj, Araria — Since 2015
          </div>
          <h1 className="font-headline text-4xl md:text-6xl font-extrabold leading-tight">
            About <span className="text-amber-400">Siksha Wallah</span>
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg text-blue-100 leading-relaxed">
            Araria district का सबसे trusted admission consultancy — जहाँ हर student को मिलती है सही guidance, सही college, और सही career.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-8 max-w-lg mx-auto border-t border-white/20 pt-8">
            {[["5,000+", "Students Guided"], ["200+", "College Partners"], ["98%", "Success Rate"]].map(([n, l]) => (
              <div key={l}>
                <p className="font-headline text-3xl font-extrabold text-amber-400">{n}</p>
                <p className="text-sm text-blue-200 mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container-shell">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#003f9f] mb-2">Our Story</p>
              <h2 className="font-headline text-4xl font-extrabold mb-6">
                क्यों बनाया <span className="text-[#dc143c]">Siksha Wallah?</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                2015 में, Forbesganj और आसपास के गाँवों के हजारों students को सही guidance नहीं मिलती थी। वे expensive private agents के चक्कर में पड़ जाते थे जो fake promises देते और hidden charges लेते थे।
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Siksha Wallah की शुरुआत एक simple mission के साथ हुई: <strong>"हर student को 100% honest, transparent, और free guidance देना।"</strong> आज हम Araria जिले का #1 education consultancy बन चुके हैं।
              </p>
              <p className="text-gray-600 leading-relaxed">
                हम सिर्फ admission नहीं दिलाते — हम students का <strong>career बनाते हैं।</strong> B.Ed से MBBS तक, D.El.Ed से MBA तक — हर course में expert guidance।
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Target, color: "bg-blue-600", title: "Our Mission", desc: "हर Bihar के student को quality education का सही रास्ता दिखाना — बिना किसी hidden charge के।" },
                { icon: Heart, color: "bg-red-500", title: "Our Vision", desc: "Forbesganj को education hub बनाना जहाँ से students पूरे India के top colleges में जाएं।" },
                { icon: ShieldCheck, color: "bg-green-600", title: "Our Values", desc: "Transparency, Honesty, और Complete Support — यही हमारी पहचान है।" },
                { icon: Award, color: "bg-amber-500", title: "Our Expertise", desc: "B.Ed, Nursing, Engineering, Management — सभी streams में 9+ साल का experience।" },
              ].map(({ icon: Icon, color, title, desc }) => (
                <div key={title} className="rounded-2xl border-2 border-gray-100 p-5">
                  <div className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl ${color} text-white`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="font-headline font-extrabold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 bg-gray-50">
        <div className="container-shell">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-[#003f9f] mb-2">Meet The Team</p>
            <h2 className="font-headline text-4xl font-extrabold">हमारे Expert Counsellors</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {team.map(({ name, role, phone, exp, bio }) => (
              <div key={name} className="rounded-2xl bg-white border-2 border-gray-100 p-7 text-center shadow-sm hover:shadow-lg transition hover:-translate-y-1">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#003f9f] font-headline text-3xl font-extrabold text-white">
                  {name[0]}
                </div>
                <h3 className="font-headline text-xl font-extrabold text-gray-900">{name}</h3>
                <p className="text-[#003f9f] font-semibold text-sm mt-1">{role}</p>
                <p className="mt-1 text-xs text-gray-400 font-semibold">{exp} Experience</p>
                <p className="mt-4 text-sm text-gray-600 leading-relaxed">{bio}</p>
                <a
                  href={`tel:+91${phone}`}
                  className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-[#003f9f] px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition"
                >
                  <Phone size={15} /> +91 {phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container-shell">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-[#dc143c] mb-2">Why Choose Us</p>
            <h2 className="font-headline text-4xl font-extrabold">Siksha Wallah क्यों बेहतर है?</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["100% Transparent Fees", "हर charge upfront बताया जाता है। कोई hidden fees नहीं।"],
              ["Free Counselling", "पहली counselling session 100% free। कोई obligation नहीं।"],
              ["BSCC Specialist", "Bihar Student Credit Card के लिए complete guidance — document से DRCC तक।"],
              ["200+ College Network", "Bihar, Jharkhand, UP, और बाहर के top approved colleges।"],
              ["Regular & Distance Both", "Regular और distance दोनों modes में guidance available।"],
              ["Post-Admission Support", "Admission के बाद hostel, uniform, और documents में भी help।"],
              ["9+ Years Experience", "2015 से Araria region के students को trusted guidance।"],
              ["All Streams Covered", "Teaching, Medical, Engineering, Management — सब कुछ।"],
              ["WhatsApp Support", "24/7 WhatsApp पर instant support available।"],
            ].map(([title, desc]) => (
              <div key={title} className="flex gap-3 rounded-2xl border-2 border-gray-100 p-5 hover:border-blue-200 hover:bg-blue-50 transition">
                <CheckCircle2 size={20} className="mt-0.5 flex-shrink-0 text-green-500" />
                <div>
                  <p className="font-bold text-gray-900">{title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey / Timeline */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container-shell">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-amber-400 mb-2">Our Journey</p>
            <h2 className="font-headline text-4xl font-extrabold">2015 से अब तक का सफर</h2>
          </div>
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/10" />
            <div className="space-y-8">
              {milestones.map(({ year, event }) => (
                <div key={year} className="relative flex gap-6 pl-16">
                  <div className="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full bg-[#003f9f] font-headline font-extrabold text-sm text-white border-2 border-amber-400">
                    {year.slice(2)}
                  </div>
                  <div className="flex-1 rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-bold text-amber-400 mb-1">{year}</p>
                    <p className="text-sm text-gray-300">{event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-amber-400">
        <div className="container-shell text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            अपना Admission Journey शुरू करें
          </h2>
          <p className="text-gray-800 mb-8 max-w-xl mx-auto">
            Free counselling के लिए आज ही call करें या WhatsApp करें। हमारे experts आपकी हर सवाल का जवाब देंगे।
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:+916203138576" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#003f9f] px-7 py-4 font-extrabold text-white hover:bg-blue-700 transition">
              <Phone size={18} /> Call: 6203138576
            </a>
            <a href="https://wa.me/916203138576" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-7 py-4 font-extrabold text-white hover:bg-green-700 transition">
              <MessageCircle size={18} /> WhatsApp करें
            </a>
            <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-7 py-4 font-extrabold text-white hover:bg-gray-800 transition">
              Apply Online →
            </Link>
          </div>
        </div>
      </section>
    </PortalShell>
  );
}
