"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight, BellRing, BookOpenCheck, Bot, CalendarCheck, ChartNoAxesCombined,
  CheckCircle2, CircleDollarSign, ClipboardCheck, CloudUpload, CreditCard,
  FileCheck2, Gauge, GraduationCap, Languages, Laptop, MessageSquareText,
  PlayCircle, SearchCheck, ShieldCheck, Smartphone, Sparkles, UserRoundCheck,
  UsersRound, Video,
} from "lucide-react";

const importantUpdates = [
  "Admissions Open 2026 — Apply early for your preferred college and course",
  "Free Career Counselling — Personalised guidance from admission experts",
  "Bihar Student Credit Card — Eligibility and documentation assistance available",
  "Scholarship Support — Get guidance for eligible government and private schemes",
];

const notices = [
  { tag: "ADMISSION", text: "B.Ed, D.El.Ed, Nursing and Pharmacy admissions are now open", date: "Apply Now" },
  { tag: "COUNSELLING", text: "Book your free one-to-one career counselling session", date: "Free Session" },
  { tag: "DOCUMENTS", text: "Upload documents securely and track verification status online", date: "Student Portal" },
  { tag: "FINANCE", text: "Get education loan and Student Credit Card assistance", date: "Check Eligibility" },
];

const features = [
  { icon: SearchCheck, title: "Course & College Finder", text: "Search courses, compare institutions, fees, eligibility and duration." },
  { icon: Bot, title: "AI Course Recommendation", text: "Smart suggestions based on marks, interests, budget and career goals." },
  { icon: UserRoundCheck, title: "Student Dashboard", text: "One place for profile, applications, counselling and admission updates." },
  { icon: ClipboardCheck, title: "Application Tracking", text: "Follow every stage from enquiry and documents to confirmed admission." },
  { icon: CloudUpload, title: "Secure Document Upload", text: "Upload marksheets, ID proof, photographs and certificates securely." },
  { icon: CreditCard, title: "Online Fee Payment", text: "Simple digital payments with downloadable receipts and payment history." },
  { icon: CalendarCheck, title: "Counselling Booking", text: "Choose a convenient date and time for a call or office consultation." },
  { icon: MessageSquareText, title: "WhatsApp, SMS & Email", text: "Automatic reminders for deadlines, payments and application progress." },
  { icon: CircleDollarSign, title: "Scholarship & Loan Support", text: "Eligibility guidance for scholarships, loans and Student Credit Card." },
  { icon: Video, title: "Online Learning", text: "Recorded classes, live sessions, notes, quizzes and learning resources." },
  { icon: FileCheck2, title: "Results & Certificates", text: "Track assessments, results and downloadable course certificates." },
  { icon: Languages, title: "Hindi & English", text: "Easy bilingual experience for students and parents across devices." },
];

export function ImportantUpdates() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActive((current) => (current + 1) % importantUpdates.length), 3500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative z-50 overflow-hidden bg-[#1357e6] text-white">
      <div className="container-shell flex min-h-11 items-center gap-3 py-2 text-xs sm:text-sm">
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 font-extrabold uppercase tracking-wider">
          <BellRing size={14} /> Important
        </span>
        <div className="relative h-6 flex-1 overflow-hidden font-semibold">
          {importantUpdates.map((message, index) => (
            <p key={message} className={`absolute inset-0 flex items-center transition-all duration-500 ${active === index ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}>
              {message}
            </p>
          ))}
        </div>
        <div className="hidden gap-1 sm:flex">
          {importantUpdates.map((_, index) => <button key={index} aria-label={`Show update ${index + 1}`} onClick={() => setActive(index)} className={`h-1.5 rounded-full transition-all ${active === index ? "w-5 bg-white" : "w-1.5 bg-white/40"}`} />)}
        </div>
      </div>
    </div>
  );
}

export function EducationPlatform() {
  const [notice, setNotice] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setNotice((current) => (current + 1) % notices.length), 4200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <>
      <section className="border-y border-slate-200 bg-white py-4">
        <div className="container-shell flex items-center gap-4">
          <span className="hidden shrink-0 items-center gap-2 font-display text-sm font-extrabold text-[#07152f] sm:flex"><BellRing size={18} className="text-[#1357e6]" /> Latest update</span>
          <div className="relative h-12 flex-1 overflow-hidden">
            {notices.map((item, index) => (
              <div key={item.text} className={`absolute inset-0 flex items-center justify-between gap-4 transition-all duration-500 ${notice === index ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}>
                <p className="truncate text-sm font-semibold"><span className="mr-3 rounded-md bg-blue-50 px-2 py-1 text-[10px] font-extrabold text-[#1357e6]">{item.tag}</span>{item.text}</p>
                <a href="#contact" className="hidden shrink-0 items-center gap-1 text-xs font-extrabold text-[#1357e6] sm:flex">{item.date} <ArrowRight size={14} /></a>
              </div>
            ))}
          </div>
          <div className="flex shrink-0 gap-1.5">{notices.map((_, index) => <button key={index} aria-label={`Show notice ${index + 1}`} onClick={() => setNotice(index)} className={`h-2 rounded-full transition-all ${notice === index ? "w-6 bg-[#1357e6]" : "w-2 bg-slate-300"}`} />)}</div>
        </div>
      </section>

      <section id="features" className="bg-white py-24">
        <div className="container-shell">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-extrabold uppercase tracking-[.2em] text-[#1357e6]">Complete digital education platform</p>
            <h2 className="font-display text-4xl font-extrabold sm:text-5xl">Everything a student needs, in one trusted place.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">From choosing a course to completing admission, payments and learning—Siksha Wallah keeps the entire journey clear and connected.</p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <article key={title} className="card-lift group rounded-2xl border border-slate-200 bg-white p-6">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-[#1357e6] transition group-hover:bg-[#1357e6] group-hover:text-white"><Icon size={23} /></div>
                <h3 className="mt-5 font-display text-lg font-extrabold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
                <div className="mt-5 flex items-center gap-2 text-xs font-bold text-emerald-600"><CheckCircle2 size={15} /> Available in student portal</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f6f8fc] py-24">
        <div className="container-shell grid items-center gap-14 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="mb-3 text-sm font-extrabold uppercase tracking-[.2em] text-[#1357e6]">Student portal</p>
            <h2 className="font-display text-4xl font-extrabold sm:text-5xl">Your complete admission journey—always visible.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">Students can manage applications, upload documents, view payment receipts, join classes and receive important updates from any device.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {["Live application status", "Document verification", "Payment history & receipts", "Class notes and videos", "Counselling schedule", "Instant notifications"].map((item) => <div key={item} className="flex items-center gap-2 text-sm font-bold"><CheckCircle2 size={18} className="text-emerald-500" />{item}</div>)}
            </div>
            <a href="#contact" className="mt-9 inline-flex items-center gap-2 rounded-xl bg-[#1357e6] px-6 py-4 font-extrabold text-white">Start your application <ArrowRight size={18} /></a>
          </div>
          <div className="soft-shadow overflow-hidden rounded-[28px] border border-slate-200 bg-white p-3">
            <div className="rounded-[20px] bg-[#07152f] p-5 text-white">
              <div className="flex items-center justify-between"><div><p className="text-xs text-slate-400">Welcome back</p><p className="font-display text-lg font-extrabold">Student Dashboard</p></div><span className="grid h-10 w-10 place-items-center rounded-full bg-[#1357e6]"><GraduationCap size={20} /></span></div>
              <div className="mt-6 grid grid-cols-3 gap-3">{[[Gauge,"75%","Profile"],[FileCheck2,"4/5","Documents"],[ChartNoAxesCombined,"03","Applications"]].map(([Icon,value,label]: any) => <div key={label} className="rounded-xl bg-white/10 p-3"><Icon size={17} className="text-[#67c8ff]"/><p className="mt-3 font-display text-xl font-extrabold">{value}</p><p className="text-[10px] text-slate-400">{label}</p></div>)}</div>
            </div>
            <div className="grid gap-3 p-4 sm:grid-cols-2">{[[PlayCircle,"Continue learning","Career Planning: Lesson 04"],[Smartphone,"Next counselling","Tomorrow · 11:30 AM"],[ShieldCheck,"Documents verified","4 documents approved"],[CircleDollarSign,"Payment status","Admission fee pending"]].map(([Icon,title,text]: any) => <div key={title} className="rounded-xl border border-slate-200 p-4"><div className="flex gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-[#1357e6]"><Icon size={18}/></span><div><p className="text-sm font-extrabold">{title}</p><p className="mt-1 text-xs text-slate-500">{text}</p></div></div></div>)}</div>
          </div>
        </div>
      </section>
    </>
  );
}
