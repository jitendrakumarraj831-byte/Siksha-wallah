'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/auth-service';
import { PortalShell } from '@/components/portal-shell';
import { Button } from '@/components/ui/button';
import { Mail, Lock, AlertCircle, CheckCircle2, Loader, ShieldCheck, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    try {
      await authService.loginStudent(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortalShell>
      <section className="container-shell grid min-h-screen items-center gap-12 py-16 lg:grid-cols-2">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[.2em] text-[#1357e6]">Student access</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">
            Your education journey, organised
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Track applications, documents, payments, counselling sessions, classes and notices securely in one
            dashboard.
          </p>
          <div className="mt-8 space-y-3 text-sm font-bold">
            {['Secure student profile', 'Live application tracking', 'Documents and payment receipts', 'Classes, notes and notifications'].map((feature) => (
              <p key={feature} className="flex gap-2">
                <ShieldCheck size={18} className="text-emerald-500" />
                {feature}
              </p>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-9"
        >
          <h2 className="font-display text-2xl font-extrabold">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-600">Login to access your student portal</p>

          {error && (
            <div className="mt-4 flex gap-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="mt-5 space-y-4">
            <label className="relative block">
              <Mail className="absolute left-4 top-4 text-slate-400" size={18} />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 focus:border-blue-500 focus:outline-none"
              />
            </label>

            <label className="relative block">
              <Lock className="absolute left-4 top-4 text-slate-400" size={18} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 focus:border-blue-500 focus:outline-none"
              />
            </label>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-300" />
                <span className="text-slate-600">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="font-bold text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 font-bold"
            >
              {loading ? (
                <>
                  <Loader size={18} className="mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Login
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </Button>

            <p className="text-center text-sm text-slate-600">
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className="font-bold text-blue-600 hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </form>
      </section>
    </PortalShell>
  );
}
