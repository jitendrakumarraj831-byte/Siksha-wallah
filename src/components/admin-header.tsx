'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { GraduationCap, LogOut } from 'lucide-react';
import { AdminMobileNav } from '@/components/admin-mobile-nav';

// Single source of truth for the office (admin) top bar — logo, section nav with
// active highlighting, mobile menu, signed-in name and logout. Used by every
// /admin/* page so the navigation can no longer drift between pages.
const LINKS = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/applications', label: 'Applications' },
  { href: '/admin/students', label: 'Students' },
  { href: '/admin/messages', label: 'Messages' },
  { href: '/admin/activity', label: 'Website Activity' },
];

export function AdminHeader({ adminUser = 'Admin' }: { adminUser?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' }).catch(() => {});
    localStorage.removeItem('sw_admin_session');
    localStorage.removeItem('sw_admin_user');
    router.replace('/admin/login');
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#003f9f] text-white">
            <GraduationCap size={20} />
          </span>
          <span className="font-headline text-lg font-extrabold">
            SIKSHA<span className="text-[#dc143c]">WALLAH</span>{' '}
            <span className="hidden text-sm font-normal text-gray-400 sm:inline">Office</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={
                  active
                    ? 'rounded-lg bg-blue-50 px-3 py-2 text-sm font-bold text-[#003f9f]'
                    : 'rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100'
                }
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <AdminMobileNav />
          <span className="hidden text-sm font-semibold text-gray-600 sm:block">Welcome, {adminUser}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border-2 border-gray-200 px-3 py-2 text-sm font-bold text-gray-700 transition hover:border-red-300 hover:text-red-600"
          >
            <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
