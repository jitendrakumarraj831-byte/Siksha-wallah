import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { paymentService } from '@/services/payment-service';

export async function POST(request: NextRequest) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.error('Razorpay credentials not configured');
    return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { uid, courseId, courseName, amount, paymentId } = body;

    if (!uid || !courseId || !amount || !paymentId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (typeof amount !== 'number' || amount <= 0 || amount > 10_00_000) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const orderData = paymentService.createRazorpayOrderPayload(amount, paymentId);
    const order = await razorpay.orders.create(orderData);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: keyId,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to create order';
    console.error('Payment order creation failed:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
