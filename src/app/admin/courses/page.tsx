'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { PortalShell } from '@/components/portal-shell';
import { ArrowLeft, BookOpen, Clock, GraduationCap, IndianRupee, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import Link from 'next/link';

const initialCourses = [
  { id: 1, name: 'B.Ed', full: 'Bachelor of Education', duration: '2 Years', eligibility: 'Graduation 50%', fee: '₹50,000/yr', stream: 'Teaching', seats: 60, enrolled: 48, status: 'Active' },
  { id: 2, name: 'D.El.Ed', full: 'Diploma in Elementary Education', duration: '2 Years', eligibility: '12th Pass 50%', fee: '₹25,000/yr', stream: 'Teaching', seats: 50, enrolled: 43, status: 'Active' },
  { id: 3, name: 'B.Sc Nursing', full: 'Bachelor of Science in Nursing', duration: '4 Years', eligibility: '12th Science 50%', fee: '₹75,000/yr', stream: 'Medical', seats: 40, enrolled: 38, status: 'Active' },
  { id: 4, name: 'GNM', full: 'General Nursing & Midwifery', duration: '3 Years', eligibility: '12th Pass', fee: '₹45,000/yr', stream: 'Medical', seats: 40, enrolled: 35, status: 'Active' },
  { id: 5, name: 'B.Pharm', full: 'Bachelor of Pharmacy', duration: '4 Years', eligibility: '12th Science 50%', fee: '₹80,000/yr', stream: 'Pharmacy', seats: 60, enrolled: 52, status: 'Active' },
  { id: 6, name: 'D.Pharm', full: 'Diploma in Pharmacy', duration: '2 Years', eligibility: '12th Science', fee: '₹35,000/yr', stream: 'Pharmacy', seats: 60, enrolled: 49, status: 'Active' },
  { id: 7, name: 'BCA', full: 'Bachelor of Computer Applications', duration: '3 Years', eligibility: '12th Pass', fee: '₹40,000/yr', stream: 'IT', seats: 60, enrolled: 41, status: 'Active' },
  { id: 8, name: 'MBA', full: 'Master of Business Administration', duration: '2 Years', eligibility: 'Graduation', fee: '₹90,000/yr', stream: 'Management', seats: 60, enrolled: 29, status: 'Active' },
  { id: 9, name: 'Polytechnic', full: 'Diploma in Engineering', duration: '3 Years', eligibility: '10th Pass', fee: '₹30,000/yr', stream: 'Engineering', seats: 120, enrolled: 98, status: 'Active' },
];

const streamColors: Record<string, string> = {
  Teaching: 'bg-blue-50 text-blue-700',
  Medical: 'bg-rose-50 text-rose-700',
  Pharmacy: 'bg-purple-50 text-purple-700',
  IT: 'bg-cyan-50 text-cyan-700',
  Management: 'bg-amber-50 text-amber-700',
  Engineering: 'bg-orange-50 text-orange-700',
};

export default function AdminCoursesPage() {
  const { userProfile, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState(initialCourses);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', full: '', duration: '', eligibility: '', fee: '', stream: 'Teaching', seats: '' });

  if (!isAuthenticated || userProfile?.role !== 'admin') return null;

  const filtered = courses.filter(c =>
    [c.name, c.full, c.stream].join(' ').toLowerCase().includes(search.toLowerCase())
  );

  const totalSeats = courses.reduce((a, c) => a + c.seats, 0);
  const totalEnrolled = courses.reduce((a, c) => a + c.enrolled, 0);

  const handleDelete = (id: number) => setCourses(prev => prev.filter(c => c.id !== id));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setCourses(prev => [...prev, { ...form, id: Date.now(), seats: Number(form.seats), enrolled: 0, status: 'Active' }]);
    setForm({ name: '', full: '', duration: '', eligibility: '', fee: '', stream: 'Teaching', seats: '' });
    setShowForm(false);
  };

  const inputCls = 'w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500';

  return (
    <PortalShell>
      <div className="container-shell py-8">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-blue-600 hover:underline text-sm">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Manage Courses</h1>
            <p className="mt-1 text-slate-500">Add, edit, and manage course offerings</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700">
            <Plus size={16} /> Add Course
          </button>
        </div>

        {/* Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          {[
            { label: 'Total Courses', value: courses.length, icon: BookOpen, color: 'text-blue-600 bg-blue-50' },
            { label: 'Total Seats', value: totalSeats, icon: GraduationCap, color: 'text-purple-600 bg-purple-50' },
            { label: 'Total Enrolled', value: totalEnrolled, icon: Clock, color: 'text-emerald-600 bg-emerald-50' },
            { label: 'Occupancy Rate', value: `${Math.round((totalEnrolled / totalSeats) * 100)}%`, icon: IndianRupee, color: 'text-amber-600 bg-amber-50' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-2xl border bg-white p-5">
              <div className={`grid h-10 w-10 place-items-center rounded-xl ${color}`}>
                <Icon size={20} />
              </div>
              <p className="mt-4 text-2xl font-extrabold">{value}</p>
              <p className="text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Add Course Form */}
        {showForm && (
          <form onSubmit={handleAdd} className="mt-6 rounded-2xl border bg-white p-6">
            <h2 className="font-bold text-lg mb-4">New Course</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <input required className={inputCls} placeholder="Short Name (e.g. B.Ed)" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input required className={inputCls} placeholder="Full Name" value={form.full} onChange={e => setForm({ ...form, full: e.target.value })} />
              <input required className={inputCls} placeholder="Duration (e.g. 2 Years)" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
              <input required className={inputCls} placeholder="Eligibility" value={form.eligibility} onChange={e => setForm({ ...form, eligibility: e.target.value })} />
              <input required className={inputCls} placeholder="Fee (e.g. ₹50,000/yr)" value={form.fee} onChange={e => setForm({ ...form, fee: e.target.value })} />
              <input required type="number" className={inputCls} placeholder="Total Seats" value={form.seats} onChange={e => setForm({ ...form, seats: e.target.value })} />
              <select className={inputCls} value={form.stream} onChange={e => setForm({ ...form, stream: e.target.value })}>
                {Object.keys(streamColors).map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="mt-4 flex gap-3">
              <button type="submit" className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white">Save Course</button>
              <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border px-6 py-2.5 text-sm font-bold text-slate-600">Cancel</button>
            </div>
          </form>
        )}

        {/* Search */}
        <div className="mt-6 relative max-w-sm">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={16} />
          <input className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 text-sm outline-none focus:border-blue-500" placeholder="Search courses…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Table */}
        <div className="mt-5 overflow-hidden rounded-2xl border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                {['Course', 'Duration', 'Eligibility', 'Fee', 'Stream', 'Seats', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-4 text-left text-xs font-extrabold uppercase text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <p className="font-bold">{c.name}</p>
                    <p className="text-xs text-slate-500">{c.full}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{c.duration}</td>
                  <td className="px-5 py-4 text-slate-600">{c.eligibility}</td>
                  <td className="px-5 py-4 font-semibold">{c.fee}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${streamColors[c.stream] ?? 'bg-slate-100 text-slate-600'}`}>{c.stream}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-bold">{c.enrolled}</span>
                    <span className="text-slate-400">/{c.seats}</span>
                    <div className="mt-1 h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-blue-500" style={{ width: `${(c.enrolled / c.seats) * 100}%` }} />
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button className="grid h-8 w-8 place-items-center rounded-lg border text-slate-500 hover:bg-slate-100"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(c.id)} className="grid h-8 w-8 place-items-center rounded-lg border text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="py-12 text-center text-slate-400">No courses found.</p>
          )}
        </div>
      </div>
    </PortalShell>
  );
}
