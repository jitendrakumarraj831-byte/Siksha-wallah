'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { forumService, ForumPost } from '@/services/forum-service';
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
    <div className="min-h-screen bg-orange-50">
      {/* Hero header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#7c2d12] via-[#c2410c] to-[#ea580c] text-white py-14">
        {/* Decorative glow blobs */}
        <div className="pointer-events-none absolute -top-16 right-0 h-64 w-64 rounded-full bg-orange-300 opacity-20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -left-16 h-48 w-48 rounded-full bg-yellow-400 opacity-15 blur-3xl" />
        {/* Large speech bubble decoration */}
        <div className="pointer-events-none absolute right-8 top-6 text-[5rem] leading-none select-none opacity-10">💬</div>
        <div className="container mx-auto px-4 relative">
          <h1 className="text-4xl font-bold text-white mb-2">Community Forum</h1>
          <p className="text-orange-200">सवाल पूछें, जानकारी साझा करें, और साथी छात्रों की मदद करें</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            {user && (
              <Link href="/forum/new">
                <Button>+ Create Post</Button>
              </Link>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={selectedCategory === '' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('')}
            >
              All
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
                <div className="bg-orange-50 border border-orange-100 hover:border-orange-300 rounded-lg shadow hover:shadow-lg transition-all p-6 cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 hover:text-orange-600">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        By {post.authorName} in {post.category}
                      </p>
                    </div>
                    <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
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
              <p className="text-gray-600">कोई पोस्ट नहीं मिली। पहला पोस्ट आप बनाएं!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
