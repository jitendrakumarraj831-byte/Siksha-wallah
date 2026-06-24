import { db } from '@/lib/firebase';
import {
  collection,
  query,
  getDocs,
  getDoc,
  doc,
  where,
} from 'firebase/firestore';

export interface Course {
  id?: string;
  name: string;
  code: string;
  category: 'bed' | 'deled' | 'nursing' | 'pharmacy' | 'management';
  duration: string;
  fees: number;
  eligibility: string;
  description: string;
  features: string[];
  createdAt: number;
}

export const courseService = {
  async getAllCourses(): Promise<Course[]> {
    try {
      const snapshot = await getDocs(collection(db, 'courses'));
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Course));
    } catch (error: any) {
      throw new Error(`Failed to fetch courses: ${error.message}`);
    }
  },

  async getCoursesByCategory(category: string): Promise<Course[]> {
    try {
      const q = query(collection(db, 'courses'), where('category', '==', category));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Course));
    } catch (error: any) {
      throw new Error(`Failed to fetch courses: ${error.message}`);
    }
  },

  async getCourse(courseId: string): Promise<Course | null> {
    try {
      const docSnap = await getDoc(doc(db, 'courses', courseId));
      if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() } as Course;
      return null;
    } catch (error: any) {
      throw new Error(`Failed to fetch course: ${error.message}`);
    }
  },
};
