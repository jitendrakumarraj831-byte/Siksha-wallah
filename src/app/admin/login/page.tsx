"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/lib/auth-service";
import {
  GraduationCap, Lock, Mail, AlertCircle, Loader, ShieldCheck,
  BarChart3, Users, BookOpen, ArrowRight,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }
    setLoading(true);
    try {
      const user = await authService.loginStudent(email, password);
      if (!user) throw new Error("Login failed");
      const profile = await authService.getUserProfile(user.uid);
      if (profile?.role !== "admin" && profile?.role !== "counselor") {
        await authService.logout();
        setError("Access denied. This portal is for admin/staff only. Students please use Student Login.");
        setLoading(false);
        return;
      }
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001f6b] via-[#003f9f] to-[#0060c7] flex items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-amber-400 opacity-10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-blue-300 opacity-10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-4xl">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] items-center">

          {/* Left — Info Panel */}
          <div className="text-white">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-3 mb-8">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/20 backdrop-blur">
                <GraduationCap size={24} />
              </span>
              <span className="font-headline text-xl font-extrabold">
                SIKSHA<span className="text-amber-400">WALLAH</span>
              </span>
            </Link>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
              <ShieldCheck size={15} className="text-amber-400" /> Admin & Staff Portal
            </div>

            <h1 className="font-headline text-4xl font-extrabold leading-tight mb-4">
              Office Management<br />
              <span className="text-amber-400">Dashboard</span>
            </h1>

            <p className="text-blue-100 leading-relaxed mb-8">
              Siksha Wallah का office management system। Student inquiries, applications, और analytics — सब एक जगह।
            </p>

            <div className="space-y-3">
              {[
                [BarChart3, "Live Inquiry Dashboard — Real-time student inquiries"],
                [Users, "Student Management — Applications & profiles"],
                [BookOpen, "Course & Admission Management"],
                [ShieldCheck, "Secure Role-Based Access Control"],
              ].map(([Icon, text], i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-blue-100">
                  {/* @ts-ignore */}
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <Icon size={16} className="text-amber-400" />
                  </div>
                  {text as string}
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-sm text-blue-200">
                Student हैं?{" "}
                <Link href="/auth/login" className="font-bold text-amber-400 hover:text-amber-300 underline">
                  Student Login →
                </Link>
              </p>
            </div>
          </div>

          {/* Right — Login Form */}
          <div className="rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-6">
              <h2 className="font-headline text-2xl font-extrabold text-gray-900">Admin Login</h2>
              <p className="mt-1 text-sm text-gray-500">
                Staff credentials से login करें
              </p>
            </div>

            {error && (
              <div className="mb-5 flex gap-3 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Staff Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@sikshawall.com"
                    className="w-full rounded-xl border-2 border-gray-200 pl-10 pr-4 py-3.5 text-sm outline-none focus:border-[#003f9f] transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full rounded-xl border-2 border-gray-200 pl-10 pr-4 py-3.5 text-sm outline-none focus:border-[#003f9f] transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#003f9f] py-4 font-extrabold text-white hover:bg-blue-700 transition disabled:opacity-60 active:scale-95"
              >
                {loading ? (
                  <Loader size={18} className="animate-spin" />
                ) : (
                  <><ArrowRight size={18} /> Login to Dashboard</>
                )}
              </button>
            </form>

            <div className="mt-6 rounded-xl border-2 border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-semibold text-amber-700">
                <strong>Note:</strong> This portal is for authorized Siksha Wallah staff only. Unauthorized access is prohibited. For student login, use{" "}
                <Link href="/auth/login" className="underline font-bold">Student Portal</Link>.
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
