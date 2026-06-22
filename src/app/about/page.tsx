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
    role: "Founder & Chief Admission Counsellor",
    phone: "6203138576",
    exp: "9+ Years",
    specialization: "B.Ed • D.El.Ed • BSCC • All Streams",
    bio: "Forbesganj के सबसे अनुभवी Admission Counsellor में से एक। 2015 से अब तक 5,000+ students और उनके परिवारों को सही college और सुरक्षित career की राह दिखाई है। Bihar Student Credit Card (BSCC), B.Ed और Nursing admissions में गहरी विशेषज्ञता।",
  },
];

const milestones = [
  { year: "2015", event: "College Chowk, Forbesganj से Siksha Wallah की स्थापना — पहले ही वर्ष में 50+ students को सही दिशा।" },
  { year: "2017", event: "500+ students top colleges में सफलतापूर्वक admitted — B.Ed और D.El.Ed में विशेष परिणाम।" },
  { year: "2019", event: "Bihar Student Credit Card (BSCC) Guidance Centre के रूप में मान्यता — Araria जिले में सबसे पहले।" },
  { year: "2021", event: "1,000+ students का मील का पत्थर पार — Medical और Nursing division की शुरुआत।" },
  { year: "2023", event: "Bihar, Jharkhand और pan-India 200+ approved colleges के साथ official partnerships।" },
  { year: "2026", event: "5,000+ students को सही career की राह — Araria जिले की #1 trusted education consultancy।" },
];

const trustPoints = [
  ["100% पारदर्शी प्रक्रिया", "हर शुल्क और हर चरण पहले से स्पष्ट रूप से बताया जाता है। कोई hidden charges, कोई आश्चर्य नहीं।"],
  ["पहली Counselling बिल्कुल निःशुल्क", "हमारे पहले परामर्श सत्र की कोई फीस नहीं। बिना किसी दबाव के, सिर्फ ईमानदार सलाह।"],
  ["BSCC में विशेषज्ञता", "Document preparation से DRCC approval तक — Bihar Student Credit Card की पूरी प्रक्रिया में निःशुल्क सहायता।"],
  ["200+ Approved Colleges", "Bihar, Jharkhand, UP और देश के top NCTE/INC/PCI/AICTE-approved colleges के साथ सीधा संपर्क।"],
  ["Regular और Distance — दोनों", "आपकी सुविधा और लक्ष्य के अनुसार Regular या Distance — दोनों options में पूर्ण मार्गदर्शन।"],
  ["Admission के बाद भी साथ", "Hostel, uniform, documentation — admission confirm होने के बाद भी हम आपके साथ खड़े रहते हैं।"],
  ["9+ वर्षों का सिद्ध अनुभव", "2015 से Araria क्षेत्र के परिवारों का भरोसा — हजारों सफल admissions का इतिहास।"],
  ["सभी Streams एक ही जगह", "Teaching, Medical, Nursing, Pharmacy, Engineering, Management — हर stream के लिए एक specialist counsellor।"],
  ["WhatsApp पर त्वरित Response", "कभी भी, कोई भी सवाल — WhatsApp पर message करें, हमारी team जल्द से जल्द जवाब देती है।"],
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
            <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber-300">About Siksha Wallah</span>
          </div>
          {/* H1 */}
          <h1 className="font-headline text-[2.5rem] font-black leading-[1.08] tracking-tight md:text-6xl lg:text-[4rem]">
            <span className="block text-white [text-shadow:0_2px_20px_rgba(255,255,255,0.15)]">Your Family&apos;s Trusted</span>
            <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">Admission Partner</span>
          </h1>
          <div className="mx-auto mt-3 h-[3px] w-28 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-transparent md:w-40" />
          <p className="mt-6 max-w-2xl mx-auto text-lg text-blue-100 leading-relaxed">
            9+ वर्षों से Bihar के विद्यार्थियों और उनके परिवारों को सही कोर्स, सही कॉलेज और एक सुरक्षित career की दिशा में मार्गदर्शन कर रहे हैं — पूरी पारदर्शिता और ईमानदारी के साथ।
          </p>
          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#team"
              className="group relative flex items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 px-8 py-4 font-extrabold text-gray-900 shadow-xl shadow-amber-500/30 transition-all hover:-translate-y-1 hover:shadow-2xl active:scale-[0.97]"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              Meet Our Counsellors
            </a>
            <a
              href="https://wa.me/916203138576?text=नमस्ते! मुझे Admission Counselling चाहिए। कृपया guide करें।"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 rounded-2xl border-2 border-white/25 bg-white/[0.08] px-8 py-4 font-bold text-white backdrop-blur transition-all hover:bg-white/[0.15] hover:-translate-y-1 active:scale-[0.97]"
            >
              <MessageCircle size={18} /> Chat on WhatsApp
            </a>
          </div>
          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/[0.08] pt-8 max-w-lg mx-auto">
            {[
              ["9+", "Years of Experience"],
              ["5,000+", "Students Guided"],
              ["200+", "Partner Colleges"],
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
              <p className="text-sm font-bold uppercase tracking-widest text-purple-700 mb-2">Our Story</p>
              <h2 className="font-headline text-4xl font-extrabold mb-6 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
                Why Siksha Wallah exists.
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                2015 में, Forbesganj और आसपास के गाँवों के हजारों students और उनके माता-पिता के पास न सही जानकारी थी, न कोई भरोसेमंद मार्गदर्शक। महंगे private agents झूठे वादे करते थे, hidden charges वसूलते थे — और एक होनहार student का भविष्य अंधेरे में चला जाता था।
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                इसी कमी को दूर करने के लिए Rajesh Kumar Sah ने एक स्पष्ट संकल्प के साथ Siksha Wallah की नींव रखी: <strong className="text-gray-900">&ldquo;हर student और परिवार को 100% ईमानदार, पारदर्शी और निःशुल्क मार्गदर्शन।&rdquo;</strong> आज हम Araria जिले की #1 trusted education consultancy के रूप में जाने जाते हैं।
              </p>
              <p className="text-gray-600 leading-relaxed">
                हम केवल admission नहीं दिलाते — हम <strong className="text-gray-900">सही career और एक सुरक्षित भविष्य की नींव</strong> तैयार करते हैं। B.Ed से MBBS तक, D.El.Ed से MBA तक — हर stream में अनुभवी विशेषज्ञ, और कोई छिपा शुल्क नहीं।
              </p>
              <div className="mt-6 rounded-xl bg-amber-50 border-2 border-amber-200 p-5">
                <p className="text-sm font-bold text-amber-800">
                  Araria जिले में हमारी पहचान:<br />
                  <span className="font-extrabold text-amber-900">&ldquo;जिस परिवार ने एक बार Siksha Wallah पर भरोसा किया, उसने सही admission पाया।&rdquo;</span>
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Target, color: "bg-purple-600", title: "Our Mission", desc: "Bihar के हर student और परिवार को quality education का सही रास्ता दिखाना — बिना किसी hidden charge और बिना किसी झूठे वादे के।" },
                { icon: Heart, color: "bg-[#dc143c]", title: "Our Vision", desc: "Forbesganj को एक ऐसा education hub बनाना जहाँ से students देश के top colleges और सम्मानजनक careers तक आसानी से पहुँचें।" },
                { icon: ShieldCheck, color: "bg-green-600", title: "Our Values", desc: "पारदर्शिता, ईमानदारी और हर परिवार के साथ खड़े रहने की प्रतिबद्धता — यही Siksha Wallah की पहचान है।" },
                { icon: Award, color: "bg-amber-500", title: "Our Expertise", desc: "B.Ed, Nursing, Pharmacy, Engineering, Management — सभी streams में 9+ वर्षों का सिद्ध अनुभव और हजारों सफल admissions।" },
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
            <p className="text-sm font-bold uppercase tracking-widest text-purple-700 mb-2">Meet Our Expert Counsellors</p>
            <h2 className="font-headline text-4xl font-extrabold bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">The team that guides your family</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto text-sm">
              हर counsellor एक प्रशिक्षित और अनुभवी admission expert हैं — सीधे बात करने के लिए हमेशा उपलब्ध।
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
                <p className="mt-1 text-xs text-gray-400 font-semibold">{exp} of counselling experience</p>
                <div className="mt-2 inline-block rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                  {specialization}
                </div>
                <p className="mt-4 text-sm text-gray-600 leading-relaxed">{bio}</p>
                <a
                  href={`tel:+91${phone}`}
                  className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-purple-700 px-4 py-3 text-sm font-bold text-white hover:bg-purple-800 transition"
                >
                  <Phone size={15} /> Call +91 {phone}
                </a>
                <a
                  href={`https://wa.me/91${phone}?text=नमस्ते! मुझे admission के बारे में guidance चाहिए।`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-green-600 transition"
                >
                  <MessageCircle size={15} /> Chat on WhatsApp
                </a>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-purple-50 border-2 border-purple-100 p-6 text-center">
            <p className="text-sm text-purple-800 font-semibold">
              <strong>आश्वासन:</strong> हमारे काउंसलर हर सवाल का जवाब स्वयं देते हैं — कोई IVR नहीं, कोई automated bot नहीं। आपको हमेशा एक असली व्यक्ति, असली मार्गदर्शन और असली ज़िम्मेदारी मिलेगी।
            </p>
          </div>
        </div>
      </section>

      {/* हम क्यों बेहतर हैं */}
      <section className="py-20 bg-white">
        <div className="container-shell">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-purple-700 mb-2">Why Families Trust Us</p>
            <h2 className="font-headline text-4xl font-extrabold bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">Why choose Siksha Wallah for your admission?</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto text-sm">
              सिर्फ वादे नहीं — 5,000+ परिवारों द्वारा भरोसा किया गया, और हर वर्ष सैकड़ों सफल admissions।
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
            <p className="text-sm font-bold uppercase tracking-widest text-amber-400 mb-2">Our Journey</p>
            <h2 className="font-headline text-4xl font-extrabold bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">A 9-year journey of trust and results</h2>
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
            Book Your Free Admission Counselling Today
          </h2>
          <p className="text-purple-100 mb-8 max-w-xl mx-auto text-sm leading-relaxed">
            एक call, एक WhatsApp message — हमारे विशेषज्ञ आपके हर सवाल का स्पष्ट जवाब देंगे। कोई शुल्क नहीं, कोई दबाव नहीं, सिर्फ ईमानदार मार्गदर्शन।
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:+916203138576"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 font-extrabold text-purple-700 hover:bg-purple-50 shadow-lg transition"
            >
              <Phone size={18} /> Speak to a Counsellor: 6203138576
            </a>
            <a
              href="https://wa.me/916203138576?text=नमस्ते! मुझे Admission Counselling चाहिए। कृपया guide करें।"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-7 py-4 font-extrabold text-white hover:bg-green-700 shadow-lg transition"
            >
              <MessageCircle size={18} /> Chat on WhatsApp
            </a>
            <Link
              href="/apply"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-7 py-4 font-extrabold text-white hover:bg-gray-800 shadow-lg transition"
            >
              Apply Online →
            </Link>
          </div>
        </div>
      </section>
    </PortalShell>
  );
}
