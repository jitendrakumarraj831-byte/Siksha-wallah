"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ArrowRight, BadgeCheck, BookOpen, BriefcaseBusiness, Building2, Check,
  ChevronDown, CircleCheckBig, GraduationCap, HeartPulse, MapPin, Menu,
  MessageCircle, Phone, Play, Quote, ShieldCheck, Sparkles, Star, Users, X,
} from "lucide-react";

const courses = [
  { icon: GraduationCap, name: "B.Ed & D.El.Ed", list: "B.Ed · D.El.Ed · M.Ed", color: "bg-blue-100 text-blue-700", badge: "Teaching" },
  { icon: HeartPulse, name: "Medical & Nursing", list: "MBBS · B.Sc Nursing · GNM · ANM", color: "bg-red-100 text-red-700", badge: "Healthcare" },
  { icon: BookOpen, name: "B.Pharma & D.Pharma", list: "B.Pharma · D.Pharma · DMLT · BMLT", color: "bg-green-100 text-green-700", badge: "Pharmacy" },
  { icon: BriefcaseBusiness, name: "BBA & MBA", list: "BBA · MBA · BCA · MCA", color: "bg-yellow-100 text-yellow-700", badge: "Business" },
  { icon: Building2, name: "B.Tech & Polytechnic", list: "B.Tech · Polytechnic · ITI", color: "bg-orange-100 text-orange-700", badge: "Engineering" },
  { icon: Sparkles, name: "Postgraduate & Law", list: "M.Sc · M.A · B.L · LLB · Ph.D", color: "bg-purple-100 text-purple-700", badge: "Advanced" },
];

const faqs = [
  ["कौन से universities के साथ काम करते हैं?", "We guide students toward recognised institutions across India and selected international destinations, based on course, budget and eligibility."],
  ["क्या career counselling सच में free है?", "Yes. Your first counselling session and profile review are completely free, with no obligation."],
  ["क्या education loans में help करते हो?", "Yes. We assist eligible students with Bihar Student Credit Card guidance and education-finance documentation."],
  ["Admission के बाद भी support दोगे?", "Absolutely. Our team supports documentation, enrolment coordination and essential post-admission queries."],
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <main className="overflow-hidden bg-white text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white shadow-sm">
        <div className="container-shell flex h-[76px] items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary-blue text-white">
              <GraduationCap size={25} />
            </span>
            <span className="font-headline text-xl font-extrabold tracking-tight">
              SIKSHA<span className="text-primary-red">WALLAH</span>
            </span>
          </a>
          
          <nav className="hidden items-center gap-8 text-sm font-semibold lg:flex">
            <a href="#courses" className="transition hover:text-primary-blue">Courses</a>
            <a href="#features" className="transition hover:text-primary-blue">Features</a>
            <a href="#why-us" className="transition hover:text-primary-blue">Why us</a>
            <a href="#reviews" className="transition hover:text-primary-blue">Success Stories</a>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a href="tel:+916203138576" className="flex items-center gap-2 rounded-lg bg-primary-blue px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700">
              <Phone size={16} /> +91 62031 38576
            </a>
            <a href="#contact" className="rounded-lg bg-primary-red px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-600">
              Free Counselling
            </a>
          </div>

          <button aria-label="Open menu" className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-gray-100 bg-gray-50 px-6 py-6 lg:hidden">
            <div className="flex flex-col gap-4 font-semibold">
              <a href="#courses" onClick={() => setMenuOpen(false)}>Courses</a>
              <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
              <a href="#why-us" onClick={() => setMenuOpen(false)}>Why us</a>
              <a href="#reviews" onClick={() => setMenuOpen(false)}>Success Stories</a>
              <a href="#contact" onClick={() => setMenuOpen(false)} className="rounded-lg bg-primary-red px-4 py-2.5 text-white font-bold">
                Get Counselling
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-blue via-blue-600 to-primary-blue text-white py-16 md:py-28 lg:py-32">
        <div className="container-shell">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_.9fr] items-center">
            <div className="reveal">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">
                <BadgeCheck size={17} className="text-primary-yellow" /> College Chowk, Forbesganj
              </div>
              
              <h1 className="font-headline text-5xl md:text-6xl lg:text-[72px] font-extrabold leading-tight">
                आपका Admission हमारी <span className="text-primary-yellow">जिम्मेदारी</span>
              </h1>
              
              <p className="mt-6 text-lg text-blue-100 max-w-2xl leading-relaxed">
                B.Ed से MBA, D.El.Ed से MBBS - सभी courses के लिए 100% Transparent guidance, Zero hidden charges, Complete support
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a href="#contact" className="flex items-center justify-center gap-2 rounded-lg bg-primary-red px-7 py-4 font-bold text-white shadow-lg shadow-red-950 transition hover:-translate-y-1 hover:bg-red-600">
                  Free Counselling Book करें <ArrowRight size={19} />
                </a>
                <a href="https://wa.me/916203138576" className="flex items-center justify-center gap-2 rounded-lg border-2 border-white bg-transparent px-7 py-4 font-bold text-white transition hover:bg-white/10">
                  WhatsApp करें <MessageCircle size={18} />
                </a>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
                <div>
                  <p className="font-headline text-3xl font-extrabold text-primary-yellow">5,000+</p>
                  <p className="text-sm text-blue-100 mt-1">Students Guided</p>
                </div>
                <div>
                  <p className="font-headline text-3xl font-extrabold text-primary-yellow">200+</p>
                  <p className="text-sm text-blue-100 mt-1">Colleges Partnered</p>
                </div>
                <div>
                  <p className="font-headline text-3xl font-extrabold text-primary-yellow">98%</p>
                  <p className="text-sm text-blue-100 mt-1">Success Rate</p>
                </div>
              </div>
            </div>

            <div className="reveal-delay">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-red via-primary-yellow to-primary-red rounded-2xl opacity-30 blur-xl"></div>
                <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image 
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=90" 
                    alt="Students" 
                    fill 
                    className="object-cover"
                    priority 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-24 bg-gray-50">
        <div className="container-shell">
          <div className="text-center mb-16">
            <p className="text-sm font-bold uppercase tracking-widest text-primary-blue mb-3">सभी courses available</p>
            <h2 className="font-headline text-5xl font-extrabold">कौन सा course आपके लिए सही है?</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map(({ icon: Icon, name, list, color, badge }) => (
              <a key={name} href="#contact" className="card-lift group relative rounded-2xl border-2 border-gray-200 bg-white p-6 transition hover:border-primary-blue">
                <div className={`absolute -top-3 -right-3 ${color} rounded-full px-3 py-1 text-xs font-bold`}>
                  {badge}
                </div>
                
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${color}`}>
                  <Icon size={28} />
                </div>
                
                <h3 className="mt-6 font-headline text-xl font-extrabold">{name}</h3>
                <p className="mt-2 text-sm text-gray-600">{list}</p>
                
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary-blue transition group-hover:translate-x-1">
                  Details देखें <ArrowRight size={16} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why-us" className="py-24 bg-white">
        <div className="container-shell">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="relative">
              <div className="h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-xl">
                <Image 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=90" 
                  alt="Guidance" 
                  fill 
                  className="object-cover"
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-primary-red mb-3">हमारी विशेषता</p>
              <h2 className="font-headline text-5xl font-extrabold mb-8">
                सिर्फ Form भरना नहीं, सही Career चुनना
              </h2>

              <div className="space-y-6">
                {[
                  { icon: ShieldCheck, title: "100% Transparent", desc: "कोई hidden charges नहीं, सब कुछ clear" },
                  { icon: Users, title: "Personal Counsellor", desc: "Admission तक एक dedicated person आपके साथ" },
                  { icon: BadgeCheck, title: "Complete Support", desc: "Form fill करने से लेकर admission तक" },
                ].map(({ icon: Icon, title, desc }, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-red text-white">
                        <Icon size={24} />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-headline font-extrabold text-lg">{title}</h3>
                      <p className="text-gray-600 mt-1">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-24 bg-gradient-to-r from-primary-green to-green-700 text-white">
        <div className="container-shell">
          <div className="text-center mb-16">
            <p className="text-sm font-bold uppercase tracking-widest mb-3 text-green-100">Simple 4-Step Process</p>
            <h2 className="font-headline text-5xl font-extrabold">Admission कैसे मिलता है?</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            {[
              { num: "1️⃣", title: "अपना Goal बताइए", desc: "आपके marks, interest, budget share करें" },
              { num: "2️⃣", title: "Roadmap पाइए", desc: "Best colleges और courses की list मिलेगी" },
              { num: "3️⃣", title: "Application करें", desc: "हम आपके सभी documents handle करेंगे" },
              { num: "4️⃣", title: "Admission पक्का", desc: "Admission तक full support देंगे" },
            ].map((step, idx) => (
              <div key={idx} className="relative">
                {idx < 3 && (
                  <div className="absolute -right-4 top-8 text-white/30 text-4xl font-bold hidden md:block">→</div>
                )}
                <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                  <p className="text-4xl mb-3">{step.num}</p>
                  <h3 className="font-headline font-extrabold text-lg mb-2">{step.title}</h3>
                  <p className="text-green-100 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section id="reviews" className="py-24 bg-gray-50">
        <div className="container-shell">
          <div className="text-center mb-16">
            <p className="text-sm font-bold uppercase tracking-widest text-primary-blue mb-3">Success Stories</p>
            <h2 className="font-headline text-5xl font-extrabold">हजारों Students की Success का सफर</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { quote: "Counsellor ने सब कुछ आसान बना दिया। B.Ed में admission मिल गया बिना tension के।", name: "Priya Kumari", course: "B.Ed Student" },
              { quote: "शुरुआत से आखिर तक सब transparent रहा। मेरे parents भी confident थे।", name: "Aman Raj", course: "B.Pharma Student" },
              { quote: "Nursing में career के लिए confusion था। Perfect guidance मिली यहाँ।", name: "Sakshi Jha", course: "B.Sc Nursing" },
            ].map((story, idx) => (
              <article key={idx} className="rounded-xl border-2 border-gray-200 bg-white p-6 card-lift">
                <div className="flex gap-1 text-primary-yellow">
                  {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                </div>
                <p className="mt-4 text-gray-700 italic">"{story.quote}"</p>
                <div className="mt-6 border-t pt-4">
                  <p className="font-headline font-extrabold">{story.name}</p>
                  <p className="text-sm text-gray-600">{story.course}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 bg-white">
        <div className="container-shell">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-primary-blue mb-3">अक्सर पूछे जाने वाले सवाल</p>
              <h2 className="font-headline text-4xl font-extrabold">कोई सवाल है?</h2>
              <p className="mt-4 text-gray-600">Direct हमसे बात करना चाहते हो?</p>
              <a href="tel:+916203138576" className="mt-6 inline-flex items-center gap-2 font-bold text-primary-blue text-lg">
                <Phone size={20} /> +91 62031 38576
              </a>
            </div>

            <div className="divide-y divide-gray-200 border border-gray-200 rounded-xl">
              {faqs.map(([q, a], i) => (
                <div key={q} className="p-5">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                    className="flex w-full items-center justify-between gap-4 text-left font-headline font-extrabold text-lg"
                  >
                    <span className="text-gray-900">{q}</span>
                    <ChevronDown
                      className={`flex-shrink-0 transition text-primary-blue ${openFaq === i ? "rotate-180" : ""}`}
                      size={24}
                    />
                  </button>
                  {openFaq === i && <p className="pt-4 text-gray-600 leading-relaxed text-sm">{a}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-24 bg-gradient-to-r from-primary-red via-red-600 to-primary-red text-white">
        <div className="container-shell">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest mb-3 text-red-100">अभी शुरू करें</p>
              <h2 className="font-headline text-5xl font-extrabold mb-6">अपना Admission Plan बनाइए - Free</h2>
              <p className="text-lg text-red-100 mb-8 leading-relaxed">
                हमारे Counsellor को call करेंगे, वो आपको best options देंगे। कोई खर्च नहीं, कोई obligation नहीं।
              </p>
              
              <div className="flex flex-wrap gap-6 text-sm font-bold mb-8 pb-8 border-b border-white/30">
                <span className="flex gap-2 items-center"><MapPin size={20} /> College Chowk, Forbesganj</span>
                <span className="flex gap-2 items-center"><Phone size={20} /> +91 62031 38576</span>
              </div>

              <div className="space-y-3">
                <a href="tel:+916203138576" className="block w-full text-center rounded-lg bg-white px-6 py-4 font-bold text-primary-red transition hover:bg-gray-100">
                  Call करें (Free Counselling)
                </a>
                <a href="https://wa.me/916203138576" className="block w-full text-center rounded-lg border-2 border-white bg-transparent px-6 py-4 font-bold text-white transition hover:bg-white/10">
                  WhatsApp पर Chat करें
                </a>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); alert("Thank you! Our counsellor will contact you shortly."); }} className="rounded-2xl bg-white p-8 text-gray-900 shadow-2xl">
              <h3 className="font-headline text-2xl font-extrabold mb-6">Quick Registration</h3>
              <div className="space-y-4">
                <input
                  required
                  placeholder="पूरा नाम"
                  className="w-full rounded-lg border-2 border-gray-200 px-4 py-3.5 outline-none focus:border-primary-blue"
                />
                <input
                  required
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full rounded-lg border-2 border-gray-200 px-4 py-3.5 outline-none focus:border-primary-blue"
                />
                <select className="w-full rounded-lg border-2 border-gray-200 px-4 py-3.5 text-gray-600 outline-none focus:border-primary-blue bg-white">
                  <option value="">कौन सा course सूझ रहा है?</option>
                  <option>B.Ed / D.El.Ed</option>
                  <option>B.Sc Nursing / GNM</option>
                  <option>B.Pharma / D.Pharma</option>
                  <option>BBA / MBA</option>
                  <option>B.Tech / Polytechnic</option>
                  <option>अभी decide नहीं किया</option>
                </select>
                <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary-blue px-6 py-4 font-bold text-white transition hover:bg-blue-700">
                  Free Counselling Book करें <ArrowRight size={18} />
                </button>
              </div>
              <p className="mt-4 text-center text-xs text-gray-500">We won't spam. Promise.</p>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container-shell">
          <div className="grid gap-8 md:grid-cols-4 mb-8 pb-8 border-b border-gray-800">
            <div>
              <div className="flex items-center gap-2 text-white font-headline font-extrabold text-lg mb-4">
                <GraduationCap size={24} className="text-primary-blue" />
                SIKSHA<span className="text-primary-red">WALLAH</span>
              </div>
              <p className="text-sm text-gray-500">Trusted admission guidance for 5,000+ students.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#courses" className="hover:text-white transition">Courses</a></li>
                <li><a href="#why-us" className="hover:text-white transition">Why Us</a></li>
                <li><a href="#reviews" className="hover:text-white transition">Success Stories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="tel:+916203138576" className="hover:text-white transition">+91 62031 38576</a></li>
                <li><a href="https://wa.me/916203138576" className="hover:text-white transition">WhatsApp</a></li>
                <li>College Chowk, Forbesganj</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Available Courses</h4>
              <p className="text-sm">B.Ed, D.El.Ed, B.Sc Nursing, B.Pharma, BBA, MBA, और 50+ और courses...</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-6 text-sm text-gray-500">
            <p>© 2026 Siksha Wallah Hub. All rights reserved.</p>
            <p>Trusted admission partner for Indian students</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/916203138576"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-2xl transition hover:scale-110 hover:bg-green-600"
      >
        <MessageCircle size={28} fill="currentColor" />
      </a>
    </main>
  );
}
