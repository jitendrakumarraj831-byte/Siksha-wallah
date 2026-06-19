'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { adminService } from '@/services/admin-service';
import { Button } from '@/components/ui/button';
import { PortalShell } from '@/components/portal-shell';
import { ArrowLeft, Loader, Users } from 'lucide-react';
import Link from 'next/link';

export default function AdminStudentsPage() {
  const { userProfile, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (!authLoading && userProfile?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    if (authLoading) return;

    const loadStudents = async () => {
      try {
        const data = await adminService.getAllStudents();
        setStudents(data);
      } catch (error) {
        console.error('Failed to load students:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [authLoading, isAuthenticated, userProfile, router]);

  if (authLoading || loading) {
    return (
      <PortalShell>
        <div className="flex min-h-screen items-center justify-center">
          <Loader className="animate-spin" size={40} />
        </div>
      </PortalShell>
    );
  }

  return (
    <PortalShell>
      <div className="container-shell py-8">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-blue-600 hover:underline">
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <h1 className="mt-8 text-3xl font-extrabold text-slate-900">Manage Students</h1>

        <div className="mt-8 rounded-xl border bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm font-bold text-slate-600">Total Students: {students.length}</p>
            <Users size={24} className="text-blue-600" />
          </div>

          {students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-slate-700">Name</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-700">Email</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-700">Phone</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.uid} className="border-b hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{student.name}</td>
                      <td className="px-4 py-3 text-slate-600">{student.email}</td>
                      <td className="px-4 py-3 text-slate-600">{student.phone || '-'}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                          {student.profileComplete ? 'Complete' : 'Incomplete'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-slate-600">No students found</p>
          )}
        </div>
      </div>
    </PortalShell>
  );
}
