'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { getApplicationsByUser, type CourseApplication } from '@/services/application-service';
import { PortalShell } from '@/components/portal-shell';
import {
  ArrowLeft, Loader, AlertCircle, ClipboardList, MapPin, Clock,
  Phone, MessageCircle, FileCheck2, Building2, Info,
} from 'lucide-react';

// ── Course → required document checklist ─────────────────────────────────────
interface CourseDocInfo {
  label: string;
  type: string;
  note?: string;
}
interface CourseRequirement { docs: CourseDocInfo[] }

const COURSE_REQUIREMENTS: Array<{ keywords: string[]; req: CourseRequirement }> = [
  // ── Teaching ──────────────────────────────────────────────────────────────
  {
    keywords: ['b.ed', 'bed', 'b ed', 'bachelor of education'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet' },
      { type: 'marksheet', label: 'Graduation Marksheet' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Transfer Certificate (TC)' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable (SC/ST/OBC)' },
    ]},
  },
  {
    keywords: ['d.el.ed', 'deled', 'diploma in elementary education', 'd el ed', 'd.el.ed'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Transfer Certificate (TC)' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['b.p.ed', 'bped', 'b.ped', 'bachelor of physical education'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet' },
      { type: 'marksheet', label: 'Graduation Marksheet' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Physical Fitness Certificate' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['m.ed', 'master of education'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet' },
      { type: 'marksheet', label: 'Graduation Marksheet' },
      { type: 'marksheet', label: 'B.Ed / M.A. Marksheet' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  // ── Medical ───────────────────────────────────────────────────────────────
  {
    keywords: ['mbbs', 'bachelor of medicine'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (PCB)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'NEET Score Card' },
      { type: 'other',     label: 'Domicile Certificate' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['bams', 'ayurvedic', 'bachelor of ayurvedic'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (PCB)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'NEET Score Card' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['bds', 'bachelor of dental', 'dental surgery'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (PCB)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'NEET Score Card' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['b.sc nursing', 'bsc nursing', 'bsc. nursing', 'bachelor of science in nursing'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (Biology)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Medical Fitness Certificate' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['gnm', 'general nursing & midwifery', 'general nursing'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Medical Fitness Certificate' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['anm', 'auxiliary nursing'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['d.pharma', 'dpharma', 'diploma in pharmacy'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (PCB/PCM)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['b.pharma', 'bpharma', 'bachelor of pharmacy'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (PCB/PCM)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['bmlt', 'b.mlt', 'bachelor of medical lab', 'b.m.l.t'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (PCB)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  // ── Technical ─────────────────────────────────────────────────────────────
  {
    keywords: ['b.tech', 'btech', 'bachelor of technology'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (PCM)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'JEE / DCECE Score Card', note: 'If applicable' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['polytechnic', 'diploma in engineering', 'diploma engineering'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['iti', 'industrial training'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '8th / 10th Marksheet' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['bca', 'bachelor of computer application'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['mca', 'master of computer application'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet' },
      { type: 'marksheet', label: 'Graduation Marksheet (BCA/B.Sc)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['bba', 'bachelor of business administration'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['mba', 'master of business administration'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet' },
      { type: 'marksheet', label: 'Graduation Marksheet' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'CAT/MAT Score Card', note: 'If applicable' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  // ── Paramedical ───────────────────────────────────────────────────────────
  {
    keywords: ['b.p.t', 'bpt', 'bachelor of physiotherapy', 'physiotherapy'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (PCB)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Medical Fitness Certificate' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['b.o.t.t', 'bott', 'operation theatre technology'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (PCB)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['b.r.i.t', 'brit', 'radio imaging technology', 'radiology'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (PCB)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['b.o.t', 'bot', 'occupational therapy'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (PCB)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['b.sc. biotech', 'bsc biotech', 'biotechnology'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (PCB)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['hospital mgmt', 'hospital management', 'b.sc. in hospital'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (any stream)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['d.m.l.t', 'dmlt', 'diploma in medical lab'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (Biology)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['d.o.t.a', 'dota', 'operation theatre assistant'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (Biology)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['d.m.r', 'dmr', 'diploma in medical radiology', 'x-ray'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (Biology)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['o.p.t', 'opt', 'ophthalmic', 'eye care'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (Biology)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['o.f.c.g', 'ofcg', 'orthotics', 'footwear correction'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (Biology)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['dresser', 'wound dressing'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet / Certificate' },
      { type: 'photo',     label: 'Passport-Size Photo' },
    ]},
  },
  // ── Law ───────────────────────────────────────────────────────────────────
  {
    keywords: ['llb', 'bachelor of laws', 'law degree'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet' },
      { type: 'marksheet', label: 'Graduation Marksheet' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['ba.llb', 'ba llb', 'bachelor of arts & laws'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'CLAT Score Card', note: 'If applicable' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['bba.llb', 'bba llb', 'bachelor of business administration & laws'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'CLAT Score Card', note: 'If applicable' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['llm', 'master of laws'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet' },
      { type: 'marksheet', label: 'Graduation Marksheet' },
      { type: 'marksheet', label: 'LLB Marksheet' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
];

function getCourseRequirements(courseName: string): CourseRequirement | null {
  const lower = courseName.toLowerCase();
  for (const entry of COURSE_REQUIREMENTS) {
    if (entry.keywords.some(k => lower.includes(k))) {
      return entry.req;
    }
  }
  return null;
}

// Common documents every student should carry, regardless of course
const COMMON_DOCS = [
  'Aadhaar Card (आधार कार्ड)',
  '10th Marksheet (दसवीं अंकपत्र)',
  '12th Marksheet (बारहवीं अंकपत्र)',
  'Graduation Marksheet (यदि लागू हो)',
  'Passport-Size Photos (4–6 copies)',
  'Caste / Income / Residence Certificate (यदि लागू हो)',
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function DocumentsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [applications, setApplications] = useState<CourseApplication[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (!user) return;

    getApplicationsByUser(user.uid)
      .then(apps => setApplications(apps))
      .catch(err => setError(err.message))
      .finally(() => setPageLoading(false));
  }, [authLoading, isAuthenticated, user, router]);

  // Build a per-course required-document checklist for every applied course
  const courseChecklists = applications
    .map(app => ({ courseName: app.course, req: getCourseRequirements(app.course) }))
    .filter(c => c.req !== null) as { courseName: string; req: CourseRequirement }[];

  // Deduplicate by course name
  const seen = new Set<string>();
  const uniqueChecklists = courseChecklists.filter(c => {
    if (seen.has(c.courseName)) return false;
    seen.add(c.courseName);
    return true;
  });

  if (authLoading || pageLoading) {
    return (
      <PortalShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader className="animate-spin text-blue-600" size={40} />
        </div>
      </PortalShell>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <PortalShell>
      <div className="container-shell max-w-3xl py-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-blue-600 hover:underline text-sm font-semibold">
          <ArrowLeft size={16} /> Back to My Dashboard
        </Link>

        <div className="mt-6">
          <h1 className="text-2xl font-extrabold text-slate-900">Required Documents</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Admission के लिए कौन-कौन से documents चाहिए — पूरी list नीचे दी गई है।
          </p>
        </div>

        {error && (
          <div className="mt-4 flex gap-3 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* ── IMPORTANT: Bring originals to office ── */}
        <div className="mt-6 rounded-2xl border-2 border-amber-400 bg-amber-50 p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-amber-100">
              <Building2 size={22} className="text-amber-700" />
            </span>
            <div>
              <p className="font-extrabold text-amber-900 text-base mb-1">
                Documents Office में लेकर आएं
              </p>
              <p className="text-sm text-amber-800 leading-relaxed">
                यहाँ कोई document <strong>upload नहीं करना है</strong>। नीचे दिए गए सभी documents की
                <strong> original copy + एक-एक photocopy</strong> लेकर सीधे हमारे office आएं —
                हमारा counsellor आपकी admission process पूरी करने में मदद करेगा।
              </p>
              <div className="mt-3 rounded-xl bg-amber-100 border border-amber-200 px-4 py-3">
                <p className="flex items-center gap-1.5 text-xs font-extrabold text-amber-900 mb-1.5">
                  <MapPin size={13} /> Office Address
                </p>
                <p className="text-xs text-amber-800">
                  College Chowk, Near HP Petrol Pump,<br />Forbesganj, Araria, Bihar — 854318
                </p>
                <p className="flex items-center gap-1.5 text-xs text-amber-800 mt-2">
                  <Clock size={13} /> Mon–Sat: 9:00 AM – 7:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Course-wise Required Document Checklist ── */}
        {uniqueChecklists.length > 0 ? (
          <div className="mt-6 space-y-4">
            <p className="text-sm font-bold text-slate-700">
              आपने जिन courses के लिए apply किया है, उनके हिसाब से ज़रूरी documents:
            </p>
            {uniqueChecklists.map(({ courseName, req }) => (
              <div key={courseName} className="rounded-2xl border-2 border-blue-100 bg-blue-50 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <ClipboardList size={18} className="text-blue-600" />
                  <h2 className="font-extrabold text-slate-900 text-sm">
                    {courseName} — ज़रूरी Documents ({req.docs.length})
                  </h2>
                </div>
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {req.docs.map((docReq, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <FileCheck2 size={17} className="mt-0.5 flex-shrink-0 text-blue-500" />
                      <div>
                        <p className="text-sm font-semibold leading-tight text-slate-800">
                          {docReq.label}
                        </p>
                        {docReq.note && (
                          <p className="text-xs text-slate-500 mt-0.5">{docReq.note}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          /* No application yet — show common documents + prompt to apply */
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border-2 border-blue-100 bg-blue-50 p-5">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardList size={18} className="text-blue-600" />
                <h2 className="font-extrabold text-slate-900 text-sm">
                  सामान्य ज़रूरी Documents (सभी courses के लिए)
                </h2>
              </div>
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {COMMON_DOCS.map((label, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <FileCheck2 size={17} className="mt-0.5 flex-shrink-0 text-blue-500" />
                    <p className="text-sm font-semibold leading-tight text-slate-800">{label}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-white p-4">
              <Info size={18} className="flex-shrink-0 text-blue-500" />
              <p className="flex-1 text-sm text-slate-600">
                अभी आपने किसी course के लिए apply नहीं किया है। Apply करने पर उस course के हिसाब से
                exact document list यहाँ दिखेगी।
              </p>
              <Link href="/apply"
                className="flex-shrink-0 rounded-xl bg-[#003f9f] px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition">
                Apply करें →
              </Link>
            </div>
          </div>
        )}

        {/* ── Helpful tips ── */}
        <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-bold mb-1">कुछ ज़रूरी बातें:</p>
          <ul className="space-y-1 list-disc list-inside text-xs">
            <li>हर document की <strong>original copy + एक photocopy</strong> साथ लाएं।</li>
            <li>Original documents office में दिखाने के बाद आपको वापस मिल जाएंगे।</li>
            <li>Aadhaar Card, Marksheets और Passport-size photo सभी courses के लिए ज़रूरी हैं।</li>
            <li>कोई confusion हो तो office आने से पहले counsellor से WhatsApp/Call पर पूछ लें।</li>
          </ul>
        </div>

        {/* ── Contact counsellor ── */}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <a href="tel:+916203138576"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#003f9f] py-3 text-sm font-bold text-white hover:bg-blue-700 transition">
            <Phone size={16} /> Call करें — +91 62031 38576
          </a>
          <a href="https://wa.me/916203138576?text=नमस्ते!%20मुझे%20admission%20documents%20के%20बारे%20में%20जानकारी%20चाहिए।"
            target="_blank" rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-500 py-3 text-sm font-bold text-white hover:bg-green-600 transition">
            <MessageCircle size={16} /> WhatsApp पर पूछें
          </a>
        </div>
      </div>
    </PortalShell>
  );
}
