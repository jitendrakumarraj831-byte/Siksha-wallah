"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { saveApplication } from "@/services/application-service";
import { saveActivity } from "@/services/activity-service";
import { saveInquiry } from "@/services/inquiry-service";
import { useAuth } from "@/components/auth-provider";
import {
  GraduationCap, User, Phone, Mail, BookOpen, CheckCircle2,
  Send, Loader, AlertCircle, MessageCircle, FileText,
  Upload, Trash2, Paperclip, X,
} from "lucide-react";

const MAX_UPLOAD_BYTES = 2 * 1024 * 1024; // 2 MB

type UploadedDoc = { name: string; url: string };

// One row per attached file in the single upload section.
type UploadItem = {
  id: string;
  name: string;
  url?: string;
  progress: number;
  uploading: boolean;
  error?: string;
};

// Direct unsigned Cloudinary upload — works for guests too (no auth/firestore).
function uploadPdfToCloudinary(
  file: File,
  folderKey: string,
  onProgress?: (pct: number) => void,
): Promise<UploadedDoc> {
  return new Promise((resolve, reject) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      reject(new Error("Document upload service अभी उपलब्ध नहीं है। कृपया बाद में प्रयास करें।"));
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", uploadPreset);
    fd.append("folder", `applications/${folderKey}`);

    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", e => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
    });
    xhr.addEventListener("load", () => {
      try {
        if (xhr.status < 200 || xhr.status >= 300) {
          throw new Error(`Upload failed (HTTP ${xhr.status})`);
        }
        const result = JSON.parse(xhr.responseText);
        resolve({ name: file.name, url: result.secure_url });
      } catch (err: any) {
        reject(new Error(err.message || "Upload failed"));
      }
    });
    xhr.addEventListener("error", () => reject(new Error("Network error during upload")));
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`);
    xhr.send(fd);
  });
}

const QUALIFICATIONS = [
  "8th Pass", "10th Pass", "12th Pass (Arts)", "12th Pass (Science)",
  "12th Pass (Commerce)", "12th Pass (PCB)", "12th Pass (PCM)",
  "Graduation", "Post Graduation", "Other",
];

const DISTRICTS_BIHAR = [
  "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur",
  "Bhojpur", "Buxar", "Darbhanga", "Gaya", "Gopalganj", "Jamui",
  "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai",
  "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada",
  "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran",
  "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali",
  "West Champaran", "East Champaran",
];

// Documents the student is recommended to attach (shown as guidance).
const RECOMMENDED_DOCS = [
  "Aadhaar Card (आधार कार्ड)",
  "10th Marksheet (दसवीं अंकपत्र)",
  "12th Marksheet (बारहवीं अंकपत्र)",
  "Graduation Marksheet (यदि लागू हो)",
  "Passport Size Photo",
  "Caste / Income / Residence Certificate (यदि हों)",
];

type FormData = {
  fullName: string; mobile: string; email: string; fatherName: string;
  dob: string; gender: string; address: string; district: string; state: string;
  course: string; qualification: string; passingYear: string;
  percentage: string; schoolCollege: string; preferredCollege: string;
  bsccRequired: boolean; message: string;
};

const EMPTY: FormData = {
  fullName: "", mobile: "", email: "", fatherName: "",
  dob: "", gender: "", address: "", district: "", state: "Bihar",
  course: "", qualification: "", passingYear: "",
  percentage: "", schoolCollege: "", preferredCollege: "",
  bsccRequired: false, message: "",
};

let _uid = 0;
const newId = () => `${Date.now()}-${_uid++}`;

function ApplyForm() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Close the gate / form and go back (or home if no history).
  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) router.back();
    else router.push("/");
  };
  const [form, setForm] = useState<FormData>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [appId, setAppId] = useState("");
  const [tcAccepted, setTcAccepted] = useState(false);
  const [uploads, setUploads] = useState<UploadItem[]>([]);

  // Pre-fill course from URL param ?course=
  useEffect(() => {
    const courseParam = searchParams.get("course");
    if (courseParam) setForm(f => ({ ...f, course: f.course || courseParam }));
  }, [searchParams]);

  // Pre-fill form fields when logged-in student visits
  useEffect(() => {
    if (user && userProfile) {
      setForm(f => ({
        ...f,
        fullName: f.fullName || userProfile.name || "",
        mobile: f.mobile || userProfile.phone || "",
        email: f.email || userProfile.email || "",
      }));
    }
  }, [user, userProfile]);

  const set = (k: keyof FormData, v: string | boolean) =>
    setForm(f => ({ ...f, [k]: v }));

  const anyUploading = uploads.some(u => u.uploading);
  const uploadedDocs = uploads.filter(u => u.url);

  // Single upload section — accepts multiple PDFs at once.
  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setError("");
    const files = Array.from(fileList);
    const folderKey = (user?.uid || form.mobile || "guest").toString();

    for (const file of files) {
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      if (!isPdf) {
        setError("केवल PDF file ही upload करें। (Only PDF format allowed)");
        continue;
      }
      if (file.size > MAX_UPLOAD_BYTES) {
        setError(`"${file.name}" का size 2MB से अधिक है। (Max 2MB per file)`);
        continue;
      }
      const id = newId();
      setUploads(prev => [...prev, { id, name: file.name, progress: 0, uploading: true }]);
      try {
        const doc = await uploadPdfToCloudinary(file, folderKey, pct =>
          setUploads(prev => prev.map(u => (u.id === id ? { ...u, progress: pct } : u)))
        );
        setUploads(prev => prev.map(u => (u.id === id ? { ...u, url: doc.url, uploading: false, progress: 100 } : u)));
      } catch (err: any) {
        setUploads(prev => prev.map(u => (u.id === id ? { ...u, uploading: false, error: err.message || "Upload failed" } : u)));
      }
    }
  }

  function removeUpload(id: string) {
    setUploads(prev => prev.filter(u => u.id !== id));
  }

  function validate(): string {
    if (!form.fullName.trim()) return "कृपया अपना पूरा नाम दर्ज करें।";
    if (!form.mobile.trim() || form.mobile.length < 10) return "कृपया एक सही 10-अंकों का mobile number दर्ज करें।";
    if (!form.gender) return "कृपया gender का चयन करें।";
    if (!form.course) return "कृपया उस course का चयन करें जिसमें आप admission लेना चाहते हैं।";
    if (!form.qualification) return "कृपया अपनी current qualification का चयन करें।";
    if (anyUploading) return "Documents अभी upload हो रहे हैं — कृपया थोड़ा रुकें।";
    if (uploadedDocs.length === 0) return "कृपया कम से कम एक document (PDF) attach करके upload करें — यह अनिवार्य है।";
    if (!tcAccepted) return "कृपया Terms & Conditions स्वीकार करें।";
    return "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setLoading(true);
    setError("");
    try {
      const id = await saveApplication({
        userId: user?.uid || undefined,
        fullName: form.fullName,
        mobile: form.mobile,
        email: form.email || user?.email || undefined,
        fatherName: form.fatherName || undefined,
        dob: form.dob || undefined,
        gender: form.gender || undefined,
        address: form.address || undefined,
        district: form.district || undefined,
        state: form.state || undefined,
        course: form.course,
        qualification: form.qualification,
        passingYear: form.passingYear || undefined,
        percentage: form.percentage || undefined,
        schoolCollege: form.schoolCollege || undefined,
        preferredCollege: form.preferredCollege || undefined,
        bsccRequired: form.bsccRequired,
        message: form.message || undefined,
        uploadedDocuments: uploadedDocs.map(u => ({ name: u.name, url: u.url! })),
      });
      setAppId(id.slice(0, 8).toUpperCase());
      saveInquiry({
        fullName: form.fullName,
        mobile: form.mobile,
        email: form.email || undefined,
        course: form.course,
        qualification: form.qualification,
        message: form.message || `Apply page — Ref: ${id.slice(0, 8).toUpperCase()}`,
        status: "pending",
      }).catch(() => {});
      saveActivity({
        type: "application",
        title: "📋 Admission Application Submitted",
        description: `${form.fullName} ne ${form.course} ke liye apply kiya`,
        name: form.fullName,
        mobile: form.mobile,
        email: form.email || undefined,
        course: form.course,
        userId: user?.uid || undefined,
        refId: id,
        page: "/apply",
      }).catch(() => {});
      setSubmitted(true);
    } catch {
      setError("तकनीकी कारणवश आवेदन अभी जमा नहीं हो पाया। कृपया हमें सीधे कॉल करें — हमारी team आपकी सहायता के लिए तैयार है।");
    } finally {
      setLoading(false);
    }
  }

  /* ───────────────── SUCCESS SCREEN ───────────────── */
  if (submitted) {
    return (
      <>
        <SiteNavbar />
        <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 px-4 py-12">
          <div className="mx-auto w-full max-w-lg">
            <div className="text-center mb-6">
              <div className="mb-4 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 size={48} className="text-green-500" />
                </div>
              </div>
              <h1 className="font-headline text-2xl font-extrabold text-gray-900 mb-1">
                Application <span className="text-green-600">Submitted!</span>
              </h1>
              <p className="text-sm text-gray-500">आपका आवेदन सफलतापूर्वक जमा हो गया।</p>
            </div>

            <div className="mb-4 rounded-2xl border-2 border-[#003f9f] bg-white px-6 py-4 text-center">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Application Reference ID</p>
              <p className="font-headline text-3xl font-extrabold text-[#003f9f]">#{appId}</p>
              <p className="text-xs text-gray-400 mt-1">यह ID save करके रखें — status track करने के काम आएगी।</p>
            </div>

            {uploadedDocs.length > 0 && (
              <div className="mb-4 rounded-2xl border-2 border-green-200 bg-green-50 p-5">
                <p className="font-extrabold text-green-900 text-sm mb-2">📎 आपके Uploaded Documents ({uploadedDocs.length})</p>
                <div className="space-y-1">
                  {uploadedDocs.map(u => (
                    <div key={u.id} className="flex items-center gap-2 text-sm text-green-800">
                      <FileText size={14} className="flex-shrink-0" />
                      <span className="truncate">{u.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4 rounded-2xl border-2 border-amber-400 bg-amber-50 p-5">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🏢</span>
                <div>
                  <p className="font-extrabold text-amber-900 text-base mb-1">Office में Original Documents लेकर आएं</p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Form submit होने के बाद admission process complete करने के लिए आपको <strong>Siksha Wallah Office</strong> में अपने सभी original documents लेकर आना होगा।
                  </p>
                  <div className="mt-3 rounded-xl bg-amber-100 border border-amber-200 px-4 py-3">
                    <p className="text-xs font-extrabold text-amber-900 mb-1.5">📍 Office Address:</p>
                    <p className="text-xs text-amber-800">College Chowk, Near HP Petrol Pump,<br />Forbesganj, Araria, Bihar</p>
                    <p className="text-xs text-amber-800 mt-1">⏰ Mon–Sat: 9:00 AM – 7:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-gray-600 mb-3">
              हमारा counsellor <strong>30 मिनट के भीतर</strong> आपसे संपर्क करेगा।
            </p>
            <div className="flex flex-col gap-2 mb-5">
              <a
                href={`https://wa.me/916203138576?text=नमस्ते!%20मैंने%20${encodeURIComponent(form.course)}%20के%20लिए%20apply%20किया%20है।%20नाम:%20${encodeURIComponent(form.fullName)}%20।%20Reference%20ID:%20%23${appId}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-green-500 py-3 font-extrabold text-white hover:bg-green-600 transition"
              >
                <MessageCircle size={18} fill="currentColor" /> WhatsApp पर बात करें
              </a>
              <a href="tel:+916203138576"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#003f9f] py-3 font-extrabold text-white hover:bg-blue-700 transition"
              >
                <Phone size={18} /> Call करें — +91 62031 38576
              </a>
            </div>
            <div className="text-center space-y-2">
              {user ? (
                <Link href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#003f9f] px-6 py-3 text-sm font-extrabold text-white hover:bg-blue-700 transition">
                  My Dashboard देखें — Application Track करें →
                </Link>
              ) : (
                <>
                  <Link href="/auth/register"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#003f9f] px-6 py-3 text-sm font-extrabold text-white hover:bg-blue-700 transition">
                    Account बनाएं — Application Track करें →
                  </Link>
                  <p className="text-xs text-gray-400">
                    पहले से account है?{' '}
                    <Link href="/auth/login" className="font-bold text-[#003f9f] hover:underline">Login करें</Link>
                  </p>
                </>
              )}
            </div>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  /* ───────────────── AUTH GATE — account required to apply ───────────────── */
  // While auth state is resolving, show a loader.
  if (authLoading) {
    return (
      <>
        <SiteNavbar />
        <main className="min-h-screen flex items-center justify-center bg-gray-100">
          <Loader size={28} className="animate-spin text-[#003f9f]" />
        </main>
        <SiteFooter />
      </>
    );
  }

  // Not logged in → student must create an account / login first. No guest apply.
  if (!user) {
    return (
      <>
        <SiteNavbar />
        <main className="min-h-screen bg-gray-100 px-4 py-12">
          <div className="mx-auto w-full max-w-md">
            <div className="relative rounded-2xl bg-white shadow-xl ring-1 ring-gray-200 overflow-hidden">
              <button
                type="button"
                onClick={goBack}
                aria-label="बंद करें"
                className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/30 transition"
              >
                <X size={18} />
              </button>
              <div className="border-b-4 border-[#003f9f] bg-gradient-to-r from-[#00102e] to-[#003590] px-7 py-7 text-white text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 border border-white/20">
                  <User size={26} />
                </div>
                <h1 className="font-headline text-xl font-extrabold">Apply करने के लिए Account ज़रूरी है</h1>
                <p className="text-xs text-blue-100 mt-1">Admission application भरने से पहले login करें या free account बनाएं।</p>
              </div>
              <div className="px-7 py-7">
                <div className="mb-5 space-y-2">
                  {[
                    "अपनी application कभी भी track कर सकें",
                    "Documents safe और एक ही जगह सुरक्षित रहें",
                    "Counsellor से सीधे dashboard में बात करें",
                  ].map(t => (
                    <div key={t} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0 text-green-500" />
                      {t}
                    </div>
                  ))}
                </div>
                <Link
                  href="/auth/register?redirect=/apply"
                  className="mb-2 flex items-center justify-center gap-2 rounded-xl bg-[#003f9f] py-3.5 font-extrabold text-white hover:bg-blue-700 transition"
                >
                  Free Account बनाएं →
                </Link>
                <Link
                  href="/auth/login?redirect=/apply"
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#003f9f] py-3 font-bold text-[#003f9f] hover:bg-blue-50 transition"
                >
                  पहले से account है? Login करें
                </Link>
                <p className="mt-5 text-center text-xs text-gray-400">
                  मदद चाहिए?{" "}
                  <a href="https://wa.me/916203138576" target="_blank" rel="noopener noreferrer" className="font-bold text-green-600 hover:underline">WhatsApp करें</a>
                  {" "}या{" "}
                  <a href="tel:+916203138576" className="font-bold text-[#003f9f] hover:underline">Call करें</a>
                </p>
              </div>
            </div>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  /* ───────────────── APPLICATION FORM (single page, PDF-style) ───────────────── */
  const inputCls = "w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-[#003f9f] focus:ring-1 focus:ring-[#003f9f] transition";
  const labelCls = "mb-1 block text-[13px] font-semibold text-gray-700";

  return (
    <>
      <SiteNavbar />
      <main className="bg-gray-100 py-8 sm:py-12">
        <div className="container-shell">
          {/* Signed-in banner */}
          <div className="mx-auto max-w-3xl mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-center font-semibold text-green-700">
            Signed in as {userProfile?.name || user.email} — यह application आपके dashboard में save होगी।
          </div>

          {error && (
            <div className="mx-auto max-w-3xl mb-4 flex gap-3 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {/* The "paper" — looks like an official PDF application form */}
          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-3xl rounded-2xl bg-white shadow-xl ring-1 ring-gray-200 overflow-hidden"
          >
            {/* Form letterhead */}
            <div className="border-b-4 border-[#003f9f] bg-gradient-to-r from-[#00102e] to-[#003590] px-6 sm:px-10 py-6 text-white">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300">Siksha Wallah Consultancy</p>
                  <h1 className="font-headline text-xl sm:text-2xl font-extrabold mt-0.5">Admission Application Form</h1>
                  <p className="text-xs text-blue-100 mt-1">Session 2026–27 · College Chowk, Forbesganj, Araria (Bihar)</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 border border-white/20">
                  <GraduationCap size={26} />
                </div>
              </div>
              {/* Applying for */}
              <div className="mt-4 rounded-lg bg-white/10 border border-white/20 px-4 py-2.5 flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">Applying for:</span>
                <span className="text-sm font-extrabold text-amber-300">{form.course || "— नीचे Course Section में चुनें —"}</span>
              </div>
            </div>

            <div className="px-6 sm:px-10 py-7 space-y-9">

              {/* ── Section 1: Personal ── */}
              <section>
                <SectionHeading n={1} icon={<User size={15} />} title="Personal Details" subtitle="व्यक्तिगत जानकारी" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Full Name (पूरा नाम) *</label>
                    <input required value={form.fullName} onChange={e => set("fullName", e.target.value)} placeholder="अपना पूरा नाम लिखें" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Father&apos;s Name (पिता का नाम)</label>
                    <input value={form.fatherName} onChange={e => set("fatherName", e.target.value)} placeholder="पिता का पूरा नाम" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Mobile Number *</label>
                    <input required type="tel" maxLength={10} value={form.mobile} onChange={e => set("mobile", e.target.value.replace(/\D/g, ""))} placeholder="10-digit mobile number" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Email Address (optional)</label>
                    <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="your@email.com" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Date of Birth</label>
                    <input type="date" value={form.dob} onChange={e => set("dob", e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Gender *</label>
                    <select value={form.gender} onChange={e => set("gender", e.target.value)} className={`${inputCls} bg-white text-gray-700`}>
                      <option value="">-- Select --</option>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Address (पूरा पता)</label>
                    <input value={form.address} onChange={e => set("address", e.target.value)} placeholder="गाँव / मोहल्ला, Post Office, पिन कोड…" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>District (जिला)</label>
                    <select value={form.district} onChange={e => set("district", e.target.value)} className={`${inputCls} bg-white text-gray-700`}>
                      <option value="">-- Select district --</option>
                      {DISTRICTS_BIHAR.map(d => <option key={d}>{d}</option>)}
                      <option>Outside Bihar</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>State</label>
                    <input value={form.state} onChange={e => set("state", e.target.value)} placeholder="Bihar" className={inputCls} />
                  </div>
                </div>
              </section>

              {/* ── Section 2: Course & Academic ── */}
              <section>
                <SectionHeading n={2} icon={<BookOpen size={15} />} title="Course & Qualification" subtitle="कोर्स और शैक्षणिक जानकारी" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Course of Interest * <span className="font-normal text-gray-400">— आप किस course के लिए apply कर रहे हैं</span></label>
                    <select value={form.course} onChange={e => set("course", e.target.value)} className={`${inputCls} bg-white text-gray-700`}>
                      <option value="">-- Select a course --</option>
                      <optgroup label="Teaching">{["B.Ed", "D.El.Ed", "M.Ed", "B.P.Ed"].map(c => <option key={c}>{c}</option>)}</optgroup>
                      <optgroup label="Medical & Nursing">{["MBBS", "BDS", "B.Sc Nursing", "GNM", "ANM", "B.Pharma", "D.Pharma", "BMLT", "BASLP"].map(c => <option key={c}>{c}</option>)}</optgroup>
                      <optgroup label="Technical">{["B.Tech", "Polytechnic", "ITI", "Diploma"].map(c => <option key={c}>{c}</option>)}</optgroup>
                      <optgroup label="Management & Commerce">{["BBA", "MBA", "BCA", "MCA", "B.Com", "M.Com"].map(c => <option key={c}>{c}</option>)}</optgroup>
                      <optgroup label="General Degree">{["BA", "B.Sc", "MA", "M.Sc"].map(c => <option key={c}>{c}</option>)}</optgroup>
                      <option>BSCC Loan Guidance Only</option>
                      <option>Not yet decided — I would like career guidance</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Current / Highest Qualification *</label>
                    <select value={form.qualification} onChange={e => set("qualification", e.target.value)} className={`${inputCls} bg-white text-gray-700`}>
                      <option value="">-- Select qualification --</option>
                      {QUALIFICATIONS.map(q => <option key={q}>{q}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Year of Passing</label>
                    <input value={form.passingYear} onChange={e => set("passingYear", e.target.value.replace(/\D/g, ""))} maxLength={4} placeholder="e.g. 2023" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Percentage / Marks</label>
                    <input value={form.percentage} onChange={e => set("percentage", e.target.value)} placeholder="e.g. 65% or 450/500" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Last School / College</label>
                    <input value={form.schoolCollege} onChange={e => set("schoolCollege", e.target.value)} placeholder="अंतिम संस्थान" className={inputCls} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Preferred College (optional)</label>
                    <input value={form.preferredCollege} onChange={e => set("preferredCollege", e.target.value)} placeholder="यदि कोई विशेष college पसंद है" className={inputCls} />
                  </div>
                  <label className="sm:col-span-2 flex items-center gap-3 cursor-pointer rounded-lg border border-gray-300 px-4 py-3 hover:border-blue-300 transition">
                    <input type="checkbox" checked={form.bsccRequired} onChange={e => set("bsccRequired", e.target.checked)} className="h-5 w-5 rounded accent-[#003f9f]" />
                    <div>
                      <p className="text-sm font-bold text-gray-800">Bihar Student Credit Card (BSCC) loan में interest है</p>
                      <p className="text-xs text-gray-400">₹4 लाख तक education loan — हम eligibility और प्रक्रिया की पूरी जानकारी देंगे।</p>
                    </div>
                  </label>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Any question / note (optional)</label>
                    <textarea value={form.message} onChange={e => set("message", e.target.value)} rows={3} placeholder="कोई विशेष सवाल या आवश्यकता…" className={`${inputCls} resize-none`} />
                  </div>
                </div>
              </section>

              {/* ── Section 3: ONE Document Upload section ── */}
              <section>
                <SectionHeading n={3} icon={<Paperclip size={15} />} title="Documents Upload" subtitle="सभी documents यहीं attach करके upload करें" />

                <div className="rounded-xl border-2 border-dashed border-[#003f9f]/40 bg-blue-50/40 p-5">
                  <div className="mb-3 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-[12px] font-semibold text-blue-700">
                    ⚠️ केवल <strong>PDF</strong> file · अधिकतम <strong>2MB</strong> per file · एक साथ कई files attach कर सकते हैं
                  </div>

                  {/* Big upload button */}
                  <label className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#003f9f]/50 bg-white px-4 py-7 text-center cursor-pointer hover:bg-blue-50 transition ${anyUploading ? "opacity-70 pointer-events-none" : ""}`}>
                    <Upload size={26} className="text-[#003f9f]" />
                    <p className="text-sm font-extrabold text-[#003f9f]">अपने सभी documents यहाँ attach करें</p>
                    <p className="text-xs text-gray-500">Click करके एक या कई PDF चुनें (Aadhaar, Marksheets, Photo आदि)</p>
                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      multiple
                      className="hidden"
                      disabled={anyUploading}
                      onChange={e => { handleFiles(e.target.files); e.target.value = ""; }}
                    />
                  </label>

                  {/* Recommended docs guidance */}
                  <div className="mt-3 text-xs text-gray-500">
                    <p className="font-semibold text-gray-600 mb-1">📋 ये documents attach करने की सलाह है:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {RECOMMENDED_DOCS.map(d => (
                        <span key={d} className="rounded-md bg-white border border-gray-200 px-2 py-0.5 text-[11px] font-medium text-gray-600">{d.split(" (")[0]}</span>
                      ))}
                    </div>
                  </div>

                  {/* Attached files list */}
                  {uploads.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs font-bold text-gray-600">Attached files ({uploadedDocs.length} uploaded):</p>
                      {uploads.map(u => (
                        <div key={u.id} className={`rounded-lg border px-3 py-2.5 ${u.error ? "border-red-200 bg-red-50" : u.url ? "border-green-300 bg-green-50" : "border-gray-200 bg-white"}`}>
                          <div className="flex items-center gap-2.5">
                            <FileText size={16} className={u.error ? "text-red-400" : u.url ? "text-green-500" : "text-gray-400"} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-700 truncate">{u.name}</p>
                              {u.error && <p className="text-[11px] text-red-600">{u.error}</p>}
                              {u.url && <p className="text-[11px] text-green-600">✅ Uploaded</p>}
                              {u.uploading && <p className="text-[11px] text-blue-600">Uploading… {u.progress}%</p>}
                            </div>
                            <button type="button" onClick={() => removeUpload(u.id)} className="flex-shrink-0 flex items-center gap-1 rounded-md border border-red-200 px-2 py-1 text-[11px] font-bold text-red-600 hover:bg-red-50 transition">
                              <Trash2 size={11} /> हटाएं
                            </button>
                          </div>
                          {u.uploading && (
                            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                              <div className="h-full rounded-full bg-[#003f9f] transition-all" style={{ width: `${u.progress}%` }} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <p className={`mt-3 text-xs font-bold ${uploadedDocs.length > 0 ? "text-green-600" : "text-gray-400"}`}>
                    {uploadedDocs.length > 0
                      ? `✅ ${uploadedDocs.length} document(s) upload हो गए।`
                      : "कम से कम 1 document upload करना अनिवार्य है।"}
                  </p>
                </div>
              </section>

              {/* ── Section 4: Terms ── */}
              <section>
                <SectionHeading n={4} icon={<FileText size={15} />} title="Declaration & Terms" subtitle="घोषणा एवं शर्तें" />
                <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-xs text-gray-600 space-y-2 max-h-40 overflow-y-auto mb-3">
                  <p>1. <strong>Data Confidentiality:</strong> आपकी सभी जानकारी पूरी तरह गोपनीय रहेगी — किसी तीसरे पक्ष को share नहीं की जाएगी।</p>
                  <p>2. <strong>Office Visit:</strong> Online form submit करने के बाद admission complete करने के लिए original documents लेकर Office आना अनिवार्य है।</p>
                  <p>3. <strong>Free Counselling:</strong> हमारी सभी counselling services निःशुल्क हैं — कोई hidden charge नहीं।</p>
                  <p>4. <strong>Authenticity:</strong> मैं घोषित करता/करती हूँ कि form में दी गई सारी जानकारी सही और सत्य है।</p>
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={tcAccepted} onChange={e => setTcAccepted(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#003f9f]" />
                  <span className="text-sm font-semibold text-gray-700">मैं उपरोक्त सभी Terms & Conditions स्वीकार करता/करती हूँ।</span>
                </label>
              </section>

              {/* Submit */}
              <div className="border-t border-gray-200 pt-6">
                <button
                  type="submit"
                  disabled={loading || anyUploading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#003f9f] py-4 font-extrabold text-white hover:bg-blue-700 transition disabled:opacity-60 shadow-lg shadow-blue-200 active:scale-[0.99]"
                >
                  {loading ? <Loader size={18} className="animate-spin" /> : <><Send size={18} /> Submit Application</>}
                </button>
                <p className="mt-2 text-center text-xs text-gray-400">Submit के बाद counsellor 30 मिनट के भीतर संपर्क करेगा।</p>
              </div>
            </div>
          </form>

          {/* Help strip */}
          <div className="mx-auto max-w-3xl mt-6 flex flex-wrap justify-center gap-3">
            <a href="tel:+916203138576" className="inline-flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-5 py-2.5 text-sm font-extrabold text-[#003f9f] hover:bg-blue-50">
              <Phone size={16} /> Call +91 6203138576
            </a>
            <a
              href="https://wa.me/916203138576?text=नमस्ते!%20मुझे%20admission%20form%20भरने%20में%20मदद%20चाहिए।"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-2.5 text-sm font-extrabold text-white hover:bg-green-600"
            >
              <MessageCircle size={16} fill="currentColor" /> WhatsApp Help
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

/* Numbered section heading — gives the "official form" look */
function SectionHeading({ n, icon, title, subtitle }: { n: number; icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="mb-4 flex items-center gap-3 border-b-2 border-gray-100 pb-2.5">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#003f9f] text-white">
        {icon}
      </div>
      <div>
        <h2 className="font-headline text-base font-extrabold text-gray-900 leading-tight">
          <span className="text-[#003f9f]">{n}.</span> {title}
        </h2>
        <p className="text-[11px] text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100" />}>
      <ApplyForm />
    </Suspense>
  );
}
