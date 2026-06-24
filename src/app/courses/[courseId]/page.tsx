'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PortalShell } from '@/components/portal-shell';
import { COURSE_ID_MAP, colorMap, streamTabs } from '@/lib/courses-data';
import { saveActivity } from '@/services/activity-service';
import { useEffect } from 'react';
import {
  ArrowLeft, Clock, CreditCard, CheckCircle2, Star, Sparkles,
  Award, Building2, Briefcase, BookMarked, ShieldCheck, FileText,
  MessageCircle, AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// ── Course-specific required documents ───────────────────────────────────────
const COURSE_DOCS: Record<string, string[]> = {
  // Teaching
  bed:          ['Aadhaar Card', '10th Marksheet', '12th Marksheet', 'Graduation Marksheet', 'Passport Photo', 'Transfer Certificate (TC)', 'Caste Certificate (if applicable)'],
  deled:        ['Aadhaar Card', '10th Marksheet', '12th Marksheet', 'Passport Photo', 'Transfer Certificate (TC)', 'Caste Certificate (if applicable)'],
  bped:         ['Aadhaar Card', '10th Marksheet', '12th Marksheet', 'Graduation Marksheet', 'Passport Photo', 'Physical Fitness Certificate', 'Caste Certificate (if applicable)'],
  med:          ['Aadhaar Card', '10th Marksheet', '12th Marksheet', 'Graduation Marksheet', 'B.Ed / M.A. Marksheet', 'Passport Photo', 'Caste Certificate (if applicable)'],
  // Medical
  mbbs:         ['Aadhaar Card', '10th Marksheet', '12th Marksheet (PCB)', 'NEET Score Card', 'Passport Photo', 'Caste Certificate (if applicable)', 'Domicile Certificate'],
  bams:         ['Aadhaar Card', '10th Marksheet', '12th Marksheet (PCB)', 'NEET Score Card', 'Passport Photo', 'Caste Certificate (if applicable)'],
  bds:          ['Aadhaar Card', '10th Marksheet', '12th Marksheet (PCB)', 'NEET Score Card', 'Passport Photo', 'Caste Certificate (if applicable)'],
  'bsc-nursing':['Aadhaar Card', '10th Marksheet', '12th Marksheet (Biology)', 'Passport Photo', 'Medical Fitness Certificate', 'Caste Certificate (if applicable)'],
  gnm:          ['Aadhaar Card', '10th Marksheet', '12th Marksheet', 'Passport Photo', 'Medical Fitness Certificate', 'Caste Certificate (if applicable)'],
  anm:          ['Aadhaar Card', '10th Marksheet', '12th Marksheet', 'Passport Photo', 'Caste Certificate (if applicable)'],
  dpharma:      ['Aadhaar Card', '10th Marksheet', '12th Marksheet (PCB/PCM)', 'Passport Photo', 'Caste Certificate (if applicable)'],
  bmlt:         ['Aadhaar Card', '10th Marksheet', '12th Marksheet (PCB)', 'Passport Photo', 'Caste Certificate (if applicable)'],
  bpharma:      ['Aadhaar Card', '10th Marksheet', '12th Marksheet (PCB/PCM)', 'Passport Photo', 'Caste Certificate (if applicable)'],
  // Technical
  btech:        ['Aadhaar Card', '10th Marksheet', '12th Marksheet (PCM)', 'JEE / DCECE Score Card (if applicable)', 'Passport Photo', 'Caste Certificate (if applicable)'],
  polytechnic:  ['Aadhaar Card', '10th Marksheet', 'Passport Photo', 'Caste Certificate (if applicable)'],
  iti:          ['Aadhaar Card', '8th / 10th Marksheet', 'Passport Photo', 'Caste Certificate (if applicable)'],
  bca:          ['Aadhaar Card', '10th Marksheet', '12th Marksheet', 'Passport Photo', 'Caste Certificate (if applicable)'],
  mca:          ['Aadhaar Card', '10th Marksheet', '12th Marksheet', 'Graduation Marksheet (BCA/B.Sc)', 'Passport Photo', 'Caste Certificate (if applicable)'],
  bba:          ['Aadhaar Card', '10th Marksheet', '12th Marksheet', 'Passport Photo', 'Caste Certificate (if applicable)'],
  mba:          ['Aadhaar Card', '10th Marksheet', '12th Marksheet', 'Graduation Marksheet', 'CAT/MAT Score Card (if applicable)', 'Passport Photo', 'Caste Certificate (if applicable)'],
  // Paramedical
  bpt:          ['Aadhaar Card', '10th Marksheet', '12th Marksheet (PCB)', 'Passport Photo', 'Medical Fitness Certificate', 'Caste Certificate (if applicable)'],
  bott:         ['Aadhaar Card', '10th Marksheet', '12th Marksheet (PCB)', 'Passport Photo', 'Caste Certificate (if applicable)'],
  brit:         ['Aadhaar Card', '10th Marksheet', '12th Marksheet (PCB)', 'Passport Photo', 'Caste Certificate (if applicable)'],
  'bmlt-para':  ['Aadhaar Card', '10th Marksheet', '12th Marksheet (PCB)', 'Passport Photo', 'Caste Certificate (if applicable)'],
  bot:          ['Aadhaar Card', '10th Marksheet', '12th Marksheet (PCB)', 'Passport Photo', 'Caste Certificate (if applicable)'],
  'bsc-biotech':['Aadhaar Card', '10th Marksheet', '12th Marksheet (PCB)', 'Passport Photo', 'Caste Certificate (if applicable)'],
  'hospital-mgmt':['Aadhaar Card', '10th Marksheet', '12th Marksheet (any stream)', 'Passport Photo', 'Caste Certificate (if applicable)'],
  dmlt:         ['Aadhaar Card', '10th Marksheet', '12th Marksheet (Biology)', 'Passport Photo', 'Caste Certificate (if applicable)'],
  dota:         ['Aadhaar Card', '10th Marksheet', '12th Marksheet (Biology)', 'Passport Photo', 'Caste Certificate (if applicable)'],
  dmr:          ['Aadhaar Card', '10th Marksheet', '12th Marksheet (Biology)', 'Passport Photo', 'Caste Certificate (if applicable)'],
  opt:          ['Aadhaar Card', '10th Marksheet', '12th Marksheet (Biology)', 'Passport Photo', 'Caste Certificate (if applicable)'],
  ofcg:         ['Aadhaar Card', '10th Marksheet', '12th Marksheet (Biology)', 'Passport Photo', 'Caste Certificate (if applicable)'],
  dresser:      ['Aadhaar Card', '10th Marksheet / Certificate', 'Passport Photo'],
  // Law
  llb:          ['Aadhaar Card', '10th Marksheet', '12th Marksheet', 'Graduation Marksheet', 'Passport Photo', 'Caste Certificate (if applicable)'],
  'ba-llb':     ['Aadhaar Card', '10th Marksheet', '12th Marksheet', 'Passport Photo', 'CLAT Score Card (if applicable)', 'Caste Certificate (if applicable)'],
  'bba-llb':    ['Aadhaar Card', '10th Marksheet', '12th Marksheet', 'Passport Photo', 'CLAT Score Card (if applicable)', 'Caste Certificate (if applicable)'],
  llm:          ['Aadhaar Card', '10th Marksheet', '12th Marksheet', 'Graduation Marksheet', 'LLB Marksheet', 'Passport Photo', 'Caste Certificate (if applicable)'],
};

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const entry = COURSE_ID_MAP[courseId];

  useEffect(() => {
    if (entry) {
      saveActivity({
        type: 'course_view',
        title: `Course Detail: ${entry.course.name}`,
        description: `${entry.course.full} detail page viewed`,
        course: entry.course.name,
        page: `/courses/${courseId}`,
      });
    }
  }, [courseId, entry]);

  if (!entry) {
    return (
      <PortalShell>
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
            <h1 className="text-xl font-bold text-slate-800">Course not found</h1>
            <p className="mt-2 text-slate-500">This course page doesn&apos;t exist or has been moved.</p>
            <Link href="/courses">
              <Button className="mt-6">Explore All Courses</Button>
            </Link>
          </div>
        </div>
      </PortalShell>
    );
  }

  const { course, stream } = entry;
  const tab = streamTabs.find(s => s.key === stream)!;
  const colors = colorMap[tab.color];
  const requiredDocs = COURSE_DOCS[courseId] ?? ['Aadhaar Card', '10th Marksheet', '12th Marksheet', 'Passport Photo'];
  const waMsg = `नमस्ते! मुझे ${course.name} (${course.full}) के बारे में जानकारी चाहिए। Fees aur admission process batayein।`;

  return (
    <PortalShell>
      {/* Hero banner */}
      <div className={`bg-gradient-to-r ${colors.gradient} py-10 text-white`}>
        <div className="container-shell">
          <Link href="/courses" className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-semibold mb-6">
            <ArrowLeft size={15} /> All Courses
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider">
              {tab.label}
            </span>
            {course.bscc && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-400/30 border border-green-300/40 px-3 py-1 text-xs font-bold text-green-100">
                <CreditCard size={11} /> BSCC Loan Available
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">{course.name}</h1>
          <p className="mt-1 text-lg text-white/80">{course.full}</p>

          <div className="mt-5 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-2">
              <Clock size={14} /> <span className="font-semibold">{course.duration}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-2">
              <CreditCard size={14} /> <span className="font-semibold">{course.fee}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-shell py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* ── Main content ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Hindi description */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700">
                <Sparkles size={13} /> हिंदी में जानें
              </div>
              <p className="text-sm leading-relaxed text-amber-900">{course.hindiDesc}</p>
            </div>

            {/* Eligibility */}
            <div className="rounded-2xl border bg-white p-5">
              <h2 className="mb-3 font-extrabold text-slate-900">Eligibility / पात्रता</h2>
              <p className="text-sm text-slate-700 leading-relaxed">{course.eligibility}</p>
            </div>

            {/* Key Highlights */}
            <div className={`rounded-2xl border p-5 ${colors.sectionBg}`}>
              <div className={`mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${colors.pointText}`}>
                <Star size={13} /> Key Highlights
              </div>
              <ul className="space-y-2">
                {course.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-800">
                    <CheckCircle2 size={15} className={`mt-0.5 flex-shrink-0 ${colors.checkColor}`} /> {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Career Scope */}
            <div className="rounded-2xl border bg-white p-5">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Briefcase size={13} /> Career Scope
              </div>
              <p className="text-sm leading-relaxed text-slate-700">{course.careerScope}</p>
            </div>

            {/* Salary */}
            <div className="rounded-2xl border bg-green-50 border-green-200 p-5">
              <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-green-700">
                <Award size={13} /> Expected Salary
              </div>
              <p className="text-base font-extrabold text-green-700">{course.salary}</p>
            </div>

            {/* Entrance Exam */}
            <div className="rounded-2xl border bg-white p-5">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <FileText size={13} /> Entrance Exam / प्रवेश परीक्षा
              </div>
              <p className="text-sm leading-relaxed text-slate-700">{course.entranceExam}</p>
            </div>

            {/* Govt Jobs */}
            <div className="rounded-2xl border bg-white p-5">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <ShieldCheck size={13} /> Government Job Opportunities
              </div>
              <p className="text-sm leading-relaxed text-slate-700">{course.govtJobs}</p>
            </div>

            {/* Study Mode */}
            <div className="rounded-2xl border bg-white p-5">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <BookMarked size={13} /> Study Mode / अध्ययन का तरीका
              </div>
              <p className="text-sm leading-relaxed text-slate-700">{course.mode}</p>
            </div>

            {/* Top Colleges */}
            <div className="rounded-2xl border bg-white p-5">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Building2 size={13} /> Top Colleges
              </div>
              <div className="flex flex-wrap gap-2">
                {course.topColleges.map((c, i) => (
                  <span key={i} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">{c}</span>
                ))}
              </div>
            </div>

            {/* Required Documents */}
            <div className="rounded-2xl border-2 border-blue-100 bg-blue-50 p-5">
              <h2 className="mb-4 font-extrabold text-slate-900">
                📄 Documents Required for {course.name}
              </h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {requiredDocs.map((doc, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-800">
                    <CheckCircle2 size={15} className="flex-shrink-0 text-blue-500" /> {doc}
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard/documents"
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#003f9f] px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
              >
                Upload Documents in My Portal →
              </Link>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4">
            {/* Apply CTA */}
            <div className="sticky top-6 rounded-2xl border-2 border-blue-100 bg-white p-6 shadow-lg">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Indicative Fee</p>
              <p className="text-3xl font-extrabold text-slate-900">{course.fee}</p>
              <p className="mt-1 text-xs text-slate-500">Per year. Final fee depends on the college chosen — our counsellor will guide you.</p>

              <div className="mt-5 space-y-3">
                <Link
                  href={`/apply?course=${encodeURIComponent(course.name)}`}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-extrabold text-white transition ${colors.btn}`}
                >
                  Apply for {course.name} →
                </Link>
                <a
                  href={`https://wa.me/916203138576?text=${encodeURIComponent(waMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => saveActivity({ type: 'whatsapp', title: `WhatsApp — ${course.name}`, description: `Enquiry from course detail page`, page: `/courses/${courseId}` })}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-green-500 py-3 text-sm font-bold text-green-700 transition hover:bg-green-500 hover:text-white"
                >
                  <MessageCircle size={15} /> WhatsApp Enquiry
                </a>
                {course.bscc && (
                  <Link
                    href="/contact"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-200 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                  >
                    <CreditCard size={13} /> Ask About BSCC Loan
                  </Link>
                )}
              </div>

              <p className="mt-4 text-center text-xs text-slate-400">
                Our counsellor will reach out within 30 minutes to guide you through the next steps.
              </p>
            </div>

            {/* Quick info box */}
            <div className="rounded-2xl border bg-slate-50 p-4 text-sm space-y-3">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Duration</p>
                <p className="font-bold text-slate-800">{course.duration}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Entrance Exam</p>
                <p className="font-semibold text-slate-700 text-xs leading-relaxed">{course.entranceExam.split('.')[0]}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Eligibility</p>
                <p className="font-semibold text-slate-700 text-xs leading-relaxed">{course.eligibility}</p>
              </div>
              {course.bscc && (
                <div className="rounded-xl bg-green-50 border border-green-200 p-3 flex items-start gap-2">
                  <CreditCard size={14} className="mt-0.5 flex-shrink-0 text-green-600" />
                  <p className="text-xs text-green-700 font-semibold">BSCC Loan up to ₹4 Lakh at 4% interest available for this course.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
