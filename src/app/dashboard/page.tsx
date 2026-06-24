'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { type CourseApplication, type ApplicationStatus } from '@/services/application-service';
import { getCourseSlug } from '@/lib/courses-data';
import { PortalShell } from '@/components/portal-shell';
import {
  User, FileText, BookOpen, LogOut, Loader, Plus, ClipboardList, ArrowRight,
} from 'lucide-react';

const STATUS_META: Record<ApplicationStatus, { label: string; color: string }> = {
  new:               { label: 'Application Received',   color: 'bg-blue-100 text-blue-700' },
  contacted:         { label: 'Counsellor Connected',   color: 'bg-yellow-100 text-yellow-700' },
  documents_pending: { label: 'Documents Required',     color: 'bg-orange-100 text-orange-700' },
  admission_done:    { label: 'Admission Confirmed',    color: 'bg-green-100 text-green-700' },
  not_interested:    { label: 'Application Closed',     color: 'bg-gray-100 text-gray-600' },
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

export default function DashboardPage() {
  const { user, userProfile, isAuthenticated, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<CourseApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (authLoading || !user) return;

    user.getIdToken().then(async (token) => {
      try {
        const res = await fetch(`/api/student/applications?uid=${user.uid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success) setApplications(json.data);
      } finally {
        setLoading(false);
      }
    });
  }, [authLoading, isAuthenticated, user, router]);

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

  return (
    <PortalShell>
      <div className="container-shell max-w-3xl py-8">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#001f6b] to-[#003f9f] p-6 text-white">
          <div>
            <p className="text-sm text-blue-200 mb-1">Student Dashboard</p>
            <h1 className="text-2xl font-extrabold">Welcome, {name}</h1>
            <p className="mt-1 text-sm text-blue-300">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border-2 border-white/30 px-4 py-2 text-sm font-bold text-white hover:bg-white/10 transition"
          >
            <LogOut size={15} /> Logout
          </button>
        </div>

        {/* Profile Completion */}
        <div className="mb-6 rounded-2xl border-2 border-gray-100 bg-white p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <User size={18} className="text-[#003f9f]" />
              <span className="font-bold text-gray-800">Profile Completion</span>
            </div>
            <span className={`text-sm font-extrabold ${pct === 100 ? 'text-green-600' : 'text-amber-600'}`}>
              {pct}%
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-green-500' : 'bg-amber-500'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          {pct < 100 && (
            <div className="mt-3">
              <Link
                href="/dashboard/profile"
                className="text-sm font-semibold text-[#003f9f] hover:underline"
              >
                Complete your profile →
              </Link>
            </div>
          )}
        </div>

        {/* Quick Nav */}
        <div className="mb-8 grid grid-cols-3 gap-3">
          {[
            { href: '/dashboard/profile',   icon: User,          label: 'My Profile' },
            { href: '/courses',             icon: BookOpen,      label: 'Courses' },
            { href: '/dashboard/documents', icon: FileText,      label: 'Documents' },
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-2 rounded-2xl border-2 border-gray-100 bg-white p-4 text-center transition hover:border-[#003f9f] hover:shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <Icon size={20} className="text-[#003f9f]" />
              </div>
              <span className="text-xs font-bold text-gray-700">{label}</span>
            </Link>
          ))}
        </div>

        {/* My Applications */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-gray-900">My Applications</h2>
            <Link
              href="/apply"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#dc143c] px-4 py-2 text-sm font-bold text-white hover:bg-red-700 transition"
            >
              <Plus size={15} /> New Application
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 py-14 text-center">
              <ClipboardList size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="font-semibold text-gray-500">No applications yet</p>
              <p className="mt-1 text-sm text-gray-400 mb-5">Apply for any course — a counsellor will contact you within 30 minutes.</p>
              <Link
                href="/apply"
                className="inline-flex items-center gap-2 rounded-xl bg-[#003f9f] px-6 py-3 font-bold text-white hover:bg-blue-700 transition"
              >
                <Plus size={16} /> Apply for a Course <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map(app => {
                const meta = STATUS_META[app.status || 'new'];
                return (
                  <div key={app.id} className="rounded-2xl border-2 border-gray-100 bg-white p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {(() => {
                            const slug = getCourseSlug(app.course);
                            return slug ? (
                              <Link href={`/courses/${slug}`} className="rounded-lg bg-blue-50 px-2.5 py-1 text-sm font-extrabold text-[#003f9f] hover:bg-blue-100 underline-offset-2 hover:underline transition">
                                {app.course} →
                              </Link>
                            ) : (
                              <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-sm font-extrabold text-[#003f9f]">{app.course}</span>
                            );
                          })()}
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${meta.color}`}>
                            {meta.label}
                          </span>
                        </div>
                        {app.note && (
                          <div className="mt-2 rounded-lg bg-yellow-50 border border-yellow-100 px-3 py-1.5 text-xs text-yellow-800">
                            <span className="font-bold">Counsellor Note:</span> {app.note}
                          </div>
                        )}
                        {app.availableDocs && (app.availableDocs as string[]).length > 0 && (
                          <div className="mt-2 rounded-lg bg-green-50 border border-green-100 px-3 py-2 text-xs">
                            <p className="font-bold text-green-800 mb-1">📋 आपके Documents ({(app.availableDocs as string[]).length}):</p>
                            <div className="flex flex-wrap gap-1">
                              {(app.availableDocs as string[]).map((d) => (
                                <span key={d} className="rounded bg-green-100 px-1.5 py-0.5 text-green-800 font-semibold">{d.split(" (")[0]}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="flex-shrink-0 text-xs text-gray-400">
                        {formatDate(app.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </PortalShell>
  );
}
