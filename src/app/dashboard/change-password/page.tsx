'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { PortalShell } from '@/components/portal-shell';
import { auth } from '@/lib/firebase';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { ArrowLeft, Loader, AlertCircle, CheckCircle2, Lock } from 'lucide-react';

export default function ChangePasswordPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (authLoading) {
    return (
      <PortalShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader className="animate-spin text-blue-600" size={36} />
        </div>
      </PortalShell>
    );
  }

  if (!isAuthenticated) {
    router.push('/auth/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!auth?.currentUser || !user?.email) {
      setError('Authentication error. Please log in again.');
      return;
    }

    setLoading(true);
    try {
      // Re-authenticate first
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      // Update password
      await updatePassword(auth.currentUser, newPassword);
      setSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (e: any) {
      if (e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
        setError('Current password is incorrect.');
      } else if (e.code === 'auth/weak-password') {
        setError('New password is too weak. Use at least 8 characters.');
      } else {
        setError(e.message || 'Failed to change password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortalShell>
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="bg-gradient-to-br from-[#00102e] via-[#001f6b] to-[#003f9f] px-4 py-8">
          <div className="container-shell max-w-xl">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-blue-300 hover:text-white text-sm font-semibold mb-4">
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Lock size={22} /> Change Password
            </h1>
            <p className="text-blue-300 text-sm mt-1">Keep your account secure with a strong password.</p>
          </div>
        </div>

        <div className="container-shell max-w-xl py-6">
          <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
            {error && (
              <div className="mb-5 flex gap-3 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" /> {error}
              </div>
            )}
            {success && (
              <div className="mb-5 flex gap-3 rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-700">
                <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" /> {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-1.5 text-sm font-bold text-gray-700">Current Password *</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  required
                  placeholder="Enter your current password"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-sm font-bold text-gray-700">New Password *</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-sm font-bold text-gray-700">Confirm New Password *</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Repeat new password"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#003f9f] py-3 text-sm font-bold text-white hover:bg-blue-700 transition disabled:opacity-60"
              >
                {loading ? <><Loader size={16} className="animate-spin" /> Updating…</> : 'Change Password'}
              </button>
            </form>
          </div>

          <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-500">
            <p className="font-semibold text-gray-700 mb-1">Password Requirements:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>At least 8 characters long</li>
              <li>Mix of letters, numbers and symbols recommended</li>
              <li>Do not share your password with anyone</li>
            </ul>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
