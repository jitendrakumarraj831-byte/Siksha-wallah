import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { paymentService } from '@/services/payment-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, courseId, courseName, amount, paymentId } = body;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });

    if (!uid || !courseId || !amount || !paymentId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const orderData = paymentService.createRazorpayOrderPayload(amount, paymentId);
    const order = await razorpay.orders.create(orderData);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error('Payment order creation failed:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
