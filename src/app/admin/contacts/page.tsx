"use client";

import { useEffect, useState, useMemo } from "react";
import { AdminHeader } from "@/components/admin-header";
import { useAdminGuard } from "@/hooks/use-admin-guard";
import {
  Loader, Search, Mail, Phone, BookOpen, MessageSquare,
  CheckCircle2, RefreshCw, AlertCircle,
} from "lucide-react";

interface ContactMsg {
  id: string;
  name: string;
  phone: string;
  email?: string;
  course?: string;
  message?: string;
  read: boolean;
  createdAt: number;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function AdminContactsPage() {
  const { authorized } = useAdminGuard();
  const guardLoading = authorized === null;
  const [contacts, setContacts] = useState<ContactMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");

  async function loadContacts() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/contacts");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load");
      setContacts(json.data || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!guardLoading) loadContacts();
  }, [guardLoading]);

  async function markRead(id: string) {
    await fetch("/api/admin/contacts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).catch(() => {});
    setContacts(prev => prev.map(c => c.id === id ? { ...c, read: true } : c));
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return contacts.filter(c => {
      const matchSearch = !q || c.name.toLowerCase().includes(q) || c.phone.includes(q) || (c.email || "").toLowerCase().includes(q) || (c.course || "").toLowerCase().includes(q);
      const matchFilter = filter === "all" || !c.read;
      return matchSearch && matchFilter;
    });
  }, [contacts, search, filter]);

  const unreadCount = contacts.filter(c => !c.read).length;

  if (guardLoading) return <div className="flex min-h-screen items-center justify-center"><Loader className="animate-spin text-[#003f9f]" size={36} /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Contact Messages</h1>
            <p className="text-sm text-gray-500 mt-1">
              {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? "s" : ""}` : "All messages read"}
            </p>
          </div>
          <button onClick={loadContacts} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
            <RefreshCw size={15} /> Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone, course..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#003f9f]"
            />
          </div>
          <div className="flex rounded-xl border border-gray-200 bg-white overflow-hidden">
            {(["all", "unread"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2.5 text-sm font-semibold transition capitalize ${filter === f ? "bg-[#003f9f] text-white" : "text-gray-600 hover:bg-gray-50"}`}
              >
                {f === "unread" ? `Unread (${unreadCount})` : "All"}
              </button>
            ))}
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
            <Mail size={40} className="text-gray-200 mb-3" />
            <p className="font-semibold text-gray-500">No messages found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(contact => (
              <div
                key={contact.id}
                className={`rounded-xl border p-5 transition ${contact.read ? "border-gray-200 bg-white" : "border-blue-200 bg-blue-50 shadow-sm"}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl font-bold text-sm ${contact.read ? "bg-gray-100 text-gray-600" : "bg-blue-100 text-blue-700"}`}>
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-900">{contact.name}</p>
                        {!contact.read && <span className="h-2 w-2 rounded-full bg-blue-500" />}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                        <a href={`tel:${contact.phone}`} className="flex items-center gap-1 hover:text-[#003f9f]">
                          <Phone size={11} /> {contact.phone}
                        </a>
                        {contact.email && (
                          <a href={`mailto:${contact.email}`} className="flex items-center gap-1 hover:text-[#003f9f]">
                            <Mail size={11} /> {contact.email}
                          </a>
                        )}
                        {contact.course && (
                          <span className="flex items-center gap-1">
                            <BookOpen size={11} /> {contact.course}
                          </span>
                        )}
                      </div>
                      {contact.message && (
                        <div className="mt-2 rounded-lg bg-white border border-gray-100 px-3 py-2 text-sm text-gray-600">
                          <MessageSquare size={12} className="inline mr-1 text-gray-400" />
                          {contact.message}
                        </div>
                      )}
                      <p className="mt-2 text-[11px] text-gray-400">{formatDate(contact.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex flex-shrink-0 flex-col items-end gap-2">
                    <a href={`tel:${contact.phone}`}
                      className="flex items-center gap-1.5 rounded-xl bg-[#003f9f] px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition">
                      <Phone size={12} /> Call
                    </a>
                    <a href={`https://wa.me/91${contact.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`नमस्ते ${contact.name}! Siksha Wallah se bol rahe hain.`)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-xl bg-green-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-600 transition">
                      WhatsApp
                    </a>
                    {!contact.read && (
                      <button onClick={() => markRead(contact.id)}
                        className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition">
                        <CheckCircle2 size={12} /> Mark read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
