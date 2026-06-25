"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdminMobileNav } from "@/components/admin-mobile-nav";
import { adminFetchData } from "@/lib/admin-api";
import {
  GraduationCap, LogOut, Loader, Phone, Mail, MapPin,
  BookOpen, AlertCircle,
  Filter, Search, MessageCircle, ChevronDown, ChevronUp,
} from "lucide-react";
import {
  getAllApplications,
  updateApplicationStatus,
  updateApplicationNote,
  type CourseApplication,
  type ApplicationStatus,
} from "@/services/application-service";

const STATUS_META: Record<ApplicationStatus, { label: string; color: string; icon: string }> = {
  new:               { label: "New",               color: "bg-blue-100 text-blue-800 border-blue-200",    icon: "🆕" },
  contacted:         { label: "Contacted",          color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: "📞" },
  documents_pending: { label: "Docs Pending",       color: "bg-amber-100 text-amber-800 border-amber-200", icon: "📄" },
  admission_done:    { label: "Admission Done",     color: "bg-green-100 text-green-800 border-green-200", icon: "✅" },
  not_interested:    { label: "Not Interested",     color: "bg-gray-100 text-gray-600 border-gray-200",   icon: "❌" },
};

function timeAgo(ts: any): string {
  const d = ts?.toDate ? ts.toDate() : ts ? new Date(ts) : null;
  if (!d) return "";
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function NoteCell({ app, onSaved }: { app: CourseApplication; onSaved: (id: string, note: string) => void }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(app.note || "");
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!app.id) return;
    setSaving(true);
    await updateApplicationNote(app.id!, draft);
    onSaved(app.id, draft);
    setSaving(false);
    setOpen(false);
  }

  if (!open) return (
    <button onClick={() => setOpen(true)} className="text-xs text-left text-gray-400 hover:text-blue-600 transition max-w-[120px] truncate">
      {app.note ? <span className="text-gray-600">{app.note}</span> : <span className="italic">+ Add note</span>}
    </button>
  );

  return (
    <div className="flex items-center gap-1">
      <input
        autoFocus value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={e => e.key === "Enter" && save()}
        className="w-32 rounded-lg border border-blue-300 px-2 py-1 text-xs outline-none focus:border-blue-500"
      />
      <button onClick={save} disabled={saving} className="rounded-lg bg-blue-600 px-2 py-1 text-xs font-bold text-white hover:bg-blue-700">
        {saving ? "…" : "Save"}
      </button>
      <button onClick={() => { setOpen(false); setDraft(app.note || ""); }} className="text-xs text-gray-400 hover:text-red-500">✕</button>
    </div>
  );
}

function AppCard({ app, onStatusChange, onNoteSaved, isNew }: {
  app: CourseApplication;
  onStatusChange: (id: string, s: ApplicationStatus) => void;
  onNoteSaved: (id: string, note: string) => void;
  isNew: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const meta = STATUS_META[app.status || "new"];

  return (
    <div className={`rounded-2xl border-2 bg-white shadow-sm transition ${isNew ? "border-blue-200 ring-2 ring-blue-100" : "border-gray-100 hover:border-blue-100"}`}>
      {/* Main row */}
      <div className="flex items-start gap-4 px-5 py-4">
        {/* Avatar */}
        <div className="flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-xl bg-[#003f9f] font-headline font-extrabold text-lg text-white">
          {app.fullName?.[0]?.toUpperCase() || "?"}
        </div>

        {/* Core info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <p className="font-extrabold text-gray-900">{app.fullName}</p>
            {isNew && <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-extrabold text-white">NEW</span>}
            <span className={`rounded-full border px-2 py-0.5 text-xs font-bold ${meta.color}`}>
              {meta.icon} {meta.label}
            </span>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
            <a href={`tel:+91${app.mobile}`} className="inline-flex items-center gap-1 font-bold text-green-600 hover:underline">
              <Phone size={11} /> {app.mobile}
            </a>
            {app.email && <span className="inline-flex items-center gap-1"><Mail size={11} /> {app.email}</span>}
            {app.district && <span className="inline-flex items-center gap-1"><MapPin size={11} /> {app.district}</span>}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-2 text-xs">
            <span className="rounded-lg bg-blue-50 px-2 py-0.5 font-bold text-blue-700">{app.course}</span>
            <span className="rounded-lg bg-gray-100 px-2 py-0.5 font-semibold text-gray-600">{app.qualification}</span>
            {app.bsccRequired && <span className="rounded-lg bg-amber-100 px-2 py-0.5 font-semibold text-amber-700">💳 BSCC</span>}
          </div>
        </div>

        {/* Right: time + expand */}
        <div className="flex-shrink-0 flex flex-col items-end gap-2">
          <p className="text-xs text-gray-400 font-semibold">{timeAgo(app.createdAt)}</p>
          <button
            onClick={() => setExpanded(e => !e)}
            className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:border-blue-300 hover:text-blue-600 transition"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50 px-5 py-4 rounded-b-2xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
            <InfoBlock title="Personal">
              {app.fatherName && <Row k="Father" v={app.fatherName} />}
              {app.dob && <Row k="DOB" v={app.dob} />}
              {app.gender && <Row k="Gender" v={app.gender} />}
              {app.address && <Row k="Address" v={app.address} />}
              {app.state && <Row k="State" v={app.state} />}
            </InfoBlock>
            <InfoBlock title="Academic">
              {app.passingYear && <Row k="Year" v={app.passingYear} />}
              {app.percentage && <Row k="%" v={app.percentage} />}
              {app.schoolCollege && <Row k="School/College" v={app.schoolCollege} />}
              {app.preferredCollege && <Row k="Preferred College" v={app.preferredCollege} />}
              <Row k="BSCC" v={app.bsccRequired ? "Yes — Required" : "Not required"} />
            </InfoBlock>
            <InfoBlock title="Actions">

              {/* Status */}
              <p className="font-semibold text-gray-500 mb-1.5">Update Status:</p>
              <select
                value={app.status || "new"}
                onChange={e => app.id && onStatusChange(app.id, e.target.value as ApplicationStatus)}
                className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-semibold outline-none focus:border-blue-400 mb-3"
              >
                {Object.entries(STATUS_META).map(([k, v]) => (
                  <option key={k} value={k}>{v.icon} {v.label}</option>
                ))}
              </select>

              {/* Note */}
              <p className="font-semibold text-gray-500 mb-1">Note:</p>
              <NoteCell app={app} onSaved={onNoteSaved} />

              {/* Quick contact */}
              <div className="mt-3 flex gap-2">
                <a href={`tel:+91${app.mobile}`} className="flex items-center gap-1 rounded-lg bg-[#003f9f] px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700">
                  <Phone size={11} /> Call
                </a>
                <a
                  href={`https://wa.me/91${app.mobile}?text=Hi ${app.fullName}! Main Siksha Wallah se bol raha/rahi hun. Aapne ${app.course} ke liye application di hai. Kya aap available hain?`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-lg bg-green-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-600"
                >
                  <MessageCircle size={11} /> WhatsApp
                </a>
                {app.email && (
                  <a href={`mailto:${app.email}?subject=Siksha Wallah — ${app.course} Application&body=Dear ${app.fullName},%0A%0AThank you for applying for ${app.course}.`}
                    className="flex items-center gap-1 rounded-lg bg-[#003f9f] px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700">
                    <Mail size={11} /> Email
                  </a>
                )}
              </div>
            </InfoBlock>
          </div>

          {app.message && (
            <div className="mt-3 rounded-xl bg-yellow-50 border border-yellow-200 px-4 py-3 text-xs text-gray-700">
              <span className="font-bold text-yellow-700">💬 Student Message: </span>{app.message}
            </div>
          )}

          {app.availableDocs && app.availableDocs.length > 0 && (
            <div className="mt-3 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-xs">
              <p className="font-bold text-green-800 mb-2">📋 Student के पास Available Documents ({app.availableDocs.length}):</p>
              <div className="flex flex-wrap gap-1.5">
                {app.availableDocs.map((d: string) => (
                  <span key={d} className="rounded-lg bg-green-100 border border-green-300 px-2 py-0.5 font-semibold text-green-800">{d.split(" (")[0]}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-extrabold uppercase tracking-wider text-[#003f9f] mb-2">{title}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <p><span className="text-gray-400">{k}:</span> <span className="font-semibold text-gray-700">{v}</span></p>
  );
}

export default function AdminApplicationsPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState("Admin");
  const [applications, setApplications] = useState<CourseApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"" | ApplicationStatus>("");
  const [filterCourse, setFilterCourse] = useState("");

  useEffect(() => {
    const cached = localStorage.getItem("sw_admin_session");
    const cachedUser = localStorage.getItem("sw_admin_user");
    if (cached) {
      setAuthorized(true);
      setAdminUser(cachedUser || "Admin");
      return;
    }
    fetch("/api/admin/data?type=ping", { credentials: "include" })
      .then(async (res) => {
        if (res.status === 401) { router.replace("/admin/login"); return; }
        localStorage.setItem("sw_admin_session", "1");
        setAuthorized(true);
        setAdminUser("Admin");
      })
      .catch(() => { router.replace("/admin/login"); });
  }, [router]);

  useEffect(() => {
    if (!authorized) return;
    setLoading(true);
    // Prefer the secure Admin-SDK API; fall back to the direct client read.
    adminFetchData<CourseApplication[]>("applications", getAllApplications)
      .then((data) => setApplications(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [authorized]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    localStorage.removeItem("sw_admin_session");
    localStorage.removeItem("sw_admin_user");
    router.replace("/admin/login");
  }

  function handleStatusChange(id: string, status: ApplicationStatus) {
    updateApplicationStatus(id, status).catch(() => {});
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }

  function handleNoteSaved(id: string, note: string) {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, note } : a));
  }

  // Stats
  const stats = useMemo(() => ({
    total: applications.length,
    new: applications.filter(a => a.status === "new" || !a.status).length,
    contacted: applications.filter(a => a.status === "contacted").length,
    done: applications.filter(a => a.status === "admission_done").length,
    bscc: applications.filter(a => a.bsccRequired).length,
  }), [applications]);

  // Unique courses for filter
  const courses = useMemo(() => {
    const s = new Set(applications.map(a => a.course).filter(Boolean));
    return [...s].sort();
  }, [applications]);

  // Filtered
  const filtered = useMemo(() => {
    return applications.filter(a => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        a.fullName?.toLowerCase().includes(q) ||
        a.mobile?.includes(q) ||
        a.email?.toLowerCase().includes(q) ||
        a.course?.toLowerCase().includes(q) ||
        a.district?.toLowerCase().includes(q) ||
        a.fatherName?.toLowerCase().includes(q);
      const matchStatus = !filterStatus || a.status === filterStatus || (!a.status && filterStatus === "new");
      const matchCourse = !filterCourse || a.course === filterCourse;
      return matchSearch && matchStatus && matchCourse;
    });
  }, [applications, search, filterStatus, filterCourse]);

  // Today
  const today = useMemo(() => {
    const now = new Date();
    return applications.filter(a => {
      const d = a.createdAt?.toDate ? a.createdAt.toDate() : a.createdAt ? new Date(a.createdAt) : null;
      return d && d.toDateString() === now.toDateString();
    }).length;
  }, [applications]);

  if (authorized === null) return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader className="animate-spin text-[#003f9f]" size={36} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
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
            <Link href="/admin/dashboard" className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Dashboard</Link>
            <Link href="/admin/applications" className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-bold text-[#003f9f]">Applications</Link>
            <Link href="/admin/students" className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Students</Link>
            <Link href="/admin/messages" className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Messages</Link>
            <Link href="/admin/activity" className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Website Activity</Link>
          </nav>
          <div className="flex items-center gap-3">
            <AdminMobileNav />
            <span className="hidden text-sm font-semibold text-gray-600 sm:block">Welcome, {adminUser}</span>
            <button onClick={handleLogout} className="flex items-center gap-2 rounded-xl border-2 border-gray-200 px-4 py-2 text-sm font-bold text-gray-700 hover:border-red-300 hover:text-red-600 transition">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-headline text-3xl font-extrabold text-gray-900">Course Applications</h1>
          <p className="mt-1 text-sm text-gray-500">
            Students द्वारा submit की गई course applications — real-time updated
          </p>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            { label: "Total", value: stats.total, color: "text-gray-900", bg: "bg-white" },
            { label: "Today", value: today, color: "text-[#003f9f]", bg: "bg-blue-50" },
            { label: "New", value: stats.new, color: "text-blue-700", bg: "bg-blue-50" },
            { label: "Contacted", value: stats.contacted, color: "text-yellow-700", bg: "bg-yellow-50" },
            { label: "Admission Done", value: stats.done, color: "text-green-700", bg: "bg-green-50" },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl border-2 border-gray-100 ${s.bg} p-4 text-center shadow-sm`}>
              <p className={`font-headline text-3xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, mobile, course, district..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#003f9f] transition"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as any)}
            className="rounded-xl border-2 border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-600 outline-none focus:border-[#003f9f] bg-white transition"
          >
            <option value="">All Status</option>
            {Object.entries(STATUS_META).map(([k, v]) => (
              <option key={k} value={k}>{v.icon} {v.label}</option>
            ))}
          </select>
          <select
            value={filterCourse}
            onChange={e => setFilterCourse(e.target.value)}
            className="rounded-xl border-2 border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-600 outline-none focus:border-[#003f9f] bg-white transition"
          >
            <option value="">All Courses</option>
            {courses.map(c => <option key={c}>{c}</option>)}
          </select>
          <div className="flex items-center text-sm font-semibold text-gray-400 px-2">
            <Filter size={13} className="mr-1" /> {filtered.length} results
          </div>
        </div>

        {/* BSCC note */}
        {stats.bscc > 0 && (
          <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
            💳 <strong>{stats.bscc} students</strong> ने BSCC loan की request की है
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader size={32} className="animate-spin text-[#003f9f]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 py-20 text-center">
            <BookOpen size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="font-semibold text-gray-400">कोई application नहीं मिली</p>
            <p className="text-sm text-gray-300 mt-1">
              जैसे ही students <strong>/apply</strong> page से apply करेंगे, यहाँ दिखेगा
            </p>
            <Link href="/apply" target="_blank" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#003f9f] px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700">
              Apply Page देखें →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(app => (
              <AppCard
                key={app.id}
                app={app}
                onStatusChange={handleStatusChange}
                onNoteSaved={handleNoteSaved}
                isNew={!app.status || app.status === "new"}
              />
            ))}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-gray-400">
          Showing {filtered.length} of {applications.length} applications • Real-time sync
        </p>
      </main>
    </div>
  );
}
