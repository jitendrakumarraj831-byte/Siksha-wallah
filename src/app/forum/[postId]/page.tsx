'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { forumService, ForumPost, ForumReply } from '@/services/forum-service';
import { SiteNavbar } from '@/components/site-navbar';
import { SiteFooter } from '@/components/site-footer';
import { Loader2, ArrowLeft, ChevronUp, MessageCircle, CheckCircle2, AlertCircle } from 'lucide-react';

function timeAgo(ts: any): string {
  const d = ts?.toDate ? ts.toDate() : ts ? new Date(ts) : null;
  if (!d) return '';
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ForumPostPage() {
  const params = useParams();
  const postId = params.postId as string;
  const { user, userProfile } = useAuth();

  const [post, setPost] = useState<ForumPost | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadReplies = useCallback(async () => {
    try {
      setReplies(await forumService.getReplies(postId));
    } catch {
      /* non-fatal */
    }
  }, [postId]);

  useEffect(() => {
    if (!postId) return;
    let active = true;
    (async () => {
      try {
        const p = await forumService.getPost(postId);
        if (!active) return;
        if (!p) {
          setNotFound(true);
        } else {
          setPost(p);
          await loadReplies();
        }
      } catch {
        if (active) setNotFound(true);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [postId, loadReplies]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!user) return;
    if (replyText.trim().length < 2) {
      setError('Please share a slightly more detailed answer so others can benefit too.');
      return;
    }
    setSubmitting(true);
    try {
      const authorName = userProfile?.name || user.displayName || 'Student';
      await forumService.createReply(postId, user.uid, authorName, replyText.trim());
      setReplyText('');
      await loadReplies();
      setPost((prev) => (prev ? { ...prev, replies: prev.replies + 1 } : prev));
    } catch {
      setError('Your reply could not be posted just now. Please try again in a moment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (replyId?: string) => {
    if (!replyId || !user) return;
    // Optimistic update
    setReplies((prev) => prev.map((r) => (r.id === replyId ? { ...r, upvotes: r.upvotes + 1 } : r)));
    try {
      await forumService.upvoteReply(replyId, user.uid);
    } catch {
      setReplies((prev) => prev.map((r) => (r.id === replyId ? { ...r, upvotes: r.upvotes - 1 } : r)));
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#003f9f]" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <>
        <SiteNavbar />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
          <div className="text-center">
            <AlertCircle size={44} className="mx-auto text-red-400" />
            <p className="mt-4 font-semibold text-gray-700">We couldn&apos;t find this question. It may have been removed.</p>
            <Link
              href="/forum"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#003f9f] px-6 py-3 font-bold text-white transition hover:bg-blue-700"
            >
              <ArrowLeft size={16} /> Back to Community
            </Link>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteNavbar />
      <main className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto max-w-3xl px-4">
          <Link
            href="/forum"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#003f9f]"
          >
            <ArrowLeft size={16} /> Back to Community
          </Link>

          {/* Post */}
          <article className="mt-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                {post.category}
              </span>
              {post.tags?.map((t) => (
                <span key={t} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                  #{t}
                </span>
              ))}
            </div>
            <h1 className="font-headline text-2xl font-extrabold text-gray-900 sm:text-3xl">{post.title}</h1>
            <p className="mt-2 text-sm text-gray-500">
              By {post.authorName} · {timeAgo(post.createdAt)}
            </p>
            <p className="mt-5 whitespace-pre-wrap leading-relaxed text-gray-700">{post.content}</p>
            <div className="mt-6 flex gap-6 border-t border-gray-100 pt-4 text-sm text-gray-500">
              <span>{post.views} views</span>
              <span>{post.replies} replies</span>
              <span>{post.upvotes} upvotes</span>
            </div>
          </article>

          {/* Replies */}
          <section className="mt-8">
            <h2 className="font-headline text-lg font-extrabold text-gray-900">
              {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
            </h2>

            <div className="mt-4 space-y-3">
              {replies.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-10 text-center text-sm text-gray-500">
                  No replies yet — be the first to share your knowledge and help a fellow student.
                </div>
              ) : (
                replies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`rounded-2xl border bg-white p-5 shadow-sm ${
                      reply.isAccepted ? 'border-green-300 ring-1 ring-green-200' : 'border-gray-100'
                    }`}
                  >
                    {reply.isAccepted && (
                      <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">
                        <CheckCircle2 size={12} /> Accepted Answer
                      </div>
                    )}
                    <p className="whitespace-pre-wrap leading-relaxed text-gray-700">{reply.content}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-xs text-gray-400">
                        {reply.authorName} · {timeAgo(reply.createdAt)}
                      </p>
                      <button
                        onClick={() => handleUpvote(reply.id)}
                        disabled={!user}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-bold text-gray-600 transition hover:border-[#003f9f] hover:text-[#003f9f] disabled:opacity-50"
                        title={user ? 'Upvote this answer' : 'Sign in to upvote this answer'}
                      >
                        <ChevronUp size={14} /> {reply.upvotes}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Reply form */}
            <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              {user ? (
                <form onSubmit={handleReply}>
                  <h3 className="mb-3 flex items-center gap-2 font-bold text-gray-900">
                    <MessageCircle size={16} className="text-[#003f9f]" /> Share Your Answer
                  </h3>
                  {error && (
                    <div className="mb-3 flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                      <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                      <p>{error}</p>
                    </div>
                  )}
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    placeholder="Share your answer or experience here…"
                    className="w-full resize-none rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#003f9f]"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[#003f9f] px-6 py-3 font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
                  >
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Post My Answer'}
                  </button>
                </form>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-600">Please sign in to share an answer with the community.</p>
                  <Link
                    href="/auth/login"
                    className="mt-3 inline-block rounded-xl bg-[#003f9f] px-6 py-2.5 font-bold text-white transition hover:bg-blue-700"
                  >
                    Sign in to Reply →
                  </Link>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
