'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

// Mobile-only nav for the office (admin) pages. The desktop <nav> in each admin
// header is `hidden ... sm:flex`, so on phones there was no way to reach the
// other sections (Messages, Students, …). This hamburger fills that gap and is
// itself hidden on ≥sm screens, leaving the desktop layout untouched.

const LINKS = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/applications', label: 'Applications' },
  { href: '/admin/students', label: 'Students' },
  { href: '/admin/documents', label: 'Documents' },
  { href: '/admin/contacts', label: 'Contact Messages' },
  { href: '/admin/messages', label: 'Student Chat' },
  { href: '/admin/activity', label: 'Website Activity' },
  { href: '/admin/profile', label: 'Admin Profile' },
];

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="relative sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-gray-200 text-gray-700 transition hover:border-[#003f9f] hover:text-[#003f9f]"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {open && (
        <>
          {/* Tap-outside backdrop */}
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          {/* Dropdown */}
          <nav className="absolute right-0 top-12 z-50 w-52 overflow-hidden rounded-2xl border border-gray-200 bg-white py-1.5 shadow-lg">
            {LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-2.5 text-sm font-semibold transition ${
                    active ? 'bg-blue-50 text-[#003f9f]' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </>
      )}
    </div>
  );
}
