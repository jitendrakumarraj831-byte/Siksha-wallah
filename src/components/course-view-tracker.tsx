"use client";

import { useEffect } from "react";
import { saveActivity } from "@/services/activity-service";

/** Fires a course_view activity log when a course detail page mounts.
 *  Kept as a tiny client component so the page itself can stay a server
 *  component (enables generateStaticParams + generateMetadata for SEO). */
export function CourseViewTracker({
  courseId, name, full,
}: { courseId: string; name: string; full: string }) {
  useEffect(() => {
    saveActivity({
      type: "course_view",
      title: `Course Detail: ${name}`,
      description: `${full} detail page viewed`,
      course: name,
      page: `/courses/${courseId}`,
    });
  }, [courseId, name, full]);

  return null;
}
