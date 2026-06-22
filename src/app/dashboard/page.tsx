'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { getApplicationsByUser, type CourseApplication, type ApplicationStatus } from '@/services/application-service';
import { PortalShell } from '@/components/portal-shell';
import {
  BookOpen, FileText, Bell, User, LogOut, Loader,
  AlertCircle, CheckCircle2, Clock, Phone, MessageCircle,
  ClipboardList, ArrowRight, Plus, Mail, ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

const STATUS_META: Record<ApplicationStatus, { label: string; color: string; icon: string }> = {
  new:               { label: "Application Received",   color: "bg-blue-100 text-blue-700",     icon: "•" },
  contacted:         { label: "Counsellor Connected",   color: "bg-yellow-100 text-yellow-700", icon: "•" },
  documents_pending: { label: "Documents Required",     color: "bg-orange-100 text-orange-700", icon: "•" },
  admission_done:    { label: "Admission Confirmed",    color: "bg-green-100 text-green-700",   icon: "•" },
  not_interested:    { label: "Application Closed",     color: "bg-gray-100 text-gray-600",     icon: "•" },
};

function timeAgo(ts: any): string {
  const d = ts?.toDate ? ts.toDate() : ts ? new Date(ts) : null;
  if (!d) return "";
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function DashboardPage() {
  const { user, userProfile, isAuthenticated, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<CourseApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sendingVerification, setSendingVerification] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (authLoading || !user) return;

    getApplicationsByUser(user.uid)
      .then(data => { setApplications(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [authLoading, isAuthenticated, user, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleSendVerification = async () => {
    setSendingVerification(true);
    setVerificationSent(false);
    try {
      const { authService } = await import('@/lib/auth-service');
      await authService.sendVerificationEmail();
      setVerificationSent(true);
    } catch {
      // silently ignore — user can try again
    } finally {
      setSendingVerification(false);
    }
  };

  if (authLoading || loading) {
    return (
      <PortalShell>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <Loader className="mx-auto animate-spin text-[#003f9f]" size={40} />
            <p className="mt-4 text-slate-600">Preparing your personal dashboard…</p>
          </div>
        </div>
      </PortalShell>
    );
  }

  if (!isAuthenticated) return null;

  const name = userProfile?.name || user?.displayName || "Student";
  const pending = applications.filter(a => a.status === "new" || !a.status).length;
  const done = applications.filter(a => a.status === "admission_done").length;

  return (
    <PortalShell>
      <div className="container-shell py-8">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#001f6b] to-[#003f9f] p-6 text-white">
          <div>
            <p className="text-blue-200 text-sm font-semibold mb-1">Your Student Dashboard</p>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">Welcome back, {name}</h1>
            <p className="mt-1 text-blue-200 text-sm">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border-2 border-white/30 px-4 py-2 text-sm font-bold text-white hover:bg-white/10 transition"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        {/* Email verification banner */}
        {user && !user.emailVerified && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-amber-200 bg-amber-50 px-5 py-4">
            <div className="flex items-start gap-3">
              <Mail size={20} className="mt-0.5 flex-shrink-0 text-amber-600" />
              <div>
                <p className="font-bold text-amber-800">Email not verified</p>
                <p className="text-sm text-amber-700">Please verify your email address to secure your account. Check your inbox for the verification link.</p>
              </div>
            </div>
            <div className="flex flex-shrink-0 items-center gap-3">
              {verificationSent ? (
                <span className="flex items-center gap-1.5 text-sm font-semibold text-green-700">
                  <CheckCircle2 size={15} /> Email sent!
                </span>
              ) : (
                <button
                  onClick={handleSendVerification}
                  disabled={sendingVerification}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-white hover:bg-amber-600 transition disabled:opacity-60"
                >
                  {sendingVerification ? <Loader size={14} className="animate-spin" /> : <Mail size={14} />}
                  {sendingVerification ? "Sending…" : "Resend Verification Email"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Email verified badge */}
        {user?.emailVerified && (
          <div className="mb-6 flex items-center gap-2 rounded-2xl border-2 border-green-100 bg-green-50 px-5 py-3 text-sm font-semibold text-green-700">
            <ShieldCheck size={17} className="text-green-600" /> Email verified — your account is secure
          </div>
        )}

        {/* Quick stats */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total Applications",    value: applications.length, icon: ClipboardList, color: "text-[#003f9f]", bg: "bg-blue-50" },
            { label: "Awaiting Counsellor",   value: pending,              icon: Clock,          color: "text-yellow-700", bg: "bg-yellow-50" },
            { label: "Admissions Confirmed",  value: done,                 icon: CheckCircle2,   color: "text-green-700", bg: "bg-green-50" },
            { label: "Profile Status",        value: userProfile?.profileComplete ? "Complete" : "Setup Now", icon: User, color: "text-purple-700", bg: "bg-purple-50" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className={`rounded-2xl border-2 border-gray-100 ${bg} p-4`}>
              <Icon size={22} className={`${color} mb-2`} />
              <p className={`font-headline text-2xl font-extrabold ${color}`}>{value}</p>
              <p className="text-xs font-semibold text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* My Applications */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline text-xl font-extrabold text-gray-900">My Admission Applications</h2>
            <Link
              href="/apply"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#dc143c] px-4 py-2 text-sm font-bold text-white hover:bg-red-700 transition"
            >
              <Plus size={15} /> Start New Application
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 py-14 text-center">
              <ClipboardList size={44} className="mx-auto text-gray-300 mb-4" />
              <p className="font-semibold text-gray-500 text-lg">You haven&apos;t submitted any applications yet.</p>
              <p className="text-sm text-gray-400 mt-1 mb-5">किसी भी course के लिए apply करें — हमारा counsellor 30 मिनट के भीतर आपसे संपर्क करेगा।</p>
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
                const meta = STATUS_META[app.status || "new"];
                return (
                  <div key={app.id} className="rounded-2xl border-2 border-gray-100 bg-white p-5 hover:border-blue-100 transition">
                    <div className="flex items-start justify-between gap-4">
                      {/* Left */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-sm font-extrabold text-[#003f9f]">
                            {app.course}
                          </span>
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${meta.color}`}>
                            {meta.icon} {meta.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1.5">
                          {app.qualification && <span>Qualification: {app.qualification}</span>}
                          {app.district && <span>District: {app.district}</span>}
                          {app.bsccRequired && <span className="text-amber-600 font-semibold">BSCC loan requested</span>}
                        </div>
                        {/* Status message */}
                        <div className={`mt-3 rounded-xl px-3 py-2 text-xs font-semibold ${meta.color}`}>
                          {app.status === "new" || !app.status
                            ? "Your application has been received. A counsellor will be in touch with you shortly."
                            : app.status === "contacted"
                            ? "Your counsellor has reached out — next steps will be shared soon."
                            : app.status === "documents_pending"
                            ? "Please upload the documents requested by your counsellor to move ahead."
                            : app.status === "admission_done"
                            ? "Congratulations! Your admission has been confirmed."
                            : "This application has been closed. You can always start a new one whenever you're ready."
                          }
                        </div>
                        {app.note && (
                          <div className="mt-2 rounded-lg bg-yellow-50 border border-yellow-100 px-3 py-1.5 text-xs text-yellow-800">
                            <span className="font-bold">Counsellor&apos;s Note:</span> {app.note}
                          </div>
                        )}
                      </div>
                      {/* Right */}
                      <div className="flex-shrink-0 text-right">
                        <p className="text-xs text-gray-400">{timeAgo(app.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Help & Contact */}
        <div className="rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-100 p-6">
          <h3 className="font-headline text-lg font-extrabold text-gray-900 mb-1">Need help with your admission?</h3>
          <p className="text-sm text-gray-600 mb-4">Speak directly with an experienced counsellor — free and confidential.</p>
          <div className="flex flex-wrap gap-3">
            <a href="tel:+916203138576" className="inline-flex items-center gap-2 rounded-xl bg-[#003f9f] px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700">
              <Phone size={15} /> Call +91 6203138576
            </a>
            <a
              href="https://wa.me/916203138576?text=नमस्ते!%20मैं%20Siksha%20Wallah%20Student%20Dashboard%20से%20बात%20कर%20रहा/रही%20हूँ।%20Mujhe%20admission%20guidance%20chahiye।"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-green-600"
            >
              <MessageCircle size={15} fill="currentColor" /> Chat on WhatsApp
            </a>
            <Link href="/courses" className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-700 hover:border-gray-300">
              <BookOpen size={15} /> Browse All Courses
            </Link>
          </div>
        </div>

        {/* Quick links */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Link href="/apply" className="flex items-center gap-3 rounded-2xl border-2 border-gray-100 bg-white p-4 hover:border-[#003f9f] transition group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 group-hover:bg-[#dc143c] transition">
              <Plus size={20} className="text-[#dc143c] group-hover:text-white transition" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">New Application</p>
              <p className="text-xs text-gray-400">Apply for another course</p>
            </div>
          </Link>
          <Link href="/courses" className="flex items-center gap-3 rounded-2xl border-2 border-gray-100 bg-white p-4 hover:border-[#003f9f] transition group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 group-hover:bg-[#003f9f] transition">
              <BookOpen size={20} className="text-[#003f9f] group-hover:text-white transition" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Explore Courses</p>
              <p className="text-xs text-gray-400">View all available programmes</p>
            </div>
          </Link>
          <Link href="/student-credit-card" className="flex items-center gap-3 rounded-2xl border-2 border-gray-100 bg-white p-4 hover:border-[#003f9f] transition group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 group-hover:bg-amber-500 transition">
              <FileText size={20} className="text-amber-600 group-hover:text-white transition" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">BSCC Loan</p>
              <p className="text-xs text-gray-400">Check your loan eligibility</p>
            </div>
          </Link>
        </div>

      </div>
    </PortalShell>
  );
}
