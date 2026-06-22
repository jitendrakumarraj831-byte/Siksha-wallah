"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/lib/auth-service";
import { saveActivity } from "@/services/activity-service";
import {
  GraduationCap, Lock, Mail, AlertCircle, Loader, ArrowRight,
  Eye, EyeOff, BookOpen, FileCheck2, CreditCard, Bell, UserPlus,
  CheckCircle2, ShieldCheck, Info,
} from "lucide-react";

export default function StudentLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  async function handleResendVerification() {
    setResendingVerification(true);
    setVerificationSent(false);
    try {
      await authService.sendVerificationEmail();
      setVerificationSent(true);
    } catch (err: any) {
      setError(err.message || "Could not send verification email. Please try again.");
    } finally {
      setResendingVerification(false);
    }
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setEmailNotVerified(false);
    if (!email.trim() || !password.trim()) {
      setError("Please enter both your email and password to continue.");
      return;
    }
    setLoading(true);
    try {
      const user = await authService.loginStudent(email, password);
      if (user && !user.emailVerified) {
        setEmailNotVerified(true);
        setLoading(false);
        return;
      }
      saveActivity({
        type: "student_login",
        title: "Student Email Login",
        description: email,
        email,
        page: "/auth/login",
      });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Incorrect email or password. Please check and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#047857] flex items-center justify-center px-4 py-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-emerald-300 opacity-10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-teal-300 opacity-10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-4xl">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] items-center">

          {/* Left — Info */}
          <div className="text-white">
            <Link href="/" className="inline-flex items-center gap-3 mb-8">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/20 backdrop-blur">
                <GraduationCap size={24} />
              </span>
              <span className="font-headline text-xl font-extrabold">
                SIKSHA<span className="text-amber-400">WALLAH</span>
              </span>
            </Link>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
              Student Portal
            </div>

            <h1 className="font-headline text-4xl font-extrabold leading-tight mb-4">
              Welcome to Your<br />
              <span className="text-amber-400">Student Dashboard</span>
            </h1>

            <p className="text-emerald-100 leading-relaxed mb-8">
              अपनी admission application, documents और counsellor के साथ हुई हर बातचीत — सब एक सुरक्षित जगह पर देखें और track करें।
            </p>

            <div className="space-y-3">
              {[
                [BookOpen,   "Track your admission application in real time"],
                [FileCheck2, "Upload and manage your important documents securely"],
                [CreditCard, "View BSCC loan status, fee receipts and payments"],
                [Bell,       "Receive timely alerts on college deadlines and updates"],
              ].map(([Icon, text], i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-emerald-100">
                  {/* @ts-ignore */}
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <Icon size={16} className="text-amber-400" />
                  </div>
                  {text as string}
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/20 space-y-2">
              <p className="text-sm text-emerald-200">
                Are you a counsellor or office staff member?{" "}
                <Link href="/admin/login" className="font-bold text-amber-400 hover:text-amber-300 underline">
                  Counsellor Portal →
                </Link>
              </p>
              <p className="text-sm text-emerald-200">
                Don&apos;t have an account yet?{" "}
                <Link href="/auth/register" className="font-bold text-amber-400 hover:text-amber-300 underline">
                  Create a free account →
                </Link>
              </p>
            </div>
          </div>

          {/* Right — Login Card */}
          <div className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-6">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-400/20 border border-amber-400/30 px-3 py-1 text-xs font-bold text-amber-300">
                <ShieldCheck size={13} /> SECURE LOGIN
              </div>
              <h2 className="font-headline text-2xl font-extrabold text-white">Welcome Back</h2>
              <p className="mt-1 text-sm text-emerald-200">Sign in with your email and password</p>
            </div>

            {error && (
              <div className="mb-4 flex gap-3 rounded-xl bg-red-500/20 border border-red-400/40 p-4 text-sm text-red-200 backdrop-blur">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {emailNotVerified && (
              <div className="mb-4 rounded-xl border border-amber-400/40 bg-amber-500/10 p-4 text-sm text-amber-200">
                <div className="flex gap-3 items-start mb-3">
                  <Info size={18} className="flex-shrink-0 mt-0.5 text-amber-400" />
                  <div>
                    <p className="font-bold text-amber-300">Email not verified</p>
                    <p className="mt-0.5">Please verify your email address before logging in. Check your inbox for the verification link.</p>
                  </div>
                </div>
                {verificationSent ? (
                  <div className="flex items-center gap-2 rounded-lg bg-green-500/20 border border-green-400/40 px-3 py-2 text-green-200 text-xs font-semibold">
                    <CheckCircle2 size={14} /> Verification email sent! Please check your inbox.
                  </div>
                ) : (
                  <button
                    onClick={handleResendVerification}
                    disabled={resendingVerification}
                    className="flex items-center gap-2 rounded-lg bg-amber-400/20 border border-amber-400/40 px-3 py-2 text-xs font-bold text-amber-300 hover:bg-amber-400/30 transition disabled:opacity-60"
                  >
                    {resendingVerification ? <Loader size={13} className="animate-spin" /> : <Mail size={13} />}
                    {resendingVerification ? "Sending…" : "Resend Verification Email"}
                  </button>
                )}
              </div>
            )}

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label htmlFor="email-input" className="mb-1.5 block text-sm font-semibold text-emerald-100">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3.5 text-emerald-300" />
                  <input
                    id="email-input"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="yourname@email.com"
                    className="w-full rounded-xl border border-white/30 bg-white/10 pl-10 pr-4 py-3.5 text-sm text-white placeholder-emerald-300 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password-input" className="mb-1.5 block text-sm font-semibold text-emerald-100">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-emerald-300" />
                  <input
                    id="password-input"
                    type={showPass ? "text" : "password"}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-white/30 bg-white/10 pl-10 pr-12 py-3.5 text-sm text-white placeholder-emerald-300 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    aria-label={showPass ? "Hide password" : "Show password"}
                    className="absolute right-3.5 top-3.5 text-emerald-300 hover:text-white transition"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <Link href="/auth/forgot-password" className="text-sm font-semibold text-amber-300 hover:text-amber-200 hover:underline transition">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-400 py-4 font-extrabold text-gray-900 hover:bg-amber-300 transition disabled:opacity-60 active:scale-95 shadow-lg shadow-amber-500/30"
              >
                {loading ? <Loader size={18} className="animate-spin" /> : <><ArrowRight size={18} /> Sign In</>}
              </button>
            </form>

            <div className="mt-5 rounded-xl border border-white/20 bg-white/5 p-4 text-center">
              <p className="text-sm text-emerald-200">
                New to Siksha Wallah?{" "}
                <Link href="/auth/register" className="font-bold text-amber-400 hover:text-amber-300 underline">
                  <UserPlus size={13} className="inline mr-1" />Create a free account
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link href="/" className="text-sm text-emerald-300 hover:text-white transition">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
