import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { paymentService } from '@/services/payment-service';
import { db } from '@/lib/firebase';
import { doc, updateDoc, addDoc, collection } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, razorpayOrderId, razorpayPaymentId, razorpaySignature, uid, courseId } = body;

    if (!paymentId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      await paymentService.updatePaymentFailed(paymentId, 'Invalid signature');
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Update payment status
    await paymentService.updatePaymentSuccess(
      paymentId,
      razorpayPaymentId,
      razorpayOrderId,
      'online'
    );

    // Create enrollment record automatically
    if (uid && courseId) {
      try {
        const enrollmentData = await paymentService.getUserPayments(uid);
        const paymentRecord = enrollmentData.find((p) => p.id === paymentId);

        if (paymentRecord) {
          // Create enrollment
          await addDoc(collection(db, 'enrollments'), {
            uid,
            courseId,
            courseName: paymentRecord.courseName,
            enrollmentDate: Date.now(),
            status: 'active',
            progressPercentage: 0,
            paidAmount: paymentRecord.amount,
            paymentId: paymentId,
          });

          // Send notification
          await addDoc(collection(db, 'notifications'), {
            uid,
            title: 'Payment Successful',
            message: `Your payment for ${paymentRecord.courseName} has been processed. You are now enrolled!`,
            type: 'success',
            read: false,
            createdAt: Date.now(),
          });
        }
      } catch (error) {
        console.error('Error creating enrollment:', error);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
