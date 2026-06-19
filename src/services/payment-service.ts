import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc, query, where, getDocs, getDoc } from 'firebase/firestore';

export interface Payment {
  id?: string;
  uid: string;
  courseId: string;
  courseName: string;
  amount: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  paymentMethod?: string;
  paidAt?: number;
  createdAt: number;
  invoiceUrl?: string;
}

export const paymentService = {
  // Create payment record
  async createPayment(
    uid: string,
    courseId: string,
    courseName: string,
    amount: number
  ): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'payments'), {
        uid,
        courseId,
        courseName,
        amount,
        status: 'pending',
        createdAt: Date.now(),
      } as Payment);
      return docRef.id;
    } catch (error: any) {
      throw new Error(`Failed to create payment: ${error.message}`);
    }
  },

  // Update payment after successful transaction
  async updatePaymentSuccess(
    paymentId: string,
    razorpayPaymentId: string,
    razorpayOrderId: string,
    paymentMethod: string = 'card'
  ): Promise<void> {
    try {
      await updateDoc(doc(db, 'payments', paymentId), {
        status: 'completed',
        razorpayPaymentId,
        razorpayOrderId,
        paymentMethod,
        paidAt: Date.now(),
      });
    } catch (error: any) {
      throw new Error(`Failed to update payment: ${error.message}`);
    }
  },

  // Update payment on failure
  async updatePaymentFailed(paymentId: string, reason: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'payments', paymentId), {
        status: 'failed',
        errorReason: reason,
      });
    } catch (error: any) {
      throw new Error(`Failed to update payment: ${error.message}`);
    }
  },

  // Get payment by ID
  async getPayment(paymentId: string): Promise<Payment | null> {
    try {
      const docSnap = await getDoc(doc(db, 'payments', paymentId));
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as Payment;
      }
      return null;
    } catch (error: any) {
      throw new Error(`Failed to fetch payment: ${error.message}`);
    }
  },

  // Get user payments
  async getUserPayments(uid: string): Promise<Payment[]> {
    try {
      const q = query(collection(db, 'payments'), where('uid', '==', uid));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Payment));
    } catch (error: any) {
      throw new Error(`Failed to fetch payments: ${error.message}`);
    }
  },

  // Get payment history for course
  async getCoursePayments(courseId: string): Promise<Payment[]> {
    try {
      const q = query(collection(db, 'payments'), where('courseId', '==', courseId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Payment));
    } catch (error: any) {
      throw new Error(`Failed to fetch course payments: ${error.message}`);
    }
  },

  // Create Razorpay order (called from API route)
  createRazorpayOrderPayload(amount: number, paymentId: string) {
    return {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: paymentId,
      notes: {
        paymentId,
      },
    };
  },

  // Generate invoice URL (placeholder)
  async generateInvoiceUrl(paymentId: string, payment: Payment): Promise<string> {
    // In production, integrate with a service like PDFKit or use a template
    return `/invoices/${paymentId}.pdf`;
  },
};
