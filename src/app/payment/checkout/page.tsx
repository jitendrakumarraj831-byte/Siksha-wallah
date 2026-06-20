'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { courseService } from '@/services/course-service';
import { paymentService } from '@/services/payment-service';
import { Button } from '@/components/ui/button';
import { PortalShell } from '@/components/portal-shell';
import { AlertCircle, CheckCircle2, Loader, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <PortalShell>
          <div className="flex min-h-screen items-center justify-center">
            <Loader className="animate-spin" size={40} />
          </div>
        </PortalShell>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const courseId = searchParams.get('courseId');

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentId, setPaymentId] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (!courseId) {
      setError('Course ID is missing');
      setLoading(false);
      return;
    }

    const loadCourse = async () => {
      try {
        const courseData = await courseService.getCourse(courseId);
        if (!courseData) {
          setError('Course not found');
        } else {
          setCourse(courseData);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId, isAuthenticated, router]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!user || !course) return;

    setProcessing(true);
    setError('');

    try {
      // Step 1: Create payment record
      const pId = await paymentService.createPayment(
        user.uid,
        courseId!,
        course.name,
        course.fees
      );
      setPaymentId(pId);

      // Step 2: Create Razorpay order
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          courseId: courseId,
          courseName: course.name,
          amount: course.fees,
          paymentId: pId,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error((errData as any).error || `Order creation failed (${response.status})`);
      }
      const orderData = await response.json();
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // Step 3: Open Razorpay checkout
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: 'INR',
        order_id: orderData.orderId,
        name: 'Siksha Wallah',
        description: course.name,
        customer_notification: 1,
        handler: async (response: any) => {
          try {
            // Step 4: Verify payment on backend
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                paymentId: pId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                uid: user.uid,
                courseId: courseId,
              }),
            });

            const verifyData = await verifyResponse.json();
            if (verifyResponse.ok && verifyData.success) {
              router.push(`/payment/success?paymentId=${pId}`);
            } else {
              setError(verifyData.error || 'Payment verification failed. Please contact support.');
            }
          } catch (error: any) {
            setError(error.message);
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          name: user.displayName || '',
          email: user.email || '',
        },
        theme: {
          color: '#1357e6',
        },
      };

      if (!window.Razorpay) {
        throw new Error('Payment gateway is not loaded. Please refresh and try again.');
      }
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      setError(err.message);
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <PortalShell>
        <div className="flex min-h-screen items-center justify-center">
          <Loader className="animate-spin" size={40} />
        </div>
      </PortalShell>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!course) {
    return (
      <PortalShell>
        <div className="container-shell py-8">
          <div className="rounded-xl bg-red-50 p-6 text-red-700">
            <AlertCircle size={24} className="mb-3" />
            <p>{error || 'Course not found'}</p>
          </div>
          <Link href="/courses" className="mt-6 inline-block">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </PortalShell>
    );
  }

  return (
    <PortalShell>
      <div className="container-shell py-8">
        <Link href={`/courses/${courseId}`} className="inline-flex items-center gap-2 text-blue-600 hover:underline">
          <ArrowLeft size={18} />
          Back to Course
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border bg-white p-8">
              <h1 className="text-3xl font-extrabold text-slate-900">Order Summary</h1>

              {error && (
                <div className="mt-6 flex gap-3 rounded-xl bg-red-50 p-4 text-red-700">
                  <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="mt-8">
                <h2 className="font-bold text-slate-900">Course Details</h2>
                <div className="mt-4 rounded-lg bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">Course Name</p>
                  <p className="mt-1 font-bold text-slate-900">{course.name}</p>

                  <div className="mt-4 border-t pt-4">
                    <p className="text-sm text-slate-600">Duration</p>
                    <p className="mt-1 font-bold text-slate-900">{course.duration}</p>
                  </div>

                  <div className="mt-4 border-t pt-4">
                    <p className="text-sm text-slate-600">Category</p>
                    <p className="mt-1 font-bold text-slate-900 capitalize">{course.category}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="font-bold text-slate-900">Billing Information</h2>
                <div className="mt-4 rounded-lg bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">Student Name</p>
                  <p className="mt-1 font-bold text-slate-900">{user?.displayName || 'Student'}</p>

                  <div className="mt-4 border-t pt-4">
                    <p className="text-sm text-slate-600">Email</p>
                    <p className="mt-1 font-bold text-slate-900">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div>
            <div className="sticky top-8 rounded-xl border bg-white p-6 shadow-lg">
              <h2 className="text-xl font-bold text-slate-900">Payment Summary</h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">Course Fee</span>
                  <span className="font-bold text-slate-900">₹{course.fees.toLocaleString()}</span>
                </div>

                <div className="flex justify-between border-t pt-4">
                  <span className="font-bold text-slate-900">Total Amount</span>
                  <span className="text-2xl font-extrabold text-blue-600">
                    ₹{course.fees.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
                <CheckCircle2 size={16} className="mb-2 inline" />
                <p>Secure payment powered by Razorpay</p>
              </div>

              <Button
                onClick={handlePayment}
                disabled={processing}
                className="mt-6 w-full py-3"
              >
                {processing ? (
                  <>
                    <Loader size={18} className="mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ₹${course.fees.toLocaleString()}`
                )}
              </Button>

              <p className="mt-4 text-center text-xs text-slate-500">
                Your payment information is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
