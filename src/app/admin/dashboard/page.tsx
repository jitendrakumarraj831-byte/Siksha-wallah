"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap, LogOut, Loader, Users, Phone, CheckCircle2,
  MessageCircle, Filter, Clock, AlertCircle, RefreshCw,
  TrendingUp, BookOpen, LayoutDashboard,
} from "lucide-react";
import { getAllInquiries, updateInquiryStatus, type Inquiry, type InquiryStatus } from "@/services/inquiry-service";

const STATUS_LABELS: Record<InquiryStatus, { label: string; color: string }> = {
  pending:       { label: "Pending",        color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  called:        { label: "Called",         color: "bg-blue-100 text-blue-800 border-blue-200" },
  admission_done:{ label: "Admission Done", color: "bg-green-100 text-green-800 border-green-200" },
};

function formatDate(ts: any): string {
  if (!ts) return "—";
  try {
    const d = ts?.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return "—";
  }
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState("Admin");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [filterCourse, setFilterCourse] = useState("");
  const [filterStatus, setFilterStatus] = useState<"" | InquiryStatus>("");

  // Auth check
  useEffect(() => {
    const session = typeof window !== "undefined" ? localStorage.getItem("sw_admin_session") : null;
    const user = typeof window !== "undefined" ? localStorage.getItem("sw_admin_user") : null;
    if (!session) {
      router.replace("/admin/login");
    } else {
      setAuthorized(true);
      setAdminUser(user || "Admin");
    }
  }, [router]);

  // Load inquiries
  useEffect(() => {
    if (!authorized) return;
    loadInquiries();
  }, [authorized]);

  async function loadInquiries() {
    setLoading(true);
    try {
      const data = await getAllInquiries();
      setInquiries(data);
      setError("");
    } catch (e: any) {
      setError("Could not load inquiries. Check Firebase connection.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: string, status: InquiryStatus) {
    try {
      await updateInquiryStatus(id, status);
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
      );
    } catch {
      alert("Failed to update status. Please try again.");
    }
  }

  function handleLogout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("sw_admin_session");
      localStorage.removeItem("sw_admin_user");
    }
    router.push("/");
  }

  // Derived stats
  const totalInquiries = inquiries.length;
  const pendingCalls = inquiries.filter((i) => !i.status || i.status === "pending").length;
  const admissionsConfirmed = inquiries.filter((i) => i.status === "admission_done").length;

  // Unique courses for filter
  const uniqueCourses = useMemo(
    () => [...new Set(inquiries.map((i) => i.course).filter(Boolean))].sort(),
    [inquiries]
  );

  // Filtered data
  const filtered = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchCourse = !filterCourse || inq.course === filterCourse;
      const matchStatus = !filterStatus || (inq.status || "pending") === filterStatus;
      return matchCourse && matchStatus;
    });
  }, [inquiries, filterCourse, filterStatus]);

  if (authorized === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader className="animate-spin text-[#003f9f]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#003f9f] text-white shadow">
              <GraduationCap size={20} />
            </span>
            <span className="font-headline text-lg font-extrabold">
              SIKSHA<span className="text-[#dc143c]">WALLAH</span>{" "}
              <span className="text-gray-400 font-normal text-sm">Admin</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-semibold text-gray-600 sm:block">
              Welcome, {adminUser}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border-2 border-gray-200 px-4 py-2 text-sm font-bold text-gray-700 transition hover:border-red-300 hover:text-red-600"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-1">
            <LayoutDashboard size={14} /> Dashboard
          </div>
          <h1 className="font-headline text-3xl font-extrabold text-gray-900">Student Inquiries</h1>
          <p className="mt-1 text-gray-500">Pan-India leads captured from the homepage inquiry form</p>
        </div>

        {/* Summary Widgets */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border-2 border-blue-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500">Total Inquiries</p>
                <p className="mt-2 text-4xl font-extrabold text-gray-900">{totalInquiries}</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                <Users size={28} className="text-blue-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-blue-600">
              <TrendingUp size={12} /> All time leads
            </div>
          </div>

          <div className="rounded-2xl border-2 border-yellow-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500">Pending Calls</p>
                <p className="mt-2 text-4xl font-extrabold text-yellow-600">{pendingCalls}</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-50">
                <Clock size={28} className="text-yellow-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-yellow-600">
              <AlertCircle size={12} /> Need follow-up
            </div>
          </div>

          <div className="rounded-2xl border-2 border-green-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500">Admissions Confirmed</p>
                <p className="mt-2 text-4xl font-extrabold text-green-600">{admissionsConfirmed}</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50">
                <CheckCircle2 size={28} className="text-green-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-green-600">
              <BookOpen size={12} /> Conversions
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* Filters + Refresh */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
            <Filter size={14} /> Filter:
          </div>

          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="rounded-xl border-2 border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 outline-none focus:border-[#003f9f] transition"
          >
            <option value="">All Courses</option>
            {uniqueCourses.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as "" | InquiryStatus)}
            className="rounded-xl border-2 border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 outline-none focus:border-[#003f9f] transition"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="called">Called</option>
            <option value="admission_done">Admission Done</option>
          </select>

          <button
            onClick={loadInquiries}
            className="ml-auto flex items-center gap-2 rounded-xl border-2 border-gray-200 px-4 py-2 text-sm font-bold text-gray-600 transition hover:border-[#003f9f] hover:text-[#003f9f]"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Table */}
        <div className="rounded-2xl border-2 border-gray-100 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader size={32} className="animate-spin text-[#003f9f]" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <Users size={40} className="mx-auto mb-3 text-gray-300" />
              <p className="font-semibold text-gray-500">No inquiries found</p>
              <p className="mt-1 text-sm text-gray-400">Submit a test inquiry from the homepage to see data here.</p>
              <Link
                href="/"
                className="mt-4 inline-block rounded-xl bg-[#003f9f] px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition"
              >
                Go to Homepage →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-100 bg-gray-50">
                    <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Date</th>
                    <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Student Name</th>
                    <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Contact</th>
                    <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Desired Course</th>
                    <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Qualification</th>
                    <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                    <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((inq) => {
                    const st = (inq.status || "pending") as InquiryStatus;
                    const { label, color } = STATUS_LABELS[st];
                    const qualification = inq.qualification || (inq.message?.startsWith("Qualification:") ? inq.message.replace("Qualification:", "").trim() : inq.message) || "—";
                    return (
                      <tr key={inq.id} className="transition hover:bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3.5 text-gray-500 font-medium">{formatDate(inq.createdAt)}</td>
                        <td className="px-4 py-3.5">
                          <p className="font-bold text-gray-900">{inq.fullName}</p>
                          {inq.email && <p className="text-xs text-gray-400">{inq.email}</p>}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-gray-800">{inq.mobile}</td>
                        <td className="px-4 py-3.5">
                          <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-bold text-blue-800">
                            {inq.course || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-gray-600">{qualification}</td>
                        <td className="px-4 py-3.5">
                          <select
                            value={st}
                            onChange={(e) => inq.id && handleStatusChange(inq.id, e.target.value as InquiryStatus)}
                            className={`rounded-full border px-3 py-1 text-xs font-bold outline-none transition cursor-pointer ${color}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="called">Called</option>
                            <option value="admission_done">Admission Done</option>
                          </select>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:+91${inq.mobile}`}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-green-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-600 transition"
                            >
                              <Phone size={12} /> Call Now
                            </a>
                            <a
                              href={`https://wa.me/91${inq.mobile}?text=Hello%20${encodeURIComponent(inq.fullName)}%2C%20I%20am%20calling%20from%20Siksha%20Wallah%20regarding%20your%20inquiry%20for%20${encodeURIComponent(inq.course || "course%20admission")}.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-bold text-white hover:bg-green-500 transition"
                            >
                              <MessageCircle size={12} /> WhatsApp
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          Showing {filtered.length} of {totalInquiries} total inquiries
        </p>

        {/* Quick Nav */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Link href="/admin/students" className="rounded-2xl border-2 border-gray-100 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition">
            <Users size={24} className="text-blue-600 mb-2" />
            <p className="font-bold text-gray-900">Manage Students</p>
            <p className="text-xs text-gray-500 mt-1">View registered student profiles</p>
          </Link>
          <Link href="/admin/applications" className="rounded-2xl border-2 border-gray-100 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition">
            <BookOpen size={24} className="text-purple-600 mb-2" />
            <p className="font-bold text-gray-900">Applications</p>
            <p className="text-xs text-gray-500 mt-1">Approve or reject enrollment requests</p>
          </Link>
          <Link href="/admin/analytics" className="rounded-2xl border-2 border-gray-100 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition">
            <TrendingUp size={24} className="text-green-600 mb-2" />
            <p className="font-bold text-gray-900">Analytics</p>
            <p className="text-xs text-gray-500 mt-1">Revenue, traffic, and performance</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
