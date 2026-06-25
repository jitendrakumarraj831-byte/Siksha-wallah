"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin-header";
import { useAdminGuard } from "@/hooks/use-admin-guard";
import {
  Loader, ArrowLeft,
  Phone, Filter,
  ChevronDown,
} from "lucide-react";
import {
  type Activity,
  type ActivityType,
} from "@/services/activity-service";

// Fetch activities through the cookie-gated Admin SDK API so the `activities`
// collection no longer needs public client read. `before` (millis) pages older.
async function fetchActivities(limit: number, before?: number): Promise<Activity[]> {
  const params = new URLSearchParams({ type: "activities", limit: String(limit) });
  if (before && before > 0) params.set("before", String(before));
  const res = await fetch(`/api/admin/data?${params.toString()}`, {
    cache: "no-store",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to load activities");
  const json = await res.json();
  return (json?.data ?? []) as Activity[];
}

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
  const { authorized, adminUser } = useAdminGuard();

  // Live real-time activities (latest 500)
  const [liveActivities, setLiveActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Older activities loaded on demand
  const [olderActivities, setOlderActivities] = useState<Activity[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [filterType, setFilterType] = useState<"" | ActivityType>("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!authorized) return;
    let stop = false;
    const load = async () => {
      try {
        const data = await fetchActivities(200);
        if (!stop) { setLiveActivities(data); setLoadError(""); }
      } catch {
        if (!stop) setLoadError("Could not load activities. If this persists, check the admin backend at /api/admin/debug.");
      } finally {
        if (!stop) setLoading(false);
      }
    };
    load();
    // Near-real-time: refresh the newest page while the tab is visible.
    const id = setInterval(() => {
      if (document.visibilityState === "visible") load();
    }, 20000);
    return () => { stop = true; clearInterval(id); };
  }, [authorized]);

  const loadMore = useCallback(async () => {
    const allSoFar = [...liveActivities, ...olderActivities];
    const last = allSoFar[allSoFar.length - 1];
    const cursor = typeof last?.createdAt === "number" ? last.createdAt : 0;
    if (!cursor) { setHasMore(false); return; }
    setLoadingMore(true);
    try {
      const older = await fetchActivities(200, cursor);
      if (older.length < 200) setHasMore(false);
      setOlderActivities(prev => [...prev, ...older]);
    } catch {
      /* leave hasMore; user can retry */
    } finally {
      setLoadingMore(false);
    }
  }, [liveActivities, olderActivities]);

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

      <AdminHeader adminUser={adminUser} />

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

        {loadError && (
          <div className="mb-4 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <span className="font-bold">⚠</span>
            <p>{loadError}</p>
          </div>
        )}

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
