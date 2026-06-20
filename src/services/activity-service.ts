import { db } from "@/lib/firebase";
import {
  collection, addDoc, serverTimestamp,
  query, orderBy, limit, onSnapshot,
  getDocs, Unsubscribe,
} from "firebase/firestore";

export type ActivityType =
  | "inquiry"       // Homepage form submit
  | "contact"       // Contact page form submit
  | "registration"  // New student account created
  | "student_login" // Student logged in
  | "whatsapp"      // WhatsApp button clicked
  | "bscc_check"    // BSCC eligibility checked
  | "course_view";  // Course card expanded

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

export async function getAllActivities(max = 200): Promise<Activity[]> {
  try {
    const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"), limit(max));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Activity));
  } catch {
    return [];
  }
}

/** Real-time listener — calls cb whenever new activity arrives */
export function subscribeActivities(
  max: number,
  cb: (activities: Activity[]) => void
): Unsubscribe {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"), limit(max));
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as Activity)));
  }, () => { /* ignore errors */ });
}
