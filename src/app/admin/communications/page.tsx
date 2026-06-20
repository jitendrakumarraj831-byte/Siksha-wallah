'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { PortalShell } from '@/components/portal-shell';
import { ArrowLeft, CheckCircle2, Mail, MessageSquare, Send, Users } from 'lucide-react';
import Link from 'next/link';

const templates = [
  { id: 1, label: 'Admission Reminder', subject: 'Last Chance – Submit Your Application', body: 'Dear Student,\n\nThis is a reminder that admission for 2026 session is closing soon. Please submit your application at the earliest to secure your seat.\n\nFor any queries, call us at +91 62031 38576.\n\nRegards,\nSiksha Wallah Team' },
  { id: 2, label: 'Payment Confirmation', subject: 'Payment Received – Thank You', body: 'Dear Student,\n\nWe have received your payment successfully. Your admission process is now moving forward. Our counsellor will contact you within 24 hours.\n\nRegards,\nSiksha Wallah Team' },
  { id: 3, label: 'Document Checklist', subject: 'Documents Required for Admission', body: 'Dear Student,\n\nKindly arrange the following documents for your admission:\n1. 10th / 12th Marksheet (original + photocopy)\n2. Graduation Certificate (if applicable)\n3. Aadhaar Card\n4. Recent Passport Size Photographs (4 nos.)\n5. Caste Certificate (if applicable)\n\nRegards,\nSiksha Wallah Team' },
  { id: 4, label: 'Counselling Invite', subject: 'Free Counselling Session – Book Your Slot', body: 'Dear Student,\n\nWe are pleased to offer you a FREE career counselling session. Our expert will guide you through course selection, college options, eligibility, fees, and scholarships.\n\nCall +91 62031 38576 to book your slot today.\n\nRegards,\nSiksha Wallah Team' },
];

const sentHistory = [
  { id: 1, subject: 'Admission Open 2026', audience: 'All Students', sent: 312, date: '2026-06-15', channel: 'Email' },
  { id: 2, subject: 'Document Reminder', audience: 'Pending Applications', sent: 87, date: '2026-06-12', channel: 'SMS' },
  { id: 3, subject: 'Scholarship Alert', audience: 'New Enquiries', sent: 145, date: '2026-06-10', channel: 'Email' },
  { id: 4, subject: 'Fee Due Reminder', audience: 'Enrolled Students', sent: 58, date: '2026-06-08', channel: 'SMS' },
];

export default function AdminCommunicationsPage() {
  const { userProfile, isAuthenticated } = useAuth();
  const [channel, setChannel] = useState<'Email' | 'SMS'>('Email');
  const [audience, setAudience] = useState('All Students');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sent, setSent] = useState(false);

  if (!isAuthenticated || userProfile?.role !== 'admin') return null;

  const loadTemplate = (id: number) => {
    const t = templates.find(t => t.id === id);
    if (t) { setSubject(t.subject); setBody(t.body); }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setSubject(''); setBody('');
  };

  const inputCls = 'w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500';

  return (
    <PortalShell>
      <div className="container-shell py-8">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-blue-600 hover:underline text-sm">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="mt-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Send Communications</h1>
          <p className="mt-1 text-slate-500">Send emails and SMS to students and enquiries</p>
        </div>

        {/* Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Total Messages Sent', value: '602', icon: Send, color: 'bg-blue-50 text-blue-600' },
            { label: 'Campaigns This Month', value: '4', icon: MessageSquare, color: 'bg-purple-50 text-purple-600' },
            { label: 'Students Reached', value: '312', icon: Users, color: 'bg-emerald-50 text-emerald-600' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-2xl border bg-white p-5">
              <div className={`grid h-10 w-10 place-items-center rounded-xl ${color}`}><Icon size={20} /></div>
              <p className="mt-4 text-2xl font-extrabold">{value}</p>
              <p className="text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          {/* Compose */}
          <div className="rounded-2xl border bg-white p-6">
            <h2 className="font-extrabold text-lg">Compose Message</h2>

            {sent && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
                <CheckCircle2 size={16} /> Message sent successfully!
              </div>
            )}

            <form onSubmit={handleSend} className="mt-4 space-y-4">
              {/* Channel Toggle */}
              <div className="flex gap-2">
                {(['Email', 'SMS'] as const).map(c => (
                  <button key={c} type="button" onClick={() => setChannel(c)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${channel === c ? 'bg-blue-600 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    {c === 'Email' ? <Mail size={15} /> : <MessageSquare size={15} />} {c}
                  </button>
                ))}
              </div>

              {/* Audience */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-500 uppercase tracking-wide">Audience</label>
                <select className={inputCls} value={audience} onChange={e => setAudience(e.target.value)}>
                  <option>All Students</option>
                  <option>Enrolled Students</option>
                  <option>Pending Applications</option>
                  <option>New Enquiries</option>
                  <option>Payment Due</option>
                </select>
              </div>

              {/* Templates */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-500 uppercase tracking-wide">Use Template</label>
                <div className="grid grid-cols-2 gap-2">
                  {templates.map(t => (
                    <button key={t.id} type="button" onClick={() => loadTemplate(t.id)}
                      className="rounded-xl border border-dashed border-slate-300 px-3 py-2 text-left text-xs font-bold text-slate-600 hover:border-blue-400 hover:bg-blue-50">
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject (Email only) */}
              {channel === 'Email' && (
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-500 uppercase tracking-wide">Subject</label>
                  <input required className={inputCls} placeholder="Email subject…" value={subject} onChange={e => setSubject(e.target.value)} />
                </div>
              )}

              {/* Message Body */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-500 uppercase tracking-wide">Message</label>
                <textarea required className={inputCls} rows={7} placeholder="Write your message…" value={body} onChange={e => setBody(e.target.value)} />
              </div>

              <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-bold text-white hover:bg-blue-700">
                <Send size={16} /> Send {channel}
              </button>
            </form>
          </div>

          {/* Sent History */}
          <div className="rounded-2xl border bg-white p-6">
            <h2 className="font-extrabold text-lg">Recent Campaigns</h2>
            <div className="mt-5 divide-y">
              {sentHistory.map(h => (
                <div key={h.id} className="flex items-center justify-between gap-4 py-4">
                  <div className="flex gap-3">
                    <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${h.channel === 'Email' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                      {h.channel === 'Email' ? <Mail size={17} /> : <MessageSquare size={17} />}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{h.subject}</p>
                      <p className="text-xs text-slate-500">{h.audience} · {h.sent} recipients</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-slate-500">{new Date(h.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                    <span className="text-[10px] font-bold uppercase text-emerald-600">Sent</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
