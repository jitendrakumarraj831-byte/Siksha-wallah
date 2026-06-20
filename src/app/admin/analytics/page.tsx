'use client';

import { useAuth } from '@/components/auth-provider';
import { PortalShell } from '@/components/portal-shell';
import { ArrowLeft, ArrowUpRight, BookOpen, GraduationCap, IndianRupee, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

const monthlyData = [
  { month: 'Jan', applications: 28, admissions: 18, revenue: 540000 },
  { month: 'Feb', applications: 34, admissions: 22, revenue: 720000 },
  { month: 'Mar', applications: 52, admissions: 38, revenue: 1140000 },
  { month: 'Apr', applications: 61, admissions: 45, revenue: 1350000 },
  { month: 'May', applications: 78, admissions: 58, revenue: 1740000 },
  { month: 'Jun', applications: 95, admissions: 71, revenue: 2130000 },
];

const courseWise = [
  { name: 'B.Ed', enrolled: 48, revenue: 2400000, pct: 80 },
  { name: 'B.Sc Nursing', enrolled: 38, revenue: 2850000, pct: 95 },
  { name: 'D.Pharm', enrolled: 49, revenue: 1715000, pct: 82 },
  { name: 'D.El.Ed', enrolled: 43, revenue: 1075000, pct: 86 },
  { name: 'BCA', enrolled: 41, revenue: 1640000, pct: 68 },
  { name: 'MBA', enrolled: 29, revenue: 2610000, pct: 48 },
  { name: 'Polytechnic', enrolled: 98, revenue: 2940000, pct: 82 },
];

const sources = [
  { label: 'Organic Search', pct: 42, color: 'bg-blue-500' },
  { label: 'Direct / Word of Mouth', pct: 28, color: 'bg-emerald-500' },
  { label: 'Social Media', pct: 18, color: 'bg-purple-500' },
  { label: 'Referral', pct: 12, color: 'bg-amber-500' },
];

const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

export default function AdminAnalyticsPage() {
  const { userProfile, isAuthenticated } = useAuth();

  if (!isAuthenticated || userProfile?.role !== 'admin') return null;

  const totalEnrolled = courseWise.reduce((a, c) => a + c.enrolled, 0);
  const totalRevenue = courseWise.reduce((a, c) => a + c.revenue, 0);
  const totalApplications = monthlyData.reduce((a, m) => a + m.applications, 0);

  return (
    <PortalShell>
      <div className="container-shell py-8">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-blue-600 hover:underline text-sm">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="mt-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Analytics Dashboard</h1>
          <p className="mt-1 text-slate-500">Platform overview — Jan 2026 to Jun 2026</p>
        </div>

        {/* KPI Cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Applications', value: totalApplications, change: '+22%', icon: Users, color: 'bg-blue-50 text-blue-600' },
            { label: 'Total Admissions', value: totalEnrolled, change: '+18%', icon: GraduationCap, color: 'bg-emerald-50 text-emerald-600' },
            { label: 'Total Revenue', value: `₹${(totalRevenue / 100000).toFixed(1)}L`, change: '+31%', icon: IndianRupee, color: 'bg-purple-50 text-purple-600' },
            { label: 'Active Courses', value: courseWise.length, change: '+2', icon: BookOpen, color: 'bg-amber-50 text-amber-600' },
          ].map(({ label, value, change, icon: Icon, color }) => (
            <div key={label} className="rounded-2xl border bg-white p-5">
              <div className="flex items-start justify-between">
                <div className={`grid h-10 w-10 place-items-center rounded-xl ${color}`}><Icon size={20} /></div>
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600"><ArrowUpRight size={13} />{change} vs last period</span>
              </div>
              <p className="mt-4 text-2xl font-extrabold">{value}</p>
              <p className="text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Monthly Revenue Chart */}
          <div className="rounded-2xl border bg-white p-6">
            <div className="flex items-center gap-2 font-extrabold">
              <TrendingUp size={18} className="text-blue-600" />
              Monthly Revenue (₹)
            </div>
            <div className="mt-6 flex h-48 items-end gap-3">
              {monthlyData.map(d => (
                <div key={d.month} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-slate-500">₹{(d.revenue / 100000).toFixed(1)}L</span>
                  <div className="w-full rounded-t-lg bg-blue-500" style={{ height: `${(d.revenue / maxRevenue) * 160}px` }} />
                  <span className="text-xs font-bold text-slate-500">{d.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Applications vs Admissions */}
          <div className="rounded-2xl border bg-white p-6">
            <p className="font-extrabold">Applications vs Admissions</p>
            <div className="mt-6 space-y-3">
              {monthlyData.map(d => (
                <div key={d.month}>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span className="font-bold">{d.month}</span>
                    <span>{d.admissions} / {d.applications}</span>
                  </div>
                  <div className="relative h-4 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="absolute h-full rounded-full bg-blue-200" style={{ width: `${(d.applications / 100) * 100}%` }} />
                    <div className="absolute h-full rounded-full bg-blue-600" style={{ width: `${(d.admissions / 100) * 100}%` }} />
                  </div>
                </div>
              ))}
              <div className="flex gap-4 text-xs mt-3">
                <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-600" /> Admissions</span>
                <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-200" /> Applications</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Course-wise Enrollment */}
          <div className="rounded-2xl border bg-white p-6">
            <p className="font-extrabold">Course-wise Enrollment</p>
            <div className="mt-5 space-y-4">
              {courseWise.map(c => (
                <div key={c.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-bold">{c.name}</span>
                    <span className="text-slate-500">{c.enrolled} students · {c.pct}%</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${c.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Sources */}
          <div className="rounded-2xl border bg-white p-6">
            <p className="font-extrabold">Student Acquisition Sources</p>
            <div className="mt-5 space-y-4">
              {sources.map(s => (
                <div key={s.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-bold">{s.label}</span>
                    <span className="text-slate-500">{s.pct}%</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-bold">Key Insight</p>
              <p className="mt-1 text-xs">42% of students find us via organic search. Investing in SEO and local content can increase admissions significantly.</p>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
