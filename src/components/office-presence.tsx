'use client';

import { useEffect } from 'react';

// Invisible heartbeat for the office dashboard. While an admin page is open and
// the tab is visible, it pings /api/admin/presence so students can see that a
// counsellor is online. It stops itself if the session is invalid (e.g. on the
// login page → 401), so it never spams an unauthenticated route.
const HEARTBEAT_MS = 45 * 1000;

export function OfficePresence() {
  useEffect(() => {
    let stopped = false;

    const ping = async () => {
      if (stopped) return;
      try {
        const res = await fetch('/api/admin/presence', { method: 'POST', credentials: 'include' });
        if (res.status === 401) stopped = true; // not logged in (e.g. /admin/login)
      } catch {
        /* transient network error — retry on the next tick */
      }
    };

    ping();
    const timer = setInterval(() => {
      if (!stopped && document.visibilityState === 'visible') ping();
    }, HEARTBEAT_MS);

    const onVisible = () => {
      if (document.visibilityState === 'visible') ping();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      stopped = true;
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return null;
}
