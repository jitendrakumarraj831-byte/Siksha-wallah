"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/lib/auth-service";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, ConfirmationResult } from "firebase/auth";
import { saveActivity } from "@/services/activity-service";
import {
  GraduationCap, Lock, Mail, AlertCircle, Loader, ArrowRight,
  Eye, EyeOff, BookOpen, FileCheck2, CreditCard, Bell, UserPlus,
  Phone, ShieldCheck, CheckCircle2,
} from "lucide-react";

type LoginTab = "email" | "otp";
type OtpStep = "phone" | "verify";

export default function StudentLoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<LoginTab>("otp");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Email login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  // OTP login state
  const [otpStep, setOtpStep] = useState<OtpStep>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  // Cleanup reCAPTCHA on unmount
  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  function getOrCreateRecaptcha(): RecaptchaVerifier {
    if (!auth) throw new Error("Firebase Auth not initialized");
    if (recaptchaVerifierRef.current) return recaptchaVerifierRef.current;
    const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: () => {},
      "expired-callback": () => {
        recaptchaVerifierRef.current?.clear();
        recaptchaVerifierRef.current = null;
      },
    });
    recaptchaVerifierRef.current = verifier;
    return verifier;
  }

  async function handleSendOTP() {
    setError("");
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      setError("10 अंकों का valid mobile number दर्ज करें");
      return;
    }
    setLoading(true);
    try {
      const verifier = getOrCreateRecaptcha();
      const result = await authService.sendOTP(`+91${digits}`, verifier);
      setConfirmationResult(result);
      setOtpStep("verify");
      setOtpSent(true);
      setResendCooldown(30);
    } catch (err: any) {
      // Reset reCAPTCHA on error so user can retry
      recaptchaVerifierRef.current?.clear();
      recaptchaVerifierRef.current = null;
      setError(err.message || "OTP भेजने में error आई। Please दोबारा कोशिश करें।");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOTP() {
    setError("");
    if (otp.replace(/\D/g, "").length !== 6) {
      setError("6 अंकों का OTP दर्ज करें");
      return;
    }
    if (!confirmationResult) {
      setError("Session expired. Please resend OTP.");
      return;
    }
    setLoading(true);
    try {
      const user = await authService.verifyOTP(confirmationResult, otp.trim());
      saveActivity({
        type: "student_login",
        title: "📱 Student OTP Login",
        description: `Phone: +91${phone}`,
        page: "/auth/login",
      });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "OTP गलत है। Please दोबारा check करें।");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOTP() {
    if (resendCooldown > 0) return;
    recaptchaVerifierRef.current?.clear();
    recaptchaVerifierRef.current = null;
    setOtp("");
    setConfirmationResult(null);
    setOtpStep("phone");
    setOtpSent(false);
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Email और password जरूरी हैं");
      return;
    }
    setLoading(true);
    try {
      await authService.loginStudent(email, password);
      saveActivity({
        type: "student_login",
        title: "🔑 Student Email Login",
        description: email,
        email,
        page: "/auth/login",
      });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#047857] flex items-center justify-center px-4 py-12">
      {/* Invisible reCAPTCHA container */}
      <div id="recaptcha-container" ref={recaptchaContainerRef} />

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
              🎓 Student Portal
            </div>

            <h1 className="font-headline text-4xl font-extrabold leading-tight mb-4">
              Student Login<br />
              <span className="text-amber-400">Your Dashboard</span>
            </h1>

            <p className="text-emerald-100 leading-relaxed mb-8">
              अपने admission status, दस्तावेज़, और परामर्श अपडेट — सब एक जगह देखें।
            </p>

            <div className="space-y-3">
              {[
                [BookOpen,   "Live Application Tracking — status real-time देखें"],
                [FileCheck2, "Document Upload — सभी जरूरी documents manage करें"],
                [CreditCard, "BSCC & Payment Records — receipts और loan status"],
                [Bell,       "Notifications — college updates और deadlines"],
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
                Office staff हैं?{" "}
                <Link href="/admin/login" className="font-bold text-amber-400 hover:text-amber-300 underline">
                  Office Login →
                </Link>
              </p>
              <p className="text-sm text-emerald-200">
                नया अकाउंट बनाना है?{" "}
                <Link href="/auth/register" className="font-bold text-amber-400 hover:text-amber-300 underline">
                  रजिस्टर करें →
                </Link>
              </p>
            </div>
          </div>

          {/* Right — Login Card */}
          <div className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-5">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-400/20 border border-amber-400/30 px-3 py-1 text-xs font-bold text-amber-300">
                🎓 STUDENT LOGIN
              </div>
              <h2 className="font-headline text-2xl font-extrabold text-white">Welcome Back</h2>
            </div>

            {/* Tab switcher */}
            <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-black/20 p-1">
              <button
                onClick={() => { setTab("otp"); setError(""); }}
                className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition ${
                  tab === "otp" ? "bg-amber-400 text-gray-900 shadow" : "text-emerald-200 hover:text-white"
                }`}
              >
                <Phone size={15} /> Mobile OTP
              </button>
              <button
                onClick={() => { setTab("email"); setError(""); }}
                className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition ${
                  tab === "email" ? "bg-amber-400 text-gray-900 shadow" : "text-emerald-200 hover:text-white"
                }`}
              >
                <Mail size={15} /> Email
              </button>
            </div>

            {error && (
              <div className="mb-4 flex gap-3 rounded-xl bg-red-500/20 border border-red-400/40 p-4 text-sm text-red-200 backdrop-blur">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {/* ── OTP TAB ── */}
            {tab === "otp" && (
              <div className="space-y-4">
                {otpStep === "phone" ? (
                  <>
                    <div>
                      <label htmlFor="phone-input" className="mb-1.5 block text-sm font-semibold text-emerald-100">
                        Mobile Number
                      </label>
                      <div className="flex gap-2">
                        <span className="flex items-center rounded-xl border border-white/30 bg-white/10 px-3 text-sm font-bold text-white">
                          +91
                        </span>
                        <input
                          id="phone-input"
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          value={phone}
                          onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          placeholder="10-digit mobile number"
                          className="flex-1 rounded-xl border border-white/30 bg-white/10 px-4 py-3.5 text-sm text-white placeholder-emerald-300 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition"
                        />
                      </div>
                      <p className="mt-1.5 text-xs text-emerald-300">
                        आपके नंबर पर OTP SMS आएगा — बिल्कुल निःशुल्क।
                      </p>
                    </div>

                    <button
                      onClick={handleSendOTP}
                      disabled={loading || phone.length !== 10}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-400 py-4 font-extrabold text-gray-900 hover:bg-amber-300 transition disabled:opacity-60 active:scale-95 shadow-lg shadow-amber-500/30"
                    >
                      {loading
                        ? <Loader size={18} className="animate-spin" />
                        : <><ShieldCheck size={18} /> OTP भेजें</>
                      }
                    </button>
                  </>
                ) : (
                  <>
                    <div className="rounded-xl border border-green-400/40 bg-green-500/10 p-4 text-sm text-green-200 flex items-start gap-3">
                      <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5 text-green-400" />
                      <div>
                        <p className="font-bold text-green-300">OTP भेज दिया गया!</p>
                        <p>+91 {phone} पर 6-digit OTP SMS आया है।</p>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="otp-input" className="mb-1.5 block text-sm font-semibold text-emerald-100">
                        6-digit OTP
                      </label>
                      <input
                        id="otp-input"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otp}
                        onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="_ _ _ _ _ _"
                        className="w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3.5 text-center text-2xl font-extrabold tracking-[0.5em] text-white placeholder-emerald-400 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition"
                      />
                    </div>

                    <button
                      onClick={handleVerifyOTP}
                      disabled={loading || otp.length !== 6}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-400 py-4 font-extrabold text-gray-900 hover:bg-amber-300 transition disabled:opacity-60 active:scale-95 shadow-lg shadow-amber-500/30"
                    >
                      {loading
                        ? <Loader size={18} className="animate-spin" />
                        : <><CheckCircle2 size={18} /> OTP Verify करें</>
                      }
                    </button>

                    <div className="text-center text-sm text-emerald-300">
                      OTP नहीं आया?{" "}
                      {resendCooldown > 0 ? (
                        <span className="font-semibold text-emerald-200">{resendCooldown}s में Resend होगा</span>
                      ) : (
                        <button onClick={handleResendOTP} className="font-bold text-amber-400 hover:underline">
                          Resend OTP
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── EMAIL TAB ── */}
            {tab === "email" && (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label htmlFor="email-input" className="mb-1.5 block text-sm font-semibold text-emerald-100">Email Address</label>
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
                  <label htmlFor="password-input" className="mb-1.5 block text-sm font-semibold text-emerald-100">Password</label>
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
                    Password भूल गए?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-400 py-4 font-extrabold text-gray-900 hover:bg-amber-300 transition disabled:opacity-60 active:scale-95 shadow-lg shadow-amber-500/30"
                >
                  {loading ? <Loader size={18} className="animate-spin" /> : <><ArrowRight size={18} /> Login करें</>}
                </button>
              </form>
            )}

            <div className="mt-5 rounded-xl border border-white/20 bg-white/5 p-4 text-center">
              <p className="text-sm text-emerald-200">
                नया अकाउंट नहीं है?{" "}
                <Link href="/auth/register" className="font-bold text-amber-400 hover:text-amber-300 underline">
                  <UserPlus size={13} className="inline mr-1" />रजिस्टर करें
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
