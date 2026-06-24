"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap, LogOut, Loader, ArrowLeft,
  Phone, Filter, RefreshCw, LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import {
  subscribeActivities,
  getActivitiesAfter,
  type Activity,
  type ActivityType,
} from "@/services/activity-service";

const TYPE_META: Record<ActivityType, { icon: string; label: string; color: string; detailLink?: (act: Activity) => string }> = {
  inquiry:        { icon: "📋", label: "Inquiry",          color: "bg-blue-100 text-blue-800 border-blue-200",       detailLink: () => "/admin/dashboard" },
  contact:        { icon: "📝", label: "Contact Form",     color: "bg-blue-100 text-blue-800 border-blue-200" },
  registration:   { icon: "👤", label: "Student Register", color: "bg-green-100 text-green-800 border-green-200",    detailLink: () => "/admin/students" },
  student_login:  { icon: "🔑", label: "Student Login",    color: "bg-gray-100 text-gray-700 border-gray-200",       detailLink: () => "/admin/students" },
  application:    { icon: "🎓", label: "Application",      color: "bg-blue-100 text-blue-800 border-blue-200",       detailLink: () => "/admin/applications" },
  doc_upload:     { icon: "📄", label: "Doc Upload",       color: "bg-blue-100 text-blue-800 border-blue-200",       detailLink: () => "/admin/students" },
  profile_update: { icon: "✏️",  label: "Profile Update",  color: "bg-amber-100 text-amber-800 border-amber-200",    detailLink: () => "/admin/students" },
  whatsapp:       { icon: "💬", label: "WhatsApp Click",   color: "bg-green-100 text-green-800 border-green-200" },
  call_click:     { icon: "📞", label: "Call Click",       color: "bg-green-100 text-green-800 border-green-200" },
  course_view:    { icon: "📚", label: "Course View",      color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
};

function timeAgo(ts: any): string {
  const d = ts?.toDate ? ts.toDate() : ts ? new Date(ts) : null;
  if (!d) return "";
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function isToday(ts: any): boolean {
  const d = ts?.toDate ? ts.toDate() : ts ? new Date(ts) : null;
  if (!d) return false;
  const t = new Date();
  return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
}

export default function ActivityPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState("Admin");

  // Live real-time activities (latest 500)
  const [liveActivities, setLiveActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  // Older activities loaded on demand
  const [olderActivities, setOlderActivities] = useState<Activity[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [filterType, setFilterType] = useState<"" | ActivityType>("");
  const [search, setSearch] = useState("");

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
    const unsub = subscribeActivities(500, (data) => {
      setLiveActivities(data);
      setLoading(false);
    });
    return () => unsub();
  }, [authorized]);

  const loadMore = useCallback(async () => {
    const allSoFar = [...liveActivities, ...olderActivities];
    const last = allSoFar[allSoFar.length - 1];
    if (!last?.createdAt) return;
    setLoadingMore(true);
    const older = await getActivitiesAfter(last.createdAt, 200);
    if (older.length < 200) setHasMore(false);
    setOlderActivities(prev => [...prev, ...older]);
    setLoadingMore(false);
  }, [liveActivities, olderActivities]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    localStorage.removeItem("sw_admin_session");
    localStorage.removeItem("sw_admin_user");
    router.replace("/admin/login");
  }

  // Merge live + older
  const allActivities = useMemo(() => {
    const seen = new Set<string>();
    return [...liveActivities, ...olderActivities].filter(a => {
      if (!a.id || seen.has(a.id)) return false;
      seen.add(a.id);
      return true;
    });
  }, [liveActivities, olderActivities]);

  // Counts per type (all)
  const counts = useMemo(() => {
    const map: Partial<Record<ActivityType, number>> = {};
    allActivities.forEach(a => { map[a.type] = (map[a.type] || 0) + 1; });
    return map;
  }, [allActivities]);

  const todayCount = useMemo(() => allActivities.filter(a => isToday(a.createdAt)).length, [allActivities]);

  const filtered = useMemo(() => {
    return allActivities.filter(a => {
      const matchType = !filterType || a.type === filterType;
      const q = search.toLowerCase();
      const matchSearch = !q ||
        a.title?.toLowerCase().includes(q) ||
        a.description?.toLowerCase().includes(q) ||
        a.name?.toLowerCase().includes(q) ||
        a.mobile?.includes(q) ||
        a.email?.toLowerCase().includes(q);
      return matchType && matchSearch;
    });
  }, [allActivities, filterType, search]);

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
            <Link href="/admin/students" className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Students</Link>
            <Link href="/admin/applications" className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Applications</Link>
            <Link href="/admin/activity" className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-bold text-[#003f9f]">Website Activity</Link>
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
        <div className="mb-6">
          <Link href="/admin/dashboard" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#003f9f] hover:underline mb-3">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
                </span>
                <h1 className="font-headline text-3xl font-extrabold text-gray-900">Website & Student Activity</h1>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Har activity real-time me dikhti hai — inquiries, registrations, logins, applications, WhatsApp & call clicks
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl border-2 border-gray-100 bg-white px-4 py-2 text-center">
                <p className="text-2xl font-extrabold text-[#003f9f]">{allActivities.length}</p>
                <p className="text-xs text-gray-400 font-semibold">Total</p>
              </div>
              <div className="rounded-xl border-2 border-green-100 bg-green-50 px-4 py-2 text-center">
                <p className="text-2xl font-extrabold text-green-600">{todayCount}</p>
                <p className="text-xs text-gray-400 font-semibold">Today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity type filter chips */}
        <div className="mb-5 flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType("")}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition ${!filterType ? "bg-[#003f9f] text-white border-[#003f9f]" : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"}`}
          >
            All Types
            <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-xs">{allActivities.length}</span>
          </button>
          {(Object.entries(TYPE_META) as [ActivityType, typeof TYPE_META[ActivityType]][]).map(([type, meta]) => (
            <button
              key={type}
              onClick={() => setFilterType(filterType === type ? "" : type)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition ${filterType === type ? meta.color + " ring-2 ring-offset-1 ring-current" : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"}`}
            >
              {meta.icon} {meta.label}
              {counts[type] ? <span className="ml-0.5 rounded-full bg-white/60 px-1.5 py-0.5 text-xs">{counts[type]}</span> : null}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-4 flex gap-3">
          <input
            type="text"
            placeholder="Name, mobile, email se search karein..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#003f9f] transition"
          />
          <div className="flex items-center gap-1.5 text-sm text-gray-400 font-semibold whitespace-nowrap">
            <Filter size={13} /> {filtered.length} results
          </div>
        </div>

        {/* Activity list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size={32} className="animate-spin text-[#003f9f]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
            <p className="font-semibold text-gray-400">Koi activity nahi mili</p>
            <p className="text-sm text-gray-300 mt-1">Jab visitors website use karenge tab activities yahan aayengi</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {filtered.map(act => {
                const meta = TYPE_META[act.type] || { icon: "📌", label: "Activity", color: "bg-gray-100 text-gray-700 border-gray-200" };
                const today = isToday(act.createdAt);
                return (
                  <div key={act.id} className={`flex items-start gap-4 rounded-2xl border-2 bg-white px-5 py-4 shadow-sm hover:border-blue-100 transition ${today ? "border-blue-100" : "border-gray-100"}`}>
                    {/* Type icon */}
                    <div className={`flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl border text-lg ${meta.color}`}>
                      {meta.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <p className="font-bold text-gray-900">{act.title}</p>
                        <span className={`rounded-full border px-2 py-0.5 text-xs font-bold ${meta.color}`}>
                          {meta.label}
                        </span>
                        {today && (
                          <span className="rounded-full bg-green-100 border border-green-200 px-2 py-0.5 text-xs font-bold text-green-700">
                            Today
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{act.description}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                        {act.name && <span className="font-semibold text-gray-600">👤 {act.name}</span>}
                        {act.mobile && (
                          <a href={`tel:+91${act.mobile}`} className="inline-flex items-center gap-1 font-bold text-green-600 hover:underline">
                            <Phone size={11} /> {act.mobile}
                          </a>
                        )}
                        {act.email && <span className="text-gray-500">✉ {act.email}</span>}
                        {act.course && <span className="rounded-lg bg-blue-50 px-2 py-0.5 font-semibold text-blue-700">{act.course}</span>}
                        {act.page && <span>📍 {act.page}</span>}
                      </div>
                    </div>

                    {/* Time + View */}
                    <div className="flex-shrink-0 text-right flex flex-col items-end gap-1.5">
                      <p className="text-xs font-semibold text-gray-500 whitespace-nowrap">{timeAgo(act.createdAt)}</p>
                      {meta.detailLink && (
                        <Link
                          href={meta.detailLink(act)}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#003f9f] px-2.5 py-1 text-xs font-bold text-white hover:bg-blue-700 transition"
                        >
                          View →
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More */}
            <div className="mt-6 text-center">
              {hasMore ? (
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 hover:border-[#003f9f] hover:text-[#003f9f] transition disabled:opacity-60"
                >
                  {loadingMore
                    ? <><Loader size={15} className="animate-spin" /> Loading older activities…</>
                    : <><ChevronDown size={15} /> Load Older Activities</>
                  }
                </button>
              ) : (
                <p className="text-xs text-gray-400 font-semibold">All activities loaded — {allActivities.length} total</p>
              )}
            </div>
          </>
        )}

        <p className="mt-4 text-center text-xs text-gray-400">
          Showing {filtered.length} of {allActivities.length} activities • Live updates enabled
        </p>

      </main>
    </div>
  );
}
