'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { studentService, type Document, type DocumentVerificationStatus } from '@/services/student-service';
import { PortalShell } from '@/components/portal-shell';
import {
  ArrowLeft, Loader, AlertCircle, CheckCircle2, Upload, Trash2,
  Eye, RefreshCw, FileText, Image, X, Clock, ShieldCheck, ShieldX,
} from 'lucide-react';

const DOCUMENT_TYPES: { type: string; label: string; accept: string; hint: string }[] = [
  { type: 'aadhaar',    label: 'Aadhaar Card',        accept: '.pdf,.jpg,.jpeg,.png', hint: 'Front & back on one page' },
  { type: 'photo',      label: 'Passport Photo',       accept: '.jpg,.jpeg,.png',     hint: 'White background, face clearly visible' },
  { type: 'signature',  label: 'Signature',            accept: '.jpg,.jpeg,.png',     hint: 'On white paper, black/blue ink' },
  { type: 'class10',    label: '10th Marksheet',       accept: '.pdf,.jpg,.jpeg,.png', hint: 'Board certificate / marksheet' },
  { type: 'class12',    label: '12th Marksheet',       accept: '.pdf,.jpg,.jpeg,.png', hint: 'Board certificate / marksheet' },
  { type: 'graduation', label: 'Graduation Marksheet', accept: '.pdf,.jpg,.jpeg,.png', hint: 'If applicable' },
  { type: 'tc',         label: 'Transfer Certificate', accept: '.pdf,.jpg,.jpeg,.png', hint: 'From last attended institution' },
  { type: 'migration',  label: 'Migration Certificate',accept: '.pdf,.jpg,.jpeg,.png', hint: 'If switching board/university' },
  { type: 'caste',      label: 'Caste Certificate',    accept: '.pdf,.jpg,.jpeg,.png', hint: 'SC/ST/OBC — if applicable' },
  { type: 'income',     label: 'Income Certificate',   accept: '.pdf,.jpg,.jpeg,.png', hint: 'For scholarship/fee waiver' },
  { type: 'domicile',   label: 'Domicile Certificate', accept: '.pdf,.jpg,.jpeg,.png', hint: 'State residence proof' },
  { type: 'other',      label: 'Other Document',       accept: '.pdf,.jpg,.jpeg,.png', hint: 'Any additional required document' },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME = ['application/pdf', 'image/jpeg', 'image/png'];

function statusBadge(status?: DocumentVerificationStatus) {
  if (!status || status === 'pending') return { label: 'Pending Review', cls: 'bg-yellow-100 text-yellow-800', icon: Clock };
  if (status === 'approved') return { label: 'Approved', cls: 'bg-green-100 text-green-800', icon: ShieldCheck };
  return { label: 'Rejected', cls: 'bg-red-100 text-red-800', icon: ShieldX };
}

function DocRow({
  docDef,
  uploaded,
  onUpload,
  onDelete,
}: {
  docDef: (typeof DOCUMENT_TYPES)[0];
  uploaded?: Document;
  onUpload: (type: string, file: File, label: string, onProgress: (pct: number) => void) => Promise<void>;
  onDelete: (doc: Document) => Promise<void>;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const badge = statusBadge(uploaded?.status);
  const StatusIcon = badge.icon;
  const canModify = !uploaded || uploaded.status === 'pending' || uploaded.status === 'rejected';

  function validateFile(file: File): string | null {
    if (!ALLOWED_MIME.includes(file.type)) return 'Only PDF, JPG, PNG files are allowed.';
    if (file.size > MAX_FILE_SIZE) return 'File must be under 5 MB.';
    return null;
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateFile(file);
    if (err) { setError(err); return; }
    setError('');
    setUploading(true);
    setProgress(0);
    try {
      await onUpload(docDef.type, file, docDef.label, setProgress);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function handleDelete() {
    if (!uploaded || !confirm(`Delete "${docDef.label}"? You can re-upload later.`)) return;
    setDeleting(true);
    try {
      await onDelete(uploaded);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className={`flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl ${uploaded ? 'bg-blue-50' : 'bg-gray-50'}`}>
            {uploaded?.mimeType?.startsWith('image/') ? (
              <Image size={20} className="text-blue-500" />
            ) : (
              <FileText size={20} className={uploaded ? 'text-blue-500' : 'text-gray-400'} />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900">{docDef.label}</p>
            <p className="text-xs text-gray-400">{docDef.hint}</p>
            {uploaded && (
              <span className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${badge.cls}`}>
                <StatusIcon size={10} /> {badge.label}
              </span>
            )}
            {uploaded?.remarks && (
              <p className="mt-1 text-xs text-red-600">Remark: {uploaded.remarks}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {uploaded && (
            <a href={uploaded.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition">
              <Eye size={12} /> View
            </a>
          )}
          {uploaded && canModify && (
            <button onClick={handleDelete} disabled={deleting}
              className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition disabled:opacity-50">
              {deleting ? <Loader size={12} className="animate-spin" /> : <Trash2 size={12} />}
              Delete
            </button>
          )}
          {canModify && (
            <>
              <input ref={inputRef} type="file" accept={docDef.accept} className="hidden" onChange={handleFileChange} />
              <button
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1 rounded-lg bg-[#003f9f] px-2.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition disabled:opacity-60"
              >
                {uploading ? (
                  <><Loader size={12} className="animate-spin" /> {progress}%</>
                ) : uploaded ? (
                  <><RefreshCw size={12} /> Replace</>
                ) : (
                  <><Upload size={12} /> Upload</>
                )}
              </button>
            </>
          )}
          {uploaded?.status === 'approved' && (
            <span className="text-xs text-green-600 font-semibold">Locked ✓</span>
          )}
        </div>
      </div>

      {uploading && (
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      )}

      {error && (
        <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
          <AlertCircle size={12} /> {error}
          <button onClick={() => setError('')} className="ml-auto"><X size={12} /></button>
        </div>
      )}
    </div>
  );
}

export default function DocumentsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [globalError, setGlobalError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadDocuments = useCallback(async () => {
    if (!user) return;
    setPageLoading(true);
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

  // Poll every 30 s so status changes from office are reflected in real time
  useEffect(() => {
    if (!user) return;
    const id = setInterval(() => { loadDocuments(); }, 30_000);
    return () => clearInterval(id);
  }, [user, loadDocuments]);

  const handleUpload = useCallback(async (type: string, file: File, label: string, onProgress: (pct: number) => void) => {
    if (!user) throw new Error('Not authenticated');
    await studentService.uploadDocumentFile(user.uid, file, label, type, onProgress);
    setSuccessMsg(`${label} uploaded successfully!`);
    setTimeout(() => setSuccessMsg(''), 3000);
    await loadDocuments();
  }, [user, loadDocuments]);

  const handleDelete = useCallback(async (doc: Document) => {
    if (!user || !doc.id) return;
    await studentService.deleteDocument(doc.id, user.uid, doc.storagePath);
    await loadDocuments();
  }, [user, loadDocuments]);

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

  const uploadedCount = documents.length;
  const approvedCount = documents.filter(d => d.status === 'approved').length;
  const rejectedCount = documents.filter(d => d.status === 'rejected').length;

  const docMap: Record<string, Document> = {};
  documents.forEach(d => { docMap[d.type] = d; });

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
            <p className="text-blue-300 text-sm mt-1">Upload your documents for verification. Max 5 MB per file (PDF, JPG, PNG).</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-white/10 p-3 text-center">
                <p className="text-xl font-extrabold text-white">{uploadedCount}</p>
                <p className="text-xs text-blue-300 font-semibold">Uploaded</p>
              </div>
              <div className="rounded-xl bg-white/10 p-3 text-center">
                <p className="text-xl font-extrabold text-green-400">{approvedCount}</p>
                <p className="text-xs text-blue-300 font-semibold">Approved</p>
              </div>
              <div className="rounded-xl bg-white/10 p-3 text-center">
                <p className="text-xl font-extrabold text-red-400">{rejectedCount}</p>
                <p className="text-xs text-blue-300 font-semibold">Rejected</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container-shell max-w-3xl -mt-4 relative">
          {globalError && (
            <div className="mb-4 flex gap-3 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" /> {globalError}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 flex gap-3 rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-700">
              <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" /> {successMsg}
            </div>
          )}

          {/* Legend */}
          <div className="mb-4 flex flex-wrap gap-3 text-xs">
            <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 font-semibold text-yellow-800"><Clock size={10} /> Pending Review</span>
            <span className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 font-semibold text-green-800"><ShieldCheck size={10} /> Approved</span>
            <span className="flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 font-semibold text-red-800"><ShieldX size={10} /> Rejected — re-upload required</span>
          </div>

          <div className="space-y-3">
            {DOCUMENT_TYPES.map(docDef => (
              <DocRow
                key={docDef.type}
                docDef={docDef}
                uploaded={docMap[docDef.type]}
                onUpload={handleUpload}
                onDelete={handleDelete}
              />
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
            <p className="font-bold mb-1">Important Notes:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Approved documents are locked and cannot be deleted or replaced.</li>
              <li>Rejected documents must be re-uploaded with a clearer/correct copy.</li>
              <li>Documents are reviewed by our office team within 1–2 working days.</li>
              <li>Maximum file size: 5 MB. Allowed formats: PDF, JPG, PNG.</li>
            </ul>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
