import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { paymentService } from '@/services/payment-service';
import { db } from '@/lib/firebase';
import { addDoc, collection } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { paymentId, razorpayOrderId, razorpayPaymentId, razorpaySignature, uid, courseId } = body;

    if (!paymentId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify Razorpay signature
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      await paymentService.updatePaymentFailed(paymentId, 'Invalid signature');
      return NextResponse.json({ error: 'Payment verification failed — invalid signature' }, { status: 400 });
    }

    await paymentService.updatePaymentSuccess(paymentId, razorpayPaymentId, razorpayOrderId, 'online');

    if (uid && courseId) {
      try {
        const userPayments = await paymentService.getUserPayments(uid);
        const paymentRecord = userPayments.find((p) => p.id === paymentId);
        if (paymentRecord) {
          await addDoc(collection(db, 'enrollments'), {
            uid,
            courseId,
            courseName: paymentRecord.courseName,
            enrollmentDate: Date.now(),
            status: 'active',
            progressPercentage: 0,
            paidAmount: paymentRecord.amount,
            paymentId,
          });
          await addDoc(collection(db, 'notifications'), {
            uid,
            title: 'Payment Successful',
            message: `Your payment for ${paymentRecord.courseName} has been processed. You are now enrolled!`,
            type: 'success',
            read: false,
            createdAt: Date.now(),
          });
        }
      } catch (enrollErr) {
        console.error('Enrollment creation error (non-fatal):', enrollErr);
      }
    }

    return NextResponse.json({ success: true, message: 'Payment verified successfully' });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Payment verification failed';
    console.error('Payment verification error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
