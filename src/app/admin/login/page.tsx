"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap, Lock, User, AlertCircle, Loader, ShieldCheck,
  BarChart3, Users, BookOpen, ArrowRight, Eye, EyeOff,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Please enter both your username and password to sign in.");
      return;
    }
    setLoading(true);
    try {
      // Credentials are validated server-side; the server sets a signed,
      // httpOnly session cookie that the middleware verifies.
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        // Display name only — not used for authorization (the httpOnly cookie is).
        localStorage.setItem("sw_admin_session", "1");
        localStorage.setItem("sw_admin_user", data.user || username.trim());
        router.push("/admin/dashboard");
      } else if (res.status === 429) {
        setError("For your security, sign-in has been paused for a few minutes. Please try again shortly.");
      } else {
        setError(data.error || "Those credentials don't seem to match. Please double-check, or contact the office for assistance.");
      }
    } catch {
      setError("We couldn't sign you in just now. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001f6b] via-[#003f9f] to-[#0060c7] flex items-center justify-center px-4 py-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-amber-400 opacity-10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-blue-300 opacity-10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-4xl">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] items-center">

          {/* Left — Info Panel */}
          <div className="text-white">
            <Link href="/" className="inline-flex items-center gap-3 mb-8">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/20 backdrop-blur">
                <GraduationCap size={24} aria-hidden="true" />
              </span>
              <span className="font-headline text-xl font-extrabold">
                SIKSHA<span className="text-amber-400">WALLAH</span>
              </span>
            </Link>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
              <ShieldCheck size={15} className="text-amber-400" aria-hidden="true" /> Counsellor & Office Portal
            </div>

            <h1 className="font-headline text-4xl font-extrabold leading-tight mb-4">
              Counsellor Sign-In<br />
              <span className="text-amber-400">Office Workspace</span>
            </h1>

            <p className="text-blue-100 leading-relaxed mb-8">
              The Siksha Wallah counselling workspace — review enquiries, follow up with families and manage admissions, all in one place.
            </p>

            <div className="space-y-3">
              {[
                [BarChart3, "View live student enquiries as they come in"],
                [Users, "Manage student profiles and admission applications"],
                [BookOpen, "Update course information and admission progress"],
                [ShieldCheck, "Secure access with role-based permissions"],
              ].map(([Icon, text], i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-blue-100">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/10" aria-hidden="true">
                    <Icon size={16} className="text-amber-400" />
                  </div>
                  {text as string}
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/20 space-y-2">
              <p className="text-sm text-blue-200">
                Are you a student?{" "}
                <Link href="/auth/login" className="font-bold text-amber-400 hover:text-amber-300 underline">
                  Sign in to your Student Dashboard →
                </Link>
              </p>
            </div>
          </div>

          {/* Right — Login Form */}
          <div className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-6">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-400/20 border border-amber-400/30 px-3 py-1 text-xs font-bold text-amber-300">
                <ShieldCheck size={12} aria-hidden="true" /> COUNSELLOR PORTAL
              </div>
              <h2 className="font-headline text-2xl font-extrabold text-white">Counsellor Sign-In</h2>
              <p className="mt-1 text-sm text-blue-200">
                Please use the credentials provided by the Siksha Wallah office.
              </p>
            </div>

            {error && (
              <div className="mb-5 flex gap-3 rounded-xl bg-red-500/20 border border-red-400/40 p-4 text-sm text-red-200 backdrop-blur" role="alert">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="admin-username" className="mb-1.5 block text-sm font-semibold text-blue-100">
                  Username
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-3.5 text-blue-300" aria-hidden="true" />
                  <input
                    id="admin-username"
                    type="text"
                    required
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full rounded-xl border border-white/30 bg-white/10 pl-10 pr-4 py-3.5 text-sm text-white placeholder-blue-300 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="admin-password" className="mb-1.5 block text-sm font-semibold text-blue-100">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-blue-300" aria-hidden="true" />
                  <input
                    id="admin-password"
                    type={showPass ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full rounded-xl border border-white/30 bg-white/10 pl-10 pr-12 py-3.5 text-sm text-white placeholder-blue-300 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition"
                  />
                  <button
                    type="button"
                    aria-label={showPass ? "Hide password" : "Show password"}
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-3.5 text-blue-300 hover:text-white transition"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-400 py-4 font-extrabold text-gray-900 hover:bg-amber-300 transition disabled:opacity-60 active:scale-95 shadow-lg shadow-amber-500/30"
              >
                {loading ? (
                  <Loader size={18} className="animate-spin" aria-label="Signing in…" />
                ) : (
                  <><ArrowRight size={18} aria-hidden="true" /> Sign In to Workspace</>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-blue-300 hover:text-white transition">
                ← Back to Home
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
