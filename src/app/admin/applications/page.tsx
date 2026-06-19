'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { adminService, ApplicationReview } from '@/services/admin-service';
import { Button } from '@/components/ui/button';
import { PortalShell } from '@/components/portal-shell';
import { ArrowLeft, Loader, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminApplicationsPage() {
  const { userProfile, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<ApplicationReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApp, setSelectedApp] = useState<ApplicationReview | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (!authLoading && userProfile && userProfile.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    if (authLoading) return;

    const loadApplications = async () => {
      try {
        const data = await adminService.getPendingApplications();
        setApplications(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, [authLoading, isAuthenticated, userProfile, router]);

  const handleApprove = async () => {
    if (!selectedApp) return;

    setProcessing(true);
    setError('');

    try {
      await adminService.approveApplication(selectedApp.id!, reviewNotes, 'admin');
      setApplications(applications.filter((a) => a.id !== selectedApp.id));
      setSelectedApp(null);
      setReviewNotes('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApp) return;

    setProcessing(true);
    setError('');

    try {
      await adminService.rejectApplication(selectedApp.id!, reviewNotes, 'admin');
      setApplications(applications.filter((a) => a.id !== selectedApp.id));
      setSelectedApp(null);
      setReviewNotes('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (authLoading || loading) {
    return (
      <PortalShell>
        <div className="flex min-h-screen items-center justify-center">
          <Loader className="animate-spin" size={40} />
        </div>
      </PortalShell>
    );
  }

  if (!isAuthenticated || userProfile?.role !== 'admin') {
    return null;
  }

  return (
    <PortalShell>
      <div className="container-shell py-8">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-blue-600 hover:underline">
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <h1 className="mt-8 text-3xl font-extrabold text-slate-900">Review Applications</h1>
        <p className="mt-2 text-slate-600">Manage pending enrollment requests</p>

        {error && (
          <div className="mt-6 flex gap-3 rounded-xl bg-red-50 p-4 text-red-700">
            <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Applications List */}
          <div className="lg:col-span-2">
            {applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className={`cursor-pointer rounded-xl border p-4 transition ${
                      selectedApp?.id === app.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'bg-white hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedApp(app)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900">{app.studentName}</h3>
                        <p className="text-sm text-slate-600">{app.studentEmail}</p>
                        <p className="mt-2 text-sm font-bold text-slate-700">
                          Course: {app.courseName}
                        </p>
                        <p className="text-xs text-slate-500">
                          Applied: {new Date(app.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                          app.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : app.status === 'approved'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {app.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-slate-50 p-8 text-center">
                <CheckCircle2 className="mx-auto text-green-500" size={48} />
                <p className="mt-3 text-slate-600">No pending applications</p>
              </div>
            )}
          </div>

          {/* Review Panel */}
          {selectedApp && (
            <div className="sticky top-8 rounded-xl border bg-white p-6 shadow-lg">
              <h2 className="font-bold text-slate-900">Review Application</h2>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-xs font-bold text-slate-700">Student Name</p>
                  <p className="mt-1 text-slate-600">{selectedApp.studentName}</p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-xs font-bold text-slate-700">Email</p>
                  <p className="mt-1 text-slate-600">{selectedApp.studentEmail}</p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-xs font-bold text-slate-700">Course</p>
                  <p className="mt-1 text-slate-600">{selectedApp.courseName}</p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-xs font-bold text-slate-700">Applied Date</p>
                  <p className="mt-1 text-slate-600">
                    {new Date(selectedApp.appliedAt).toLocaleString()}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <label className="block text-xs font-bold text-slate-700">Review Notes</label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Add internal notes or comments..."
                    rows={4}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="border-t pt-4 space-y-2">
                  <Button
                    onClick={handleApprove}
                    disabled={processing}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {processing ? (
                      <>
                        <Loader size={18} className="mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={18} className="mr-2" />
                        Approve
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleReject}
                    disabled={processing}
                    variant="outline"
                    className="w-full text-red-600 hover:bg-red-50"
                  >
                    {processing ? (
                      <>
                        <Loader size={18} className="mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <XCircle size={18} className="mr-2" />
                        Reject
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PortalShell>
  );
}
