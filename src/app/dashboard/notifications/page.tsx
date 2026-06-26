'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { PortalShell } from '@/components/portal-shell';
import { getIdToken } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  ArrowLeft, Loader, Bell, BellOff, CheckCircle2, AlertCircle,
  ShieldCheck, ShieldX, Info, RefreshCw,
} from 'lucide-react';

interface Notification {
  id: string;
  uid: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info';
  read: boolean;
  createdAt: number;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function NotifIcon({ type }: { type: string }) {
  if (type === 'success') return <ShieldCheck size={18} className="text-green-600" />;
  if (type === 'warning') return <ShieldX size={18} className="text-red-500" />;
  return <Info size={18} className="text-blue-500" />;
}

export default function NotificationsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [error, setError] = useState('');

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const token = auth?.currentUser ? await getIdToken(auth.currentUser) : null;
      const res = await fetch(`/api/student/notifications?uid=${user.uid}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Failed to load notifications');
      setNotifications(json.data || []);
      setError('');
    } catch (e: any) {
      setError(e.message || 'Failed to load notifications');
    } finally { setLoading(false); }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) { router.push('/auth/login'); return; }
    if (!user) return;
    fetchNotifications();
  }, [authLoading, isAuthenticated, user, router, fetchNotifications]);

  const markAllRead = async () => {
    if (!user) return;
    setMarking(true);
    try {
      const token = auth?.currentUser ? await getIdToken(auth.currentUser) : null;
      await fetch('/api/student/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ uid: user.uid, markAllRead: true }),
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch {}
    finally { setMarking(false); }
  };

  const markRead = async (id: string) => {
    if (!user) return;
    try {
      const token = auth?.currentUser ? await getIdToken(auth.currentUser) : null;
      await fetch('/api/student/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ uid: user.uid, id }),
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch {}
  };

  if (authLoading || loading) {
    return (
      <PortalShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader className="animate-spin text-blue-600" size={40} />
        </div>
      </PortalShell>
    );
  }

  if (!isAuthenticated) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <PortalShell>
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="bg-gradient-to-br from-[#00102e] via-[#001f6b] to-[#003f9f] px-4 py-8">
          <div className="container-shell max-w-2xl">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-blue-300 hover:text-white text-sm font-semibold mb-4">
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Bell size={22} /> Notifications
                </h1>
                <p className="text-blue-300 text-sm mt-1">
                  {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                </p>
              </div>
              {unreadCount > 0 && (
                <button onClick={markAllRead} disabled={marking}
                  className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/20 transition disabled:opacity-60">
                  {marking ? <Loader size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                  Mark all read
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="container-shell max-w-2xl py-6">
          {error && (
            <div className="mb-4 flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
              <button onClick={fetchNotifications} className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline">
                <RefreshCw size={12} /> Retry
              </button>
            </div>
          )}
          {!error && notifications.length === 0 && (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                <BellOff size={28} className="text-gray-300" />
              </div>
              <div>
                <p className="font-bold text-gray-600">No notifications yet</p>
                <p className="text-sm text-gray-400 mt-1">Document verification updates will appear here.</p>
              </div>
            </div>
          )}
          {!error && notifications.length > 0 && (
            <div className="space-y-3">
              {notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => !notif.read && markRead(notif.id)}
                  className={`rounded-xl border p-4 transition cursor-pointer ${
                    notif.read
                      ? 'bg-white border-gray-200'
                      : 'bg-blue-50 border-blue-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl ${
                      notif.type === 'success' ? 'bg-green-100' :
                      notif.type === 'warning' ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      <NotifIcon type={notif.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-bold ${notif.read ? 'text-gray-700' : 'text-gray-900'}`}>
                          {notif.title}
                        </p>
                        {!notif.read && (
                          <span className="flex-shrink-0 h-2 w-2 rounded-full bg-blue-500 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
                      <p className="text-[11px] text-gray-400 mt-1.5">{formatDate(notif.createdAt)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PortalShell>
  );
}
