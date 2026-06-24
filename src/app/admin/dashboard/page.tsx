"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap, LogOut, Loader, Users, Phone,
  CheckCircle2, MessageCircle, Filter, Clock,
  AlertCircle, RefreshCw, CalendarDays, StickyNote,
  X, Save, LayoutDashboard, Activity,
} from "lucide-react";
import {
  getAllInquiries, updateInquiryStatus, updateInquiryNote,
  type Inquiry, type InquiryStatus,
} from "@/services/inquiry-service";
import { subscribeActivities, type Activity as ActivityItem, type ActivityType } from "@/services/activity-service";

const STATUS_META: Record<InquiryStatus, { label: string; color: string }> = {
  pending:        { label: "Pending",        color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  called:         { label: "Called",         color: "bg-blue-100 text-blue-800 border-blue-200" },
  admission_done: { label: "Admission Done", color: "bg-green-100 text-green-800 border-green-200" },
};

const ACTIVITY_META: Record<ActivityType, { icon: string; label: string }> = {
  registration:   { icon: "👤", label: "Student Registrations" },
  student_login:  { icon: "🔑", label: "Student Logins" },
  course_view:    { icon: "📚", label: "Course Views" },
  application:    { icon: "🎓", label: "Applications Submitted" },
  whatsapp:       { icon: "💬", label: "WhatsApp Clicks" },
  call_click:     { icon: "📞", label: "Call Clicks" },
  inquiry:        { icon: "📋", label: "Inquiries" },
  contact:        { icon: "📝", label: "Contact Form" },
  doc_upload:     { icon: "📄", label: "Document Uploads" },
  profile_update: { icon: "✏️",  label: "Profile Updates" },
};

function toDate(ts: any): Date | null {
  if (!ts) return null;
  try { return ts?.toDate ? ts.toDate() : new Date(ts); } catch { return null; }
}

function formatDate(ts: any): string {
  const d = toDate(ts);
  if (!d) return "—";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function isToday(ts: any): boolean {
  const d = toDate(ts);
  if (!d) return false;
  const today = new Date();
  return d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();
}

function timeAgo(ts: any): string {
  const d = ts?.toDate ? ts.toDate() : ts ? new Date(ts) : null;
  if (!d) return "";
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function NoteCell({ inq, onSaved }: { inq: Inquiry; onSaved: (id: string, note: string) => void }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(inq.note || "");
  const [saving, setSaving] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  async function save() {
    if (!inq.id) return;
    setSaving(true);
    try {
      await updateInquiryNote(inq.id, draft);
      onSaved(inq.id, draft);
      setOpen(false);
    } catch { /* noop */ }
    finally { setSaving(false); }
  }

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen(!open); setDraft(inq.note || ""); setTimeout(() => ref.current?.focus(), 50); }}
        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${inq.note ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
      >
        <StickyNote size={11} />
        {inq.note ? "View Note" : "Add Note"}
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
            placeholder="Called at 3pm, interested in B.Ed..."
            className="w-full resize-none rounded-lg border border-gray-200 p-2 text-xs outline-none focus:border-[#003f9f]"
          />
          <button
            onClick={save}
            disabled={saving}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#003f9f] py-1.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? <Loader size={12} className="animate-spin" /> : <Save size={12} />}
            Save
          </button>
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
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<"" | InquiryStatus>("");

  useEffect(() => {
    const session = localStorage.getItem("sw_admin_session");
    const user = localStorage.getItem("sw_admin_user");
    if (!session) { router.replace("/admin/login"); return; }
    setAuthorized(true);
    setAdminUser(user || "Admin");
  }, [router]);

  useEffect(() => {
    if (!authorized) return;
    loadInquiries();
    const unsub = subscribeActivities(100, setActivities);
    return () => unsub();
  }, [authorized]);

  async function loadInquiries() {
    setLoading(true);
    try {
      setInquiries(await getAllInquiries());
      setError("");
    } catch {
      setError("Could not load inquiries. Check Firebase connection.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: string, status: InquiryStatus) {
    try {
      await updateInquiryStatus(id, status);
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    } catch { alert("Status update failed. Please try again."); }
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

  const totalInquiries     = inquiries.length;
  const todayInquiries     = inquiries.filter(i => isToday(i.createdAt)).length;
  const pendingCalls       = inquiries.filter(i => !i.status || i.status === "pending").length;
  const admissionsDone     = inquiries.filter(i => i.status === "admission_done").length;

  // Activity summary counts (today)
  const activitySummary = useMemo(() => {
    const tracked: ActivityType[] = ['registration', 'student_login', 'course_view', 'application', 'whatsapp', 'call_click'];
    return tracked.map(type => ({
      type,
      ...ACTIVITY_META[type],
      total: activities.filter(a => a.type === type).length,
      today: activities.filter(a => a.type === type && isToday(a.createdAt)).length,
    }));
  }, [activities]);

  const filtered = useMemo(() => inquiries.filter(inq => {
    return !filterStatus || (inq.status || "pending") === filterStatus;
  }), [inquiries, filterStatus]);

  if (authorized === null) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Loader className="animate-spin text-[#003f9f]" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top Nav */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#003f9f] text-white">
              <GraduationCap size={20} />
            </span>
            <span className="font-headline text-lg font-extrabold">
              SIKSHA<span className="text-[#dc143c]">WALLAH</span>{" "}
              <span className="text-gray-400 font-normal text-sm">Office</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            <Link href="/admin/dashboard" className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-bold text-[#003f9f]">
              Dashboard
            </Link>
            <Link href="/admin/students" className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">
              Students
            </Link>
            <Link href="/admin/applications" className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">
              Applications
            </Link>
            <Link href="/admin/activity" className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">
              Website Activity
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-semibold text-gray-600 sm:block">
              {adminUser}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border-2 border-gray-200 px-4 py-2 text-sm font-bold text-gray-700 hover:border-red-300 hover:text-red-600 transition"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">

        {/* Page header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-400 mb-1">
            <LayoutDashboard size={13} /> Office Dashboard
          </div>
          <h1 className="font-headline text-3xl font-extrabold text-gray-900">Dashboard</h1>
        </div>

        {/* Summary Widgets */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Students", value: activities.filter(a => a.type === 'registration').length, icon: Users, color: "blue", sub: "Registered accounts" },
            { label: "Total Applications", value: totalInquiries, icon: CalendarDays, color: "blue", sub: "All inquiries" },
            { label: "Today's Applications", value: todayInquiries, icon: Clock, color: "yellow", sub: "New today" },
            { label: "Website Visitors", value: activities.length, icon: Activity, color: "green", sub: "Tracked events" },
          ].map(({ label, value, icon: Icon, color, sub }) => {
            const bg: Record<string, string> = { blue: "bg-blue-50", yellow: "bg-amber-50", green: "bg-green-50" };
            const txt: Record<string, string> = { blue: "text-blue-600", yellow: "text-amber-600", green: "text-green-600" };
            return (
              <div key={label} className="rounded-2xl border-2 border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
                    <p className={`mt-2 text-3xl font-extrabold ${txt[color]}`}>{value}</p>
                    <p className="mt-1 text-xs text-gray-400">{sub}</p>
                  </div>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg[color]}`}>
                    <Icon size={22} className={txt[color]} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Website Activity Summary */}
        <div className="mb-6 rounded-2xl border-2 border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-bold text-gray-800 flex items-center gap-2">
            <Activity size={16} className="text-[#003f9f]" />
            Website Activity
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {activitySummary.map(({ type, icon, label, total, today }) => (
              <div key={type} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{icon}</span>
                  <span className="text-sm font-semibold text-gray-700">{label}</span>
                </div>
                <div className="text-right">
                  <p className="text-base font-extrabold text-gray-900">{total}</p>
                  {today > 0 && (
                    <p className="text-xs text-green-600 font-semibold">+{today} today</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-500">
            <Filter size={13} /> Filter:
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as "" | InquiryStatus)}
            className="rounded-xl border-2 border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 outline-none focus:border-[#003f9f] transition"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="called">Called</option>
            <option value="admission_done">Admission Done</option>
          </select>
          <button
            onClick={loadInquiries}
            className="ml-auto flex items-center gap-2 rounded-xl border-2 border-gray-200 px-4 py-2 text-sm font-bold text-gray-600 hover:border-[#003f9f] hover:text-[#003f9f] transition"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {/* Inquiry Table */}
        <div className="rounded-2xl border-2 border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="font-bold text-gray-800">Student Inquiries</h2>
            <p className="text-xs text-gray-400 mt-0.5">Showing {filtered.length} of {totalInquiries} total</p>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader size={32} className="animate-spin text-[#003f9f]" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <Users size={36} className="mx-auto mb-3 text-gray-300" />
              <p className="font-semibold text-gray-500">No inquiries found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map(inq => {
                const st = (inq.status || "pending") as InquiryStatus;
                const { label, color } = STATUS_META[st];
                return (
                  <div key={inq.id} className="flex flex-wrap items-start gap-3 px-4 py-4 hover:bg-blue-50/20 transition">
                    <div className="flex items-center gap-3 min-w-[160px] flex-1">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#003f9f] font-bold text-sm text-white">
                        {inq.fullName?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 text-sm leading-tight">{inq.fullName}</p>
                        <p className="text-xs text-gray-400">{formatDate(inq.createdAt)}</p>
                      </div>
                    </div>

                    <div className="min-w-[120px]">
                      <span className="rounded-lg bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-800">
                        {inq.course || "—"}
                      </span>
                      <p className="mt-1 text-xs text-gray-400">{inq.qualification || inq.message || "—"}</p>
                    </div>

                    <div className="flex-shrink-0">
                      <select
                        value={st}
                        onChange={e => inq.id && handleStatusChange(inq.id, e.target.value as InquiryStatus)}
                        className={`rounded-full border px-3 py-1 text-xs font-bold outline-none cursor-pointer transition ${color}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="called">Called</option>
                        <option value="admission_done">Admission Done</option>
                      </select>
                    </div>

                    <div className="flex-shrink-0">
                      <NoteCell inq={inq} onSaved={handleNoteSaved} />
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
                      <a
                        href={`tel:+91${inq.mobile}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-green-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-600 transition"
                      >
                        <Phone size={11} /> {inq.mobile}
                      </a>
                      <a
                        href={`https://wa.me/91${inq.mobile}?text=Hello%20${encodeURIComponent(inq.fullName)}%2C%20I%20am%20from%20Siksha%20Wallah%20regarding%20your%20inquiry%20for%20${encodeURIComponent(inq.course || "admission")}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-bold text-white hover:bg-green-500 transition"
                      >
                        <MessageCircle size={11} /> WA
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Live Activity Feed */}
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
              </span>
              <h2 className="font-headline text-lg font-extrabold text-gray-900">Live Activity Feed</h2>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-500">{activities.length}</span>
            </div>
            <Link href="/admin/activity" className="text-xs font-bold text-[#003f9f] hover:underline">
              View Full Log →
            </Link>
          </div>

          {activities.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 py-12 text-center text-gray-400">
              <p className="text-sm font-semibold">No activity yet</p>
              <p className="text-xs mt-1">Activities appear here in real-time as visitors use the website</p>
            </div>
          ) : (
            <div className="space-y-2">
              {activities.slice(0, 20).map(act => {
                const meta = ACTIVITY_META[act.type] || { icon: "📌", label: act.type };
                return (
                  <div key={act.id} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3">
                    <span className="text-lg leading-none mt-0.5">{meta.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-gray-800">{act.title}</p>
                      <p className="text-xs mt-0.5 text-gray-500 truncate">{act.description}</p>
                    </div>
                    <span className="flex-shrink-0 text-xs text-gray-400 whitespace-nowrap">{timeAgo(act.createdAt)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
