'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { PortalShell } from '@/components/portal-shell';
import {
  subscribeMessages, sendStudentMessage, markAdminMessagesRead,
  msgTime, type ChatMessage,
} from '@/services/chat-service';
import { ArrowLeft, Send, Loader, MessageCircle, ShieldCheck, AlertTriangle } from 'lucide-react';

function fmtTime(ts: any): string {
  const ms = msgTime(ts);
  if (!ms || ms === Number.MAX_SAFE_INTEGER) return 'अभी';
  return new Date(ms).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function StudentMessagesPage() {
  const { user, userProfile, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/auth/login');
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setLoadError(false);
    const unsub = subscribeMessages(
      user.uid,
      (msgs) => {
        setMessages(msgs);
        setLoading(false);
        setLoadError(false);
        markAdminMessagesRead(msgs).catch(() => {});
      },
      () => {
        // Listener failed (most often: the `messages` Firestore rules aren't
        // deployed → PERMISSION_DENIED). Don't hang on the spinner forever.
        setLoading(false);
        setLoadError(true);
      },
    );
    return () => unsub();
  }, [user]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const t = text.trim();
    if (!t || !user || sending) return;
    setSending(true);
    setText('');
    try {
      await sendStudentMessage({
        studentId: user.uid,
        studentName: userProfile?.name || user.displayName || 'Student',
        studentEmail: user.email || '',
        text: t,
      });
    } catch {
      setText(t); // restore on failure
    } finally {
      setSending(false);
    }
  }

  if (authLoading || (loading && isAuthenticated)) {
    return (
      <PortalShell>
        <div className="flex min-h-screen items-center justify-center">
          <Loader className="animate-spin text-[#003f9f]" size={36} />
        </div>
      </PortalShell>
    );
  }
  if (!isAuthenticated) return null;

  return (
    <PortalShell>
      <div className="min-h-screen bg-gray-50">
        <div className="container-shell max-w-2xl py-6">
          <Link href="/dashboard" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#003f9f] hover:underline">
            <ArrowLeft size={15} /> Back to Dashboard
          </Link>

          <div className="flex h-[72vh] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-gray-100 bg-gradient-to-r from-[#001f6b] to-[#003f9f] px-5 py-4 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="font-headline font-extrabold">Siksha Wallah Counsellor</p>
                <p className="text-xs text-blue-200">Aapke sawaalon ka jawab — Mon–Sat, 9 AM–7 PM</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 px-4 py-5">
              {loadError ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
                    <AlertTriangle size={28} className="text-red-500" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-700">Chat abhi load nahi ho paa raha</p>
                    <p className="mt-1 text-sm text-gray-400">
                      Thodi der baad dobara try karein. Agar problem bani rahe to WhatsApp par humse baat karein.
                    </p>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                    <MessageCircle size={28} className="text-[#003f9f]" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-700">अपने counsellor से सीधे बात करें</p>
                    <p className="mt-1 text-sm text-gray-400">
                      Course, fees, BSCC loan, documents — koi bhi sawaal niche type karke bhejein.
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((m) => {
                  const mine = m.sender === 'student';
                  return (
                    <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                        mine
                          ? 'rounded-br-sm bg-[#003f9f] text-white'
                          : 'rounded-bl-sm border border-gray-200 bg-white text-gray-800'
                      }`}>
                        {!mine && <p className="mb-0.5 text-[11px] font-bold text-[#003f9f]">Counsellor</p>}
                        <p className="whitespace-pre-wrap break-words leading-relaxed">{m.text}</p>
                        <p className={`mt-1 text-right text-[10px] ${mine ? 'text-blue-200' : 'text-gray-400'}`}>
                          {fmtTime(m.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={endRef} />
            </div>

            {/* Composer */}
            <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-gray-100 bg-white px-3 py-3">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="अपना message type करें…"
                maxLength={2000}
                className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#003f9f]"
              />
              <button
                type="submit"
                disabled={!text.trim() || sending}
                aria-label="Send message"
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#003f9f] text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {sending ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </form>
          </div>

          <p className="mt-3 text-center text-xs text-gray-400">
            🔒 Ye chat private hai — sirf aap aur Siksha Wallah counsellor dekh sakte hain.
          </p>
        </div>
      </div>
    </PortalShell>
  );
}
