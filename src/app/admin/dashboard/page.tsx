'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { adminService, AdminStats } from '@/services/admin-service';
import { Button } from '@/components/ui/button';
import { PortalShell } from '@/components/portal-shell';
import { LogOut, Loader, AlertCircle, Users, BookOpen, DollarSign, Clock } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { user, userProfile, isAuthenticated, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (!authLoading && userProfile && userProfile.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    if (authLoading || !user) {
      return;
    }

    const loadStats = async () => {
      try {
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [authLoading, isAuthenticated, userProfile, user, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
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
        {/* Header */}
        <div className="mb-8 flex items-center justify-between rounded-2xl bg-gradient-to-r from-purple-50 to-blue-50 p-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Admin Dashboard</h1>
            <p className="mt-1 text-slate-600">Manage courses, students, and applications</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut size={18} />
            Logout
          </Button>
        </div>

        {error && (
          <div className="mb-8 flex gap-3 rounded-xl bg-red-50 p-4 text-red-700">
            <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Students</p>
                  <p className="mt-2 text-3xl font-extrabold text-slate-900">{stats.totalStudents}</p>
                </div>
                <Users size={40} className="text-blue-200" />
              </div>
            </div>

            <div className="rounded-xl border bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Enrollments</p>
                  <p className="mt-2 text-3xl font-extrabold text-slate-900">
                    {stats.totalEnrollments}
                  </p>
                </div>
                <BookOpen size={40} className="text-green-200" />
              </div>
            </div>

            <div className="rounded-xl border bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Revenue</p>
                  <p className="mt-2 text-3xl font-extrabold text-slate-900">
                    ₹{(stats.totalRevenue / 100000).toFixed(1)}L
                  </p>
                </div>
                <DollarSign size={40} className="text-yellow-200" />
              </div>
            </div>

            <div className="rounded-xl border bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Pending Applications</p>
                  <p className="mt-2 text-3xl font-extrabold text-slate-900">
                    {stats.pendingApplications}
                  </p>
                </div>
                <Clock size={40} className="text-red-200" />
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/admin/applications">
            <div className="cursor-pointer rounded-xl border bg-white p-6 transition hover:shadow-lg">
              <Clock className="text-blue-600" size={32} />
              <h3 className="mt-3 font-bold text-slate-900">Review Applications</h3>
              <p className="mt-1 text-sm text-slate-600">
                Manage pending enrollment requests
              </p>
              <Button className="mt-4 w-full">View Applications</Button>
            </div>
          </Link>

          <Link href="/admin/students">
            <div className="cursor-pointer rounded-xl border bg-white p-6 transition hover:shadow-lg">
              <Users className="text-green-600" size={32} />
              <h3 className="mt-3 font-bold text-slate-900">Manage Students</h3>
              <p className="mt-1 text-sm text-slate-600">View and manage student profiles</p>
              <Button className="mt-4 w-full">Manage Students</Button>
            </div>
          </Link>

          <Link href="/admin/courses">
            <div className="cursor-pointer rounded-xl border bg-white p-6 transition hover:shadow-lg">
              <BookOpen className="text-purple-600" size={32} />
              <h3 className="mt-3 font-bold text-slate-900">Manage Courses</h3>
              <p className="mt-1 text-sm text-slate-600">Add, edit, or delete courses</p>
              <Button className="mt-4 w-full">Manage Courses</Button>
            </div>
          </Link>

          <Link href="/admin/payments">
            <div className="cursor-pointer rounded-xl border bg-white p-6 transition hover:shadow-lg">
              <DollarSign className="text-yellow-600" size={32} />
              <h3 className="mt-3 font-bold text-slate-900">Payment Reports</h3>
              <p className="mt-1 text-sm text-slate-600">Track revenue and transactions</p>
              <Button className="mt-4 w-full">View Reports</Button>
            </div>
          </Link>

          <Link href="/admin/communications">
            <div className="cursor-pointer rounded-xl border bg-white p-6 transition hover:shadow-lg">
              <AlertCircle className="text-red-600" size={32} />
              <h3 className="mt-3 font-bold text-slate-900">Send Notifications</h3>
              <p className="mt-1 text-sm text-slate-600">Email and SMS campaigns</p>
              <Button className="mt-4 w-full">Send Messages</Button>
            </div>
          </Link>

          <Link href="/admin/analytics">
            <div className="cursor-pointer rounded-xl border bg-white p-6 transition hover:shadow-lg">
              <Loader className="text-indigo-600" size={32} />
              <h3 className="mt-3 font-bold text-slate-900">Analytics</h3>
              <p className="mt-1 text-sm text-slate-600">View dashboards and reports</p>
              <Button className="mt-4 w-full">View Analytics</Button>
            </div>
          </Link>
        </div>
      </div>
    </PortalShell>
  );
}
