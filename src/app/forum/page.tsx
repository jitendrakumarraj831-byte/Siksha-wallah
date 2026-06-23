'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { forumService, ForumPost } from '@/services/forum-service';
import { saveActivity } from '@/services/activity-service';
import { SiteNavbar } from '@/components/site-navbar';
import { SiteFooter } from '@/components/site-footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

const CATEGORIES = ['general', 'doubts', 'course', 'admission', 'payment'] as const;

export default function ForumPage() {
  const { user, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!authLoading) {
      loadPosts();
    }
  }, [authLoading, selectedCategory]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const forumPosts = await forumService.getPosts(selectedCategory || undefined, 50);
      setPosts(forumPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
    <SiteNavbar />
    <div className="min-h-screen bg-gray-50">
      {/* Hero header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#00102e] via-[#001850] to-[#003590] text-white py-16">
        {/* Dot-grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        {/* Glow orbs */}
        <div className="pointer-events-none absolute -top-40 -right-32 h-[480px] w-[480px] rounded-full bg-amber-400 opacity-[0.10] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-500 opacity-[0.13] blur-3xl" />
        <div className="container mx-auto px-4 relative text-center">
          {/* Label pill */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/[0.1] px-4 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
            <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber-300">Student Community</span>
          </div>
          {/* H1 */}
          <h1 className="font-headline text-[2.5rem] font-black leading-[1.08] tracking-tight md:text-6xl lg:text-[4rem]">
            <span className="block text-white [text-shadow:0_2px_20px_rgba(255,255,255,0.15)]">Ask Questions.</span>
            <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">Get Real Answers.</span>
          </h1>
          <div className="mx-auto mt-3 h-[3px] w-28 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-transparent md:w-40" />
          <p className="mt-6 max-w-2xl mx-auto text-blue-100 leading-relaxed">
            Admission, course selection, BSCC loan या career — कोई भी सवाल यहाँ बेझिझक पूछें। हमारी counselling team और साथी students आपका मार्गदर्शन करेंगे।
          </p>
          {/* CTAs */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/forum/new"
              className="group relative flex items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 px-8 py-4 font-extrabold text-gray-900 shadow-xl shadow-amber-500/30 transition-all hover:-translate-y-1 hover:shadow-2xl active:scale-[0.97]"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              Ask Your Question
            </Link>
            <a
              href="https://wa.me/916203138576?text=नमस्ते! मुझे Admission के बारे में सवाल पूछना है।"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => saveActivity({ type: 'whatsapp', title: '💬 WhatsApp Click — Forum', description: 'Speak to Counsellor button on Forum page', page: '/forum' })}
              className="flex items-center justify-center gap-2.5 rounded-2xl border-2 border-white/25 bg-white/[0.08] px-8 py-4 font-bold text-white backdrop-blur transition-all hover:bg-white/[0.15] hover:-translate-y-1 active:scale-[0.97]"
            >
              Speak to a Counsellor
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              placeholder="Search questions and discussions…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            {user && (
              <Link href="/forum/new">
                <Button>+ Ask a Question</Button>
              </Link>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={selectedCategory === '' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('')}
            >
              All Topics
            </Button>
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Link key={post.id} href={`/forum/${post.id}`}>
                <div className="bg-white border border-gray-100 hover:border-blue-300 rounded-lg shadow hover:shadow-lg transition-all p-6 cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 hover:text-primary-blue">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        By {post.authorName} in {post.category}
                      </p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{post.content.substring(0, 150)}...</p>
                  <div className="flex gap-6 text-sm text-gray-500">
                    <span>{post.views} views</span>
                    <span>{post.replies} replies</span>
                    <span>{post.upvotes} upvotes</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-600">No questions in this category yet. Be the first to ask — your question may help many other students.</p>
            </div>
          )}
        </div>
      </div>
    </div>
    <SiteFooter />
    </>
  );
}
