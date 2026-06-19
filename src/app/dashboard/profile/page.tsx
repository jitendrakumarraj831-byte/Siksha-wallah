'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { studentService, StudentProfile } from '@/services/student-service';
import { Button } from '@/components/ui/button';
import { PortalShell } from '@/components/portal-shell';
import { ArrowLeft, Loader, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
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

    const loadProfile = async () => {
      try {
        let profileData = await studentService.getProfile(user.uid);
        if (!profileData) {
          profileData = {
            uid: user.uid,
            email: user.email || '',
            name: user.displayName || '',
            phone: '',
            profileComplete: false,
            updatedAt: Date.now(),
          };
        }
        setProfile(profileData);
        setFormData(profileData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [authLoading, isAuthenticated, user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user) return;

    setSaving(true);
    try {
      await studentService.updateProfile(user.uid, {
        ...formData,
        profileComplete: true,
      });
      setSuccess('Profile updated successfully!');
      setProfile(formData as StudentProfile);
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
          <Loader className="animate-spin" size={40} />
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
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-blue-600 hover:underline">
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="mt-8 max-w-2xl rounded-2xl border bg-white p-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Edit Profile</h1>
          <p className="mt-2 text-slate-600">Update your personal information</p>

          {error && (
            <div className="mt-6 flex gap-3 rounded-xl bg-red-50 p-4 text-red-700">
              <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-6 flex gap-3 rounded-xl bg-green-50 p-4 text-green-700">
              <CheckCircle2 size={20} className="mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-slate-700">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Email (readonly) */}
            <div>
              <label className="block text-sm font-bold text-slate-700">Email</label>
              <input
                type="email"
                value={formData.email || ''}
                disabled
                className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-bold text-slate-700">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Father Name */}
            <div>
              <label className="block text-sm font-bold text-slate-700">Father&apos;s Name</label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName || ''}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Mother Name */}
            <div>
              <label className="block text-sm font-bold text-slate-700">Mother&apos;s Name</label>
              <input
                type="text"
                name="motherName"
                value={formData.motherName || ''}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-bold text-slate-700">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth || ''}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-bold text-slate-700">Address</label>
              <textarea
                name="address"
                value={formData.address || ''}
                onChange={handleChange}
                rows={3}
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* City State Pincode */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-bold text-slate-700">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city || ''}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state || ''}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode || ''}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? (
                  <>
                    <Loader size={18} className="mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
              <Link href="/dashboard" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </PortalShell>
  );
}
