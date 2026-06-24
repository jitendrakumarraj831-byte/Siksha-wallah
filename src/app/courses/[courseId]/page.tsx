'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { courseService, Course } from '@/services/course-service';
import { PortalShell } from '@/components/portal-shell';
import {
  ArrowLeft,
  Loader,
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  Award,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { saveActivity } from '@/services/activity-service';

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    courseService.getCourse(courseId)
      .then(data => {
        setCourse(data);
        if (data) {
          saveActivity({
            type: 'course_view',
            title: 'Course Viewed',
            description: `${data.name} detail page viewed`,
            course: data.name,
            page: `/courses/${courseId}`,
          });
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) {
    return (
      <PortalShell>
        <div className="flex min-h-screen items-center justify-center">
          <Loader className="animate-spin" size={40} />
        </div>
      </PortalShell>
    );
  }

  if (!course) {
    return (
      <PortalShell>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <AlertCircle className="mx-auto text-red-500" size={48} />
            <p className="mt-4 text-slate-600">{error || "We couldn't find this course."}</p>
            <Link href="/courses">
              <Button className="mt-4">Explore All Courses</Button>
            </Link>
          </div>
        </div>
      </PortalShell>
    );
  }

  return (
    <PortalShell>
      <div className="container-shell py-8">
        <Link href="/courses" className="inline-flex items-center gap-2 text-blue-600 hover:underline">
          <ArrowLeft size={18} />
          Back to All Courses
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border bg-white p-8">
              <div className="mb-6">
                <span className="inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-bold text-blue-600">
                  {course.code}
                </span>
                <h1 className="mt-4 text-4xl font-extrabold text-gray-900">{course.name}</h1>
                <p className="mt-4 text-lg text-slate-600">{course.description}</p>
              </div>

              <div className="mb-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <Clock size={24} className="text-blue-600" />
                    <div>
                      <p className="text-sm text-slate-600">Course Duration</p>
                      <p className="font-bold text-slate-900">{course.duration}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <DollarSign size={24} className="text-green-600" />
                    <div>
                      <p className="text-sm text-slate-600">Indicative Fee</p>
                      <p className="font-bold text-slate-900">₹{course.fees.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <Award size={24} className="text-yellow-600" />
                    <div>
                      <p className="text-sm text-slate-600">Stream</p>
                      <p className="font-bold text-slate-900 capitalize">{course.category}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-900">Who Can Apply</h2>
                <p className="mt-3 text-slate-600">{course.eligibility}</p>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-900">What Your Admission Includes</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {course.features.map((feature) => (
                    <div key={feature} className="flex gap-3">
                      <CheckCircle2 size={20} className="mt-0.5 flex-shrink-0 text-green-600" />
                      <p className="text-slate-600">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-8 rounded-xl border bg-white p-6 shadow-lg">
              <div className="mb-6">
                <p className="text-sm text-slate-600">Indicative Course Fee</p>
                <p className="text-3xl font-extrabold text-slate-900">₹{course.fees.toLocaleString()}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Final fee depends on the college you choose. Our counsellor will help you understand all options.
                </p>
              </div>

              <Link href={`/apply?course=${encodeURIComponent(course.name)}`}>
                <Button className="w-full py-3">Apply for This Course</Button>
              </Link>

              <p className="mt-4 text-center text-xs text-slate-500">
                Our counsellor will reach out within 30 minutes to guide you through the next steps.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
