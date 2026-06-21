import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { paymentService } from '@/services/payment-service';
import { db } from '@/lib/firebase';
import { addDoc, collection, getDocs, query, where, limit } from 'firebase/firestore';
import { rateLimit, getClientIp, tooManyRequests } from '@/lib/rate-limit';

function timingSafeEqualHex(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(request: NextRequest) {
  // Abuse protection: 20 verify attempts / 5 min per IP.
  const rl = rateLimit(`pay-verify:${getClientIp(request)}`, 20, 5 * 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfter);

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

    // Verify Razorpay signature (constant-time comparison).
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (!timingSafeEqualHex(expectedSignature, String(razorpaySignature))) {
      await paymentService.updatePaymentFailed(paymentId, 'Invalid signature');
      return NextResponse.json({ error: 'Payment verification failed — invalid signature' }, { status: 400 });
    }

    // Idempotency: if this payment is already completed, don't re-process
    // (prevents duplicate enrollments/notifications on retried callbacks).
    try {
      const existing = await paymentService.getPayment(paymentId);
      if (existing?.status === 'completed') {
        return NextResponse.json({ success: true, message: 'Payment already verified', alreadyProcessed: true });
      }
    } catch {
      // If the lookup fails, fall through and process normally.
    }

    await paymentService.updatePaymentSuccess(paymentId, razorpayPaymentId, razorpayOrderId, 'online');

    if (uid && courseId) {
      try {
        // Skip enrollment creation if one already exists for this payment.
        const dupSnap = await getDocs(
          query(collection(db, 'enrollments'), where('paymentId', '==', paymentId), limit(1)),
        );
        const userPayments = await paymentService.getUserPayments(uid);
        const paymentRecord = userPayments.find((p) => p.id === paymentId);
        if (paymentRecord && dupSnap.empty) {
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
