'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/auth-provider';
import { type CourseApplication } from '@/services/application-service';
import {
  downloadApplicationReceipt, downloadApplicationForm, downloadAdmissionLetter, receiptNo,
} from '@/lib/receipt';
import {
  representativeDoc, requiredDocState, computeChecklist, computeOverallStatus, summarizePayment,
  REQUIRED_DOCUMENTS, type DocLike, type Tone, type RequiredDocState,
} from '@/lib/admission-journey';
import { PortalShell } from '@/components/portal-shell';
import {
  LogOut, Loader, Plus, ClipboardList, ArrowRight, Check,
  PhoneCall, MessageCircle, Upload, Download, FileText,
  Lock, Camera, User, HelpCircle,
} from 'lucide-react';

function getInitials(name: string): string {
  return (name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function formatDate(ts: unknown): string {
  if (!ts) return '—';
  const d = (ts as any)?.toDate ? (ts as any).toDate() : new Date(ts as any);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

const TONE_BADGE: Record<Tone, string> = {
  success: 'bg-green-100 text-green-700',
  warn: 'bg-orange-100 text-orange-700',
  active: 'bg-blue-100 text-blue-700',
  info: 'bg-blue-100 text-blue-700',
  muted: 'bg-gray-100 text-gray-600',
};

const TONE_PANEL: Record<Tone, string> = {
  success: 'bg-green-50 border-green-100',
  warn: 'bg-orange-50 border-orange-100',
  active: 'bg-blue-50 border-blue-100',
  info: 'bg-blue-50 border-blue-100',
  muted: 'bg-gray-50 border-gray-100',
};

const DOC_STATE_BADGE: Record<RequiredDocState, { label: string; cls: string }> = {
  pending: { label: 'Pending', cls: 'bg-gray-100 text-gray-500' },
  uploaded: { label: 'Uploaded', cls: 'bg-blue-100 text-blue-700' },
  verified: { label: 'Verified', cls: 'bg-green-100 text-green-700' },
};

function SectionCard({ title, titleHi, icon, children, right }: {
  title: string; titleHi?: string; icon: React.ReactNode; children: React.ReactNode; right?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#003f9f]">{icon}</span>
          <h2 className="text-sm font-extrabold text-gray-900">
            {title} {titleHi && <span className="font-semibold text-gray-400">/ {titleHi}</span>}
          </h2>
        </div>
        {right}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="font-bold text-gray-800 text-right">{value}</span>
    </div>
  );
}

export default function DashboardPage() {
  const { user, userProfile, isAuthenticated, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<CourseApplication[]>([]);
  const [docs, setDocs] = useState<DocLike[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) { router.push('/auth/login'); return; }
    if (authLoading || !user) return;

    (async () => {
      try {
        const token = await user.getIdToken().catch(() => null);

        let apps: CourseApplication[] = [];
        if (token) {
          const res = await fetch(`/api/student/applications?uid=${user.uid}`, {
            headers: { Authorization: `Bearer ${token}` }, cache: 'no-store',
          });
          if (res.ok) {
            const json = await res.json().catch(() => null);
            if (json?.success) apps = json.data as CourseApplication[];
          }
        }
        if (apps.length === 0) {
          const snap = await getDocs(query(collection(db, 'course_applications'), where('userId', '==', user.uid)));
          apps = snap.docs.map((d) => ({ id: d.id, ...d.data() } as CourseApplication));
          apps.sort((a, b) => {
            const ta = (a.createdAt as any)?.toMillis?.() ?? (a.createdAt as any) ?? 0;
            const tb = (b.createdAt as any)?.toMillis?.() ?? (b.createdAt as any) ?? 0;
            return tb - ta;
          });
        }
        setApplications(apps);

        if (token) {
          const dres = await fetch(`/api/student/documents?uid=${user.uid}`, {
            headers: { Authorization: `Bearer ${token}` }, cache: 'no-store',
          });
          if (dres.ok) {
            const dj = await dres.json().catch(() => null);
            if (dj?.success && Array.isArray(dj.data)) setDocs(dj.data as DocLike[]);
          }
        }
      } catch {
        /* leave empty state */
      } finally {
        setLoading(false);
      }
    })();
  }, [authLoading, isAuthenticated, user, router]);

  const handleLogout = async () => { await logout(); router.push('/'); };

  if (authLoading || loading) {
    return (
      <PortalShell>
        <div className="flex min-h-screen items-center justify-center">
          <Loader className="animate-spin text-[#003f9f]" size={36} />
        </div>
      </PortalShell>
    );
  }
  if (!isAuthenticated) return null;

  const name = userProfile?.name || user?.displayName || 'Student';
  const initials = getInitials(name);

  const sorted = [...applications].sort((a, b) => {
    const ta = (a.createdAt as any)?.toMillis?.() ?? (a.createdAt as any) ?? 0;
    const tb = (b.createdAt as any)?.toMillis?.() ?? (b.createdAt as any) ?? 0;
    return tb - ta;
  });
  const primary = sorted.find(a => a.status !== 'not_interested') || sorted[0];
  const others = primary ? sorted.filter(a => a.id !== primary.id) : [];
  const doc = representativeDoc(docs);

  const checklist = primary ? computeChecklist(primary, doc) : null;
  const overallStatus = primary ? computeOverallStatus(primary, doc) : null;
  const payment = primary ? summarizePayment(primary) : null;
  const docBadge = DOC_STATE_BADGE[requiredDocState(doc)];
  const canDownloadLetter = primary?.status === 'admission_done';

  const waHref = primary
    ? `https://wa.me/916203138576?text=${encodeURIComponent(`नमस्ते! मेरा नाम ${name} है। Receipt Number: ${receiptNo(primary.id)}, Course: ${primary.course}. मुझे अपने admission status के बारे में जानकारी चाहिए।`)}`
    : 'https://wa.me/916203138576';

  return (
    <PortalShell>
      <div className="min-h-screen bg-gray-50">

        {/* ── HEADER ── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#00102e] via-[#001f6b] to-[#003f9f] px-4 pb-14 pt-8">
          <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="container-shell relative max-w-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 font-headline text-lg font-extrabold text-gray-900 shadow-lg">
                  {userProfile?.photoURL ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={userProfile.photoURL} alt={name} className="h-full w-full object-cover" />
                  ) : initials}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-blue-300">Student Portal / छात्र पोर्टल</p>
                  <h1 className="truncate text-lg font-extrabold text-white">नमस्ते, {name.split(' ')[0]}! 👋</h1>
                </div>
              </div>
              <button onClick={handleLogout}
                className="flex flex-shrink-0 items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/20">
                <LogOut size={13} /> Logout
              </button>
            </div>
          </div>
        </div>

        <div className="container-shell relative -mt-8 max-w-2xl space-y-4 pb-12">

          {/* ── NO APPLICATION YET ── */}
          {!primary && (
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm border border-gray-100">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50">
                <ClipboardList size={32} className="text-gray-300" />
              </div>
              <p className="font-bold text-gray-700">अभी कोई admission application नहीं है</p>
              <p className="mt-1 text-sm text-gray-400">किसी भी course के लिए apply करें — counsellor 30 मिनट में contact करेंगे।</p>
              <Link href="/apply"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#001f6b] to-[#003f9f] px-6 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg transition">
                <Plus size={15} /> Apply for a Course <ArrowRight size={15} />
              </Link>
            </div>
          )}

          {primary && checklist && overallStatus && payment && (
            <>
              {/* ── 1. WELCOME CARD ── */}
              <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
                <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">Welcome / स्वागत है</p>
                <p className="mt-1 text-xl font-extrabold text-gray-900">{name}</p>
                <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <p className="text-gray-400">Receipt No.</p>
                    <p className="mt-0.5 font-mono font-bold text-gray-800">{receiptNo(primary.id)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Course</p>
                    <p className="mt-0.5 truncate font-bold text-gray-800">{primary.course}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Applied On</p>
                    <p className="mt-0.5 font-bold text-gray-800">{formatDate(primary.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* ── 2. ADMISSION PROGRESS ── */}
              <SectionCard title="Admission Progress" titleHi="प्रवेश प्रगति" icon={<ClipboardList size={16} />}
                right={<span className="text-sm font-extrabold text-[#003f9f]">{checklist.percent}%</span>}>
                <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div className={`h-full rounded-full transition-all ${checklist.isComplete ? 'bg-green-500' : 'bg-[#003f9f]'}`} style={{ width: `${checklist.percent}%` }} />
                </div>
                <ul className="space-y-0.5">
                  {checklist.items.map((item) => (
                    <li key={item.key} className="flex items-center gap-3 py-1.5">
                      <span className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${
                        item.state === 'done' ? 'bg-green-500 text-white'
                        : item.state === 'current' ? 'bg-[#003f9f] text-white'
                        : 'bg-gray-200 text-gray-400'
                      }`}>
                        {item.state === 'done' ? <Check size={12} /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                      </span>
                      <span className={`text-sm ${item.state === 'pending' ? 'text-gray-400' : 'font-bold text-gray-800'}`}>
                        {item.label} <span className="font-normal text-gray-400">/ {item.labelHi}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </SectionCard>

              {/* ── 3. MY DOCUMENTS ── */}
              <SectionCard title="My Documents" titleHi="मेरे दस्तावेज़" icon={<FileText size={16} />}
                right={<span className={`rounded-full px-2.5 py-1 text-xs font-bold ${docBadge.cls}`}>{docBadge.label}</span>}>
                <div className="divide-y divide-gray-50">
                  {REQUIRED_DOCUMENTS.map((d) => {
                    const state = requiredDocState(doc);
                    const b = DOC_STATE_BADGE[state];
                    return (
                      <div key={d.key} className="flex items-center justify-between gap-3 py-2">
                        <span className="text-sm text-gray-700">{d.label} <span className="text-gray-400">/ {d.labelHi}</span></span>
                        <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${b.cls}`}>{b.label}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-3 text-xs text-gray-400">सभी documents एक PDF में combine करके upload करें। Only office can verify documents — केवल कार्यालय ही सत्यापित करेगा।</p>
                <Link href="/dashboard/documents"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-bold text-white shadow-sm hover:bg-orange-600 transition">
                  <Upload size={15} /> Upload Documents / दस्तावेज़ अपलोड करें
                </Link>
              </SectionCard>

              {/* ── 4. PAYMENT STATUS ── */}
              <SectionCard title="Payment Status" titleHi="भुगतान स्थिति" icon={<span className="font-extrabold text-sm">₹</span>}
                right={<span className={`rounded-full px-2.5 py-1 text-xs font-bold ${TONE_BADGE[payment.tone]}`}>{payment.label}</span>}>
                <Row label="Amount Paid / भुगतान राशि" value={payment.amountPaid != null ? `₹${payment.amountPaid.toLocaleString('en-IN')}` : '—'} />
                <Row label="Amount Due / शेष राशि" value={payment.amountDue != null ? `₹${payment.amountDue.toLocaleString('en-IN')}` : '—'} />
                <Row label="Payment Date / भुगतान तिथि" value={payment.paymentDate ? formatDate(payment.paymentDate) : '—'} />
                <Row label="Payment Mode / भुगतान माध्यम" value={payment.paymentMode || '—'} />
                <Row label="Receipt Number" value={payment.receipt} />
                <p className="mt-3 text-xs text-gray-400">यह जानकारी केवल कार्यालय द्वारा अपडेट की जाती है — Only Office can update payment status.</p>
              </SectionCard>

              {/* ── 5. APPLICATION STATUS ── */}
              <div className={`rounded-2xl border p-5 shadow-sm ${TONE_PANEL[overallStatus.tone]}`}>
                <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500">Application Status / आवेदन स्थिति</p>
                <p className="mt-1 text-xl font-extrabold text-gray-900">
                  {overallStatus.label} <span className="text-sm font-bold text-gray-500">/ {overallStatus.labelHi}</span>
                </p>
                <p className="mt-2 text-sm text-gray-700">{overallStatus.explanation}</p>
                <p className="mt-0.5 text-sm text-gray-500">{overallStatus.explanationHi}</p>
              </div>

              {/* ── 6. DOWNLOADS ── */}
              <SectionCard title="Downloads" titleHi="डाउनलोड" icon={<Download size={16} />}>
                <div className="space-y-2.5">
                  <button onClick={() => downloadApplicationReceipt(primary)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#003f9f] py-3.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition">
                    <Download size={16} /> Download Receipt / रसीद डाउनलोड करें
                  </button>
                  <button onClick={() => downloadApplicationForm(primary)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#003f9f]/20 bg-white py-3.5 text-sm font-bold text-[#003f9f] shadow-sm hover:bg-blue-50 transition">
                    <Download size={16} /> Download Application Form / आवेदन फॉर्म
                  </button>
                  {canDownloadLetter ? (
                    <button onClick={() => downloadAdmissionLetter(primary)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-green-700 transition">
                      <Download size={16} /> Download Admission Letter / प्रवेश पत्र
                    </button>
                  ) : (
                    <div className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3.5 text-sm font-bold text-gray-400">
                      <Lock size={14} /> Admission Letter — available after approval
                    </div>
                  )}
                </div>
              </SectionCard>

              {/* ── 7. PROFILE ── */}
              <SectionCard title="Profile" titleHi="प्रोफाइल" icon={<User size={16} />}>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 font-headline font-extrabold text-gray-900">
                    {userProfile?.photoURL ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={userProfile.photoURL} alt={name} className="h-full w-full object-cover" />
                    ) : initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-gray-800">{name}</p>
                    <p className="truncate text-xs text-gray-400">{userProfile?.phone || 'Mobile not set'}</p>
                  </div>
                  <Link href="/dashboard/profile"
                    className="flex flex-shrink-0 items-center gap-1.5 rounded-xl border-2 border-[#003f9f]/20 px-3 py-2 text-xs font-bold text-[#003f9f] hover:bg-blue-50 transition">
                    <Camera size={12} /> Edit
                  </Link>
                </div>
                <p className="mt-3 text-xs text-gray-400">
                  आप केवल Photo, Mobile, Email और Address बदल सकते हैं। Name, Course और Receipt Number lock हैं।
                </p>
                <Link href="/dashboard/change-password" className="mt-3 inline-block text-xs font-bold text-gray-500 hover:text-[#003f9f] hover:underline">
                  🔒 Change Password
                </Link>
              </SectionCard>

              {/* ── 8. SUPPORT ── */}
              <SectionCard title="Support" titleHi="सहायता" icon={<HelpCircle size={16} />}>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  <a href={waHref} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl bg-green-500 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-green-600 transition">
                    <MessageCircle size={16} /> WhatsApp
                  </a>
                  <a href="tel:+916203138576"
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#003f9f] py-3.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition">
                    <PhoneCall size={16} /> Call Office
                  </a>
                  <Link href="/dashboard/messages"
                    className="flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white py-3.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition">
                    <HelpCircle size={16} /> Help & Support
                  </Link>
                </div>
                <p className="mt-3 text-center text-xs text-gray-400">Mon–Sat 9AM–7PM · WhatsApp 24×7</p>
              </SectionCard>

              {/* ── OTHER APPLICATIONS (only if more than one) ── */}
              {others.length > 0 && (
                <Link href="/dashboard/applications"
                  className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-5 py-3.5 text-sm shadow-sm hover:shadow-md transition">
                  <span className="font-bold text-gray-700">You have {others.length} other application(s)</span>
                  <ArrowRight size={16} className="text-gray-300" />
                </Link>
              )}
            </>
          )}

        </div>
      </div>
    </PortalShell>
  );
}
