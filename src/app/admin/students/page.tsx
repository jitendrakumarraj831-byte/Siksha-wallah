"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap, LogOut, Loader, Users, Phone, MessageCircle,
  ArrowLeft, Search, AlertCircle, UserCheck, UserX, Mail,
  MapPin, Calendar, BookOpen, LayoutDashboard,
} from "lucide-react";
import { adminService } from "@/services/admin-service";

function getInitials(name: string) {
  return name ? name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "?";
}

function formatDate(ts: any): string {
  if (!ts) return "—";
  try {
    const d = typeof ts === "number" ? new Date(ts) : ts?.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return "—"; }
}

export default function AdminStudentsPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState("Admin");
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"" | "complete" | "incomplete">("");
  const [expanded, setExpanded] = useState<string | null>(null);

  // Auth check
  useEffect(() => {
    const session = localStorage.getItem("sw_admin_session");
    const user = localStorage.getItem("sw_admin_user");
    if (!session) { router.replace("/admin/login"); return; }
    setAuthorized(true);
    setAdminUser(user || "Admin");
  }, [router]);

  useEffect(() => { if (authorized) load(); }, [authorized]);

  async function load() {
    setLoading(true);
    try {
      const data = await adminService.getAllStudents();
      setStudents(data);
      setError("");
    } catch (e: any) {
      setError("Could not load students. Firebase Firestore rules may require authentication for this collection.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("sw_admin_session");
    localStorage.removeItem("sw_admin_user");
    router.replace("/admin/login");
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return students.filter(s => {
      const matchSearch = !q ||
        s.name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.phone?.includes(q) ||
        s.city?.toLowerCase().includes(q);
      const matchStatus = !filterStatus ||
        (filterStatus === "complete" ? s.profileComplete : !s.profileComplete);
      return matchSearch && matchStatus;
    });
  }, [students, search, filterStatus]);

  const complete = students.filter(s => s.profileComplete).length;
  const incomplete = students.length - complete;

  if (authorized === null) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Loader className="animate-spin text-[#003f9f]" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Top Nav ── */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#003f9f] text-white">
              <GraduationCap size={20} />
            </span>
            <span className="font-headline text-lg font-extrabold">
              SIKSHA<span className="text-[#dc143c]">WALLAH</span>{" "}
              <span className="text-gray-400 font-normal text-sm">Office</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            <Link href="/admin/dashboard" className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">
              Inquiries
            </Link>
            <Link href="/admin/students" className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-bold text-[#003f9f]">
              Registered Students
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-semibold text-gray-600 sm:block">Welcome, {adminUser}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border-2 border-gray-200 px-4 py-2 text-sm font-bold text-gray-700 hover:border-red-300 hover:text-red-600 transition"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">

        {/* ── Breadcrumb + header ── */}
        <div className="mb-6">
          <Link href="/admin/dashboard" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#003f9f] hover:underline mb-3">
            <ArrowLeft size={14} /> Back to Inquiries
          </Link>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-400 mb-1">
                <LayoutDashboard size={13} /> Office Dashboard
              </div>
              <h1 className="font-headline text-3xl font-extrabold text-gray-900">Registered Students</h1>
              <p className="text-sm text-gray-500 mt-0.5">Students who created accounts on the Siksha Wallah portal</p>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Total Registered", value: students.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
            { label: "Profile Complete", value: complete, icon: UserCheck, color: "text-green-600", bg: "bg-green-50 border-green-100" },
            { label: "Profile Incomplete", value: incomplete, icon: UserX, color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-100" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className={`rounded-2xl border-2 bg-white p-5 shadow-sm ${bg.split(" ")[1]}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
                  <p className={`mt-2 text-4xl font-extrabold ${color}`}>{value}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg}`}>
                  <Icon size={22} className={color} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="mb-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-amber-600" />
            <div>
              <p className="font-bold">Note: {error}</p>
              <p className="mt-1 text-xs">Inquiry leads are still fully accessible on the <Link href="/admin/dashboard" className="underline font-bold">Inquiries Dashboard</Link>. Registered student data requires Firestore Auth or Admin SDK access.</p>
            </div>
          </div>
        )}

        {/* ── Search + Filter ── */}
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone, email, city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#003f9f] transition"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as "" | "complete" | "incomplete")}
            className="rounded-xl border-2 border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 outline-none focus:border-[#003f9f] transition"
          >
            <option value="">All Students</option>
            <option value="complete">Profile Complete</option>
            <option value="incomplete">Profile Incomplete</option>
          </select>
        </div>

        {/* ── Student Cards / Table ── */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size={32} className="animate-spin text-[#003f9f]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border-2 border-gray-100 bg-white py-20 text-center shadow-sm">
            <Users size={36} className="mx-auto mb-3 text-gray-300" />
            <p className="font-semibold text-gray-500">
              {error ? "Students data unavailable" : "No students found"}
            </p>
            <p className="mt-1 text-sm text-gray-400">
              {error ? "Check Firestore rules / admin access" : "Try a different search or filter"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(student => {
              const isOpen = expanded === (student.id || student.uid);
              const key = student.id || student.uid;
              return (
                <div
                  key={key}
                  className="rounded-2xl border-2 border-gray-100 bg-white shadow-sm overflow-hidden transition hover:border-blue-200"
                >
                  {/* ── Student Row ── */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : key)}
                    className="w-full text-left"
                  >
                    <div className="flex flex-wrap items-center gap-4 p-4">
                      {/* Avatar */}
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#003f9f] font-headline text-lg font-extrabold text-white">
                        {getInitials(student.name || "")}
                      </div>

                      {/* Name + email */}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate">{student.name || "Unknown"}</p>
                        <p className="text-xs text-gray-400 truncate">{student.email || "—"}</p>
                      </div>

                      {/* Phone */}
                      <div className="hidden text-sm font-semibold text-gray-700 sm:block">
                        {student.phone || student.mobile || "—"}
                      </div>

                      {/* Course */}
                      {(student.course || student.desiredCourse) && (
                        <span className="hidden rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-800 sm:inline">
                          {student.course || student.desiredCourse}
                        </span>
                      )}

                      {/* Profile badge */}
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${student.profileComplete ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {student.profileComplete ? "✓ Complete" : "Incomplete"}
                      </span>

                      {/* Chevron */}
                      <span className={`text-gray-400 text-xs font-bold transition ${isOpen ? "rotate-90" : ""}`}>▶</span>
                    </div>
                  </button>

                  {/* ── Expanded Details ── */}
                  {isOpen && (
                    <div className="border-t border-gray-100 bg-gray-50 px-5 py-5">
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                        {/* Contact Info */}
                        <div className="rounded-xl bg-white border border-gray-100 p-4">
                          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">Contact Details</p>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-700">
                              <Phone size={13} className="text-[#003f9f]" />
                              <span className="font-semibold">{student.phone || student.mobile || "—"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                              <Mail size={13} className="text-[#003f9f]" />
                              <span className="truncate">{student.email || "—"}</span>
                            </div>
                            {(student.city || student.address) && (
                              <div className="flex items-start gap-2 text-gray-700">
                                <MapPin size={13} className="mt-0.5 flex-shrink-0 text-[#003f9f]" />
                                <span>{student.city || student.address}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Academic Info */}
                        <div className="rounded-xl bg-white border border-gray-100 p-4">
                          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">Academic Info</p>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-700">
                              <BookOpen size={13} className="text-purple-500" />
                              <span><strong>Course:</strong> {student.course || student.desiredCourse || "—"}</span>
                            </div>
                            {student.qualification && (
                              <div className="flex items-center gap-2 text-gray-700">
                                <BookOpen size={13} className="text-purple-500" />
                                <span><strong>Qualification:</strong> {student.qualification}</span>
                              </div>
                            )}
                            {student.stream && (
                              <div className="flex items-center gap-2 text-gray-700">
                                <BookOpen size={13} className="text-purple-500" />
                                <span><strong>Stream:</strong> {student.stream}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Account Info */}
                        <div className="rounded-xl bg-white border border-gray-100 p-4">
                          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">Account Info</p>
                          <div className="space-y-2 text-sm">
                            {student.createdAt && (
                              <div className="flex items-center gap-2 text-gray-700">
                                <Calendar size={13} className="text-gray-400" />
                                <span><strong>Joined:</strong> {formatDate(student.createdAt)}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <span className={`rounded-full px-3 py-1 text-xs font-bold ${student.profileComplete ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                Profile: {student.profileComplete ? "Complete" : "Incomplete"}
                              </span>
                            </div>
                            {student.role && (
                              <p className="text-xs text-gray-400">Role: {student.role}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="mt-4 flex flex-wrap gap-3">
                        {(student.phone || student.mobile) && (
                          <a
                            href={`tel:+91${student.phone || student.mobile}`}
                            className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-green-600 transition"
                          >
                            <Phone size={14} /> Call Now
                          </a>
                        )}
                        {(student.phone || student.mobile) && (
                          <a
                            href={`https://wa.me/91${student.phone || student.mobile}?text=Hello%20${encodeURIComponent(student.name || "")}%2C%20I%20am%20from%20Siksha%20Wallah%20Admission%20Helpline.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white hover:bg-green-500 transition"
                          >
                            <MessageCircle size={14} /> WhatsApp
                          </a>
                        )}
                        {student.email && (
                          <a
                            href={`mailto:${student.email}?subject=Admission%20Update%20-%20Siksha%20Wallah`}
                            className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 hover:border-[#003f9f] hover:text-[#003f9f] transition"
                          >
                            <Mail size={14} /> Send Email
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <p className="mt-4 text-center text-xs text-gray-400">
          Showing {filtered.length} of {students.length} registered students
        </p>

      </main>
    </div>
  );
}
