"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ArrowRight, BadgeCheck, BookOpen, BriefcaseBusiness, Building2, Check,
  ChevronDown, CircleCheckBig, GraduationCap, HeartPulse, MapPin, Menu,
  MessageCircle, Phone, Play, Quote, ShieldCheck, Sparkles, Star, Users, X,
} from "lucide-react";

const courses = [
  { icon: GraduationCap, name: "Teaching & Education", list: "B.Ed · D.El.Ed · M.Ed", color: "bg-blue-50 text-blue-700" },
  { icon: HeartPulse, name: "Medical & Nursing", list: "MBBS · B.Sc Nursing · GNM · ANM", color: "bg-rose-50 text-rose-600" },
  { icon: BookOpen, name: "Pharmacy & Paramedical", list: "B.Pharm · D.Pharm · DMLT · BMLT", color: "bg-emerald-50 text-emerald-700" },
  { icon: BriefcaseBusiness, name: "Management & IT", list: "BBA · MBA · BCA · MCA", color: "bg-amber-50 text-amber-700" },
  { icon: Building2, name: "Engineering & Diploma", list: "B.Tech · Polytechnic · ITI", color: "bg-violet-50 text-violet-700" },
  { icon: Sparkles, name: "Higher Studies", list: "UG · PG · Ph.D · LAW", color: "bg-cyan-50 text-cyan-700" },
];

const faqs = [
  ["Which universities and colleges do you work with?", "We guide students toward recognised institutions across India and selected international destinations, based on course, budget and eligibility."],
  ["Is career counselling really free?", "Yes. Your first counselling session and profile review are completely free, with no obligation."],
  ["Do you help with education loans?", "Yes. We assist eligible students with Bihar Student Credit Card guidance and education-finance documentation."],
  ["Can you help after admission?", "Absolutely. Our team supports documentation, enrolment coordination and essential post-admission queries."],
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <main className="overflow-hidden bg-white text-[#07152f]">
      <div className="bg-[#07152f] py-2.5 text-center text-xs font-semibold text-white sm:text-sm">
        <span className="text-[#67c8ff]">Admissions open 2026</span> · Free profile evaluation and career counselling
      </div>

      <header className="absolute left-0 right-0 z-40 border-b border-white/10 text-white">
        <div className="container-shell flex h-[76px] items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-[#1357e6]"><GraduationCap size={25} /></span>
            <span className="font-display text-xl font-extrabold tracking-tight">SIKSHA<span className="text-[#67c8ff]">WALLAH</span></span>
          </a>
          <nav className="hidden items-center gap-8 text-sm font-semibold lg:flex">
            <a href="#courses" className="transition hover:text-[#67c8ff]">Courses</a>
            <a href="#why-us" className="transition hover:text-[#67c8ff]">Why us</a>
            <a href="#process" className="transition hover:text-[#67c8ff]">How it works</a>
            <a href="#reviews" className="transition hover:text-[#67c8ff]">Success stories</a>
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <a href="tel:+916203138576" className="flex items-center gap-2 text-sm font-bold"><Phone size={16} /> +91 62031 38576</a>
            <a href="#contact" className="rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-[#07152f] transition hover:bg-[#67c8ff]">Get counselling</a>
          </div>
          <button aria-label="Open menu" className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
        {menuOpen && <div className="border-t border-white/10 bg-[#07152f] px-6 py-6 lg:hidden"><div className="flex flex-col gap-5 font-semibold"><a href="#courses" onClick={() => setMenuOpen(false)}>Courses</a><a href="#why-us" onClick={() => setMenuOpen(false)}>Why us</a><a href="#process" onClick={() => setMenuOpen(false)}>How it works</a><a href="#contact" onClick={() => setMenuOpen(false)}>Contact us</a></div></div>}
      </header>

      <section className="hero-grid relative bg-[#07152f] pb-24 pt-32 text-white lg:min-h-[820px] lg:pb-28 lg:pt-40">
        <div className="absolute -right-32 top-20 h-[520px] w-[520px] rounded-full bg-[#1357e6]/30 blur-[120px]" />
        <div className="container-shell relative grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
          <div className="reveal max-w-3xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold"><BadgeCheck size={17} className="text-[#67c8ff]" /> Trusted admission guidance in Forbesganj</div>
            <h1 className="font-display text-5xl font-extrabold leading-[1.04] sm:text-6xl lg:text-[76px]">Your ambition deserves the <span className="text-[#67c8ff]">right direction.</span></h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">Personalised counselling, verified colleges and complete admission support—so you can choose your future with clarity and confidence.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#contact" className="flex items-center justify-center gap-2 rounded-xl bg-[#1357e6] px-7 py-4 font-extrabold shadow-lg shadow-blue-950 transition hover:-translate-y-1 hover:bg-blue-500">Book free counselling <ArrowRight size={19} /></a>
              <a href="#courses" className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-4 font-bold transition hover:bg-white/10"><Play size={18} fill="currentColor" /> Explore courses</a>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-slate-300"><span className="flex gap-2"><Check className="text-[#67c8ff]" size={18} /> No hidden charges</span><span className="flex gap-2"><Check className="text-[#67c8ff]" size={18} /> Verified institutions</span><span className="flex gap-2"><Check className="text-[#67c8ff]" size={18} /> End-to-end support</span></div>
          </div>

          <div className="reveal-delay relative mx-auto w-full max-w-[510px]">
            <div className="glass-card relative overflow-hidden rounded-[32px] p-3">
              <div className="relative h-[500px] overflow-hidden rounded-[24px] sm:h-[560px]">
                <Image src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=90" alt="Students planning their education" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07152f] via-transparent to-transparent" />
                <div className="absolute bottom-0 p-7"><div className="mb-3 flex text-amber-400"><Star fill="currentColor" size={17}/><Star fill="currentColor" size={17}/><Star fill="currentColor" size={17}/><Star fill="currentColor" size={17}/><Star fill="currentColor" size={17}/></div><p className="font-display text-2xl font-bold">“The right course changed everything.”</p><p className="mt-2 text-sm text-slate-300">Join thousands of students building a better future.</p></div>
              </div>
            </div>
            <div className="absolute -left-5 top-14 rounded-2xl bg-white p-4 text-[#07152f] shadow-2xl"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><CircleCheckBig size={22}/></span><div><b className="block text-sm">Admission confirmed</b><span className="text-xs text-slate-500">Complete guidance</span></div></div></div>
            <div className="absolute -bottom-6 right-4 rounded-2xl bg-[#1357e6] p-5 shadow-2xl"><p className="text-3xl font-extrabold">5,000+</p><p className="text-xs font-semibold text-blue-100">students guided</p></div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-white py-8">
        <div className="container-shell grid grid-cols-2 gap-7 md:grid-cols-4">
          {[["5,000+","Students guided"],["200+","Partner institutions"],["98%","Student satisfaction"],["15+","Years of trust"]].map(([value,label]) => <div key={label} className="text-center md:border-r md:last:border-0"><p className="font-display text-3xl font-extrabold text-[#1357e6] sm:text-4xl">{value}</p><p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500 sm:text-sm">{label}</p></div>)}
        </div>
      </section>

      <section id="courses" className="bg-[#f6f8fc] py-24">
        <div className="container-shell">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="mb-3 text-sm font-extrabold uppercase tracking-[.2em] text-[#1357e6]">Find your path</p><h2 className="font-display max-w-2xl text-4xl font-extrabold sm:text-5xl">Courses for every kind of ambition.</h2></div><p className="max-w-md text-slate-600">Explore regular and distance programmes with expert support at every decision point.</p></div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {courses.map(({icon:Icon,name,list,color}) => <a href="#contact" key={name} className="card-lift group rounded-2xl border border-slate-200 bg-white p-6"><div className={`grid h-12 w-12 place-items-center rounded-xl ${color}`}><Icon size={23}/></div><h3 className="mt-6 font-display text-xl font-extrabold">{name}</h3><p className="mt-2 text-sm text-slate-500">{list}</p><span className="mt-6 flex items-center gap-2 text-sm font-extrabold text-[#1357e6]">View programmes <ArrowRight size={16} className="transition group-hover:translate-x-1"/></span></a>)}
          </div>
        </div>
      </section>

      <section id="why-us" className="py-24">
        <div className="container-shell grid items-center gap-16 lg:grid-cols-2">
          <div className="relative"><div className="relative h-[560px] overflow-hidden rounded-[30px]"><Image src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=90" alt="Students receiving career guidance" fill className="object-cover" /></div><div className="soft-shadow absolute -bottom-7 -right-3 max-w-xs rounded-2xl bg-white p-6 sm:-right-8"><Quote className="mb-3 text-[#1357e6]"/><p className="font-display font-bold">Education decisions are life decisions. We treat them with that seriousness.</p></div></div>
          <div><p className="mb-3 text-sm font-extrabold uppercase tracking-[.2em] text-[#1357e6]">Guidance that puts you first</p><h2 className="font-display text-4xl font-extrabold sm:text-5xl">More clarity. Less confusion. Better choices.</h2><p className="mt-6 text-lg leading-8 text-slate-600">We do more than fill forms. We understand your goals, assess your profile and recommend realistic pathways that match your aspirations and budget.</p><div className="mt-9 space-y-6">{[[ShieldCheck,"Verified options","Transparent information about recognition, eligibility and fees."],[Users,"Personal counsellor","One dedicated expert from first conversation to enrolment."],[BadgeCheck,"Complete support","Applications, documentation, finance guidance and follow-up."]].map(([Icon,title,text]: any) => <div key={title} className="flex gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#1357e6]"><Icon size={22}/></span><div><h3 className="font-display font-extrabold">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-500">{text}</p></div></div>)}</div></div>
        </div>
      </section>

      <section id="process" className="bg-[#07152f] py-24 text-white">
        <div className="container-shell"><div className="text-center"><p className="mb-3 text-sm font-extrabold uppercase tracking-[.2em] text-[#67c8ff]">Simple, transparent process</p><h2 className="font-display text-4xl font-extrabold sm:text-5xl">From uncertainty to admission.</h2></div><div className="mt-14 grid gap-6 md:grid-cols-4">{[["01","Tell us your goal","Share your interests, marks and preferred budget."],["02","Get your roadmap","Receive shortlisted courses and verified institutions."],["03","Apply with confidence","We organise documents and coordinate applications."],["04","Begin your journey","Complete enrolment with continued support from us."]].map(([n,t,d]) => <div key={n} className="rounded-2xl border border-white/10 bg-white/5 p-6"><span className="font-display text-4xl font-extrabold text-[#67c8ff]">{n}</span><h3 className="mt-8 font-display text-lg font-extrabold">{t}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{d}</p></div>)}</div></div>
      </section>

      <section id="reviews" className="bg-[#f6f8fc] py-24"><div className="container-shell"><div className="text-center"><p className="mb-3 text-sm font-extrabold uppercase tracking-[.2em] text-[#1357e6]">Student stories</p><h2 className="font-display text-4xl font-extrabold sm:text-5xl">Real journeys. Real confidence.</h2></div><div className="mt-12 grid gap-6 md:grid-cols-3">{[["The counsellor explained every option patiently. I got admission in B.Ed without the stress I expected.","Priya Kumari","B.Ed Student"],["They were transparent about fees and documents from day one. My family always knew what was happening.","Aman Raj","B.Pharm Student"],["I was confused between nursing and paramedical. Their guidance helped me choose a path that fits me.","Sakshi Jha","B.Sc Nursing Student"]].map(([quote,name,course]) => <article key={name} className="rounded-2xl border border-slate-200 bg-white p-7"><div className="flex text-amber-400">{[1,2,3,4,5].map(x=><Star key={x} size={16} fill="currentColor"/>)}</div><p className="mt-6 leading-7 text-slate-600">“{quote}”</p><div className="mt-7 border-t pt-5"><p className="font-display font-extrabold">{name}</p><p className="text-sm text-slate-500">{course}</p></div></article>)}</div></div></section>

      <section className="py-24"><div className="container-shell grid gap-14 lg:grid-cols-2"><div><p className="mb-3 text-sm font-extrabold uppercase tracking-[.2em] text-[#1357e6]">Common questions</p><h2 className="font-display text-4xl font-extrabold sm:text-5xl">Everything you need to know.</h2><p className="mt-5 max-w-md text-slate-600">Still have a question? Speak directly with our counselling team.</p><a href="tel:+916203138576" className="mt-7 inline-flex items-center gap-2 font-extrabold text-[#1357e6]"><Phone size={18}/> Call +91 62031 38576</a></div><div className="divide-y divide-slate-200">{faqs.map(([q,a],i)=><div key={q} className="py-5"><button onClick={()=>setOpenFaq(openFaq===i?-1:i)} className="flex w-full items-center justify-between gap-4 text-left font-display font-extrabold"><span>{q}</span><ChevronDown className={`shrink-0 transition ${openFaq===i?"rotate-180":""}`} size={20}/></button>{openFaq===i&&<p className="pt-4 text-sm leading-7 text-slate-600">{a}</p>}</div>)}</div></div></section>

      <section id="contact" className="bg-[#1357e6] py-20 text-white"><div className="container-shell grid items-center gap-12 lg:grid-cols-[1fr_.8fr]"><div><p className="mb-3 text-sm font-extrabold uppercase tracking-[.2em] text-blue-200">Your next step starts here</p><h2 className="font-display text-4xl font-extrabold sm:text-5xl">Let’s build your education plan—free.</h2><p className="mt-5 max-w-xl text-lg text-blue-100">Tell us where you want to go. Our counsellor will call you with clear, personalised options.</p><div className="mt-8 flex flex-wrap gap-5 text-sm font-bold"><span className="flex gap-2"><MapPin size={19}/> College Chowk, Forbesganj</span><span className="flex gap-2"><Phone size={19}/> +91 62031 38576</span></div></div><form onSubmit={(e)=>{e.preventDefault(); alert("Thank you! Our counsellor will contact you shortly.")}} className="rounded-2xl bg-white p-6 text-[#07152f] shadow-2xl"><h3 className="font-display text-xl font-extrabold">Request a callback</h3><div className="mt-5 space-y-3"><input required aria-label="Full name" placeholder="Full name" className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-[#1357e6]"/><input required aria-label="Phone number" type="tel" placeholder="Phone number" className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-[#1357e6]"/><select aria-label="Course interest" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-slate-500 outline-none focus:border-[#1357e6]"><option>Course you are interested in</option><option>Teaching & Education</option><option>Medical & Nursing</option><option>Pharmacy & Paramedical</option><option>Management & IT</option></select><button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#07152f] px-5 py-4 font-extrabold text-white transition hover:bg-slate-800">Get free counselling <ArrowRight size={18}/></button></div><p className="mt-3 text-center text-xs text-slate-400">Your information stays private with us.</p></form></div></section>

      <footer className="bg-[#050f22] py-12 text-slate-400"><div className="container-shell flex flex-col justify-between gap-8 border-b border-white/10 pb-10 md:flex-row"><div className="max-w-sm"><div className="flex items-center gap-3 text-white"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[#1357e6]"><GraduationCap size={23}/></span><span className="font-display text-lg font-extrabold">SIKSHA<span className="text-[#67c8ff]">WALLAH</span></span></div><p className="mt-4 text-sm leading-6">Trusted admission and career guidance for students who want to make informed, confident choices.</p></div><div className="flex flex-wrap gap-x-12 gap-y-4 text-sm font-semibold"><a href="#courses">Courses</a><a href="#why-us">About us</a><a href="#reviews">Success stories</a><a href="#contact">Contact</a></div></div><div className="container-shell flex flex-col justify-between gap-3 pt-7 text-xs sm:flex-row"><p>© 2026 Siksha Wallah Hub. All rights reserved.</p><p>Built for better student outcomes.</p></div></footer>

      <a href="https://wa.me/916203138576" aria-label="Chat on WhatsApp" className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#20b45a] text-white shadow-2xl transition hover:scale-110"><MessageCircle size={25} fill="currentColor"/></a>
    </main>
  );
}
