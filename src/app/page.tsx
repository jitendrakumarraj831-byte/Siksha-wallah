"use client";

import { useState } from "react";
import {
  ArrowRight, BadgeCheck, BookOpen, BriefcaseBusiness, Building2, Check,
  ChevronDown, CreditCard, GraduationCap, HeartPulse, MapPin, Menu,
  MessageCircle, Phone, ShieldCheck, Sparkles, Star, Users, X,
  Stethoscope, FlaskConical, Cpu, Clock, Award, CheckCircle2,
} from "lucide-react";

/* ─── Data ─────────────────────────────────────────── */

const teachingCourses = [
  { name: "B.Ed", full: "Bachelor of Education", duration: "2 Years", eligibility: "Graduation (50%)", fee: "₹50,000/yr" },
  { name: "D.El.Ed", full: "Diploma in Elementary Education", duration: "2 Years", eligibility: "12th Pass", fee: "₹25,000/yr" },
  { name: "M.Ed", full: "Master of Education", duration: "2 Years", eligibility: "B.Ed (55%)", fee: "₹60,000/yr" },
];

const medicalCourses = [
  { name: "MBBS", full: "Bachelor of Medicine", duration: "5.5 Years", eligibility: "12th (PCB) + NEET", fee: "₹8-25L/yr" },
  { name: "BDS", full: "Bachelor of Dental Surgery", duration: "5 Years", eligibility: "12th (PCB) + NEET", fee: "₹5-15L/yr" },
  { name: "B.Sc Nursing", full: "Bachelor of Science Nursing", duration: "4 Years", eligibility: "12th (PCB)", fee: "₹60,000/yr" },
  { name: "GNM", full: "General Nursing & Midwifery", duration: "3 Years", eligibility: "12th Pass", fee: "₹40,000/yr" },
  { name: "ANM", full: "Auxiliary Nursing Midwifery", duration: "2 Years", eligibility: "10th Pass", fee: "₹25,000/yr" },
  { name: "B.Pharma", full: "Bachelor of Pharmacy", duration: "4 Years", eligibility: "12th (PCB/PCM)", fee: "₹55,000/yr" },
];

const technicalCourses = [
  { name: "B.Tech", full: "Bachelor of Technology", duration: "4 Years", eligibility: "12th (PCM) / JEE", fee: "₹80,000/yr" },
  { name: "Polytechnic", full: "Diploma in Engineering", duration: "3 Years", eligibility: "10th Pass", fee: "₹30,000/yr" },
  { name: "ITI", full: "Industrial Training Institute", duration: "1-2 Years", eligibility: "8th/10th Pass", fee: "₹15,000/yr" },
  { name: "BCA", full: "Bachelor of Computer Applications", duration: "3 Years", eligibility: "12th Pass", fee: "₹40,000/yr" },
  { name: "MCA", full: "Master of Computer Applications", duration: "2 Years", eligibility: "BCA/B.Sc", fee: "₹55,000/yr" },
  { name: "BBA", full: "Bachelor of Business Administration", duration: "3 Years", eligibility: "12th Pass", fee: "₹35,000/yr" },
  { name: "MBA", full: "Master of Business Administration", duration: "2 Years", eligibility: "Graduation", fee: "₹70,000/yr" },
];

const faqs = [
  {
    q: "Is distance learning available?",
    a: "Yes! We provide guidance for both regular and distance learning modes. Many courses like B.Ed, BBA, MBA are available through distance education from NAAC-accredited universities.",
  },
  {
    q: "What documents are required for Bihar Student Credit Card (BSCC)?",
    a: "You need: Aadhar Card, 12th Marksheet, Income Certificate (below ₹4.5L/year), Bank Account Details, Domicile Certificate (Bihar), and college admission letter. We help you prepare all documents.",
  },
  {
    q: "कौन से colleges के साथ काम करते हैं?",
    a: "We work with 200+ NAAC/NCTE/INC/AICTE approved colleges across Bihar, Jharkhand, UP, and other states. We guide you to the best college matching your budget and eligibility.",
  },
  {
    q: "क्या career counselling free है?",
    a: "Yes, 100%! Your first counselling session and profile review are completely free. No hidden fees, no obligation. We believe every student deserves the right guidance.",
  },
  {
    q: "Admission के बाद भी support मिलेगा?",
    a: "Absolutely! We support you from the first inquiry until you complete your admission — document verification, hostel guidance, college visits, and post-admission queries.",
  },
  {
    q: "क्या BSCC से Nursing/B.Tech के लिए भी loan मिलता है?",
    a: "Yes! Bihar Student Credit Card provides up to ₹4 Lakh loan covering tuition fees, hostel, food, and study materials for courses like B.Ed, Nursing, B.Tech, BBA, and 40+ more.",
  },
];

type StreamKey = "teaching" | "medical" | "technical";

const streamTabs: { key: StreamKey; label: string; icon: typeof GraduationCap; color: string; courses: typeof teachingCourses }[] = [
  { key: "teaching", label: "Teaching Courses", icon: GraduationCap, color: "blue", courses: teachingCourses },
  { key: "medical", label: "Medical & Nursing", icon: Stethoscope, color: "red", courses: medicalCourses as typeof teachingCourses },
  { key: "technical", label: "Technical & Management", icon: Cpu, color: "orange", courses: technicalCourses as typeof teachingCourses },
];

const colorMap: Record<string, { tab: string; active: string; badge: string; btn: string; card: string; icon: string }> = {
  blue: {
    tab: "text-blue-700 border-blue-600 bg-blue-50",
    active: "bg-blue-600",
    badge: "bg-blue-100 text-blue-700",
    btn: "bg-blue-600 hover:bg-blue-700",
    card: "hover:border-blue-400",
    icon: "bg-blue-100 text-blue-700",
  },
  red: {
    tab: "text-red-700 border-red-600 bg-red-50",
    active: "bg-red-600",
    badge: "bg-red-100 text-red-700",
    btn: "bg-red-600 hover:bg-red-700",
    card: "hover:border-red-400",
    icon: "bg-red-100 text-red-700",
  },
  orange: {
    tab: "text-orange-700 border-orange-600 bg-orange-50",
    active: "bg-orange-600",
    badge: "bg-orange-100 text-orange-700",
    btn: "bg-orange-600 hover:bg-orange-700",
    card: "hover:border-orange-400",
    icon: "bg-orange-100 text-orange-700",
  },
};

/* ─── Multi-step Form ─────────────────────────────── */
const STEPS = ["Name", "Mobile", "Course", "Qualify"];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeStream, setActiveStream] = useState<StreamKey>("teaching");
  const [bsccEligible, setBsccEligible] = useState<null | boolean>(null);
  const [bsccIncome, setBsccIncome] = useState("");
  const [bsccBihar, setBsccBihar] = useState("");
  const [bsccAge, setBsccAge] = useState("");

  // Multi-step form
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ name: "", mobile: "", course: "", qualify: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const stream = streamTabs.find((s) => s.key === activeStream)!;
  const colors = colorMap[stream.color];

  function handleBsccCheck(e: React.FormEvent) {
    e.preventDefault();
    const eligible =
      bsccBihar === "yes" &&
      bsccAge !== "" &&
      parseInt(bsccAge) <= 25 &&
      bsccIncome === "below";
    setBsccEligible(eligible);
  }

  function nextStep() {
    if (step < STEPS.length - 1) setStep(step + 1);
    else {
      setFormSubmitted(true);
      // WhatsApp redirect
      const msg = `New Inquiry from Siksha Wallah Website!%0AName: ${formData.name}%0AMobile: ${formData.mobile}%0ACourse: ${formData.course}%0AQualification: ${formData.qualify}`;
      window.open(`https://wa.me/916203138576?text=${msg}`, "_blank");
    }
  }

  return (
    <main className="overflow-hidden bg-white text-gray-900">

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur shadow-sm">
        <div className="container-shell flex h-[72px] items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-blue text-white shadow-md">
              <GraduationCap size={22} />
            </span>
            <span className="font-headline text-xl font-extrabold tracking-tight">
              SIKSHA<span className="text-primary-red">WALLAH</span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 text-sm font-semibold lg:flex">
            {[["#courses", "Courses"], ["#bscc", "BSCC Scheme"], ["#why-us", "Why Us"], ["#contact", "Contact"]].map(([href, label]) => (
              <a key={href} href={href} className="transition hover:text-primary-blue">{label}</a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <a href="tel:+916203138576" className="flex items-center gap-2 rounded-lg border-2 border-primary-blue px-4 py-2 text-sm font-bold text-primary-blue transition hover:bg-primary-blue hover:text-white">
              <Phone size={14} /> 6203138576
            </a>
            <a href="#inquiry" className="rounded-lg bg-primary-red px-5 py-2 text-sm font-bold text-white transition hover:bg-red-700 shadow-md shadow-red-200">
              Apply Now →
            </a>
          </div>

          <button aria-label="Open menu" className="rounded-lg p-2 lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-gray-100 bg-white px-6 py-5 lg:hidden">
            <div className="flex flex-col gap-4 font-semibold text-sm">
              {[["#courses", "Courses"], ["#bscc", "BSCC Scheme"], ["#why-us", "Why Us"], ["#contact", "Contact"]].map(([href, label]) => (
                <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
              ))}
              <a href="#inquiry" onClick={() => setMenuOpen(false)} className="rounded-lg bg-primary-red px-4 py-2.5 text-center text-white font-bold">
                Apply Now →
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#001f6b] via-[#003f9f] to-[#0060c7] text-white">
        {/* Grid overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
        {/* Glow blobs */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-amber-400 opacity-20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -left-24 h-64 w-64 rounded-full bg-blue-300 opacity-20 blur-3xl" />

        <div className="container-shell relative py-20 md:py-32">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_.85fr] items-center">
            {/* Left */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
                <BadgeCheck size={16} className="text-amber-400" />
                College Chowk, Near HP Petrol Pump, Forbesganj, Araria
              </div>

              <h1 className="font-headline text-4xl md:text-5xl lg:text-[64px] font-extrabold leading-[1.1]">
                आपका करियर,{" "}
                <span className="relative">
                  <span className="text-amber-400">हमारी जिम्मेदारी</span>
                </span>
                <br />
                <span className="text-white/80 text-2xl md:text-3xl lg:text-4xl font-bold mt-2 block">
                  Right Admission, Right Guidance
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base md:text-lg text-blue-100 leading-relaxed">
                B.Ed से MBBS, D.El.Ed से MBA — हर course के लिए <strong className="text-white">100% Transparent</strong> guidance, Zero hidden charges, और Complete support जब तक Admission नहीं मिलता।
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href="#inquiry"
                  className="group flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-7 py-4 font-extrabold text-gray-900 shadow-lg shadow-amber-500/30 transition hover:-translate-y-0.5 hover:bg-amber-300 active:scale-95"
                >
                  Free Counselling Book करें <ArrowRight size={18} className="transition group-hover:translate-x-1" />
                </a>
                <a
                  href="https://wa.me/916203138576"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-white/40 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur transition hover:bg-white/20"
                >
                  <MessageCircle size={18} /> WhatsApp करें
                </a>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/20 pt-8">
                {[["5,000+", "Students Guided"], ["200+", "Colleges Partnered"], ["98%", "Success Rate"]].map(([num, label]) => (
                  <div key={label}>
                    <p className="font-headline text-3xl font-extrabold text-amber-400">{num}</p>
                    <p className="mt-1 text-sm text-blue-100">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — glassmorphism quick inquiry */}
            <div id="inquiry" className="rounded-2xl border border-white/20 bg-white/10 p-7 backdrop-blur-xl shadow-2xl">
              {formSubmitted ? (
                <div className="flex flex-col items-center gap-4 py-10 text-center">
                  <CheckCircle2 size={56} className="text-green-400" />
                  <h3 className="font-headline text-2xl font-extrabold">धन्यवाद! 🎉</h3>
                  <p className="text-blue-100">हमारा counsellor जल्द ही आपसे WhatsApp पर संपर्क करेगा।</p>
                  <button onClick={() => { setFormSubmitted(false); setStep(0); setFormData({ name: "", mobile: "", course: "", qualify: "" }); }} className="rounded-xl bg-amber-400 px-6 py-3 font-bold text-gray-900">
                    New Inquiry
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="font-headline text-xl font-extrabold">Quick Inquiry</h3>
                    <span className="text-sm text-blue-200">Step {step + 1} / {STEPS.length}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-6 h-1.5 w-full rounded-full bg-white/20">
                    <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
                  </div>

                  {/* Step content */}
                  <div className="space-y-3">
                    {step === 0 && (
                      <>
                        <label className="block text-sm font-semibold text-blue-100">आपका पूरा नाम</label>
                        <input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Full Name (पूरा नाम)"
                          className="w-full rounded-xl border border-white/30 bg-white/20 px-4 py-3.5 text-white placeholder-blue-200 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
                        />
                      </>
                    )}
                    {step === 1 && (
                      <>
                        <label className="block text-sm font-semibold text-blue-100">Mobile Number</label>
                        <input
                          value={formData.mobile}
                          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                          type="tel"
                          placeholder="10-digit Mobile Number"
                          className="w-full rounded-xl border border-white/30 bg-white/20 px-4 py-3.5 text-white placeholder-blue-200 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
                        />
                      </>
                    )}
                    {step === 2 && (
                      <>
                        <label className="block text-sm font-semibold text-blue-100">Desired Course</label>
                        <select
                          value={formData.course}
                          onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                          className="w-full rounded-xl border border-white/30 bg-[#003f9f] px-4 py-3.5 text-white outline-none focus:border-amber-400"
                        >
                          <option value="">-- Course Select करें --</option>
                          <optgroup label="Teaching">
                            <option>B.Ed</option><option>D.El.Ed</option><option>M.Ed</option>
                          </optgroup>
                          <optgroup label="Medical & Nursing">
                            <option>MBBS</option><option>BDS</option><option>B.Sc Nursing</option>
                            <option>GNM</option><option>ANM</option><option>B.Pharma</option>
                          </optgroup>
                          <optgroup label="Technical & Management">
                            <option>B.Tech</option><option>Polytechnic</option><option>ITI</option>
                            <option>BCA</option><option>MCA</option><option>BBA</option><option>MBA</option>
                          </optgroup>
                          <option>अभी decide नहीं किया</option>
                        </select>
                      </>
                    )}
                    {step === 3 && (
                      <>
                        <label className="block text-sm font-semibold text-blue-100">Current Qualification</label>
                        <select
                          value={formData.qualify}
                          onChange={(e) => setFormData({ ...formData, qualify: e.target.value })}
                          className="w-full rounded-xl border border-white/30 bg-[#003f9f] px-4 py-3.5 text-white outline-none focus:border-amber-400"
                        >
                          <option value="">-- Select Qualification --</option>
                          <option>10th Pass</option>
                          <option>12th Pass (Arts)</option>
                          <option>12th Pass (Science)</option>
                          <option>12th Pass (Commerce)</option>
                          <option>Graduation</option>
                          <option>Post Graduation</option>
                        </select>
                      </>
                    )}

                    <div className="flex gap-2 pt-1">
                      {step > 0 && (
                        <button onClick={() => setStep(step - 1)} className="flex-1 rounded-xl border border-white/40 py-3.5 font-semibold text-white transition hover:bg-white/10">
                          Back
                        </button>
                      )}
                      <button
                        onClick={nextStep}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-400 py-3.5 font-extrabold text-gray-900 transition hover:bg-amber-300 active:scale-95"
                      >
                        {step < STEPS.length - 1 ? <>Next <ArrowRight size={16} /></> : "Submit & WhatsApp करें 🚀"}
                      </button>
                    </div>
                  </div>
                  <p className="mt-4 text-center text-xs text-blue-200">100% Free | No spam | Privacy protected</p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div className="bg-gray-900 py-4">
        <div className="container-shell">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-semibold text-gray-300">
            {[
              [ShieldCheck, "NCTE & UGC Approved"],
              [Award, "9+ Years Experience"],
              [Users, "5000+ Students Placed"],
              [CheckCircle2, "Zero Hidden Charges"],
            ].map(([Icon, text], i) => (
              <span key={i} className="flex items-center gap-2">
                {/* @ts-ignore */}
                <Icon size={16} className="text-amber-400" />
                {text as string}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── COURSES SECTION ── */}
      <section id="courses" className="py-24 bg-gray-50">
        <div className="container-shell">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-primary-blue mb-2">सभी Streams Available</p>
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold">अपना Stream चुनें</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              3 main streams — 40+ courses — सभी के लिए expert guidance available
            </p>
          </div>

          {/* Stream Tabs */}
          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {streamTabs.map(({ key, label, icon: Icon, color }) => {
              const c = colorMap[color];
              const isActive = activeStream === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveStream(key)}
                  className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold border-2 transition-all ${
                    isActive
                      ? `${c.active} text-white border-transparent shadow-lg`
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              );
            })}
          </div>

          {/* Course Cards Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stream.courses.map((course) => (
              <div
                key={course.name}
                className={`group relative rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-sm transition-all card-lift ${colors.card}`}
              >
                <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${colors.badge}`}>
                  <Award size={12} /> {course.name}
                </div>

                <h3 className="mt-4 font-headline text-xl font-extrabold text-gray-900">{course.full}</h3>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-400" />
                    <span><strong>Duration:</strong> {course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-gray-400" />
                    <span><strong>Eligibility:</strong> {course.eligibility}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard size={14} className="text-gray-400" />
                    <span><strong>Approx. Fee:</strong> {course.fee}</span>
                  </div>
                </div>

                <a
                  href={`https://wa.me/916203138576?text=Hi! I want to inquire about ${course.name} (${course.full}). Please guide me.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white transition ${colors.btn}`}
                >
                  Inquire Fee & Admission <ArrowRight size={15} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BSCC SECTION ── */}
      <section id="bscc" className="py-24 bg-gradient-to-br from-[#003f9f] to-[#001f6b] text-white relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-amber-400 opacity-10 blur-3xl" />
        <div className="container-shell relative">
          {/* Banner */}
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-sm font-bold text-amber-300">
              <CreditCard size={16} /> Bihar Government Scheme
            </div>
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold">
              Bihar Student Credit Card{" "}
              <span className="text-amber-400">(BSCC)</span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-blue-100 text-lg">
              सरकारी योजना के तहत <strong className="text-white">Free Education, Fooding, और Lodging</strong> पाएं।
              BSCC से ₹4 Lakh तक का education loan — <strong className="text-amber-400">4% सालाना ब्याज</strong> पर।
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-2 items-start">
            {/* Benefits */}
            <div className="space-y-5">
              <h3 className="font-headline text-2xl font-extrabold text-amber-400">BSCC में क्या मिलता है?</h3>
              {[
                ["₹4 Lakh तक Loan", "Tuition fee, hostel, food, books सब covered"],
                ["4% Simple Interest", "महिलाओं और दिव्यांगों के लिए 1% ब्याज"],
                ["40+ Courses Covered", "B.Ed, Nursing, B.Tech, BBA, MBBS और भी बहुत कुछ"],
                ["No Collateral Required", "कोई गारंटर नहीं, कोई property mortgage नहीं"],
                ["Repay After Job", "नौकरी मिलने के बाद loan repay करें"],
              ].map(([title, desc]) => (
                <div key={title as string} className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="mt-0.5 flex-shrink-0 rounded-full bg-green-500 p-1">
                    <Check size={14} />
                  </div>
                  <div>
                    <p className="font-bold text-white">{title}</p>
                    <p className="text-sm text-blue-200">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Eligibility Checker */}
            <div className="rounded-2xl border border-white/20 bg-white/10 p-7 backdrop-blur-xl">
              <h3 className="font-headline text-xl font-extrabold mb-5">
                Check BSCC Eligibility
              </h3>

              {bsccEligible === null ? (
                <form onSubmit={handleBsccCheck} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-blue-100">क्या आप Bihar के निवासी हैं?</label>
                    <div className="flex gap-3">
                      {["yes", "no"].map((val) => (
                        <label key={val} className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 py-3 text-sm font-bold transition hover:bg-white/20">
                          <input type="radio" name="bihar" value={val} onChange={(e) => setBsccBihar(e.target.value)} className="accent-amber-400" required />
                          {val === "yes" ? "हाँ (Yes)" : "नहीं (No)"}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-blue-100">परिवार की वार्षिक आय?</label>
                    <select
                      value={bsccIncome}
                      onChange={(e) => setBsccIncome(e.target.value)}
                      required
                      className="w-full rounded-xl border border-white/30 bg-[#003f9f] px-4 py-3 text-white outline-none"
                    >
                      <option value="">Select Income</option>
                      <option value="below">₹4.5 Lakh से कम</option>
                      <option value="above">₹4.5 Lakh से अधिक</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-blue-100">आपकी उम्र (Age)</label>
                    <input
                      type="number"
                      value={bsccAge}
                      onChange={(e) => setBsccAge(e.target.value)}
                      placeholder="e.g. 19"
                      min={14}
                      max={35}
                      required
                      className="w-full rounded-xl border border-white/30 bg-white/20 px-4 py-3 text-white placeholder-blue-300 outline-none"
                    />
                  </div>

                  <button type="submit" className="w-full rounded-xl bg-amber-400 py-3.5 font-extrabold text-gray-900 transition hover:bg-amber-300 active:scale-95">
                    Check Eligibility Now →
                  </button>
                </form>
              ) : bsccEligible ? (
                <div className="py-4 text-center space-y-4">
                  <CheckCircle2 size={52} className="mx-auto text-green-400" />
                  <h4 className="font-headline text-2xl font-extrabold text-green-300">🎉 आप Eligible हैं!</h4>
                  <p className="text-blue-100">आप Bihar Student Credit Card के लिए apply कर सकते हैं। हमारे experts आपको पूरा process guide करेंगे।</p>
                  <a
                    href="https://wa.me/916203138576?text=Hi! I checked BSCC eligibility on your website and I am eligible. Please guide me for the application process."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-bold text-white hover:bg-green-600"
                  >
                    <MessageCircle size={18} /> BSCC Apply करें
                  </a>
                  <button onClick={() => { setBsccEligible(null); setBsccBihar(""); setBsccIncome(""); setBsccAge(""); }} className="block w-full text-center text-sm text-blue-300 underline mt-2">
                    फिर से Check करें
                  </button>
                </div>
              ) : (
                <div className="py-4 text-center space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/20">
                    <X size={28} className="text-orange-400" />
                  </div>
                  <h4 className="font-headline text-xl font-extrabold text-orange-300">Currently Not Eligible</h4>
                  <p className="text-blue-100 text-sm">BSCC के लिए Bihar domicile, age ≤ 25, और family income ≤ ₹4.5L जरूरी है। लेकिन हम आपके लिए education loan के अन्य options खोज सकते हैं।</p>
                  <a href="tel:+916203138576" className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-6 py-3 font-bold text-white hover:bg-white/30">
                    <Phone size={16} /> Call for Other Options
                  </a>
                  <button onClick={() => { setBsccEligible(null); setBsccBihar(""); setBsccIncome(""); setBsccAge(""); }} className="block w-full text-center text-sm text-blue-300 underline">
                    फिर से Check करें
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section id="why-us" className="py-24 bg-white">
        <div className="container-shell">
          <div className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-widest text-primary-red mb-2">हमारी विशेषता</p>
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold">सिर्फ Admission नहीं, सही Career</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ShieldCheck, color: "bg-blue-600", title: "100% Transparent", desc: "No hidden charges. Every fee clearly explained upfront." },
              { icon: Users, color: "bg-primary-red", title: "Dedicated Counsellor", desc: "One personal expert with you from inquiry to admission." },
              { icon: BadgeCheck, color: "bg-green-600", title: "Document Assistance", desc: "We handle all paperwork, forms, and verifications." },
              { icon: Sparkles, color: "bg-amber-500", title: "BSCC Specialist", desc: "Complete guidance for Bihar Student Credit Card scheme." },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="group rounded-2xl border-2 border-gray-100 bg-gray-50 p-6 text-center transition hover:border-blue-200 hover:bg-white hover:shadow-lg card-lift">
                <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${color} text-white shadow-md`}>
                  <Icon size={26} />
                </div>
                <h3 className="font-headline text-lg font-extrabold">{title}</h3>
                <p className="mt-2 text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>

          {/* Process Steps */}
          <div className="mt-20 rounded-2xl bg-gradient-to-r from-primary-green to-green-600 p-8 md:p-12 text-white">
            <h3 className="font-headline text-3xl font-extrabold text-center mb-10">Admission कैसे मिलता है? Simple 4 Steps</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { step: "01", title: "Call या WhatsApp करें", desc: "हमसे contact करें — free में बात करें" },
                { step: "02", title: "Profile Share करें", desc: "Marks, budget, और goals बताएं" },
                { step: "03", title: "Best Options पाएं", desc: "Top colleges और courses की list मिलेगी" },
                { step: "04", title: "Admission Confirm", desc: "Documents से admission तक — हम साथ हैं" },
              ].map(({ step, title, desc }, i) => (
                <div key={step} className="relative">
                  {i < 3 && <div className="absolute hidden lg:block -right-3 top-7 text-white/30 text-2xl font-bold">→</div>}
                  <div className="rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur">
                    <span className="font-headline text-4xl font-extrabold text-white/30">{step}</span>
                    <h4 className="mt-2 font-headline font-bold text-lg">{title}</h4>
                    <p className="mt-1 text-sm text-green-100">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SUCCESS STORIES ── */}
      <section className="py-24 bg-gray-50">
        <div className="container-shell">
          <div className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-widest text-primary-blue mb-2">Success Stories</p>
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold">हमारे Students की Achievements</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: "Priya Kumari", course: "B.Ed (2024)", text: "Counsellor ने बहुत अच्छे से guide किया। BSCC loan में भी help मिली। Admission एकदम tension-free था।" },
              { name: "Aman Raj", course: "B.Pharma (2023)", text: "शुरू से आखिर तक सब transparent रहा। Documents से लेकर hostel तक — perfect support मिला।" },
              { name: "Sakshi Jha", course: "B.Sc Nursing (2024)", text: "Nursing में career के लिए confused था। यहाँ की guidance से सही college मिला और BSCC भी apply हुआ।" },
            ].map(({ name, course, text }) => (
              <article key={name} className="rounded-2xl bg-white border-2 border-gray-100 p-7 shadow-sm card-lift hover:border-blue-100">
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                </div>
                <p className="text-gray-700 leading-relaxed">"{text}"</p>
                <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-blue font-bold text-white text-lg">
                    {name[0]}
                  </div>
                  <div>
                    <p className="font-headline font-extrabold text-gray-900">{name}</p>
                    <p className="text-sm text-gray-500">{course}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ACCORDION ── */}
      <section id="faq" className="py-24 bg-white">
        <div className="container-shell">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-primary-blue mb-3">FAQ</p>
              <h2 className="font-headline text-4xl font-extrabold">अक्सर पूछे जाने वाले सवाल</h2>
              <p className="mt-4 text-gray-500">Direct बात करना चाहते हैं?</p>
              <div className="mt-6 space-y-3">
                {[["6203138576", "Rajesh Kr. Sah"], ["7858062498", "Counsellor 2"], ["9472813581", "Counsellor 3"]].map(([num, name]) => (
                  <a key={num} href={`tel:+91${num}`} className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 font-semibold text-gray-700 transition hover:border-primary-blue hover:text-primary-blue">
                    <Phone size={18} className="text-primary-blue" />
                    <div>
                      <div className="font-bold">+91 {num}</div>
                      <div className="text-xs text-gray-400">{name}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 overflow-hidden">
              {faqs.map(({ q, a }, i) => (
                <div key={q}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-headline font-bold text-lg text-gray-900 hover:bg-gray-50 transition"
                  >
                    <span>{q}</span>
                    <ChevronDown size={22} className={`flex-shrink-0 text-primary-blue transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                      {a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT & LOCATION ── */}
      <section id="contact" className="py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container-shell">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left — contact info */}
            <div>
              <p className="text-sm font-bold uppercase tracking-widest mb-3 text-amber-400">हमसे मिलें</p>
              <h2 className="font-headline text-4xl md:text-5xl font-extrabold mb-6">
                Visit Us or Call Now
              </h2>

              {/* Location card */}
              <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary-blue">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h3 className="font-headline text-lg font-extrabold text-white">Office Address</h3>
                    <p className="mt-1 text-gray-300">College Chowk, Near HP Petrol Pump</p>
                    <p className="text-gray-300">Forbesganj, Araria — Bihar</p>
                    <a
                      href="https://maps.google.com/?q=College+Chowk+Forbesganj+Araria+Bihar"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-amber-400 hover:text-amber-300"
                    >
                      Open in Google Maps →
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {[["6203138576", "Primary Contact"], ["7858062498", "Admission Helpline"], ["9472813581", "BSCC Enquiry"]].map(([num, label]) => (
                  <a key={num} href={`tel:+91${num}`} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10 hover:border-amber-400/40">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-blue">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-white">+91 {num}</p>
                      <p className="text-xs text-gray-400">{label}</p>
                    </div>
                  </a>
                ))}
              </div>

              <a
                href="https://wa.me/916203138576"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-xl bg-green-500 px-6 py-3.5 font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-400"
              >
                <MessageCircle size={20} /> WhatsApp पर Chat करें
              </a>
            </div>

            {/* Right — multi-step form (duplicate for contact section) */}
            <div className="rounded-2xl bg-white p-8 text-gray-900 shadow-xl">
              <h3 className="font-headline text-2xl font-extrabold mb-2">Admission Plan बनाइए</h3>
              <p className="text-gray-500 text-sm mb-6">Fill the form and our counsellor will call within 30 minutes.</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = e.currentTarget as HTMLFormElement;
                  const name = (f.elements.namedItem("cname") as HTMLInputElement).value;
                  const mobile = (f.elements.namedItem("cmobile") as HTMLInputElement).value;
                  const course = (f.elements.namedItem("ccourse") as HTMLSelectElement).value;
                  const msg = `New Inquiry!%0AName: ${name}%0AMobile: ${mobile}%0ACourse: ${course}`;
                  window.open(`https://wa.me/916203138576?text=${msg}`, "_blank");
                }}
                className="space-y-4"
              >
                <input name="cname" required placeholder="पूरा नाम (Full Name)" className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 outline-none focus:border-primary-blue transition" />
                <input name="cmobile" required type="tel" placeholder="Mobile Number" className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 outline-none focus:border-primary-blue transition" />
                <select name="ccourse" className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-gray-600 outline-none focus:border-primary-blue bg-white transition">
                  <option value="">-- Course Select करें --</option>
                  <option>B.Ed / D.El.Ed</option>
                  <option>B.Sc Nursing / GNM / ANM</option>
                  <option>B.Pharma / D.Pharma</option>
                  <option>MBBS / BDS</option>
                  <option>BBA / MBA</option>
                  <option>B.Tech / Polytechnic / ITI</option>
                  <option>BCA / MCA</option>
                  <option>अभी decide नहीं किया</option>
                </select>
                <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary-blue py-4 font-extrabold text-white transition hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95">
                  Free Counselling Book करें <ArrowRight size={18} />
                </button>
              </form>
              <p className="mt-4 text-center text-xs text-gray-400">100% Free. No spam. No hidden charges.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-950 text-gray-500 py-12">
        <div className="container-shell">
          <div className="grid gap-8 md:grid-cols-4 mb-8 pb-8 border-b border-gray-800">
            <div>
              <div className="flex items-center gap-2 text-white font-headline font-extrabold text-lg mb-3">
                <GraduationCap size={22} className="text-primary-blue" />
                SIKSHA<span className="text-primary-red">WALLAH</span>
              </div>
              <p className="text-sm leading-relaxed">
                Forbesganj's most trusted admission consultancy. 5,000+ students guided since 2015.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                {[["#courses", "Courses"], ["#bscc", "BSCC Scheme"], ["#why-us", "Why Us"], ["#faq", "FAQ"], ["#contact", "Contact"]].map(([href, label]) => (
                  <li key={href}><a href={href} className="hover:text-white transition">{label}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Courses</h4>
              <ul className="space-y-2 text-sm">
                {["B.Ed / D.El.Ed", "B.Sc Nursing / GNM", "B.Pharma / D.Pharma", "BBA / MBA", "B.Tech / Polytechnic", "MBBS / BDS"].map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Contact</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <MapPin size={15} className="mt-0.5 text-amber-400 flex-shrink-0" />
                  College Chowk, Near HP Petrol Pump, Forbesganj, Araria
                </li>
                {["6203138576", "7858062498", "9472813581"].map((num) => (
                  <li key={num}>
                    <a href={`tel:+91${num}`} className="flex items-center gap-2 hover:text-white transition">
                      <Phone size={13} /> +91 {num}
                    </a>
                  </li>
                ))}
                <li>
                  <a href="https://wa.me/916203138576" className="flex items-center gap-2 text-green-400 hover:text-green-300 transition">
                    <MessageCircle size={13} /> WhatsApp Chat
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-sm">
            <p>© 2026 Siksha Wallah. All rights reserved. | College Chowk, Forbesganj, Araria, Bihar</p>
            <p>Trusted admission partner — B.Ed • Nursing • Engineering • Management</p>
          </div>
        </div>
      </footer>

      {/* ── FLOATING WHATSAPP WIDGET ── */}
      <a
        href="https://wa.me/916203138576?text=Hi! I need admission guidance from Siksha Wallah."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-green-500 px-4 py-3.5 text-white shadow-2xl shadow-green-500/40 transition hover:scale-105 hover:bg-green-400 active:scale-95 group"
      >
        <MessageCircle size={24} fill="currentColor" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap font-bold text-sm transition-all duration-300 group-hover:max-w-xs">
          Chat Now
        </span>
      </a>

      {/* ── FLOATING APPLY BUTTON (mobile sticky CTA) ── */}
      <div className="fixed bottom-24 right-6 z-50 lg:hidden">
        <a
          href="#inquiry"
          className="flex items-center gap-2 rounded-full bg-primary-red px-4 py-3 text-sm font-bold text-white shadow-xl shadow-red-500/30 transition hover:bg-red-600"
        >
          Apply Now <ArrowRight size={15} />
        </a>
      </div>
    </main>
  );
}
