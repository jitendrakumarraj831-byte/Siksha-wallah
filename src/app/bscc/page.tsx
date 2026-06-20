"use client";

import { useState } from "react";
import { PortalShell } from "@/components/portal-shell";
import { saveInquiry } from "@/services/inquiry-service";
import {
  CreditCard, Check, CheckCircle2, X, Phone, MessageCircle,
  ArrowRight, FileCheck2, GraduationCap, BadgeCheck, ListChecks,
  ChevronDown, Clock, Users, BookOpen,
} from "lucide-react";
import Link from "next/link";

const eligibleCourses = [
  { name: "B.Ed", stream: "Teaching" }, { name: "D.El.Ed", stream: "Teaching" },
  { name: "B.Sc Nursing", stream: "Medical" }, { name: "GNM", stream: "Medical" },
  { name: "ANM", stream: "Medical" }, { name: "B.Pharma", stream: "Medical" },
  { name: "B.Tech", stream: "Technical" }, { name: "Polytechnic", stream: "Technical" },
  { name: "ITI", stream: "Technical" }, { name: "BCA", stream: "Technical" },
  { name: "BBA", stream: "Management" }, { name: "MBA", stream: "Management" },
];

const bsccFaqs = [
  { q: "BSCC loan कितने समय में approve होता है?", a: "Documents complete होने के बाद DRCC office में 15-30 working days में approval मिलती है। हमारी team इस process को जल्दी करवाने में help करती है।" },
  { q: "क्या private college के लिए भी BSCC मिलता है?", a: "हाँ! BSCC government और private दोनों colleges के लिए available है — बशर्ते college BSCC approved list में हो। हम आपको approved colleges की list देंगे।" },
  { q: "Loan repay कब करना होता है?", a: "Graduation/Course complete होने के बाद job मिलने के 1 साल बाद से repayment शुरू होती है। अगर job नहीं मिली तो repayment extend हो सकती है।" },
  { q: "क्या OBC/General category वाले भी apply कर सकते हैं?", a: "हाँ! BSCC सभी categories के लिए open है — SC, ST, OBC, General। बस family income ₹4.5 lakh से कम होनी चाहिए।" },
  { q: "BSCC loan किस bank से मिलता है?", a: "State Bank of India (SBI) या Bihar के empaneled banks के through। DRCC approval के बाद bank directly student के account में transfer करता है।" },
];

export default function BSCCPage() {
  const [bsccBihar, setBsccBihar] = useState("");
  const [bsccIncome, setBsccIncome] = useState("");
  const [bsccAge, setBsccAge] = useState("");
  const [bsccCourse, setBsccCourse] = useState("");
  const [bsccEligible, setBsccEligible] = useState<null | boolean>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [applyForm, setApplyForm] = useState({ name: "", mobile: "", course: "" });
  const [applySubmitted, setApplySubmitted] = useState(false);

  function handleBsccCheck(e: React.FormEvent) {
    e.preventDefault();
    const eligible =
      bsccBihar === "yes" &&
      bsccAge !== "" && parseInt(bsccAge) >= 14 && parseInt(bsccAge) <= 25 &&
      bsccIncome === "below" &&
      bsccCourse !== "";
    setBsccEligible(eligible);
  }

  async function handleApplySubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await saveInquiry({ fullName: applyForm.name, mobile: applyForm.mobile, course: `BSCC - ${applyForm.course}`, message: "BSCC Application Request from /bscc page" });
    } catch (_) {}
    const msg = `BSCC Guidance Request!%0AName: ${applyForm.name}%0AMobile: ${applyForm.mobile}%0ACourse: ${applyForm.course}`;
    window.open(`https://wa.me/916203138576?text=${msg}`, "_blank");
    setApplySubmitted(true);
  }

  return (
    <PortalShell>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#001f6b] via-[#003f9f] to-[#0060c7] py-20 text-white">
        <div className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-amber-400 opacity-10 blur-3xl" />
        <div className="container-shell relative text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-sm font-bold text-amber-300">
            <CreditCard size={16} /> Bihar Government Scheme — 100% Genuine
          </div>
          <h1 className="font-headline text-4xl md:text-6xl font-extrabold leading-tight mb-5">
            Bihar Student <span className="text-amber-400">Credit Card</span>
            <br className="hidden md:block" /> (BSCC) — Complete Guide
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            ₹4 Lakh तक education loan, 4% interest, कोई guarantor नहीं। सरकार दे रही है — आपको बस apply करना है।
            <strong className="text-white"> Siksha Wallah team पूरी process में FREE guidance देती है।</strong>
          </p>
          <div className="mt-8 grid grid-cols-3 gap-6 max-w-md mx-auto border-t border-white/20 pt-8">
            {[["₹4L", "Max Loan"], ["4%", "Interest/Year"], ["40+", "Courses Covered"]].map(([n, l]) => (
              <div key={l}>
                <p className="font-headline text-3xl font-extrabold text-amber-400">{n}</p>
                <p className="text-sm text-blue-200 mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is BSCC */}
      <section className="py-20 bg-white">
        <div className="container-shell">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#003f9f] mb-2">What is BSCC?</p>
              <h2 className="font-headline text-4xl font-extrabold mb-5">
                Bihar Student Credit Card क्या है?
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Bihar Student Credit Card (BSCC) Bihar सरकार की एक flagship scheme है जो 12th pass students को उच्च शिक्षा के लिए <strong>₹4 Lakh तक का education loan</strong> 4% simple interest पर देती है।
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                इस loan से student की <strong>tuition fees, hostel fees, food charges, books, और study materials</strong> सभी cover होते हैं। Women और differently-abled students के लिए interest rate केवल <strong>1%</strong> है।
              </p>
              <p className="text-gray-600 leading-relaxed">
                सबसे बड़ी बात — <strong>कोई collateral नहीं, कोई guarantor नहीं।</strong> Government की guarantee पर bank loan देता है।
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: CreditCard, color: "bg-blue-600", label: "Loan Amount", value: "Up to ₹4 Lakh" },
                { icon: Clock, color: "bg-green-600", label: "Interest Rate", value: "4% (1% for women)" },
                { icon: Users, color: "bg-amber-500", label: "Who Can Apply", value: "Age 14-25, Bihar Resident" },
                { icon: BookOpen, color: "bg-red-500", label: "Courses Covered", value: "40+ courses available" },
              ].map(({ icon: Icon, color, label, value }) => (
                <div key={label} className="rounded-2xl border-2 border-gray-100 p-5 text-center hover:border-blue-200 hover:shadow-md transition">
                  <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${color} text-white`}>
                    <Icon size={22} />
                  </div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
                  <p className="mt-1 font-headline font-extrabold text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility + Calculator */}
      <section className="py-20 bg-gray-50">
        <div className="container-shell">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-[#003f9f] mb-2">Eligibility</p>
            <h2 className="font-headline text-4xl font-extrabold">BSCC के लिए कौन Eligible है?</h2>
          </div>

          <div className="grid gap-10 lg:grid-cols-2 items-start">
            {/* Criteria List */}
            <div className="space-y-4">
              {[
                ["Bihar Resident (Domicile)", "Bihar का permanent resident होना जरूरी है। Domicile certificate required।"],
                ["Age 14 to 25 Years", "Course admission के समय उम्र 25 साल से कम होनी चाहिए।"],
                ["12th Pass (Minimum)", "किसी recognized board से 12th pass होना जरूरी है।"],
                ["Family Income Below ₹4.5 Lakh/Year", "परिवार की annual income ₹4.5 lakh से कम होनी चाहिए।"],
                ["BSCC-Approved Course", "जिस course में admission लेना है वो BSCC approved list में होना चाहिए।"],
                ["BSCC-Approved College", "College BSCC empaneled list में होनी चाहिए। हम यह verify करते हैं।"],
              ].map(([title, desc]) => (
                <div key={title as string} className="flex gap-4 rounded-2xl bg-white border-2 border-gray-100 p-5 hover:border-green-200 transition">
                  <div className="flex-shrink-0 mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-green-500">
                    <Check size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Eligibility Calculator */}
            <div className="rounded-2xl border-2 border-[#003f9f]/20 bg-white p-7 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#003f9f] text-white">
                  <ListChecks size={20} />
                </div>
                <h3 className="font-headline text-xl font-extrabold text-gray-900">BSCC Eligibility Check करें</h3>
              </div>

              {bsccEligible === null ? (
                <form onSubmit={handleBsccCheck} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">क्या आप Bihar के निवासी हैं?</label>
                    <div className="flex gap-3">
                      {[["yes", "हाँ (Yes)"], ["no", "नहीं (No)"]].map(([val, label]) => (
                        <label key={val} className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-bold transition ${bsccBihar === val ? "border-[#003f9f] bg-blue-50 text-[#003f9f]" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                          <input type="radio" name="bihar" value={val} onChange={() => setBsccBihar(val)} className="sr-only" required /> {label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">परिवार की वार्षिक आय (Family Income)</label>
                    <select value={bsccIncome} onChange={(e) => setBsccIncome(e.target.value)} required className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-600 outline-none focus:border-[#003f9f] bg-white transition">
                      <option value="">Select Income Range</option>
                      <option value="below">₹4.5 Lakh से कम (Below)</option>
                      <option value="above">₹4.5 Lakh से अधिक (Above)</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">आपकी उम्र (Current Age)</label>
                    <input type="number" value={bsccAge} onChange={(e) => setBsccAge(e.target.value)} placeholder="e.g. 19" min={14} max={35} required className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-800 outline-none focus:border-[#003f9f] transition" />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">Desired Course</label>
                    <select value={bsccCourse} onChange={(e) => setBsccCourse(e.target.value)} required className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-600 outline-none focus:border-[#003f9f] bg-white transition">
                      <option value="">Select Course</option>
                      {eligibleCourses.map(({ name }) => <option key={name}>{name}</option>)}
                      <option value="MBBS/BDS">MBBS / BDS (BSCC limited eligibility)</option>
                    </select>
                  </div>

                  <button type="submit" className="w-full rounded-xl bg-[#003f9f] py-3.5 font-extrabold text-white hover:bg-blue-700 transition active:scale-95">
                    Check BSCC Eligibility Now →
                  </button>
                </form>
              ) : bsccEligible ? (
                <div className="text-center space-y-4 py-4">
                  <CheckCircle2 size={60} className="mx-auto text-green-500" />
                  <h4 className="font-headline text-2xl font-extrabold text-green-700">🎉 आप Eligible हैं!</h4>
                  <p className="text-gray-600 text-sm">आप Bihar Student Credit Card के लिए apply कर सकते हैं। <strong>{bsccCourse}</strong> course के लिए BSCC loan available है।</p>
                  <div className="flex flex-col gap-2">
                    <a href="https://wa.me/916203138576?text=Hi! I am eligible for BSCC. Please guide me for the application process." target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-green-500 py-3 font-bold text-white hover:bg-green-600 transition">
                      <MessageCircle size={18} /> WhatsApp करें — Process Start करें
                    </a>
                    <a href="tel:+916203138576" className="flex items-center justify-center gap-2 rounded-xl bg-[#003f9f] py-3 font-bold text-white hover:bg-blue-700 transition">
                      <Phone size={18} /> Call करें: 6203138576
                    </a>
                  </div>
                  <button onClick={() => { setBsccEligible(null); setBsccBihar(""); setBsccIncome(""); setBsccAge(""); setBsccCourse(""); }} className="text-sm text-gray-400 underline hover:text-gray-600">
                    फिर से Check करें
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-4 py-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                    <X size={30} className="text-orange-500" />
                  </div>
                  <h4 className="font-headline text-xl font-extrabold text-orange-600">अभी Eligible नहीं</h4>
                  <p className="text-gray-600 text-sm">BSCC के लिए Bihar domicile, age ≤ 25, और income ≤ ₹4.5L जरूरी है। लेकिन हम आपके लिए अन्य education loan options खोज सकते हैं।</p>
                  <a href="tel:+916203138576" className="flex items-center justify-center gap-2 rounded-xl bg-[#003f9f] py-3 font-bold text-white hover:bg-blue-700 transition">
                    <Phone size={18} /> Call for Other Options
                  </a>
                  <button onClick={() => { setBsccEligible(null); setBsccBihar(""); setBsccIncome(""); setBsccAge(""); setBsccCourse(""); }} className="text-sm text-gray-400 underline hover:text-gray-600">
                    फिर से Check करें
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Step by Step Process */}
      <section className="py-20 bg-gradient-to-br from-[#001f6b] to-[#003f9f] text-white">
        <div className="container-shell">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-amber-400 mb-2">Application Process</p>
            <h2 className="font-headline text-4xl font-extrabold">BSCC Apply करने के Steps</h2>
            <p className="mt-3 text-blue-100 max-w-xl mx-auto">
              Siksha Wallah team Step 1 से Step 3 तक आपके साथ रहती है — पूरी तरह FREE।
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            {[
              {
                num: "01", icon: FileCheck2, color: "text-blue-300",
                title: "Document Verification",
                location: "Siksha Wallah Office, College Chowk, Forbesganj",
                points: [
                  "Original documents लेकर office आएं",
                  "हमारी team सभी documents verify करेगी",
                  "Missing documents की list बनाएंगे",
                  "Complete file prepare करेंगे",
                ],
              },
              {
                num: "02", icon: GraduationCap, color: "text-green-300",
                title: "College Selection & Bonafide",
                location: "Selected BSCC-Approved College",
                points: [
                  "BSCC approved college select करें",
                  "Admission form भरें और fee जमा करें",
                  "College से Bonafide Certificate लें",
                  "Fee receipt और enrollment letter लें",
                ],
              },
              {
                num: "03", icon: BadgeCheck, color: "text-amber-300",
                title: "DRCC Registration & Approval",
                location: "District Registration & Counselling Centre",
                points: [
                  "DRCC portal पर online registration",
                  "Complete file जमा करें DRCC office में",
                  "Bank account में loan transfer होगा",
                  "Siksha Wallah team साथ जाएगी",
                ],
              },
            ].map(({ num, icon: Icon, color, title, location, points }) => (
              <div key={num} className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-headline text-5xl font-extrabold text-white/10">{num}</span>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 ${color}`}>
                    <Icon size={20} />
                  </div>
                </div>
                <h3 className="font-headline font-extrabold text-white text-lg mb-1">{title}</h3>
                <p className={`text-xs font-semibold mb-4 ${color}`}>📍 {location}</p>
                <ul className="space-y-2">
                  {points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-blue-100">
                      <Check size={14} className="mt-0.5 flex-shrink-0 text-green-400" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-5 flex items-start gap-3">
            <CheckCircle2 size={22} className="flex-shrink-0 text-green-400 mt-0.5" />
            <p className="text-green-200 text-sm font-semibold">
              <strong className="text-green-300">Siksha Wallah Promise:</strong> हमारी team पूरे BSCC application process में आपको 100% FREE guidance देती है। Document preparation से लेकर DRCC approval तक — कोई extra charge नहीं।
            </p>
          </div>
        </div>
      </section>

      {/* Documents Required */}
      <section className="py-20 bg-white">
        <div className="container-shell">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-[#003f9f] mb-2">Documents Checklist</p>
            <h2 className="font-headline text-4xl font-extrabold">BSCC के लिए Required Documents</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
            {[
              ["Aadhaar Card", "Mobile linked होना चाहिए"],
              ["10th Marksheet", "Original + Photocopy"],
              ["12th Marksheet + Certificate", "Passing certificate जरूरी"],
              ["Domicile Certificate", "Bihar Domicile, SDO issued"],
              ["Income Certificate", "Annual income ≤ ₹4.5L, CO/SDO"],
              ["Bank Account Passbook", "SBI/BOI preferred, student's own"],
              ["College Bonafide Certificate", "Admission के बाद college से"],
              ["Passport Size Photos", "6 recent color photos, white bg"],
            ].map(([title, note]) => (
              <div key={title as string} className="flex gap-3 rounded-xl border-2 border-gray-100 p-4 hover:border-green-200 hover:bg-green-50 transition">
                <div className="flex-shrink-0 mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                  <Check size={13} className="text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm mb-4">Documents collect करने में help चाहिए?</p>
            <a href="tel:+916203138576" className="inline-flex items-center gap-2 rounded-xl bg-[#003f9f] px-6 py-3 font-bold text-white hover:bg-blue-700 transition">
              <Phone size={16} /> Call: 6203138576 — Free Guidance
            </a>
          </div>
        </div>
      </section>

      {/* Eligible Courses */}
      <section className="py-20 bg-gray-50">
        <div className="container-shell">
          <div className="text-center mb-10">
            <p className="text-sm font-bold uppercase tracking-widest text-[#003f9f] mb-2">Courses List</p>
            <h2 className="font-headline text-4xl font-extrabold">BSCC से कौन से Courses होते हैं?</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {eligibleCourses.map(({ name, stream }) => (
              <span key={name} className="inline-flex items-center gap-1.5 rounded-full border-2 border-green-200 bg-green-50 px-4 py-2 text-sm font-bold text-green-800">
                <Check size={13} /> {name}
                <span className="text-xs text-green-500 font-normal">({stream})</span>
              </span>
            ))}
          </div>
          <p className="text-center text-sm text-gray-400 mt-6">+ और भी 30 courses available हैं। Call करके confirm करें।</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="container-shell max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm font-bold uppercase tracking-widest text-[#003f9f] mb-2">FAQ</p>
            <h2 className="font-headline text-3xl font-extrabold">BSCC के बारे में सवाल</h2>
          </div>
          <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 overflow-hidden">
            {bsccFaqs.map(({ q, a }, i) => (
              <div key={q}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-headline font-bold text-lg text-gray-900 hover:bg-gray-50 transition">
                  <span>{q}</span>
                  <ChevronDown size={22} className={`flex-shrink-0 text-[#003f9f] transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apply Now Form */}
      <section className="py-20 bg-amber-400">
        <div className="container-shell">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <h2 className="font-headline text-4xl font-extrabold text-gray-900 mb-4">
                BSCC Apply करने के लिए<br />हमसे Contact करें
              </h2>
              <p className="text-gray-800 mb-6 leading-relaxed">
                Form fill करें — हमारा BSCC specialist 30 minutes में call करेगा और पूरी process explain करेगा।
                <strong> Completely FREE guidance।</strong>
              </p>
              <div className="flex flex-col gap-3">
                <a href="tel:+916203138576" className="flex items-center gap-3 rounded-xl bg-[#003f9f] px-5 py-3.5 font-bold text-white hover:bg-blue-700 transition">
                  <Phone size={18} /> Call: 6203138576 (Primary)
                </a>
                <a href="tel:+917858062498" className="flex items-center gap-3 rounded-xl bg-[#003f9f] px-5 py-3.5 font-bold text-white hover:bg-blue-700 transition">
                  <Phone size={18} /> Call: 7858062498 (BSCC Helpline)
                </a>
                <a href="https://wa.me/916203138576" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl bg-green-600 px-5 py-3.5 font-bold text-white hover:bg-green-700 transition">
                  <MessageCircle size={18} /> WhatsApp: 6203138576
                </a>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-7 shadow-xl">
              {applySubmitted ? (
                <div className="text-center py-8 space-y-3">
                  <CheckCircle2 size={52} className="mx-auto text-green-500" />
                  <h3 className="font-headline text-xl font-extrabold text-gray-900">Request Received! 🎉</h3>
                  <p className="text-gray-500 text-sm">हमारा BSCC specialist जल्द call करेगा।</p>
                </div>
              ) : (
                <>
                  <h3 className="font-headline text-xl font-extrabold text-gray-900 mb-5">BSCC Guidance Request</h3>
                  <form onSubmit={handleApplySubmit} className="space-y-4">
                    <input required value={applyForm.name} onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })} placeholder="पूरा नाम (Full Name) *" className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-sm outline-none focus:border-[#003f9f] transition" />
                    <input required type="tel" value={applyForm.mobile} onChange={(e) => setApplyForm({ ...applyForm, mobile: e.target.value })} placeholder="Mobile Number *" className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-sm outline-none focus:border-[#003f9f] transition" />
                    <select value={applyForm.course} onChange={(e) => setApplyForm({ ...applyForm, course: e.target.value })} className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-sm text-gray-600 outline-none focus:border-[#003f9f] bg-white transition">
                      <option value="">-- Course Select करें --</option>
                      {eligibleCourses.map(({ name }) => <option key={name}>{name}</option>)}
                    </select>
                    <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#003f9f] py-4 font-extrabold text-white hover:bg-blue-700 transition active:scale-95">
                      <ArrowRight size={18} /> Submit BSCC Request
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </PortalShell>
  );
}
