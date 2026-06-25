"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdminMobileNav } from "@/components/admin-mobile-nav";
import { adminFetchData, adminUpdate } from "@/lib/admin-api";
import {
  GraduationCap, LogOut, Loader, Users, Phone,
  CheckCircle2, MessageCircle, Filter, Clock,
  AlertCircle, RefreshCw, StickyNote, X, Save,
} from "lucide-react";
import {
  getAllInquiries,
  type Inquiry, type InquiryStatus,
} from "@/services/inquiry-service";

const STATUS_META: Record<InquiryStatus, { label: string; color: string }> = {
  pending:        { label: "Pending Call",    color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  called:         { label: "Called",          color: "bg-blue-100 text-blue-800 border-blue-200" },
  admission_done: { label: "Admission Done",  color: "bg-green-100 text-green-800 border-green-200" },
};

function toDate(ts: any): Date | null {
  if (!ts) return null;
  try { return ts?.toDate ? ts.toDate() : new Date(ts); } catch { return null; }
}

function formatDate(ts: any): string {
  const d = toDate(ts);
  if (!d) return "—";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function isToday(ts: any): boolean {
  const d = toDate(ts);
  if (!d) return false;
  const t = new Date();
  return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
}

function NoteCell({ inq, onSaved }: { inq: Inquiry; onSaved: (id: string, note: string) => void }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(inq.note || "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  async function save() {
    if (!inq.id) return;
    setSaving(true);
    setErr("");
    try {
      await adminUpdate("inquiries", inq.id, { note: draft });
      onSaved(inq.id, draft);
      setOpen(false);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save नहीं हुआ। दोबारा करें।");
    }
    finally { setSaving(false); }
  }

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen(!open); setDraft(inq.note || ""); setTimeout(() => ref.current?.focus(), 50); }}
        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${inq.note ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
      >
        <StickyNote size={11} />
        {inq.note ? "Note देखें" : "Note लिखें"}
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-50 w-64 rounded-xl border border-gray-200 bg-white p-3 shadow-xl">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-bold text-gray-700">Staff Note</p>
            <button onClick={() => setOpen(false)}><X size={14} className="text-gray-400" /></button>
          </div>
          <textarea
            ref={ref}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            rows={3}
            placeholder="जैसे: 3 बजे call किया, B.Ed में interested है..."
            className="w-full resize-none rounded-lg border border-gray-200 p-2 text-xs outline-none focus:border-[#003f9f]"
          />
          <button
            onClick={save}
            disabled={saving}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#003f9f] py-1.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? <Loader size={12} className="animate-spin" /> : <Save size={12} />}
            Save करें
          </button>
          {err && <p className="mt-2 rounded-lg bg-red-50 px-2 py-1.5 text-[11px] font-semibold text-red-600">{err}</p>}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState("Admin");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState<"" | InquiryStatus>("");
  const [filterToday, setFilterToday] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cached = localStorage.getItem("sw_admin_session");
    const cachedUser = localStorage.getItem("sw_admin_user");
    if (cached) {
      setAuthorized(true);
      setAdminUser(cachedUser || "Admin");
      return;
    }
    // localStorage missing (e.g. cleared or private browsing) — verify via cookie
    fetch("/api/admin/data?type=ping", { credentials: "include" })
      .then(async (res) => {
        if (res.status === 401) { router.replace("/admin/login"); return; }
        // Cookie is valid — restore localStorage cache
        localStorage.setItem("sw_admin_session", "1");
        setAuthorized(true);
        setAdminUser("Admin");
      })
      .catch(() => { router.replace("/admin/login"); });
  }, [router]);

  useEffect(() => { if (authorized) loadInquiries(); }, [authorized]);

  async function loadInquiries() {
    setLoading(true);
    try {
      // Prefer the secure Admin-SDK API (works once Firestore rules are locked);
      // fall back to the direct client read for older/open-rules setups.
      setInquiries(await adminFetchData<Inquiry[]>("inquiries", getAllInquiries));
      setError("");
    } catch {
      setError("Inquiries load नहीं हो पाईं। Firebase connection check करें।");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: string, status: InquiryStatus) {
    // Optimistic update; revert if the server write doesn't persist.
    const snapshot = inquiries;
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    setError("");
    try {
      await adminUpdate("inquiries", id, { status });
    } catch (e) {
      setInquiries(snapshot);
      setError(e instanceof Error ? e.message : "Status update नहीं हो पाया।");
    }
  }

  function handleNoteSaved(id: string, note: string) {
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, note } : i));
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    localStorage.removeItem("sw_admin_session");
    localStorage.removeItem("sw_admin_user");
    router.replace("/admin/login");
  }

  const total        = inquiries.length;
  const todayCount   = inquiries.filter(i => isToday(i.createdAt)).length;
  const pendingCount = inquiries.filter(i => !i.status || i.status === "pending").length;
  const doneCount    = inquiries.filter(i => i.status === "admission_done").length;

  const filtered = useMemo(() => inquiries.filter(inq => {
    const statusMatch = !filterStatus || (inq.status || "pending") === filterStatus;
    const todayMatch = !filterToday || isToday(inq.createdAt);
    return statusMatch && todayMatch;
  }), [inquiries, filterStatus, filterToday]);

  function setStatFilter(status: "" | InquiryStatus, today = false) {
    setFilterStatus(status);
    setFilterToday(today);
    setTimeout(() => listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  if (authorized === null) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Loader className="animate-spin text-[#003f9f]" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#003f9f] text-white">
              <GraduationCap size={20} />
            </span>
            <span className="font-headline text-lg font-extrabold">
              SIKSHA<span className="text-[#dc143c]">WALLAH</span>
              <span className="ml-1 text-sm font-normal text-gray-400">Office</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            <Link href="/admin/dashboard" className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-bold text-[#003f9f]">Dashboard</Link>
            <Link href="/admin/applications" className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Applications</Link>
            <Link href="/admin/students" className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Students</Link>
            <Link href="/admin/messages" className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Messages</Link>
          </nav>

          <div className="flex items-center gap-3">
            <AdminMobileNav />
            <span className="hidden text-sm font-semibold text-gray-600 sm:block">{adminUser}</span>
            <button onClick={handleLogout} className="flex items-center gap-2 rounded-xl border-2 border-gray-200 px-3 py-2 text-sm font-bold text-gray-700 hover:border-red-300 hover:text-red-600 transition">
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">

        {/* Stats — click to filter the list below */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "कुल Inquiries", value: total,        icon: Users,        color: "blue",  action: () => setStatFilter("") },
            { label: "आज की",         value: todayCount,   icon: Clock,        color: "amber", action: () => setStatFilter("", true) },
            { label: "Call बाकी",     value: pendingCount, icon: Phone,        color: "red",   action: () => setStatFilter("pending") },
            { label: "Admission हुई", value: doneCount,    icon: CheckCircle2, color: "green", action: () => setStatFilter("admission_done") },
          ].map(({ label, value, icon: Icon, color, action }) => {
            const bg:  Record<string,string> = { blue:"bg-blue-50",  amber:"bg-amber-50",  red:"bg-red-50",  green:"bg-green-50" };
            const txt: Record<string,string> = { blue:"text-blue-600",amber:"text-amber-600",red:"text-red-600",green:"text-green-600" };
            return (
              <button key={label} onClick={action}
                className="rounded-2xl border-2 border-gray-100 bg-white p-4 shadow-sm text-left transition hover:border-[#003f9f] hover:shadow-md active:scale-95 cursor-pointer w-full">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-500">{label}</p>
                    <p className={`mt-1 text-3xl font-extrabold ${txt[color]}`}>{value}</p>
                  </div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg[color]}`}>
                    <Icon size={20} className={txt[color]} />
                  </div>
                </div>
                <p className="mt-1.5 text-[10px] text-gray-400">क्लिक करें देखने के लिए →</p>
              </button>
            );
          })}
        </div>

        {error && (
          <div className="mb-4 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Filter + Refresh */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <select
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value as "" | InquiryStatus); setFilterToday(false); }}
            className="rounded-xl border-2 border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 outline-none focus:border-[#003f9f]"
          >
            <option value="">सभी दिखाएं</option>
            <option value="pending">Call बाकी</option>
            <option value="called">Call हो गई</option>
            <option value="admission_done">Admission Done</option>
          </select>
          {filterToday && (
            <button onClick={() => setFilterToday(false)} className="flex items-center gap-1.5 rounded-xl border-2 border-amber-300 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-700">
              आज की ✕
            </button>
          )}
          <span className="text-sm text-gray-400">{filtered.length} / {total} दिख रहे हैं</span>
          <button onClick={loadInquiries} className="ml-auto flex items-center gap-2 rounded-xl border-2 border-gray-200 px-4 py-2 text-sm font-bold text-gray-600 hover:border-[#003f9f] hover:text-[#003f9f] transition">
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {/* Inquiry List */}
        <div ref={listRef} className="rounded-2xl border-2 border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50 px-5 py-3">
            <h2 className="font-extrabold text-gray-800">📋 Student Inquiries</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader size={32} className="animate-spin text-[#003f9f]" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <Users size={32} className="mx-auto mb-2 text-gray-300" />
              <p className="font-semibold">कोई inquiry नहीं मिली</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map(inq => {
                const st = (inq.status || "pending") as InquiryStatus;
                const { label, color } = STATUS_META[st];
                const isNew = st === "pending" && isToday(inq.createdAt);
                return (
                  <div key={inq.id} className={`flex flex-wrap items-start gap-3 px-4 py-4 transition ${isNew ? "bg-amber-50/40" : "hover:bg-gray-50"}`}>

                    {/* Name + Date */}
                    <div className="flex items-center gap-3 min-w-[160px] flex-1">
                      <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#003f9f] font-bold text-white">
                        {inq.fullName?.[0]?.toUpperCase() || "?"}
                        {isNew && <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-amber-400 border-2 border-white" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 text-sm">{inq.fullName}</p>
                        <p className="text-xs text-gray-400">{formatDate(inq.createdAt)}</p>
                      </div>
                    </div>

                    {/* Course */}
                    <div className="min-w-[110px]">
                      <span className="rounded-lg bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-800">{inq.course || "—"}</span>
                      <p className="mt-1 text-xs text-gray-400">{inq.qualification || "—"}</p>
                    </div>

                    {/* Status */}
                    <div className="flex-shrink-0">
                      <select
                        value={st}
                        onChange={e => inq.id && handleStatusChange(inq.id, e.target.value as InquiryStatus)}
                        className={`rounded-full border px-3 py-1 text-xs font-bold outline-none cursor-pointer ${color}`}
                      >
                        <option value="pending">Call बाकी</option>
                        <option value="called">Called ✓</option>
                        <option value="admission_done">Admission Done ✅</option>
                      </select>
                    </div>

                    {/* Note */}
                    <div className="flex-shrink-0">
                      <NoteCell inq={inq} onSaved={handleNoteSaved} />
                    </div>

                    {/* Call + WhatsApp */}
                    <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
                      <a href={`tel:+91${inq.mobile}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-green-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-600 transition"
                      >
                        <Phone size={12} /> {inq.mobile}
                      </a>
                      <a
                        href={`https://wa.me/91${inq.mobile}?text=नमस्ते%20${encodeURIComponent(inq.fullName)}%20जी!%20मैं%20Siksha%20Wallah%20से%20बोल%20रहा/रही%20हूँ।%20आपने%20${encodeURIComponent(inq.course || "admission")}%20के%20लिए%20inquiry%20की%20थी।%20क्या%20आप%20अभी%20बात%20कर%20सकते%20हैं?`}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-bold text-white hover:bg-green-500 transition"
                      >
                        <MessageCircle size={12} /> WA
                      </a>
                    </div>

                    {/* Note preview */}
                    {inq.note && (
                      <div className="w-full mt-1 rounded-lg bg-amber-50 border border-amber-100 px-3 py-1.5 text-xs text-amber-800">
                        📝 {inq.note}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Link href="/admin/applications" className="flex items-center gap-3 rounded-2xl border-2 border-gray-100 bg-white p-4 hover:border-[#003f9f] transition">
            <span className="text-2xl">🎓</span>
            <div>
              <p className="font-bold text-gray-800 text-sm">Applications</p>
              <p className="text-xs text-gray-400">Online form submissions</p>
            </div>
          </Link>
          <Link href="/admin/students" className="flex items-center gap-3 rounded-2xl border-2 border-gray-100 bg-white p-4 hover:border-[#003f9f] transition">
            <span className="text-2xl">👤</span>
            <div>
              <p className="font-bold text-gray-800 text-sm">Students</p>
              <p className="text-xs text-gray-400">Registered accounts</p>
            </div>
          </Link>
          <Link href="/admin/activity" className="flex items-center gap-3 rounded-2xl border-2 border-gray-100 bg-white p-4 hover:border-[#003f9f] transition col-span-2 sm:col-span-1">
            <span className="text-2xl">📊</span>
            <div>
              <p className="font-bold text-gray-800 text-sm">Website Activity</p>
              <p className="text-xs text-gray-400">Visitors & events</p>
            </div>
          </Link>
        </div>

      </main>
    </div>
  );
}
