'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/auth-service';
import { PortalShell } from '@/components/portal-shell';
import { Button } from '@/components/ui/button';
import { Lock, AlertCircle, CheckCircle2, Loader, Eye, EyeOff, ArrowLeft } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get('oobCode') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!oobCode) {
      setError('This reset link is invalid or has already been used. Please request a new one.');
    }
  }, [oobCode]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirm) {
      setError('The two passwords do not match. Please re-enter them.');
      return;
    }
    setLoading(true);
    try {
      await authService.confirmPasswordReset(oobCode, password);
      setDone(true);
      setTimeout(() => router.push('/auth/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Could not reset your password. The link may have expired — please request a new one.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PortalShell>
      <section className="container-shell grid min-h-screen items-center gap-12 py-16 lg:grid-cols-2">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[.2em] text-[#1357e6]">Account Recovery</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
            Set New Password
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Choose a strong password to protect your Siksha Wallah account. You will be signed in automatically after resetting.
          </p>
          <div className="mt-8">
            <Link href="/auth/forgot-password" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline">
              <ArrowLeft size={18} />
              Back to Forgot Password
            </Link>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-9"
        >
          <h2 className="font-display text-2xl font-extrabold">Create a New Password</h2>
          <p className="mt-2 text-sm text-slate-600">Enter your new password below. Use at least 6 characters.</p>

          {error && (
            <div className="mt-4 flex gap-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {done ? (
            <div className="mt-6 flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 size={36} className="text-green-600" />
              </div>
              <div>
                <p className="font-extrabold text-green-700 text-lg">Password reset successful!</p>
                <p className="text-sm text-slate-600 mt-1">Redirecting you to the login page…</p>
              </div>
              <Link href="/auth/login" className="mt-2 font-bold text-blue-600 hover:underline text-sm">
                Go to Sign In →
              </Link>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              <label className="relative block">
                <Lock className="absolute left-4 top-4 text-slate-400" size={18} />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="New password (min. 6 characters)"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  disabled={!oobCode}
                  className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-12 focus:border-blue-500 focus:outline-none disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </label>

              <label className="relative block">
                <Lock className="absolute left-4 top-4 text-slate-400" size={18} />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  disabled={!oobCode}
                  className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 focus:border-blue-500 focus:outline-none disabled:opacity-50"
                />
              </label>

              <Button
                type="submit"
                disabled={loading || !oobCode}
                className="w-full py-3.5 font-bold"
              >
                {loading ? (
                  <>
                    <Loader size={18} className="mr-2 animate-spin" />
                    Resetting password…
                  </>
                ) : (
                  'Reset My Password'
                )}
              </Button>

              <p className="text-center text-xs text-slate-500">
                Need a new link?{' '}
                <Link href="/auth/forgot-password" className="font-bold text-blue-600 hover:underline">
                  Request again
                </Link>
              </p>
            </div>
          )}
        </form>
      </section>
    </PortalShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="animate-spin text-blue-600" size={36} />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
