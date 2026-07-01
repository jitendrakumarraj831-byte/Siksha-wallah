import { db } from "@/lib/firebase";
import {
  collection, addDoc, serverTimestamp, query, where,
  getDocs, onSnapshot, Unsubscribe, orderBy,
} from "firebase/firestore";

export type ApplicationStatus = "new" | "contacted" | "documents_pending" | "admission_done" | "not_interested";

// Office-only payment tracking. Optional/additive fields on the existing
// course_applications doc — same pattern as `note`/`noteUpdatedAt` below.
export type PaymentStatus = "pending" | "partial" | "paid";

export interface CourseApplication {
  id?: string;
  userId?: string;          // Firebase Auth UID — set when logged-in student applies
  // Personal
  fullName: string;
  mobile: string;
  email?: string;
  fatherName?: string;
  dob?: string;
  gender?: string;
  address?: string;
  district?: string;
  state?: string;
  // Academic
  course: string;
  stream?: string;
  qualification: string;
  passingYear?: string;
  percentage?: string;
  schoolCollege?: string;
  // Preferences
  preferredCollege?: string;
  bsccRequired?: boolean;
  message?: string;
  // Document availability checklist (student self-declared)
  availableDocs?: string[];   // list of doc labels student has
  // Uploaded documents (PDF files uploaded during application)
  uploadedDocuments?: { name: string; url: string }[];
  // Admin fields
  status?: ApplicationStatus;
  note?: string;
  noteUpdatedAt?: any;
  createdAt?: any;
  // Payment — office-only writes; students only ever view these.
  paymentStatus?: PaymentStatus;
  amountPaid?: number;
  amountDue?: number;
  paymentDate?: any;
  paymentMode?: string;
  paymentUpdatedAt?: any;
}

const COL = "course_applications";

export async function saveApplication(app: Omit<CourseApplication, "id" | "createdAt" | "status">) {
  const docRef = await addDoc(collection(db, COL), {
    ...app,
    status: "new",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getAllApplications(): Promise<CourseApplication[]> {
  try {
    const q = query(collection(db, COL), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as CourseApplication[];
  } catch {
    return [];
  }
}

export function subscribeApplications(
  cb: (apps: CourseApplication[]) => void
): Unsubscribe {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() })) as CourseApplication[]);
  });
}

// NOTE: Application status/note changes are office-only writes. The office logs
// in with a signed cookie (not a Firebase Auth user), so Firestore rules treat
// it as anonymous and deny direct client writes. Persist changes through the
// cookie-gated Admin SDK API via `adminUpdate("course_applications", id, …)` in
// `@/lib/admin-api` instead.

export async function getApplicationsByUser(userId: string): Promise<CourseApplication[]> {
  try {
    // No orderBy — avoids composite index requirement; sort in caller if needed
    const q = query(collection(db, COL), where("userId", "==", userId));
    const snap = await getDocs(q);
    const apps = snap.docs.map(d => ({ id: d.id, ...d.data() })) as CourseApplication[];
    return apps.sort((a, b) => {
      const ta = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt ?? 0);
      const tb = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt ?? 0);
      return tb - ta;
    });
  } catch {
    return [];
  }
}
