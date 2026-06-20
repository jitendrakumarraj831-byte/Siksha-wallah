"use client";

import Image from "next/image";
import { useState } from "react";
import { saveInquiry } from "@/services/inquiry-service";
import {
  ArrowRight, BadgeCheck, BookOpen, BriefcaseBusiness, Building2,
  ChevronDown, GraduationCap, HeartPulse, MapPin, Menu, MessageCircle,
  Phone, ShieldCheck, Star, Users, X, CheckCircle2, CreditCard,
  Clock, Award, Laptop, IndianRupee, Banknote, FileCheck, User,
  ChevronRight, Sparkles, Send, Home as HomeIcon, Check,
} from "lucide-react";

/* ─────────────────────── DATA ─────────────────────── */

type Tab = "Teaching" | "Medical & Nursing" | "Technical & Management";

const coursesByTab: Record<Tab, { name: string; duration: string; eligibility: string; hot?: boolean }[]> = {
  "Teaching": [
    { name: "B.Ed", duration: "2 Years", eligibility: "Graduation 50%+", hot: true },
    { name: "D.El.Ed", duration: "2 Years", eligibility: "12th 50%+", hot: true },
    { name: "M.Ed", duration: "2 Years", eligibility: "B.Ed Required" },
    { name: "B.P.Ed", duration: "1 Year", eligibility: "Graduation 45%" },
  ],
  "Medical & Nursing": [
    { name: "MBBS", duration: "5.5 Years", eligibility: "12th PCB 50%+", hot: true },
    { name: "BDS", duration: "5 Years", eligibility: "12th PCB 50%+" },
    { name: "B.Sc Nursing", duration: "4 Years", eligibility: "12th PCB 45%", hot: true },
    { name: "GNM", duration: "3.5 Years", eligibility: "12th 45%" },
    { name: "ANM", duration: "1.5 Years", eligibility: "12th 40%" },
    { name: "B.Pharma", duration: "4 Years", eligibility: "12th PCB/PCM 45%" },
    { name: "D.Pharma", duration: "2 Years", eligibility: "12th PCB/PCM" },
    { name: "BMLT / DMLT", duration: "3 / 2 Years", eligibility: "12th PCB 45%" },
  ],
  "Technical & Management": [
    { name: "B.Tech", duration: "4 Years", eligibility: "12th PCM 45%", hot: true },
    { name: "Polytechnic", duration: "3 Years", eligibility: "10th Pass" },
    { name: "ITI", duration: "1–2 Years", eligibility: "8th / 10th Pass" },
    { name: "BCA", duration: "3 Years", eligibility: "12th 45%" },
    { name: "MCA", duration: "2 Years", eligibility: "BCA / B.Sc" },
    { name: "BBA", duration: "3 Years", eligibility: "12th 45%" },
    { name: "MBA", duration: "2 Years", eligibility: "Any Graduation", hot: true },
  ],
};

const COURSE_OPTIONS = [
  "B.Ed / D.El.Ed",
  "B.Sc Nursing / GNM / ANM",
  "MBBS / BDS",
  "B.Pharma / D.Pharma",
  "B.Tech / Polytechnic / ITI",
  "BBA / MBA / BCA / MCA",
  "अभी decide नहीं",
];

const QUAL_OPTIONS = [
  "10th Pass",
  "12th Pass (Arts)",
  "12th Pass (Science)",
  "12th Pass (Commerce)",
  "Graduation",
  "Post Graduation",
];

const faqs: [string, string][] = [
  [
    "Is distance / online learning available?",
    "हाँ, हम कई recognised universities के through distance और online programs offer करते हैं। B.Ed, MBA, MCA, M.A जैसे popular courses available हैं। हमारे counsellor से details लीजिए।",
  ],
  [
    "BSCC के लिए कौन से documents चाहिए?",
    "12th Marksheet, Bihar domicile certificate, Aadhaar Card, family income certificate (≤₹4.5 lakh/year), nationalized bank passbook, और 2 passport size photos। हम document checklist free में देते हैं।",
  ],
  [
    "Bihar Student Credit Card का loan free है क्या?",
    "₹4 lakh तक education loan मिलता है। Female / minority students के लिए सिर्फ 1% simple interest, बाकियों के लिए 4%। Government की repayment support scheme भी available है।",
  ],
  [
    "Hostel और fooding का arrangement होता है?",
    "हाँ! BSCC scheme में fooding और lodging allowance भी included है। हम आपके college के पास best और affordable hostel options भी suggest करते हैं।",
  ],
  [
    "Admission के बाद भी support मिलेगा?",
    "बिल्कुल। Document verification, fee payment, hostel booking, और college officially join करने तक एक dedicated counsellor आपके साथ रहेगा।",
  ],
  [
    "क्या पहली counselling बिल्कुल free है?",
    "हाँ! First session और पूरा profile review 100% free है। कोई hidden charge नहीं। Call करें या WhatsApp करें — अभी।",
  ],
];

const testimonials = [
  {
    name: "Priya Kumari",
    course: "B.Ed — Patna University",
    quote:
      "Counsellor ने सब कुछ आसान बना दिया। BSCC loan भी मिल गया और B.Ed admission भी। Best experience ever!",
    stars: 5,
  },
  {
    name: "Aman Raj",
    course: "B.Pharma — IGIMS Bihar",
    quote:
      "शुरुआत से आखिर तक सब कुछ transparent रहा। Fees में कोई hidden charge नहीं था। मेरे parents भी confident थे।",
    stars: 5,
  },
  {
    name: "Sakshi Jha",
    course: "B.Sc Nursing — PMCH",
    quote:
      "Nursing में career को लेकर बहुत confusion था। Siksha Wallah ने perfect guidance दी। Hostel भी arrange हो गया।",
    stars: 5,
  },
];

/* ─────────────────────── COMPONENT ─────────────────────── */

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("Teaching");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  /* Multi-step form */
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", mobile: "", course: "", qualification: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* BSCC eligibility checker */
  const [bscc, setBscc] = useState({ bihar: "", age25: "", passed12: "", income: "" });
  const [bsccResult, setBsccResult] = useState<boolean | null>(null);

  const updateForm = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const step1Valid = form.name.trim().length > 1 && form.mobile.replace(/\D/g, "").length === 10;
  const step2Valid = form.course !== "" && form.qualification !== "";

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await saveInquiry({
        fullName: form.name,
        mobile: form.mobile,
        course: form.course,
        message: `Qualification: ${form.qualification}`,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitted(true);
      setSubmitting(false);
    }
  };

  const checkBscc = () => {
    const ok =
      bscc.bihar === "yes" &&
      bscc.age25 === "yes" &&
      bscc.passed12 === "yes" &&
      bscc.income === "yes";
    setBsccResult(ok);
  };

  const allBsccAnswered =
    bscc.bihar !== "" && bscc.age25 !== "" && bscc.passed12 !== "" && bscc.income !== "";

  /* ─── TAB ICON ─── */
  const TAB_ICONS: Record<Tab, React.ReactNode> = {
    "Teaching": <GraduationCap size={18} />,
    "Medical & Nursing": <HeartPulse size={18} />,
    "Technical & Management": <Laptop size={18} />,
  };

  return (
    <main className="overflow-x-hidden bg-white text-gray-900 scroll-smooth">

      {/* ═══════════════════ HEADER ═══════════════════ */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="container-shell flex h-[72px] items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-blue text-white shadow-md">
              <GraduationCap size={22} />
            </span>
            <span className="font-headline text-xl font-extrabold tracking-tight">
              SIKSHA<span className="text-primary-red">WALLAH</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-7 text-sm font-semibold lg:flex">
            {[["#courses", "Courses"], ["#bscc", "BSCC Loan"], ["#why-us", "Why Us"], ["#contact", "Contact"]].map(([href, label]) => (
              <a key={href} href={href} className="transition hover:text-primary-blue">{label}</a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden items-center gap-3 lg:flex">
            <a
              href="tel:+916203138576"
              className="flex items-center gap-2 rounded-lg border-2 border-primary-blue px-4 py-2 text-sm font-bold text-primary-blue transition hover:bg-primary-blue hover:text-white"
            >
              <Phone size={15} /> 62031 38576
            </a>
            <a
              href="#contact"
              className="rounded-lg bg-primary-red px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-red-600"
            >
              Free Counselling
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            aria-label="Toggle menu"
            className="rounded-lg p-2 lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="border-t border-gray-100 bg-white px-6 py-5 lg:hidden">
            <div className="flex flex-col gap-4 font-semibold">
              {[["#courses", "Courses"], ["#bscc", "BSCC Loan"], ["#why-us", "Why Us"], ["#contact", "Contact"]].map(([href, label]) => (
                <a key={href} href={href} onClick={() => setMenuOpen(false)} className="py-1">{label}</a>
              ))}
              <div className="mt-2 flex flex-col gap-3">
                <a href="tel:+916203138576" className="flex items-center justify-center gap-2 rounded-lg border-2 border-primary-blue px-4 py-3 font-bold text-primary-blue">
                  <Phone size={16} /> Call Now
                </a>
                <a href="#contact" onClick={() => setMenuOpen(false)} className="rounded-lg bg-primary-red px-4 py-3 text-center font-bold text-white">
                  Free Counselling
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section
        className="relative overflow-hidden bg-gradient-to-br from-[#0a1f5c] via-[#1357e6] to-[#0e3ba8] py-20 text-white md:py-28 lg:py-32"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      >
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-blue-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-primary-red/10 blur-3xl" />

        <div className="container-shell relative">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
            {/* LEFT */}
            <div>
              {/* Badge */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary-yellow" />
                College Chowk, Forbesganj, Araria
              </div>

              {/* Headline */}
              <h1 className="font-headline text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl xl:text-[68px]">
                आपका करियर,{" "}
                <span className="text-primary-yellow">हमारी जिम्मेदारी</span>
              </h1>
              <p className="mt-3 text-2xl font-bold text-blue-200 md:text-3xl">
                Right Admission, Right Guidance
              </p>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-blue-100">
                B.Ed से MBBS, D.El.Ed से MBA — Bihar के best colleges में{" "}
                <strong className="text-white">100% Transparent</strong> guidance,{" "}
                <strong className="text-white">Zero Hidden Charges</strong>, Complete Support.
              </p>

              {/* CTA buttons */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#contact"
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary-red px-7 py-4 font-bold text-white shadow-lg shadow-red-900/40 transition hover:-translate-y-1 hover:bg-red-600 hover:shadow-xl"
                >
                  Free Counselling Book करें <ArrowRight size={19} />
                </a>
                <a
                  href="https://wa.me/916203138576"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-white/60 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  <MessageCircle size={19} /> WhatsApp करें
                </a>
              </div>

              {/* Stats */}
              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/20 pt-8">
                {[
                  ["5,000+", "Students Guided"],
                  ["200+", "Partner Colleges"],
                  ["98%", "Success Rate"],
                ].map(([num, label]) => (
                  <div key={label}>
                    <p className="font-headline text-3xl font-extrabold text-primary-yellow">{num}</p>
                    <p className="mt-1 text-sm text-blue-200">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — glassmorphism card + image */}
            <div className="relative">
              {/* Glow */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary-yellow/20 via-primary-red/20 to-primary-yellow/20 blur-2xl" />

              {/* Image */}
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=90"
                  alt="Students studying"
                  width={900}
                  height={600}
                  className="h-72 w-full object-cover md:h-[420px]"
                  priority
                />
                {/* Overlay info card */}
                <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/15 p-4 backdrop-blur-md border border-white/30">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary-yellow">Latest Update</p>
                  <p className="mt-1 text-sm font-semibold text-white">Bihar Student Credit Card 2024–25 — Admissions Open!</p>
                  <a href="#bscc" className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary-yellow hover:underline">
                    Check Eligibility <ChevronRight size={13} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ TRUST BAR ═══════════════════ */}
      <section className="border-b border-gray-100 bg-gray-50 py-8">
        <div className="container-shell">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { icon: <Users size={22} className="text-primary-blue" />, num: "5,000+", label: "Students Guided" },
              { icon: <Building2 size={22} className="text-primary-green" />, num: "200+", label: "Partner Colleges" },
              { icon: <Award size={22} className="text-primary-red" />, num: "10+", label: "Years Experience" },
              { icon: <Phone size={22} className="text-primary-yellow" />, num: "3 Numbers", label: "Always Reachable" },
            ].map(({ icon, num, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-gray-100">
                  {icon}
                </div>
                <div>
                  <p className="font-headline text-xl font-extrabold text-gray-900">{num}</p>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ BSCC SECTION ═══════════════════ */}
      <section
        id="bscc"
        className="relative overflow-hidden bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#065f46] py-20 text-white"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="container-shell relative">
          {/* Heading */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-sm font-bold">
              <CreditCard size={16} /> Bihar Government Scheme
            </div>
            <h2 className="font-headline text-4xl font-extrabold md:text-5xl">
              Bihar Student Credit Card{" "}
              <span className="text-emerald-300">(BSCC)</span>
            </h2>
            <p className="mt-4 text-xl font-semibold text-emerald-100">
              Get Free Education, Fooding & Lodging — ₹4 Lakh तक Loan at Almost Zero Cost!
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            {/* LEFT — Benefits */}
            <div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: <Banknote size={22} />, title: "₹4 Lakh Education Loan", desc: "12th pass students के लिए" },
                  { icon: <HomeIcon size={22} />, title: "Fooding & Lodging", desc: "Hostel और खाने का खर्च included" },
                  { icon: <IndianRupee size={22} />, title: "1–4% Simple Interest", desc: "Female students के लिए सिर्फ 1%" },
                  { icon: <FileCheck size={22} />, title: "No Collateral", desc: "कोई mortgage या guarantee नहीं" },
                  { icon: <Award size={22} />, title: "Government Backed", desc: "Bihar Govt. की official scheme" },
                  { icon: <CheckCircle2 size={22} />, title: "Easy Repayment", desc: "Course के बाद job मिलने पर repay" },
                ].map(({ icon, title, desc }) => (
                  <div
                    key={title}
                    className="flex gap-3 rounded-xl border border-emerald-400/20 bg-white/10 p-4 backdrop-blur-sm"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-400/20 text-emerald-300">
                      {icon}
                    </div>
                    <div>
                      <p className="font-bold text-white">{title}</p>
                      <p className="text-sm text-emerald-200">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <a
                  href="#contact"
                  className="flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-emerald-800 shadow-lg transition hover:bg-emerald-50"
                >
                  BSCC के लिए Apply करें <ArrowRight size={17} />
                </a>
                <a
                  href="https://wa.me/916203138576"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border-2 border-white/50 px-6 py-3.5 font-bold text-white transition hover:bg-white/10"
                >
                  <MessageCircle size={17} /> WhatsApp करें
                </a>
              </div>
            </div>

            {/* RIGHT — Eligibility Checker */}
            <div className="rounded-2xl border border-emerald-400/20 bg-white/10 p-6 backdrop-blur-md">
              <h3 className="mb-5 font-headline text-xl font-extrabold">
                ✅ Check BSCC Eligibility
              </h3>

              {bsccResult === null ? (
                <div className="space-y-4">
                  {[
                    { key: "bihar", question: "क्या आप Bihar के permanent resident हैं?", field: "bihar" as const },
                    { key: "age25", question: "क्या आपकी age 25 साल या कम है?", field: "age25" as const },
                    { key: "passed12", question: "क्या आपने 12th pass कर ली है?", field: "passed12" as const },
                    { key: "income", question: "क्या family income ₹4.5 लाख/साल से कम है?", field: "income" as const },
                  ].map(({ question, field }) => (
                    <div key={field}>
                      <p className="mb-2 text-sm font-semibold text-emerald-100">{question}</p>
                      <div className="flex gap-3">
                        {["yes", "no"].map((val) => (
                          <button
                            key={val}
                            onClick={() => setBscc((p) => ({ ...p, [field]: val }))}
                            className={`flex-1 rounded-lg border-2 py-2 text-sm font-bold transition ${
                              bscc[field] === val
                                ? "border-emerald-300 bg-emerald-300 text-emerald-900"
                                : "border-white/30 bg-white/10 text-white hover:bg-white/20"
                            }`}
                          >
                            {val === "yes" ? "हाँ" : "नहीं"}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={checkBscc}
                    disabled={!allBsccAnswered}
                    className="mt-2 w-full rounded-xl bg-emerald-400 py-3.5 font-bold text-emerald-900 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Check Eligibility
                  </button>
                </div>
              ) : bsccResult ? (
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/20">
                    <CheckCircle2 size={40} className="text-emerald-300" />
                  </div>
                  <h4 className="font-headline text-2xl font-extrabold text-emerald-300">आप Eligible हैं! 🎉</h4>
                  <p className="mt-2 text-emerald-100">
                    आप Bihar Student Credit Card के लिए eligible हैं। अभी apply करें और ₹4 लाख तक का education loan पाएं।
                  </p>
                  <a
                    href="#contact"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-emerald-800"
                  >
                    अभी Apply करें <ArrowRight size={16} />
                  </a>
                  <button
                    onClick={() => { setBsccResult(null); setBscc({ bihar: "", age25: "", passed12: "", income: "" }); }}
                    className="mt-3 block w-full text-center text-sm text-emerald-300 underline"
                  >
                    फिर से check करें
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-400/20">
                    <X size={40} className="text-red-300" />
                  </div>
                  <h4 className="font-headline text-xl font-extrabold text-red-300">अभी Eligible नहीं</h4>
                  <p className="mt-2 text-emerald-100">
                    लगता है आप अभी BSCC के eligible नहीं हैं, लेकिन हम और options explore कर सकते हैं। हमारे counsellor से बात करें।
                  </p>
                  <a href="tel:+916203138576" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-gray-800">
                    <Phone size={16} /> Call Counsellor
                  </a>
                  <button
                    onClick={() => { setBsccResult(null); setBscc({ bihar: "", age25: "", passed12: "", income: "" }); }}
                    className="mt-3 block w-full text-center text-sm text-emerald-300 underline"
                  >
                    फिर से check करें
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ COURSE FINDER ═══════════════════ */}
      <section id="courses" className="bg-gray-50 py-24">
        <div className="container-shell">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-primary-blue">
              All Courses Available
            </p>
            <h2 className="font-headline text-4xl font-extrabold md:text-5xl">
              कौन सा Course आपके लिए सही है?
            </h2>
            <p className="mt-4 text-gray-500">
              Stream चुनें, course देखें, और तुरंत inquiry करें
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {(Object.keys(coursesByTab) as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition ${
                  activeTab === tab
                    ? "bg-primary-blue text-white shadow-md shadow-blue-200"
                    : "border-2 border-gray-200 bg-white text-gray-600 hover:border-primary-blue hover:text-primary-blue"
                }`}
              >
                {TAB_ICONS[tab]} {tab}
              </button>
            ))}
          </div>

          {/* Course Cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {coursesByTab[activeTab].map(({ name, duration, eligibility, hot }) => (
              <div
                key={name}
                className="group relative rounded-2xl border-2 border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary-blue hover:shadow-lg"
              >
                {hot && (
                  <span className="absolute -right-2 -top-2 rounded-full bg-primary-red px-2.5 py-0.5 text-xs font-bold text-white shadow">
                    🔥 Popular
                  </span>
                )}

                {/* Course name */}
                <h3 className="font-headline text-xl font-extrabold text-gray-900">{name}</h3>

                {/* Meta */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={14} className="text-primary-blue flex-shrink-0" />
                    <span>
                      <strong>Duration:</strong> {duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BadgeCheck size={14} className="text-primary-green flex-shrink-0" />
                    <span>
                      <strong>Eligibility:</strong> {eligibility}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <a
                  href="#contact"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary-blue py-2.5 text-sm font-bold text-white transition group-hover:bg-blue-700"
                >
                  Inquire Fee <ArrowRight size={15} />
                </a>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-gray-500">
            और 50+ courses available हैं —{" "}
            <a href="tel:+916203138576" className="font-bold text-primary-blue hover:underline">
              Call करें +91 62031 38576
            </a>
          </p>
        </div>
      </section>

      {/* ═══════════════════ WHY US ═══════════════════ */}
      <section id="why-us" className="bg-white py-24">
        <div className="container-shell">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Image */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary-blue/10 to-primary-green/10" />
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=90"
                alt="Counselling session"
                width={1200}
                height={800}
                className="relative rounded-2xl shadow-xl"
              />
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl">
                <p className="font-headline text-3xl font-extrabold text-primary-blue">10+</p>
                <p className="text-xs font-semibold text-gray-500">Years of Trust</p>
              </div>
            </div>

            {/* Content */}
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-primary-red">
                हमारी विशेषता
              </p>
              <h2 className="font-headline text-4xl font-extrabold leading-tight md:text-5xl">
                सिर्फ Form भरना नहीं,{" "}
                <span className="text-primary-blue">सही Career</span> चुनना
              </h2>

              <div className="mt-8 space-y-5">
                {[
                  { icon: <ShieldCheck size={22} className="text-white" />, bg: "bg-primary-blue", title: "100% Transparent Process", desc: "कोई hidden charges नहीं — admission fee से लेकर college fees तक सब clear" },
                  { icon: <Users size={22} className="text-white" />, bg: "bg-primary-green", title: "Dedicated Personal Counsellor", desc: "एक counsellor आपके admission तक हर step पर साथ रहेगा" },
                  { icon: <CreditCard size={22} className="text-white" />, bg: "bg-emerald-600", title: "BSCC Loan Assistance", desc: "Bihar Student Credit Card apply करने में complete help" },
                  { icon: <Award size={22} className="text-white" />, bg: "bg-primary-red", title: "200+ College Network", desc: "Bihar, Jharkhand, UP सहित 20+ states में partner colleges" },
                  { icon: <CheckCircle2 size={22} className="text-white" />, bg: "bg-purple-600", title: "Post-Admission Support", desc: "Documents, hostel, joining — सब कुछ हम handle करेंगे" },
                ].map(({ icon, bg, title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${bg} shadow-md`}>
                      {icon}
                    </div>
                    <div>
                      <h3 className="font-headline font-extrabold">{title}</h3>
                      <p className="mt-0.5 text-sm text-gray-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ PROCESS ═══════════════════ */}
      <section className="bg-gradient-to-r from-[#1357e6] to-[#0a1f5c] py-20 text-white">
        <div className="container-shell">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-blue-200">
              Simple 4-Step Process
            </p>
            <h2 className="font-headline text-4xl font-extrabold">Admission कैसे मिलता है?</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {[
              { step: "01", title: "Goal बताइए", desc: "Marks, budget, और interest share करें" },
              { step: "02", title: "Roadmap पाइए", desc: "Best colleges की personalized list" },
              { step: "03", title: "Application करें", desc: "Documents हम handle करेंगे" },
              { step: "04", title: "Admission पक्का", desc: "College join तक full support" },
            ].map(({ step, title, desc }, i) => (
              <div key={step} className="relative">
                {i < 3 && (
                  <ChevronRight
                    size={28}
                    className="absolute -right-4 top-6 hidden text-white/30 md:block"
                  />
                )}
                <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm transition hover:bg-white/15">
                  <p className="font-headline text-4xl font-extrabold text-primary-yellow opacity-60">{step}</p>
                  <h3 className="mt-3 font-headline text-lg font-extrabold">{title}</h3>
                  <p className="mt-2 text-sm text-blue-200">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
      <section id="reviews" className="bg-gray-50 py-24">
        <div className="container-shell">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-primary-blue">
              Success Stories
            </p>
            <h2 className="font-headline text-4xl font-extrabold md:text-5xl">
              हजारों Students की Success का सफर
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map(({ name, course, quote, stars }) => (
              <article
                key={name}
                className="rounded-2xl border-2 border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:border-primary-blue hover:shadow-lg"
              >
                <div className="flex gap-1 text-primary-yellow">
                  {[...Array(stars)].map((_, i) => (
                    <Star key={i} size={17} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-4 text-gray-700 italic leading-relaxed">"{quote}"</p>
                <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-blue/10 font-bold text-primary-blue">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-headline font-extrabold">{name}</p>
                    <p className="text-xs text-gray-500">{course}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ FAQ ═══════════════════ */}
      <section className="bg-white py-24">
        <div className="container-shell">
          <div className="grid gap-12 lg:grid-cols-[2fr_3fr]">
            {/* Left */}
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-primary-blue">
                अक्सर पूछे जाने वाले सवाल
              </p>
              <h2 className="font-headline text-4xl font-extrabold">
                कोई सवाल है? हम यहाँ हैं।
              </h2>
              <p className="mt-4 leading-relaxed text-gray-500">
                नीचे common questions के answers हैं। अगर और कुछ जानना है तो directly call करें।
              </p>

              <div className="mt-8 space-y-3">
                {[
                  { icon: <Phone size={18} />, label: "6203138576", href: "tel:+916203138576" },
                  { icon: <Phone size={18} />, label: "7858062498", href: "tel:+917858062498" },
                  { icon: <Phone size={18} />, label: "9472813581", href: "tel:+919472813581" },
                  { icon: <MessageCircle size={18} />, label: "WhatsApp Chat", href: "https://wa.me/916203138576" },
                ].map(({ icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("https") ? "_blank" : undefined}
                    rel={href.startsWith("https") ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-3 font-semibold text-primary-blue hover:underline"
                  >
                    {icon} {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Right — Accordion */}
            <div className="divide-y divide-gray-100 rounded-2xl border border-gray-200 overflow-hidden">
              {faqs.map(([q, a], i) => (
                <div key={i} className="bg-white">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-start justify-between gap-4 p-5 text-left"
                  >
                    <span className="font-headline font-extrabold text-gray-900">{q}</span>
                    <ChevronDown
                      size={22}
                      className={`mt-0.5 flex-shrink-0 text-primary-blue transition-transform duration-200 ${
                        openFaq === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFaq === i && (
                    <p className="border-t border-gray-100 bg-gray-50 px-5 pb-5 pt-4 text-sm leading-relaxed text-gray-600">
                      {a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ CONTACT + MULTI-STEP FORM ═══════════════════ */}
      <section
        id="contact"
        className="relative overflow-hidden bg-gradient-to-br from-[#0a1f5c] via-[#1357e6] to-[#0e3ba8] py-24 text-white"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="container-shell relative">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* LEFT — Info */}
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-blue-200">
                अभी शुरू करें
              </p>
              <h2 className="font-headline text-4xl font-extrabold leading-tight md:text-5xl">
                अपना Admission Plan बनाइए — Free
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-blue-100">
                हमारे Counsellor से free में बात करें और अपने लिए best college + course खोजें। कोई obligation नहीं।
              </p>

              {/* Contact numbers */}
              <div className="mt-8 space-y-3">
                {[
                  ["6203138576", "Primary Counsellor"],
                  ["7858062498", "Admission Support"],
                  ["9472813581", "BSCC Assistance"],
                ].map(([num, role]) => (
                  <a
                    key={num}
                    href={`tel:+91${num}`}
                    className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
                  >
                    <Phone size={18} className="text-primary-yellow flex-shrink-0" />
                    <div>
                      <p>+91 {num}</p>
                      <p className="text-xs font-normal text-blue-200">{role}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Location */}
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                <MapPin size={20} className="mt-0.5 flex-shrink-0 text-primary-yellow" />
                <div>
                  <p className="font-bold">Our Office</p>
                  <p className="text-sm text-blue-200">
                    College Chowk, Near HP Petrol Pump,<br />
                    Forbesganj, Araria — Bihar
                  </p>
                </div>
              </div>

              {/* WhatsApp */}
              <a
                href="https://wa.me/916203138576"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl bg-green-500 py-3.5 font-bold text-white shadow-lg transition hover:bg-green-600"
              >
                <MessageCircle size={20} /> WhatsApp पर Chat करें
              </a>
            </div>

            {/* RIGHT — Multi-step form */}
            <div className="rounded-2xl bg-white p-8 text-gray-900 shadow-2xl">
              {submitted ? (
                /* ── Success State ── */
                <div className="flex flex-col items-center py-8 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 size={44} className="text-green-600" />
                  </div>
                  <h3 className="mt-5 font-headline text-2xl font-extrabold text-gray-900">
                    Thank You, {form.name}!
                  </h3>
                  <p className="mt-3 text-gray-500">
                    हमारा counsellor <strong>{form.mobile}</strong> पर जल्द ही call करेगा।
                  </p>
                  <p className="mt-2 text-sm text-gray-400">आमतौर पर 30 minutes के अंदर call आती है।</p>
                  <a
                    href="https://wa.me/916203138576"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-bold text-white hover:bg-green-600"
                  >
                    <MessageCircle size={18} /> अभी WhatsApp करें
                  </a>
                </div>
              ) : (
                <>
                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-headline text-xl font-extrabold">Quick Registration</h3>
                      <span className="text-xs font-bold text-gray-400">Step {step} of 3</span>
                    </div>
                    <div className="flex gap-1.5">
                      {[1, 2, 3].map((s) => (
                        <div
                          key={s}
                          className={`h-1.5 flex-1 rounded-full transition-all ${
                            s <= step ? "bg-primary-blue" : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Step 1 */}
                  {step === 1 && (
                    <div className="space-y-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-bold text-gray-700">
                          <User size={14} className="mr-1 inline" /> पूरा नाम *
                        </label>
                        <input
                          value={form.name}
                          onChange={(e) => updateForm("name", e.target.value)}
                          placeholder="जैसे: Rahul Kumar"
                          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-primary-blue"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-bold text-gray-700">
                          <Phone size={14} className="mr-1 inline" /> Mobile Number *
                        </label>
                        <input
                          value={form.mobile}
                          onChange={(e) => updateForm("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
                          placeholder="10-digit mobile number"
                          type="tel"
                          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-primary-blue"
                        />
                      </div>
                      <button
                        onClick={() => setStep(2)}
                        disabled={!step1Valid}
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-blue py-3.5 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Next <ArrowRight size={18} />
                      </button>
                    </div>
                  )}

                  {/* Step 2 */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-bold text-gray-700">
                          <BookOpen size={14} className="mr-1 inline" /> Desired Course
                        </label>
                        <select
                          value={form.course}
                          onChange={(e) => updateForm("course", e.target.value)}
                          className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-blue"
                        >
                          <option value="">— Course चुनें —</option>
                          {COURSE_OPTIONS.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-bold text-gray-700">
                          <GraduationCap size={14} className="mr-1 inline" /> Current Qualification
                        </label>
                        <select
                          value={form.qualification}
                          onChange={(e) => updateForm("qualification", e.target.value)}
                          className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-blue"
                        >
                          <option value="">— Qualification चुनें —</option>
                          {QUAL_OPTIONS.map((q) => (
                            <option key={q} value={q}>{q}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-3 mt-2">
                        <button
                          onClick={() => setStep(1)}
                          className="flex-1 rounded-xl border-2 border-gray-200 py-3 font-bold text-gray-600 transition hover:border-gray-400"
                        >
                          Back
                        </button>
                        <button
                          onClick={() => setStep(3)}
                          disabled={!step2Valid}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-blue py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Next <ArrowRight size={18} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3 — Review */}
                  {step === 3 && (
                    <div className="space-y-4">
                      <p className="text-sm font-bold text-gray-700">आपकी जानकारी confirm करें:</p>
                      <div className="rounded-xl bg-gray-50 p-4 space-y-3">
                        {[
                          ["नाम", form.name],
                          ["Mobile", form.mobile],
                          ["Course", form.course],
                          ["Qualification", form.qualification],
                        ].map(([label, val]) => (
                          <div key={label} className="flex justify-between text-sm">
                            <span className="font-bold text-gray-500">{label}:</span>
                            <span className="font-semibold text-gray-900">{val}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setStep(2)}
                          className="flex-1 rounded-xl border-2 border-gray-200 py-3 font-bold text-gray-600 transition hover:border-gray-400"
                        >
                          Edit
                        </button>
                        <button
                          onClick={handleSubmit}
                          disabled={submitting}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-red py-3 font-bold text-white transition hover:bg-red-600 disabled:opacity-60"
                        >
                          {submitting ? (
                            "Submitting..."
                          ) : (
                            <>
                              <Send size={16} /> Submit
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  <p className="mt-4 text-center text-xs text-gray-400">
                    🔒 Your data is safe. We won't spam.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="bg-gray-950 py-16 text-gray-400">
        <div className="container-shell">
          <div className="grid gap-10 md:grid-cols-4 pb-10 border-b border-gray-800">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="mb-4 flex items-center gap-2 text-white">
                <GraduationCap size={26} className="text-primary-blue" />
                <span className="font-headline text-lg font-extrabold">
                  SIKSHA<span className="text-primary-red">WALLAH</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed">
                Bihar के students के लिए trusted admission guidance। College Chowk, Forbesganj, Araria।
              </p>
              <a
                href="https://wa.me/916203138576"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-500"
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-4 font-bold text-white">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                {[["#courses", "Courses"], ["#bscc", "BSCC Scheme"], ["#why-us", "Why Us"], ["#reviews", "Testimonials"], ["#contact", "Free Counselling"]].map(([href, label]) => (
                  <li key={href}>
                    <a href={href} className="transition hover:text-white">{label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Courses */}
            <div>
              <h4 className="mb-4 font-bold text-white">Top Courses</h4>
              <ul className="space-y-2 text-sm">
                {["B.Ed / D.El.Ed", "B.Sc Nursing / GNM", "MBBS / BDS", "B.Pharma", "B.Tech / Polytechnic", "BBA / MBA"].map((c) => (
                  <li key={c}>
                    <a href="#courses" className="transition hover:text-white">{c}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="mb-4 font-bold text-white">Contact Us</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin size={15} className="mt-0.5 flex-shrink-0 text-primary-blue" />
                  <p>College Chowk, Near HP Petrol Pump, Forbesganj, Araria, Bihar</p>
                </div>
                {[["6203138576", "+91 6203138576"], ["7858062498", "+91 7858062498"], ["9472813581", "+91 9472813581"]].map(([num, label]) => (
                  <a key={num} href={`tel:+91${num}`} className="flex items-center gap-2 hover:text-white transition">
                    <Phone size={14} className="text-primary-blue flex-shrink-0" /> {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 pt-8 text-center text-xs text-gray-500 md:flex-row md:text-left">
            <p>© 2026 Siksha Wallah Hub. All rights reserved. | Forbesganj, Araria, Bihar</p>
            <p>Trusted admission partner for Bihar students since 2015</p>
          </div>
        </div>
      </footer>

      {/* ═══════════════════ FLOATING BUTTONS ═══════════════════ */}

      {/* WhatsApp */}
      <a
        href="https://wa.me/916203138576"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-2xl shadow-green-900/40 transition hover:scale-110 hover:bg-green-600"
      >
        <MessageCircle size={26} fill="currentColor" />
        <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 animate-ping rounded-full bg-green-400" />
      </a>

      {/* Quick Apply — visible on mobile at bottom */}
      <a
        href="#contact"
        className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2 rounded-full bg-primary-red px-6 py-3 font-bold text-white shadow-2xl shadow-red-900/40 transition hover:bg-red-600 md:hidden"
      >
        <Sparkles size={16} /> Apply Now — Free
      </a>

    </main>
  );
}
