'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/auth-provider';
import { type CourseApplication, type ApplicationStatus } from '@/services/application-service';
import { getCourseSlug } from '@/lib/courses-data';
import { receiptNo } from '@/lib/receipt';
import { PortalShell } from '@/components/portal-shell';
import {
  User, FileText, BookOpen, LogOut, Loader, Plus, ClipboardList,
  ArrowRight, CheckCircle2, Clock, PhoneCall, AlertCircle, GraduationCap,
  MessageCircle, Upload, Bell,
} from 'lucide-react';

const STATUS_META: Record<ApplicationStatus, { label: string; badge: string; bar: string; icon: React.ElementType }> = {
  new:               { label: 'Application Received',  badge: 'bg-blue-100 text-blue-700',    bar: 'bg-blue-500',   icon: ClipboardList  },
  contacted:         { label: 'Counsellor Connected',  badge: 'bg-yellow-100 text-yellow-700', bar: 'bg-yellow-500', icon: PhoneCall      },
  documents_pending: { label: 'Documents Required',    badge: 'bg-orange-100 text-orange-700', bar: 'bg-orange-500', icon: AlertCircle    },
  admission_done:    { label: 'Admission Confirmed ✓', badge: 'bg-green-100 text-green-700',   bar: 'bg-green-500',  icon: CheckCircle2   },
  not_interested:    { label: 'Application Closed',    badge: 'bg-gray-100 text-gray-600',     bar: 'bg-gray-400',   icon: ClipboardList  },
};

function formatDate(ts: any): string {
  const d = ts?.toDate ? ts.toDate() : ts ? new Date(ts) : null;
  if (!d) return '';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function profilePercent(profile: any): number {
  if (!profile) return 0;
  const fields = ['name', 'phone', 'email', 'qualification', 'address'];
  const filled = fields.filter(f => profile[f] && String(profile[f]).trim()).length;
  return Math.round((filled / fields.length) * 100);
}

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function DashboardPage() {
  const { user, userProfile, isAuthenticated, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const appsRef = useRef<HTMLDivElement>(null);
  const [applications, setApplications] = useState<CourseApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (authLoading || !user) return;

    (async () => {
      try {
        // Primary: token-verified server API (Admin SDK). Returns this student's
        // applications matched by uid AND by email (covers apply-before-login)
        // and backfills userId. Works with locked Firestore rules.
        const token = await user.getIdToken().catch(() => null);
        if (token) {
          const res = await fetch(`/api/student/applications?uid=${user.uid}`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
          });
          if (res.ok) {
            const json = await res.json().catch(() => null);
            if (json?.success) {
              setApplications(json.data as CourseApplication[]);
              return;
            }
          }
        }

        // Fallback: read this student's own applications directly. Satisfies the
        // owner-only rule (userId == auth.uid); misses pre-login email-only
        // matches, which the API path above handles when it's available.
        const q1 = query(collection(db, 'course_applications'), where('userId', '==', user.uid));
        const snap1 = await getDocs(q1);
        const apps = snap1.docs.map((d) => ({ id: d.id, ...d.data() } as CourseApplication));
        apps.sort((a, b) => {
          const ta = (a.createdAt as any)?.toMillis?.() ?? (a.createdAt as any) ?? 0;
          const tb = (b.createdAt as any)?.toMillis?.() ?? (b.createdAt as any) ?? 0;
          return tb - ta;
        });
        setApplications(apps);
      } catch {
        setApplications([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [authLoading, isAuthenticated, user, router]);

  // Unread notification count — drives the badge on the Notifications nav card so
  // students discover document-verification updates without opening the page.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        const token = await user.getIdToken().catch(() => null);
        if (!token) return;
        const res = await fetch(`/api/student/notifications?uid=${user.uid}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });
        if (!res.ok) return;
        const json = await res.json().catch(() => null);
        if (!cancelled && json?.success && Array.isArray(json.data)) {
          setUnreadNotifs(json.data.filter((n: { read?: boolean }) => !n.read).length);
        }
      } catch {
        /* non-critical — badge just stays hidden */
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

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
  const activeApps = applications.filter(a => a.status !== 'not_interested').length;
  const admissionDone = applications.filter(a => a.status === 'admission_done').length;

  return (
    <PortalShell>
      <div className="min-h-screen bg-gray-50">

        {/* ── HERO HEADER ── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#00102e] via-[#001f6b] to-[#003f9f] px-4 pb-20 pt-8">
          <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-amber-400 opacity-10 blur-3xl" />

          <div className="container-shell relative max-w-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 font-headline text-xl font-extrabold text-gray-900 shadow-lg">
                  {initials}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-blue-300">Student Portal</p>
                  <h1 className="text-xl font-extrabold text-white">नमस्ते, {name.split(' ')[0]}! 👋</h1>
                  <p className="text-xs text-blue-300">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/20"
              >
                <LogOut size={13} /> Logout
              </button>
            </div>

            {/* Stats row — clickable */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              <Link href="/dashboard/profile"
                className="rounded-xl bg-white/10 p-3 text-center backdrop-blur transition hover:bg-white/20 cursor-pointer">
                <p className={`text-2xl font-extrabold ${pct === 100 ? 'text-green-400' : 'text-amber-400'}`}>{pct}%</p>
                <p className="text-[11px] font-bold text-white">Profile</p>
                <p className="text-[10px] text-blue-300">Complete →</p>
              </Link>
              <button onClick={() => appsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="rounded-xl bg-white/10 p-3 text-center backdrop-blur transition hover:bg-white/20 cursor-pointer w-full">
                <p className="text-2xl font-extrabold text-blue-300">{activeApps}</p>
                <p className="text-[11px] font-bold text-white">Applications</p>
                <p className="text-[10px] text-blue-300">देखें →</p>
              </button>
              <button onClick={() => appsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="rounded-xl bg-white/10 p-3 text-center backdrop-blur transition hover:bg-white/20 cursor-pointer w-full">
                <p className="text-2xl font-extrabold text-green-400">{admissionDone}</p>
                <p className="text-[11px] font-bold text-white">Admissions</p>
                <p className="text-[10px] text-blue-300">Confirmed →</p>
              </button>
            </div>
          </div>
        </div>

        {/* ── CONTENT (pulls up over hero) ── */}
        <div className="container-shell relative -mt-8 max-w-2xl pb-12">

          {/* Profile Completion Card */}
          {pct < 100 && (
            <div className="mb-4 flex items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-100">
                <AlertCircle size={20} className="text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-amber-800">Profile अधूरी है — {pct}% complete</p>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-amber-200">
                  <div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <Link href="/dashboard/profile"
                className="flex-shrink-0 rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-600 transition">
                Complete →
              </Link>
            </div>
          )}

          {/* Quick Nav — color-coded */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { href: '/dashboard/profile',       icon: User,         label: 'My Profile',      bg: 'bg-blue-500',   light: 'bg-blue-50',   badge: 0 },
              { href: '/dashboard/documents',     icon: Upload,       label: 'Upload Documents', bg: 'bg-green-500',  light: 'bg-green-50',  badge: 0 },
              { href: '/dashboard/notifications', icon: Bell,         label: 'Notifications',    bg: 'bg-amber-500',  light: 'bg-amber-50',  badge: unreadNotifs },
              { href: '/dashboard/messages',      icon: MessageCircle,label: 'Counsellor Chat',  bg: 'bg-violet-500', light: 'bg-violet-50', badge: 0 },
              { href: '/courses',                 icon: GraduationCap,label: 'Browse Courses',   bg: 'bg-indigo-500', light: 'bg-indigo-50', badge: 0 },
              { href: '/apply',                   icon: Plus,         label: 'Apply Now',        bg: 'bg-[#dc143c]',  light: 'bg-red-50',    badge: 0 },
            ].map(({ href, icon: Icon, label, bg, light, badge }) => (
              <Link key={href} href={href}
                className={`group flex flex-col items-center gap-2.5 rounded-2xl ${light} border border-transparent p-4 text-center transition hover:shadow-md hover:border-gray-200`}>
                <div className={`relative flex h-12 w-12 items-center justify-center rounded-xl ${bg} text-white shadow-sm transition group-hover:scale-110`}>
                  <Icon size={22} />
                  {badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#dc143c] px-1 text-[10px] font-extrabold text-white ring-2 ring-white">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-gray-700">{label}</span>
              </Link>
            ))}
          </div>

          {/* My Applications */}
          <div ref={appsRef} className="rounded-2xl bg-white shadow-sm border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="font-headline text-base font-extrabold text-gray-900">My Applications</h2>
              <Link href="/apply"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 px-3 py-1.5 text-xs font-bold text-gray-900 shadow-sm hover:shadow-md transition">
                <Plus size={13} /> New Application
              </Link>
            </div>

            {applications.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-14 text-center px-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50">
                  <ClipboardList size={32} className="text-gray-300" />
                </div>
                <div>
                  <p className="font-bold text-gray-600">अभी कोई application नहीं है</p>
                  <p className="mt-1 text-sm text-gray-400">किसी भी course के लिए apply करें — counsellor 30 मिनट में contact करेंगे।</p>
                </div>
                <Link href="/apply"
                  className="mt-2 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#001f6b] to-[#003f9f] px-6 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg transition">
                  <Plus size={15} /> Course के लिए Apply करें <ArrowRight size={15} />
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {applications.map(app => {
                  const meta = STATUS_META[app.status || 'new'];
                  const StatusIcon = meta.icon;
                  return (
                    <div key={app.id} className="flex gap-4 p-5">
                      {/* Left color bar */}
                      <div className={`w-1 flex-shrink-0 rounded-full ${meta.bar}`} />

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          {(() => {
                            const slug = getCourseSlug(app.course);
                            const href = slug ? `/courses/${slug}` : `/courses`;
                            return (
                              <Link href={href}
                                className="font-headline text-sm font-extrabold text-[#003f9f] underline underline-offset-2 hover:text-blue-700">
                                {app.course} →
                              </Link>
                            );
                          })()}
                          <span className="rounded-md bg-gray-100 px-2 py-0.5 font-mono text-[10px] font-bold tracking-wide text-gray-500"
                            title="Application receipt number">
                            {receiptNo(app.id)}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <StatusIcon size={12} className="flex-shrink-0" />
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${meta.badge}`}>
                            {meta.label}
                          </span>
                        </div>

                        {app.status === 'documents_pending' && (
                          <Link href="/dashboard/documents"
                            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-orange-600 transition">
                            <Upload size={12} /> Upload Documents <ArrowRight size={12} />
                          </Link>
                        )}

                        {app.note && (
                          <div className="mt-2 rounded-lg bg-yellow-50 border border-yellow-100 px-3 py-1.5 text-xs text-yellow-800">
                            <span className="font-bold">Counsellor Note:</span> {app.note}
                          </div>
                        )}
                        {app.availableDocs && (app.availableDocs as string[]).length > 0 && (
                          <div className="mt-2 rounded-lg bg-green-50 border border-green-100 px-3 py-2 text-xs">
                            <p className="font-bold text-green-800 mb-1">📋 Documents ({(app.availableDocs as string[]).length})</p>
                            <div className="flex flex-wrap gap-1">
                              {(app.availableDocs as string[]).map((d) => (
                                <span key={d} className="rounded bg-green-100 px-1.5 py-0.5 text-green-800 font-semibold">{d.split(" (")[0]}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex-shrink-0 flex items-start">
                        <div className="flex items-center gap-1 text-[11px] text-gray-400">
                          <Clock size={10} /> {formatDate(app.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* My Applications link */}
          <div className="mt-4">
            <Link href="/dashboard/applications"
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-bold text-gray-800 hover:shadow-sm transition">
              <span className="flex items-center gap-2">
                <ClipboardList size={16} className="text-blue-500" /> My Applications ({applications.length})
              </span>
              <ArrowRight size={14} className="text-gray-400" />
            </Link>
          </div>

          {/* Account options */}
          <div className="mt-3 flex gap-3">
            <Link href="/dashboard/change-password"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 transition">
              🔒 Change Password
            </Link>
            <button onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 text-xs font-bold text-red-600 hover:bg-red-100 transition">
              <LogOut size={13} /> Logout
            </button>
          </div>

          {/* Help CTA */}
          <div className="mt-4 flex items-center gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100">
              <PhoneCall size={18} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-blue-900">Counsellor से बात करें</p>
              <p className="text-xs text-blue-600">Mon–Sat 9AM–7PM · WhatsApp 24×7</p>
            </div>
            <a href="https://wa.me/916203138576" target="_blank" rel="noopener noreferrer"
              className="flex-shrink-0 rounded-xl bg-green-500 px-3 py-2 text-xs font-bold text-white hover:bg-green-600 transition">
              WhatsApp
            </a>
          </div>

        </div>
      </div>
    </PortalShell>
  );
}
