import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export type ActivityType =
  | "inquiry"        // Homepage form submit
  | "contact"        // Contact page form submit
  | "registration"   // New student account created
  | "student_login"  // Student logged in
  | "application"    // Course application submitted via /apply
  | "doc_upload"     // Document uploaded in dashboard
  | "profile_update" // Student updated their profile
  | "whatsapp"       // WhatsApp button clicked
  | "call_click"     // Call button clicked
  | "course_view";   // Course card/page viewed

export interface Activity {
  id?: string;
  type: ActivityType;
  title: string;
  description: string;
  name?: string;
  mobile?: string;
  email?: string;
  course?: string;
  page?: string;
  userId?: string;   // Firebase UID — links to /admin/students
  refId?: string;    // Application/doc ID — links to /admin/applications
  meta?: Record<string, string>;
  createdAt?: any;
}

const COLLECTION = "activities";

export async function saveActivity(
  activity: Omit<Activity, "id" | "createdAt">
): Promise<void> {
  try {
    await addDoc(collection(db, COLLECTION), {
      ...activity,
      createdAt: serverTimestamp(),
    });
  } catch {
    // Activity logging is non-critical — fail silently
  }
}

// NOTE: Reading activities is office-only. The collection holds lead/student
// contact details (mobile, email), so client reads are denied by the Firestore
// rules. The office activity feed loads through the cookie-gated Admin SDK API
// (`/api/admin/data?type=activities&limit=&before=`). Only `saveActivity`
// (public create) runs on the client.
