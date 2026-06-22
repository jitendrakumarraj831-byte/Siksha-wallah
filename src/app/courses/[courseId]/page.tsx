'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { courseService, Course } from '@/services/course-service';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { PortalShell } from '@/components/portal-shell';
import {
  ArrowLeft,
  Loader,
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  Users,
  BookOpen,
  Award,
} from 'lucide-react';
import Link from 'next/link';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const courseData = await courseService.getCourse(courseId);
        setCourse(courseData);

        if (user && isAuthenticated) {
          const enrolled = await courseService.checkEnrollment(user.uid, courseId);
          setIsEnrolled(enrolled);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId, user, isAuthenticated]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (!user) return;

    setEnrolling(true);
    setError('');
    setSuccess('');

    try {
      await courseService.submitEnrollmentRequest(
        user.uid,
        courseId,
        user.displayName || 'Student',
        user.email || '',
        course?.name || ''
      );
      setSuccess('Thank you — your enrolment request has been received. A counsellor will reach out to you within 30 minutes to confirm the next steps.');
      setIsEnrolled(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setEnrolling(false);
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

  if (!course) {
    return (
      <PortalShell>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <AlertCircle className="mx-auto text-red-500" size={48} />
            <p className="mt-4 text-slate-600">We couldn&apos;t find this course. It may have been moved or is no longer available.</p>
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
              {/* Course Header */}
              <div className="mb-6">
                <span className="inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-bold text-blue-600">
                  {course.code}
                </span>
                <h1 className="mt-4 text-4xl font-extrabold bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">{course.name}</h1>
                <p className="mt-4 text-lg text-slate-600">{course.description}</p>
              </div>

              {error && (
                <div className="mb-6 flex gap-3 rounded-xl bg-red-50 p-4 text-red-700">
                  <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-6 flex gap-3 rounded-xl bg-green-50 p-4 text-green-700">
                  <CheckCircle2 size={20} className="mt-0.5 flex-shrink-0" />
                  <p className="text-sm font-medium">{success}</p>
                </div>
              )}

              {/* Course Details Grid */}
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
                    <Users size={24} className="text-purple-600" />
                    <div>
                      <p className="text-sm text-slate-600">Seats Filled</p>
                      <p className="font-bold text-slate-900">
                        {course.enrolledStudents} of {course.enrollmentLimit}
                      </p>
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

              {/* Eligibility */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-900">Who Can Apply</h2>
                <p className="mt-3 text-slate-600">{course.eligibility}</p>
              </div>

              {/* Features */}
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

              {/* Instructors */}
              <div>
                <h2 className="text-xl font-bold text-slate-900">Faculty Highlights</h2>
                <div className="mt-4 space-y-2">
                  {course.instructors.map((instructor) => (
                    <div key={instructor} className="flex gap-3">
                      <BookOpen size={20} className="mt-0.5 flex-shrink-0 text-blue-600" />
                      <p className="text-slate-600">{instructor}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Enrollment Card */}
          <div>
            <div className="sticky top-8 rounded-xl border bg-white p-6 shadow-lg">
              <div className="mb-6">
                <p className="text-sm text-slate-600">Indicative Course Fee</p>
                <p className="text-3xl font-extrabold text-slate-900">₹{course.fees.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">Final fee depends on the college you choose. Our counsellor will help you understand all options.</p>
              </div>

              <div className="mb-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Seats Still Available</span>
                  <span className="font-bold text-slate-900">
                    {course.enrollmentLimit - course.enrolledStudents}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full bg-blue-600"
                    style={{
                      width: `${(course.enrolledStudents / course.enrollmentLimit) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {isEnrolled ? (
                <Button disabled className="w-full py-3" variant="outline">
                  <CheckCircle2 size={18} className="mr-2" />
                  Counsellor Will Contact You
                </Button>
              ) : (
                <Button
                  onClick={handleEnroll}
                  disabled={enrolling || course.enrolledStudents >= course.enrollmentLimit}
                  className="w-full py-3"
                >
                  {enrolling ? (
                    <>
                      <Loader size={18} className="mr-2 animate-spin" />
                      Reserving your seat…
                    </>
                  ) : (
                    'Request Counselling for This Course'
                  )}
                </Button>
              )}

              {course.enrolledStudents >= course.enrollmentLimit && (
                <p className="mt-3 text-center text-xs text-yellow-600">
                  All seats for this batch are filled. Join the waitlist and we&apos;ll notify you the moment a seat opens up.
                </p>
              )}

              {!isAuthenticated && (
                <p className="mt-4 text-center text-xs text-slate-600">
                  Please{' '}
                  <Link href="/auth/login" className="font-bold text-blue-600 hover:underline">
                    sign in
                  </Link>{' '}
                  to request counselling for this course.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
