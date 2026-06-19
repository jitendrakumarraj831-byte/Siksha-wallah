import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  addDoc,
  QueryConstraint,
} from 'firebase/firestore';

export interface AdminStats {
  totalStudents: number;
  totalEnrollments: number;
  totalRevenue: number;
  pendingApplications: number;
}

export interface ApplicationReview {
  id?: string;
  uid: string;
  courseId: string;
  courseName: string;
  studentName: string;
  studentEmail: string;
  appliedAt: number;
  status: 'pending' | 'approved' | 'rejected';
  reviewNotes?: string;
  reviewedAt?: number;
  reviewedBy?: string;
}

export const adminService = {
  // Get admin dashboard stats
  async getDashboardStats(): Promise<AdminStats> {
    try {
      const [usersSnap, enrollmentsSnap, paymentsSnap, applicationsSnap] = await Promise.all([
        getDocs(query(collection(db, 'users'), where('role', '==', 'student'))),
        getDocs(collection(db, 'enrollments')),
        getDocs(query(collection(db, 'payments'), where('status', '==', 'completed'))),
        getDocs(query(collection(db, 'enrollmentRequests'), where('status', '==', 'pending'))),
      ]);

      const totalRevenue = paymentsSnap.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);

      return {
        totalStudents: usersSnap.size,
        totalEnrollments: enrollmentsSnap.size,
        totalRevenue,
        pendingApplications: applicationsSnap.size,
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch stats: ${error.message}`);
    }
  },

  // Get all pending applications
  async getPendingApplications(): Promise<ApplicationReview[]> {
    try {
      const q = query(collection(db, 'enrollmentRequests'), where('status', '==', 'pending'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as ApplicationReview));
    } catch (error: any) {
      throw new Error(`Failed to fetch applications: ${error.message}`);
    }
  },

  // Approve application
  async approveApplication(
    applicationId: string,
    reviewNotes?: string,
    reviewedBy?: string
  ): Promise<void> {
    try {
      await updateDoc(doc(db, 'enrollmentRequests', applicationId), {
        status: 'approved',
        reviewNotes,
        reviewedAt: Date.now(),
        reviewedBy: reviewedBy || 'admin',
      });

      // Get application details to send notification
      const app = await getDocs(
        query(
          collection(db, 'enrollmentRequests'),
          where('__name__', '==', applicationId)
        )
      );

      if (!app.empty) {
        const appData = app.docs[0].data();
        // Send notification to student
        await addDoc(collection(db, 'notifications'), {
          uid: appData.uid,
          title: 'Application Approved',
          message: `Your application for ${appData.courseName} has been approved!`,
          type: 'success',
          read: false,
          createdAt: Date.now(),
        });
      }
    } catch (error: any) {
      throw new Error(`Failed to approve application: ${error.message}`);
    }
  },

  // Reject application
  async rejectApplication(
    applicationId: string,
    reviewNotes?: string,
    reviewedBy?: string
  ): Promise<void> {
    try {
      await updateDoc(doc(db, 'enrollmentRequests', applicationId), {
        status: 'rejected',
        reviewNotes,
        reviewedAt: Date.now(),
        reviewedBy: reviewedBy || 'admin',
      });

      // Get application details to send notification
      const app = await getDocs(
        query(
          collection(db, 'enrollmentRequests'),
          where('__name__', '==', applicationId)
        )
      );

      if (!app.empty) {
        const appData = app.docs[0].data();
        // Send notification to student
        await addDoc(collection(db, 'notifications'), {
          uid: appData.uid,
          title: 'Application Status Update',
          message: `Your application for ${appData.courseName} could not be processed at this time. Please contact our support team.`,
          type: 'warning',
          read: false,
          createdAt: Date.now(),
        });
      }
    } catch (error: any) {
      throw new Error(`Failed to reject application: ${error.message}`);
    }
  },

  // Get all students
  async getAllStudents(): Promise<any[]> {
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'student'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error: any) {
      throw new Error(`Failed to fetch students: ${error.message}`);
    }
  },

  // Get enrollment statistics
  async getEnrollmentStats(): Promise<any[]> {
    try {
      const snapshot = await getDocs(collection(db, 'enrollments'));
      const courses: { [key: string]: number } = {};

      snapshot.docs.forEach((doc) => {
        const courseName = doc.data().courseName;
        courses[courseName] = (courses[courseName] || 0) + 1;
      });

      return Object.entries(courses).map(([name, count]) => ({
        course: name,
        enrollments: count,
      }));
    } catch (error: any) {
      throw new Error(`Failed to fetch enrollment stats: ${error.message}`);
    }
  },

  // Get revenue statistics
  async getRevenueStats(): Promise<any> {
    try {
      const snapshot = await getDocs(
        query(collection(db, 'payments'), where('status', '==', 'completed'))
      );

      let totalRevenue = 0;
      const monthlyRevenue: { [key: string]: number } = {};

      snapshot.docs.forEach((doc) => {
        const amount = doc.data().amount || 0;
        totalRevenue += amount;

        const date = new Date(doc.data().paidAt || Date.now());
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + amount;
      });

      return {
        totalRevenue,
        monthlyRevenue,
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch revenue stats: ${error.message}`);
    }
  },

  // Send bulk notification
  async sendBulkNotification(
    studentIds: string[],
    title: string,
    message: string,
    type: 'info' | 'warning' | 'success' | 'error' = 'info'
  ): Promise<void> {
    try {
      const promises = studentIds.map((uid) =>
        addDoc(collection(db, 'notifications'), {
          uid,
          title,
          message,
          type,
          read: false,
          createdAt: Date.now(),
        })
      );

      await Promise.all(promises);
    } catch (error: any) {
      throw new Error(`Failed to send notifications: ${error.message}`);
    }
  },
};
