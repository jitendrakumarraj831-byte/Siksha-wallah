import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { paymentService } from '@/services/payment-service';
import { db } from '@/lib/firebase';
import { addDoc, collection, getDocs, query, where, limit } from 'firebase/firestore';
import { rateLimit, getClientIp, tooManyRequests } from '@/lib/rate-limit';
import { getAdminDb, getAdminAuth } from '@/lib/firebase-admin';
import { isMailerConfigured, sendMail } from '@/lib/mailer';
import { admissionConfirmationTemplate } from '@/lib/email-templates';

async function sendAdmissionConfirmation(uid: string, courseName: string, amount: number, paymentId: string): Promise<void> {
  if (!isMailerConfigured()) return;
  const adminAuth = getAdminAuth();
  if (!adminAuth) return;
  try {
    const userRecord = await adminAuth.getUser(uid);
    if (!userRecord.email) return;
    const { html, text } = admissionConfirmationTemplate({
      name: userRecord.displayName || 'Student',
      courseName,
      amount,
      paymentId,
      enrollmentDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    });
    await sendMail({
      to: userRecord.email,
      subject: 'Siksha Wallah — Admission Confirmed! 🎉',
      html,
      text,
    });
  } catch (err) {
    console.error('Admission confirmation email error (non-fatal):', err);
  }
}

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

    const validSignature = timingSafeEqualHex(expectedSignature, String(razorpaySignature));

    // Prefer the Admin SDK (bypasses Firestore rules, so client writes can be
    // locked down). Falls back to the client SDK where Admin isn't configured.
    const adminDb = getAdminDb();

    if (adminDb) {
      const payRef = adminDb.collection('payments').doc(paymentId);

      if (!validSignature) {
        await payRef.update({ status: 'failed', errorReason: 'Invalid signature' }).catch(() => {});
        return NextResponse.json({ error: 'Payment verification failed — invalid signature' }, { status: 400 });
      }

      const paySnap = await payRef.get();
      // Idempotency: already completed → return without re-processing.
      if (paySnap.exists && paySnap.data()?.status === 'completed') {
        return NextResponse.json({ success: true, message: 'Payment already verified', alreadyProcessed: true });
      }

      await payRef.update({
        status: 'completed',
        razorpayPaymentId,
        razorpayOrderId,
        paymentMethod: 'online',
        paidAt: Date.now(),
      });

      if (uid && courseId) {
        try {
          const dup = await adminDb.collection('enrollments').where('paymentId', '==', paymentId).limit(1).get();
          if (dup.empty) {
            const pay = paySnap.data() || {};
            await adminDb.collection('enrollments').add({
              uid, courseId, courseName: pay.courseName ?? '',
              enrollmentDate: Date.now(), status: 'active', progressPercentage: 0,
              paidAmount: pay.amount ?? 0, paymentId,
            });
            await adminDb.collection('notifications').add({
              uid, title: 'Payment Successful',
              message: `Your payment for ${pay.courseName ?? 'your course'} has been processed. You are now enrolled!`,
              type: 'success', read: false, createdAt: Date.now(),
            });
            // Send branded admission confirmation email (non-blocking)
            sendAdmissionConfirmation(uid, pay.courseName ?? 'your course', pay.amount ?? 0, paymentId);
          }
        } catch (enrollErr) {
          console.error('Enrollment creation error (non-fatal):', enrollErr);
        }
      }

      return NextResponse.json({ success: true, message: 'Payment verified successfully' });
    }

    // ── Fallback: client SDK (used before Admin SDK / locked rules) ──
    if (!validSignature) {
      await paymentService.updatePaymentFailed(paymentId, 'Invalid signature');
      return NextResponse.json({ error: 'Payment verification failed — invalid signature' }, { status: 400 });
    }

    try {
      const existing = await paymentService.getPayment(paymentId);
      if (existing?.status === 'completed') {
        return NextResponse.json({ success: true, message: 'Payment already verified', alreadyProcessed: true });
      }
    } catch {
      /* fall through */
    }

    await paymentService.updatePaymentSuccess(paymentId, razorpayPaymentId, razorpayOrderId, 'online');

    if (uid && courseId) {
      try {
        const dupSnap = await getDocs(
          query(collection(db, 'enrollments'), where('paymentId', '==', paymentId), limit(1)),
        );
        const userPayments = await paymentService.getUserPayments(uid);
        const paymentRecord = userPayments.find((p) => p.id === paymentId);
        if (paymentRecord && dupSnap.empty) {
          await addDoc(collection(db, 'enrollments'), {
            uid, courseId, courseName: paymentRecord.courseName,
            enrollmentDate: Date.now(), status: 'active', progressPercentage: 0,
            paidAmount: paymentRecord.amount, paymentId,
          });
          await addDoc(collection(db, 'notifications'), {
            uid, title: 'Payment Successful',
            message: `Your payment for ${paymentRecord.courseName} has been processed. You are now enrolled!`,
            type: 'success', read: false, createdAt: Date.now(),
          });
          // Send branded admission confirmation email (non-blocking)
          sendAdmissionConfirmation(uid, paymentRecord.courseName, paymentRecord.amount, paymentId);
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
