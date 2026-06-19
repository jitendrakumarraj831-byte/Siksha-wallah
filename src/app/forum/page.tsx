'use client';

import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { AuthContext } from '@/components/auth-provider';
import { forumService, ForumPost } from '@/services/forum-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

const CATEGORIES = ['general', 'doubts', 'course', 'admission', 'payment'] as const;

export default function ForumPage() {
  const { user, loading: authLoading } = useContext(AuthContext);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Community Forum</h1>
          <p className="text-gray-600">Ask questions, share knowledge, and help fellow students</p>
        </div>

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
                <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        By {post.authorName} in {post.category}
                      </p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
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
              <p className="text-gray-600">No posts found. Be the first to create one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
