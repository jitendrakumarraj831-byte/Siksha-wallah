"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authService } from "@/lib/auth-service";
import { saveActivity } from "@/services/activity-service";
import {
  GraduationCap, Lock, Mail, AlertCircle, Loader, ArrowRight,
  Eye, EyeOff,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please enter both your email and password.");
      return;
    }
    setLoading(true);
    try {
      const user = await authService.loginStudent(email, password);
      if (!user) {
        setError("Incorrect Email or Password.");
        setLoading(false);
        return;
      }
      saveActivity({
        type: "student_login",
        title: "Student Login",
        description: email,
        email,
        page: "/auth/login",
      });
      router.push(redirect);
    } catch {
      setError("Incorrect Email or Password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00102e] via-[#001850] to-[#003590] flex items-center justify-center px-4 py-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-amber-300 opacity-10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-blue-300 opacity-10 blur-3xl" />
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

            <p className="text-blue-100 leading-relaxed mb-8">
              Track your admission applications, upload documents and stay in touch with your counsellor — all in one secure place.
            </p>

            <div className="mt-8 pt-6 border-t border-white/20 space-y-2">
              <p className="text-sm text-blue-200">
                Are you a counsellor or office staff?{" "}
                <Link href="/admin/login" className="font-bold text-amber-400 hover:text-amber-300 underline">
                  Office Portal →
                </Link>
              </p>
              <p className="text-sm text-blue-200">
                Don&apos;t have an account?{" "}
                <Link href="/auth/register" className="font-bold text-amber-400 hover:text-amber-300 underline">
                  Register free →
                </Link>
              </p>
            </div>
          </div>

          {/* Right — Login Card */}
          <div className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-6">
              <h2 className="font-headline text-2xl font-extrabold text-white">Sign In</h2>
              <p className="mt-1 text-sm text-blue-200">Enter your email and password to continue</p>
            </div>

            {error && (
              <div className="mb-4 flex gap-3 rounded-xl bg-red-500/20 border border-red-400/40 p-4 text-sm text-red-200 backdrop-blur">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-blue-100">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3.5 text-blue-300" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="yourname@email.com"
                    className="w-full rounded-xl border border-white/30 bg-white/10 pl-10 pr-4 py-3.5 text-sm text-white placeholder-blue-300 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-blue-100">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-blue-300" />
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-white/30 bg-white/10 pl-10 pr-12 py-3.5 text-sm text-white placeholder-blue-300 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    aria-label={showPass ? "Hide password" : "Show password"}
                    className="absolute right-3.5 top-3.5 text-blue-300 hover:text-white transition"
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

          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudentLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#00102e]" />}>
      <LoginForm />
    </Suspense>
  );
}
