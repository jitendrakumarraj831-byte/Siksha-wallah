'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const session = localStorage.getItem("sw_admin_session");
    if (!session) { router.replace("/admin/login"); return; }
    setAuthorized(true);
  }, [router]);

  if (authorized === null) return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader className="animate-spin text-[#003f9f]" size={36} />
    </div>
  );

  return (
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
  );
}
