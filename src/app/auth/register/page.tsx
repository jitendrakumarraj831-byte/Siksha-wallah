'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/auth-service';
import { saveActivity } from '@/services/activity-service';
import { PortalShell } from '@/components/portal-shell';
import { Mail, Lock, User, Phone, AlertCircle, CheckCircle2, Loader, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!success) return;
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timer);
          router.push('/auth/login');
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [success, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter a valid email address.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter them.');
      return;
    }

    setLoading(true);
    try {
      await authService.registerStudent(
        formData.email,
        formData.password,
        formData.fullName,
        formData.phone,
      );
      saveActivity({
        type: 'registration',
        title: 'New Student Registered',
        description: `${formData.fullName} — ${formData.email}`,
        name: formData.fullName,
        mobile: formData.phone,
        email: formData.email,
        page: '/auth/register',
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Could not create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <PortalShell>
        <section className="container-shell flex min-h-[80vh] items-center justify-center py-16">
          <div className="w-full max-w-md rounded-3xl border bg-white p-10 text-center shadow-xl shadow-slate-200/60">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 size={36} className="text-green-600" />
            </div>
            <h1 className="font-headline text-2xl font-extrabold text-gray-900">Account Created!</h1>
            <p className="mt-3 text-slate-600 leading-relaxed">
              आपका account successfully बन गया है। Login page पर redirect हो रहे हैं…
            </p>
            <div className="mt-6 flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-[#003f9f] text-white font-extrabold text-2xl">
              {countdown}
            </div>
            <p className="mt-3 text-sm text-slate-400">{countdown} second{countdown !== 1 ? 's' : ''} में redirect होंगे</p>
            <Link
              href="/auth/login"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#003f9f] px-6 py-3.5 font-extrabold text-white transition hover:bg-blue-700"
            >
              अभी Login करें <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </PortalShell>
    );
  }

  return (
    <PortalShell>
      <section className="container-shell grid min-h-screen items-center gap-12 py-16 lg:grid-cols-2">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[.2em] text-[#1357e6]">Join Siksha Wallah</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl text-gray-900">
            Create Your Free <span className="text-[#003f9f]">Student Account</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Start your admission journey with personalised counsellor support. Save your applications,
            track every step and manage your admission documents from one secure place.
          </p>
          <div className="mt-8 space-y-3 text-sm font-bold">
            {[
              'Save your profile and academic details once',
              'Track every admission application in real time',
              'Receive timely counsellor follow-ups and updates',
              'Your information is kept private and secure',
            ].map((feature) => (
              <p key={feature} className="flex gap-2">
                <CheckCircle2 size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                {feature}
              </p>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-9"
        >
          <h2 className="font-display text-2xl font-extrabold">Create Your Account</h2>
          <p className="mt-2 text-sm text-slate-600">
            Takes less than a minute — register instantly, no verification required.
          </p>

          {error && (
            <div className="mt-4 flex gap-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="mt-5 space-y-4">
            <label className="relative block">
              <User className="absolute left-4 top-4 text-slate-400" size={18} />
              <input
                type="text"
                name="fullName"
                placeholder="Full Name *"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 focus:border-blue-500 focus:outline-none"
              />
            </label>

            <label className="relative block">
              <Phone className="absolute left-4 top-4 text-slate-400" size={18} />
              <input
                type="tel"
                name="phone"
                placeholder="Mobile Number *"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 focus:border-blue-500 focus:outline-none"
              />
            </label>

            <label className="relative block">
              <Mail className="absolute left-4 top-4 text-slate-400" size={18} />
              <input
                type="email"
                name="email"
                placeholder="Email Address *"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 focus:border-blue-500 focus:outline-none"
              />
            </label>

            <label className="relative block">
              <Lock className="absolute left-4 top-4 text-slate-400" size={18} />
              <input
                type="password"
                name="password"
                placeholder="Password (at least 6 characters) *"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 focus:border-blue-500 focus:outline-none"
              />
            </label>

            <label className="relative block">
              <Lock className="absolute left-4 top-4 text-slate-400" size={18} />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password *"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 focus:border-blue-500 focus:outline-none"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#003f9f] py-3.5 font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? (
                <><Loader size={18} className="animate-spin" /> Creating account…</>
              ) : (
                <>Create My Account <ArrowRight size={18} /></>
              )}
            </button>

            <p className="text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-bold text-blue-600 hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </section>
    </PortalShell>
  );
}
