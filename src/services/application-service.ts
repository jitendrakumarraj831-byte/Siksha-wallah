import { db } from "@/lib/firebase";
import {
  collection, addDoc, serverTimestamp, query, orderBy,
  getDocs, doc, updateDoc, onSnapshot, Unsubscribe,
} from "firebase/firestore";

export type ApplicationStatus = "new" | "contacted" | "documents_pending" | "admission_done" | "not_interested";

export interface CourseApplication {
  id?: string;
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
  // Admin fields
  status?: ApplicationStatus;
  note?: string;
  noteUpdatedAt?: any;
  createdAt?: any;
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

export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
  await updateDoc(doc(db, COL, id), { status });
}

export async function updateApplicationNote(id: string, note: string) {
  await updateDoc(doc(db, COL, id), { note, noteUpdatedAt: serverTimestamp() });
}
