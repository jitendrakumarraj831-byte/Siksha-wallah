'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { forumService, ForumPost } from '@/services/forum-service';
import { SiteNavbar } from '@/components/site-navbar';
import { SiteFooter } from '@/components/site-footer';
import { Loader2, ArrowLeft, AlertCircle, LogIn } from 'lucide-react';

const CATEGORIES: ForumPost['category'][] = ['general', 'doubts', 'course', 'admission', 'payment'];

export default function NewForumPostPage() {
  const router = useRouter();
  const { user, userProfile, loading: authLoading } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<ForumPost['category']>('general');
  const [tags, setTags] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      router.push('/auth/login');
      return;
    }
    if (title.trim().length < 5) {
      setError('Please give your question a clear title — at least 5 characters long.');
      return;
    }
    if (content.trim().length < 10) {
      setError('Please describe your question in a little more detail (at least 10 characters) so others can help you better.');
      return;
    }

    setSubmitting(true);
    try {
      const authorName = userProfile?.name || user.displayName || 'Student';
      const tagList = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const postId = await forumService.createPost(user.uid, authorName, {
        title: title.trim(),
        content: content.trim(),
        category,
        tags: tagList,
      });
      router.push(`/forum/${postId}`);
    } catch {
      setError('We could not post your question right now. Please try again, or message us on WhatsApp for help.');
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#003f9f]" />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <SiteNavbar />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
              <LogIn size={26} className="text-blue-600" />
            </div>
            <h1 className="font-headline text-xl font-extrabold text-gray-900">Please sign in to ask a question</h1>
            <p className="mt-2 text-sm text-gray-600">
              Posting questions is completely free. Signing in helps us respond to you faster and keep your conversations private.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/auth/login"
                className="rounded-xl bg-[#003f9f] px-6 py-3 font-bold text-white transition hover:bg-blue-700"
              >
                Sign in to Continue →
              </Link>
              <Link href="/forum" className="text-sm font-semibold text-gray-500 hover:text-gray-800">
                ← Back to Community
              </Link>
            </div>
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
        <div className="container mx-auto max-w-2xl px-4">
          <Link
            href="/forum"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#003f9f]"
          >
            <ArrowLeft size={16} /> Back to Community
          </Link>

          <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <h1 className="font-headline text-2xl font-extrabold text-gray-900">Ask Your Question</h1>
            <p className="mt-1 text-sm text-gray-500">
              The clearer your question, the faster our counsellors and fellow students can help you with the right answer.
            </p>

            {error && (
              <div className="mt-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="post-title" className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Question Title *
                </label>
                <input
                  id="post-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Which documents do I need for B.Ed admission?"
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#003f9f]"
                />
              </div>

              <div>
                <label htmlFor="post-category" className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Topic
                </label>
                <select
                  id="post-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ForumPost['category'])}
                  className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#003f9f]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="post-content" className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Describe Your Question *
                </label>
                <textarea
                  id="post-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  placeholder="Share as much detail as you can — your marks, course you're considering, what you've already tried…"
                  className="w-full resize-none rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#003f9f]"
                />
              </div>

              <div>
                <label htmlFor="post-tags" className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Tags (optional)
                </label>
                <input
                  id="post-tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Separate with commas — e.g. bed, bscc, documents"
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#003f9f]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#003f9f] py-3.5 font-extrabold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Post My Question'}
              </button>
            </form>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
