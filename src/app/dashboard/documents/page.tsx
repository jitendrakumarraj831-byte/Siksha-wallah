'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { studentService, Document } from '@/services/student-service';
import { saveActivity } from '@/services/activity-service';
import { Button } from '@/components/ui/button';
import { PortalShell } from '@/components/portal-shell';
import { ArrowLeft, Download, Trash2, Upload, Loader, AlertCircle, CheckCircle2, FileText } from 'lucide-react';
import Link from 'next/link';

export default function DocumentsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadFormData, setUploadFormData] = useState({
    name: '',
    type: '',
    url: '',
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (!user) return;

    const loadDocuments = async () => {
      try {
        const docs = await studentService.getDocuments(user.uid);
        setDocuments(docs);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [authLoading, isAuthenticated, user, router]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user || !uploadFormData.name || !uploadFormData.type) {
      setError('Please fill all fields');
      return;
    }

    setUploading(true);
    try {
      await studentService.uploadDocument(user.uid, {
        uid: user.uid,
        name: uploadFormData.name,
        type: uploadFormData.type,
        url: uploadFormData.url || '#',
      });
      saveActivity({
        type: "doc_upload",
        title: "📄 Document Upload kiya",
        description: `${user.displayName || user.email} ne "${uploadFormData.name}" (${uploadFormData.type.replace(/_/g, " ")}) upload kiya — BSCC verification ke liye`,
        name: user.displayName || undefined,
        email: user.email || undefined,
        userId: user.uid,
        meta: { docType: uploadFormData.type, docName: uploadFormData.name },
        page: "/dashboard/documents",
      }).catch(() => {});
      setSuccess('Document uploaded successfully!');
      setUploadFormData({ name: '', type: '', url: '' });
      setShowUploadForm(false);
      const docs = await studentService.getDocuments(user.uid);
      setDocuments(docs);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      await studentService.deleteDocument(docId);
      setDocuments(documents.filter((d) => d.id !== docId));
      setSuccess('Document deleted successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (authLoading || loading) {
    return (
      <PortalShell>
        <div className="flex min-h-screen items-center justify-center">
          <Loader className="animate-spin" size={40} />
        </div>
      </PortalShell>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <PortalShell>
      <div className="container-shell py-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-blue-600 hover:underline">
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-extrabold text-slate-900">My Documents</h1>
            <Button onClick={() => setShowUploadForm(!showUploadForm)}>
              <Upload size={18} className="mr-2" />
              Upload Document
            </Button>
          </div>

          {error && (
            <div className="mt-6 flex gap-3 rounded-xl bg-red-50 p-4 text-red-700">
              <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-6 flex gap-3 rounded-xl bg-green-50 p-4 text-green-700">
              <CheckCircle2 size={20} className="mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium">{success}</p>
            </div>
          )}

          {showUploadForm && (
            <form onSubmit={handleUpload} className="mt-6 rounded-xl border bg-white p-6">
              <h2 className="font-bold text-slate-900">Upload New Document</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700">Document Name</label>
                  <input
                    type="text"
                    value={uploadFormData.name}
                    onChange={(e) =>
                      setUploadFormData({ ...uploadFormData, name: e.target.value })
                    }
                    placeholder="e.g., 12th Mark Sheet"
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700">Document Type</label>
                  <select
                    value={uploadFormData.type}
                    onChange={(e) =>
                      setUploadFormData({ ...uploadFormData, type: e.target.value })
                    }
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select Type</option>
                    <option value="mark_sheet">Mark Sheet</option>
                    <option value="certificate">Certificate</option>
                    <option value="id_proof">ID Proof</option>
                    <option value="admission_letter">Admission Letter</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={uploading} className="flex-1">
                    {uploading ? (
                      <>
                        <Loader size={18} className="mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      'Upload'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowUploadForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          )}

          {/* Documents List */}
          <div className="mt-8">
            {documents.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="rounded-xl border bg-white p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-1 items-start gap-3">
                        <FileText className="mt-1 flex-shrink-0 text-blue-600" size={24} />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 break-words">{doc.name}</p>
                          <p className="text-xs text-slate-600 mt-1">
                            {doc.type.replace(/_/g, ' ')}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="ml-2 flex flex-shrink-0 gap-2">
                        {doc.url && doc.url !== '#' && (
                          <a href={doc.url} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="outline">
                              <Download size={16} />
                            </Button>
                          </a>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(doc.id!)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-slate-50 p-12 text-center">
                <FileText className="mx-auto text-slate-400" size={48} />
                <p className="mt-3 text-slate-600">No documents uploaded yet</p>
                <Button onClick={() => setShowUploadForm(true)} className="mt-4">
                  Upload Your First Document
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
