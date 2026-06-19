'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { studentService, Enrollment, Notification } from '@/services/student-service';
import { Button } from '@/components/ui/button';
import { PortalShell } from '@/components/portal-shell';
import {
  BookOpen,
  FileText,
  CreditCard,
  Bell,
  User,
  LogOut,
  Loader,
  AlertCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, userProfile, isAuthenticated, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (authLoading || !user) {
      return;
    }

    const loadData = async () => {
      try {
        const [enrollmentsData, notificationsData] = await Promise.all([
          studentService.getEnrollments(user.uid),
          studentService.getNotifications(user.uid),
        ]);
        setEnrollments(enrollmentsData);
        setNotifications(notificationsData.filter((n) => !n.read).slice(0, 5));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [authLoading, isAuthenticated, user, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (authLoading || loading) {
    return (
      <PortalShell>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <Loader className="mx-auto animate-spin" size={40} />
            <p className="mt-4 text-slate-600">Loading your dashboard...</p>
          </div>
        </div>
      </PortalShell>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <PortalShell>
      <div className="container-shell py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100 p-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Welcome back, {userProfile?.name || user?.displayName}!</h1>
            <p className="mt-1 text-slate-600">Manage your courses, applications, and documents</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active Courses</p>
                <p className="mt-2 text-3xl font-extrabold text-slate-900">
                  {enrollments.filter((e) => e.status === 'active').length}
                </p>
              </div>
              <BookOpen size={40} className="text-blue-200" />
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Documents</p>
                <p className="mt-2 text-3xl font-extrabold text-slate-900">0</p>
              </div>
              <FileText size={40} className="text-green-200" />
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Pending Payments</p>
                <p className="mt-2 text-3xl font-extrabold text-slate-900">0</p>
              </div>
              <CreditCard size={40} className="text-yellow-200" />
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">New Notifications</p>
                <p className="mt-2 text-3xl font-extrabold text-slate-900">{notifications.length}</p>
              </div>
              <Bell size={40} className="text-red-200" />
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-8 flex gap-3 rounded-xl bg-red-50 p-4 text-red-700">
            <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Enrolled Courses */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border bg-white p-6">
              <h2 className="mb-4 text-xl font-extrabold text-slate-900">Your Courses</h2>
              {enrollments.length > 0 ? (
                <div className="space-y-4">
                  {enrollments.map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center justify-between rounded-xl border p-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900">{enrollment.courseName}</h3>
                        <p className="text-sm text-slate-600">
                          Progress: {enrollment.progressPercentage}%
                        </p>
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full bg-blue-600"
                            style={{ width: `${enrollment.progressPercentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="ml-4">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                            enrollment.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : enrollment.status === 'completed'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {enrollment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl bg-slate-50 p-6 text-center">
                  <BookOpen className="mx-auto text-slate-400" size={40} />
                  <p className="mt-3 text-slate-600">No active courses</p>
                  <Link href="/courses">
                    <Button className="mt-4">Browse Courses</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Notifications Sidebar */}
          <div>
            <div className="rounded-2xl border bg-white p-6">
              <h2 className="mb-4 text-xl font-extrabold text-slate-900">Recent Updates</h2>
              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`rounded-lg p-3 ${
                        notif.type === 'success'
                          ? 'bg-green-50 text-green-700'
                          : notif.type === 'warning'
                            ? 'bg-yellow-50 text-yellow-700'
                            : notif.type === 'error'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      <p className="text-sm font-bold">{notif.title}</p>
                      <p className="text-xs opacity-90">{notif.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg bg-slate-50 p-4 text-center">
                  <Bell className="mx-auto text-slate-400" size={32} />
                  <p className="mt-2 text-xs text-slate-600">No new notifications</p>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="mt-6 space-y-3">
              <Link href="/dashboard/profile">
                <Button variant="outline" className="w-full justify-start">
                  <User size={18} className="mr-2" />
                  Edit Profile
                </Button>
              </Link>
              <Link href="/courses">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen size={18} className="mr-2" />
                  Browse Courses
                </Button>
              </Link>
              <Link href="/dashboard/documents">
                <Button variant="outline" className="w-full justify-start">
                  <FileText size={18} className="mr-2" />
                  My Documents
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
