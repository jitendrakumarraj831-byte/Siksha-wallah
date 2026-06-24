'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { studentService, Document } from '@/services/student-service';
import { getApplicationsByUser, type CourseApplication } from '@/services/application-service';
import { saveActivity } from '@/services/activity-service';
import { PortalShell } from '@/components/portal-shell';
import {
  ArrowLeft, Download, Trash2, Upload, Loader, AlertCircle, CheckCircle2,
  FileText, FileImage, File, X, CloudUpload, ClipboardList,
} from 'lucide-react';

// ── Document types ────────────────────────────────────────────────────────────
const DOC_TYPES = [
  { value: 'aadhaar',    label: 'Aadhaar Card' },
  { value: 'marksheet',  label: 'Marksheet (10th / 12th / Graduation)' },
  { value: 'photo',      label: 'Passport-Size Photograph' },
  { value: 'other',      label: 'Other Document' },
];

// ── Course → required document checklist ─────────────────────────────────────
interface CourseDocInfo {
  label: string;
  type: string;
  note?: string;
}
interface CourseRequirement { docs: CourseDocInfo[] }

const COURSE_REQUIREMENTS: Array<{ keywords: string[]; req: CourseRequirement }> = [
  // ── Teaching ──────────────────────────────────────────────────────────────
  {
    keywords: ['b.ed', 'bed', 'b ed', 'bachelor of education'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet' },
      { type: 'marksheet', label: 'Graduation Marksheet' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Transfer Certificate (TC)' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable (SC/ST/OBC)' },
    ]},
  },
  {
    keywords: ['d.el.ed', 'deled', 'diploma in elementary education', 'd el ed', 'd.el.ed'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Transfer Certificate (TC)' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['b.p.ed', 'bped', 'b.ped', 'bachelor of physical education'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet' },
      { type: 'marksheet', label: 'Graduation Marksheet' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Physical Fitness Certificate' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['m.ed', 'master of education'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet' },
      { type: 'marksheet', label: 'Graduation Marksheet' },
      { type: 'marksheet', label: 'B.Ed / M.A. Marksheet' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  // ── Medical ───────────────────────────────────────────────────────────────
  {
    keywords: ['mbbs', 'bachelor of medicine'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (PCB)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'NEET Score Card' },
      { type: 'other',     label: 'Domicile Certificate' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['bams', 'ayurvedic', 'bachelor of ayurvedic'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (PCB)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'NEET Score Card' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['bds', 'bachelor of dental', 'dental surgery'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (PCB)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'NEET Score Card' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['b.sc nursing', 'bsc nursing', 'bsc. nursing', 'bachelor of science in nursing'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (Biology)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Medical Fitness Certificate' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['gnm', 'general nursing & midwifery', 'general nursing'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Medical Fitness Certificate' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['anm', 'auxiliary nursing'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['d.pharma', 'dpharma', 'diploma in pharmacy'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (PCB/PCM)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['b.pharma', 'bpharma', 'bachelor of pharmacy'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (PCB/PCM)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['bmlt', 'b.mlt', 'bachelor of medical lab', 'b.m.l.t'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (PCB)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  // ── Technical ─────────────────────────────────────────────────────────────
  {
    keywords: ['b.tech', 'btech', 'bachelor of technology'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (PCM)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'JEE / DCECE Score Card', note: 'If applicable' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['polytechnic', 'diploma in engineering', 'diploma engineering'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['iti', 'industrial training'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '8th / 10th Marksheet' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['bca', 'bachelor of computer application'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['mca', 'master of computer application'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet' },
      { type: 'marksheet', label: 'Graduation Marksheet (BCA/B.Sc)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['bba', 'bachelor of business administration'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['mba', 'master of business administration'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet' },
      { type: 'marksheet', label: 'Graduation Marksheet' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'CAT/MAT Score Card', note: 'If applicable' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  // ── Paramedical ───────────────────────────────────────────────────────────
  {
    keywords: ['b.p.t', 'bpt', 'bachelor of physiotherapy', 'physiotherapy'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (PCB)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Medical Fitness Certificate' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['b.o.t.t', 'bott', 'operation theatre technology'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (PCB)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['b.r.i.t', 'brit', 'radio imaging technology', 'radiology'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (PCB)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['b.o.t', 'bot', 'occupational therapy'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (PCB)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['b.sc. biotech', 'bsc biotech', 'biotechnology'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (PCB)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['hospital mgmt', 'hospital management', 'b.sc. in hospital'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (any stream)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['d.m.l.t', 'dmlt', 'diploma in medical lab'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (Biology)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['d.o.t.a', 'dota', 'operation theatre assistant'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (Biology)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['d.m.r', 'dmr', 'diploma in medical radiology', 'x-ray'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (Biology)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['o.p.t', 'opt', 'ophthalmic', 'eye care'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (Biology)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['o.f.c.g', 'ofcg', 'orthotics', 'footwear correction'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet (Biology)' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['dresser', 'wound dressing'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet / Certificate' },
      { type: 'photo',     label: 'Passport-Size Photo' },
    ]},
  },
  // ── Law ───────────────────────────────────────────────────────────────────
  {
    keywords: ['llb', 'bachelor of laws', 'law degree'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet' },
      { type: 'marksheet', label: 'Graduation Marksheet' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['ba.llb', 'ba llb', 'bachelor of arts & laws'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'CLAT Score Card', note: 'If applicable' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['bba.llb', 'bba llb', 'bachelor of business administration & laws'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'CLAT Score Card', note: 'If applicable' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
  {
    keywords: ['llm', 'master of laws'],
    req: { docs: [
      { type: 'aadhaar',   label: 'Aadhaar Card' },
      { type: 'marksheet', label: '10th Marksheet' },
      { type: 'marksheet', label: '12th Marksheet' },
      { type: 'marksheet', label: 'Graduation Marksheet' },
      { type: 'marksheet', label: 'LLB Marksheet' },
      { type: 'photo',     label: 'Passport-Size Photo' },
      { type: 'other',     label: 'Caste Certificate', note: 'If applicable' },
    ]},
  },
];

function getCourseRequirements(courseName: string): CourseRequirement | null {
  const lower = courseName.toLowerCase();
  for (const entry of COURSE_REQUIREMENTS) {
    if (entry.keywords.some(k => lower.includes(k))) {
      return entry.req;
    }
  }
  return null;
}

// ── Utilities ─────────────────────────────────────────────────────────────────
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

// ── Component ─────────────────────────────────────────────────────────────────
export default function DocumentsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [applications, setApplications] = useState<CourseApplication[]>([]);
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

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (!user) return;

    Promise.all([
      studentService.getDocuments(user.uid).catch(() => [] as Document[]),
      getApplicationsByUser(user.uid).catch(() => [] as CourseApplication[]),
    ]).then(([docs, apps]) => {
      setDocuments(docs);
      setApplications(apps);
    }).catch(err => setError(err.message))
      .finally(() => setPageLoading(false));
  }, [authLoading, isAuthenticated, user, router]);

  function validateFile(file: File): string {
    if (!ACCEPTED_TYPES.includes(file.type)) return 'Please upload a PDF, JPG or PNG file only.';
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) return `File size must be under ${MAX_FILE_SIZE_MB} MB.`;
    return '';
  }

  function handleFileSelect(file: File) {
    const err = validateFile(file);
    if (err) { setFileError(err); setSelectedFile(null); return; }
    setFileError('');
    setSelectedFile(file);
    if (!docName) setDocName(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!selectedFile) { setFileError('Please select a file to upload.'); return; }
    if (!docName.trim()) { setError('Please give your document a clear name.'); return; }
    if (!docType) { setError('Please choose the document type.'); return; }
    if (!user) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      await studentService.uploadDocumentFile(
        user.uid, selectedFile, docName.trim(), docType,
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

      setSuccess(`"${docName.trim()}" uploaded successfully. Your counsellor will review it shortly.`);
      setSelectedFile(null); setDocName(''); setDocType('');
      setShowForm(false); setUploadProgress(0);
      const docs = await studentService.getDocuments(user.uid);
      setDocuments(docs);
    } catch (err: any) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(doc: Document) {
    if (!confirm(`Remove "${doc.name}"? This cannot be undone.`)) return;
    setError('');
    try {
      await studentService.deleteDocument(doc.id!, doc.uid, doc.storagePath);
      setDocuments(prev => prev.filter(d => d.id !== doc.id));
      setSuccess(`"${doc.name}" removed.`);
    } catch (err: any) {
      setError(err.message);
    }
  }

  // ── Compute what's uploaded ─────────────────────────────────────────────────
  const uploadedTypes = new Set(documents.map(d => d.type));

  // Build checklist for all applied courses
  const courseChecklists = applications
    .map(app => ({ courseName: app.course, req: getCourseRequirements(app.course) }))
    .filter(c => c.req !== null) as { courseName: string; req: CourseRequirement }[];

  // Deduplicate by course name
  const seen = new Set<string>();
  const uniqueChecklists = courseChecklists.filter(c => {
    if (seen.has(c.courseName)) return false;
    seen.add(c.courseName);
    return true;
  });

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
            <p className="text-sm text-slate-500 mt-0.5">
              Upload PDF, JPG or PNG files — up to {MAX_FILE_SIZE_MB} MB each. All documents stay private and secure.
            </p>
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

        {/* ── Course-wise Document Checklist ── */}
        {uniqueChecklists.length > 0 && (
          <div className="mt-6 space-y-4">
            {uniqueChecklists.map(({ courseName, req }) => {
              const total = req.docs.length;
              const done = req.docs.filter(d => uploadedTypes.has(d.type)).length;
              const allDone = done >= total;
              return (
                <div
                  key={courseName}
                  className={`rounded-2xl border-2 p-5 ${
                    allDone
                      ? 'border-green-200 bg-green-50'
                      : 'border-blue-100 bg-blue-50'
                  }`}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <ClipboardList size={18} className={allDone ? 'text-green-600' : 'text-blue-600'} />
                      <h2 className="font-extrabold text-slate-900 text-sm">
                        {courseName} — Required Documents
                      </h2>
                    </div>
                    <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${
                      allDone
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {done} / {total} uploaded
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-white/60">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        allDone ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${(done / total) * 100}%` }}
                    />
                  </div>

                  <ul className="grid gap-2 sm:grid-cols-2">
                    {req.docs.map((docReq, idx) => {
                      const uploaded = uploadedTypes.has(docReq.type);
                      return (
                        <li key={idx} className="flex items-start gap-2.5">
                          {uploaded ? (
                            <CheckCircle2 size={17} className="mt-0.5 flex-shrink-0 text-green-500" />
                          ) : (
                            <div className="mt-0.5 h-[17px] w-[17px] flex-shrink-0 rounded-full border-2 border-slate-300 bg-white" />
                          )}
                          <div>
                            <p className={`text-sm font-semibold leading-tight ${
                              uploaded ? 'text-slate-500 line-through' : 'text-slate-800'
                            }`}>
                              {docReq.label}
                            </p>
                            {docReq.note && (
                              <p className="text-xs text-slate-500 mt-0.5">{docReq.note}</p>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {!allDone && (
                    <button
                      onClick={() => { setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#003f9f] px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
                    >
                      <Upload size={13} /> Upload Missing Documents
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Upload Form ── */}
        {showForm && (
          <form onSubmit={handleUpload} className="mt-6 rounded-2xl border-2 border-blue-100 bg-white p-6 shadow-sm">
            <h2 className="font-bold text-slate-900 mb-5 text-lg">Upload a New Document</h2>

            <div
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
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
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

            {uploading && (
              <div className="mt-5">
                <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>Uploading securely…</span>
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
                {uploading
                  ? <><Loader size={16} className="animate-spin" /> Uploading {uploadProgress}%…</>
                  : <><CloudUpload size={16} /> Upload Document</>
                }
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

        {/* ── Uploaded Document List ── */}
        <div className="mt-8">
          {documents.length > 0 ? (
            <>
              <p className="mb-4 text-sm font-semibold text-slate-500">
                You have shared {documents.length} document{documents.length !== 1 ? 's' : ''} with us so far.
              </p>
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
                          {DOC_TYPES.find(t => t.value === doc.type)?.label ?? doc.type.replace(/_/g, ' ')}
                        </p>
                        {doc.fileSize && <p className="mt-0.5 text-xs text-slate-400">{formatBytes(doc.fileSize)}</p>}
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
                Upload the required documents above — your counsellor will verify them and guide you through the next steps.
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

        {/* Info tips */}
        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-bold mb-1">A few helpful tips:</p>
          <ul className="space-y-1 list-disc list-inside text-xs">
            <li>Always keep the original copy of every document with you.</li>
            <li>PDF format works best — scan documents clearly before uploading.</li>
            <li>Aadhaar Card, Marksheets and a Passport-size Photograph are required for all courses.</li>
            <li>Your documents are 100% private — only you and your Siksha Wallah counsellor can view them.</li>
          </ul>
        </div>
      </div>
    </PortalShell>
  );
}
