"use client";

import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { ReviewsCarousel } from "@/components/reviews-carousel";
import {
  GraduationCap, Users, Award, BadgeCheck, MapPin, Phone,
  MessageCircle, Star, Heart, Target, ShieldCheck, CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { successStories } from "@/lib/reviews-data";

const team = [
  {
    name: "Rajesh Kr. Sah",
    role: "Founder & Chief Admission Counsellor",
    phone: "6203138576",
    exp: "11+ Years",
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
  ["11+ वर्षों का सिद्ध अनुभव", "2015 से Araria क्षेत्र के परिवारों का भरोसा — हजारों सफल admissions का इतिहास।"],
  ["सभी Streams एक ही जगह", "Teaching, Medical, Nursing, Pharmacy, Engineering, Management — हर stream के लिए एक specialist counsellor।"],
  ["WhatsApp पर त्वरित Response", "कभी भी, कोई भी सवाल — WhatsApp पर message करें, हमारी team जल्द से जल्द जवाब देती है।"],
];

export default function AboutPage() {
  return (
    <>
      <SiteNavbar />
      <main>
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
          <h1 className="font-headline font-black tracking-tight leading-[1.1]">
            <span className="block text-[1.6rem] md:text-[2.4rem] lg:text-[2.8rem] text-white/80">Forbesganj का सबसे</span>
            <span className="block text-[2.8rem] md:text-[4.2rem] lg:text-[5rem] bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">भरोसेमंद Admission Partner</span>
            <span className="block text-[1.5rem] md:text-[2rem] lg:text-[2.4rem] text-white">2015 से आपके परिवार के साथ।</span>
          </h1>
          <div className="mx-auto mt-4 h-[3px] w-28 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-transparent md:w-40" />
          <p className="mt-6 max-w-2xl mx-auto text-base text-blue-100 leading-relaxed">
            11+ वर्षों से Bihar के विद्यार्थियों और परिवारों को सही Course, सही College और एक सुरक्षित Career की राह दिखाते आ रहे हैं — 100% पारदर्शिता और बिना किसी hidden charge के।
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
              ["11+", "Years of Experience"],
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
              <p className="text-sm font-bold uppercase tracking-widest text-primary-blue mb-2">Our Story</p>
              <h2 className="font-headline text-4xl font-extrabold mb-6 text-gray-900">
                Why <span className="text-primary-blue">Siksha Wallah</span> exists.
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                2015 में, Forbesganj और आसपास के गाँवों के हजारों students और उनके माता-पिता के पास न सही जानकारी थी, न कोई भरोसेमंद मार्गदर्शक। महंगे private agents झूठे वादे करते थे, hidden charges वसूलते थे — और एक होनहार student का भविष्य अंधेरे में चला जाता था।
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                इसी कमी को दूर करने के लिए Rajesh Kr. Sah ने एक स्पष्ट संकल्प के साथ Siksha Wallah की नींव रखी: <strong className="text-gray-900">&ldquo;हर student और परिवार को 100% ईमानदार, पारदर्शी और निःशुल्क मार्गदर्शन।&rdquo;</strong> आज हम Araria जिले की #1 trusted education consultancy के रूप में जाने जाते हैं।
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
                { icon: Target, color: "bg-primary-blue", title: "Our Mission", desc: "Bihar के हर student और परिवार को quality education का सही रास्ता दिखाना — बिना किसी hidden charge और बिना किसी झूठे वादे के।" },
                { icon: Heart, color: "bg-[#dc143c]", title: "Our Vision", desc: "Forbesganj को एक ऐसा education hub बनाना जहाँ से students देश के top colleges और सम्मानजनक careers तक आसानी से पहुँचें।" },
                { icon: ShieldCheck, color: "bg-green-600", title: "Our Values", desc: "पारदर्शिता, ईमानदारी और हर परिवार के साथ खड़े रहने की प्रतिबद्धता — यही Siksha Wallah की पहचान है।" },
                { icon: Award, color: "bg-amber-500", title: "Our Expertise", desc: "B.Ed, Nursing, Pharmacy, Engineering, Management — सभी streams में 11+ वर्षों का सिद्ध अनुभव और हजारों सफल admissions।" },
              ].map(({ icon: Icon, color, title, desc }) => (
                <div key={title} className="rounded-2xl border-2 border-blue-100 bg-blue-50 p-5 hover:shadow-md transition">
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
            <p className="text-sm font-bold uppercase tracking-widest text-primary-blue mb-2">Meet Our Expert Counsellors</p>
            <h2 className="font-headline text-4xl font-extrabold text-gray-900">The team that <span className="text-primary-blue">guides your family</span></h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto text-sm">
              हर counsellor एक प्रशिक्षित और अनुभवी admission expert हैं — सीधे बात करने के लिए हमेशा उपलब्ध।
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {team.map(({ name, role, phone, exp, specialization, bio }) => (
              <div key={name} className="overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                {/* Colored top band */}
                <div className="relative bg-gradient-to-br from-[#001f6b] to-[#003f9f] px-7 pb-10 pt-7 text-center">
                  <BadgeCheck size={80} className="pointer-events-none absolute -right-4 -top-4 text-white/5" />
                  {/* Available badge */}
                  <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-green-500/20 px-2.5 py-1 text-[11px] font-bold text-green-300 ring-1 ring-green-500/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400" /> Available
                  </div>
                  {/* Avatar */}
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 font-headline text-3xl font-extrabold text-gray-900 shadow-xl ring-4 ring-white/20">
                    {name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div className="mt-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-300">{exp} Experience</p>
                  </div>
                </div>
                {/* Content — pulls up over the band */}
                <div className="-mt-5 rounded-t-2xl bg-white px-7 pb-7 pt-5 text-center">
                  <h3 className="font-headline text-xl font-extrabold text-gray-900">{name}</h3>
                  <p className="text-primary-blue font-semibold text-sm mt-0.5">{role}</p>
                  <div className="mt-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-primary-blue">
                    {specialization}
                  </div>
                  <p className="mt-4 text-sm text-gray-500 leading-relaxed">{bio}</p>
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <a href={`tel:+91${phone}`}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-[#003f9f] px-3 py-2.5 text-xs font-bold text-white hover:bg-blue-800 transition">
                      <Phone size={13} /> Call Now
                    </a>
                    <a href={`https://wa.me/91${phone}?text=नमस्ते! मुझे admission guidance चाहिए।`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-green-500 px-3 py-2.5 text-xs font-bold text-white hover:bg-green-600 transition">
                      <MessageCircle size={13} /> WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-blue-50 border-2 border-blue-100 p-6 text-center">
            <p className="text-sm text-blue-800 font-semibold">
              <strong>आश्वासन:</strong> हमारे काउंसलर हर सवाल का जवाब स्वयं देते हैं — कोई IVR नहीं, कोई automated bot नहीं। आपको हमेशा एक असली व्यक्ति, असली मार्गदर्शन और असली ज़िम्मेदारी मिलेगी।
            </p>
          </div>
        </div>
      </section>

      {/* हम क्यों बेहतर हैं */}
      <section className="py-20 bg-white">
        <div className="container-shell">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-primary-blue mb-2">Why Families Trust Us</p>
            <h2 className="font-headline text-4xl font-extrabold text-gray-900">Why choose <span className="text-primary-blue">Siksha Wallah</span> for your admission?</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto text-sm">
              सिर्फ वादे नहीं — 5,000+ परिवारों द्वारा भरोसा किया गया, और हर वर्ष सैकड़ों सफल admissions।
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trustPoints.map(([title, desc]) => (
              <div key={title as string} className="flex gap-3 rounded-2xl border-2 border-gray-100 bg-gray-50 p-5 hover:border-blue-200 hover:bg-blue-50 transition">
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
      <section className="relative overflow-hidden bg-gradient-to-br from-[#00102e] via-[#001850] to-[#003590] py-20 text-white">
        {/* dot-grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="container-shell relative">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-400 mb-2">Our Journey</p>
            <h2 className="font-headline text-4xl font-extrabold text-white">11 साल का भरोसा, <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">हज़ारों सफल Admissions</span></h2>
          </div>
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/10" />
            <div className="space-y-8">
              {milestones.map(({ year, event }) => (
                <div key={year} className="relative flex gap-6 pl-16">
                  <div className="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full bg-primary-blue font-headline font-extrabold text-sm text-white border-2 border-amber-400">
                    {year.slice(2)}
                  </div>
                  <div className="flex-1 rounded-xl border border-white/[0.1] bg-white/[0.05] p-4 backdrop-blur-sm">
                    <p className="text-xs font-bold text-amber-400 mb-1">{year}</p>
                    <p className="text-sm text-blue-100 leading-relaxed">{event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-[#00102e] via-[#001850] to-[#003590]">
        <div className="container-shell text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-extrabold text-white mb-3">
            Book Your Free <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">Admission Counselling</span> Today
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto text-sm leading-relaxed">
            एक call, एक WhatsApp message — हमारे विशेषज्ञ आपके हर सवाल का स्पष्ट जवाब देंगे। कोई शुल्क नहीं, कोई दबाव नहीं, सिर्फ ईमानदार मार्गदर्शन।
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:+916203138576"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 font-extrabold text-primary-blue hover:bg-blue-50 shadow-lg transition"
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

      {/* ── SUCCESS STORIES CAROUSEL ── */}
      <ReviewsCarousel 
        reviews={successStories}
        title="सफल छात्रों की प्रेरणादायक कहानियाँ"
        subtitle="हमारे साथ admission पाने वाले 5,000+ students के असली अनुभव सुनें।"
      />
      </main>
      <SiteFooter />
    </>
  );
}
