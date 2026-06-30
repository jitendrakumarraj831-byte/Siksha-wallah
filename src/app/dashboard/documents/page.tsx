'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { studentService, type Document, type DocumentVerificationStatus } from '@/services/student-service';
import { PortalShell } from '@/components/portal-shell';
import {
  ArrowLeft, Loader, AlertCircle, CheckCircle2, Upload, Trash2,
  Eye, FileText, X, Clock, ShieldCheck, ShieldX, RefreshCw, FileUp,
} from 'lucide-react';

// ── Single-PDF document upload ──────────────────────────────────────────────
// Students combine ALL required documents into ONE PDF and upload it here.
// Only PDF is accepted and the file must be 2 MB or smaller. The Cloudinary →
// Firestore → office-verification workflow is unchanged: this still goes through
// studentService.uploadDocumentFile + /api/student/documents, and the office
// previews/downloads/verifies the saved PDF exactly as before.
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const COMBINED_TYPE = 'all_documents'; // the single combined-PDF record
const SIZE_ERROR = 'Please upload a single PDF containing all required documents. Maximum allowed size is 2 MB.';
const TYPE_ERROR = 'Only PDF files are allowed. Please upload a single PDF containing all required documents.';

// Guidance only — what the student should combine into the one PDF.
const RECOMMENDED_DOCS = [
  'Aadhaar Card', '10th Marksheet', '12th Marksheet', 'Graduation Marksheet (if any)',
  'Passport Photo', 'Signature', 'Caste / Income / Domicile (if any)',
];

function isPdf(file: File): boolean {
  // Some mobile pickers report an empty/odd MIME type, so accept when EITHER the
  // MIME type OR the filename extension says PDF.
  if (file.type === 'application/pdf') return true;
  return file.name.toLowerCase().endsWith('.pdf');
}

function formatSize(bytes?: number): string {
  if (bytes === undefined || bytes === null) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function statusBadge(status?: DocumentVerificationStatus) {
  if (!status || status === 'pending') return { label: 'Pending Review', cls: 'bg-yellow-100 text-yellow-800', icon: Clock };
  if (status === 'approved') return { label: 'Approved', cls: 'bg-green-100 text-green-800', icon: ShieldCheck };
  return { label: 'Rejected', cls: 'bg-red-100 text-red-800', icon: ShieldX };
}

export default function DocumentsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [globalError, setGlobalError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectError, setSelectError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadDocuments = useCallback(async () => {
    if (!user) return;
    try {
      const docs = await studentService.getDocuments(user.uid);
      setDocuments(docs);
    } catch (e: any) {
      setGlobalError(e.message);
    } finally {
      setPageLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) { router.push('/auth/login'); return; }
    if (!user) return;
    loadDocuments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated, user]);

  // Poll every 30 s so verification status changes from the office appear here.
  useEffect(() => {
    if (!user) return;
    const id = setInterval(() => { loadDocuments(); }, 30_000);
    return () => clearInterval(id);
  }, [user, loadDocuments]);

  const combinedDoc = documents.find(d => d.type === COMBINED_TYPE);
  // Any documents from the older per-type uploader stay visible (read-only) so
  // nothing a student uploaded earlier is lost.
  const legacyDocs = documents.filter(d => d.type !== COMBINED_TYPE);
  const isApprovedLocked = combinedDoc?.status === 'approved';
  const canUpload = !!selectedFile && !selectError && !uploading && !isApprovedLocked;

  function validateAndSet(file: File | undefined) {
    if (!file) return;
    // Client-side validation (server validates again in /api/student/documents).
    if (!isPdf(file)) { setSelectError(TYPE_ERROR); setSelectedFile(null); return; }
    if (file.size > MAX_FILE_SIZE) { setSelectError(SIZE_ERROR); setSelectedFile(null); return; }
    setSelectError('');
    setSelectedFile(file);
  }

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    setSuccessMsg('');
    setGlobalError('');
    validateAndSet(e.target.files?.[0]);
    // Reset so selecting the same file again still fires onChange.
    if (inputRef.current) inputRef.current.value = '';
  }

  function clearSelection() {
    setSelectedFile(null);
    setSelectError('');
    setProgress(0);
  }

  async function handleUpload() {
    if (!user || !canUpload || !selectedFile) return;
    setUploading(true);
    setProgress(0);
    setGlobalError('');
    try {
      await studentService.uploadDocumentFile(user.uid, selectedFile, selectedFile.name, COMBINED_TYPE, setProgress);
      setSuccessMsg('Upload Successful');
      setSelectedFile(null);
      await loadDocuments();
    } catch (e: any) {
      setGlobalError(e.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  async function handleDelete() {
    if (!user || !combinedDoc?.id) return;
    if (!confirm('Delete your uploaded PDF? You can upload a new one afterwards.')) return;
    try {
      await studentService.deleteDocument(combinedDoc.id, user.uid, combinedDoc.publicId);
      setSuccessMsg('');
      await loadDocuments();
    } catch (e: any) {
      setGlobalError(e.message);
    }
  }

  if (authLoading || pageLoading) {
    return (
      <PortalShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader className="animate-spin text-blue-600" size={40} />
        </div>
      </PortalShell>
    );
  }

  if (!isAuthenticated) return null;

  const badge = statusBadge(combinedDoc?.status);
  const StatusIcon = badge.icon;

  return (
    <PortalShell>
      <div className="min-h-screen bg-gray-50 pb-12">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#00102e] via-[#001f6b] to-[#003f9f] px-4 py-8">
          <div className="container-shell max-w-3xl">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-blue-300 hover:text-white text-sm font-semibold mb-4">
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
            <h1 className="text-2xl font-extrabold text-white">Document Upload</h1>
            <p className="text-blue-300 text-sm mt-1">
              Combine all your documents into <strong className="text-white">one PDF</strong> and upload it here. Only PDF · Maximum 2 MB.
            </p>
            {combinedDoc && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
                <StatusIcon size={14} className="text-white" />
                <span className="text-xs font-bold text-white">Current status:</span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${badge.cls}`}>
                  {badge.label}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="container-shell max-w-3xl -mt-4 relative">
          {globalError && (
            <div className="mb-4 flex gap-3 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" /> {globalError}
              <button onClick={() => setGlobalError('')} className="ml-auto flex-shrink-0"><X size={16} /></button>
            </div>
          )}
          {successMsg && (
            <div className="mb-4 flex items-center gap-3 rounded-xl bg-green-50 border border-green-200 p-4 text-sm font-semibold text-green-700">
              <CheckCircle2 size={18} className="flex-shrink-0" /> {successMsg}
            </div>
          )}

          {/* Current uploaded PDF */}
          {combinedDoc && (
            <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">Your uploaded document</p>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
                    <FileText size={22} className="text-blue-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-gray-900">{combinedDoc.name}</p>
                    <p className="text-xs text-gray-400">{formatSize(combinedDoc.fileSize)} · PDF</p>
                    <span className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${badge.cls}`}>
                      <StatusIcon size={10} /> {badge.label}
                    </span>
                    {combinedDoc.status === 'rejected' && combinedDoc.remarks && (
                      <p className="mt-1.5 text-xs text-red-600">Reason: {combinedDoc.remarks}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <a href={combinedDoc.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition">
                    <Eye size={12} /> View
                  </a>
                  {!isApprovedLocked && (
                    <button onClick={handleDelete}
                      className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition">
                      <Trash2 size={12} /> Delete
                    </button>
                  )}
                  {isApprovedLocked && (
                    <span className="text-xs font-semibold text-green-600">Locked ✓</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Uploader — hidden once the PDF is approved (locked) */}
          {isApprovedLocked ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-sm text-green-800">
              <p className="flex items-center gap-2 font-bold"><ShieldCheck size={16} /> Your document is verified and approved.</p>
              <p className="mt-1 text-xs">Approved documents are locked. To change anything, please contact the office.</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="mb-3 text-sm font-bold text-gray-900">
                {combinedDoc ? 'Replace your PDF' : 'Upload your documents (single PDF)'}
              </p>

              <div className="mb-3 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-[12px] font-semibold text-blue-700">
                ⚠️ Only <strong>PDF</strong> format · Maximum <strong>2 MB</strong> · One single file containing all documents.
              </div>

              {/* Select button */}
              <label className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#003f9f]/50 bg-blue-50/40 px-4 py-8 text-center cursor-pointer hover:bg-blue-50 transition ${uploading ? 'opacity-70 pointer-events-none' : ''}`}>
                <FileUp size={28} className="text-[#003f9f]" />
                <p className="text-sm font-extrabold text-[#003f9f]">Select your PDF</p>
                <p className="text-xs text-gray-500">Click to choose a single PDF (all documents combined)</p>
                <input
                  ref={inputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  disabled={uploading}
                  onChange={handleSelect}
                />
              </label>

              {/* Recommended documents guidance */}
              <div className="mt-3 text-xs text-gray-500">
                <p className="mb-1 font-semibold text-gray-600">📋 Include these in your PDF:</p>
                <div className="flex flex-wrap gap-1.5">
                  {RECOMMENDED_DOCS.map(d => (
                    <span key={d} className="rounded-md border border-gray-200 bg-white px-2 py-0.5 text-[11px] font-medium text-gray-600">{d}</span>
                  ))}
                </div>
              </div>

              {/* Selection error */}
              {selectError && (
                <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-xs font-semibold text-red-700">
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" /> {selectError}
                </div>
              )}

              {/* Selected file preview — name + size shown before upload */}
              {selectedFile && !selectError && (
                <div className="mt-3 rounded-xl border border-green-300 bg-green-50 px-3 py-3">
                  <div className="flex items-center gap-2.5">
                    <FileText size={18} className="flex-shrink-0 text-green-600" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-bold text-gray-800">{selectedFile.name}</p>
                      <p className="text-[11px] font-semibold text-green-700">{formatSize(selectedFile.size)} · ready to upload</p>
                    </div>
                    {!uploading && (
                      <button onClick={clearSelection} aria-label="Remove selected file"
                        className="flex-shrink-0 flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-[11px] font-bold text-gray-500 hover:bg-gray-100 transition">
                        <X size={12} /> Remove
                      </button>
                    )}
                  </div>
                  {uploading && (
                    <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-green-100">
                      <div className="h-full rounded-full bg-green-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                  )}
                </div>
              )}

              {/* Upload button — disabled until a valid PDF is selected */}
              <button
                onClick={handleUpload}
                disabled={!canUpload}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#003f9f] py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading ? (
                  <><Loader size={16} className="animate-spin" /> Uploading… {progress}%</>
                ) : combinedDoc ? (
                  <><RefreshCw size={16} /> Replace PDF</>
                ) : (
                  <><Upload size={16} /> Upload PDF</>
                )}
              </button>
            </div>
          )}

          {/* Earlier per-type uploads (read-only) — only if the student has any */}
          {legacyDocs.length > 0 && (
            <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">Earlier uploads</p>
              <div className="space-y-2">
                {legacyDocs.map(doc => {
                  const lb = statusBadge(doc.status);
                  const LbIcon = lb.icon;
                  return (
                    <div key={doc.id} className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText size={16} className="flex-shrink-0 text-gray-400" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-700">{doc.name}</p>
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${lb.cls}`}>
                            <LbIcon size={9} /> {lb.label}
                          </span>
                        </div>
                      </div>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer"
                        className="flex-shrink-0 flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition">
                        <Eye size={12} /> View
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
            <p className="font-bold mb-1">Important Notes:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Upload all required documents combined into a <strong>single PDF</strong> file.</li>
              <li>Only PDF format is accepted. Maximum file size is <strong>2 MB</strong>.</li>
              <li>Once your PDF is approved by the office, it is locked and cannot be changed.</li>
              <li>If your PDF is rejected, please re-upload a corrected/clearer copy.</li>
              <li>Documents are reviewed by our office team within 1–2 working days.</li>
            </ul>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
