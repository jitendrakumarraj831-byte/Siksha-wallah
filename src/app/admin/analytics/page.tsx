'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { PortalShell } from '@/components/portal-shell';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminAnalyticsPage() {
  const { userProfile, isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated || userProfile?.role !== 'admin') {
    return null;
  }

  return (
    <PortalShell>
      <div className="container-shell py-8">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-blue-600 hover:underline">
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <h1 className="mt-8 text-3xl font-extrabold text-slate-900">Analytics Dashboard</h1>
        <p className="mt-2 text-slate-600">View detailed analytics and reports</p>

        <div className="mt-8 rounded-xl border bg-white p-8 text-center">
          <p className="text-slate-600">Advanced analytics and reporting coming soon...</p>
        </div>
      </div>
    </PortalShell>
  );
}
