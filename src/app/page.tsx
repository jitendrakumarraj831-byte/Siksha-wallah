"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { saveInquiry } from "@/services/inquiry-service";
import { saveActivity } from "@/services/activity-service";
import {
  ArrowRight, BadgeCheck, BookOpen, Building2, Check,
  ChevronDown, CreditCard, GraduationCap, MapPin,
  MessageCircle, Phone, ShieldCheck, Sparkles, Star, Users, X,
  Clock, Award, CheckCircle2,
  Briefcase, BookMarked, ChevronUp, FileText, ListChecks, TrendingUp,
  Stethoscope, Scale, Cpu, FlaskConical, Landmark,
} from "lucide-react";
import Image from "next/image";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { CountUp } from "@/components/count-up";
import { AnimateIn } from "@/components/animate-in";
import { ReviewsCarousel } from "@/components/reviews-carousel";
import { streamTabs, colorMap, faqs, getCourseSlug, type StreamKey } from "@/lib/courses-data";
import { successStories } from "@/lib/reviews-data";


/* ─── Homepage Stream Cards ───────────────────────────────────────── */
const STREAM_DESCRIPTIONS: Record<StreamKey, string> = {
  teaching:    "B.Ed, D.El.Ed, B.P.Ed & M.Ed — सरकारी शिक्षक बनें। STET / CTET के साथ एक guaranteed teaching career।",
  medical:     "MBBS, Nursing, Pharmacy और more — Doctor, Nurse या Pharmacist बनने का पूरा रास्ता।",
  paramedical: "Lab, Physiotherapy, OT, Radiology — बिना NEET के healthcare में strong career।",
  law:         "LLB, BA.LLB, BBA.LLB & LLM — Advocate, Judge या Corporate Lawyer बनें।",
  technical:   "B.Tech, Polytechnic, BCA, MBA और more — Engineering, IT और Management courses।",
};

function StreamCards() {
  const router = useRouter();

  return (
    <div className="container-shell">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
        {streamTabs.map((tab) => {
          const c = colorMap[tab.color];
          const Icon = tab.icon;
          return (
            <div
              key={tab.key}
              role="link"
              tabIndex={0}
              aria-label={`Explore ${tab.label} courses`}
              onClick={() => router.push(`/courses#${tab.key}`)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") router.push(`/courses#${tab.key}`); }}
              className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer h-full"
            >
              {/* Icon + course count */}
              <div className="flex items-center justify-between">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${c.gradient} text-white shadow-md`}>
                  <Icon size={26} />
                </div>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold ${c.badge}`}>
                  {tab.courses.length} Courses
                </span>
              </div>

              {/* Title + short description */}
              <h3 className="mt-4 font-headline text-lg font-extrabold text-gray-900">{tab.label}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-gray-500">
                {STREAM_DESCRIPTIONS[tab.key as StreamKey]}
              </p>

              {/* Primary CTA: Explore Courses — same action as card click */}
              <Link
                href={`/courses#${tab.key}`}
                onClick={(e) => e.stopPropagation()}
                className={`mt-5 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${c.gradient} py-3 text-sm font-extrabold text-white shadow-sm transition-all group-hover:gap-2.5`}
              >
                <BookOpen size={16} /> Explore Courses
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </Link>

              {/* Lead-gen: Apply Now + WhatsApp — stop propagation so card click doesn't fire */}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link
                  href="/apply"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-primary-blue py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
                >
                  <GraduationCap size={13} /> Apply Now
                </Link>
                <a
                  href={`https://wa.me/916203138576?text=${encodeURIComponent(`नमस्ते! मुझे ${tab.label} के courses के बारे में जानकारी चाहिए।`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-green-500 py-2.5 text-xs font-bold text-green-700 transition hover:bg-green-500 hover:text-white"
                >
                  <MessageCircle size={13} /> WhatsApp
                </a>
              </div>
            </div>
          );
        })}

        {/* 6th cell — "help choosing" keeps the grid balanced and adds lead-gen */}
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 p-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md">
            <Sparkles size={26} />
          </div>
          <div>
            <h3 className="font-headline text-lg font-extrabold text-gray-900">कौन सा course सही है?</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
              हमारे counsellor से बात करें — आपकी marks, budget और goal के हिसाब से सही course चुनें।
            </p>
          </div>
          <div className="grid w-full grid-cols-2 gap-2">
            <Link
              href="/apply"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-primary-blue py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
            >
              <GraduationCap size={13} /> Apply Now
            </Link>
            <a
              href={`https://wa.me/916203138576?text=${encodeURIComponent("नमस्ते! मुझे सही course choose करने में guidance चाहिए।")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-green-500 py-2.5 text-xs font-bold text-green-700 transition hover:bg-green-500 hover:text-white"
            >
              <MessageCircle size={13} /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ─── College Slider Component ────────────────────────────────────────── */
type CollegeItem = { name: string; location: string; stream: string; img: string; href: string };

function CollegeSlider({ colleges }: { colleges: readonly CollegeItem[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const n = colleges.length;

  const prev = useCallback(() => setActive(a => (a - 1 + n) % n), [n]);
  const next = useCallback(() => setActive(a => (a + 1) % n), [n]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [paused, next]);

  return (
    <div
      className="relative mt-8 overflow-hidden rounded-2xl"
      style={{ height: "220px" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={e => { touchStartX.current = e.touches[0].clientX; setPaused(true); }}
      onTouchEnd={e => {
        if (touchStartX.current !== null) {
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
          touchStartX.current = null;
        }
        setPaused(false);
      }}
    >
      {/* Slides */}
      {colleges.map((col, i) => (
        <div
          key={col.name}
          aria-hidden={i !== active}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === active ? 1 : 0, pointerEvents: i === active ? "auto" : "none" }}
        >
          <Link href={col.href} className="block w-full h-full group" style={{ touchAction: "manipulation" }}>
            <Image
              src={col.img}
              alt={col.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width:768px) 100vw, 560px"
              priority={i === 0}
              loading={i === 0 ? "eager" : "lazy"}
              quality={75}
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* College info */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-end justify-between gap-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-0.5">🏛️ Partner College</p>
                  <h4 className="font-headline text-base font-extrabold text-white leading-tight">{col.name}</h4>
                  <p className="flex items-center gap-1 text-[11px] text-white/70 mt-0.5">
                    <MapPin size={9} className="text-amber-400" /> {col.location}
                  </p>
                  <p className="text-[10px] text-blue-200 mt-1 font-medium">{col.stream}</p>
                </div>
                <div className="flex-shrink-0 rounded-xl bg-amber-400 px-3 py-1.5 text-[11px] font-extrabold text-gray-900 shadow-lg group-hover:bg-amber-300 transition-colors">
                  Details →
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}

      {/* Left / Right arrows */}
      <button
        onClick={prev}
        aria-label="Previous college"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 active:scale-90 transition-all"
        style={{ touchAction: "manipulation" }}
      >
        <ChevronDown size={16} className="rotate-90" />
      </button>
      <button
        onClick={next}
        aria-label="Next college"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 active:scale-90 transition-all"
        style={{ touchAction: "manipulation" }}
      >
        <ChevronDown size={16} className="-rotate-90" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
        {colleges.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${i === active ? "w-5 h-1.5 bg-amber-400" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/60"}`}
            style={{ touchAction: "manipulation" }}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute top-3 right-3 z-20 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-bold text-white/80 backdrop-blur-sm">
        {active + 1} / {n}
      </div>
    </div>
  );
}


/* ─── Multi-step Form ─────────────────────────────── */
const STEPS = ["Name", "Mobile", "Course", "Qualify"];

/* ─── Partner College Modal Data ───────────────────────────────────────── */
type CollegeCategory = {
  category: string;
  icon: React.ElementType;
  iconBg: string;
  approval: string;
  count: string;
  countColor: string;
  color: string;
  accentText: string;
  colleges: readonly string[];
  courses: string[];
  location: string;
  whatsappMsg: string;
};

const PARTNER_COLLEGES: CollegeCategory[] = [
  {
    category: "Teaching Colleges",
    icon: BookMarked,
    color: "border-blue-200 bg-blue-50",
    iconBg: "bg-blue-600",
    count: "60+",
    countColor: "text-blue-700",
    accentText: "text-blue-700",
    approval: "NCTE Approved",
    colleges: [
      "Patna Teachers Training College",
      "Nalanda B.Ed College",
      "Purnea College of Education",
      "Darbhanga Education Institute",
      "Gaya Teachers College",
      "Bhagalpur B.Ed Institute",
      "Samastipur College of Education",
      "Muzaffarpur Teachers College",
    ],
    courses: ["B.Ed", "D.El.Ed", "B.P.Ed", "M.Ed"],
    location: "Patna, Nalanda, Purnea, Darbhanga, Gaya और पूरे Bihar में",
    whatsappMsg: "नमस्ते! मुझे Teaching (B.Ed/D.El.Ed) के लिए partner colleges की full list चाहिए।",
  },
  {
    category: "Medical & Nursing",
    icon: Stethoscope,
    color: "border-red-200 bg-red-50",
    iconBg: "bg-red-600",
    count: "50+",
    countColor: "text-red-700",
    accentText: "text-red-700",
    approval: "INC / PCI Approved",
    colleges: [
      "Patna Nursing Institute",
      "PMCH Affiliated Colleges",
      "Bhagalpur Medical Institute",
      "Muzaffarpur Nursing College",
      "Saharsa Healthcare Institute",
      "Darbhanga Nursing School",
      "Gaya Medical Nursing College",
      "Ara Nursing & Para Medical",
    ],
    courses: ["MBBS (Guidance)", "B.Sc Nursing", "GNM", "ANM", "B.Pharma", "D.Pharma", "BMLT"],
    location: "Patna, Muzaffarpur, Bhagalpur, Darbhanga, Gaya और आस-पास",
    whatsappMsg: "नमस्ते! मुझे Medical & Nursing colleges की full list चाहिए।",
  },
  {
    category: "Engineering & IT",
    icon: Cpu,
    color: "border-orange-200 bg-orange-50",
    iconBg: "bg-orange-500",
    count: "40+",
    countColor: "text-orange-700",
    accentText: "text-orange-700",
    approval: "AICTE Approved",
    colleges: [
      "NIT Patna (Guidance)",
      "BCECE Affiliated Colleges",
      "Motihari Engineering College",
      "Purnea Polytechnic Institute",
      "Katihar Technical College",
      "Bhagalpur Engineering College",
      "Muzaffarpur Institute of Tech.",
      "Chandragupt Institute Patna",
    ],
    courses: ["B.Tech", "Polytechnic", "ITI", "BCA", "MCA", "BBA", "MBA"],
    location: "Patna, Motihari, Purnea, Katihar, Bhagalpur और Bihar भर में",
    whatsappMsg: "नमस्ते! मुझे Engineering & IT colleges की full list चाहिए।",
  },
  {
    category: "Law Colleges",
    icon: Scale,
    color: "border-slate-200 bg-slate-50",
    iconBg: "bg-slate-700",
    count: "20+",
    countColor: "text-slate-700",
    accentText: "text-slate-700",
    approval: "BCI Approved",
    colleges: [
      "Patna Law College",
      "Chanakya National Law University",
      "BN Mandal University Law Dept.",
      "Lalit Narayan Law College",
      "Tilka Manjhi Law College",
      "Bhagalpur Law College",
      "Muzaffarpur Law Institute",
      "Gaya College Law Dept.",
    ],
    courses: ["LLB (3-year)", "BA.LLB (5-year)", "BBA.LLB (5-year)", "LLM"],
    location: "Patna, Bhagalpur, Muzaffarpur, Gaya, Madhepura",
    whatsappMsg: "नमस्ते! मुझे Law colleges की full list चाहिए।",
  },
  {
    category: "Pharmacy Colleges",
    icon: FlaskConical,
    color: "border-green-200 bg-green-50",
    iconBg: "bg-green-600",
    count: "30+",
    countColor: "text-green-700",
    accentText: "text-green-700",
    approval: "PCI Approved",
    colleges: [
      "Patna Pharmacy College",
      "Bhagalpur College of Pharmacy",
      "Darbhanga Pharma Institute",
      "Bihar Pharmacy College",
      "Gaya Pharmacy Institute",
      "Muzaffarpur Pharma School",
      "Purnea Pharma College",
      "Ara Pharmacy Institute",
    ],
    courses: ["B.Pharma", "D.Pharma"],
    location: "Patna, Bhagalpur, Darbhanga, Muzaffarpur, Gaya",
    whatsappMsg: "नमस्ते! मुझे Pharmacy colleges की full list चाहिए।",
  },
  {
    category: "Para Medical",
    icon: Award,
    color: "border-purple-200 bg-purple-50",
    iconBg: "bg-purple-600",
    count: "40+",
    countColor: "text-purple-700",
    accentText: "text-purple-700",
    approval: "MCI / State Approved",
    colleges: [
      "Patna Allied Health College",
      "PMCH Para Medical Institute",
      "Muzaffarpur Health Institute",
      "Samastipur Para Medical College",
      "Begusarai Healthcare Academy",
      "Darbhanga Para Medical School",
      "Bhagalpur Allied Health Inst.",
      "Gaya Para Medical College",
    ],
    courses: ["B.P.T", "B.O.T.T", "B.R.I.T", "B.M.L.T", "D.M.L.T", "DMRT (X-Ray)", "OPT"],
    location: "Patna, Muzaffarpur, Bhagalpur, Samastipur, Darbhanga",
    whatsappMsg: "नमस्ते! मुझे Para Medical colleges की full list चाहिए।",
  },
];

/* ─── FAQ card styling by topic group ───────────────────────────────────── */
function getFaqStyle(i: number) {
  if (i < 4)  return { label: "Counselling",     bar: "from-blue-600 to-indigo-600",  border: "border-blue-200",   tag: "bg-blue-100 text-blue-700",     text: "text-blue-700" };
  if (i < 9)  return { label: "Course Selection", bar: "from-green-600 to-emerald-600", border: "border-green-200",  tag: "bg-green-100 text-green-700",   text: "text-green-700" };
  if (i < 12) return { label: "Admission",        bar: "from-sky-600 to-blue-700",     border: "border-sky-200",    tag: "bg-sky-100 text-sky-700",       text: "text-sky-700" };
  if (i < 15) return { label: "BSCC Loan",        bar: "from-amber-500 to-orange-600", border: "border-amber-200",  tag: "bg-amber-100 text-amber-700",   text: "text-amber-700" };
  return            { label: "Fees & Expenses",  bar: "from-indigo-600 to-purple-600", border: "border-indigo-200", tag: "bg-indigo-100 text-indigo-700", text: "text-indigo-700" };
}

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const faqSliderRef = useRef<HTMLDivElement>(null);
  const autoSlideTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const userInteracting = useRef(false);

  useEffect(() => setMounted(true), []);

  // Lock body scroll when modal is open (prevents iOS safari modal issues)
  useEffect(() => {
    if (openFaq !== null) {
      document.body.style.setProperty("overflow", "hidden", "important");
    } else {
      document.body.style.removeProperty("overflow");
    }
    return () => { document.body.style.removeProperty("overflow"); };
  }, [openFaq]);

  const startAutoSlide = useCallback(() => {
    if (autoSlideTimer.current) clearInterval(autoSlideTimer.current);
    autoSlideTimer.current = setInterval(() => {
      const slider = faqSliderRef.current;
      if (!slider || userInteracting.current) return;
      const card = slider.querySelector("button") as HTMLElement | null;
      const cardWidth = (card?.offsetWidth ?? 280) + 16; // +gap
      const maxScroll = slider.scrollWidth - slider.clientWidth - 2;
      // instant scroll so mobile doesn't suppress taps during animation
      slider.scrollLeft = slider.scrollLeft + cardWidth >= maxScroll ? 0 : slider.scrollLeft + cardWidth;
    }, 3000);
  }, []);

  useEffect(() => {
    if (openFaq !== null) {
      if (autoSlideTimer.current) clearInterval(autoSlideTimer.current);
      return;
    }
    startAutoSlide();
    return () => { if (autoSlideTimer.current) clearInterval(autoSlideTimer.current); };
  }, [openFaq, startAutoSlide]);
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [bsccEligible, setBsccEligible] = useState<null | boolean>(null);
  const [bsccIncome, setBsccIncome] = useState("");
  const [bsccBihar, setBsccBihar] = useState("");
  const [bsccAge, setBsccAge] = useState("");
  const [selectedCollege, setSelectedCollege] = useState<CollegeCategory | null>(null);
  const [loanAmount, setLoanAmount] = useState(200000);

  // Multi-step form
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ name: "", mobile: "", course: "", district: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  function isStepValid() {
    if (step === 0) return formData.name.trim().length >= 2;
    if (step === 1) return /^\d{10}$/.test(formData.mobile);
    if (step === 2) return formData.course.trim() !== "";
    if (step === 3) return formData.district.trim() !== "";
    return true;
  }

  function handleBsccCheck(e: React.FormEvent) {
    e.preventDefault();
    const eligible =
      bsccBihar === "yes" &&
      bsccAge !== "" &&
      parseInt(bsccAge) <= 25 &&
      bsccIncome === "below";
    setBsccEligible(eligible);
    saveActivity({
      type: "course_view",
      title: "BSCC Eligibility Checked",
      description: eligible ? "Eligible — Bihar resident, age ≤25, income below 4.5L" : "Not eligible",
      page: "/",
      meta: { bihar: bsccBihar, age: bsccAge, income: bsccIncome, result: eligible ? "eligible" : "not_eligible" },
    });
  }

  function nextStep() {
    if (!isStepValid()) {
      setFormError(
        step === 0 ? "कृपया अपना पूरा नाम दर्ज करें।" :
        step === 1 ? "कृपया एक सही 10-अंकों का mobile number दर्ज करें।" :
        step === 2 ? "कृपया एक course चुनें।" :
        "कृपया अपना ज़िला चुनें।"
      );
      return;
    }
    setFormError("");
    if (step < STEPS.length - 1) setStep(step + 1);
    else {
      setFormSubmitted(true);
      saveInquiry({ fullName: formData.name, mobile: formData.mobile, course: formData.course, qualification: formData.district, message: `District: ${formData.district}` }).catch(() => {});
      // Log inquiry activity
      saveActivity({
        type: "inquiry",
        title: "📋 New Inquiry Submitted",
        description: `${formData.name} → ${formData.course} (${formData.district})`,
        name: formData.name,
        mobile: formData.mobile,
        course: formData.course,
        page: "/",
      });
      const msg = encodeURIComponent(`नमस्ते! मेरा नाम ${formData.name} है।\nMobile: ${formData.mobile}\nAdmission चाहिए: ${formData.course}\nJila: ${formData.district}\nKripya guide karein.`);
      // Log WhatsApp click
      saveActivity({
        type: "whatsapp",
        title: "📱 WhatsApp Opened",
        description: `${formData.name} ne WhatsApp click kiya — ${formData.course}`,
        name: formData.name,
        mobile: formData.mobile,
        page: "/",
      });
      window.open(`https://wa.me/916203138576?text=${msg}`, "_blank");
    }
  }

  /* ── College Slider data ── */
  const COLLEGES = [
    {
      name: "Patna University",
      location: "Ashok Rajpath, Patna, Bihar",
      stream: "B.Ed · BA.LLB · M.A · M.Sc",
      img: "https://images.unsplash.com/photo-1562774053-701939374585?w=720&q=75&auto=format&fit=crop",
      href: "/about",
    },
    {
      name: "Nalanda Open University",
      location: "Patna, Bihar",
      stream: "D.El.Ed · B.Ed · MBA · Distance",
      img: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=720&q=75&auto=format&fit=crop",
      href: "/about",
    },
    {
      name: "AIIMS Patna",
      location: "Phulwarisharif, Bihar",
      stream: "MBBS · Nursing · Paramedical",
      img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=720&q=75&auto=format&fit=crop",
      href: "/courses/mbbs",
    },
    {
      name: "NIT Patna",
      location: "Ashok Rajpath, Bihar",
      stream: "B.Tech · MCA · M.Tech",
      img: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=720&q=75&auto=format&fit=crop",
      href: "/courses/btech",
    },
    {
      name: "Bihar State Nursing College",
      location: "Muzaffarpur, Bihar",
      stream: "GNM · ANM · B.Sc Nursing",
      img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=720&q=75&auto=format&fit=crop",
      href: "/courses/gnm",
    },
    {
      name: "Central University of Bihar",
      location: "Gaya Road, Patna",
      stream: "LLB · BA.LLB · BBA.LLB · LLM",
      img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=720&q=75&auto=format&fit=crop",
      href: "/courses/llb",
    },
    {
      name: "IGNOU Regional Centre",
      location: "All Bihar Districts",
      stream: "B.Ed · MBA · Distance Learning",
      img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=720&q=75&auto=format&fit=crop",
      href: "/about",
    },
  ] as const;

  return (
    <>
    <main className="bg-white text-gray-900">

      <SiteNavbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#00102e] via-[#001850] to-[#003590] text-white">

        {/* Subtle dot-grid background */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        {/* Glow orbs */}
        <div className="pointer-events-none absolute -top-40 -right-32 h-[480px] w-[480px] rounded-full bg-amber-400 opacity-[0.10] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-500 opacity-[0.13] blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-indigo-700 opacity-[0.08] blur-3xl" />

        <div className="container-shell relative">

          {/* ── TOP TRUST BADGE STRIP — all clickable ── */}
          <div className="no-scrollbar flex items-center gap-3 overflow-x-auto border-b border-white/[0.08] py-4">
            {[
              { icon: ShieldCheck,  text: "NCTE / UGC Recognised Colleges", href: "/about#colleges" },
              { icon: CreditCard,   text: "Complete BSCC Loan Support",      href: "/apply" },
              { icon: Users,        text: "5,000+ Students Guided",           href: "/#reviews" },
              { icon: Building2,    text: "200+ Partner Colleges",            href: "/about" },
              { icon: Award,        text: "11+ Years of Trusted Counselling", href: "/about" },
              { icon: CheckCircle2, text: "100% Transparent. No Hidden Fees.", href: "/contact" },
            ].map(({ icon: Icon, text, href }) => (
              <Link
                key={text}
                href={href}
                className="flex flex-shrink-0 items-center gap-1.5 rounded-full border border-white/[0.12] bg-white/[0.06] px-4 py-2 text-xs font-semibold text-white/85 backdrop-blur-sm transition-all duration-200 hover:border-amber-400/50 hover:bg-white/[0.12] hover:text-white active:scale-95"
                style={{ touchAction: "manipulation" }}
              >
                <Icon size={13} className="flex-shrink-0 text-amber-400" />
                {text}
              </Link>
            ))}
          </div>

          {/* ── SOCIAL PROOF TICKER ── */}
          <div className="overflow-hidden border-b border-white/[0.08] py-2.5">
            <div className="flex animate-[marquee_28s_linear_infinite] whitespace-nowrap gap-8 hover:[animation-play-state:paused]">
              {[
                "✅ Rahul Kumar (Patna) — B.Ed admission confirmed",
                "✅ Priya Singh (Muzaffarpur) — GNM Nursing, BSCC loan approved",
                "✅ Amit Sharma (Ara) — B.Tech seat secured",
                "✅ Neha Yadav (Gaya) — BA.LLB counselling done",
                "✅ Vivek Raj (Bhagalpur) — DMLT admission, scholarship मिली",
                "✅ Anjali Kumari (Hajipur) — D.El.Ed selected",
                "✅ Rohit Mishra (Nalanda) — BCA placement ready",
                "✅ Sonu Devi (Darbhanga) — ANM Nursing seat confirmed",
              ].concat([
                "✅ Rahul Kumar (Patna) — B.Ed admission confirmed",
                "✅ Priya Singh (Muzaffarpur) — GNM Nursing, BSCC loan approved",
                "✅ Amit Sharma (Ara) — B.Tech seat secured",
                "✅ Neha Yadav (Gaya) — BA.LLB counselling done",
              ]).map((item, i) => (
                <Link
                  key={i}
                  href="/apply"
                  className="inline-flex flex-shrink-0 items-center gap-2 text-[11px] font-medium text-green-300/90 hover:text-green-200 transition-colors"
                >
                  {item}
                  <span className="text-white/20">•</span>
                </Link>
              ))}
            </div>
          </div>

          {/* ── MAIN GRID ── */}
          <div className="grid grid-cols-1 gap-10 py-14 md:py-20 lg:grid-cols-[1.25fr_0.8fr] lg:gap-14 lg:items-start">

            {/* ── LEFT: text + CTAs + floating cards ── */}
            <div className="order-1">

              {/* Platform label pill */}
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Link
                  href="/apply"
                  className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/[0.1] px-4 py-2 transition-all hover:border-amber-400/60 hover:bg-amber-400/[0.18] active:scale-95"
                  style={{ touchAction: "manipulation" }}
                >
                  <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
                  <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber-300">Admissions Open &nbsp;·&nbsp; Session 2026–27</span>
                </Link>
                <Link
                  href="/apply"
                  className="inline-flex items-center gap-1.5 rounded-full border border-red-400/30 bg-red-500/[0.12] px-3 py-1.5 transition-all hover:border-red-400/60 hover:bg-red-500/[0.22] active:scale-95"
                  style={{ touchAction: "manipulation" }}
                >
                  <span className="h-1.5 w-1.5 animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="text-[11px] font-extrabold text-red-300">⚡ Seats Limited — अभी Apply करें</span>
                </Link>
              </div>

              {/* H1 — 3-tier Hindi headline */}
              <h1 className="font-headline font-black tracking-tight leading-[1.12]">
                <span className="block text-[1.9rem] text-white/75 md:text-[2.8rem] lg:text-[3.2rem] [text-shadow:0_2px_16px_rgba(255,255,255,0.08)]">
                  किस Course में है
                </span>
                <span className="block text-[3.2rem] md:text-[4.8rem] lg:text-[5.6rem] bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent [filter:drop-shadow(0_4px_28px_rgba(251,191,36,0.50))]">
                  आपका Future?
                </span>
                <span className="block text-[1.7rem] text-white md:text-[2.4rem] lg:text-[2.8rem] [text-shadow:0_2px_16px_rgba(255,255,255,0.12)]">
                  हम बताएंगे —{" "}
                  <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">मुफ़्त।</span>
                </span>
              </h1>

              {/* Accent line */}
              <div className="mt-4 h-[3px] w-28 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-transparent md:w-44" />

              {/* Sub-headline — one tight line */}
              <p className="mt-4 text-sm leading-relaxed text-blue-200">
                50+ courses · 200+ verified colleges ·{" "}
                <Link href="/apply" className="font-bold text-amber-300 hover:text-amber-200 transition-colors">BSCC Loan support</Link>
                {" "}— बिल्कुल निःशुल्क।
              </p>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#inquiry"
                  className="group relative flex items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 px-8 py-4 text-base font-extrabold text-gray-900 shadow-xl shadow-amber-500/30 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/50 active:scale-[0.97]"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                  <Sparkles size={18} className="flex-shrink-0" />
                  अभी Free Counselling लें
                  <ArrowRight size={17} className="flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
                <a
                  href="https://wa.me/916203138576"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 rounded-2xl border-2 border-green-400/60 bg-green-500/10 px-8 py-4 font-bold text-white backdrop-blur transition-all duration-200 hover:bg-green-500/20 hover:-translate-y-1 hover:border-green-400 active:scale-[0.97]"
                >
                  <MessageCircle size={17} className="text-green-400" />
                  WhatsApp पर बात करें
                </a>
              </div>
              {/* Mobile urgency nudge */}
              <p className="mt-3 text-xs text-amber-300/80 md:hidden">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse mr-1.5 align-middle" />
                Counsellor अभी available है — अभी form भरें।
              </p>

              {/* ── Quick Stream Navigation Pills ── */}
              <div className="mt-5">
                <p className="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-blue-300/70">अपना Stream चुनें →</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "teaching",    label: "🎓 Teaching",    color: "from-blue-500 to-indigo-600" },
                    { key: "medical",     label: "🩺 Medical",     color: "from-rose-500 to-pink-600" },
                    { key: "paramedical", label: "💊 Para Medical", color: "from-purple-500 to-violet-600" },
                    { key: "law",         label: "⚖️ Law",          color: "from-amber-500 to-orange-500" },
                    { key: "technical",   label: "💻 Technical",   color: "from-teal-500 to-cyan-600" },
                  ].map(({ key, label, color }) => (
                    <Link
                      key={key}
                      href={`/courses#${key}`}
                      className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${color} px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95`}
                      style={{ touchAction: "manipulation" }}
                    >
                      {label}
                      <ArrowRight size={11} />
                    </Link>
                  ))}
                </div>
              </div>

              {/* ── College Auto-Slider ── */}
              <CollegeSlider colleges={COLLEGES} />

              {/* ── Below Slider: Recent Admissions ── */}
              <div className="mt-4">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-blue-400/70">🕐 हाल ही में हुए Admissions</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[
                    { name: "Rahul K.", course: "B.Ed", place: "Patna", time: "2 घंटे", href: "/courses/bed",      icon: "🎓", bg: "border-blue-400/20 bg-blue-500/[0.08]" },
                    { name: "Priya S.", course: "GNM + ₹4.2L BSCC", place: "Muzaffarpur", time: "आज",    href: "/apply",          icon: "💰", bg: "border-amber-400/20 bg-amber-500/[0.08]" },
                    { name: "Amit S.", course: "B.Tech CSE",  place: "Ara",    time: "कल",     href: "/courses/btech",   icon: "💻", bg: "border-teal-400/20 bg-teal-500/[0.08]" },
                    { name: "Neha Y.", course: "BA.LLB",      place: "Gaya",   time: "2 दिन",  href: "/courses/ballb",   icon: "⚖️", bg: "border-purple-400/20 bg-purple-500/[0.08]" },
                  ].map(({ name, course, place, time, href, icon, bg }) => (
                    <Link
                      key={name}
                      href={href}
                      className={`flex flex-col gap-0.5 rounded-xl border ${bg} px-3 py-2.5 transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-95`}
                      style={{ touchAction: "manipulation" }}
                    >
                      <span className="text-base leading-none">{icon}</span>
                      <p className="text-[11px] font-extrabold text-white leading-tight mt-1">{name}</p>
                      <p className="text-[10px] text-blue-200 leading-tight">{course}</p>
                      <p className="text-[9px] text-white/40 mt-0.5">{time} पहले · {place}</p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* ── Quick Action Strip ── */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                <Link
                  href="/courses"
                  className="flex flex-col items-center gap-1 rounded-2xl border border-white/[0.10] bg-white/[0.05] py-3 text-center transition-all hover:bg-white/[0.10] hover:-translate-y-0.5 active:scale-95"
                  style={{ touchAction: "manipulation" }}
                >
                  <BookOpen size={18} className="text-amber-400" />
                  <span className="text-[11px] font-extrabold text-white">50+ Courses</span>
                  <span className="text-[9px] text-blue-300">देखें →</span>
                </Link>
                <a
                  href="#inquiry"
                  className="flex flex-col items-center gap-1 rounded-2xl border border-amber-400/30 bg-amber-400/[0.10] py-3 text-center transition-all hover:bg-amber-400/[0.18] hover:-translate-y-0.5 active:scale-95"
                  style={{ touchAction: "manipulation" }}
                >
                  <GraduationCap size={18} className="text-amber-400" />
                  <span className="text-[11px] font-extrabold text-amber-300">Apply Now</span>
                  <span className="text-[9px] text-amber-400/70">Free है →</span>
                </a>
                <a
                  href={`https://wa.me/916203138576?text=${encodeURIComponent("नमस्ते! मुझे admission counselling चाहिए।")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 rounded-2xl border border-green-400/30 bg-green-500/[0.08] py-3 text-center transition-all hover:bg-green-500/[0.15] hover:-translate-y-0.5 active:scale-95"
                  style={{ touchAction: "manipulation" }}
                >
                  <MessageCircle size={18} className="text-green-400" />
                  <span className="text-[11px] font-extrabold text-green-300">WhatsApp</span>
                  <span className="text-[9px] text-green-400/70">अभी पूछें →</span>
                </a>
              </div>
            </div>

            {/* ── RIGHT: Lead Form ── */}
            <div id="inquiry" className="order-2 rounded-3xl border border-white/[0.15] bg-white/[0.08] p-6 shadow-2xl backdrop-blur-xl md:p-8">

              {/* Form header */}
              <div className="mb-6 text-center">
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/[0.1] px-3 py-1.5">
                  <Sparkles size={11} className="text-amber-400" />
                  <span className="text-[11px] font-bold text-amber-300">100% Free • No Hidden Charges</span>
                </div>
                <h3 className="font-headline text-[1.35rem] font-extrabold leading-tight text-white">
                  Free Admission Counselling
                </h3>
                <p className="mt-1.5 text-xs text-blue-300">
                  Share a few details and receive personalised guidance within minutes.
                </p>
              </div>

              {formSubmitted ? (
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 ring-2 ring-green-500/40">
                    <CheckCircle2 size={36} className="text-green-400" />
                  </div>
                  <h3 className="font-headline text-2xl font-extrabold">Thank You</h3>
                  <p className="text-sm text-blue-100">हमारी counselling team जल्द ही WhatsApp पर आपसे संपर्क करेगी।</p>
                  <button
                    onClick={() => { setFormSubmitted(false); setStep(0); setFormData({ name: "", mobile: "", course: "", district: "" }); }}
                    className="rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 px-6 py-3 font-bold text-gray-900 transition-all hover:opacity-90 active:scale-95"
                  >
                    Send Another Enquiry
                  </button>
                </div>
              ) : (
                <>
                  {/* Progress dots */}
                  <div className="mb-6 flex items-center justify-center gap-2">
                    {STEPS.map((_, i) => (
                      <div key={i} className={`h-2 rounded-full transition-all duration-300 ease-out ${
                        i === step ? "w-8 bg-amber-400" : i < step ? "w-3 bg-amber-400/50" : "w-3 bg-white/20"
                      }`} />
                    ))}
                  </div>

                  <div className="space-y-4">
                    {step === 0 && (
                      <>
                        <label className="block text-sm font-bold text-blue-100">
                          Student&apos;s Full Name <span className="text-amber-400">*</span>
                        </label>
                        <input
                          value={formData.name}
                          onChange={(e) => { setFormError(""); setFormData({ ...formData, name: e.target.value }); }}
                          placeholder="अपना पूरा नाम दर्ज करें"
                          autoComplete="name"
                          className="w-full rounded-xl border border-white/20 bg-white/[0.12] px-4 py-3.5 text-white placeholder-blue-300/60 outline-none transition focus:border-amber-400 focus:bg-white/[0.18] focus:ring-2 focus:ring-amber-400/25"
                        />
                      </>
                    )}
                    {step === 1 && (
                      <>
                        <label className="block text-sm font-bold text-blue-100">
                          Mobile Number <span className="text-amber-400">*</span>
                        </label>
                        <input
                          value={formData.mobile}
                          onChange={(e) => { setFormError(""); setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) }); }}
                          type="tel"
                          inputMode="numeric"
                          placeholder="Your 10-digit mobile number"
                          autoComplete="tel"
                          className="w-full rounded-xl border border-white/20 bg-white/[0.12] px-4 py-3.5 text-white placeholder-blue-300/60 outline-none transition focus:border-amber-400 focus:bg-white/[0.18] focus:ring-2 focus:ring-amber-400/25"
                        />
                      </>
                    )}
                    {step === 2 && (
                      <>
                        <label className="block text-sm font-bold text-blue-100">
                          Course of Interest <span className="text-amber-400">*</span>
                        </label>
                        <select
                          value={formData.course}
                          onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                          className="w-full rounded-xl border border-white/20 bg-[#001e5a] px-4 py-3.5 text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/25"
                        >
                          <option value="">-- Select a course --</option>
                          <optgroup label="Teaching (शिक्षण)">
                            <option>B.Ed</option><option>D.El.Ed</option><option>B.P.Ed</option><option>M.Ed</option>
                          </optgroup>
                          <optgroup label="Medical & Nursing (चिकित्सा)">
                            <option>MBBS</option><option>BDS</option><option>B.Sc Nursing</option>
                            <option>GNM</option><option>ANM</option><option>B.Pharma</option>
                            <option>D.Pharma</option><option>BMLT</option>
                          </optgroup>
                          <optgroup label="Para Medical (पैरामेडिकल)">
                            <option>BPT</option><option>BMLT</option><option>DMLT</option>
                            <option>BOT</option><option>B.Sc Biotechnology</option>
                          </optgroup>
                          <optgroup label="Law (कानून)">
                            <option>LLB</option><option>BA.LLB</option><option>BBA.LLB</option><option>LLM</option>
                          </optgroup>
                          <optgroup label="Engineering, IT & Management">
                            <option>B.Tech</option><option>Polytechnic</option><option>ITI</option>
                            <option>BCA</option><option>MCA</option><option>BBA</option><option>MBA</option>
                          </optgroup>
                          <option>Not yet decided — I want guidance</option>
                        </select>
                      </>
                    )}
                    {step === 3 && (
                      <>
                        <label className="block text-sm font-bold text-blue-100">
                          Your District <span className="text-amber-400">*</span>
                        </label>
                        <select
                          value={formData.district}
                          onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                          className="w-full rounded-xl border border-white/20 bg-[#001e5a] px-4 py-3.5 text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/25"
                        >
                          <option value="">-- Select your district --</option>
                          <option>Araria</option><option>Arwal</option><option>Aurangabad</option>
                          <option>Banka</option><option>Begusarai</option><option>Bhagalpur</option>
                          <option>Bhojpur</option><option>Buxar</option><option>Darbhanga</option>
                          <option>East Champaran</option><option>Gaya</option><option>Gopalganj</option>
                          <option>Jamui</option><option>Jehanabad</option><option>Kaimur</option>
                          <option>Katihar</option><option>Khagaria</option><option>Kishanganj</option>
                          <option>Lakhisarai</option><option>Madhepura</option><option>Madhubani</option>
                          <option>Munger</option><option>Muzaffarpur</option><option>Nalanda</option>
                          <option>Nawada</option><option>Patna</option><option>Purnia</option>
                          <option>Rohtas</option><option>Saharsa</option><option>Samastipur</option>
                          <option>Saran</option><option>Sheikhpura</option><option>Sheohar</option>
                          <option>Sitamarhi</option><option>Siwan</option><option>Supaul</option>
                          <option>Vaishali</option><option>West Champaran</option>
                          <option>I&apos;m from outside Bihar</option>
                        </select>
                      </>
                    )}

                    {formError && (
                      <p className="flex items-center gap-1.5 text-sm font-semibold text-amber-300">
                        <X size={14} className="flex-shrink-0" /> {formError}
                      </p>
                    )}

                    <div className="flex gap-2 pt-1">
                      {step > 0 && (
                        <button
                          onClick={() => { setFormError(""); setStep(step - 1); }}
                          className="flex-1 rounded-xl border border-white/25 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-[0.97]"
                        >
                          ← Back
                        </button>
                      )}
                      <button
                        onClick={nextStep}
                        className="group relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 py-3.5 font-extrabold text-gray-900 shadow-lg shadow-amber-500/25 transition-all hover:-translate-y-0.5 hover:shadow-amber-500/40 active:scale-[0.97]"
                      >
                        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                        {step < STEPS.length - 1 ? (
                          <>Continue <ArrowRight size={15} className="flex-shrink-0 transition-transform group-hover:translate-x-1" /></>
                        ) : (
                          "Get My Free Counselling →"
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="mt-5 text-center text-[11px] text-blue-300/70">
                    100% free • No spam, ever • Your information stays private
                  </p>
                </>
              )}
            </div>
          </div>

          {/* ── STATS BAR ── */}
          <div className="grid grid-cols-2 gap-6 border-t border-white/[0.08] py-10 md:grid-cols-4">
            {([
              { target: 5000, suffix: "+", label: "Students Successfully Guided", icon: Users     },
              { target: 200,  suffix: "+", label: "Approved Partner Colleges",    icon: Building2 },
              { target: 98,   suffix: "%", label: "Parent Satisfaction Rating",   icon: Star      },
              { target: 11,   suffix: "+", label: "Years of Trusted Counselling", icon: Award     },
            ] as const).map(({ target, suffix, label, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="mb-2 flex justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 ring-1 ring-amber-400/20">
                    <Icon size={18} className="text-amber-400" />
                  </div>
                </div>
                <p className="font-headline text-3xl font-black text-amber-400 md:text-4xl">
                  <CountUp target={target} suffix={suffix} />
                </p>
                <p className="mt-1 text-xs text-blue-200 md:text-sm">{label}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── COURSE MARQUEE ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#001f6b] via-[#002f8a] to-[#001f6b] py-4 border-t border-white/10">
        {/* Edge fades */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[#001f6b] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[#001f6b] to-transparent" />
        <div className="flex w-max marquee">
          {([
            { name: "B.Ed",         stream: "teaching"  },
            { name: "D.El.Ed",      stream: "teaching"  },
            { name: "M.Ed",         stream: "teaching"  },
            { name: "B.P.Ed",       stream: "teaching"  },
            { name: "MBBS",         stream: "medical"   },
            { name: "BDS",          stream: "medical"   },
            { name: "B.Sc Nursing", stream: "medical"   },
            { name: "GNM",          stream: "medical"   },
            { name: "ANM",          stream: "medical"   },
            { name: "B.Pharma",     stream: "medical"   },
            { name: "D.Pharma",     stream: "medical"   },
            { name: "BMLT",         stream: "medical"   },
            { name: "B.Tech",       stream: "technical" },
            { name: "Polytechnic",  stream: "technical" },
            { name: "ITI",          stream: "technical" },
            { name: "BCA",          stream: "technical" },
            { name: "MCA",          stream: "technical" },
            { name: "BBA",          stream: "technical" },
            { name: "MBA",          stream: "technical" },
            { name: "B.Ed",         stream: "teaching"  },
            { name: "D.El.Ed",      stream: "teaching"  },
            { name: "M.Ed",         stream: "teaching"  },
            { name: "B.P.Ed",       stream: "teaching"  },
            { name: "MBBS",         stream: "medical"   },
            { name: "BDS",          stream: "medical"   },
            { name: "B.Sc Nursing", stream: "medical"   },
            { name: "GNM",          stream: "medical"   },
            { name: "ANM",          stream: "medical"   },
            { name: "B.Pharma",     stream: "medical"   },
            { name: "D.Pharma",     stream: "medical"   },
            { name: "BMLT",         stream: "medical"   },
            { name: "B.Tech",       stream: "technical" },
            { name: "Polytechnic",  stream: "technical" },
            { name: "ITI",          stream: "technical" },
            { name: "BCA",          stream: "technical" },
            { name: "MCA",          stream: "technical" },
            { name: "BBA",          stream: "technical" },
            { name: "MBA",          stream: "technical" },
          ] as { name: string; stream: string }[]).map((c, i) => (
            <a
              key={i}
              href={`/courses?stream=${c.stream}`}
              className="mx-2 inline-block whitespace-nowrap rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium text-white/90 backdrop-blur-sm transition-colors hover:bg-white/25 hover:border-white/40"
            >
              {c.name}
            </a>
          ))}
        </div>
      </div>

      {/* ── BOTTOM TRUST BAR ── */}
      <div className="border-t border-white/[0.05] bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 py-5">
        <div className="container-shell">
          <div className="flex flex-wrap items-center justify-center gap-5 md:gap-8">
            {[
              { icon: ShieldCheck,  text: "100% Free Initial Counselling",   color: "text-green-400"  },
              { icon: GraduationCap, text: "NCTE / UGC Recognised Colleges",  color: "text-blue-400"   },
              { icon: CreditCard,   text: "End-to-End BSCC Loan Support",     color: "text-amber-400"  },
              { icon: Phone,        text: "Personal Counsellor for Every Student", color: "text-amber-400" },
            ].map(({ icon: Icon, text, color }) => (
              <span key={text} className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                <Icon size={15} className={color} />
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── COURSES SECTION ── */}
      <section id="courses" className="py-12 bg-gradient-to-b from-gray-50 via-blue-50/30 to-white">
        <AnimateIn type="fade-up" className="text-center mb-10 container-shell">
          <p className="text-sm font-bold uppercase tracking-widest text-primary-blue mb-2">Session 2026–27 · Admissions Open</p>
          <h2 className="font-headline text-3xl md:text-5xl font-extrabold">
            अपने भविष्य की{" "}
            <span className="bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
              दिशा चुनें
            </span>
          </h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            5 streams · 50+ courses · 200+ partner colleges · 100% free counselling
          </p>
        </AnimateIn>

        <StreamCards />

        <div className="mt-6 text-center container-shell">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-xl bg-primary-blue px-8 py-4 font-extrabold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            Explore All Courses <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── POPULAR COURSES SECTION ── */}
      <section id="popular-courses" className="py-14 md:py-20 bg-white">
        <div className="container-shell">
          <AnimateIn type="fade-up" className="text-center mb-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2">
              <TrendingUp size={13} className="text-blue-600" />
              <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-700">Most Enrolled Courses 2026–27</span>
            </div>
            <h2 className="font-headline text-3xl md:text-5xl font-extrabold text-gray-900">
              Popular{" "}
              <span className="bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                Courses
              </span>
            </h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto text-sm md:text-base">
              Bihar के हज़ारों students इन courses में admission ले चुके हैं। अभी free counselling लें।
            </p>
          </AnimateIn>

          {/* Mobile: horizontal snap-carousel · Desktop: grid */}
          <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-5">
            {([
              {
                name: "B.Ed",
                shortDesc: "Bachelor of Education — सरकारी शिक्षक बनें",
                stream: "teaching",
                icon: BookMarked,
                gradient: "from-blue-700 to-indigo-700",
                badge: "bg-blue-100 text-blue-700",
              },
              {
                name: "D.El.Ed",
                shortDesc: "Diploma — Primary teacher की guaranteed career",
                stream: "teaching",
                icon: GraduationCap,
                gradient: "from-blue-600 to-blue-800",
                badge: "bg-blue-100 text-blue-800",
              },
              {
                name: "ANM",
                shortDesc: "Auxiliary Nursing — 10+2 के बाद healthcare",
                stream: "medical",
                icon: Stethoscope,
                gradient: "from-blue-500 to-indigo-600",
                badge: "bg-indigo-100 text-indigo-700",
              },
              {
                name: "GNM",
                shortDesc: "General Nursing — Govt hospital jobs",
                stream: "medical",
                icon: Stethoscope,
                gradient: "from-indigo-600 to-blue-800",
                badge: "bg-blue-100 text-blue-700",
              },
              {
                name: "B.Sc Nursing",
                shortDesc: "4-year degree — Nursing में highest scope",
                stream: "medical",
                icon: Stethoscope,
                gradient: "from-blue-800 to-indigo-900",
                badge: "bg-indigo-100 text-indigo-800",
              },
              {
                name: "D.Pharma",
                shortDesc: "Diploma Pharmacy — खुद की medical shop खोलें",
                stream: "medical",
                icon: FlaskConical,
                gradient: "from-indigo-500 to-blue-700",
                badge: "bg-blue-100 text-blue-700",
              },
              {
                name: "B.Tech",
                shortDesc: "Engineering — IT, Civil, Mechanical, ECE",
                stream: "technical",
                icon: Cpu,
                gradient: "from-amber-500 to-amber-700",
                badge: "bg-amber-100 text-amber-800",
              },
              {
                name: "Polytechnic",
                shortDesc: "3-year Diploma — Govt jobs & industry",
                stream: "technical",
                icon: Cpu,
                gradient: "from-amber-600 to-orange-600",
                badge: "bg-amber-100 text-amber-700",
              },
              {
                name: "ITI",
                shortDesc: "Industrial Training — Trade certificate & jobs",
                stream: "technical",
                icon: Briefcase,
                gradient: "from-amber-400 to-amber-600",
                badge: "bg-amber-100 text-amber-700",
              },
              {
                name: "LLB",
                shortDesc: "Law degree — Advocate, Judge, Corporate",
                stream: "law",
                icon: Scale,
                gradient: "from-[#001850] to-[#003590]",
                badge: "bg-blue-100 text-blue-800",
              },
            ] as const).map(({ name, shortDesc, stream, icon: Icon, gradient, badge }) => {
              const slug = getCourseSlug(name);
              const detailsHref = slug ? `/courses/${slug}` : `/courses#${stream}`;
              return (
              <AnimateIn key={name} type="zoom-in" className="w-[60%] shrink-0 snap-start sm:w-[42%] md:w-auto">
                <div className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl overflow-hidden h-full cursor-pointer">
                  {/* Whole-card click → full course details (stretched link). Buttons below sit above via z-index. */}
                  <Link href={detailsHref} aria-label={`${name} की पूरी details देखें`} className="absolute inset-0 z-10" />
                  {/* Brand-palette header */}
                  <div className={`bg-gradient-to-br ${gradient} p-4 flex items-center justify-center`}>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
                      <Icon size={22} className="text-white" />
                    </div>
                  </div>
                  {/* Content */}
                  <div className="flex flex-1 flex-col p-3 md:p-4">
                    <h3 className="font-headline text-sm md:text-base font-extrabold text-gray-900 transition group-hover:text-primary-blue">{name}</h3>
                    <p className="mt-1 flex-1 text-xs text-gray-500 leading-snug">{shortDesc}</p>
                    <a
                      href={`/apply?course=${encodeURIComponent(name)}`}
                      className="relative z-20 mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-primary-blue py-2 text-xs font-extrabold text-white shadow-sm transition hover:bg-blue-700"
                    >
                      Free Counselling <ArrowRight size={11} />
                    </a>
                    <Link
                      href={detailsHref}
                      className={`relative z-20 mt-1.5 flex items-center justify-center gap-1 rounded-xl border py-1.5 text-xs font-semibold transition hover:opacity-80 ${badge}`}
                    >
                      <BookOpen size={11} /> Full Details
                    </Link>
                  </div>
                </div>
              </AnimateIn>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <a
              href="/courses"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-primary-blue px-8 py-3.5 font-extrabold text-primary-blue transition hover:bg-primary-blue hover:text-white"
            >
              सभी 50+ Courses देखें <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ── ADMISSION PROCESS ── */}
      <section id="admission-process" className="py-16 md:py-20 bg-gray-50">
        <div className="container-shell">
          <AnimateIn type="fade-up" className="text-center mb-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2">
              <ListChecks size={13} className="text-blue-600" />
              <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-700">Simple · Transparent · Guided</span>
            </div>
            <h2 className="font-headline text-3xl md:text-5xl font-extrabold text-gray-900">
              Admission Process —{" "}
              <span className="bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">4 Easy Steps</span>
            </h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto text-sm md:text-base">
              पहली call से admission confirm होने तक — हम हर step पर आपके साथ हैं।
            </p>
          </AnimateIn>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {([
              { step: "01", icon: Phone,       title: "Free Counselling Call",        desc: "Call या WhatsApp करें — पहली बातचीत बिल्कुल निःशुल्क। हम आपकी situation समझेंगे।",         accent: "bg-blue-600",    ring: "ring-blue-200"  },
              { step: "02", icon: FileText,    title: "Profile Review",               desc: "Marks, बजट, stream और career goal बताएँ — हम आपके लिए सही options निकालेंगे।",             accent: "bg-indigo-600",  ring: "ring-indigo-200"},
              { step: "03", icon: Building2,   title: "College Selection",            desc: "NCTE / INC / AICTE approved verified colleges की personalised shortlist ready होगी।",       accent: "bg-amber-500",   ring: "ring-amber-200" },
              { step: "04", icon: BadgeCheck,  title: "Admission Confirmation",       desc: "Documents से DRCC तक — हर step पर हम साथ हैं। Seat confirm होने तक full support।",         accent: "bg-blue-800",    ring: "ring-blue-200"  },
            ] as const).map(({ step, icon: StepIcon, title, desc, accent, ring }, i) => (
              <AnimateIn key={step} type="zoom-in" delay={i * 80}>
                <div className="relative h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:-translate-y-0.5">
                  {i < 3 && (
                    <div className="absolute hidden lg:block -right-2.5 top-8 z-10">
                      <ArrowRight size={18} className="text-gray-300" />
                    </div>
                  )}
                  <div className="mb-4 flex items-center gap-3">
                    <span className="font-headline text-5xl font-black text-gray-100 leading-none select-none">{step}</span>
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${accent} ring-4 ${ring}`}>
                      <StepIcon size={18} className="text-white" />
                    </div>
                  </div>
                  <h3 className="font-headline text-base font-extrabold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="/apply"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-blue px-7 py-3.5 font-extrabold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 hover:-translate-y-0.5"
            >
              <GraduationCap size={16} /> Start My Admission
            </a>
            <a
              href="https://wa.me/916203138576?text=%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A5%87!%20%E0%A4%AE%E0%A5%81%E0%A4%9D%E0%A5%87%20admission%20guidance%20%E0%A4%9A%E0%A4%BE%E0%A4%B9%E0%A4%BF%E0%A4%8F%E0%A5%A4"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-blue-200 px-7 py-3.5 font-bold text-blue-700 transition hover:border-blue-400 hover:bg-blue-50"
            >
              <MessageCircle size={16} /> WhatsApp पर पूछें
            </a>
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section id="why-us" className="py-16 md:py-24 bg-white">
        <div className="container-shell">

          {/* Heading */}
          <AnimateIn type="fade-up" className="text-center mb-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-600">हम क्यों अलग हैं</span>
            </div>
            <h2 className="font-headline text-[2rem] font-black leading-tight tracking-tight text-gray-900 md:text-5xl">
              Admission नहीं —{" "}
              <span className="bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                एक सुरक्षित भविष्य
              </span>
            </h2>
            <p className="mt-3 max-w-xl mx-auto text-gray-500">
              हज़ारों Bihar के students ने Siksha Wallah पर भरोसा किया — क्योंकि हम सिर्फ college नहीं, सही दिशा देते हैं।
            </p>
          </AnimateIn>

          {/* ── Stats Strip ── */}
          <AnimateIn type="fade-up" delay={60}>
          <div className="mb-12 grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-blue-100 shadow-sm">
            {[
              { target: 2,   suffix: " Cr+",  label: "BSCC Loans Sanctioned" },
              { target: 50,  suffix: "+",     label: "Verified Courses" },
              { target: 5,   suffix: "",      label: "Career Streams" },
              { target: 100, suffix: "%",     label: "Free Counselling" },
            ].map(({ target, suffix, label }) => (
              <div key={label} className="flex flex-col items-center justify-center gap-1 bg-blue-50 py-6 px-4 text-center">
                <p className="font-headline text-3xl font-black text-blue-700 md:text-4xl">
                  <CountUp target={target} suffix={suffix} />
                </p>
                <p className="text-xs font-semibold text-gray-500 leading-snug">{label}</p>
              </div>
            ))}
          </div>
          </AnimateIn>

          {/* ── 6 USP Cards ── */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: ShieldCheck, border: "border-l-blue-500",   iconBg: "bg-blue-50",   iconColor: "text-blue-600",
                title: "निःशुल्क काउंसेलिंग",
                desc: "Call से लेकर admission confirm होने तक — कोई charge नहीं, कोई hidden fee नहीं। पहला कदम बिल्कुल मुफ़्त।",
              },
              {
                icon: Building2,   border: "border-l-green-500",  iconBg: "bg-green-50",  iconColor: "text-green-600",
                title: "200+ Verified Colleges",
                desc: "सिर्फ NCTE, INC, AICTE, BCI और PCI approved institutes — किसी unverified college में admission नहीं।",
              },
              {
                icon: CreditCard,  border: "border-l-amber-500",  iconBg: "bg-amber-50",  iconColor: "text-amber-600",
                title: "BSCC Loan Experts",
                desc: "₹2 Cr+ loans sanctioned — document preparation से DRCC approval तक हमारी team पूरी तरह साथ है।",
              },
              {
                icon: BadgeCheck,  border: "border-l-blue-500",   iconBg: "bg-blue-50",   iconColor: "text-blue-600",
                title: "पारदर्शी Fee Structure",
                desc: "पहले दिन से सब कुछ clear — कोई surprise नहीं, कोई बाद में अचानक fee नहीं। 100% transparent process।",
              },
              {
                icon: Users,       border: "border-l-indigo-500", iconBg: "bg-indigo-50", iconColor: "text-indigo-600",
                title: "Personal Counsellor",
                desc: "एक call — एक dedicated counsellor — admission confirm होने तक वही एक व्यक्ति आपके साथ रहेगा।",
              },
              {
                icon: Award,       border: "border-l-amber-500",  iconBg: "bg-amber-50",  iconColor: "text-amber-600",
                title: "11+ साल का अनुभव",
                desc: "Forbesganj में 11 साल से active — 5,000+ परिवारों का भरोसा, बिना किसी complaint के।",
              },
            ].map(({ icon: Icon, border, iconBg, iconColor, title, desc }, i) => (
              <AnimateIn key={title} type="zoom-in" delay={i * 60}>
              <div className={`group flex gap-4 rounded-2xl border-2 border-gray-100 border-l-4 ${border} bg-white p-5 shadow-sm transition hover:shadow-md hover:-translate-y-0.5`}>
                <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
                  <Icon size={20} className={iconColor} />
                </div>
                <div>
                  <h3 className="font-headline text-base font-extrabold text-gray-900">{title}</h3>
                  <p className="mt-1 text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── BSCC SECTION ── */}
      <section id="bscc" className="relative overflow-hidden bg-gradient-to-br from-[#00102e] via-[#001850] to-[#003590] py-16 md:py-24 text-white">
        {/* Same dot-grid as hero */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="pointer-events-none absolute -top-32 -right-24 h-[400px] w-[400px] rounded-full bg-amber-400 opacity-[0.10] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-blue-500 opacity-[0.12] blur-3xl" />

        <div className="container-shell relative">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

            {/* ── LEFT: heading + benefits + CTA ── */}
            <div>
              {/* Badge */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/[0.10] px-4 py-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
                <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber-300">Bihar Government Scheme</span>
              </div>

              {/* Heading */}
              <h2 className="font-headline text-[2rem] font-black leading-[1.1] tracking-tight md:text-[2.6rem]">
                Bihar Student Credit Card{" "}
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
                  (BSCC) Loan Support
                </span>
              </h2>
              <div className="mt-3 h-[3px] w-20 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-transparent" />

              <p className="mt-5 text-blue-100 leading-relaxed">
                इस सरकारी योजना से अपनी <strong className="text-white">पढ़ाई, हॉस्टल और भोजन</strong> का खर्च संभालें। ₹4 लाख तक का loan — <strong className="text-amber-400">केवल 4% वार्षिक ब्याज</strong> पर। हम पूरी आवेदन प्रक्रिया में <strong className="text-white">निःशुल्क मार्गदर्शन</strong> देते हैं।
              </p>

              {/* Interactive Loan Calculator — live savings */}
              <div className="mt-7 rounded-2xl border border-amber-400/30 bg-white/[0.06] p-5 shadow-lg shadow-black/10">
                <div className="mb-1 flex items-center gap-2">
                  <CreditCard size={15} className="text-amber-400" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">Loan Savings Calculator</span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-sm font-semibold text-blue-200">मुझे चाहिए:</span>
                  <span className="font-headline text-3xl font-black text-amber-400">
                    ₹{loanAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <input
                  type="range"
                  min={50000}
                  max={400000}
                  step={10000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  aria-label="Loan amount selector"
                  className="mt-3 w-full cursor-pointer accent-amber-400"
                />
                <div className="mt-1 flex justify-between text-[10px] font-medium text-blue-300">
                  <span>₹50,000</span>
                  <span>₹4,00,000</span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.10] p-3 text-center">
                    <p className="text-[11px] font-semibold text-blue-200">BSCC ब्याज @4%/yr</p>
                    <p className="font-headline text-lg font-black text-amber-400">
                      ₹{Math.round(loanAmount * 0.04).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-center">
                    <p className="text-[11px] font-semibold text-blue-200">Normal Bank @11%/yr</p>
                    <p className="font-headline text-lg font-black text-red-300 line-through decoration-2">
                      ₹{Math.round(loanAmount * 0.11).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-green-500/15 py-2.5 text-center">
                  <CheckCircle2 size={15} className="text-green-400" />
                  <p className="text-xs font-bold text-green-300">
                    आप हर साल लगभग ₹{Math.round(loanAmount * 0.07).toLocaleString("en-IN")} बचाते हैं!
                  </p>
                </div>
                <p className="mt-2 text-center text-[10px] text-blue-300/70">
                  * Women applicants के लिए सिर्फ 1% ब्याज — और भी ज्यादा बचत
                </p>
              </div>

              {/* Benefit chips */}
              <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: CreditCard,   title: "Up to ₹4 Lakh Loan",      desc: "Tuition, hostel, food और study material" },
                  { icon: BadgeCheck,   title: "Only 4% Interest",         desc: "Women के लिए सिर्फ 1% ब्याज" },
                  { icon: GraduationCap,title: "50+ Eligible Courses",     desc: "Teaching, Medical, Law, Engineering और more" },
                  { icon: ShieldCheck,  title: "No Collateral Needed",     desc: "कोई guarantor या property mortgage नहीं" },
                  { icon: Clock,        title: "Repay After Employment",   desc: "Course पूरा होने के बाद EMI शुरू होती है" },
                  { icon: CheckCircle2, title: "100% Free Assistance",     desc: "Document से DRCC approval तक — कोई fee नहीं" },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3 rounded-xl border border-white/[0.10] bg-white/[0.05] p-3.5 hover:bg-white/[0.09] transition">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-400/[0.15]">
                      <Icon size={15} className="text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{title}</p>
                      <p className="text-[11px] text-blue-300 mt-0.5 leading-snug">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/apply"
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3 font-extrabold text-gray-900 transition hover:bg-amber-300 shadow-lg shadow-amber-500/25 hover:-translate-y-0.5"
                >
                  Book Free Counselling <ArrowRight size={16} />
                </Link>
                <a
                  href="https://wa.me/916203138576?text=नमस्ते!%20मुझे%20BSCC%20Loan%20के%20बारे%20में%20जानकारी%20चाहिए।%20Please%20help%20karein।"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-white/25 bg-white/[0.07] px-6 py-3 font-bold text-white transition hover:bg-white/[0.14] hover:-translate-y-0.5"
                >
                  <MessageCircle size={16} /> Ask on WhatsApp
                </a>
              </div>
            </div>

            {/* ── RIGHT: Eligibility Checker ── */}
            <div className="rounded-2xl border border-amber-400/30 bg-white/[0.08] p-7 shadow-2xl shadow-black/20 ring-1 ring-amber-400/10 backdrop-blur-sm">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/[0.12] px-3 py-1">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
                <span className="text-[11px] font-bold text-amber-300">सिर्फ 2 मिनट · 100% Free</span>
              </div>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-amber-400">
                  <CheckCircle2 size={18} className="text-gray-900" />
                </div>
                <div>
                  <h3 className="font-headline text-xl font-extrabold leading-tight">Quick BSCC Eligibility Check</h3>
                  <p className="text-xs text-blue-300">3 सवालों में जानें — आप eligible हैं या नहीं</p>
                </div>
              </div>

              {bsccEligible === null ? (
                <form onSubmit={handleBsccCheck} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-blue-100">Are you a permanent resident of Bihar?</label>
                    <div className="flex gap-3">
                      {["yes", "no"].map((val) => (
                        <label key={val} className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 py-3 text-sm font-bold transition hover:bg-white/20">
                          <input type="radio" name="bihar" value={val} onChange={(e) => setBsccBihar(e.target.value)} className="accent-amber-400" required />
                          {val === "yes" ? "Yes" : "No"}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-blue-100">What is your family&apos;s annual income?</label>
                    <select
                      value={bsccIncome}
                      onChange={(e) => setBsccIncome(e.target.value)}
                      required
                      className="w-full rounded-xl border border-white/30 bg-[#001850] px-4 py-3 text-white outline-none"
                    >
                      <option value="">Select annual family income</option>
                      <option value="below">Below ₹4.5 Lakh</option>
                      <option value="above">Above ₹4.5 Lakh</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-blue-100">Student&apos;s Age</label>
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
                    Check My Eligibility →
                  </button>
                </form>
              ) : bsccEligible ? (
                <div className="py-4 text-center space-y-4">
                  <CheckCircle2 size={52} className="mx-auto text-green-400" />
                  <h4 className="font-headline text-2xl font-extrabold text-green-300">Good news — you are eligible!</h4>
                  <p className="text-blue-100">आप Bihar Student Credit Card के लिए apply कर सकते हैं। हमारे BSCC विशेषज्ञ document preparation से लेकर DRCC approval तक पूरी प्रक्रिया में आपका मार्गदर्शन करेंगे।</p>
                  <a
                    href="https://wa.me/916203138576?text=नमस्ते!%20मैंने%20आपकी%20website%20पर%20BSCC%20eligibility%20check%20की%20और%20मैं%20eligible%20हूँ।%20कृपया%20application%20process%20के%20बारे%20में%20guide%20करें।"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-bold text-white hover:bg-green-600"
                  >
                    <MessageCircle size={18} /> Start My BSCC Application
                  </a>
                  <button onClick={() => { setBsccEligible(null); setBsccBihar(""); setBsccIncome(""); setBsccAge(""); }} className="block w-full text-center text-sm text-blue-300 underline mt-2">
                    Check Again
                  </button>
                </div>
              ) : (
                <div className="py-4 text-center space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/20">
                    <X size={28} className="text-orange-400" />
                  </div>
                  <h4 className="font-headline text-xl font-extrabold text-orange-300">You may not qualify for BSCC</h4>
                  <p className="text-blue-100 text-sm">BSCC scheme के लिए Bihar का स्थायी निवासी होना, age 25 वर्ष या उससे कम, और family income ₹4.5 लाख से कम होना आवश्यक है। चिंता न करें — हम आपके लिए अन्य education loan विकल्प भी सुझा सकते हैं।</p>
                  <a href="tel:+916203138576" className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-6 py-3 font-bold text-white hover:bg-white/30">
                    <Phone size={16} /> Call to Discuss Other Options
                  </a>
                  <button onClick={() => { setBsccEligible(null); setBsccBihar(""); setBsccIncome(""); setBsccAge(""); }} className="block w-full text-center text-sm text-blue-300 underline">
                    Check Again
                  </button>
                </div>
              )}
            </div>
          </div>{/* end lg:grid-cols-2 */}
        </div>
      </section>

      {/* ── PARTNER COLLEGES SECTION ── */}
      <section id="partner-colleges" className="py-14 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-shell">
          <AnimateIn type="fade-up" className="text-center mb-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2">
              <Landmark size={13} className="text-blue-700" />
              <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-700">NCTE / UGC / AICTE / INC Recognised</span>
            </div>
            <h2 className="font-headline text-3xl md:text-5xl font-extrabold text-gray-900">
              Our{" "}
              <span className="bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                Partner Colleges
              </span>
            </h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto text-sm md:text-base">
              200+ verified colleges — सभी government-approved, कोई fake institution नहीं। आपका admission 100% safe है।
            </p>
          </AnimateIn>

          {/* Mobile: horizontal snap-carousel · Desktop: grid */}
          <div className="no-scrollbar -mx-4 mb-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
            {PARTNER_COLLEGES.map((col) => {
              const Icon = col.icon;
              return (
              <AnimateIn key={col.category} type="fade-up" className="w-[78%] shrink-0 snap-start sm:w-auto">
                <button
                  onClick={() => setSelectedCollege(col)}
                  className={`group w-full text-left rounded-2xl border-2 ${col.color} p-5 h-full transition hover:-translate-y-1 hover:shadow-lg cursor-pointer`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${col.iconBg} text-white`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <h3 className="font-headline text-sm font-extrabold text-gray-900">{col.category}</h3>
                        <span className="text-[10px] font-semibold text-gray-500">{col.approval}</span>
                      </div>
                    </div>
                    <span className={`font-headline text-2xl font-black ${col.countColor}`}>{col.count}</span>
                  </div>
                  <ul className="space-y-2">
                    {col.colleges.slice(0, 5).map((c) => (
                      <li key={c} className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle2 size={12} className="flex-shrink-0 text-green-500" />
                        {c}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-[10px] text-gray-400 font-medium">+ Many more verified colleges across Bihar</p>
                  <div className={`mt-3 flex items-center gap-1 text-xs font-bold ${col.accentText} group-hover:gap-2 transition-all`}>
                    View All Colleges <ArrowRight size={12} />
                  </div>
                </button>
              </AnimateIn>
              );
            })}
          </div>

          {/* ── College Details Modal ── */}
          {selectedCollege && (
            <div
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              onClick={() => setSelectedCollege(null)}
            >
              <div
                className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal header */}
                <div className={`flex items-center justify-between gap-3 p-5 border-b border-gray-100`}>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${selectedCollege.iconBg} text-white`}>
                      <selectedCollege.icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-headline text-lg font-extrabold text-gray-900">{selectedCollege.category}</h3>
                      <span className="text-xs font-semibold text-gray-500">{selectedCollege.approval} · {selectedCollege.count} Colleges</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCollege(null)}
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
                  >
                    <X size={16} className="text-gray-600" />
                  </button>
                </div>

                <div className="p-5 space-y-5">
                  {/* Courses offered */}
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">Courses Offered</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCollege.courses.map((c) => (
                        <span key={c} className={`rounded-full ${selectedCollege.color} border px-3 py-1 text-xs font-bold ${selectedCollege.accentText}`}>
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* College list */}
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">Partner Colleges</p>
                    <ul className="space-y-2">
                      {selectedCollege.colleges.map((c) => (
                        <li key={c} className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                          <CheckCircle2 size={14} className="flex-shrink-0 text-green-500" />
                          <span className="text-sm font-semibold text-gray-800">{c}</span>
                        </li>
                      ))}
                      <li className="flex items-center gap-2.5 rounded-xl border border-dashed border-gray-200 px-4 py-3">
                        <Building2 size={14} className="flex-shrink-0 text-gray-400" />
                        <span className="text-sm text-gray-500">+ और भी verified colleges — full list के लिए WhatsApp करें</span>
                      </li>
                    </ul>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-2 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
                    <MapPin size={14} className="mt-0.5 flex-shrink-0 text-blue-600" />
                    <p className="text-xs text-blue-700 font-medium">{selectedCollege.location}</p>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col gap-2.5">
                    <a
                      href={`https://wa.me/916203138576?text=${encodeURIComponent(selectedCollege.whatsappMsg)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3.5 font-bold text-white transition hover:bg-green-600"
                    >
                      <MessageCircle size={16} /> Full College List माँगें — WhatsApp
                    </a>
                    <a
                      href="/apply"
                      className="flex items-center justify-center gap-2 rounded-xl bg-primary-blue px-5 py-3.5 font-bold text-white transition hover:bg-blue-700"
                    >
                      <GraduationCap size={16} /> Free Counselling — Apply Now
                    </a>
                  </div>

                  <p className="text-center text-[11px] text-gray-400">सभी colleges NCTE / UGC / AICTE / INC / BCI / PCI approved हैं</p>
                </div>
              </div>
            </div>
          )}

          {/* Trust Banner */}
          <AnimateIn type="fade-up">
            <div className="rounded-2xl bg-gradient-to-r from-[#00102e] via-[#001850] to-[#003590] p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <ShieldCheck size={18} className="text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">100% Verified — Zero Fake Colleges</span>
                </div>
                <h3 className="font-headline text-xl md:text-2xl font-extrabold">
                  हर college personally verified किया गया है।
                </h3>
                <p className="mt-1.5 text-sm text-blue-200 max-w-lg">
                  Siksha Wallah सिर्फ NCTE, UGC, AICTE, INC, BCI और PCI approved colleges में ही admission दिलाता है। आपका भविष्य सुरक्षित है।
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <a
                  href="/apply"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3 font-extrabold text-gray-900 transition hover:bg-amber-300 shadow-lg shadow-amber-500/25"
                >
                  <GraduationCap size={16} /> Apply Now
                </a>
                <a
                  href={`https://wa.me/916203138576?text=${encodeURIComponent("नमस्ते! मुझे partner colleges की list चाहिए।")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 px-6 py-3 font-bold text-white transition hover:bg-white/10"
                >
                  <MessageCircle size={16} /> College List माँगें
                </a>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── SUCCESS STORIES CAROUSEL ── */}
      <ReviewsCarousel
        reviews={successStories}
        title="छात्रों के असली अनुभव"
        subtitle="5,000+ परिवारों ने हम पर भरोसा किया — यह उन्हीं की आवाज़ है।"
      />

      {/* ── DOCUMENTS CHECKLIST ── */}
      <section id="documents" className="py-16 md:py-24 bg-gradient-to-b from-white via-blue-50/40 to-white">
        <div className="container-shell">
          <AnimateIn type="fade-up" className="text-center mb-10">
            <p className="text-sm font-bold uppercase tracking-widest text-primary-blue mb-2">Be Admission-Ready</p>
            <h2 className="font-headline text-3xl md:text-5xl font-extrabold">Your Personal Admission Documents Checklist</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              इस checklist में हर document को tick करते जाएँ। जब आप हमारे Forbesganj office आएँ, तो सभी original certificates के साथ 2 photocopies ज़रूर लाएँ।
            </p>
          </AnimateIn>

          {/* ── Progress summary band with circular ring ── */}
          {(() => {
            const done = Object.values(checkedDocs).filter(Boolean).length;
            const total = 10;
            const pct = Math.round((done / total) * 100);
            const complete = done >= total;
            return (
              <div className="mx-auto mb-10 max-w-3xl rounded-3xl border border-blue-100 bg-white p-5 shadow-xl shadow-blue-900/5 sm:p-6">
                <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
                  {/* Ring */}
                  <div className="relative h-24 w-24 flex-shrink-0">
                    <svg className="h-24 w-24 -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
                      <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="3.2" />
                      <circle
                        cx="18" cy="18" r="16" fill="none"
                        stroke={complete ? "#16a34a" : "#003f9f"}
                        strokeWidth="3.2" strokeLinecap="round" pathLength={100}
                        strokeDasharray={`${pct} 100`}
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`font-headline text-2xl font-extrabold ${complete ? "text-green-600" : "text-gray-900"}`}>{done}<span className="text-base text-gray-400">/{total}</span></span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Ready</span>
                    </div>
                  </div>
                  {/* Text + bar */}
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center justify-center gap-2 sm:justify-start">
                      <ListChecks size={18} className={complete ? "text-green-600" : "text-primary-blue"} />
                      <p className="font-headline text-lg font-extrabold text-gray-900">
                        {complete ? "सभी documents ready हैं! 🎉" : `${done} of ${total} documents ready`}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {complete
                        ? "शानदार! अब बस अपने Forbesganj office आकर free verification कराएँ।"
                        : "हर document को tick करते जाएँ — आपकी admission उतनी ही तेज़ और आसान होगी।"}
                    </p>
                    <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${complete ? "bg-gradient-to-r from-green-400 to-green-600" : "bg-gradient-to-r from-blue-500 to-indigo-600"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ── Category grid: 3 columns ── */}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                group: "Academic Documents",
                accent: "from-blue-500 to-indigo-600",
                chip: "bg-blue-100 text-blue-700",
                docs: [
                  { id: "10th-marksheet", label: "Class 10 Marksheet & Passing Certificate", note: "Original board certificate is required for verification.", required: true },
                  { id: "12th-marksheet", label: "Class 12 Marksheet & Passing Certificate", note: "All-subject marksheet plus passing/migration certificate.", required: true },
                  { id: "graduation", label: "Graduation Degree & Marksheets (All Years)", note: "Needed for B.Ed, M.Ed, MBA, MCA and all postgraduate courses.", required: false },
                ],
              },
              {
                group: "Identity & Residence",
                accent: "from-green-500 to-emerald-600",
                chip: "bg-green-100 text-green-700",
                docs: [
                  { id: "aadhaar", label: "Student's Aadhaar Card", note: "Should be linked with an active mobile number.", required: true },
                  { id: "residential", label: "Residential / Domicile Certificate", note: "Bihar domicile certificate from SDO or Circle Office.", required: true },
                  { id: "income", label: "Family Income Certificate", note: "Issued by the local CO/SDO. Annual income should be below ₹4.5 Lakh for BSCC eligibility.", required: true },
                  { id: "caste", label: "Caste Certificate (SC / ST / OBC, if applicable)", note: "Required for reserved-category seats and scholarship benefits.", required: false },
                ],
              },
              {
                group: "Other Essential",
                accent: "from-amber-500 to-orange-600",
                chip: "bg-amber-100 text-amber-700",
                docs: [
                  { id: "photos", label: "Passport-Size Photographs", note: "6–8 recent colour photographs on a white background.", required: true },
                  { id: "tc", label: "Transfer Certificate (TC)", note: "From the last school or college you attended.", required: true },
                  { id: "migration", label: "Migration Certificate (if from another board)", note: "Required when admitting to a state university after CBSE/ISC.", required: false },
                ],
              },
            ].map(({ group, accent, chip, docs }) => (
              <div key={group} className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
                <div className={`h-1.5 bg-gradient-to-r ${accent}`} />
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <h3 className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider ${chip}`}>
                      <FileText size={12} /> {group}
                    </h3>
                    <span className="text-xs font-extrabold text-gray-400">
                      {docs.filter((d) => checkedDocs[d.id]).length}/{docs.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {docs.map(({ id, label, note, required }) => (
                      <label
                        key={id}
                        htmlFor={id}
                        className={`group/doc flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all ${
                          checkedDocs[id]
                            ? "border-green-200 bg-green-50"
                            : "border-gray-200 bg-gray-50/60 hover:border-blue-300 hover:bg-white"
                        }`}
                      >
                        <input
                          type="checkbox"
                          id={id}
                          checked={!!checkedDocs[id]}
                          onChange={() => setCheckedDocs((prev) => ({ ...prev, [id]: !prev[id] }))}
                          className="sr-only"
                        />
                        <div className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                          checkedDocs[id] ? "border-green-500 bg-green-500" : "border-gray-300 group-hover/doc:border-blue-400"
                        }`}>
                          {checkedDocs[id] && <Check size={12} className="text-white" strokeWidth={3} />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start gap-1.5">
                            <span className={`text-sm font-bold leading-snug ${checkedDocs[id] ? "text-green-700 line-through" : "text-gray-900"}`}>
                              {label}
                            </span>
                            {required && (
                              <span className="whitespace-nowrap rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600">MUST</span>
                            )}
                          </div>
                          <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{note}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── WhatsApp CTA band ── */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#001f6b] to-[#003f9f] p-5 shadow-lg shadow-blue-900/10 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="hidden h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/15 sm:flex">
                <ListChecks size={24} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-white">All documents ready? Let&apos;s take the next step together.</p>
                <p className="text-sm text-blue-200">Visit our Forbesganj office for a free, no-obligation document verification.</p>
              </div>
            </div>
            <a
              href="https://wa.me/916203138576?text=नमस्ते!%20मैंने%20अपने%20admission%20documents%20collect%20कर%20लिए%20हैं।%20आगे%20का%20process%20बताएं।"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-primary-blue transition hover:bg-blue-50"
            >
              <MessageCircle size={15} /> Share on WhatsApp
            </a>
          </div>

          {/* ── Course-specific documents: full-width 4-column grid ── */}
          <div className="mt-12">
            <div className="mb-6 text-center">
              <h3 className="font-headline text-2xl md:text-3xl font-extrabold text-gray-900">Additional Documents by Course</h3>
              <p className="mt-1 text-sm text-gray-500">आपके चुने हुए course के अनुसार ये extra documents भी साथ रखें।</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  course: "B.Ed / M.Ed",
                  color: "border-blue-200 bg-blue-50",
                  badge: "bg-blue-100 text-blue-700",
                  check: "text-blue-500",
                  extras: [
                    "Graduation Degree & marksheets (all years)",
                    "Character Certificate from last institution",
                    "CTET/STET score card (if available, for preference)",
                    "Teaching Experience Certificate (for lateral entry if applicable)",
                  ],
                },
                {
                  course: "B.Sc Nursing / GNM / ANM",
                  color: "border-red-200 bg-red-50",
                  badge: "bg-red-100 text-red-700",
                  check: "text-red-500",
                  extras: [
                    "Medical Fitness Certificate from MBBS Doctor",
                    "PCB (Physics, Chemistry, Biology) 12th marksheet mandatory",
                    "Date of Birth Certificate (birth certificate or 10th admit card)",
                    "HIV/Hepatitis B test report (required by some colleges)",
                  ],
                },
                {
                  course: "B.Pharma / D.Pharma",
                  color: "border-green-200 bg-green-50",
                  badge: "bg-green-100 text-green-700",
                  check: "text-green-500",
                  extras: [
                    "12th PCB or PCM marksheet (Biology/Maths required)",
                    "NEET score card (for some private pharmacy colleges)",
                    "Gap Certificate (if gap year after 12th)",
                    "Pharmacy Council registration form (provided at admission)",
                  ],
                },
                {
                  course: "D.El.Ed",
                  color: "border-amber-200 bg-amber-50",
                  badge: "bg-amber-100 text-amber-700",
                  check: "text-amber-500",
                  extras: [
                    "12th Marksheet & Certificate (any stream, 50% marks)",
                    "Character Certificate from 12th school Principal",
                    "Domicile & Caste certificate for Bihar state merit list",
                    "SCERT application form (filled & signed)",
                  ],
                },
              ].map(({ course, color, badge, check, extras }) => (
                <div key={course} className={`flex flex-col rounded-2xl border-2 p-5 ${color}`}>
                  <span className={`mb-3 inline-flex w-fit items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-extrabold ${badge}`}>
                    <BookOpen size={11} /> {course}
                  </span>
                  <ul className="space-y-2">
                    {extras.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 size={14} className={`mt-0.5 flex-shrink-0 ${check}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Not-sure CTA — full width */}
            <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50 p-5 text-center sm:flex-row sm:text-left">
              <div>
                <p className="text-sm font-bold text-amber-800">Not sure which documents you need?</p>
                <p className="text-xs text-amber-700">Give us a quick call — counsellor 2 मिनट में आपके course की personalised list बताएँगे।</p>
              </div>
              <a href="tel:+916203138576" className="inline-flex flex-shrink-0 items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-amber-600">
                <Phone size={14} /> Call +91 6203138576
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ACCORDION ── */}
      <section id="faq" className="py-16 md:py-24 bg-gray-50">
        <div className="container-shell">
          {/* Header */}
          <div className="mb-14 overflow-hidden rounded-3xl bg-gradient-to-br from-[#001f6b] via-[#003f9f] to-[#0060c7] px-8 py-12 text-center shadow-2xl relative">
            {/* Decorative blobs */}
            <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-orange-400 opacity-20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-blue-300 opacity-20 blur-3xl" />
            {/* Badge */}
            <div className="relative mb-5 inline-flex items-center gap-2 rounded-full border border-orange-400/40 bg-orange-400/15 px-5 py-2">
              <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-orange-300">Frequently Asked Questions</span>
            </div>
            {/* Heading */}
            <h2 className="relative font-headline text-3xl md:text-5xl font-black text-white leading-tight">
              Every Question, Answered{" "}
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300 bg-clip-text text-transparent">
                Honestly
              </span>
            </h2>
            <p className="relative mt-4 text-blue-200 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Course selection से लेकर BSCC loan तक, admission प्रक्रिया से लेकर सरकारी नौकरी तक —<br className="hidden md:block" />
              <strong className="text-white">Siksha Wallah</strong> के विशेषज्ञ आपके हर सवाल का स्पष्ट और ईमानदार जवाब देते हैं।
            </p>
            {/* Stats row */}
            <div className="relative mt-8 flex flex-wrap justify-center gap-6">
              {[
                { num: "17+", label: "Common Questions" },
                { num: "5", label: "Topic Categories" },
                { num: "100%", label: "Free Counselling" },
              ].map(({ num, label }) => (
                <div key={label} className="flex flex-col items-center">
                  <span className="font-headline text-2xl font-black text-orange-400">{num}</span>
                  <span className="text-xs text-blue-200 font-medium mt-0.5">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_1.8fr] items-start">
            {/* Left — contact strip */}
            <AnimateIn type="fade-right" className="order-2 lg:order-1">
            <div className="lg:sticky lg:top-24">
              <div className="rounded-2xl bg-[#003f9f] p-6 text-white mb-6">
                <p className="font-headline text-lg font-extrabold mb-1">Prefer to speak in person?</p>
                <p className="text-blue-200 text-sm mb-5">Didn&apos;t find your answer here? Our counsellors are just one call away — free, friendly and honest.</p>
                <div className="space-y-3">
                  {[
                    { num: "6203138576", name: "Rajesh Kr. Sah", role: "Primary Admission Contact" },
                    { num: "7858062498", name: "Office Contact", role: "" },
                  ].map(({ num, name, role }) => (
                    <a key={num} href={`tel:+91${num}`} className="flex items-center gap-3 rounded-xl bg-white/10 border border-white/20 p-3 transition hover:bg-white/20">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-amber-400 text-gray-900">
                        <Phone size={15} />
                      </div>
                      <div>
                        <div className="font-bold text-sm">+91 {num}</div>
                        <div className="text-xs text-blue-200">{role ? `${name} · ${role}` : name}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
              {/* Category quick links — desktop only (non-interactive labels) */}
              <div className="hidden lg:block rounded-2xl border border-gray-200 bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Browse by Topic</p>
                <div className="space-y-2">
                  {[
                    { label: "Counselling & Services", color: "bg-blue-100 text-blue-700", range: "1–4" },
                    { label: "Choosing the Right Course", color: "bg-green-100 text-green-700", range: "5–9" },
                    { label: "Admission Process", color: "bg-blue-100 text-blue-700", range: "10–12" },
                    { label: "BSCC Loan Support", color: "bg-amber-100 text-amber-700", range: "13–15" },
                    { label: "Fees & Expenses", color: "bg-indigo-100 text-indigo-700", range: "16–17" },
                  ].map(({ label, color, range }) => (
                    <div key={label} className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold ${color}`}>
                      <span>{label}</span>
                      <span className="opacity-60">Q {range}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            </AnimateIn>

            {/* Right — question slider (NO AnimateIn wrapper: opacity-animation conflicts
                with the horizontal scroll container and was hiding the cards on mobile) */}
            <div className="order-1 lg:order-2">
              <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-gray-400">
                <ArrowRight size={13} className="text-[#003f9f]" /> Swipe करें · किसी भी सवाल पर tap करके पूरा जवाब देखें
              </p>
              <div
                ref={faqSliderRef}
                className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 lg:mx-0 lg:px-0"
                onTouchStart={() => { userInteracting.current = true; }}
                onTouchEnd={() => { setTimeout(() => { userInteracting.current = false; }, 2000); }}
                onMouseEnter={() => { userInteracting.current = true; }}
                onMouseLeave={() => { userInteracting.current = false; }}
              >
                {faqs.map(({ q }, i) => {
                  const s = getFaqStyle(i);
                  return (
                    <button
                      key={i}
                      onClick={() => setOpenFaq(i)}
                      style={{ touchAction: "manipulation" }}
                      className={`group flex w-[80%] flex-shrink-0 snap-start flex-col rounded-2xl border-2 ${s.border} bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:w-[300px]`}
                    >
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${s.bar} text-sm font-black text-white shadow`}>
                          {i + 1}
                        </span>
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${s.tag}`}>{s.label}</span>
                      </div>
                      <p className="line-clamp-3 flex-1 font-headline text-base font-bold leading-snug text-gray-900">
                        {q}
                      </p>
                      <span className={`mt-4 inline-flex items-center gap-1 text-xs font-bold transition-all group-hover:gap-2 ${s.text}`}>
                        पूरा जवाब पढ़ें <ArrowRight size={13} />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── CONTACT & LOCATION ── */}
      <section id="contact" className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-br from-[#00102e] via-[#001850] to-[#003590] text-white">
        {/* dot-grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="pointer-events-none absolute -top-32 -right-24 h-[400px] w-[400px] rounded-full bg-amber-400 opacity-[0.10] blur-3xl" />
        <div className="container-shell relative">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left — contact info */}
            <AnimateIn type="fade-right">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest mb-3 text-amber-400">Visit Our Counselling Centre</p>
              <h2 className="font-headline text-3xl md:text-5xl font-extrabold mb-6">
                Meet Our Counsellors Face-to-Face
              </h2>

              {/* Location card */}
              <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary-blue">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h3 className="font-headline text-lg font-extrabold text-white">Our Office Address</h3>
                    <p className="mt-1 text-blue-200">College Chowk, Near HP Petrol Pump</p>
                    <p className="text-blue-200">Forbesganj, Araria — Bihar 854318</p>
                    <a
                      href="https://maps.google.com/?q=College+Chowk+Forbesganj+Araria+Bihar"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-amber-400 hover:text-amber-300"
                    >
                      Get Directions on Google Maps →
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {[["6203138576", "Rajesh Kr. Sah — Primary Admission Contact"], ["7858062498", "Office Contact"]].map(([num, label]) => (
                  <a key={num} href={`tel:+91${num}`} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10 hover:border-amber-400/40">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-blue">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-white">+91 {num}</p>
                      <p className="text-xs text-blue-300">{label}</p>
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
                <MessageCircle size={20} /> Chat on WhatsApp
              </a>
            </div>
            </AnimateIn>

            {/* Right — Contact form with Firestore save */}
            <AnimateIn type="fade-left" delay={100}>
            <div className="rounded-2xl bg-white p-8 text-gray-900 shadow-xl">
              <h3 className="font-headline text-2xl font-extrabold mb-2">Plan Your Admission with Us</h3>
              <p className="text-gray-500 text-sm mb-6">Share a few quick details — our counsellor will personally call you back within 30 minutes.</p>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const f = e.currentTarget as HTMLFormElement;
                  const name = (f.elements.namedItem("cname") as HTMLInputElement).value;
                  const mobile = (f.elements.namedItem("cmobile") as HTMLInputElement).value;
                  const course = (f.elements.namedItem("ccourse") as HTMLSelectElement).value;
                  const qualify = (f.elements.namedItem("cqualify") as HTMLSelectElement).value;
                  try {
                    await saveInquiry({ fullName: name, mobile, course, message: `Qualification: ${qualify}` });
                  } catch (_) {}
                  const msg = encodeURIComponent(`New Inquiry from Siksha Wallah!\nName: ${name}\nMobile: ${mobile}\nCourse: ${course}\nQualification: ${qualify}`);
                  window.open(`https://wa.me/916203138576?text=${msg}`, "_blank");
                  f.reset();
                }}
                className="space-y-4"
              >
                <input name="cname" required placeholder="Student's Full Name" className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 outline-none focus:border-primary-blue transition" />
                <input name="cmobile" required type="tel" placeholder="Your Mobile Number" className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 outline-none focus:border-primary-blue transition" />
                <select name="ccourse" className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-gray-600 outline-none focus:border-primary-blue bg-white transition">
                  <option value="">-- Select a Course --</option>
                  <option>B.Ed / D.El.Ed</option>
                  <option>B.Sc Nursing / GNM / ANM</option>
                  <option>B.Pharma / D.Pharma</option>
                  <option>MBBS / BDS</option>
                  <option>BBA / MBA</option>
                  <option>B.Tech / Polytechnic / ITI</option>
                  <option>BCA / MCA</option>
                  <option>Not yet decided — I want guidance</option>
                </select>
                <select name="cqualify" className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-gray-600 outline-none focus:border-primary-blue bg-white transition">
                  <option value="">-- Highest Qualification --</option>
                  <option>10th Pass</option>
                  <option>12th Pass (Arts)</option>
                  <option>12th Pass (Science)</option>
                  <option>12th Pass (Commerce)</option>
                  <option>Graduation</option>
                  <option>Post Graduation</option>
                </select>
                <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary-blue py-4 font-extrabold text-white transition hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95">
                  Book My Free Counselling <ArrowRight size={18} />
                </button>
              </form>
              <p className="mt-4 text-center text-xs text-gray-400">100% Free • No Spam • No Hidden Charges • Your details stay confidential</p>
            </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA SECTION ── */}
      <section className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-br from-[#00102e] via-[#001850] to-[#003590]">
        {/* Dot grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        {/* Glow orbs */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-400 opacity-20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-blue-500 opacity-20 blur-3xl" />

        <div className="container-shell relative text-center text-white">
          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
            <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber-300">Session 2026–27 · Admissions Open</span>
          </div>

          {/* Headline */}
          <h2 className="font-headline text-3xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
            अभी{" "}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent [filter:drop-shadow(0_2px_16px_rgba(251,191,36,0.6))]">
              Free Admission Counselling
            </span>{" "}
            प्राप्त करें
          </h2>

          {/* Sub line */}
          <p className="mt-5 max-w-2xl mx-auto text-base md:text-lg text-blue-100 leading-relaxed">
            एक call में जानें — <strong className="text-white">कौन सा course आपके लिए सही है</strong>, कौन सा college verified है, और BSCC loan कैसे मिलेगा।{" "}
            <span className="font-bold text-amber-300">पहली counselling 100% Free।</span>
          </p>

          {/* Trust line */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {["कोई fee नहीं", "Spam नहीं", "200+ Verified Colleges", "5,000+ Students Guided"].map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-xs font-semibold text-blue-200">
                <Check size={11} className="text-amber-400" /> {t}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
            <a
              href="/apply"
              className="group relative flex w-full sm:w-auto items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-white px-8 py-4 font-extrabold text-[#003590] shadow-xl shadow-black/20 transition-all hover:-translate-y-1 hover:shadow-2xl active:scale-[0.97]"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-blue-100/50 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              <GraduationCap size={18} className="flex-shrink-0" />
              Apply Now — Free
              <ArrowRight size={16} className="flex-shrink-0 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="https://wa.me/916203138576?text=%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A5%87!%20%E0%A4%AE%E0%A5%81%E0%A4%9D%E0%A5%87%20Free%20Admission%20Counselling%20%E0%A4%9A%E0%A4%BE%E0%A4%B9%E0%A4%BF%E0%A4%8F%E0%A5%A4"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-2xl border-2 border-white/30 bg-white/10 px-8 py-4 font-extrabold text-white backdrop-blur transition-all hover:bg-white/20 hover:-translate-y-1 hover:border-white/50 active:scale-[0.97]"
            >
              <MessageCircle size={18} className="flex-shrink-0" />
              WhatsApp Now
            </a>
            <a
              href="tel:+916203138576"
              className="group flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-2xl border-2 border-white/20 bg-white/[0.07] px-8 py-4 font-bold text-white backdrop-blur transition-all hover:bg-white/[0.15] hover:-translate-y-1 active:scale-[0.97]"
            >
              <Phone size={18} className="flex-shrink-0" />
              Call Now
            </a>
          </div>

          {/* Office timing */}
          <p className="mt-8 text-xs text-blue-200/80">
            <Clock size={11} className="inline mr-1" />
            Office Hours: Monday–Saturday, 9:00 AM – 6:00 PM &nbsp;|&nbsp; Forbesganj, Araria, Bihar
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>

    {/* ── FAQ Q&A Modal — sibling of <main> so NO ancestor has overflow/clip/contain/transform ── */}
    {mounted && openFaq !== null && faqs[openFaq] && (
        <div
          onClick={() => setOpenFaq(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            display: "flex", alignItems: "flex-end", justifyContent: "center",
            padding: "16px", backgroundColor: "rgba(0,0,0,0.65)",
            WebkitBackdropFilter: "blur(4px)", backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="relative max-h-[88vh] w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`flex items-start justify-between gap-3 bg-gradient-to-r ${getFaqStyle(openFaq).bar} p-5 text-white`}>
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/20 text-base font-black">
                  {openFaq + 1}
                </span>
                <div>
                  <span className="mb-1 inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    {getFaqStyle(openFaq).label}
                  </span>
                  <h3 className="font-headline text-lg font-extrabold leading-snug">{faqs[openFaq].q}</h3>
                </div>
              </div>
              <button
                onClick={() => setOpenFaq(null)}
                aria-label="Close"
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/20 transition hover:bg-white/30"
              >
                <X size={16} />
              </button>
            </div>

            {/* Answer */}
            <div className="max-h-[50vh] overflow-y-auto p-6">
              <p className="whitespace-pre-line text-[15px] leading-relaxed text-gray-700">{faqs[openFaq].a}</p>
            </div>

            {/* Footer CTAs */}
            <div className="flex flex-col gap-2.5 border-t border-gray-100 p-5 sm:flex-row">
              <a
                href={`https://wa.me/916203138576?text=${encodeURIComponent(`नमस्ते! मेरा सवाल है: ${faqs[openFaq].q}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-bold text-white transition hover:bg-green-600"
              >
                <MessageCircle size={16} /> और पूछें — WhatsApp
              </a>
              <a
                href="tel:+916203138576"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#003f9f] px-5 py-3 font-bold text-white transition hover:bg-blue-700"
              >
                <Phone size={16} /> Counsellor को Call करें
              </a>
            </div>

            {/* Prev / Next navigation */}
            <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
              <button
                onClick={() => setOpenFaq(openFaq > 0 ? openFaq - 1 : faqs.length - 1)}
                className="flex items-center gap-1 text-xs font-bold text-gray-500 transition hover:text-[#003f9f]"
              >
                <ChevronDown size={14} className="rotate-90" /> पिछला
              </button>
              <span className="text-[11px] font-semibold text-gray-400">{openFaq + 1} / {faqs.length}</span>
              <button
                onClick={() => setOpenFaq(openFaq < faqs.length - 1 ? openFaq + 1 : 0)}
                className="flex items-center gap-1 text-xs font-bold text-gray-500 transition hover:text-[#003f9f]"
              >
                अगला <ChevronDown size={14} className="-rotate-90" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
