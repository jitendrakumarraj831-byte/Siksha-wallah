'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/auth-provider';
import { type CourseApplication } from '@/services/application-service';
import { getCourseSlug } from '@/lib/courses-data';
import { downloadApplicationReceipt } from '@/lib/receipt';
import {
  computeJourney, representativeDoc, type DocLike, type StudentJourney, type JourneyAction,
} from '@/lib/admission-journey';
import { AdmissionTimeline } from '@/components/admission-timeline';
import { PortalShell } from '@/components/portal-shell';
import {
  User, LogOut, Loader, Plus, ClipboardList, ArrowRight,
  PhoneCall, MessageCircle, Upload, Bell,
  Download, FileText, Sparkles,
} from 'lucide-react';

function profilePercent(profile: any): number {
  if (!profile) return 0;
  const fields = ['name', 'phone', 'email', 'qualification', 'address'];
  const filled = fields.filter(f => profile[f] && String(profile[f]).trim()).length;
  return Math.round((filled / fields.length) * 100);
}

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

// Map a journey action's CTA kind to a button style — keeps the single most
// important action visually obvious so the student acts in one tap.
const ACTION_BTN: Record<string, string> = {
  primary: 'bg-gradient-to-r from-[#001f6b] to-[#003f9f] text-white',
  upload:  'bg-orange-500 text-white',
  chat:    'bg-violet-600 text-white',
  receipt: 'bg-amber-400 text-gray-900',
};

export default function DashboardPage() {
  const { user, userProfile, isAuthenticated, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<CourseApplication[]>([]);
  const [docs, setDocs] = useState<DocLike[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) { router.push('/auth/login'); return; }
    if (authLoading || !user) return;

    (async () => {
      try {
        const token = await user.getIdToken().catch(() => null);

        // Applications — token-verified API (matches by uid + email), falls back
        // to a direct owner-only read. Unchanged API contract.
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
          // Documents — existing API, drives "which documents are pending?".
          const dres = await fetch(`/api/student/documents?uid=${user.uid}`, {
            headers: { Authorization: `Bearer ${token}` }, cache: 'no-store',
          });
          if (dres.ok) {
            const dj = await dres.json().catch(() => null);
            if (dj?.success && Array.isArray(dj.data)) setDocs(dj.data as DocLike[]);
          }

          // Unread notification count for the bell badge.
          const nres = await fetch(`/api/student/notifications?uid=${user.uid}`, {
            headers: { Authorization: `Bearer ${token}` }, cache: 'no-store',
          });
          if (nres.ok) {
            const nj = await nres.json().catch(() => null);
            if (nj?.success && Array.isArray(nj.data)) setUnreadNotifs(nj.data.filter((n: { read?: boolean }) => !n.read).length);
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
  const pct = profilePercent(userProfile);
  const initials = getInitials(name);
  const doc = representativeDoc(docs);

  // Sort newest-first; the primary (active) application drives the hero journey.
  const sorted = [...applications].sort((a, b) => {
    const ta = (a.createdAt as any)?.toMillis?.() ?? (a.createdAt as any) ?? 0;
    const tb = (b.createdAt as any)?.toMillis?.() ?? (b.createdAt as any) ?? 0;
    return tb - ta;
  });
  const primary = sorted.find(a => a.status !== 'not_interested') || sorted[0];
  const journey: StudentJourney | null = primary ? computeJourney(primary, doc) : null;
  const others = primary ? sorted.filter(a => a.id !== primary.id) : [];

  // Render a journey action as the right one-tap control (download vs link).
  function ActionButton({ action, big }: { action: JourneyAction; big?: boolean }) {
    if (!action.cta) return null;
    const cls = `inline-flex items-center justify-center gap-2 rounded-xl px-4 ${big ? 'py-3.5 w-full text-sm' : 'py-2 text-xs'} font-bold shadow-sm transition hover:opacity-95 ${ACTION_BTN[action.cta.kind] || ACTION_BTN.primary}`;
    const icon = action.cta.kind === 'upload' ? <Upload size={big ? 16 : 13} />
      : action.cta.kind === 'chat' ? <MessageCircle size={big ? 16 : 13} />
      : action.cta.kind === 'receipt' ? <Download size={big ? 16 : 13} />
      : <ArrowRight size={big ? 16 : 13} />;
    if (action.cta.kind === 'receipt') {
      return <button onClick={() => primary && downloadApplicationReceipt(primary)} className={cls}>{icon} {action.cta.label}</button>;
    }
    return <Link href={action.cta.href} className={cls}>{icon} {action.cta.label}</Link>;
  }

  return (
    <PortalShell>
      <div className="min-h-screen bg-gray-50">

        {/* ── HERO ── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#00102e] via-[#001f6b] to-[#003f9f] px-4 pb-16 pt-8">
          <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="container-shell relative max-w-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 font-headline text-lg font-extrabold text-gray-900 shadow-lg">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-blue-300">Student Portal</p>
                  <h1 className="truncate text-lg font-extrabold text-white">नमस्ते, {name.split(' ')[0]}! 👋</h1>
                </div>
              </div>
              <button onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/20">
                <LogOut size={13} /> Logout
              </button>
            </div>
          </div>
        </div>

        <div className="container-shell relative -mt-10 max-w-2xl pb-12">

          {/* ── NO APPLICATION YET ── */}
          {!journey && (
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

          {/* ── ADMISSION STATUS CARD (answers all 5 student questions) ── */}
          {journey && primary && (
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
              {/* Status header */}
              <div className="border-b border-gray-100 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">My Admission Status</p>
                    {(() => {
                      const slug = getCourseSlug(primary.course);
                      return (
                        <Link href={slug ? `/courses/${slug}` : '/courses'}
                          className="font-headline text-lg font-extrabold text-[#003f9f] underline-offset-2 hover:underline">
                          {primary.course}
                        </Link>
                      );
                    })()}
                    {/* Receipt number — shown on every admission surface */}
                    <p className="mt-0.5 font-mono text-xs font-bold tracking-wide text-gray-500">{journey.receipt}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                    journey.tone === 'success' ? 'bg-green-100 text-green-700'
                    : journey.tone === 'warn' ? 'bg-orange-100 text-orange-700'
                    : journey.tone === 'muted' ? 'bg-gray-100 text-gray-600'
                    : 'bg-blue-100 text-blue-700'
                  }`}>
                    {journey.statusLabel}
                  </span>
                </div>

                {/* Progress bar */}
                {!journey.isClosed && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-gray-400">
                      <span>Admission progress</span><span>{journey.percent}%</span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div className={`h-full rounded-full transition-all ${journey.isComplete ? 'bg-green-500' : 'bg-[#003f9f]'}`} style={{ width: `${journey.percent}%` }} />
                    </div>
                  </div>
                )}
              </div>

              {/* What should I do today / next step */}
              <div className={`p-5 ${
                journey.todayAction.tone === 'warn' ? 'bg-orange-50'
                : journey.todayAction.tone === 'success' ? 'bg-green-50'
                : 'bg-blue-50/60'
              }`}>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                    <Sparkles size={17} className="text-[#003f9f]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">What to do next</p>
                    <p className="font-bold text-gray-900">{journey.nextStep.title}</p>
                    <p className="mt-0.5 text-sm text-gray-600">{journey.nextStep.detail}</p>
                    <div className="mt-3">
                      <ActionButton action={journey.nextStep} big />
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents state — answers "what documents are pending?" */}
              <div className="flex items-center gap-3 border-t border-gray-100 px-5 py-4">
                <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${
                  journey.documents.state === 'approved' ? 'bg-green-100' : journey.documents.state === 'pending' ? 'bg-blue-100' : 'bg-orange-100'
                }`}>
                  <FileText size={17} className={
                    journey.documents.state === 'approved' ? 'text-green-600' : journey.documents.state === 'pending' ? 'text-blue-600' : 'text-orange-600'
                  } />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-gray-800">Documents: {journey.documents.label}</p>
                  <p className="text-xs text-gray-500">{journey.documents.hint}</p>
                </div>
                {journey.documents.awaitingStudent && (
                  <Link href="/dashboard/documents"
                    className="flex-shrink-0 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-orange-600 transition">
                    Upload
                  </Link>
                )}
              </div>

              {/* One clear admission timeline */}
              <div className="border-t border-gray-100 p-5">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-wide text-gray-400">Admission Timeline</p>
                <AdmissionTimeline status={journey.status} docState={journey.documents.state} variant="full" />
              </div>

              {/* Footer actions — receipt + counsellor note */}
              <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 bg-gray-50 px-5 py-3">
                <button onClick={() => downloadApplicationReceipt(primary)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#003f9f]/30 bg-white px-3 py-1.5 text-xs font-bold text-[#003f9f] hover:bg-blue-50 transition">
                  <Download size={12} /> Download Receipt
                </button>
                <Link href="/dashboard/messages"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-100 transition">
                  <MessageCircle size={12} /> Message Counsellor
                </Link>
                {primary.note && (
                  <span className="w-full rounded-lg bg-yellow-50 border border-yellow-100 px-3 py-1.5 text-xs text-yellow-800">
                    <span className="font-bold">Counsellor Note:</span> {primary.note}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ── QUICK ACTIONS (tight, no duplication with the card above) ── */}
          <div className="mt-4 grid grid-cols-4 gap-2.5">
            {[
              { href: '/dashboard/documents',     icon: Upload,        label: 'Documents', bg: 'bg-green-500',  badge: journey?.documents.awaitingStudent ? 1 : 0 },
              { href: '/dashboard/messages',      icon: MessageCircle, label: 'Chat',      bg: 'bg-violet-500', badge: 0 },
              { href: '/dashboard/notifications', icon: Bell,          label: 'Alerts',    bg: 'bg-amber-500',  badge: unreadNotifs },
              { href: '/apply',                   icon: Plus,          label: 'Apply',     bg: 'bg-[#dc143c]',  badge: 0 },
            ].map(({ href, icon: Icon, label, bg, badge }) => (
              <Link key={href} href={href}
                className="group flex flex-col items-center gap-2 rounded-2xl bg-white border border-gray-100 p-3 text-center transition hover:shadow-md">
                <div className={`relative flex h-11 w-11 items-center justify-center rounded-xl ${bg} text-white shadow-sm transition group-hover:scale-105`}>
                  <Icon size={20} />
                  {badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#dc143c] px-1 text-[10px] font-extrabold text-white ring-2 ring-white">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-bold text-gray-700">{label}</span>
              </Link>
            ))}
          </div>

          {/* ── PROFILE COMPLETION (only when incomplete) ── */}
          {pct < 100 && (
            <Link href="/dashboard/profile"
              className="mt-4 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 transition hover:shadow-sm">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-100">
                <User size={18} className="text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-amber-800">Profile {pct}% complete</p>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-amber-200">
                  <div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <ArrowRight size={16} className="flex-shrink-0 text-amber-500" />
            </Link>
          )}

          {/* ── OTHER APPLICATIONS (compact, no full duplicate list) ── */}
          {others.length > 0 && (
            <div className="mt-4 rounded-2xl bg-white shadow-sm border border-gray-100">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
                <h2 className="text-sm font-extrabold text-gray-900">Other Applications</h2>
                <Link href="/dashboard/applications" className="text-xs font-bold text-[#003f9f] hover:underline">View all →</Link>
              </div>
              <div className="divide-y divide-gray-50">
                {others.slice(0, 3).map(app => {
                  const j = computeJourney(app, doc);
                  return (
                    <Link key={app.id} href="/dashboard/applications" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-gray-800">{app.course}</p>
                        <p className="font-mono text-[10px] font-bold text-gray-400">{j.receipt}</p>
                      </div>
                      <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        j.tone === 'success' ? 'bg-green-100 text-green-700' : j.tone === 'warn' ? 'bg-orange-100 text-orange-700' : j.tone === 'muted' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700'
                      }`}>{j.statusLabel}</span>
                      <ArrowRight size={14} className="flex-shrink-0 text-gray-300" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── HELP + ACCOUNT ── */}
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100">
              <PhoneCall size={18} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-blue-900">Counsellor से बात करें</p>
              <p className="text-xs text-blue-600">Mon–Sat 9AM–7PM · WhatsApp 24×7</p>
            </div>
            <a href="https://wa.me/916203138576" target="_blank" rel="noopener noreferrer"
              className="flex-shrink-0 rounded-xl bg-green-500 px-3 py-2 text-xs font-bold text-white hover:bg-green-600 transition">
              WhatsApp
            </a>
          </div>

          <div className="mt-3 flex gap-3">
            <Link href="/dashboard/profile" className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 transition">
              <User size={13} /> My Profile
            </Link>
            <Link href="/dashboard/change-password" className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 transition">
              🔒 Change Password
            </Link>
          </div>

        </div>
      </div>
    </PortalShell>
  );
}
