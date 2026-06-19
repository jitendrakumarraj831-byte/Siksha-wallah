import { db } from '@/lib/firebase';
import {
  doc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  addDoc,
  getDoc,
  deleteDoc,
} from 'firebase/firestore';

export interface StudentProfile {
  uid: string;
  email: string;
  name: string;
  phone: string;
  fatherName?: string;
  motherName?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  qualifications?: string[];
  profileComplete: boolean;
  updatedAt: number;
}

export interface Enrollment {
  id?: string;
  uid: string;
  courseId: string;
  courseName: string;
  enrollmentDate: number;
  status: 'active' | 'completed' | 'dropped';
  progressPercentage: number;
}

export interface Document {
  id?: string;
  uid: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: number;
}

export interface Notification {
  id?: string;
  uid: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: number;
}

export const studentService = {
  // Get student profile
  async getProfile(uid: string): Promise<StudentProfile | null> {
    try {
      const docSnap = await getDoc(doc(db, 'students', uid));
      if (docSnap.exists()) {
        return docSnap.data() as StudentProfile;
      }
      return null;
    } catch (error: any) {
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }
  },

  // Update student profile
  async updateProfile(uid: string, updates: Partial<StudentProfile>): Promise<void> {
    try {
      await updateDoc(doc(db, 'students', uid), {
        ...updates,
        updatedAt: Date.now(),
      });
    } catch (error: any) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  },

  // Get student enrollments
  async getEnrollments(uid: string): Promise<Enrollment[]> {
    try {
      const q = query(collection(db, 'enrollments'), where('uid', '==', uid));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Enrollment));
    } catch (error: any) {
      throw new Error(`Failed to fetch enrollments: ${error.message}`);
    }
  },

  // Get single enrollment
  async getEnrollment(enrollmentId: string): Promise<Enrollment | null> {
    try {
      const docSnap = await getDoc(doc(db, 'enrollments', enrollmentId));
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as Enrollment;
      }
      return null;
    } catch (error: any) {
      throw new Error(`Failed to fetch enrollment: ${error.message}`);
    }
  },

  // Upload document
  async uploadDocument(uid: string, document: Omit<Document, 'id' | 'uploadedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'documents'), {
        ...document,
        uid,
        uploadedAt: Date.now(),
      });
      return docRef.id;
    } catch (error: any) {
      throw new Error(`Failed to upload document: ${error.message}`);
    }
  },

  // Get student documents
  async getDocuments(uid: string): Promise<Document[]> {
    try {
      const q = query(collection(db, 'documents'), where('uid', '==', uid));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Document));
    } catch (error: any) {
      throw new Error(`Failed to fetch documents: ${error.message}`);
    }
  },

  // Delete document
  async deleteDocument(docId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'documents', docId));
    } catch (error: any) {
      throw new Error(`Failed to delete document: ${error.message}`);
    }
  },

  // Get notifications
  async getNotifications(uid: string): Promise<Notification[]> {
    try {
      const q = query(collection(db, 'notifications'), where('uid', '==', uid));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Notification));
    } catch (error: any) {
      throw new Error(`Failed to fetch notifications: ${error.message}`);
    }
  },

  // Mark notification as read
  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true,
      });
    } catch (error: any) {
      throw new Error(`Failed to update notification: ${error.message}`);
    }
  },
};
