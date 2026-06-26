"use client";

import { useEffect, useState, useMemo } from "react";
import { AdminHeader } from "@/components/admin-header";
import { useAdminGuard } from "@/hooks/use-admin-guard";
import {
  Loader, Search, ShieldCheck, ShieldX, Clock, Eye, Download,
  RefreshCw, FileText, Image, StickyNote, X, Save, AlertCircle,
  Filter,
} from "lucide-react";

interface DocRecord {
  id: string;
  uid: string;
  name: string;
  type: string;
  url: string;
  storagePath?: string;
  fileSize?: number;
  mimeType?: string;
  uploadedAt: number;
  status?: "pending" | "approved" | "rejected";
  remarks?: string;
  verifiedAt?: number;
  studentName?: string;
}

function formatDate(ts?: number): string {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function formatSize(bytes?: number): string {
  if (!bytes) return "—";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function StatusBadge({ status }: { status?: string }) {
  if (!status || status === "pending")
    return <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-[11px] font-bold text-yellow-800"><Clock size={10} /> Pending</span>;
  if (status === "approved")
    return <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-bold text-green-800"><ShieldCheck size={10} /> Approved</span>;
  return <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-700"><ShieldX size={10} /> Rejected</span>;
}

function RemarksModal({
  doc,
  action,
  onClose,
  onConfirm,
}: {
  doc: DocRecord;
  action: "approved" | "rejected";
  onClose: () => void;
  onConfirm: (remarks: string) => Promise<void>;
}) {
  const [remarks, setRemarks] = useState(doc.remarks || "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  async function submit() {
    setSaving(true);
    setErr("");
    try {
      await onConfirm(remarks);
      onClose();
    } catch (e: any) {
      setErr(e.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">
            {action === "approved" ? "Approve" : "Reject"} Document
          </h3>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Document: <strong>{doc.name}</strong><br />
          Student: <strong>{doc.studentName || doc.uid}</strong>
        </p>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">
          {action === "rejected" ? "Rejection Reason *" : "Remarks (optional)"}
        </label>
        <textarea
          value={remarks}
          onChange={e => setRemarks(e.target.value)}
          rows={3}
          required={action === "rejected"}
          placeholder={action === "rejected" ? "e.g. Document is blurry, please re-upload..." : "e.g. Verified successfully"}
          className="w-full resize-none rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#003f9f]"
        />
        {err && <p className="mt-2 text-xs text-red-600">{err}</p>}
        <div className="mt-4 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={saving || (action === "rejected" && !remarks.trim())}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white disabled:opacity-60 transition ${
              action === "approved" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {saving ? <Loader size={14} className="animate-spin" /> : action === "approved" ? <ShieldCheck size={14} /> : <ShieldX size={14} />}
            {action === "approved" ? "Approve" : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDocumentsPage() {
  const { authorized } = useAdminGuard();
  const guardLoading = authorized === null;
  const [docs, setDocs] = useState<DocRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [modal, setModal] = useState<{ doc: DocRecord; action: "approved" | "rejected" } | null>(null);

  async function loadDocs() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/documents");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load");
      setDocs(json.data || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!guardLoading) loadDocs();
  }, [guardLoading]);

  async function handleVerify(doc: DocRecord, action: "approved" | "rejected", remarks: string) {
    const res = await fetch("/api/admin/documents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: doc.id, status: action, remarks }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Update failed");
    setDocs(prev => prev.map(d =>
      d.id === doc.id ? { ...d, status: action, remarks, verifiedAt: Date.now() } : d
    ));
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return docs.filter(d => {
      const matchSearch = !q || d.studentName?.toLowerCase().includes(q) || d.name.toLowerCase().includes(q) || d.type.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || (d.status || "pending") === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [docs, search, statusFilter]);

  const counts = useMemo(() => ({
    all: docs.length,
    pending: docs.filter(d => !d.status || d.status === "pending").length,
    approved: docs.filter(d => d.status === "approved").length,
    rejected: docs.filter(d => d.status === "rejected").length,
  }), [docs]);

  if (guardLoading) return <div className="flex min-h-screen items-center justify-center"><Loader className="animate-spin text-[#003f9f]" size={36} /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Document Verification</h1>
            <p className="text-sm text-gray-500 mt-1">Review and verify student-uploaded documents.</p>
          </div>
          <button onClick={loadDocs} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
            <RefreshCw size={15} /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {(["all", "pending", "approved", "rejected"] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-xl border p-3 text-center transition ${statusFilter === s ? "border-[#003f9f] bg-blue-50" : "border-gray-200 bg-white hover:bg-gray-50"}`}
            >
              <p className={`text-xl font-extrabold ${s === "approved" ? "text-green-600" : s === "rejected" ? "text-red-500" : s === "pending" ? "text-yellow-600" : "text-gray-800"}`}>
                {counts[s]}
              </p>
              <p className="text-xs font-semibold text-gray-500 capitalize">{s === "all" ? "Total" : s}</p>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student or document..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#003f9f]"
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 flex gap-3 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16"><Loader className="animate-spin text-[#003f9f]" size={36} /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <FileText size={40} className="text-gray-200 mb-3" />
            <p className="font-semibold text-gray-500">No documents found</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">
                  <th className="px-4 py-3">Document</th>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3">Uploaded</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Remarks</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(doc => (
                  <tr key={doc.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {doc.mimeType?.startsWith("image/") ? (
                          <Image size={16} className="text-blue-500 flex-shrink-0" />
                        ) : (
                          <FileText size={16} className="text-gray-400 flex-shrink-0" />
                        )}
                        <span className="font-semibold text-gray-800 truncate max-w-[140px]">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">{doc.studentName || "—"}</p>
                      <p className="text-[11px] text-gray-400 truncate max-w-[140px]">{doc.uid.slice(0, 8)}…</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-lg bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700">{doc.type}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{formatSize(doc.fileSize)}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{formatDate(doc.uploadedAt)}</td>
                    <td className="px-4 py-3"><StatusBadge status={doc.status} /></td>
                    <td className="px-4 py-3 max-w-[150px]">
                      <p className="text-xs text-gray-500 truncate">{doc.remarks || "—"}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <a href={doc.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 rounded-lg bg-blue-50 border border-blue-200 px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition">
                          <Eye size={11} /> View
                        </a>
                        <button
                          onClick={async () => {
                            try {
                              const blob = await fetch(doc.url).then(r => r.blob());
                              const a = document.createElement('a');
                              a.href = URL.createObjectURL(blob);
                              a.download = `${doc.studentName || doc.uid}_${doc.type}`;
                              a.click();
                              URL.revokeObjectURL(a.href);
                            } catch {
                              window.open(doc.url, '_blank');
                            }
                          }}
                          className="flex items-center gap-1 rounded-lg bg-gray-100 border border-gray-200 px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition">
                          <Download size={11} /> DL
                        </button>
                        {doc.status !== "approved" && (
                          <button
                            onClick={() => setModal({ doc, action: "approved" })}
                            className="flex items-center gap-1 rounded-lg bg-green-50 border border-green-200 px-2 py-1 text-xs font-bold text-green-700 hover:bg-green-100 transition"
                          >
                            <ShieldCheck size={11} /> Approve
                          </button>
                        )}
                        {doc.status !== "rejected" && (
                          <button
                            onClick={() => setModal({ doc, action: "rejected" })}
                            className="flex items-center gap-1 rounded-lg bg-red-50 border border-red-200 px-2 py-1 text-xs font-bold text-red-600 hover:bg-red-100 transition"
                          >
                            <ShieldX size={11} /> Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <RemarksModal
          doc={modal.doc}
          action={modal.action}
          onClose={() => setModal(null)}
          onConfirm={(remarks) => handleVerify(modal.doc, modal.action, remarks)}
        />
      )}
    </div>
  );
}
