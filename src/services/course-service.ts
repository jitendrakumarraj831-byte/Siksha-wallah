import { db } from '@/lib/firebase';
import {
  collection,
  query,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  where,
  QueryConstraint,
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
  instructors: string[];
  enrollmentLimit: number;
  enrolledStudents: number;
  image?: string;
  createdAt: number;
}

export interface EnrollmentRequest {
  id?: string;
  uid: string;
  courseId: string;
  courseName: string;
  studentName: string;
  studentEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: number;
  approvedAt?: number;
  notes?: string;
}

export const courseService = {
  // Get all courses
  async getAllCourses(): Promise<Course[]> {
    try {
      const snapshot = await getDocs(collection(db, 'courses'));
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Course));
    } catch (error: any) {
      throw new Error(`Failed to fetch courses: ${error.message}`);
    }
  },

  // Get courses by category
  async getCoursesByCategory(category: string): Promise<Course[]> {
    try {
      const q = query(collection(db, 'courses'), where('category', '==', category));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Course));
    } catch (error: any) {
      throw new Error(`Failed to fetch courses: ${error.message}`);
    }
  },

  // Get single course
  async getCourse(courseId: string): Promise<Course | null> {
    try {
      const docSnap = await getDoc(doc(db, 'courses', courseId));
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as Course;
      }
      return null;
    } catch (error: any) {
      throw new Error(`Failed to fetch course: ${error.message}`);
    }
  },

  // Submit enrollment request
  async submitEnrollmentRequest(
    uid: string,
    courseId: string,
    studentName: string,
    studentEmail: string,
    courseName: string
  ): Promise<string> {
    try {
      // Check if already enrolled
      const existingQ = query(
        collection(db, 'enrollmentRequests'),
        where('uid', '==', uid),
        where('courseId', '==', courseId),
        where('status', 'in', ['pending', 'approved'])
      );
      const existing = await getDocs(existingQ);
      if (!existing.empty) {
        throw new Error('You already have an active enrollment for this course');
      }

      const docRef = await addDoc(collection(db, 'enrollmentRequests'), {
        uid,
        courseId,
        courseName,
        studentName,
        studentEmail,
        status: 'pending',
        appliedAt: Date.now(),
      });
      return docRef.id;
    } catch (error: any) {
      throw new Error(`Failed to submit enrollment: ${error.message}`);
    }
  },

  // Get enrollment requests for user
  async getUserEnrollmentRequests(uid: string): Promise<EnrollmentRequest[]> {
    try {
      const q = query(collection(db, 'enrollmentRequests'), where('uid', '==', uid));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as EnrollmentRequest));
    } catch (error: any) {
      throw new Error(`Failed to fetch enrollment requests: ${error.message}`);
    }
  },

  // Check if user is enrolled in course
  async checkEnrollment(uid: string, courseId: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, 'enrollmentRequests'),
        where('uid', '==', uid),
        where('courseId', '==', courseId),
        where('status', '==', 'approved')
      );
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error: any) {
      throw new Error(`Failed to check enrollment: ${error.message}`);
    }
  },

  // Add demo courses (for initial setup)
  async addDemoCourses(): Promise<void> {
    try {
      const demoCourses: Omit<Course, 'id'>[] = [
        {
          name: 'Bachelor of Education (B.Ed)',
          code: 'BED001',
          category: 'bed',
          duration: '2 Years',
          fees: 150000,
          eligibility: '12th Pass + Bachelor\'s Degree',
          description:
            'Comprehensive 2-year B.Ed program preparing qualified teachers for schools and higher education institutions.',
          features: ['Expert Faculty', 'Practical Training', 'Internship Support', 'Job Placement'],
          instructors: ['Dr. Rajesh Kumar', 'Prof. Priya Singh', 'Dr. Amit Patel'],
          enrollmentLimit: 100,
          enrolledStudents: 45,
          createdAt: Date.now(),
        },
        {
          name: 'Diploma in Elementary Education (D.El.Ed)',
          code: 'DELED001',
          category: 'deled',
          duration: '2 Years',
          fees: 80000,
          eligibility: '12th Pass',
          description: 'Diploma course focusing on primary education with emphasis on modern teaching methods.',
          features: ['Affordable', 'Industry Ready', 'Flexible Schedule', 'Online Support'],
          instructors: ['Ms. Neha Sharma', 'Prof. Vikram Singh'],
          enrollmentLimit: 120,
          enrolledStudents: 60,
          createdAt: Date.now(),
        },
        {
          name: 'B.Sc Nursing',
          code: 'NUR001',
          category: 'nursing',
          duration: '4 Years',
          fees: 250000,
          eligibility: '12th Pass (Science)',
          description: 'Professional nursing degree with clinical training and hospital internships.',
          features: ['Clinical Training', 'Modern Equipment', 'International Recognition', 'Career Growth'],
          instructors: ['Dr. Sanjana Patel', 'Dr. Arun Kumar', 'Sr. Nurse Pooja Sharma'],
          enrollmentLimit: 80,
          enrolledStudents: 55,
          createdAt: Date.now(),
        },
        {
          name: 'B.Pharm - Bachelor of Pharmacy',
          code: 'PHARM001',
          category: 'pharmacy',
          duration: '4 Years',
          fees: 200000,
          eligibility: '12th Pass (Science with PCB)',
          description: 'Professional pharmacy degree covering drug formulation, analysis, and distribution.',
          features: ['Lab Facilities', 'Industry Collaboration', 'Research Opportunities', 'Internship'],
          instructors: ['Dr. Priya Gupta', 'Dr. Rohit Verma', 'Prof. Ajay Singh'],
          enrollmentLimit: 60,
          enrolledStudents: 40,
          createdAt: Date.now(),
        },
        {
          name: 'MBA - Master of Business Administration',
          code: 'MBA001',
          category: 'management',
          duration: '2 Years',
          fees: 400000,
          eligibility: 'Graduate',
          description:
            'Advanced management program covering business strategy, finance, marketing, and operations.',
          features: ['Corporate Placements', 'Industry Experts', 'Case Study Method', 'Global Network'],
          instructors: ['Prof. Vikrant Singh', 'Dr. Meera Patel', 'Mr. Sanjay Kumar'],
          enrollmentLimit: 50,
          enrolledStudents: 35,
          createdAt: Date.now(),
        },
      ];

      for (const course of demoCourses) {
        await addDoc(collection(db, 'courses'), course);
      }
    } catch (error: any) {
      throw new Error(`Failed to add demo courses: ${error.message}`);
    }
  },
};
