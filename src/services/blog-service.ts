import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
  orderBy,
  limit,
} from 'firebase/firestore';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: 'admissions' | 'courses' | 'success-stories' | 'news' | 'tips';
  tags: string[];
  coverImage?: string;
  views: number;
  published: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Testimonial {
  id: string;
  studentName: string;
  course: string;
  university?: string;
  rating: number;
  message: string;
  image?: string;
  verified: boolean;
  createdAt: Timestamp;
}

export const blogService = {
  async createPost(post: Omit<BlogPost, 'id' | 'views' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'blog_posts'), {
        ...post,
        views: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  },

  async getPublishedPosts(category?: string, limit_count = 10): Promise<BlogPost[]> {
    try {
      let q = query(
        collection(db, 'blog_posts'),
        where('published', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limit_count)
      );

      if (category) {
        q = query(
          collection(db, 'blog_posts'),
          where('published', '==', true),
          where('category', '==', category),
          orderBy('createdAt', 'desc'),
          limit(limit_count)
        );
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as BlogPost)
      );
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  },

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const q = query(collection(db, 'blog_posts'), where('slug', '==', slug));
      const snapshot = await getDocs(q);

      if (snapshot.docs.length > 0) {
        const post = snapshot.docs[0];
        await updateDoc(post.ref, {
          views: post.data().views + 1,
        });
        return { id: post.id, ...post.data() } as BlogPost;
      }
      return null;
    } catch (error) {
      console.error('Error fetching blog post by slug:', error);
      throw error;
    }
  },

  async getTestimonials(limit_count = 6): Promise<Testimonial[]> {
    try {
      const q = query(
        collection(db, 'testimonials'),
        where('verified', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limit_count)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Testimonial)
      );
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      throw error;
    }
  },

  async createTestimonial(
    testimonial: Omit<Testimonial, 'id' | 'verified' | 'createdAt'>
  ): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'testimonials'), {
        ...testimonial,
        verified: false,
        createdAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating testimonial:', error);
      throw error;
    }
  },

  async verifyTestimonial(testimonialId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'testimonials', testimonialId), {
        verified: true,
      });
    } catch (error) {
      console.error('Error verifying testimonial:', error);
      throw error;
    }
  },
};
