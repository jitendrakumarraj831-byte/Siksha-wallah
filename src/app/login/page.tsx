import Link from "next/link";
import { GraduationCap, ShieldCheck, BookOpen, ArrowRight, Phone } from "lucide-react";

export default function LoginChoicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001f6b] via-[#003f9f] to-[#0060c7] flex flex-col items-center justify-center px-4 py-16">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-amber-400 opacity-10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-blue-300 opacity-10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-3xl">
        {/* Logo */}
        <div className="mb-10 text-center">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/20 backdrop-blur">
              <GraduationCap size={26} className="text-white" />
            </span>
            <span className="font-headline text-2xl font-extrabold text-white">
              SIKSHA<span className="text-amber-400">WALLAH</span>
            </span>
          </Link>
          <h1 className="mt-5 font-headline text-3xl font-extrabold text-white">
            Welcome — How would you like to sign in?
          </h1>
          <p className="mt-2 text-blue-200 text-base">
            Choose the right portal — students access their dashboard here, counsellors and office staff sign in to their workspace.
          </p>
        </div>

        {/* Choice Cards */}
        <div className="grid gap-5 sm:grid-cols-2">

          {/* ── Office Login ── */}
          <Link
            href="/admin/login"
            className="group relative flex flex-col rounded-2xl border-2 border-white/20 bg-white/10 p-8 backdrop-blur-xl shadow-2xl hover:bg-white/20 hover:border-amber-400/60 transition-all hover:-translate-y-1"
          >
            {/* Icon */}
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#001f6b]/60 border border-white/20">
              <ShieldCheck size={32} className="text-amber-400" />
            </div>

            <div className="mb-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-400/20 border border-amber-400/30 px-3 py-1 text-xs font-bold text-amber-300">
              FOR OUR COUNSELLORS
            </div>

            <h2 className="mt-3 font-headline text-2xl font-extrabold text-white">
              Counsellor Portal
            </h2>
            <p className="mt-2 text-sm text-blue-200 leading-relaxed flex-1">
              Sign-in space for Siksha Wallah counsellors and office staff to manage student enquiries, follow-ups and admissions.
            </p>

            <div className="mt-6 space-y-1.5 text-xs font-semibold text-blue-300">
              {["Review and respond to student enquiries", "Manage call & WhatsApp follow-ups", "Update admission progress and status"].map(f => (
                <p key={f} className="flex items-center gap-1.5">
                  <span className="text-amber-400">✓</span> {f}
                </p>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-bold text-gray-900 group-hover:bg-amber-300 transition">
              Open Counsellor Portal <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </div>
          </Link>

          {/* ── Student Login ── */}
          <Link
            href="/auth/login"
            className="group relative flex flex-col rounded-2xl border-2 border-white/20 bg-white/10 p-8 backdrop-blur-xl shadow-2xl hover:bg-white/20 hover:border-emerald-400/60 transition-all hover:-translate-y-1"
          >
            {/* Icon */}
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#064e3b]/60 border border-white/20">
              <BookOpen size={32} className="text-emerald-400" />
            </div>

            <div className="mb-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-400/20 border border-emerald-400/30 px-3 py-1 text-xs font-bold text-emerald-300">
              FOR STUDENTS
            </div>

            <h2 className="mt-3 font-headline text-2xl font-extrabold text-white">
              Student Dashboard
            </h2>
            <p className="mt-2 text-sm text-blue-200 leading-relaxed flex-1">
              Your personal admission space — track applications, share documents securely, and stay on top of your BSCC loan progress.
            </p>

            <div className="mt-6 space-y-1.5 text-xs font-semibold text-blue-300">
              {["Track every admission application in real time", "Upload and manage your documents securely", "Stay updated on BSCC loan and payment status"].map(f => (
                <p key={f} className="flex items-center gap-1.5">
                  <span className="text-emerald-400">✓</span> {f}
                </p>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-bold text-white group-hover:bg-emerald-400 transition">
              Sign in to My Dashboard <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </div>
          </Link>

        </div>

        {/* Register CTA */}
        <div className="mt-6 rounded-2xl border border-white/20 bg-white/5 p-5 text-center backdrop-blur">
          <p className="text-sm text-blue-200">
            New to Siksha Wallah?{" "}
            <Link href="/auth/register" className="font-bold text-amber-400 hover:text-amber-300 underline transition">
              Create your free student account →
            </Link>
          </p>
        </div>

        {/* Helpline */}
        <div className="mt-5 flex items-center justify-center gap-2 text-sm text-blue-300">
          <Phone size={14} />
          <span>Need help signing in? Call us at </span>
          <a href="tel:+916203138576" className="font-bold text-white hover:text-amber-400 transition">+91 6203138576</a>
          <span className="text-blue-500">·</span>
          <a href="tel:+917858062498" className="font-bold text-white hover:text-amber-400 transition">+91 7858062498</a>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-blue-400 hover:text-white transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
