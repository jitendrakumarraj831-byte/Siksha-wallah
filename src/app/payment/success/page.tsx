'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { paymentService, Payment } from '@/services/payment-service';
import { Button } from '@/components/ui/button';
import { PortalShell } from '@/components/portal-shell';
import { CheckCircle2, Download, Loader, Home } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentId = searchParams.get('paymentId');

  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!paymentId) {
      setLoading(false);
      return;
    }

    const loadPayment = async () => {
      try {
        const data = await paymentService.getPayment(paymentId);
        setPayment(data);
      } catch (error) {
        console.error('Failed to load payment:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPayment();
  }, [paymentId]);

  if (loading) {
    return (
      <PortalShell>
        <div className="flex min-h-screen items-center justify-center">
          <Loader className="animate-spin" size={40} />
        </div>
      </PortalShell>
    );
  }

  return (
    <PortalShell>
      <div className="container-shell py-12">
        <div className="mx-auto max-w-2xl rounded-xl border bg-white p-8 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle2 size={64} className="text-green-600" />
            </div>
          </div>

          <h1 className="mt-6 text-3xl font-extrabold text-slate-900">Payment Successful!</h1>
          <p className="mt-2 text-slate-600">Your payment has been processed successfully</p>

          {payment && (
            <div className="mt-8 space-y-6 rounded-lg bg-slate-50 p-6 text-left">
              <div>
                <p className="text-sm font-bold text-slate-700">Course</p>
                <p className="mt-1 text-slate-900">{payment.courseName}</p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-bold text-slate-700">Amount Paid</p>
                <p className="mt-1 text-2xl font-extrabold text-green-600">
                  ₹{payment.amount.toLocaleString()}
                </p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-bold text-slate-700">Payment ID</p>
                <p className="mt-1 font-mono text-sm text-slate-600">{payment.id}</p>
              </div>

              {payment.razorpayPaymentId && (
                <div className="border-t pt-4">
                  <p className="text-sm font-bold text-slate-700">Razorpay Transaction ID</p>
                  <p className="mt-1 font-mono text-sm text-slate-600">{payment.razorpayPaymentId}</p>
                </div>
              )}

              <div className="border-t pt-4">
                <p className="text-sm font-bold text-slate-700">Date</p>
                <p className="mt-1 text-slate-600">
                  {payment.paidAt ? new Date(payment.paidAt).toLocaleString() : 'Pending'}
                </p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-bold text-slate-700">Status</p>
                <p className="mt-1 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                  {payment.status.toUpperCase()}
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 space-y-3">
            <p className="text-sm text-slate-600">
              A confirmation email has been sent to your registered email address with course access details.
            </p>
            <p className="text-sm text-slate-600">
              Your enrollment will be activated shortly. You can start accessing course materials from your dashboard.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => router.push('/dashboard')} className="flex-1">
              Go to Dashboard
            </Button>
            <Link href="/courses" className="flex-1">
              <Button variant="outline" className="w-full">
                Browse More Courses
              </Button>
            </Link>
          </div>

          <div className="mt-6 border-t pt-6">
            <p className="text-xs text-slate-500">
              Transaction reference: <span className="font-mono">{paymentId}</span>
            </p>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
