"use client";

import Link from "next/link";
import { useState } from "react";
import { saveInquiry } from "@/services/inquiry-service";
import {
  ArrowRight, BadgeCheck, BookOpen, BriefcaseBusiness, Building2, Check,
  ChevronDown, CreditCard, GraduationCap, HeartPulse, MapPin, Menu,
  MessageCircle, Phone, ShieldCheck, Sparkles, Star, Users, X,
  Stethoscope, FlaskConical, Cpu, Clock, Award, CheckCircle2,
  Briefcase, BookMarked, ChevronUp, FileCheck2, FileText, ListChecks,
} from "lucide-react";

/* ─── Data ─────────────────────────────────────────── */

type Course = {
  name: string;
  full: string;
  duration: string;
  eligibility: string;
  fee: string;
  careerScope: string;
  mode: string;
  bscc: boolean;
  hindiDesc: string;
};

const teachingCourses: Course[] = [
  {
    name: "B.Ed",
    full: "Bachelor of Education",
    duration: "2 Years",
    eligibility: "Graduation with minimum 50% marks in any stream from a recognized university",
    fee: "₹50,000/yr",
    careerScope: "Government School Teacher (TET/CTET qualified), Private School Teacher, Education Officer, School Principal, Content Developer for EdTech companies. Bihar STET qualified B.Ed graduates get direct government job opportunities in middle & high schools.",
    mode: "Regular & Distance options available from NCTE-approved recognized Indian universities. Siksha Wallah guides students for both modes based on eligibility and career goals.",
    bscc: true,
    hindiDesc: "B.Ed Bihar का सबसे popular teaching course है। Graduation के बाद 2 साल का यह course करके आप government या private school में teacher बन सकते हैं। Bihar STET pass करने के बाद सरकारी नौकरी मिलती है। BSCC loan से fees का बोझ नहीं पड़ता।",
  },
  {
    name: "D.El.Ed",
    full: "Diploma in Elementary Education",
    duration: "2 Years",
    eligibility: "12th Pass (any stream) with minimum 50% marks. Age limit: 18–35 years",
    fee: "₹25,000/yr",
    careerScope: "Primary School Teacher (Class 1–8) in government and private schools, Anganwadi Supervisor, NGO Education Worker. BTET/CTET qualification opens government Primary Teacher posts across Bihar with excellent salary packages.",
    mode: "Regular mode from SCERT/state-approved institutions. Distance mode available from select NCTE-recognized universities. We assist with both options.",
    bscc: true,
    hindiDesc: "D.El.Ed (पहले BTC) 10th और 12th pass students के लिए primary school teacher बनने का सबसे सीधा रास्ता है। 2 साल के इस diploma के बाद Class 1–8 में teaching कर सकते हैं। Bihar में BTET पास करने पर सरकारी Primary Teacher की नौकरी मिलती है।",
  },
  {
    name: "M.Ed",
    full: "Master of Education",
    duration: "2 Years",
    eligibility: "B.Ed with minimum 55% marks from a UGC-recognized university",
    fee: "₹60,000/yr",
    careerScope: "College Lecturer (NET/SET qualified), School Principal, Curriculum Developer, Educational Researcher, Teacher Trainer, Academic Coordinator at SCERT/NCERT. M.Ed opens doors to PhD in Education and academic careers.",
    mode: "Regular mode from NAAC-accredited universities. Distance mode available from select institutions recognized by DEB (Distance Education Bureau). We guide based on your preference.",
    bscc: false,
    hindiDesc: "M.Ed teaching field की master degree है। B.Ed के बाद यह course करके आप college lecturer, school principal, या education researcher बन सकते हैं। NET/SET qualify करने पर university में professor की नौकरी मिलती है। Education में PhD का रास्ता भी M.Ed से खुलता है।",
  },
];

const medicalCourses: Course[] = [
  {
    name: "MBBS",
    full: "Bachelor of Medicine & Bachelor of Surgery",
    duration: "5.5 Years (inc. 1-yr internship)",
    eligibility: "12th Science (PCB) with minimum 50% marks + NEET UG qualification. Age: 17+ years",
    fee: "₹8–25 Lakh/yr (varies by college)",
    careerScope: "Government Doctor (BPSC Civil Services), Private Hospital Specialist, Surgeon, Researcher, Medical Officer. MBBS graduates from recognized colleges are eligible for PG (MD/MS) entrance. Extremely high demand in Bihar's rural health sector.",
    mode: "Regular mode only from MCI/NMC-approved medical colleges. We guide for both government and private college admissions through NEET counselling.",
    bscc: false,
    hindiDesc: "MBBS भारत का सबसे prestigious medical course है। NEET पास करके government या private medical college में admission लें। 5.5 साल (internship सहित) के बाद आप डॉक्टर बनते हैं। Bihar के rural areas में government doctor की बहुत demand है। BPSC civil services से सरकारी नौकरी भी मिलती है।",
  },
  {
    name: "BDS",
    full: "Bachelor of Dental Surgery",
    duration: "5 Years (inc. 1-yr internship)",
    eligibility: "12th Science (PCB) with minimum 50% marks + NEET UG qualification",
    fee: "₹5–15 Lakh/yr",
    careerScope: "Private Dental Clinic Owner, Hospital Dental Surgeon, Government Dental Officer, MDS Specialist (Orthodontist, Endodontist). BDS graduates can also join dental product companies and public health programs.",
    mode: "Regular mode only from DCI-approved dental colleges. We provide complete NEET counselling guidance for state and all-India quota seats.",
    bscc: false,
    hindiDesc: "BDS dental surgeon बनने का course है। NEET qualify करके 5 साल में Dental Surgeon बनें। अपना private clinic खोलें या government hospital में काम करें। MDS (specialization) करने पर Orthodontist, Endodontist जैसे specialist बन सकते हैं।",
  },
  {
    name: "B.Sc Nursing",
    full: "Bachelor of Science in Nursing",
    duration: "4 Years",
    eligibility: "12th Science (PCB or PCM+Biology) with minimum 45% marks (40% for SC/ST). Age: 17–35 years",
    fee: "₹60,000/yr",
    careerScope: "Staff Nurse in Government Hospitals (AIIMS, ESIC, Railway, Armed Forces), Private Hospitals, Nursing Tutor, Community Health Nurse. B.Sc Nursing is the most in-demand healthcare course with jobs across India and abroad (UK, Canada, Gulf countries).",
    mode: "Regular mode from INC (Indian Nursing Council) approved colleges. We help with both Bihar state quota and all-India private college admissions.",
    bscc: true,
    hindiDesc: "B.Sc Nursing healthcare sector का सबसे in-demand course है। 4 साल का यह degree course AIIMS, Railway, ESIC जैसे top government hospitals में Staff Nurse की नौकरी दिलाता है। विदेश (UK, Canada, Gulf) में भी भारतीय nurses की बहुत demand है। BSCC loan से fees cover होती है।",
  },
  {
    name: "GNM",
    full: "General Nursing & Midwifery",
    duration: "3 Years + 6-month internship",
    eligibility: "12th Pass (Science preferred, PCB). Minimum 40% marks. Age: 17–35 years",
    fee: "₹40,000/yr",
    careerScope: "Staff Nurse in Government & Private Hospitals, Community Health Worker, Midwife, Home Care Nurse. GNM nurses are eligible for government nursing recruitment exams (NHM, ESIC, Railway). High demand in Bihar's Primary Health Centers.",
    mode: "Regular mode from INC-approved nursing schools and colleges. Both government and private institutions available. BSCC loan assistance available for eligible students.",
    bscc: true,
    hindiDesc: "GNM 3 साल का nursing diploma है जो government और private hospitals में Staff Nurse की नौकरी दिलाता है। NHM, ESIC, और Railway में GNM nurses की regular भर्ती होती है। Bihar के Primary Health Centers में भी बहुत scope है। BSCC loan available है।",
  },
  {
    name: "ANM",
    full: "Auxiliary Nursing & Midwifery",
    duration: "2 Years",
    eligibility: "10th Pass (for girls only) from a recognized board. Age: 17–35 years",
    fee: "₹25,000/yr",
    careerScope: "ANM/ASHA Worker in Government Health Programs, Community Health Center Nurse, Health Education Worker, Sub-Center Nurse. Bihar government regularly recruits ANM graduates under NHM with good salary and job security.",
    mode: "Regular mode from INC-approved schools. Short duration and low-cost course — ideal for girls from rural areas seeking stable government healthcare jobs.",
    bscc: true,
    hindiDesc: "ANM सिर्फ लड़कियों के लिए 2 साल का nursing course है — केवल 10th pass होना जरूरी है। Bihar government NHM के तहत ANM की regular भर्ती करती है। गाँव के Primary Health Center और Sub-Center में stable government नौकरी मिलती है। कम fees, BSCC loan भी मिलता है।",
  },
  {
    name: "B.Pharma",
    full: "Bachelor of Pharmacy",
    duration: "4 Years",
    eligibility: "12th Science (PCB or PCM) with minimum 45% marks from recognized board",
    fee: "₹55,000/yr",
    careerScope: "Pharmacist in Government Hospitals & Dispensaries, Drug Inspector, Quality Control Officer in Pharma Companies, Medical Representative, Clinical Research Associate, Retail Pharmacy Owner. B.Pharma graduates are eligible for government pharmacy exams.",
    mode: "Regular & Distance modes available from PCI (Pharmacy Council of India) and AICTE-approved institutions. We guide for both Bihar and out-of-state admissions.",
    bscc: true,
    hindiDesc: "B.Pharma 4 साल का pharmacy degree course है। Pharmacist, Drug Inspector, Medical Representative, या खुद की pharmacy shop — कई रास्ते हैं। Government hospital में pharmacist बनने का सपना B.Pharma से पूरा होता है। Pharma companies में भी अच्छी salary मिलती है। BSCC loan eligible है।",
  },
];

const technicalCourses: Course[] = [
  {
    name: "B.Tech",
    full: "Bachelor of Technology",
    duration: "4 Years",
    eligibility: "12th Science (PCM) with minimum 45% marks. JEE Main/State CET scores preferred",
    fee: "₹80,000/yr (varies by branch & college)",
    careerScope: "Software Engineer, Civil/Mechanical/Electrical Engineer, Government Engineer (BPSC/SSC JE), IT Company Employee, Startup Founder. B.Tech from AICTE-approved colleges is recognized for both private sector and government recruitment.",
    mode: "Regular mode from AICTE-approved colleges. We guide for JEE counselling, Bihar DCECE, and private B.Tech admissions with lateral entry options.",
    bscc: true,
    hindiDesc: "B.Tech engineering का 4 साल का degree course है। Computer Science, Civil, Mechanical, Electrical — अपना branch चुनें। JEE Main या Bihar DCECE से government college में admission पाएं। TCS, Infosys जैसी IT companies और BPSC/SSC JE से government engineer — दोनों रास्ते खुले हैं। BSCC loan available।",
  },
  {
    name: "Polytechnic",
    full: "Diploma in Engineering",
    duration: "3 Years",
    eligibility: "10th Pass with minimum 35% marks in any recognized board",
    fee: "₹30,000/yr",
    careerScope: "Junior Engineer in PWD/BSEB/NHAI, Factory Supervisor, Technical Assistant, ITI Instructor. Diploma holders can directly enter 2nd year B.Tech (Lateral Entry). Government jobs via BSSC and SSC JE after diploma.",
    mode: "Regular mode from AICTE-approved polytechnic colleges in Bihar and other states. Government polytechnic seats available at very low fees through DCECE counselling.",
    bscc: true,
    hindiDesc: "Polytechnic (Diploma in Engineering) 3 साल का course है जो 10th pass के बाद किया जा सकता है। इसके बाद B.Tech 2nd year में lateral entry मिलती है। PWD, BSEB, NHAI में Junior Engineer की नौकरी मिलती है। Government polytechnic में fees बहुत कम है — Bihar DCECE से सस्ती सीट पाएं।",
  },
  {
    name: "ITI",
    full: "Industrial Training Institute",
    duration: "1–2 Years (varies by trade)",
    eligibility: "8th/10th Pass depending on trade. No upper age limit for most trades",
    fee: "₹15,000/yr (Government ITI is near free)",
    careerScope: "Electrician, Fitter, Welder, Plumber, AC Mechanic, Computer Operator in Industries, Railways, Defence, and Private sector. ITI certificate holders get direct railway apprenticeship and factory jobs. Self-employment through workshops also common.",
    mode: "Regular mode from DGT (Directorate General of Training) affiliated government and private ITI colleges. Hostel and BSCC facilities available at select colleges.",
    bscc: true,
    hindiDesc: "ITI 1–2 साल का vocational training course है जो 8th/10th के बाद किया जा सकता है। Electrician, Fitter, Welder, Computer Operator — कई trades हैं। Railway apprenticeship और factory jobs सीधे मिलती हैं। Government ITI में fees लगभग free है। खुद का workshop खोलकर भी अच्छी कमाई होती है।",
  },
  {
    name: "BCA",
    full: "Bachelor of Computer Applications",
    duration: "3 Years",
    eligibility: "12th Pass (any stream, preferably with Maths or Computer Science). Minimum 45% marks",
    fee: "₹40,000/yr",
    careerScope: "Software Developer, Web Designer, Database Administrator, IT Support Engineer, App Developer. BCA graduates can join MCA (2 years) or directly apply to IT companies like Infosys, TCS, Wipro. High demand in Bihar's growing IT sector.",
    mode: "Regular & Distance modes available from AICTE/UGC-approved universities. Distance BCA from IGNOU and state universities is widely recognized for government jobs too.",
    bscc: true,
    hindiDesc: "BCA computer science का 3 साल का bachelor degree है जो 12th के बाद किया जाता है। Software Developer, Web Designer, App Developer बनने का सबसे affordable रास्ता। TCS, Infosys, Wipro जैसी IT companies में placement मिलती है। MCA करके career और आगे बढ़ा सकते हैं। BSCC loan से fees cover होती है।",
  },
  {
    name: "MCA",
    full: "Master of Computer Applications",
    duration: "2 Years",
    eligibility: "BCA / B.Sc (Computer Science / IT / Maths) with minimum 50% marks",
    fee: "₹55,000/yr",
    careerScope: "Senior Software Developer, System Analyst, Project Manager, Cybersecurity Specialist, IT Consultant. MCA qualifies for SSC (CPO/CGL), IBPS IT Officer, and State PSC technical posts. Excellent placement in top IT companies.",
    mode: "Regular & Distance modes from AICTE-approved universities. NIMCET for NIT admissions. We assist with both state universities and top private college admissions.",
    bscc: false,
    hindiDesc: "MCA computer science की master degree है — BCA के बाद 2 साल का यह course Senior Developer, System Analyst, या Project Manager बनाता है। SSC CGL, IBPS IT Officer, और State PSC technical posts के लिए भी eligible होते हैं। Top IT companies में excellent placement और high salary package मिलता है।",
  },
  {
    name: "BBA",
    full: "Bachelor of Business Administration",
    duration: "3 Years",
    eligibility: "12th Pass (any stream) with minimum 45% marks from recognized board",
    fee: "₹35,000/yr",
    careerScope: "Business Manager, Marketing Executive, HR Officer, Sales Manager, Entrepreneur, Bank Officer (IBPS PO/Clerk). BBA is the ideal foundation for MBA. Graduates are hired by banks, FMCG companies, and retail chains across India.",
    mode: "Regular & Distance modes available. Distance BBA from recognized universities like IGNOU, SMU, Amity is valid for government and private sector jobs. BSCC loan available.",
    bscc: true,
    hindiDesc: "BBA business management का 3 साल का degree course है। Marketing, HR, Finance, या Sales में career शुरू करें। Bank Officer (IBPS PO) बनने की तैयारी के साथ-साथ करें। MBA के लिए सबसे मजबूत foundation BBA से ही आती है। Companies, banks, और startups सभी BBA graduates hire करते हैं।",
  },
  {
    name: "MBA",
    full: "Master of Business Administration",
    duration: "2 Years",
    eligibility: "Graduation (any stream) with minimum 50% marks. CAT/MAT/CMAT scores for premium institutes",
    fee: "₹70,000–3 Lakh/yr (varies widely)",
    careerScope: "Operations Manager, Finance Manager, Marketing Head, HR Director, Startup CEO, IAS/IPS (Civil Services). MBA from AICTE-approved college is a top credential for corporate and government leadership roles.",
    mode: "Regular & Distance modes available. Regular MBA for premium placements; Distance MBA from UGC-DEB approved universities valid for government jobs. We guide for both entrance and direct admission routes.",
    bscc: false,
    hindiDesc: "MBA management की master degree है — business world में सबसे respected qualification। Graduation के बाद CAT/MAT/CMAT देकर top B-School में admission पाएं। Finance Manager, Marketing Head, HR Director, या खुद का business — सब कुछ MBA से possible है। Government leadership roles के लिए भी MBA बहुत काम आती है।",
  },
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

const streamTabs: { key: StreamKey; label: string; icon: typeof GraduationCap; color: string; courses: Course[] }[] = [
  { key: "teaching", label: "Teaching Courses", icon: GraduationCap, color: "blue", courses: teachingCourses },
  { key: "medical", label: "Medical & Nursing", icon: Stethoscope, color: "red", courses: medicalCourses },
  { key: "technical", label: "Technical & Management", icon: Cpu, color: "orange", courses: technicalCourses },
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
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
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
      saveInquiry({ fullName: formData.name, mobile: formData.mobile, course: formData.course, message: `Qualification: ${formData.qualify}` }).catch(() => {});
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
            {[["#courses", "Courses"], ["#bscc", "BSCC"], ["/about", "About Us"], ["/contact", "Contact"]].map(([href, label]) => (
              href.startsWith("/")
                ? <Link key={href} href={href} className="transition hover:text-primary-blue">{label}</Link>
                : <a key={href} href={href} className="transition hover:text-primary-blue">{label}</a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <a href="tel:+916203138576" className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-bold text-gray-700 transition hover:border-primary-blue hover:text-primary-blue">
              <Phone size={14} /> 6203138576
            </a>
            <Link href="/auth/login" className="rounded-lg border-2 border-primary-blue px-4 py-2 text-sm font-bold text-primary-blue transition hover:bg-primary-blue hover:text-white">
              Student Login
            </Link>
            <Link href="/auth/register" className="rounded-lg bg-primary-red px-5 py-2 text-sm font-bold text-white transition hover:bg-red-700 shadow-md shadow-red-200">
              Apply Now →
            </Link>
          </div>

          <button aria-label="Open menu" className="rounded-lg p-2 lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-gray-100 bg-white px-6 py-5 lg:hidden">
            <div className="flex flex-col gap-4 font-semibold text-sm">
              {[["#courses", "Courses"], ["#bscc", "BSCC"], ["/about", "About Us"], ["/contact", "Contact"]].map(([href, label]) => (
                href.startsWith("/")
                  ? <Link key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>
                  : <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
              ))}
              <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="rounded-lg border-2 border-primary-blue px-4 py-2.5 text-center font-bold text-primary-blue">
                Student Login
              </Link>
              <Link href="/auth/register" onClick={() => setMenuOpen(false)} className="rounded-lg bg-primary-red px-4 py-2.5 text-center text-white font-bold">
                Apply Now →
              </Link>
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
            {stream.courses.map((course) => {
              const isExpanded = expandedCard === course.name;
              return (
                <div
                  key={course.name}
                  className={`group relative rounded-2xl border-2 bg-white shadow-sm transition-all ${colors.card} ${isExpanded ? "border-opacity-100 shadow-lg" : "border-gray-200"}`}
                >
                  {/* Card Header — always visible */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-2">
                      <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${colors.badge}`}>
                        <Award size={12} /> {course.name}
                      </div>
                      {course.bscc && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                          <CreditCard size={10} /> BSCC
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 font-headline text-xl font-extrabold text-gray-900 leading-tight">{course.full}</h3>

                    {/* Core facts — always shown */}
                    <div className="mt-4 space-y-2.5 text-sm text-gray-600">
                      <div className="flex items-start gap-2">
                        <Clock size={14} className="mt-0.5 flex-shrink-0 text-gray-400" />
                        <span><strong className="text-gray-800">Duration:</strong> {course.duration}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 text-gray-400" />
                        <span><strong className="text-gray-800">Eligibility:</strong> {course.eligibility}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CreditCard size={14} className="mt-0.5 flex-shrink-0 text-gray-400" />
                        <span><strong className="text-gray-800">Approx. Fee:</strong> {course.fee}</span>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-5 space-y-4 border-t border-gray-100 pt-4">
                        {/* Hindi Description */}
                        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
                          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600">
                            <Sparkles size={12} /> हिंदी में जानें
                          </div>
                          <p className="text-sm leading-relaxed text-amber-900">{course.hindiDesc}</p>
                        </div>
                        <div>
                          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
                            <Briefcase size={12} /> Career Scope
                          </div>
                          <p className="text-sm leading-relaxed text-gray-700">{course.careerScope}</p>
                        </div>
                        <div>
                          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
                            <BookMarked size={12} /> Study Mode
                          </div>
                          <p className="text-sm leading-relaxed text-gray-700">{course.mode}</p>
                        </div>
                        {course.bscc && (
                          <div className="rounded-xl bg-green-50 border border-green-200 p-3 flex items-start gap-2">
                            <CreditCard size={15} className="mt-0.5 flex-shrink-0 text-green-600" />
                            <p className="text-xs text-green-700 font-semibold">Bihar Student Credit Card (BSCC) eligible — get up to ₹4 Lakh loan for this course at 4% interest.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Toggle + CTA */}
                    <div className="mt-5 flex flex-col gap-2">
                      <button
                        onClick={() => setExpandedCard(isExpanded ? null : course.name)}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-gray-200 py-2.5 text-sm font-bold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                      >
                        {isExpanded ? (
                          <><ChevronUp size={15} /> Hide Details</>
                        ) : (
                          <><ChevronDown size={15} /> View Career Scope & Mode</>
                        )}
                      </button>
                      <a
                        href={`https://wa.me/916203138576?text=Hi! I want to inquire about ${course.name} (${course.full}). Duration: ${course.duration}. Please guide me on fees and admission process.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white transition ${colors.btn}`}
                      >
                        <MessageCircle size={15} /> Inquire Fee & Admission
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
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

          {/* BSCC Benefits Row */}
          <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["₹4 Lakh Loan", "Tuition, hostel, food, books — all covered"],
              ["4% Interest", "1% for women & differently-abled"],
              ["40+ Courses", "B.Ed, Nursing, B.Tech, MBBS & more"],
              ["No Collateral", "No guarantor, no property mortgage"],
              ["Pay After Job", "Repay only after you start earning"],
            ].map(([title, desc]) => (
              <div key={title as string} className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="mt-0.5 flex-shrink-0 rounded-full bg-green-500 p-1">
                  <Check size={13} />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{title}</p>
                  <p className="text-xs text-blue-200 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* BSCC Step-by-Step Process */}
          <div className="mb-12 rounded-2xl border border-white/15 bg-white/5 p-7 backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400">
                <ListChecks size={18} className="text-gray-900" />
              </div>
              <h3 className="font-headline text-2xl font-extrabold text-amber-400">BSCC Application Process — Step by Step</h3>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  num: "01",
                  title: "Document Verification at Siksha Wallah",
                  location: "College Chowk, Forbesganj (Our Office)",
                  desc: "Visit our office with your original documents. Our expert team verifies your eligibility, checks all certificates, and prepares a complete document file for BSCC application. We ensure nothing is missing before proceeding.",
                  icon: FileCheck2,
                  color: "text-blue-300",
                },
                {
                  num: "02",
                  title: "College Selection & Bonafide Certificate",
                  location: "Selected BSCC-Approved College",
                  desc: "We help you select the right BSCC-approved college based on your course and location preference. After securing admission, the college provides a Bonafide Certificate confirming your enrollment — required for BSCC loan application.",
                  icon: GraduationCap,
                  color: "text-green-300",
                },
                {
                  num: "03",
                  title: "DRCC Office Registration & Approval",
                  location: "District Registration & Counselling Centre (DRCC)",
                  desc: "Your complete application is submitted at the DRCC office (District Headquarter). The loan is processed through your bank account directly. Siksha Wallah team accompanies and guides you through the entire DRCC process.",
                  icon: BadgeCheck,
                  color: "text-amber-300",
                },
              ].map(({ num, title, location, desc, icon: StepIcon, color }) => (
                <div key={num} className="relative">
                  {/* Connector line */}
                  <div className="relative rounded-2xl border border-white/10 bg-white/5 p-5 h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-headline text-5xl font-extrabold text-white/10 leading-none">{num}</span>
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/10 ${color}`}>
                        <StepIcon size={18} />
                      </div>
                    </div>
                    <h4 className="font-headline font-extrabold text-white text-base mb-1">{title}</h4>
                    <p className={`text-xs font-semibold mb-3 ${color}`}>📍 {location}</p>
                    <p className="text-sm text-blue-100 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
              <CheckCircle2 size={20} className="mt-0.5 flex-shrink-0 text-green-400" />
              <p className="text-sm font-semibold text-green-200">
                <strong className="text-green-300">100% Free Guidance:</strong> हमारी team पूरे BSCC application process में आपकी निःशुल्क (free) सहायता करती है — document preparation से DRCC approval तक। कोई extra charge नहीं।
              </p>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-2 items-start">
            {/* Documents required for BSCC */}
            <div className="space-y-4">
              <h3 className="font-headline text-xl font-extrabold text-amber-400">BSCC के लिए Required Documents</h3>
              {[
                ["Aadhaar Card", "Student's original Aadhaar linked to mobile"],
                ["10th & 12th Marksheet + Certificate", "Original & photocopy both required"],
                ["Domicile Certificate", "Bihar state residence proof"],
                ["Income Certificate", "Family annual income below ₹4.5 Lakh"],
                ["Bank Account Details", "Student's own savings account (SBI/BOI preferred)"],
                ["College Bonafide Certificate", "Issued by BSCC-approved enrolled college"],
                ["Passport Size Photos", "4 recent color photographs on white background"],
                ["PAN Card (if available)", "Student's or parent's PAN for verification"],
              ].map(([doc, detail]) => (
                <div key={doc as string} className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5">
                  <Check size={15} className="mt-0.5 flex-shrink-0 text-green-400" />
                  <div>
                    <p className="text-sm font-bold text-white">{doc}</p>
                    <p className="text-xs text-blue-300 mt-0.5">{detail}</p>
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
          </div>{/* end lg:grid-cols-2 */}
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

      {/* ── DOCUMENTS CHECKLIST ── */}
      <section id="documents" className="py-24 bg-white">
        <div className="container-shell">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-primary-blue mb-2">Admission Preparation</p>
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold">Required Documents Checklist</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              Tick off each document as you gather it. Bring all originals + 2 photocopies to the Siksha Wallah office.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] items-start">
            {/* Interactive Checklist */}
            <div className="rounded-2xl border-2 border-gray-100 bg-gray-50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between bg-primary-blue px-6 py-4">
                <div className="flex items-center gap-2 text-white">
                  <ListChecks size={20} />
                  <span className="font-headline font-extrabold text-lg">Document Checklist</span>
                </div>
                <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-bold text-white">
                  {Object.values(checkedDocs).filter(Boolean).length} / {[
                    "10th-marksheet", "12th-marksheet", "graduation", "aadhaar",
                    "residential", "income", "caste", "photos", "tc", "migration"
                  ].length} Done
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full bg-gray-200">
                <div
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{
                    width: `${(Object.values(checkedDocs).filter(Boolean).length / 10) * 100}%`,
                  }}
                />
              </div>

              {/* Document Groups */}
              <div className="p-5 space-y-5">
                {[
                  {
                    group: "Academic Documents",
                    color: "bg-blue-100 text-blue-700",
                    docs: [
                      { id: "10th-marksheet", label: "10th Marksheet & Passing Certificate", note: "Original board certificate required", required: true },
                      { id: "12th-marksheet", label: "12th Marksheet & Passing Certificate", note: "All subjects marksheet + passing/migration cert.", required: true },
                      { id: "graduation", label: "Graduation Degree & All Year Marksheets", note: "Required for B.Ed, M.Ed, MBA, MCA, and all PG courses", required: false },
                    ],
                  },
                  {
                    group: "Identity & Residence Documents",
                    color: "bg-green-100 text-green-700",
                    docs: [
                      { id: "aadhaar", label: "Aadhaar Card (Student)", note: "Must be linked to active mobile number", required: true },
                      { id: "residential", label: "Residential / Domicile Certificate", note: "Bihar domicile certificate from SDO/Circle Office", required: true },
                      { id: "income", label: "Income Certificate", note: "Annual family income certificate from CO/SDO (₹4.5L limit for BSCC)", required: true },
                      { id: "caste", label: "Caste Certificate (SC/ST/OBC if applicable)", note: "Required for reserved category seats & scholarships", required: false },
                    ],
                  },
                  {
                    group: "Other Essential Documents",
                    color: "bg-amber-100 text-amber-700",
                    docs: [
                      { id: "photos", label: "Passport Size Photographs", note: "6–8 recent color photos on white background", required: true },
                      { id: "tc", label: "Transfer Certificate (TC)", note: "From your last attended school/college", required: true },
                      { id: "migration", label: "Migration Certificate (if from another board)", note: "Required if 12th was from CBSE/ISC for state university admission", required: false },
                    ],
                  },
                ].map(({ group, color, docs }) => (
                  <div key={group}>
                    <h3 className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-extrabold uppercase tracking-wider mb-3 ${color}`}>
                      <FileText size={12} /> {group}
                    </h3>
                    <div className="space-y-2">
                      {docs.map(({ id, label, note, required }) => (
                        <label
                          key={id}
                          htmlFor={id}
                          className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-all ${
                            checkedDocs[id]
                              ? "border-green-300 bg-green-50"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div className="relative mt-0.5 flex-shrink-0">
                            <input
                              type="checkbox"
                              id={id}
                              checked={!!checkedDocs[id]}
                              onChange={() => setCheckedDocs((prev) => ({ ...prev, [id]: !prev[id] }))}
                              className="sr-only"
                            />
                            <div className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-all ${
                              checkedDocs[id] ? "border-green-500 bg-green-500" : "border-gray-300"
                            }`}>
                              {checkedDocs[id] && <Check size={12} className="text-white" strokeWidth={3} />}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-sm font-bold ${checkedDocs[id] ? "text-green-700 line-through" : "text-gray-900"}`}>
                                {label}
                              </span>
                              {required && (
                                <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600">REQUIRED</span>
                              )}
                            </div>
                            <p className="mt-0.5 text-xs text-gray-500">{note}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                {/* CTA after checklist */}
                <div className="rounded-xl bg-primary-blue p-4 text-white flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-bold text-sm">Documents ready? Visit us or call!</p>
                    <p className="text-xs text-blue-200">We verify all documents for FREE at our Forbesganj office.</p>
                  </div>
                  <a
                    href="https://wa.me/916203138576?text=Hi! I have collected my admission documents. Please guide me for next steps."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-primary-blue hover:bg-blue-50 transition"
                  >
                    <MessageCircle size={15} /> WhatsApp Now
                  </a>
                </div>
              </div>
            </div>

            {/* Right panel — course-wise special docs */}
            <div className="space-y-5">
              <h3 className="font-headline text-2xl font-extrabold text-gray-900">Course-Specific Additional Requirements</h3>
              {[
                {
                  course: "B.Ed / M.Ed",
                  color: "border-blue-200 bg-blue-50",
                  badge: "bg-blue-100 text-blue-700",
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
                  extras: [
                    "12th Marksheet & Certificate (any stream, 50% marks)",
                    "Character Certificate from 12th school Principal",
                    "Domicile & Caste certificate for Bihar state merit list",
                    "SCERT application form (filled & signed)",
                  ],
                },
              ].map(({ course, color, badge, extras }) => (
                <div key={course} className={`rounded-xl border-2 p-5 ${color}`}>
                  <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-extrabold mb-3 ${badge}`}>
                    <BookOpen size={11} /> {course}
                  </span>
                  <ul className="space-y-2">
                    {extras.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 text-gray-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 p-5">
                <p className="font-bold text-amber-800 text-sm mb-1">Not sure what to bring?</p>
                <p className="text-xs text-amber-700 mb-3">Call us and our team will give you a complete custom document list for your specific course in 2 minutes.</p>
                <a href="tel:+916203138576" className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-amber-600 transition">
                  <Phone size={14} /> Call: 6203138576
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ACCORDION ── */}
      <section id="faq" className="py-24 bg-gray-50">
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

            {/* Right — Contact form with Firestore save */}
            <div className="rounded-2xl bg-white p-8 text-gray-900 shadow-xl">
              <h3 className="font-headline text-2xl font-extrabold mb-2">Admission Plan बनाइए</h3>
              <p className="text-gray-500 text-sm mb-6">Fill the form — हमारा counsellor 30 minutes में call करेगा।</p>
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
                  const msg = `New Inquiry from Siksha Wallah!%0AName: ${name}%0AMobile: ${mobile}%0ACourse: ${course}%0AQualification: ${qualify}`;
                  window.open(`https://wa.me/916203138576?text=${msg}`, "_blank");
                  f.reset();
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
                <select name="cqualify" className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-gray-600 outline-none focus:border-primary-blue bg-white transition">
                  <option value="">-- Current Qualification --</option>
                  <option>10th Pass</option>
                  <option>12th Pass (Arts)</option>
                  <option>12th Pass (Science)</option>
                  <option>12th Pass (Commerce)</option>
                  <option>Graduation</option>
                  <option>Post Graduation</option>
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
                {[["#courses", "Courses"], ["#bscc", "BSCC Scheme"], ["/about", "About Us"], ["/contact", "Contact"], ["/auth/login", "Student Login"], ["/admin/login", "Admin Login"]].map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="hover:text-white transition">{label}</Link>
                  </li>
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
