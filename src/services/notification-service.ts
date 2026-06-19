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

export interface Notification {
  id: string;
  uid: string;
  type: 'enrollment' | 'payment' | 'application' | 'message' | 'announcement';
  title: string;
  message: string;
  read: boolean;
  createdAt: Timestamp;
  link?: string;
  metadata?: Record<string, any>;
}

export const notificationService = {
  async createNotification(
    uid: string,
    notification: Omit<Notification, 'id' | 'createdAt'>
  ): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'notifications'), {
        ...notification,
        createdAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  async getNotifications(uid: string, unreadOnly = false): Promise<Notification[]> {
    try {
      let q = query(
        collection(db, 'notifications'),
        where('uid', '==', uid),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      if (unreadOnly) {
        q = query(
          collection(db, 'notifications'),
          where('uid', '==', uid),
          where('read', '==', false),
          orderBy('createdAt', 'desc')
        );
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Notification)
      );
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  async markAsRead(notificationId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true,
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  async markAllAsRead(uid: string): Promise<void> {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('uid', '==', uid),
        where('read', '==', false)
      );
      const snapshot = await getDocs(q);

      const updates = snapshot.docs.map((doc) =>
        updateDoc(doc.ref, { read: true })
      );
      await Promise.all(updates);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  async sendBulkNotification(
    uids: string[],
    notification: Omit<Notification, 'id' | 'uid' | 'createdAt'>
  ): Promise<void> {
    try {
      const promises = uids.map((uid) =>
        this.createNotification(uid, {
          ...notification,
          uid,
        })
      );
      await Promise.all(promises);
    } catch (error) {
      console.error('Error sending bulk notifications:', error);
      throw error;
    }
  },
};
