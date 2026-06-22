'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authService } from '@/lib/auth-service';
import { PortalShell } from '@/components/portal-shell';
import { Button } from '@/components/ui/button';
import { Mail, AlertCircle, CheckCircle2, Loader, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSent(false);

    if (!email.trim()) {
      setError('Please enter the email address you used while registering.');
      return;
    }

    setLoading(true);
    try {
      await authService.sendPasswordReset(email);
      setSent(true);
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'We could not send the password reset link. Please try again or contact our office.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortalShell>
      <section className="container-shell grid min-h-screen items-center gap-12 py-16 lg:grid-cols-2">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[.2em] text-[#1357e6]">Account Recovery</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
            Reset Your Password
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            अपना registered email address दर्ज करें — हम आपको password reset link भेजेंगे। कृपया अपने email का inbox (और spam folder) देखें।
          </p>
          <div className="mt-8">
            <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline">
              <ArrowLeft size={18} />
              Back to Sign In
            </Link>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-9"
        >
          <h2 className="font-display text-2xl font-extrabold">Forgot Your Password?</h2>
          <p className="mt-2 text-sm text-slate-600">No problem. We&apos;ll help you regain access to your account in just a few steps.</p>

          {error && (
            <div className="mt-4 flex gap-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {sent && (
            <div className="mt-4 flex gap-3 rounded-xl bg-green-50 p-3 text-sm text-green-700">
              <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" />
              <p>Password reset link sent successfully. Please check your email within the next 2–3 minutes.</p>
            </div>
          )}

          {!sent ? (
            <div className="mt-5 space-y-4">
              <label className="relative block">
                <Mail className="absolute left-4 top-4 text-slate-400" size={18} />
                <input
                  type="email"
                  placeholder="Your registered email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 focus:border-blue-500 focus:outline-none"
                />
              </label>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 font-bold"
              >
                {loading ? (
                  <>
                    <Loader size={18} className="mr-2 animate-spin" />
                    Sending reset link…
                  </>
                ) : (
                  'Email Me a Reset Link'
                )}
              </Button>
            </div>
          ) : (
            <div className="mt-5">
              <Button
                type="button"
                onClick={() => setSent(false)}
                variant="outline"
                className="w-full py-3.5 font-bold"
              >
                Send Another Reset Link
              </Button>
            </div>
          )}

          <p className="mt-4 text-center text-xs text-slate-500">
            Already remember your password?{' '}
            <Link href="/auth/login" className="font-bold text-blue-600 hover:underline">
              Sign in here
            </Link>
          </p>
        </form>
      </section>
    </PortalShell>
  );
}
