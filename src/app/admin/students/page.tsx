"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap, LogOut, Loader, Users, Phone, MessageCircle,
  Search, AlertCircle, UserCheck, UserX, Mail, MapPin, Calendar,
  BookOpen, ClipboardList, ChevronDown, ChevronUp, Clock,
  CheckCircle2, RefreshCw,
} from "lucide-react";
import { db } from "@/lib/firebase";
import {
  collection, getDocs, query, where, orderBy,
} from "firebase/firestore";
import {
  getAllApplications, updateApplicationStatus,
  type CourseApplication, type ApplicationStatus,
} from "@/services/application-service";

/* ── Types ─────────────────────────────────────── */
interface StudentProfile {
  id: string;
  uid?: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  profileComplete?: boolean;
  createdAt?: any;
  lastLogin?: any;
  enrolledCourses?: string[];
  // joined applications
  applications?: CourseApplication[];
}

const APP_STATUS_META: Record<ApplicationStatus, { label: string; color: string; icon: string }> = {
  new:               { label: "Submitted",          color: "bg-blue-100 text-blue-700",    icon: "🆕" },
  contacted:         { label: "Contacted",           color: "bg-yellow-100 text-yellow-800", icon: "📞" },
  documents_pending: { label: "Docs Pending",        color: "bg-orange-100 text-orange-800", icon: "📄" },
  admission_done:    { label: "Admission Done",      color: "bg-green-100 text-green-700",  icon: "✅" },
  not_interested:    { label: "Not Interested",      color: "bg-gray-100 text-gray-600",    icon: "❌" },
};

/* ── Helpers ─────────────────────────────────── */
function getInitials(name: string) {
  return name ? name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "?";
}

function formatDate(ts: any): string {
  if (!ts) return "—";
  try {
    const d = typeof ts === "number" ? new Date(ts) : ts?.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return "—"; }
}

function timeAgo(ts: any): string {
  const d = ts?.toDate ? ts.toDate() : ts ? (typeof ts === "number" ? new Date(ts) : new Date(ts)) : null;
  if (!d) return "—";
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(ts);
}

/* ── Student Card ─────────────────────────────── */
function StudentCard({
  student, onAppStatusChange,
}: {
  student: StudentProfile;
  onAppStatusChange: (appId: string, status: ApplicationStatus) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const apps = student.applications || [];

  return (
    <div className={`rounded-2xl border-2 bg-white shadow-sm transition overflow-hidden ${expanded ? "border-[#003f9f]" : "border-gray-100 hover:border-blue-200"}`}>
      {/* ── Main row ── */}
      <button onClick={() => setExpanded(e => !e)} className="w-full text-left">
        <div className="flex items-center gap-4 px-5 py-4">
          {/* Avatar */}
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#003f9f] font-headline text-lg font-extrabold text-white">
            {getInitials(student.name)}
          </div>

          {/* Name + email */}
          <div className="flex-1 min-w-0">
            <p className="font-extrabold text-gray-900">{student.name || "Unknown"}</p>
            <p className="text-xs text-gray-400 truncate">{student.email}</p>
            <div className="mt-1 flex flex-wrap gap-1.5 text-xs">
              {student.phone && (
                <span className="text-green-700 font-semibold">📞 {student.phone}</span>
              )}
              {student.lastLogin && (
                <span className="text-gray-400">Last login: {timeAgo(student.lastLogin)}</span>
              )}
            </div>
          </div>

          {/* Apps count */}
          <div className="hidden text-center sm:block">
            <p className="font-headline text-2xl font-extrabold text-[#003f9f]">{apps.length}</p>
            <p className="text-xs text-gray-400">Applications</p>
          </div>

          {/* Profile badge */}
          <span className={`hidden rounded-full px-3 py-1 text-xs font-bold sm:inline ${student.profileComplete ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
            {student.profileComplete ? "✓ Complete" : "Incomplete"}
          </span>

          {/* Joined */}
          <div className="hidden text-right sm:block text-xs text-gray-400">
            <Calendar size={11} className="inline mr-1" />
            {formatDate(student.createdAt)}
          </div>

          {expanded ? <ChevronUp size={16} className="flex-shrink-0 text-gray-400" /> : <ChevronDown size={16} className="flex-shrink-0 text-gray-400" />}
        </div>
      </button>

      {/* ── Expanded ── */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50">
          {/* Contact + Account block */}
          <div className="grid gap-4 p-5 sm:grid-cols-3">
            <div className="rounded-xl bg-white border border-gray-100 p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#003f9f]">Contact</p>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2"><Mail size={13} className="text-gray-400 flex-shrink-0" /> {student.email}</p>
                {student.phone && <p className="flex items-center gap-2"><Phone size={13} className="text-gray-400 flex-shrink-0" /> {student.phone}</p>}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {student.phone && (
                  <>
                    <a href={`tel:+91${student.phone}`} className="flex items-center gap-1 rounded-lg bg-green-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-600">
                      <Phone size={11} /> Call
                    </a>
                    <a
                      href={`https://wa.me/91${student.phone}?text=Hello ${encodeURIComponent(student.name || "")}! Main Siksha Wallah se bol raha hun. Aapke course application ke baare mein baat karni thi.`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-bold text-white hover:bg-green-500"
                    >
                      <MessageCircle size={11} /> WhatsApp
                    </a>
                  </>
                )}
                {student.email && (
                  <a href={`mailto:${student.email}?subject=Siksha Wallah — Admission Update`} className="flex items-center gap-1 rounded-lg bg-purple-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-purple-600">
                    <Mail size={11} /> Email
                  </a>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-white border border-gray-100 p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#003f9f]">Account Info</p>
              <div className="space-y-2 text-xs text-gray-600">
                <p><span className="font-semibold text-gray-400">Joined:</span> {formatDate(student.createdAt)}</p>
                <p><span className="font-semibold text-gray-400">Last Login:</span> {timeAgo(student.lastLogin)}</p>
                <p><span className="font-semibold text-gray-400">Firebase UID:</span> <span className="font-mono text-gray-400">{student.id?.slice(0, 12)}…</span></p>
                <p><span className="font-semibold text-gray-400">Profile:</span> {student.profileComplete ? "✅ Complete" : "⚠️ Incomplete"}</p>
              </div>
            </div>

            <div className="rounded-xl bg-white border border-gray-100 p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#003f9f]">Stats</p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Total Applications</span>
                  <span className="font-extrabold text-[#003f9f] text-base">{apps.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Admission Done</span>
                  <span className="font-bold text-green-600">{apps.filter(a => a.status === "admission_done").length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Pending</span>
                  <span className="font-bold text-yellow-600">{apps.filter(a => !a.status || a.status === "new").length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">BSCC Requests</span>
                  <span className="font-bold text-amber-600">{apps.filter(a => a.bsccRequired).length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Applications */}
          {apps.length > 0 ? (
            <div className="px-5 pb-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">Course Applications ({apps.length})</p>
              <div className="space-y-2">
                {apps.map(app => {
                  const meta = APP_STATUS_META[app.status || "new"];
                  return (
                    <div key={app.id} className="flex items-start gap-4 rounded-xl bg-white border border-gray-100 p-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-bold text-gray-900">{app.course}</span>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${meta.color}`}>{meta.icon} {meta.label}</span>
                          {app.bsccRequired && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">💳 BSCC</span>}
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                          {app.qualification && <span>{app.qualification}</span>}
                          {app.percentage && <span>Marks: {app.percentage}</span>}
                          {app.district && <span><MapPin size={10} className="inline mr-0.5" />{app.district}</span>}
                          {app.mobile && app.mobile !== student.phone && <span>📞 {app.mobile}</span>}
                        </div>
                        {app.note && (
                          <p className="mt-1.5 text-xs text-yellow-700 bg-yellow-50 rounded-lg px-2 py-1">
                            💬 Note: {app.note}
                          </p>
                        )}
                        {app.message && (
                          <p className="mt-1 text-xs text-gray-500 italic">"{app.message}"</p>
                        )}
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-xs text-gray-400 mb-2">{timeAgo(app.createdAt)}</p>
                        <select
                          value={app.status || "new"}
                          onChange={e => app.id && onAppStatusChange(app.id, e.target.value as ApplicationStatus)}
                          className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-semibold outline-none focus:border-blue-400"
                        >
                          {Object.entries(APP_STATUS_META).map(([k, v]) => (
                            <option key={k} value={k}>{v.icon} {v.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="px-5 pb-5">
              <div className="rounded-xl bg-white border border-dashed border-gray-200 py-6 text-center text-xs text-gray-400">
                No course applications yet. Student registered but hasn't applied via /apply.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Main Page ─────────────────────────────────── */
export default function AdminStudentsPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState("Admin");
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"" | "has_app" | "no_app" | "admission_done" | "bscc">("");

  useEffect(() => {
    const session = localStorage.getItem("sw_admin_session");
    const user = localStorage.getItem("sw_admin_user");
    if (!session) { router.replace("/admin/login"); return; }
    setAuthorized(true);
    setAdminUser(user || "Admin");
  }, [router]);

  useEffect(() => { if (authorized) load(); }, [authorized]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      // Load both in parallel
      const [usersSnap, apps] = await Promise.all([
        getDocs(query(collection(db, "users"), where("role", "==", "student"), orderBy("createdAt", "desc"))),
        getAllApplications(),
      ]);

      // Build userId → apps map
      const appsByUserId: Record<string, CourseApplication[]> = {};
      apps.forEach(a => {
        if (a.userId) {
          appsByUserId[a.userId] = appsByUserId[a.userId] || [];
          appsByUserId[a.userId].push(a);
        }
      });

      const studentList: StudentProfile[] = usersSnap.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<StudentProfile, "id" | "applications">),
        applications: appsByUserId[d.id] || [],
      }));

      setStudents(studentList);
    } catch (e: any) {
      // If users collection is blocked by Firestore rules, show what we can
      setError("Firestore rules may need updating. Deploy firestore.rules to allow office access. See instructions below.");
      // Still try to show application data
      try {
        const apps = await getAllApplications();
        // Group by userId, show anonymous apps
        const seen = new Set<string>();
        const fallback: StudentProfile[] = [];
        apps.forEach(a => {
          if (a.userId && !seen.has(a.userId)) {
            seen.add(a.userId);
            fallback.push({
              id: a.userId,
              name: a.fullName,
              email: a.email || "—",
              phone: a.mobile,
              applications: apps.filter(x => x.userId === a.userId),
            });
          }
        });
        setStudents(fallback);
      } catch {}
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("sw_admin_session");
    localStorage.removeItem("sw_admin_user");
    document.cookie = "sw_admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    router.replace("/admin/login");
  }

  function handleAppStatusChange(appId: string, status: ApplicationStatus) {
    updateApplicationStatus(appId, status).catch(() => {});
    setStudents(prev => prev.map(s => ({
      ...s,
      applications: s.applications?.map(a => a.id === appId ? { ...a, status } : a),
    })));
  }

  // Stats
  const stats = useMemo(() => {
    const totalApps = students.reduce((sum, s) => sum + (s.applications?.length || 0), 0);
    const withApps = students.filter(s => (s.applications?.length || 0) > 0).length;
    const admissionDone = students.filter(s => s.applications?.some(a => a.status === "admission_done")).length;
    const bscc = students.filter(s => s.applications?.some(a => a.bsccRequired)).length;
    return { total: students.length, withApps, totalApps, admissionDone, bscc };
  }, [students]);

  // Filter
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return students.filter(s => {
      const matchSearch = !q ||
        s.name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.phone?.includes(q) ||
        s.applications?.some(a =>
          a.course?.toLowerCase().includes(q) ||
          a.district?.toLowerCase().includes(q) ||
          a.mobile?.includes(q)
        );
      const matchFilter = !filterStatus ||
        (filterStatus === "has_app" && (s.applications?.length || 0) > 0) ||
        (filterStatus === "no_app" && (s.applications?.length || 0) === 0) ||
        (filterStatus === "admission_done" && s.applications?.some(a => a.status === "admission_done")) ||
        (filterStatus === "bscc" && s.applications?.some(a => a.bsccRequired));
      return matchSearch && matchFilter;
    });
  }, [students, search, filterStatus]);

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
            <Link href="/admin/dashboard" className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Inquiries</Link>
            <Link href="/admin/applications" className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Applications</Link>
            <Link href="/admin/students" className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-bold text-[#003f9f]">Students</Link>
            <Link href="/admin/activity" className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Activity Log</Link>
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-semibold text-gray-600 sm:block">Welcome, {adminUser}</span>
            <button onClick={handleLogout} className="flex items-center gap-2 rounded-xl border-2 border-gray-200 px-4 py-2 text-sm font-bold text-gray-700 hover:border-red-300 hover:text-red-600 transition">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-headline text-3xl font-extrabold text-gray-900">Registered Students</h1>
            <p className="mt-1 text-sm text-gray-500">सभी registered students + उनकी course applications — full access</p>
          </div>
          <button onClick={load} className="flex items-center gap-2 rounded-xl border-2 border-gray-200 px-4 py-2 text-sm font-bold text-gray-600 hover:border-[#003f9f] transition">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            { label: "Total Registered", value: stats.total,        color: "text-[#003f9f]" },
            { label: "With Applications",value: stats.withApps,    color: "text-blue-700" },
            { label: "Total Apps",        value: stats.totalApps,   color: "text-purple-700" },
            { label: "Admission Done",    value: stats.admissionDone, color: "text-green-700" },
            { label: "BSCC Requested",   value: stats.bscc,         color: "text-amber-700" },
          ].map(s => (
            <div key={s.label} className="rounded-2xl border-2 border-gray-100 bg-white p-4 text-center shadow-sm">
              <p className={`font-headline text-3xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-xs font-semibold text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <p className="font-bold flex items-center gap-2"><AlertCircle size={16} /> Firestore Rules Update Required</p>
            <p className="mt-1 text-xs">
              Firebase console → Firestore → Rules → paste rules from <code className="bg-amber-100 px-1 rounded">firestore.rules</code> file in project root → Publish.
              यह एक बार करना होगा, फिर सब काम करेगा।
            </p>
          </div>
        )}

        {/* Search + Filter */}
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={14} className="absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, mobile, email, course, district..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#003f9f] transition"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as any)}
            className="rounded-xl border-2 border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-700 outline-none focus:border-[#003f9f] bg-white transition"
          >
            <option value="">All Students</option>
            <option value="has_app">Has Application</option>
            <option value="no_app">No Application Yet</option>
            <option value="admission_done">Admission Done</option>
            <option value="bscc">BSCC Requested</option>
          </select>
          <div className="flex items-center text-sm text-gray-400 px-2 font-semibold">
            {filtered.length} students
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader size={32} className="animate-spin text-[#003f9f]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 py-20 text-center">
            <Users size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="font-semibold text-gray-400">कोई student नहीं मिला</p>
            <p className="text-sm text-gray-300 mt-1">
              {error ? "Firebase rules update करें ऊपर दिए instructions से" : "Try different search"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(student => (
              <StudentCard
                key={student.id}
                student={student}
                onAppStatusChange={handleAppStatusChange}
              />
            ))}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-gray-400">
          {filtered.length} of {students.length} students • Click to expand — see applications, call, WhatsApp
        </p>
      </main>
    </div>
  );
}
