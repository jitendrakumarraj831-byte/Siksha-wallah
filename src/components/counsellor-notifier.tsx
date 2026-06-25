'use client';

import { useEffect, useRef, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';

// Student-side "counsellor is online" notifier.
//   • While a student is logged in, polls the public /api/office-status.
//   • When the office goes online (or is already online at login) and the user
//     has granted permission, fires a phone/desktop system notification that
//     deep-links into the chat.
//   • If permission hasn't been granted yet, shows a small one-time prompt
//     asking the student to enable notifications.
// Mounted app-wide but dormant unless a Firebase student is signed in (the
// office cookie session is not a Firebase user, so this never runs on /admin).

const POLL_MS = 60 * 1000;
const PROMPT_DISMISS_KEY = 'sw_notif_prompt_dismissed';
const NOTIFIED_KEY = 'sw_office_notified'; // sessionStorage — once per online streak

function supported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;
}

async function fireOnlineNotification(): Promise<void> {
  if (!supported() || Notification.permission !== 'granted') return;
  if (sessionStorage.getItem(NOTIFIED_KEY) === '1') return;
  // No point nagging if they're already on the chat screen.
  if (window.location.pathname.startsWith('/dashboard/messages')) {
    sessionStorage.setItem(NOTIFIED_KEY, '1');
    return;
  }
  try {
    const reg = await navigator.serviceWorker.ready;
    await reg.showNotification('Siksha Wallah 💬', {
      body: 'Counsellor abhi online hai! Apna sawaal poochhne ke liye abhi chat karein.',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'counsellor-online',
      data: { url: '/dashboard/messages' },
    });
    sessionStorage.setItem(NOTIFIED_KEY, '1');
  } catch {
    /* ignore — notification is best-effort */
  }
}

export function CounsellorNotifier() {
  const { isAuthenticated } = useAuth();
  const [perm, setPerm] = useState<NotificationPermission>('default');
  const [showPrompt, setShowPrompt] = useState(false);
  const onlineRef = useRef(false);

  useEffect(() => {
    if (supported()) setPerm(Notification.permission);
  }, []);

  // Show the "enable notifications" prompt only to a signed-in student who
  // hasn't decided yet and hasn't dismissed it before.
  useEffect(() => {
    if (!supported() || !isAuthenticated) {
      setShowPrompt(false);
      return;
    }
    const dismissed = localStorage.getItem(PROMPT_DISMISS_KEY) === '1';
    setShowPrompt(perm === 'default' && !dismissed);
  }, [isAuthenticated, perm]);

  // Poll office status while signed in; notify on the offline→online edge.
  useEffect(() => {
    if (!supported() || !isAuthenticated) return;
    let stop = false;

    const check = async () => {
      try {
        const res = await fetch('/api/office-status', { cache: 'no-store' });
        const json = await res.json();
        const online = !!json.online;
        if (online && !onlineRef.current) fireOnlineNotification();
        if (!online) sessionStorage.removeItem(NOTIFIED_KEY); // arm again for next streak
        onlineRef.current = online;
      } catch {
        /* ignore — try again next tick */
      }
    };

    check();
    const id = setInterval(() => { if (!stop) check(); }, POLL_MS);
    return () => { stop = true; clearInterval(id); };
  }, [isAuthenticated]);

  const enable = async () => {
    if (!supported()) return;
    try {
      const p = await Notification.requestPermission();
      setPerm(p);
      setShowPrompt(false);
      if (p === 'granted' && onlineRef.current) fireOnlineNotification();
    } catch {
      /* ignore */
    }
  };

  const dismiss = () => {
    setShowPrompt(false);
    try { localStorage.setItem(PROMPT_DISMISS_KEY, '1'); } catch { /* ignore */ }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-6 right-5 z-50 max-w-[calc(100vw-2.5rem)]">
      <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-white p-4 shadow-xl">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
          <Bell size={20} className="text-[#003f9f]" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-900">Counsellor online ho to turant pata chale</p>
          <p className="mt-0.5 text-xs text-gray-500">
            Notification on karein — jab counsellor available ho, aapko alert mil jaayega.
          </p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={enable}
              className="rounded-lg bg-[#003f9f] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-blue-700"
            >
              Allow karein
            </button>
            <button
              onClick={dismiss}
              className="rounded-lg px-3 py-1.5 text-xs font-bold text-gray-500 transition hover:bg-gray-100"
            >
              Abhi nahi
            </button>
          </div>
        </div>
        <button onClick={dismiss} aria-label="Dismiss" className="ml-1 text-gray-400 transition hover:text-gray-700">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
