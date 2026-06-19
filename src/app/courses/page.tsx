'use client';

import { useEffect, useState } from 'react';
import { courseService, Course } from '@/services/course-service';
import { Button } from '@/components/ui/button';
import { PortalShell } from '@/components/portal-shell';
import { Loader, Filter, Search, BookOpen } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
  { value: 'bed', label: 'B.Ed' },
  { value: 'deled', label: 'D.El.Ed' },
  { value: 'nursing', label: 'Nursing' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'management', label: 'Management' },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        let courses = await courseService.getAllCourses();
        if (courses.length === 0 && !initialized) {
          await courseService.addDemoCourses();
          courses = await courseService.getAllCourses();
          setInitialized(true);
        }
        setCourses(courses);
        setFilteredCourses(courses);
      } catch (error) {
        console.error('Failed to load courses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [initialized]);

  useEffect(() => {
    let filtered = courses;

    if (selectedCategory) {
      filtered = filtered.filter((c) => c.category === selectedCategory);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.code.toLowerCase().includes(term) ||
          c.description.toLowerCase().includes(term)
      );
    }

    setFilteredCourses(filtered);
  }, [selectedCategory, searchTerm, courses]);

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
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-sm font-extrabold uppercase tracking-[.2em] text-blue-600">Course Catalog</p>
          <h1 className="mt-3 text-4xl font-extrabold text-slate-900 sm:text-5xl">Explore Our Programs</h1>
          <p className="mt-4 text-lg text-slate-600">Choose from a wide range of professional courses</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4 lg:flex lg:gap-4 lg:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search courses by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-200 py-3 pl-12 pr-4 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
            <Filter size={20} className="flex-shrink-0 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-slate-200 px-4 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <Link key={course.id} href={`/courses/${course.id}`}>
                <div className="group cursor-pointer rounded-xl border bg-white p-6 transition hover:shadow-lg">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-600">
                        {course.code}
                      </span>
                      <h3 className="mt-3 text-lg font-bold text-slate-900 group-hover:text-blue-600">
                        {course.name}
                      </h3>
                    </div>
                    <BookOpen className="text-slate-300 group-hover:text-blue-400" size={24} />
                  </div>

                  <p className="line-clamp-2 text-sm text-slate-600">{course.description}</p>

                  <div className="mt-4 grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Duration:</span>
                      <span className="font-bold text-slate-900">{course.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Fee:</span>
                      <span className="font-bold text-slate-900">₹{course.fees.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Enrolled:</span>
                      <span className="font-bold text-slate-900">
                        {course.enrolledStudents}/{course.enrollmentLimit}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-bold text-slate-700">Eligibility:</p>
                    <p className="line-clamp-2 text-xs text-slate-600">{course.eligibility}</p>
                  </div>

                  <Button className="mt-4 w-full group-hover:bg-blue-700">
                    View Details
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-slate-50 p-12 text-center">
            <BookOpen className="mx-auto text-slate-400" size={48} />
            <p className="mt-4 text-slate-600">No courses found matching your filters</p>
            <Button
              onClick={() => {
                setSelectedCategory('');
                setSearchTerm('');
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </PortalShell>
  );
}
