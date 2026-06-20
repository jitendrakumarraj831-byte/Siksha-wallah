"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap, LogOut, Loader, Users, Phone, CheckCircle2,
  MessageCircle, Filter, Clock, AlertCircle, RefreshCw,
  TrendingUp, BookOpen, LayoutDashboard, StickyNote, X, Save,
  CalendarDays, BarChart3,
} from "lucide-react";
import {
  getAllInquiries, updateInquiryStatus, updateInquiryNote,
  type Inquiry, type InquiryStatus,
} from "@/services/inquiry-service";
import { subscribeActivities, type Activity, type ActivityType } from "@/services/activity-service";

/* ── helpers ─────────────────────────────────────────── */
const STATUS_META: Record<InquiryStatus, { label: string; color: string }> = {
  pending:        { label: "Pending",        color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  called:         { label: "Called",         color: "bg-blue-100 text-blue-800 border-blue-200" },
  admission_done: { label: "Admission Done", color: "bg-green-100 text-green-800 border-green-200" },
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

function getQualification(inq: Inquiry): string {
  if (inq.qualification) return inq.qualification;
  if (inq.message?.startsWith("Qualification:")) return inq.message.replace("Qualification:", "").trim();
  return inq.message || "—";
}

/* ── Note inline editor ─────────────────────────────── */
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

/* ── Activity type meta ─────────────────────────────── */
const ACTIVITY_META: Record<ActivityType, { icon: string; color: string }> = {
  inquiry:       { icon: "📋", color: "bg-blue-50 border-blue-200 text-blue-800" },
  contact:       { icon: "📝", color: "bg-purple-50 border-purple-200 text-purple-800" },
  registration:  { icon: "👤", color: "bg-green-50 border-green-200 text-green-800" },
  student_login: { icon: "🔑", color: "bg-gray-50 border-gray-200 text-gray-700" },
  whatsapp:      { icon: "📱", color: "bg-emerald-50 border-emerald-200 text-emerald-800" },
  bscc_check:    { icon: "🏦", color: "bg-amber-50 border-amber-200 text-amber-800" },
  course_view:   { icon: "📚", color: "bg-indigo-50 border-indigo-200 text-indigo-800" },
};

function timeAgo(ts: any): string {
  const d = ts?.toDate ? ts.toDate() : ts ? new Date(ts) : null;
  if (!d) return "";
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/* ── Main page ──────────────────────────────────────── */
export default function AdminDashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState("Admin");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);

  const [filterCourse, setFilterCourse] = useState("");
  const [filterStatus, setFilterStatus] = useState<"" | InquiryStatus>("");

  // Auth check — client-only
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
    // Real-time activity feed
    const unsub = subscribeActivities(30, setActivities);
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

  function handleLogout() {
    localStorage.removeItem("sw_admin_session");
    localStorage.removeItem("sw_admin_user");
    router.replace("/admin/login");
  }

  /* ── derived stats ── */
  const totalInquiries     = inquiries.length;
  const todayInquiries     = inquiries.filter(i => isToday(i.createdAt)).length;
  const pendingCalls       = inquiries.filter(i => !i.status || i.status === "pending").length;
  const admissionsConfirmed = inquiries.filter(i => i.status === "admission_done").length;

  // Course breakdown (top 6)
  const courseBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    inquiries.forEach(i => { if (i.course) map[i.course] = (map[i.course] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [inquiries]);

  const maxCourseCount = courseBreakdown[0]?.[1] || 1;

  const uniqueCourses = useMemo(
    () => [...new Set(inquiries.map(i => i.course).filter(Boolean))].sort(),
    [inquiries]
  );

  const filtered = useMemo(() => inquiries.filter(inq => {
    const matchCourse = !filterCourse || inq.course === filterCourse;
    const matchStatus = !filterStatus || (inq.status || "pending") === filterStatus;
    return matchCourse && matchStatus;
  }), [inquiries, filterCourse, filterStatus]);

  if (authorized === null) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Loader className="animate-spin text-[#003f9f]" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Top Nav ── */}
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
              Inquiries
            </Link>
            <Link href="/admin/students" className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">
              Students
            </Link>
            <Link href="/admin/activity" className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">
              Activity Log
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-semibold text-gray-600 sm:block">
              Welcome, {adminUser}
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

        {/* ── Page header ── */}
        <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-400 mb-1">
              <LayoutDashboard size={13} /> Office Dashboard
            </div>
            <h1 className="font-headline text-3xl font-extrabold text-gray-900">Student Inquiries</h1>
            <p className="text-sm text-gray-500 mt-0.5">Homepage form leads — manage follow-up calls & admissions</p>
          </div>
          <Link
            href="/admin/students"
            className="mt-3 sm:mt-0 inline-flex items-center gap-2 rounded-xl border-2 border-[#003f9f] px-5 py-2.5 text-sm font-bold text-[#003f9f] hover:bg-[#003f9f] hover:text-white transition"
          >
            <Users size={15} /> Registered Students →
          </Link>
        </div>

        {/* ── Summary Widgets ── */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Inquiries", value: totalInquiries, icon: Users, color: "blue", sub: "All time" },
            { label: "Today's Inquiries", value: todayInquiries, icon: CalendarDays, color: "purple", sub: "New today" },
            { label: "Pending Calls", value: pendingCalls, icon: Clock, color: "yellow", sub: "Need follow-up" },
            { label: "Admissions Done", value: admissionsConfirmed, icon: CheckCircle2, color: "green", sub: "Conversions" },
          ].map(({ label, value, icon: Icon, color, sub }) => {
            const bg: Record<string, string> = {
              blue: "border-blue-100 bg-blue-50", purple: "border-purple-100 bg-purple-50",
              yellow: "border-yellow-100 bg-yellow-50", green: "border-green-100 bg-green-50",
            };
            const txt: Record<string, string> = {
              blue: "text-blue-600", purple: "text-purple-600",
              yellow: "text-yellow-600", green: "text-green-600",
            };
            return (
              <div key={label} className={`rounded-2xl border-2 bg-white p-5 shadow-sm ${bg[color].split(" ")[0]}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
                    <p className={`mt-2 text-4xl font-extrabold ${txt[color]}`}>{value}</p>
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

        {/* ── Course Breakdown ── */}
        {courseBreakdown.length > 0 && (
          <div className="mb-6 rounded-2xl border-2 border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 size={16} className="text-[#003f9f]" />
              <p className="font-bold text-gray-800">Course-wise Inquiries</p>
            </div>
            <div className="space-y-2.5">
              {courseBreakdown.map(([course, count]) => (
                <div key={course} className="flex items-center gap-3">
                  <p className="w-32 truncate text-xs font-semibold text-gray-600 sm:w-44">{course}</p>
                  <div className="flex-1 rounded-full bg-gray-100 h-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#003f9f] transition-all"
                      style={{ width: `${(count / maxCourseCount) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-xs font-bold text-gray-700">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="mb-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* ── Filters ── */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-500">
            <Filter size={13} /> Filter:
          </div>
          <select
            value={filterCourse}
            onChange={e => setFilterCourse(e.target.value)}
            className="rounded-xl border-2 border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 outline-none focus:border-[#003f9f] transition"
          >
            <option value="">All Courses</option>
            {uniqueCourses.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
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

        {/* ── Table ── */}
        <div className="rounded-2xl border-2 border-gray-100 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader size={32} className="animate-spin text-[#003f9f]" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <Users size={36} className="mx-auto mb-3 text-gray-300" />
              <p className="font-semibold text-gray-500">No inquiries found</p>
              <p className="mt-1 text-sm text-gray-400">Submit a test inquiry from the homepage to see data here.</p>
              <Link href="/" className="mt-4 inline-block rounded-xl bg-[#003f9f] px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition">
                Go to Homepage →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-100 bg-gray-50">
                    {["Date", "Student", "Mobile", "Course", "Qualification", "Status", "Note", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(inq => {
                    const st = (inq.status || "pending") as InquiryStatus;
                    const { label, color } = STATUS_META[st];
                    return (
                      <tr key={inq.id} className="transition hover:bg-blue-50/30">
                        <td className="whitespace-nowrap px-4 py-3.5 text-gray-500 text-xs">{formatDate(inq.createdAt)}</td>
                        <td className="px-4 py-3.5">
                          <p className="font-bold text-gray-900">{inq.fullName}</p>
                          {inq.email && <p className="text-xs text-gray-400">{inq.email}</p>}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-gray-800">{inq.mobile}</td>
                        <td className="px-4 py-3.5">
                          <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-bold text-blue-800">
                            {inq.course || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-gray-600">{getQualification(inq)}</td>
                        <td className="px-4 py-3.5">
                          <select
                            value={st}
                            onChange={e => inq.id && handleStatusChange(inq.id, e.target.value as InquiryStatus)}
                            className={`rounded-full border px-3 py-1 text-xs font-bold outline-none cursor-pointer transition ${color}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="called">Called</option>
                            <option value="admission_done">Admission Done</option>
                          </select>
                        </td>
                        <td className="px-4 py-3.5">
                          <NoteCell inq={inq} onSaved={handleNoteSaved} />
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:+91${inq.mobile}`}
                              className="inline-flex items-center gap-1 rounded-lg bg-green-500 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-green-600 transition"
                            >
                              <Phone size={11} /> Call
                            </a>
                            <a
                              href={`https://wa.me/91${inq.mobile}?text=Hello%20${encodeURIComponent(inq.fullName)}%2C%20I%20am%20calling%20from%20Siksha%20Wallah%20regarding%20your%20inquiry%20for%20${encodeURIComponent(inq.course || "admission")}.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-lg bg-[#25D366] px-2.5 py-1.5 text-xs font-bold text-white hover:bg-green-500 transition"
                            >
                              <MessageCircle size={11} /> WA
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="mt-3 text-center text-xs text-gray-400">
          Showing {filtered.length} of {totalInquiries} total inquiries
        </p>

        {/* ── Live Activity Feed ── */}
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
              </span>
              <h2 className="font-headline text-lg font-extrabold text-gray-900">Live Website Activity</h2>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-500">{activities.length}</span>
            </div>
            <Link
              href="/admin/activity"
              className="text-xs font-bold text-[#003f9f] hover:underline"
            >
              View Full Log →
            </Link>
          </div>

          {activities.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 py-12 text-center text-gray-400">
              <p className="text-sm font-semibold">No activity yet</p>
              <p className="text-xs mt-1">Activities will appear here in real-time as visitors use the website</p>
            </div>
          ) : (
            <div className="space-y-2">
              {activities.slice(0, 15).map(act => {
                const meta = ACTIVITY_META[act.type] || { icon: "📌", color: "bg-gray-50 border-gray-200 text-gray-700" };
                return (
                  <div key={act.id} className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${meta.color}`}>
                    <span className="text-lg leading-none mt-0.5">{meta.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm">{act.title}</p>
                      <p className="text-xs mt-0.5 opacity-80 truncate">{act.description}</p>
                      {act.mobile && (
                        <a href={`tel:+91${act.mobile}`} className="mt-1 inline-flex items-center gap-1 text-xs font-bold underline opacity-70 hover:opacity-100">
                          <Phone size={10} /> {act.mobile}
                        </a>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <span className="text-xs opacity-60 whitespace-nowrap">{timeAgo(act.createdAt)}</span>
                      {act.page && <p className="text-xs opacity-40 mt-0.5">{act.page}</p>}
                    </div>
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
