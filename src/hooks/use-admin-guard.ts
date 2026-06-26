'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Shared client-side guard for every /admin/* page. The real authorization is
// the signed httpOnly cookie (verified by middleware + the Admin SDK APIs); this
// hook only decides what to render. It trusts the localStorage display hint when
// present, otherwise pings the cookie-gated API: 401 → bounce to login, anything
// else → the cookie is valid, so restore the hint and proceed.
//
// `authorized` is `null` while checking (render a loader), then `true`.
export function useAdminGuard(): { authorized: boolean | null; adminUser: string } {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState('Admin');

  useEffect(() => {
    const cached = localStorage.getItem('sw_admin_session');
    const cachedUser = localStorage.getItem('sw_admin_user');

    // Always verify the cookie against the server — never trust localStorage alone.
    // If the local hint is present we optimistically show content (avoids flash),
    // but a background ping evicts the hint and redirects on 401 (expired session).
    if (cached) {
      setAuthorized(true);
      setAdminUser(cachedUser || 'Admin');
    }

    fetch('/api/admin/data?type=ping', { credentials: 'include' })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem('sw_admin_session');
          localStorage.removeItem('sw_admin_user');
          router.replace('/admin/login');
          return;
        }
        localStorage.setItem('sw_admin_session', '1');
        if (!cached) {
          setAuthorized(true);
          setAdminUser(cachedUser || 'Admin');
        }
      })
      .catch(() => {
        if (!cached) router.replace('/admin/login');
      });
  }, [router]);

  return { authorized, adminUser };
}
