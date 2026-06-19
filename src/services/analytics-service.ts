import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
  orderBy,
  increment,
  updateDoc,
  doc,
} from 'firebase/firestore';

export interface AnalyticsEvent {
  id: string;
  eventName: string;
  uid?: string;
  properties: Record<string, any>;
  timestamp: Timestamp;
}

export interface DashboardAnalytics {
  totalStudents: number;
  totalEnrollments: number;
  totalRevenue: number;
  conversionRate: number;
  avgEnrollmentValue: number;
  topCourses: Array<{ courseId: string; enrollments: number }>;
  dailyMetrics: Array<{ date: string; enrollments: number; revenue: number }>;
}

export const analyticsService = {
  async trackEvent(
    eventName: string,
    properties: Record<string, any>,
    uid?: string
  ): Promise<void> {
    try {
      await addDoc(collection(db, 'analytics_events'), {
        eventName,
        uid,
        properties,
        timestamp: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  },

  async trackPageView(page: string, uid?: string): Promise<void> {
    await this.trackEvent('page_view', { page }, uid);
  },

  async trackEnrollment(
    uid: string,
    courseId: string,
    amount: number
  ): Promise<void> {
    await this.trackEvent('enrollment', { courseId, amount }, uid);
  },

  async trackPayment(uid: string, amount: number, orderId: string): Promise<void> {
    await this.trackEvent('payment_completed', { amount, orderId }, uid);
  },

  async getAnalytics(startDate: Date, endDate: Date): Promise<DashboardAnalytics> {
    try {
      // Fetch all payments in date range
      const paymentsQ = query(
        collection(db, 'payments'),
        where('createdAt', '>=', Timestamp.fromDate(startDate)),
        where('createdAt', '<=', Timestamp.fromDate(endDate))
      );
      const paymentsSnapshot = await getDocs(paymentsQ);

      // Fetch all enrollments
      const enrollmentsQ = query(collection(db, 'enrollments'));
      const enrollmentsSnapshot = await getDocs(enrollmentsQ);

      // Fetch all users
      const usersQ = query(collection(db, 'users'));
      const usersSnapshot = await getDocs(usersQ);

      const totalRevenue = paymentsSnapshot.docs.reduce(
        (sum, doc) => sum + (doc.data().amount || 0),
        0
      );

      const totalEnrollments = enrollmentsSnapshot.size;
      const totalStudents = usersSnapshot.size;

      // Calculate course-wise enrollments
      const courseMap: Record<string, number> = {};
      enrollmentsSnapshot.docs.forEach((doc) => {
        const courseId = doc.data().courseId;
        courseMap[courseId] = (courseMap[courseId] || 0) + 1;
      });

      const topCourses = Object.entries(courseMap)
        .map(([courseId, count]) => ({ courseId, enrollments: count }))
        .sort((a, b) => b.enrollments - a.enrollments)
        .slice(0, 5);

      return {
        totalStudents,
        totalEnrollments,
        totalRevenue,
        conversionRate: totalStudents > 0 ? (totalEnrollments / totalStudents) * 100 : 0,
        avgEnrollmentValue: totalEnrollments > 0 ? totalRevenue / totalEnrollments : 0,
        topCourses,
        dailyMetrics: [], // Would require more complex aggregation
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  },

  async getConversionFunnel(): Promise<Record<string, number>> {
    try {
      const events = await Promise.all([
        getDocs(query(collection(db, 'analytics_events'), where('eventName', '==', 'page_view'))),
        getDocs(query(collection(db, 'analytics_events'), where('eventName', '==', 'enrollment'))),
        getDocs(query(collection(db, 'analytics_events'), where('eventName', '==', 'payment_completed'))),
      ]);

      return {
        page_views: events[0].size,
        enrollments: events[1].size,
        payments: events[2].size,
      };
    } catch (error) {
      console.error('Error fetching conversion funnel:', error);
      throw error;
    }
  },
};
