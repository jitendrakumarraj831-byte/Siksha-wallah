import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  Timestamp,
  orderBy,
  limit,
  increment,
} from 'firebase/firestore';

export interface ForumPost {
  id: string;
  uid: string;
  authorName: string;
  authorAvatar?: string;
  title: string;
  content: string;
  category: 'general' | 'doubts' | 'course' | 'admission' | 'payment';
  tags: string[];
  views: number;
  replies: number;
  upvotes: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ForumReply {
  id: string;
  postId: string;
  uid: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  upvotes: number;
  isAccepted: boolean;
  createdAt: Timestamp;
}

export const forumService = {
  async createPost(
    uid: string,
    authorName: string,
    post: Omit<ForumPost, 'id' | 'uid' | 'authorName' | 'views' | 'replies' | 'upvotes' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'forum_posts'), {
        ...post,
        uid,
        authorName,
        views: 0,
        replies: 0,
        upvotes: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating forum post:', error);
      throw error;
    }
  },

  async getPosts(category?: string, limit_count = 20): Promise<ForumPost[]> {
    try {
      let q = query(
        collection(db, 'forum_posts'),
        orderBy('createdAt', 'desc'),
        limit(limit_count)
      );

      if (category) {
        q = query(
          collection(db, 'forum_posts'),
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
          } as ForumPost)
      );
    } catch (error) {
      console.error('Error fetching forum posts:', error);
      throw error;
    }
  },

  async getPost(postId: string): Promise<ForumPost | null> {
    try {
      const docRef = doc(db, 'forum_posts', postId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        updateDoc(docRef, { views: increment(1) }).catch(() => {});
        return { id: docSnap.id, ...docSnap.data() } as ForumPost;
      }
      return null;
    } catch (error) {
      console.error('Error fetching forum post:', error);
      throw error;
    }
  },

  async createReply(
    postId: string,
    uid: string,
    authorName: string,
    content: string
  ): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'forum_replies'), {
        postId,
        uid,
        authorName,
        content,
        upvotes: 0,
        isAccepted: false,
        createdAt: Timestamp.now(),
      });

      await updateDoc(doc(db, 'forum_posts', postId), {
        replies: increment(1),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating forum reply:', error);
      throw error;
    }
  },

  async getReplies(postId: string): Promise<ForumReply[]> {
    try {
      const q = query(
        collection(db, 'forum_replies'),
        where('postId', '==', postId),
        orderBy('createdAt', 'asc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as ForumReply)
      );
    } catch (error) {
      console.error('Error fetching forum replies:', error);
      throw error;
    }
  },

  async upvoteReply(replyId: string, uid: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'forum_replies', replyId), {
        upvotes: increment(1),
      });
    } catch (error) {
      console.error('Error upvoting reply:', error);
      throw error;
    }
  },

  async markReplyAsAccepted(replyId: string, postId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'forum_replies', replyId), {
        isAccepted: true,
      });
    } catch (error) {
      console.error('Error marking reply as accepted:', error);
      throw error;
    }
  },
};
