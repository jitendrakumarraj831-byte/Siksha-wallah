"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BellRing, Bot, CalendarCheck, ChartNoAxesCombined, CheckCircle2, CircleDollarSign, ClipboardCheck, CloudUpload, CreditCard, FileCheck2, Gauge, GraduationCap, Languages, MessageSquareText, PlayCircle, SearchCheck, ShieldCheck, Smartphone, UserRoundCheck, Video } from "lucide-react";

const updates = [
  "Admissions Open 2026 — Apply early for your preferred college and course",
  "Free Career Counselling — Personalised guidance from admission experts",
  "Bihar Student Credit Card — Eligibility and documentation assistance available",
  "Scholarship Support — Guidance for eligible government and private schemes",
];
const notices = [
  ["ADMISSION","B.Ed, D.El.Ed, Nursing and Pharmacy admissions are now open"],
  ["COUNSELLING","Book your free one-to-one career counselling session"],
  ["DOCUMENTS","Upload documents and track verification status online"],
  ["FINANCE","Get education loan and Student Credit Card assistance"],
];
const features = [
  [SearchCheck,"Course & College Finder","Compare programmes, fees, eligibility and institutions.","/portal/courses"],
  [Bot,"AI Course Recommendation","Smart suggestions based on profile and career goals.","/portal/counselling"],
  [UserRoundCheck,"Student Dashboard","Applications, counselling and updates in one place.","/student-dashboard"],
  [ClipboardCheck,"Application Tracking","Follow every stage from enquiry to admission.","/student-dashboard"],
  [CloudUpload,"Secure Document Upload","Manage marksheets, ID and certificates securely.","/portal/admission"],
  [CreditCard,"Online Fee & Receipts","Digital payments, receipts and payment history.","/student-dashboard"],
  [CalendarCheck,"Counselling Booking","Select a convenient date and time with an expert.","/portal/counselling"],
  [MessageSquareText,"Notices & Alerts","Important deadlines and progress notifications.","/portal/notices"],
  [CircleDollarSign,"Scholarship & Loan Support","Scholarship, loan and credit-card guidance.","/portal/counselling"],
  [Video,"Online Learning","Classes, notes, quizzes and learning resources.","/portal/learning"],
  [FileCheck2,"Results & Certificates","Assessment progress, results and certificates.","/student-dashboard"],
  [Languages,"Hindi & English Support","Easy experience for students and parents.","/portal/counselling"],
] as const;

export function ImportantUpdates(){
 const [active,setActive]=useState(0);
 useEffect(()=>{const timer=window.setInterval(()=>setActive(x=>(x+1)%updates.length),3500);return()=>clearInterval(timer)},[]);
 return <div className="relative z-50 overflow-hidden bg-[#1357e6] text-white"><div className="container-shell flex min-h-11 items-center gap-3 py-2 text-xs sm:text-sm"><span className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 font-extrabold uppercase"><BellRing size={14}/> Important</span><div className="relative h-6 flex-1 overflow-hidden font-semibold">{updates.map((text,i)=><p key={text} className={`absolute inset-0 flex items-center transition-all duration-500 ${active===i?"translate-y-0 opacity-100":"translate-y-5 opacity-0"}`}>{text}</p>)}</div><div className="hidden gap-1 sm:flex">{updates.map((_,i)=><button key={i} aria-label={`Update ${i+1}`} onClick={()=>setActive(i)} className={`h-1.5 rounded-full ${active===i?"w-5 bg-white":"w-1.5 bg-white/40"}`}/>)}</div></div></div>
}

export function EducationPlatform(){
 const [active,setActive]=useState(0);
 useEffect(()=>{const timer=window.setInterval(()=>setActive(x=>(x+1)%notices.length),4200);return()=>clearInterval(timer)},[]);
 return <>
  <section className="border-y border-slate-200 bg-white py-4"><div className="container-shell flex items-center gap-4"><b className="hidden shrink-0 items-center gap-2 text-sm sm:flex"><BellRing size={18} className="text-[#1357e6]"/> Latest update</b><div className="relative h-12 flex-1 overflow-hidden">{notices.map(([tag,text],i)=><div key={text} className={`absolute inset-0 flex items-center transition-all duration-500 ${active===i?"translate-x-0 opacity-100":"translate-x-10 opacity-0"}`}><p className="truncate text-sm font-semibold"><span className="mr-3 rounded-md bg-blue-50 px-2 py-1 text-[10px] font-extrabold text-[#1357e6]">{tag}</span>{text}</p></div>)}</div><Link href="/portal/notices" className="hidden shrink-0 text-xs font-extrabold text-[#1357e6] sm:block">View all notices</Link></div></section>
  <section id="features" className="bg-white py-24"><div className="container-shell"><div className="mx-auto max-w-3xl text-center"><p className="mb-3 text-sm font-extrabold uppercase tracking-[.2em] text-[#1357e6]">Complete digital education platform</p><h2 className="font-display text-4xl font-extrabold sm:text-5xl">Everything a student needs, in one trusted place.</h2><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">Choose a course, apply, track progress, manage documents and continue learning through connected student services.</p></div><div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{features.map(([Icon,title,text,href])=><Link href={href} key={title} className="card-lift group rounded-2xl border border-slate-200 bg-white p-6"><div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-[#1357e6] group-hover:bg-[#1357e6] group-hover:text-white"><Icon size={23}/></div><h3 className="mt-5 font-display text-lg font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p><span className="mt-5 flex items-center gap-2 text-xs font-extrabold text-[#1357e6]">Open feature <ArrowRight size={14}/></span></Link>)}</div></div></section>
  <section className="bg-[#f6f8fc] py-24"><div className="container-shell grid items-center gap-14 lg:grid-cols-[.9fr_1.1fr]"><div><p className="mb-3 text-sm font-extrabold uppercase tracking-[.2em] text-[#1357e6]">Student portal</p><h2 className="font-display text-4xl font-extrabold sm:text-5xl">Your complete journey—always visible.</h2><p className="mt-5 text-lg leading-8 text-slate-600">Manage applications, documents, payment receipts, classes, counselling and notifications from any device.</p><div className="mt-8 grid gap-3 sm:grid-cols-2">{["Live application status","Document verification","Payment history & receipts","Class notes and videos","Counselling schedule","Instant notifications"].map(x=><div key={x} className="flex items-center gap-2 text-sm font-bold"><CheckCircle2 size={18} className="text-emerald-500"/>{x}</div>)}</div><div className="mt-9 flex flex-wrap gap-3"><Link href="/portal/admission" className="inline-flex items-center gap-2 rounded-xl bg-[#1357e6] px-6 py-4 font-extrabold text-white">Start application <ArrowRight size={18}/></Link><Link href="/student-login" className="rounded-xl border border-slate-300 bg-white px-6 py-4 font-extrabold">Student login</Link></div></div><div className="soft-shadow overflow-hidden rounded-[28px] border bg-white p-3"><div className="rounded-[20px] bg-[#07152f] p-5 text-white"><div className="flex justify-between"><div><p className="text-xs text-slate-400">Welcome back</p><p className="font-display text-lg font-extrabold">Student Dashboard</p></div><span className="grid h-10 w-10 place-items-center rounded-full bg-[#1357e6]"><GraduationCap size={20}/></span></div><div className="mt-6 grid grid-cols-3 gap-3">{[[Gauge,"75%","Profile"],[FileCheck2,"4/5","Documents"],[ChartNoAxesCombined,"03","Applications"]].map(([Icon,value,label]:any)=><div key={label} className="rounded-xl bg-white/10 p-3"><Icon size={17} className="text-[#67c8ff]"/><p className="mt-3 font-display text-xl font-extrabold">{value}</p><p className="text-[10px] text-slate-400">{label}</p></div>)}</div></div><div className="grid gap-3 p-4 sm:grid-cols-2">{[[PlayCircle,"Continue learning","Career Planning: Lesson 04"],[Smartphone,"Next counselling","Tomorrow · 11:30 AM"],[ShieldCheck,"Documents verified","4 documents approved"],[CircleDollarSign,"Payment status","Admission fee pending"]].map(([Icon,title,text]:any)=><div key={title} className="rounded-xl border p-4"><div className="flex gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-[#1357e6]"><Icon size={18}/></span><div><p className="text-sm font-extrabold">{title}</p><p className="mt-1 text-xs text-slate-500">{text}</p></div></div></div>)}</div></div></div></section>
 </>
}
