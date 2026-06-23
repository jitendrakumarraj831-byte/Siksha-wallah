'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { studentService, Document } from '@/services/student-service';
import { saveActivity } from '@/services/activity-service';
import { PortalShell } from '@/components/portal-shell';
import {
  ArrowLeft, Download, Trash2, Upload, Loader, AlertCircle, CheckCircle2,
  FileText, FileImage, File, X, CloudUpload,
} from 'lucide-react';

const DOC_TYPES = [
  { value: 'mark_sheet',       label: 'Marksheet (10th / 12th / Graduation)' },
  { value: 'certificate',      label: 'Passing / Migration / Transfer Certificate' },
  { value: 'id_proof',         label: 'ID Proof (Aadhaar or PAN)' },
  { value: 'domicile',         label: 'Domicile / Residence Certificate' },
  { value: 'income_cert',      label: 'Family Income Certificate' },
  { value: 'caste_cert',       label: 'Caste Certificate' },
  { value: 'photo',            label: 'Passport-Size Photograph' },
  { value: 'admission_letter', label: 'Admission Letter / Bonafide Certificate' },
  { value: 'bscc_docs',        label: 'BSCC Loan-Related Document' },
  { value: 'other',            label: 'Other Supporting Document' },
];

const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
const MAX_FILE_SIZE_MB = 5;

function getFileIcon(mimeType?: string) {
  if (!mimeType) return <FileText size={22} className="text-blue-500" />;
  if (mimeType.startsWith('image/')) return <FileImage size={22} className="text-blue-500" />;
  if (mimeType === 'application/pdf') return <File size={22} className="text-red-500" />;
  return <FileText size={22} className="text-blue-500" />;
}

function formatBytes(bytes?: number) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Upload state
  const [showForm, setShowForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileError, setFileError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (!user) return;

    studentService.getDocuments(user.uid)
      .then(setDocuments)
      .catch(err => setError(err.message))
      .finally(() => setPageLoading(false));
  }, [authLoading, isAuthenticated, user, router]);

  function validateFile(file: File): string {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Please upload a PDF, JPG or PNG file only.';
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `For smooth uploads, please keep the file size under ${MAX_FILE_SIZE_MB} MB.`;
    }
    return '';
  }

  function handleFileSelect(file: File) {
    const err = validateFile(file);
    if (err) { setFileError(err); setSelectedFile(null); return; }
    setFileError('');
    setSelectedFile(file);
    // Auto-fill doc name from filename (without extension)
    if (!docName) {
      setDocName(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedFile) { setFileError('Please select a file to upload.'); return; }
    if (!docName.trim()) { setError('Please give your document a clear name (e.g. "12th Marksheet").'); return; }
    if (!docType) { setError('Please choose the type of document you are uploading.'); return; }
    if (!user) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      await studentService.uploadDocumentFile(
        user.uid,
        selectedFile,
        docName.trim(),
        docType,
        pct => setUploadProgress(pct),
      );

      saveActivity({
        type: 'doc_upload',
        title: '📄 Document Upload किया',
        description: `"${docName.trim()}" (${docType.replace(/_/g, ' ')})`,
        name: user.displayName || undefined,
        email: user.email || undefined,
        userId: user.uid,
        meta: { docType, docName: docName.trim(), fileSize: String(selectedFile.size) },
        page: '/dashboard/documents',
      }).catch(() => {});

      setSuccess(`"${docName.trim()}" was uploaded successfully. Your counsellor will review it shortly.`);
      setSelectedFile(null);
      setDocName('');
      setDocType('');
      setShowForm(false);
      setUploadProgress(0);

      // Refresh list
      const docs = await studentService.getDocuments(user.uid);
      setDocuments(docs);
    } catch (err: any) {
      setError(err.message || 'The upload could not be completed. Please check your connection and try again.');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(doc: Document) {
    if (!confirm(`Are you sure you want to remove "${doc.name}"? This action cannot be undone.`)) return;
    setError('');
    try {
      await studentService.deleteDocument(doc.id!, doc.storagePath);
      setDocuments(prev => prev.filter(d => d.id !== doc.id));
      setSuccess(`"${doc.name}" has been removed from your documents.`);
    } catch (err: any) {
      setError(err.message);
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

  return (
    <PortalShell>
      <div className="container-shell py-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-blue-600 hover:underline text-sm font-semibold">
          <ArrowLeft size={16} /> Back to My Dashboard
        </Link>

        <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">My Admission Documents</h1>
            <p className="text-sm text-slate-500 mt-0.5">Upload PDF, JPG or PNG files — up to {MAX_FILE_SIZE_MB} MB each. All documents stay private and secure.</p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setError(''); setSuccess(''); setFileError(''); }}
            className="flex items-center gap-2 rounded-xl bg-[#003f9f] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            {showForm ? <X size={16} /> : <Upload size={16} />}
            {showForm ? 'Cancel' : 'Upload a Document'}
          </button>
        </div>

        {error && (
          <div className="mt-4 flex gap-3 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-4 flex gap-3 rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-700">
            <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5 text-green-500" />
            <p className="font-semibold">{success}</p>
          </div>
        )}

        {/* ── Upload Form ── */}
        {showForm && (
          <form onSubmit={handleUpload} className="mt-6 rounded-2xl border-2 border-blue-100 bg-white p-6 shadow-sm">
            <h2 className="font-bold text-slate-900 mb-5 text-lg">Upload a New Document</h2>

            {/* Drop Zone */}
            <div
              ref={dropZoneRef}
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative mb-5 cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition ${
                selectedFile
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="sr-only"
                onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) handleFileSelect(f);
                }}
              />
              {selectedFile ? (
                <div className="flex flex-col items-center gap-2">
                  {getFileIcon(selectedFile.type)}
                  <p className="font-bold text-green-700 text-sm">{selectedFile.name}</p>
                  <p className="text-xs text-green-600">{formatBytes(selectedFile.size)}</p>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); setSelectedFile(null); setDocName(''); }}
                    className="mt-1 text-xs text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <CloudUpload size={40} className="text-gray-400" />
                  <div>
                    <p className="font-bold text-gray-700">Tap to choose a file, or drag and drop it here</p>
                    <p className="text-xs text-gray-500 mt-1">Accepts PDF, JPG and PNG — up to {MAX_FILE_SIZE_MB} MB</p>
                  </div>
                </div>
              )}
            </div>

            {fileError && (
              <p className="mb-4 text-sm font-semibold text-red-600 flex items-center gap-1.5">
                <AlertCircle size={14} /> {fileError}
              </p>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Document Name *</label>
                <input
                  type="text"
                  value={docName}
                  onChange={e => setDocName(e.target.value)}
                  placeholder="e.g. Class 12 Marksheet"
                  required
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Document Type *</label>
                <select
                  value={docType}
                  onChange={e => setDocType(e.target.value)}
                  required
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm bg-white focus:border-blue-500 focus:outline-none transition"
                >
                  <option value="">-- Select document type --</option>
                  {DOC_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="mt-5">
                <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>Uploading your document securely…</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="mt-5 flex gap-3">
              <button
                type="submit"
                disabled={uploading || !selectedFile}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#003f9f] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {uploading ? (
                  <><Loader size={16} className="animate-spin" /> Uploading {uploadProgress}%…</>
                ) : (
                  <><CloudUpload size={16} /> Upload Document</>
                )}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setSelectedFile(null); setDocName(''); setDocType(''); setFileError(''); }}
                className="rounded-xl border-2 border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* ── Document List ── */}
        <div className="mt-8">
          {documents.length > 0 ? (
            <>
              <p className="mb-4 text-sm font-semibold text-slate-500">You have shared {documents.length} document{documents.length !== 1 ? 's' : ''} with us so far.</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {documents.map(doc => (
                  <div key={doc.id} className="group rounded-2xl border-2 border-slate-100 bg-white p-5 shadow-sm hover:border-blue-200 hover:shadow-md transition">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100">
                        {getFileIcon(doc.mimeType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-extrabold text-slate-900 text-sm leading-tight break-words">{doc.name}</p>
                        <p className="mt-0.5 text-xs font-semibold text-slate-500">
                          {DOC_TYPES.find(t => t.value === doc.type)?.label?.split(' ').slice(1).join(' ') ?? doc.type.replace(/_/g, ' ')}
                        </p>
                        {doc.fileSize && (
                          <p className="mt-0.5 text-xs text-slate-400">{formatBytes(doc.fileSize)}</p>
                        )}
                        <p className="mt-1 text-xs text-slate-400">
                          {new Date(doc.uploadedAt).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      {doc.url && doc.url !== '#' && (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                        >
                          <Download size={13} /> View / Download
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(doc)}
                        className="flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
                        aria-label="Delete document"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-16 text-center">
              <CloudUpload size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="font-bold text-slate-600 text-lg">You haven&apos;t uploaded any documents yet.</p>
              <p className="text-sm text-slate-400 mt-1 mb-5">
                Begin by uploading your essential admission documents — your counsellor will verify them and guide you through the next steps.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-[#003f9f] px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 transition"
              >
                <Upload size={16} /> Upload Your First Document
              </button>
            </div>
          )}
        </div>

        {/* Info box */}
        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-bold mb-1">A few helpful tips:</p>
          <ul className="space-y-1 list-disc list-inside text-xs">
            <li>Always keep the original copy of every document with you.</li>
            <li>PDF format works best — please scan documents clearly before uploading.</li>
            <li>For BSCC, Aadhaar, Family Income Certificate and Domicile Certificate are essential.</li>
            <li>Your documents are 100% private — only you and your Siksha Wallah counsellor can view them.</li>
          </ul>
        </div>
      </div>
    </PortalShell>
  );
}
