"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin-header";
import { useAdminGuard } from "@/hooks/use-admin-guard";
import { adminFetchDataResult, adminUpdate } from "@/lib/admin-api";
import { exportToCsv, datedFilename } from "@/lib/csv-export";
import {
  Loader, Users, Phone,
  CheckCircle2, MessageCircle, Clock,
  AlertCircle, RefreshCw, StickyNote, X, Save, Search, Download,
  FileText, ShieldCheck, ArrowRight, ChevronDown, ChevronUp,
} from "lucide-react";
import {
  getAllInquiries,
  type Inquiry, type InquiryStatus,
} from "@/services/inquiry-service";
import {
  getAllApplications, type CourseApplication, type ApplicationStatus,
} from "@/services/application-service";
import { receiptNo } from "@/lib/receipt";
import {
  summarizeOffice, OFFICE_BUCKET_META, OFFICE_BUCKET_ORDER,
  type OfficeBucket, type DocLike, type OfficeApplicationRow,
} from "@/lib/admission-journey";

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

/* ── Action-queue tile colours (mapped from the bucket's semantic tone) ── */
const TONE_TILE: Record<string, { bg: string; text: string; ring: string }> = {
  warn:    { bg: "bg-orange-50",  text: "text-orange-600",  ring: "ring-orange-200" },
  active:  { bg: "bg-blue-50",    text: "text-blue-600",    ring: "ring-blue-200" },
  info:    { bg: "bg-violet-50",  text: "text-violet-600",  ring: "ring-violet-200" },
  success: { bg: "bg-green-50",   text: "text-green-600",   ring: "ring-green-200" },
  muted:   { bg: "bg-gray-50",    text: "text-gray-500",    ring: "ring-gray-200" },
};

/* ── Inquiry staff-note popover (unchanged behaviour) ── */
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

/* ── A single application row in the action queue ── */
function QueueRow({ row, onAdvance, busy }: {
  row: OfficeApplicationRow;
  onAdvance: (id: string, status: ApplicationStatus) => void;
  busy: boolean;
}) {
  const { app, triage } = row;
  const wa = `https://wa.me/91${app.mobile}?text=${encodeURIComponent(`Hi ${app.fullName}! Main Siksha Wallah se bol raha/rahi hun. Aapne ${app.course} ke liye apply kiya hai (${triage.receipt}).`)}`;

  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-3.5">
      {/* Identity */}
      <div className="flex min-w-[180px] flex-1 items-center gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#003f9f] font-bold text-white">
          {app.fullName?.[0]?.toUpperCase() || "?"}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-gray-900">{app.fullName}</p>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[11px] font-bold text-blue-700">{app.course}</span>
            <span className="font-mono text-[10px] font-bold text-gray-400">{triage.receipt}</span>
          </div>
        </div>
      </div>

      {/* Reason */}
      <div className="min-w-[150px] flex-1">
        <p className="text-xs font-semibold text-gray-600">{triage.reason}</p>
        <p className="text-[11px] text-gray-400">{formatDate(app.createdAt)}</p>
      </div>

      {/* Actions — one tap each */}
      <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
        <a href={`tel:+91${app.mobile}`} className="inline-flex items-center gap-1.5 rounded-lg bg-green-500 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-green-600 transition">
          <Phone size={12} /> Call
        </a>
        <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-2.5 py-1.5 text-xs font-bold text-white hover:bg-green-500 transition">
          <MessageCircle size={12} /> WA
        </a>

        {triage.bucket === "verify_docs" && (
          <Link href="/admin/documents" className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-orange-600 transition">
            <ShieldCheck size={12} /> Verify
          </Link>
        )}
        {triage.bucket === "needs_action" && (
          <button disabled={busy} onClick={() => app.id && onAdvance(app.id, "contacted")}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#003f9f] px-2.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition disabled:opacity-60">
            <CheckCircle2 size={12} /> Mark Contacted
          </button>
        )}
        {triage.bucket === "follow_up" && (
          <button disabled={busy} onClick={() => app.id && onAdvance(app.id, "documents_pending")}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-amber-600 transition disabled:opacity-60">
            <FileText size={12} /> Request Docs
          </button>
        )}
        {triage.bucket === "admission_waiting" && (
          <button disabled={busy} onClick={() => app.id && onAdvance(app.id, "admission_done")}
            className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-green-700 transition disabled:opacity-60">
            <CheckCircle2 size={12} /> Confirm Admission
          </button>
        )}
        <Link href="/admin/applications" className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-bold text-gray-600 hover:border-[#003f9f] hover:text-[#003f9f] transition">
          View <ArrowRight size={11} />
        </Link>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { authorized, adminUser } = useAdminGuard();

  // Admission pipeline (applications + documents) — powers the action queue.
  const [applications, setApplications] = useState<CourseApplication[]>([]);
  const [docsByUser, setDocsByUser] = useState<Record<string, DocLike[]>>({});
  const [activeBucket, setActiveBucket] = useState<OfficeBucket>("verify_docs");
  const [advancing, setAdvancing] = useState<string | null>(null);

  // Phone / walk-in leads (inquiries) — unchanged lead capture.
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [showLeads, setShowLeads] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"" | InquiryStatus>("");
  const [filterToday, setFilterToday] = useState(false);
  const queueRef = useRef<HTMLDivElement>(null);
  const leadsRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (authorized) loadAll(); }, [authorized]);

  async function loadAll() {
    setLoading(true);
    const [inqRes, appRes] = await Promise.all([
      adminFetchDataResult<Inquiry[]>("inquiries", getAllInquiries),
      adminFetchDataResult<CourseApplication[]>("applications", getAllApplications),
    ]);
    setInquiries(inqRes.data);
    setApplications(appRes.data);
    setError(inqRes.ok && appRes.ok ? "" : (inqRes.error || appRes.error || "Data load नहीं हो पाया।"));

    // Documents — group by uid so each application can read its student's state.
    try {
      const dres = await fetch("/api/admin/data?type=documents", { cache: "no-store", credentials: "include" });
      if (dres.ok) {
        const dj = await dres.json().catch(() => null);
        if (dj?.success && Array.isArray(dj.data)) {
          const map: Record<string, DocLike[]> = {};
          for (const d of dj.data as (DocLike & { uid?: string })[]) {
            if (d.uid) (map[d.uid] ||= []).push(d);
          }
          setDocsByUser(map);
        }
      }
    } catch { /* documents are best-effort; queue still works without them */ }

    setLoading(false);
  }

  // Office triage — the five buckets, derived purely from existing data.
  const summary = useMemo(() => summarizeOffice(applications, docsByUser), [applications, docsByUser]);

  // Pick the first non-empty bucket as the default focus after each load.
  useEffect(() => {
    if (loading) return;
    const firstWithItems = OFFICE_BUCKET_ORDER.find(b => summary.counts[b] > 0);
    if (firstWithItems) setActiveBucket(firstWithItems);
  }, [loading, summary]);

  async function advanceApplication(id: string, status: ApplicationStatus) {
    setAdvancing(id);
    const snapshot = applications;
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    try {
      await adminUpdate("course_applications", id, { status });
    } catch (e) {
      setApplications(snapshot);
      setError(e instanceof Error ? e.message : "Status update नहीं हो पाया।");
    } finally {
      setAdvancing(null);
    }
  }

  /* ── Inquiry handlers (unchanged) ── */
  async function handleStatusChange(id: string, status: InquiryStatus) {
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
  function exportCsv() {
    exportToCsv<Inquiry>(datedFilename("inquiries"), [
      { key: "fullName", label: "Name" },
      { key: "mobile", label: "Mobile" },
      { key: "email", label: "Email" },
      { key: "course", label: "Course" },
      { key: "qualification", label: "Qualification" },
      { label: "Status", value: (i) => STATUS_META[(i.status || "pending") as InquiryStatus]?.label || "Pending" },
      { key: "note", label: "Note" },
      { label: "Date", value: (i) => formatDate(i.createdAt) },
    ], filteredInquiries);
  }

  const totalLeads   = inquiries.length;
  const todayLeads    = inquiries.filter(i => isToday(i.createdAt)).length;
  const pendingLeads = inquiries.filter(i => !i.status || i.status === "pending").length;

  const filteredInquiries = useMemo(() => inquiries.filter(inq => {
    const statusMatch = !filterStatus || (inq.status || "pending") === filterStatus;
    const todayMatch = !filterToday || isToday(inq.createdAt);
    const q = search.trim().toLowerCase();
    const searchMatch = !q ||
      inq.fullName?.toLowerCase().includes(q) ||
      inq.mobile?.includes(q) ||
      inq.email?.toLowerCase().includes(q) ||
      inq.course?.toLowerCase().includes(q) ||
      inq.qualification?.toLowerCase().includes(q);
    return statusMatch && todayMatch && searchMatch;
  }), [inquiries, filterStatus, filterToday, search]);

  function focusBucket(b: OfficeBucket) {
    setActiveBucket(b);
    setTimeout(() => queueRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  if (authorized === null) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Loader className="animate-spin text-[#003f9f]" size={40} />
    </div>
  );

  const activeRows = summary.rows[activeBucket] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader adminUser={adminUser} />

      <main className="mx-auto max-w-5xl px-4 py-8">

        {/* Heading */}
        <div className="mb-5">
          <h1 className="font-headline text-2xl font-extrabold text-gray-900">Today&apos;s Work</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {summary.actionableToday > 0
              ? <>You have <strong className="text-[#003f9f]">{summary.actionableToday}</strong> {summary.actionableToday === 1 ? "student" : "students"} that need action.</>
              : "All caught up — no pending admission actions right now."}
          </p>
        </div>

        {error && (
          <div className="mb-4 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <p className="flex-1">{error}</p>
            <button onClick={() => setError("")}><X size={16} /></button>
          </div>
        )}

        {/* ── ACTION-QUEUE TILES (the 5 office questions) ── */}
        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {OFFICE_BUCKET_ORDER.map(bucket => {
            const meta = OFFICE_BUCKET_META[bucket];
            const tile = TONE_TILE[meta.tone] || TONE_TILE.muted;
            const active = activeBucket === bucket;
            return (
              <button key={bucket} onClick={() => focusBucket(bucket)}
                className={`rounded-2xl border-2 bg-white p-3.5 text-left shadow-sm transition active:scale-95 ${active ? `${tile.ring} ring-2 border-transparent` : "border-gray-100 hover:border-gray-200"}`}>
                <p className={`text-2xl font-extrabold ${tile.text}`}>{summary.counts[bucket]}</p>
                <p className="mt-0.5 text-[11px] font-bold leading-tight text-gray-700">{meta.label}</p>
                <p className="mt-1 hidden text-[10px] text-gray-400 sm:block">{meta.question}</p>
              </button>
            );
          })}
        </div>

        {/* ── ACTIVE BUCKET LIST ── */}
        <div ref={queueRef} className="mb-8 rounded-2xl border-2 border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-5 py-3">
            <h2 className="font-extrabold text-gray-800">{OFFICE_BUCKET_META[activeBucket].label}</h2>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-gray-400">{activeRows.length} {activeRows.length === 1 ? "student" : "students"}</span>
              <button onClick={loadAll} className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-bold text-gray-600 hover:border-[#003f9f] hover:text-[#003f9f] transition">
                <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader size={30} className="animate-spin text-[#003f9f]" /></div>
          ) : activeRows.length === 0 ? (
            <div className="py-14 text-center text-gray-400">
              <CheckCircle2 size={30} className="mx-auto mb-2 text-green-300" />
              <p className="font-semibold">Nothing here right now 🎉</p>
              <p className="text-xs text-gray-300 mt-0.5">{OFFICE_BUCKET_META[activeBucket].question}</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {activeRows.map(row => (
                <QueueRow key={row.app.id} row={row} onAdvance={advanceApplication} busy={advancing === row.app.id} />
              ))}
            </div>
          )}
        </div>

        {/* ── PHONE / WALK-IN LEADS (inquiries) — secondary, collapsible ── */}
        <div ref={leadsRef} className="rounded-2xl border-2 border-gray-100 bg-white shadow-sm">
          <button onClick={() => setShowLeads(s => !s)}
            className="flex w-full items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                <Users size={18} className="text-[#003f9f]" />
              </div>
              <div className="text-left">
                <h2 className="font-extrabold text-gray-800">Phone &amp; Walk-in Leads</h2>
                <p className="text-xs text-gray-400">
                  {totalLeads} total · {pendingLeads} need a call{todayLeads > 0 ? ` · ${todayLeads} today` : ""}
                </p>
              </div>
            </div>
            {showLeads ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
          </button>

          {showLeads && (
            <div className="border-t border-gray-100 px-4 pb-5 pt-4 sm:px-5">
              {/* Search + Filter + Export */}
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <div className="relative min-w-[200px] flex-1">
                  <Search size={15} className="absolute left-3.5 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="नाम, mobile, course से search करें..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-[#003f9f]"
                  />
                </div>
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
                <button onClick={exportCsv} disabled={filteredInquiries.length === 0}
                  className="ml-auto flex items-center gap-2 rounded-xl border-2 border-gray-200 px-4 py-2 text-sm font-bold text-gray-600 hover:border-green-500 hover:text-green-600 transition disabled:opacity-50"
                  title="Export current list to CSV">
                  <Download size={13} /> Export CSV
                </button>
              </div>

              {filteredInquiries.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <Users size={28} className="mx-auto mb-2 text-gray-300" />
                  <p className="font-semibold">कोई lead नहीं मिली</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredInquiries.map(inq => {
                    const st = (inq.status || "pending") as InquiryStatus;
                    const { color } = STATUS_META[st];
                    const isNew = st === "pending" && isToday(inq.createdAt);
                    return (
                      <div key={inq.id} className={`flex flex-wrap items-start gap-3 px-1 py-4 transition ${isNew ? "bg-amber-50/40" : ""}`}>
                        <div className="flex min-w-[160px] flex-1 items-center gap-3">
                          <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#003f9f] font-bold text-white">
                            {inq.fullName?.[0]?.toUpperCase() || "?"}
                            {isNew && <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-amber-400 border-2 border-white" />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 text-sm">{inq.fullName}</p>
                            <p className="text-xs text-gray-400">{formatDate(inq.createdAt)}</p>
                          </div>
                        </div>

                        <div className="min-w-[110px]">
                          <span className="rounded-lg bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-800">{inq.course || "—"}</span>
                          <p className="mt-1 text-xs text-gray-400">{inq.qualification || "—"}</p>
                        </div>

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

                        <div className="flex-shrink-0">
                          <NoteCell inq={inq} onSaved={handleNoteSaved} />
                        </div>

                        <div className="ml-auto flex flex-shrink-0 items-center gap-2">
                          <a href={`tel:+91${inq.mobile}`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-green-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-600 transition">
                            <Phone size={12} /> {inq.mobile}
                          </a>
                          <a
                            href={`https://wa.me/91${inq.mobile}?text=नमस्ते%20${encodeURIComponent(inq.fullName)}%20जी!%20मैं%20Siksha%20Wallah%20से%20बोल%20रहा/रही%20हूँ।%20आपने%20${encodeURIComponent(inq.course || "admission")}%20के%20लिए%20inquiry%20की%20थी।`}
                            target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-bold text-white hover:bg-green-500 transition"
                          >
                            <MessageCircle size={12} /> WA
                          </a>
                        </div>

                        {inq.note && (
                          <div className="mt-1 w-full rounded-lg bg-amber-50 border border-amber-100 px-3 py-1.5 text-xs text-amber-800">
                            📝 {inq.note}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
