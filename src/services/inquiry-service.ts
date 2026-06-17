
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs } from "firebase/firestore";

export interface Inquiry {
  id?: string;
  fullName: string;
  mobile: string;
  email?: string;
  course: string;
  message?: string;
  createdAt?: any;
}

const INQUIRIES_COLLECTION = "inquiries";

export async function saveInquiry(inquiry: Omit<Inquiry, "id" | "createdAt">) {
  try {
    const docRef = await addDoc(collection(db, INQUIRIES_COLLECTION), {
      ...inquiry,
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
