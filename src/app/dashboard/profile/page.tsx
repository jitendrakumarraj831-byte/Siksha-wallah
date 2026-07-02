'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { studentService, StudentProfile } from '@/services/student-service';
import { saveActivity } from '@/services/activity-service';
import { type CourseApplication } from '@/services/application-service';
import { receiptNo } from '@/lib/receipt';
import { PortalShell } from '@/components/portal-shell';
import { ArrowLeft, Loader, AlertCircle, CheckCircle2, Camera, Lock } from 'lucide-react';

function getInitials(name: string): string {
  return (name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function ProfilePage() {
  const { user, isAuthenticated, loading: authLoading, refreshUserProfile } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<StudentProfile>>({});
  const [primaryApp, setPrimaryApp] = useState<CourseApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (!user) return;

    (async () => {
      try {
        const profile = await studentService.getProfile(user.uid);
        setFormData(profile ?? {
          uid: user.uid,
          email: user.email || '',
          name: user.displayName || '',
          phone: '',
          address: '',
          profileComplete: false,
        });

        // Course + Receipt Number are read-only here — they belong to the
        // application record, not the profile, and can't be changed after
        // submission. Pull the most recent active application to show them.
        const token = await user.getIdToken().catch(() => null);
        if (token) {
          const res = await fetch(`/api/student/applications?uid=${user.uid}`, {
            headers: { Authorization: `Bearer ${token}` }, cache: 'no-store',
          });
          if (res.ok) {
            const json = await res.json().catch(() => null);
            if (json?.success && Array.isArray(json.data) && json.data.length > 0) {
              const apps = json.data as CourseApplication[];
              setPrimaryApp(apps.find(a => a.status !== 'not_interested') || apps[0]);
            }
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
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
      await studentService.updateProfile(user.uid, {
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        photoURL: formData.photoURL,
      });
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
      await refreshUserProfile(user.uid).catch(() => {});
      setSuccess('Profile updated successfully. / प्रोफाइल अपडेट हो गई।');
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  async function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (photoInputRef.current) photoInputRef.current.value = '';
    if (!file || !user) return;
    setError('');
    setUploadingPhoto(true);
    try {
      const url = await studentService.uploadProfilePhoto(user.uid, file);
      setFormData(prev => ({ ...prev, photoURL: url }));
      await studentService.updateProfile(user.uid, { photoURL: url });
      await refreshUserProfile(user.uid).catch(() => {});
      setSuccess('Photo updated. / फोटो अपडेट हो गई।');
    } catch (err: any) {
      setError(err.message || 'Photo upload failed.');
    } finally {
      setUploadingPhoto(false);
    }
  }

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
          <ArrowLeft size={16} /> Back to Dashboard / डैशबोर्ड पर वापस
        </Link>

        <div className="mt-6 rounded-2xl border bg-white p-6 sm:p-8">
          <h1 className="text-2xl font-extrabold text-gray-900">
            My <span className="text-[#003f9f]">Profile</span> / मेरी प्रोफाइल
          </h1>
          <p className="mt-1 text-sm text-slate-500">You can update your photo, mobile, email and address only.</p>

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

          {/* Photo */}
          <div className="mt-6 flex items-center gap-4">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 font-headline text-2xl font-extrabold text-gray-900 shadow-md">
                {formData.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={formData.photoURL} alt="Profile" className="h-full w-full object-cover" />
                ) : getInitials(formData.name || '')}
              </div>
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="absolute -bottom-1.5 -right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#003f9f] text-white shadow-md hover:bg-blue-700 transition disabled:opacity-60"
                aria-label="Change photo"
              >
                {uploadingPhoto ? <Loader size={14} className="animate-spin" /> : <Camera size={14} />}
              </button>
              <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} disabled={uploadingPhoto} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">Profile Photo / प्रोफाइल फोटो</p>
              <p className="text-xs text-gray-400">Tap the camera icon to change</p>
            </div>
          </div>

          {/* Locked reference fields */}
          <div className="mt-6 grid gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 sm:grid-cols-3">
            <div>
              <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-gray-400"><Lock size={10} /> Name</p>
              <p className="mt-0.5 truncate text-sm font-bold text-gray-800">{formData.name || '—'}</p>
            </div>
            <div>
              <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-gray-400"><Lock size={10} /> Course</p>
              <p className="mt-0.5 truncate text-sm font-bold text-gray-800">{primaryApp?.course || '—'}</p>
            </div>
            <div>
              <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-gray-400"><Lock size={10} /> Receipt No.</p>
              <p className="mt-0.5 truncate font-mono text-sm font-bold text-gray-800">{primaryApp ? receiptNo(primaryApp.id) : '—'}</p>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-400">These fields cannot be edited after submission. Contact the office for changes.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">Mobile Number * / मोबाइल नंबर</label>
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
              <label className="mb-1.5 block text-sm font-bold text-slate-700">Email Address / ईमेल</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">Address / पता</label>
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
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#003f9f] py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? <><Loader size={16} className="animate-spin" /> Saving…</> : 'Update Profile / प्रोफाइल अपडेट करें'}
              </button>
              <Link
                href="/dashboard"
                className="flex items-center justify-center rounded-xl border-2 border-gray-200 px-6 py-3.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
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
