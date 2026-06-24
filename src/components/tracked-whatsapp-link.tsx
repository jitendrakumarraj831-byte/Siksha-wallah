"use client";

import type { ReactNode } from "react";
import { saveActivity } from "@/services/activity-service";

/** A WhatsApp <a> link that logs a whatsapp activity on click. Lets the
 *  course detail page stay a server component while keeping click tracking. */
export function TrackedWhatsAppLink({
  href, course, page, className, children,
}: {
  href: string;
  course: string;
  page: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        saveActivity({
          type: "whatsapp",
          title: `WhatsApp — ${course}`,
          description: "Enquiry from course detail page",
          page,
        })
      }
      className={className}
    >
      {children}
    </a>
  );
}
