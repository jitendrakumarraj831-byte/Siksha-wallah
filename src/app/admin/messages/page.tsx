"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdminMobileNav } from "@/components/admin-mobile-nav";
import {
  GraduationCap, LogOut, Loader, ArrowLeft, Send, MessageCircle, User,
} from "lucide-react";

interface Conversation {
  studentId: string;
  studentName: string;
  studentEmail?: string;
  lastMessage: string;
  lastSender: "student" | "admin";
  lastAt: number;
  unread: number;
}
interface Msg {
  id: string;
  studentId: string;
  studentName: string;
  sender: "student" | "admin";
  text: string;
  createdAt: number;
}

function timeAgo(ms: number): string {
  if (!ms) return "";
  const diff = Math.floor((Date.now() - ms) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return new Date(ms).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}
function fmtTime(ms: number): string {
  if (!ms) return "अभी";
  return new Date(ms).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function AdminMessagesPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState("Admin");

  const [convs, setConvs] = useState<Conversation[]>([]);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [active, setActive] = useState<Conversation | null>(null);
  const [thread, setThread] = useState<Msg[]>([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // ── Auth ──
  useEffect(() => {
    const cached = localStorage.getItem("sw_admin_session");
    if (cached) {
      setAuthorized(true);
      setAdminUser(localStorage.getItem("sw_admin_user") || "Admin");
      return;
    }
    fetch("/api/admin/data?type=ping", { credentials: "include" })
      .then((res) => {
        if (res.status === 401) { router.replace("/admin/login"); return; }
        localStorage.setItem("sw_admin_session", "1");
        setAuthorized(true);
      })
      .catch(() => router.replace("/admin/login"));
  }, [router]);

  // ── Conversation list (poll every 5s) ──
  const loadConvs = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/chat", { credentials: "include" });
      if (res.status === 401) { router.replace("/admin/login"); return; }
      const json = await res.json();
      if (json.success) setConvs(json.data);
    } catch { /* keep last */ }
    finally { setLoadingConvs(false); }
  }, [router]);

  useEffect(() => {
    if (!authorized) return;
    loadConvs();
    const id = setInterval(loadConvs, 5000);
    return () => clearInterval(id);
  }, [authorized, loadConvs]);

  // ── Active thread (poll every 4s) ──
  const loadThread = useCallback(async (studentId: string) => {
    try {
      const res = await fetch(`/api/admin/chat?studentId=${encodeURIComponent(studentId)}`, { credentials: "include" });
      const json = await res.json();
      if (json.success) setThread(json.data);
    } catch { /* keep last */ }
  }, []);

  useEffect(() => {
    if (!active) return;
    loadThread(active.studentId);
    const id = setInterval(() => loadThread(active.studentId), 4000);
    return () => clearInterval(id);
  }, [active, loadThread]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [thread]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    localStorage.removeItem("sw_admin_session");
    localStorage.removeItem("sw_admin_user");
    router.replace("/admin/login");
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const t = reply.trim();
    if (!t || !active || sending) return;
    setSending(true);
    setReply("");
    try {
      const res = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ studentId: active.studentId, studentName: active.studentName, text: t }),
      });
      if (res.ok) { await loadThread(active.studentId); loadConvs(); }
      else setReply(t);
    } catch { setReply(t); }
    finally { setSending(false); }
  }

  if (authorized === null) {
    return <div className="flex min-h-screen items-center justify-center"><Loader className="animate-spin text-[#003f9f]" size={36} /></div>;
  }

  const totalUnread = convs.reduce((n, c) => n + c.unread, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#003f9f] text-white"><GraduationCap size={20} /></span>
            <span className="font-headline text-lg font-extrabold">SIKSHA<span className="text-[#dc143c]">WALLAH</span> <span className="text-gray-400 font-normal text-sm">Office</span></span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            <Link href="/admin/dashboard" className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Dashboard</Link>
            <Link href="/admin/students" className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Students</Link>
            <Link href="/admin/applications" className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Applications</Link>
            <Link href="/admin/messages" className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-bold text-[#003f9f]">Messages</Link>
            <Link href="/admin/activity" className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Website Activity</Link>
          </nav>
          <div className="flex items-center gap-3">
            <AdminMobileNav />
            <span className="hidden text-sm font-semibold text-gray-600 sm:block">Welcome, {adminUser}</span>
            <button onClick={handleLogout} className="flex items-center gap-2 rounded-xl border-2 border-gray-200 px-4 py-2 text-sm font-bold text-gray-700 hover:border-red-300 hover:text-red-600 transition">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-4">
          <h1 className="font-headline text-3xl font-extrabold text-gray-900">Student Messages</h1>
          <p className="mt-1 text-sm text-gray-500">
            Students ke saath direct chat — {convs.length} conversation{convs.length !== 1 ? "s" : ""}
            {totalUnread > 0 && <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">{totalUnread} unread</span>}
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
          {/* Conversation list */}
          <div className={`rounded-2xl border border-gray-200 bg-white ${active ? "hidden lg:block" : ""}`}>
            <div className="border-b border-gray-100 px-4 py-3 text-sm font-bold text-gray-700">Conversations</div>
            <div className="max-h-[70vh] overflow-y-auto">
              {loadingConvs ? (
                <div className="flex justify-center py-12"><Loader size={24} className="animate-spin text-[#003f9f]" /></div>
              ) : convs.length === 0 ? (
                <div className="px-4 py-12 text-center text-sm text-gray-400">Abhi koi message nahi aaya.</div>
              ) : (
                convs.map((c) => (
                  <button
                    key={c.studentId}
                    onClick={() => setActive(c)}
                    className={`flex w-full items-center gap-3 border-b border-gray-50 px-4 py-3 text-left transition hover:bg-gray-50 ${active?.studentId === c.studentId ? "bg-blue-50" : ""}`}
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#003f9f] to-[#0060c7] text-sm font-extrabold text-white">
                      {(c.studentName || "S").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-bold text-gray-900">{c.studentName}</p>
                        <span className="flex-shrink-0 text-[11px] text-gray-400">{timeAgo(c.lastAt)}</span>
                      </div>
                      <p className="truncate text-xs text-gray-500">
                        {c.lastSender === "admin" && <span className="text-gray-400">You: </span>}
                        {c.lastMessage}
                      </p>
                    </div>
                    {c.unread > 0 && (
                      <span className="flex h-5 min-w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white">{c.unread}</span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Thread */}
          <div className={`flex h-[70vh] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white ${active ? "" : "hidden lg:flex"}`}>
            {!active ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-gray-400">
                <MessageCircle size={40} className="text-gray-300" />
                <p className="text-sm font-semibold">Kisi conversation ko select karein</p>
              </div>
            ) : (
              <>
                {/* Thread header */}
                <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
                  <button onClick={() => setActive(null)} className="lg:hidden" aria-label="Back to list"><ArrowLeft size={20} className="text-gray-500" /></button>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#003f9f] to-[#0060c7] text-sm font-extrabold text-white">
                    {(active.studentName || "S").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-bold text-gray-900">{active.studentName}</p>
                    {active.studentEmail && <p className="truncate text-xs text-gray-400">{active.studentEmail}</p>}
                  </div>
                  <Link href="/admin/students" className="ml-auto inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-bold text-gray-600 hover:border-[#003f9f] hover:text-[#003f9f]">
                    <User size={12} /> Profile
                  </Link>
                </div>

                {/* Messages */}
                <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 px-4 py-4">
                  {thread.map((m) => {
                    const admin = m.sender === "admin";
                    return (
                      <div key={m.id} className={`flex ${admin ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${admin ? "rounded-br-sm bg-[#003f9f] text-white" : "rounded-bl-sm border border-gray-200 bg-white text-gray-800"}`}>
                          <p className="whitespace-pre-wrap break-words leading-relaxed">{m.text}</p>
                          <p className={`mt-1 text-right text-[10px] ${admin ? "text-blue-200" : "text-gray-400"}`}>{fmtTime(m.createdAt)}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={endRef} />
                </div>

                {/* Composer */}
                <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-gray-100 px-3 py-3">
                  <input
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Reply type karein…"
                    maxLength={2000}
                    className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#003f9f]"
                  />
                  <button type="submit" disabled={!reply.trim() || sending} aria-label="Send reply" className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#003f9f] text-white transition hover:bg-blue-700 disabled:opacity-50">
                    {sending ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
