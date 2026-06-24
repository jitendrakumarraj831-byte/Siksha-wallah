'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { studentService, StudentProfile } from '@/services/student-service';
import { saveActivity } from '@/services/activity-service';
import { PortalShell } from '@/components/portal-shell';
import { ArrowLeft, Loader, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<StudentProfile>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (!user) return;

    studentService.getProfile(user.uid)
      .then(profile => {
        setFormData(profile ?? {
          uid: user.uid,
          email: user.email || '',
          name: user.displayName || '',
          phone: '',
          qualification: '',
          address: '',
          profileComplete: false,
        });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [authLoading, isAuthenticated, user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!user) return;

    setSaving(true);
    try {
      await studentService.updateProfile(user.uid, formData);
      saveActivity({
        type: 'profile_update',
        title: 'Profile Updated',
        description: `${formData.name || user.email} updated profile`,
        name: formData.name || undefined,
        email: formData.email || user.email || undefined,
        mobile: formData.phone || undefined,
        userId: user.uid,
        page: '/dashboard/profile',
      }).catch(() => {});
      // Redirect to dashboard after 1.5s so student sees 100% completion
      setSuccess('Profile updated successfully.');
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
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

  return (
    <PortalShell>
      <div className="container-shell max-w-2xl py-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="mt-6 rounded-2xl border bg-white p-8">
          <h1 className="text-2xl font-extrabold text-gray-900">
            My <span className="text-[#003f9f]">Profile</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500">Keep your details up to date so your counsellor can guide you better.</p>

          {error && (
            <div className="mt-5 flex gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div className="mt-5 flex gap-3 rounded-xl bg-green-50 p-4 text-sm text-green-700">
              <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" />
              <p>{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">Mobile Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">Email Address</label>
              <input
                type="email"
                value={formData.email || ''}
                disabled
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">Highest Qualification</label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification || ''}
                onChange={handleChange}
                placeholder="e.g. 12th Pass, Graduation"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">Address</label>
              <textarea
                name="address"
                value={formData.address || ''}
                onChange={handleChange}
                rows={3}
                placeholder="Village / Town, District, State"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#003f9f] py-3 font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? <><Loader size={16} className="animate-spin" /> Saving…</> : 'Update Profile'}
              </button>
              <Link
                href="/dashboard"
                className="flex items-center justify-center rounded-xl border-2 border-gray-200 px-6 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </PortalShell>
  );
}
