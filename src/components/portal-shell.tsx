"use client";

import Link from "next/link";
import { useState } from "react";
import { GraduationCap, Menu, Phone, X } from "lucide-react";

const links = [
  ["Courses", "/portal/courses"], ["Colleges", "/portal/colleges"],
  ["Admission", "/portal/admission"], ["Notices", "/portal/notices"],
  ["Counselling", "/portal/counselling"], ["Learning", "/portal/learning"],
];

export function PortalShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return <div className="min-h-screen bg-[#f6f8fc] text-[#07152f]">
    <div className="bg-[#1357e6] py-2 text-center text-xs font-bold text-white">Admissions Open 2026 · Free counselling: +91 62031 38576</div>
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-shell flex h-[74px] items-center justify-between">
        <Link href="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#1357e6] text-white"><GraduationCap size={22}/></span><span className="font-display text-lg font-extrabold">SIKSHA<span className="text-[#1357e6]">WALLAH</span></span></Link>
        <nav className="hidden items-center gap-6 text-sm font-bold lg:flex">{links.map(([label,href])=><Link key={href} href={href} className="hover:text-[#1357e6]">{label}</Link>)}</nav>
        <div className="hidden items-center gap-3 lg:flex"><Link href="/student-login" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-extrabold">Student Login</Link><Link href="/portal/admission" className="rounded-xl bg-[#07152f] px-4 py-2.5 text-sm font-extrabold text-white">Apply Now</Link></div>
        <button className="lg:hidden" aria-label="Menu" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
      </div>
      {open&&<div className="border-t bg-white px-6 py-5 lg:hidden"><div className="flex flex-col gap-4 font-bold">{links.map(([label,href])=><Link key={href} href={href} onClick={()=>setOpen(false)}>{label}</Link>)}<Link href="/student-login">Student Login</Link></div></div>}
    </header>
    {children}
    <footer className="bg-[#050f22] py-12 text-slate-400"><div className="container-shell grid gap-9 md:grid-cols-3"><div><p className="font-display text-lg font-extrabold text-white">SIKSHA<span className="text-[#67c8ff]">WALLAH</span></p><p className="mt-3 max-w-sm text-sm leading-6">Admission, counselling and student support from course selection to enrolment.</p></div><div><p className="font-bold text-white">Quick links</p><div className="mt-3 grid gap-2 text-sm">{links.slice(0,4).map(([label,href])=><Link key={href} href={href}>{label}</Link>)}</div></div><div><p className="font-bold text-white">Contact</p><a href="tel:+916203138576" className="mt-3 flex items-center gap-2 text-sm"><Phone size={16}/> +91 62031 38576</a><p className="mt-2 text-sm">College Chowk, Forbesganj, Bihar</p></div></div><div className="container-shell mt-9 border-t border-white/10 pt-6 text-xs">© 2026 Siksha Wallah Hub · <Link href="/portal/privacy">Privacy</Link> · <Link href="/portal/terms">Terms</Link> · <Link href="/portal/refund">Refund Policy</Link></div></footer>
  </div>;
}
