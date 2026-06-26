'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { type CourseApplication, type ApplicationStatus } from '@/services/application-service';
import { getCourseSlug } from '@/lib/courses-data';
import { PortalShell } from '@/components/portal-shell';
import {
  ArrowLeft, Loader, Plus, ClipboardList, ArrowRight,
  CheckCircle2, Clock, PhoneCall, AlertCircle,
} from 'lucide-react';
import { getIdToken } from 'firebase/auth';
import { auth } from '@/lib/firebase';

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

export default function ApplicationsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<CourseApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) { router.push('/auth/login'); return; }
    if (authLoading || !user) return;

    (async () => {
      try {
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
      } catch {}
      finally { setLoading(false); }
    })();
  }, [authLoading, isAuthenticated, user, router]);

  if (authLoading || loading) {
    return (
      <PortalShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader className="animate-spin text-blue-600" size={36} />
        </div>
      </PortalShell>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <PortalShell>
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="bg-gradient-to-br from-[#00102e] via-[#001f6b] to-[#003f9f] px-4 py-8">
          <div className="container-shell max-w-2xl">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-blue-300 hover:text-white text-sm font-semibold mb-4">
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-white">My Applications</h1>
                <p className="text-blue-300 text-sm mt-1">{applications.length} application{applications.length !== 1 ? 's' : ''} total</p>
              </div>
              <Link href="/apply"
                className="flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-gray-900 hover:bg-amber-500 transition">
                <Plus size={14} /> New
              </Link>
            </div>
          </div>
        </div>

        <div className="container-shell max-w-2xl py-6">
          {applications.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                <ClipboardList size={28} className="text-gray-300" />
              </div>
              <div>
                <p className="font-bold text-gray-600">No applications yet</p>
                <p className="text-sm text-gray-400 mt-1">Apply for a course to get started.</p>
              </div>
              <Link href="/apply"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#001f6b] to-[#003f9f] px-6 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg transition">
                <Plus size={15} /> Apply for a Course <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map(app => {
                const meta = STATUS_META[app.status || 'new'];
                const StatusIcon = meta.icon;
                const slug = getCourseSlug(app.course);
                return (
                  <div key={app.id} className="rounded-xl bg-white border border-gray-200 shadow-sm p-5">
                    <div className="flex gap-4">
                      <div className={`w-1 flex-shrink-0 rounded-full ${meta.bar}`} />
                      <div className="flex-1 min-w-0">
                        <Link
                          href={slug ? `/courses/${slug}` : '/courses'}
                          className="font-bold text-[#003f9f] hover:underline text-sm"
                        >
                          {app.course} →
                        </Link>

                        <div className="flex items-center gap-1.5 mt-1.5">
                          <StatusIcon size={12} className="flex-shrink-0" />
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${meta.badge}`}>
                            {meta.label}
                          </span>
                        </div>

                        {app.note && (
                          <div className="mt-2 rounded-lg bg-yellow-50 border border-yellow-100 px-3 py-1.5 text-xs text-yellow-800">
                            <span className="font-bold">Counsellor Note:</span> {app.note}
                          </div>
                        )}

                        <div className="mt-2 flex items-center gap-1 text-[11px] text-gray-400">
                          <Clock size={10} /> Applied on {formatDate(app.createdAt)}
                        </div>
                      </div>
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
