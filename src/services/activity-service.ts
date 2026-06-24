import { db } from "@/lib/firebase";
import {
  collection, addDoc, serverTimestamp,
  query, orderBy, limit, onSnapshot,
  getDocs, Unsubscribe,
} from "firebase/firestore";

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

export async function getAllActivities(max = 500): Promise<Activity[]> {
  try {
    const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"), limit(max));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Activity));
  } catch {
    return [];
  }
}

/** Fetch next page of activities starting after the last doc */
export async function getActivitiesAfter(
  lastCreatedAt: any,
  pageSize = 200,
): Promise<Activity[]> {
  try {
    const { startAfter } = await import('firebase/firestore');
    const q = query(
      collection(db, COLLECTION),
      orderBy('createdAt', 'desc'),
      startAfter(lastCreatedAt),
      limit(pageSize),
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Activity));
  } catch {
    return [];
  }
}

/** Real-time listener — calls cb whenever a new activity arrives.
 *  Default max is 500 so the office sees all recent events live. */
export function subscribeActivities(
  max = 500,
  cb: (activities: Activity[]) => void,
): Unsubscribe {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'), limit(max));
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as Activity)));
  }, () => { /* ignore errors */ });
}
