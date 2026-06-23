'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/auth-service';
import { saveActivity } from '@/services/activity-service';
import { PortalShell } from '@/components/portal-shell';
import { Button } from '@/components/ui/button';
import { Mail, Lock, User, Phone, AlertCircle, CheckCircle2, Loader } from 'lucide-react';

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
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.fullName.trim()) {
      setError('Please enter your full name to continue.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter a valid email address.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('The two passwords do not match. Please re-enter them.');
      return;
    }
    if (formData.password.length < 6) {
      setError('For your security, please use a password of at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await authService.registerStudent(
        formData.email,
        formData.password,
        formData.fullName,
        formData.phone
      );
      saveActivity({
        type: "registration",
        title: "👤 New Student Registered",
        description: `${formData.fullName} — ${formData.email}`,
        name: formData.fullName,
        mobile: formData.phone,
        email: formData.email,
        page: "/auth/register",
      });
      // Send email verification
      try { await authService.sendVerificationEmail(); } catch { /* non-fatal */ }
      setSuccess('Account created! A verification email has been sent to your address. Please verify your email, then sign in.');
      setTimeout(() => router.push('/auth/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'We were unable to create your account. Please try again or contact our team.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortalShell>
      <section className="container-shell grid min-h-screen items-center gap-12 py-16 lg:grid-cols-2">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[.2em] text-[#1357e6]">Join Siksha Wallah</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl text-gray-900">
            Create Your Free <span className="text-[#003f9f]">Student Account</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Start your admission journey with personalised counsellor support. Save your applications, track every step
            and manage all your admission documents from one secure place.
          </p>
          <div className="mt-8 space-y-3 text-sm font-bold">
            {[
              'Save your profile and academic details once',
              'Track every admission application in real time',
              'Receive timely counsellor follow-ups and updates',
              'Your information is kept private and secure',
            ].map(
              (feature) => (
                <p key={feature} className="flex gap-2">
                  <CheckCircle2 size={18} className="text-green-500" />
                  {feature}
                </p>
              )
            )}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-9"
        >
          <h2 className="font-display text-2xl font-extrabold">Create Your Account</h2>
          <p className="mt-2 text-sm text-slate-600">Takes less than a minute — and your counsellor will reach out to help you with the next steps.</p>

          {error && (
            <div className="mt-4 flex gap-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-4 flex gap-3 rounded-xl bg-green-50 p-3 text-sm text-green-700">
              <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" />
              <p>{success}</p>
            </div>
          )}

          <div className="mt-5 space-y-4">
            <label className="relative block">
              <User className="absolute left-4 top-4 text-slate-400" size={18} />
              <input
                type="text"
                name="fullName"
                placeholder="Student's full name"
                value={formData.fullName}
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
                placeholder="Email address"
                value={formData.email}
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
                placeholder="Mobile number (optional, recommended)"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 focus:border-blue-500 focus:outline-none"
              />
            </label>

            <label className="relative block">
              <Lock className="absolute left-4 top-4 text-slate-400" size={18} />
              <input
                type="password"
                name="password"
                placeholder="Create a password (at least 6 characters)"
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
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
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
                  Setting up your account…
                </>
              ) : (
                'Create My Free Account'
              )}
            </Button>

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
