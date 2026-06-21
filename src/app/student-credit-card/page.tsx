"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight, BadgeCheck, Check, CheckCircle2, CreditCard, FileCheck2,
  FileText, GraduationCap, ListChecks, MessageCircle, Phone, X, BookOpen,
} from "lucide-react";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";

export default function StudentCreditCardPage() {
  const [bsccEligible, setBsccEligible] = useState<null | boolean>(null);
  const [bsccBihar, setBsccBihar] = useState("");
  const [bsccIncome, setBsccIncome] = useState("");
  const [bsccAge, setBsccAge] = useState("");
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  function handleBsccCheck(e: React.FormEvent) {
    e.preventDefault();
    const eligible =
      bsccBihar === "yes" &&
      bsccAge !== "" &&
      parseInt(bsccAge) <= 25 &&
      bsccIncome === "below";
    setBsccEligible(eligible);
  }

  const totalDocs = 10;
  const checkedCount = Object.values(checkedDocs).filter(Boolean).length;

  return (
    <main className="overflow-hidden bg-white text-gray-900">
      <SiteNavbar />

      {/* ── PAGE HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#134e4a] via-[#0f766e] to-[#0d9488] text-white py-20 md:py-28">
        {/* Diagonal stripe pattern */}
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)" }} />
        <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-teal-300 opacity-10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -left-24 h-64 w-64 rounded-full bg-cyan-300 opacity-15 blur-3xl" />
        <div className="container-shell relative text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-sm font-bold text-amber-300">
            <CreditCard size={16} /> Bihar Government Scheme
          </div>
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold mt-4 leading-tight bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
            Bihar Student Credit Card (BSCC)
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-blue-100 text-lg leading-relaxed">
            सरकारी योजना के तहत <strong className="text-white">Free Education, Fooding, और Lodging</strong> पाएं।
            BSCC से ₹4 Lakh तक का education loan — <strong className="text-amber-400">4% सालाना ब्याज</strong> पर।
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#eligibility-checker"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-7 py-4 font-extrabold text-gray-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-300"
            >
              Eligibility Check करें <ArrowRight size={18} />
            </a>
            <a
              href="https://wa.me/916203138576?text=नमस्ते!%20मुझे%20Bihar%20Student%20Credit%20Card%20(BSCC)%20के%20लिए%20guidance%20चाहिए।%20Kripya%20help%20karein।"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/40 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              <MessageCircle size={18} /> WhatsApp करें
            </a>
          </div>
        </div>
      </section>

      {/* ── BSCC BENEFITS ── */}
      <section className="py-16 bg-gradient-to-br from-[#134e4a] to-[#0f766e] text-white">
        <div className="container-shell">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
        </div>
      </section>

      {/* ── STEP-BY-STEP PROCESS ── */}
      <section className="py-20 bg-gradient-to-br from-[#134e4a] to-[#0f766e] text-white">
        <div className="container-shell">
          <div className="mb-10 rounded-2xl border border-white/15 bg-white/5 p-7 backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400">
                <ListChecks size={18} className="text-gray-900" />
              </div>
              <h2 className="font-headline text-2xl font-extrabold text-amber-400">BSCC Application Process — Step by Step</h2>
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
                <div key={num} className="rounded-2xl border border-white/10 bg-white/5 p-5 h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-headline text-5xl font-extrabold text-white/10 leading-none">{num}</span>
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/10 ${color}`}>
                      <StepIcon size={18} />
                    </div>
                  </div>
                  <h3 className="font-headline font-extrabold text-white text-base mb-1">{title}</h3>
                  <p className={`text-xs font-semibold mb-3 ${color}`}>📍 {location}</p>
                  <p className="text-sm text-blue-100 leading-relaxed">{desc}</p>
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

          {/* Documents + Eligibility Checker */}
          <div className="grid gap-10 lg:grid-cols-2 items-start">
            {/* Required Documents */}
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
            <div id="eligibility-checker" className="rounded-2xl border border-teal-200 bg-teal-50/10 p-7 backdrop-blur-xl">
              <h3 className="font-headline text-xl font-extrabold mb-5">BSCC पात्रता जाँचें</h3>

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
                      className="w-full rounded-xl border border-white/30 bg-teal-900 px-4 py-3 text-white outline-none"
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
                    href="https://wa.me/916203138576?text=नमस्ते!%20मैंने%20BSCC%20eligibility%20check%20की%20और%20मैं%20eligible%20हूँ।%20कृपया%20application%20process%20guide%20करें।"
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

      {/* ── DOCUMENTS CHECKLIST ── */}
      <section className="py-20 bg-white">
        <div className="container-shell">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-primary-blue mb-2">Admission Preparation</p>
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">Required Documents Checklist</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              Tick off each document as you gather it. Bring all originals + 2 photocopies to the Siksha Wallah office.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] items-start">
            {/* Interactive Checklist */}
            <div className="rounded-2xl border-2 border-gray-100 bg-gray-50 overflow-hidden">
              <div className="flex items-center justify-between bg-teal-700 px-6 py-4">
                <div className="flex items-center gap-2 text-white">
                  <ListChecks size={20} />
                  <span className="font-headline font-extrabold text-lg">Document Checklist</span>
                </div>
                <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-bold text-white">
                  {checkedCount} / {totalDocs} Done
                </span>
              </div>

              <div className="h-2 w-full bg-gray-200">
                <div
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${(checkedCount / totalDocs) * 100}%` }}
                />
              </div>

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
                            checkedDocs[id] ? "border-green-300 bg-green-50" : "border-gray-200 bg-white hover:border-gray-300"
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

                <div className="rounded-xl bg-teal-700 p-4 text-white flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-bold text-sm">Documents ready? Visit us or call!</p>
                    <p className="text-xs text-blue-200">We verify all documents for FREE at our Forbesganj office.</p>
                  </div>
                  <a
                    href="https://wa.me/916203138576?text=नमस्ते!%20मैंने%20सभी%20admission%20documents%20collect%20कर%20लिए%20हैं।%20आगे%20का%20process%20बताएं।"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-teal-700 hover:bg-teal-50 transition"
                  >
                    <MessageCircle size={15} /> WhatsApp Now
                  </a>
                </div>
              </div>
            </div>

            {/* Course-Specific Docs */}
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
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA → CONTACT ── */}
      <section className="py-20 bg-gradient-to-r from-teal-700 to-cyan-700 text-white">
        <div className="container-shell text-center">
          <CheckCircle2 size={52} className="mx-auto mb-5 text-green-400" />
          <h2 className="font-headline text-3xl md:text-4xl font-extrabold mb-3 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
            कागजात तैयार हैं? हमसे संपर्क करें
          </h2>
          <p className="text-teal-100 max-w-xl mx-auto mb-8 text-lg">
            अब अगला कदम उठाएं। हमारे office में visit करें या call करें — हमारी team तुरंत आपकी मदद करेगी।
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-8 py-4 font-extrabold text-gray-900 shadow-lg shadow-amber-500/30 transition hover:-translate-y-0.5 hover:bg-amber-300"
            >
              हमसे संपर्क करें <ArrowRight size={18} />
            </Link>
            <a
              href="https://wa.me/916203138576?text=नमस्ते!%20मैंने%20BSCC%20के%20लिए%20सभी%20documents%20तैयार%20कर%20लिए%20हैं।%20अब%20आगे%20क्या%20करूँ?%20Please%20guide%20karein।"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/40 bg-white/10 px-8 py-4 font-bold text-white transition hover:bg-white/20"
            >
              <MessageCircle size={18} /> WhatsApp करें
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/916203138576?text=नमस्ते!%20मुझे%20BSCC%20(Bihar%20Student%20Credit%20Card)%20के%20बारे%20में%20जानकारी%20चाहिए।%20Please%20help%20karein।"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/40 transition hover:bg-green-600 hover:scale-110"
        aria-label="WhatsApp"
      >
        <MessageCircle size={26} />
      </a>
    </main>
  );
}
