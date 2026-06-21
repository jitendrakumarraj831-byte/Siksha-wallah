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
    exp: "9+ वर्ष",
    specialization: "B.Ed • D.El.Ed • BSCC • All Courses",
    bio: "Forbesganj के सबसे अनुभवी Admission Counsellor। 2015 से 5,000+ students को सही college और career की राह दिखाई है। Bihar Student Credit Card, B.Ed और Nursing admissions में विशेष expertise।",
  },
  {
    name: "Md. Naseem Ansari",
    role: "Senior Counsellor — Nursing & Medical",
    phone: "7858062498",
    exp: "5+ वर्ष",
    specialization: "BSCC • B.Sc Nursing • GNM • ANM • B.Pharma",
    bio: "Bihar Student Credit Card scheme और Nursing / Pharmacy admissions के specialist। सैकड़ों students को BSCC loan guide करके INC-approved nursing colleges में admission दिलाया है।",
  },
  {
    name: "Gautam Kumar",
    role: "Counsellor — Kursakanta Branch",
    phone: "9162653235",
    exp: "4+ वर्ष",
    specialization: "BSCC • B.Tech • BBA • MBA — Kursakanta & आसपास",
    bio: "Kursakanta branch से Araria और आसपास के students को complete admission guidance देते हैं। B.Tech, BBA, MBA और BSCC applications में expert। पूरी application process free में guide करते हैं।",
  },
];

const milestones = [
  { year: "2015", event: "College Chowk, Forbesganj से Siksha Wallah की शुरुआत — पहले साल में 50+ students की guidance" },
  { year: "2017", event: "500+ students successfully top colleges में admitted, B.Ed & D.El.Ed में special focus" },
  { year: "2019", event: "Bihar Student Credit Card (BSCC) Guidance Centre के रूप में certified — Araria जिले में पहले" },
  { year: "2021", event: "1,000+ students milestone पार, Medical & Nursing division की शुरुआत" },
  { year: "2023", event: "Bihar, Jharkhand और Pan-India 200+ approved college partnerships स्थापित" },
  { year: "2026", event: "5,000+ students guided — Araria जिले का #1 Trusted Admission Consultancy" },
];

const trustPoints = [
  ["100% पारदर्शी शुल्क", "हर charge पहले से बताया जाता है। कोई hidden fees नहीं, कोई surprise नहीं।"],
  ["पहली Counselling बिल्कुल Free", "पहला session 100% free है। कोई obligation नहीं, बस honest guidance।"],
  ["BSCC में विशेषज्ञता", "Document preparation से DRCC approval तक — Bihar Student Credit Card की पूरी guidance निःशुल्क।"],
  ["200+ College Network", "Bihar, Jharkhand, UP और देश के top approved colleges में direct connection।"],
  ["Regular & Distance दोनों", "Regular और Distance Mode दोनों में guidance उपलब्ध — आपकी सुविधा अनुसार।"],
  ["Admission के बाद भी Support", "Hostel, uniform, documents — admission confirm होने के बाद भी हम साथ हैं।"],
  ["9+ वर्ष का अनुभव", "2015 से Araria region के students को trusted और proven guidance।"],
  ["सभी Streams उपलब्ध", "Teaching, Medical, Engineering, Management — एक ही जगह, सबके लिए।"],
  ["WhatsApp पर 24/7 Support", "कभी भी WhatsApp करें — तुरंत जवाब मिलेगा।"],
];

export default function AboutPage() {
  return (
    <PortalShell>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#00102e] via-[#001850] to-[#003590] py-20 text-white">
        {/* Dot-grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        {/* Glow orbs */}
        <div className="pointer-events-none absolute -top-40 -right-32 h-[480px] w-[480px] rounded-full bg-amber-400 opacity-[0.10] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-500 opacity-[0.13] blur-3xl" />
        <div className="container-shell relative text-center">
          {/* Label pill */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/[0.1] px-4 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
            <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber-300">हमारे बारे में</span>
          </div>
          {/* H1 */}
          <h1 className="font-headline text-[2.5rem] font-black leading-[1.08] tracking-tight md:text-6xl lg:text-[4rem]">
            <span className="block text-white [text-shadow:0_2px_20px_rgba(255,255,255,0.15)]">Siksha Wallah —</span>
            <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">आपका विश्वसनीय मार्गदर्शक</span>
          </h1>
          <div className="mx-auto mt-3 h-[3px] w-28 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-transparent md:w-40" />
          <p className="mt-6 max-w-2xl mx-auto text-lg text-blue-100 leading-relaxed">
            9+ वर्षों से Bihar के students को सही कॉलेज और सही course चुनने में मदद कर रहे हैं।
          </p>
          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#team"
              className="group relative flex items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 px-8 py-4 font-extrabold text-gray-900 shadow-xl shadow-amber-500/30 transition-all hover:-translate-y-1 hover:shadow-2xl active:scale-[0.97]"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              Team से मिलें
            </a>
            <a
              href="https://wa.me/916203138576?text=नमस्ते! मुझे Admission Counselling चाहिए। कृपया guide करें।"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 rounded-2xl border-2 border-white/25 bg-white/[0.08] px-8 py-4 font-bold text-white backdrop-blur transition-all hover:bg-white/[0.15] hover:-translate-y-1 active:scale-[0.97]"
            >
              <MessageCircle size={18} /> WhatsApp करें
            </a>
          </div>
          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/[0.08] pt-8 max-w-lg mx-auto">
            {[
              ["9+", "Years"],
              ["5000+", "Students"],
              ["200+", "Colleges"],
            ].map(([n, l]) => (
              <div key={l}>
                <p className="font-headline text-3xl font-extrabold text-amber-400">{n}</p>
                <p className="text-sm text-blue-200 mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* हमारी कहानी */}
      <section className="py-20 bg-white">
        <div className="container-shell">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-purple-700 mb-2">हमारी कहानी</p>
              <h2 className="font-headline text-4xl font-extrabold mb-6 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
                Siksha Wallah क्यों बना? असली वजह।
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                2015 में, Forbesganj और आसपास के गाँवों के हजारों students के पास न सही information थी, न कोई trustworthy guide। महंगे private agents झूठे वादे करते थे, hidden charges लेते थे — और students का भविष्य अंधेरे में डूब जाता था।
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Rajesh Kumar Sah ने एक simple लेकिन powerful mission के साथ Siksha Wallah शुरू किया: <strong className="text-gray-900">"हर student को 100% honest, transparent और free guidance।"</strong> आज हम Araria जिले का #1 trusted education consultancy हैं।
              </p>
              <p className="text-gray-600 leading-relaxed">
                हम सिर्फ admission नहीं दिलाते — हम students का <strong className="text-gray-900">भविष्य बनाते हैं।</strong> B.Ed से MBBS तक, D.El.Ed से MBA तक — हर stream में expert guidance, बिना किसी hidden cost के।
              </p>
              <div className="mt-6 rounded-xl bg-amber-50 border-2 border-amber-200 p-5">
                <p className="text-sm font-bold text-amber-800">
                  🏆 Araria जिले में हमारी पहचान:<br />
                  <span className="font-extrabold text-amber-900">"जहाँ एक बार गए, वहीं से admission मिला।"</span>
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Target, color: "bg-purple-600", title: "हमारा Mission", desc: "Bihar के हर student को quality education का सही रास्ता दिखाना — बिना किसी hidden charge के, बिना किसी झूठे वादे के।" },
                { icon: Heart, color: "bg-[#dc143c]", title: "हमारा Vision", desc: "Forbesganj को एक education hub बनाना जहाँ से students पूरे India के top colleges तक पहुँचें।" },
                { icon: ShieldCheck, color: "bg-green-600", title: "हमारे मूल्य", desc: "पारदर्शिता, ईमानदारी और पूर्ण सहयोग — यही Siksha Wallah की असली पहचान है।" },
                { icon: Award, color: "bg-amber-500", title: "हमारी विशेषज्ञता", desc: "B.Ed, Nursing, Engineering, Management — सभी streams में 9+ साल का सिद्ध अनुभव।" },
              ].map(({ icon: Icon, color, title, desc }) => (
                <div key={title} className="rounded-2xl border-2 border-purple-100 bg-purple-50 p-5 hover:shadow-md transition">
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

      {/* हमारी Team */}
      <section id="team" className="py-20 bg-gray-50">
        <div className="container-shell">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-purple-700 mb-2">हमारी Expert Team</p>
            <h2 className="font-headline text-4xl font-extrabold bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">जो लोग आपकी मदद करते हैं</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto text-sm">
              हमारे काउंसलर असली लोग हैं — प्रमाणित, अनुभवी, और हमेशा आपके लिए उपलब्ध।
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {team.map(({ name, role, phone, exp, specialization, bio }) => (
              <div key={name} className="rounded-2xl bg-white border-2 border-gray-100 p-7 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#6b21a8] to-[#9333ea] font-headline text-3xl font-extrabold text-white shadow-lg">
                  {name[0]}
                </div>
                <h3 className="font-headline text-xl font-extrabold text-gray-900">{name}</h3>
                <p className="text-purple-700 font-semibold text-sm mt-1">{role}</p>
                <p className="mt-1 text-xs text-gray-400 font-semibold">{exp} का अनुभव</p>
                <div className="mt-2 inline-block rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                  {specialization}
                </div>
                <p className="mt-4 text-sm text-gray-600 leading-relaxed">{bio}</p>
                <a
                  href={`tel:+91${phone}`}
                  className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-purple-700 px-4 py-3 text-sm font-bold text-white hover:bg-purple-800 transition"
                >
                  <Phone size={15} /> +91 {phone} — अभी Call करें
                </a>
                <a
                  href={`https://wa.me/91${phone}?text=नमस्ते! मुझे admission के बारे में guidance चाहिए।`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-green-600 transition"
                >
                  <MessageCircle size={15} /> WhatsApp करें
                </a>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-purple-50 border-2 border-purple-100 p-6 text-center">
            <p className="text-sm text-purple-800 font-semibold">
              💡 <strong>नोट:</strong> हमारे सभी काउंसलर सीधे आपसे बात करते हैं — कोई IVR नहीं, कोई bot नहीं। असली इंसान, असली मार्गदर्शन।
            </p>
          </div>
        </div>
      </section>

      {/* हम क्यों बेहतर हैं */}
      <section className="py-20 bg-white">
        <div className="container-shell">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-purple-700 mb-2">हमारी खासियत</p>
            <h2 className="font-headline text-4xl font-extrabold bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">Siksha Wallah को क्यों चुनें?</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto text-sm">
              सिर्फ वादे नहीं — 5,000+ students के proven results।
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trustPoints.map(([title, desc]) => (
              <div key={title as string} className="flex gap-3 rounded-2xl border-2 border-gray-100 bg-gray-50 p-5 hover:border-purple-200 hover:bg-purple-50 transition">
                <CheckCircle2 size={20} className="mt-0.5 flex-shrink-0 text-green-500" />
                <div>
                  <p className="font-bold text-gray-900">{title}</p>
                  <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container-shell">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-amber-400 mb-2">हमारा सफर</p>
            <h2 className="font-headline text-4xl font-extrabold bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">2015 से आज तक की यात्रा</h2>
          </div>
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/10" />
            <div className="space-y-8">
              {milestones.map(({ year, event }) => (
                <div key={year} className="relative flex gap-6 pl-16">
                  <div className="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full bg-purple-700 font-headline font-extrabold text-sm text-white border-2 border-amber-400">
                    {year.slice(2)}
                  </div>
                  <div className="flex-1 rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-bold text-amber-400 mb-1">{year}</p>
                    <p className="text-sm text-gray-300 leading-relaxed">{event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="container-shell text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-extrabold text-white mb-3">
            आज ही निःशुल्क परामर्श बुक करें
          </h2>
          <p className="text-purple-100 mb-8 max-w-xl mx-auto text-sm leading-relaxed">
            कॉल करें, WhatsApp करें — हमारे विशेषज्ञ आपके हर सवाल का जवाब देंगे। कोई शुल्क नहीं, कोई झूठा वादा नहीं।
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:+916203138576"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 font-extrabold text-purple-700 hover:bg-purple-50 shadow-lg transition"
            >
              <Phone size={18} /> अभी Call करें: 6203138576
            </a>
            <a
              href="https://wa.me/916203138576?text=नमस्ते! मुझे Admission Counselling चाहिए। कृपया guide करें।"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-7 py-4 font-extrabold text-white hover:bg-green-700 shadow-lg transition"
            >
              <MessageCircle size={18} /> WhatsApp करें
            </a>
            <Link
              href="/apply"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-7 py-4 font-extrabold text-white hover:bg-gray-800 shadow-lg transition"
            >
              Online Apply करें →
            </Link>
          </div>
        </div>
      </section>
    </PortalShell>
  );
}
