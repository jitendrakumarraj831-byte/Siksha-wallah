
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs, doc, updateDoc } from "firebase/firestore";

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
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Inquiry[];
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return [];
  }
}

export async function updateInquiryStatus(id: string, status: InquiryStatus): Promise<void> {
  try {
    const ref = doc(db, INQUIRIES_COLLECTION, id);
    await updateDoc(ref, { status });
  } catch (error) {
    console.error("Error updating inquiry status:", error);
    throw error;
  }
}
