
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs } from "firebase/firestore";

export type InquiryStatus = "pending" | "called" | "admission_done";

export interface Inquiry {
  id?: string;
  fullName: string;
  mobile: string;
  email?: string;
  course: string;
  qualification?: string;
  message?: string;
  status?: InquiryStatus;
  note?: string;
  noteUpdatedAt?: any;
  createdAt?: any;
}

const INQUIRIES_COLLECTION = "inquiries";

export async function saveInquiry(inquiry: Omit<Inquiry, "id" | "createdAt">) {
  try {
    const docRef = await addDoc(collection(db, INQUIRIES_COLLECTION), {
      ...inquiry,
      status: "pending",
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving inquiry:", error);
    throw error;
  }
}

export async function getAllInquiries(): Promise<Inquiry[]> {
  try {
    const q = query(collection(db, INQUIRIES_COLLECTION), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    })) as Inquiry[];
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return [];
  }
}

// NOTE: Inquiry status/note changes are office-only writes. The office logs in
// with a signed cookie (not a Firebase Auth user), so Firestore rules treat it
// as anonymous and deny direct client writes. Persist changes through the
// cookie-gated Admin SDK API via `adminUpdate("inquiries", id, …)` in
// `@/lib/admin-api` instead.
