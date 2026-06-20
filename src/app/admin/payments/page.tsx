'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { PortalShell } from '@/components/portal-shell';
import { ArrowLeft, CheckCircle2, Clock, Download, IndianRupee, Search, XCircle } from 'lucide-react';
import Link from 'next/link';

const payments = [
  { id: 'PAY001', student: 'Rahul Kumar', course: 'B.Ed', amount: 50000, date: '2026-06-18', method: 'Razorpay', status: 'Success' },
  { id: 'PAY002', student: 'Priya Singh', course: 'B.Sc Nursing', amount: 75000, date: '2026-06-17', method: 'Razorpay', status: 'Success' },
  { id: 'PAY003', student: 'Amit Sharma', course: 'D.Pharm', amount: 35000, date: '2026-06-17', method: 'Razorpay', status: 'Pending' },
  { id: 'PAY004', student: 'Sunita Devi', course: 'D.El.Ed', amount: 25000, date: '2026-06-16', method: 'Razorpay', status: 'Success' },
  { id: 'PAY005', student: 'Vikash Yadav', course: 'BCA', amount: 40000, date: '2026-06-15', method: 'Razorpay', status: 'Success' },
  { id: 'PAY006', student: 'Anita Kumari', course: 'GNM', amount: 45000, date: '2026-06-14', method: 'Razorpay', status: 'Failed' },
  { id: 'PAY007', student: 'Sanjay Prasad', course: 'MBA', amount: 90000, date: '2026-06-13', method: 'Razorpay', status: 'Success' },
  { id: 'PAY008', student: 'Kavita Rai', course: 'B.Pharm', amount: 80000, date: '2026-06-12', method: 'Razorpay', status: 'Success' },
  { id: 'PAY009', student: 'Deepak Mishra', course: 'Polytechnic', amount: 30000, date: '2026-06-11', method: 'Razorpay', status: 'Pending' },
  { id: 'PAY010', student: 'Ritu Singh', course: 'B.Ed', amount: 50000, date: '2026-06-10', method: 'Razorpay', status: 'Success' },
];

const statusStyle: Record<string, string> = {
  Success: 'bg-emerald-50 text-emerald-700',
  Pending: 'bg-amber-50 text-amber-700',
  Failed: 'bg-red-50 text-red-700',
};

const statusIcon: Record<string, React.ReactNode> = {
  Success: <CheckCircle2 size={13} />,
  Pending: <Clock size={13} />,
  Failed: <XCircle size={13} />,
};

export default function AdminPaymentsPage() {
  const { userProfile, isAuthenticated } = useAuth();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  if (!isAuthenticated || userProfile?.role !== 'admin') return null;

  const filtered = payments.filter(p => {
    const matchSearch = [p.student, p.course, p.id].join(' ').toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalRevenue = payments.filter(p => p.status === 'Success').reduce((a, p) => a + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'Pending').reduce((a, p) => a + p.amount, 0);
  const successCount = payments.filter(p => p.status === 'Success').length;
  const failedCount = payments.filter(p => p.status === 'Failed').length;

  return (
    <PortalShell>
      <div className="container-shell py-8">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-blue-600 hover:underline text-sm">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Payment Reports</h1>
            <p className="mt-1 text-slate-500">Track and manage all payment transactions</p>
          </div>
          <button className="flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
            <Download size={16} /> Export CSV
          </button>
        </div>

        {/* Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          {[
            { label: 'Total Revenue', value: `₹${(totalRevenue / 100000).toFixed(1)}L`, sub: `${successCount} successful`, color: 'bg-emerald-50 text-emerald-600' },
            { label: 'Pending Amount', value: `₹${(totalPending / 1000).toFixed(0)}K`, sub: `${payments.filter(p => p.status === 'Pending').length} transactions`, color: 'bg-amber-50 text-amber-600' },
            { label: 'Success Rate', value: `${Math.round((successCount / payments.length) * 100)}%`, sub: `${successCount} of ${payments.length}`, color: 'bg-blue-50 text-blue-600' },
            { label: 'Failed Payments', value: failedCount, sub: 'Requires attention', color: 'bg-red-50 text-red-600' },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className="rounded-2xl border bg-white p-5">
              <div className={`grid h-10 w-10 place-items-center rounded-xl ${color}`}>
                <IndianRupee size={20} />
              </div>
              <p className="mt-4 text-2xl font-extrabold">{value}</p>
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-1 text-xs text-slate-400">{sub}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={15} />
            <input className="w-64 rounded-xl border border-slate-200 pl-9 pr-4 py-2.5 text-sm outline-none focus:border-blue-500" placeholder="Search student or ID…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {['All', 'Success', 'Pending', 'Failed'].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${filterStatus === s ? 'bg-blue-600 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{s}</button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="mt-5 overflow-hidden rounded-2xl border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                {['Transaction ID', 'Student', 'Course', 'Amount', 'Date', 'Method', 'Status'].map(h => (
                  <th key={h} className="px-5 py-4 text-left text-xs font-extrabold uppercase text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-mono text-xs text-slate-500">{p.id}</td>
                  <td className="px-5 py-4 font-bold">{p.student}</td>
                  <td className="px-5 py-4 text-slate-600">{p.course}</td>
                  <td className="px-5 py-4 font-semibold">₹{p.amount.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4 text-slate-500">{new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="px-5 py-4 text-slate-500">{p.method}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${statusStyle[p.status]}`}>
                      {statusIcon[p.status]} {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="py-12 text-center text-slate-400">No transactions found.</p>
          )}
        </div>
        <p className="mt-3 text-xs text-slate-400">Showing {filtered.length} of {payments.length} transactions</p>
      </div>
    </PortalShell>
  );
}
