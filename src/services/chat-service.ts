import { db } from "@/lib/firebase";
import {
  collection, addDoc, serverTimestamp,
  query, where, onSnapshot, doc, updateDoc, type Unsubscribe,
} from "firebase/firestore";

// In-app student ⇄ counsellor chat. Stored in the "messages" collection on the
// project's own Firebase — no external/third-party chat API. Students read/write
// their own thread via the client SDK (Firestore rules enforce ownership); the
// office replies through the cookie-gated /api/admin/chat route (Admin SDK).

export interface ChatMessage {
  id?: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  sender: "student" | "admin";
  text: string;
  readByAdmin: boolean;
  readByStudent: boolean;
  createdAt?: any;
}

const COLLECTION = "messages";

/** millis for a Firestore timestamp; pending server-timestamps sort last (newest). */
export function msgTime(ts: any): number {
  if (!ts) return Number.MAX_SAFE_INTEGER;
  if (typeof ts === "number") return ts;
  if (typeof ts.toMillis === "function") return ts.toMillis();
  if (typeof ts.toDate === "function") return ts.toDate().getTime();
  return 0;
}

/** Real-time listener for the signed-in student's own conversation.
 *  Single-field `where` only (auto-indexed) — sorting is done in JS so no
 *  composite Firestore index is required. */
export function subscribeMessages(
  studentId: string,
  cb: (messages: ChatMessage[]) => void,
): Unsubscribe {
  const q = query(collection(db, COLLECTION), where("studentId", "==", studentId));
  return onSnapshot(
    q,
    (snap) => {
      const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ChatMessage));
      msgs.sort((a, b) => msgTime(a.createdAt) - msgTime(b.createdAt));
      cb(msgs);
    },
    () => { /* ignore listener errors (e.g. transient permission/network) */ },
  );
}

/** Student sends a message to the counsellor team. */
export async function sendStudentMessage(params: {
  studentId: string;
  studentName: string;
  studentEmail?: string;
  text: string;
}): Promise<void> {
  const text = params.text.trim().slice(0, 2000);
  if (!text) return;
  await addDoc(collection(db, COLLECTION), {
    studentId: params.studentId,
    studentName: params.studentName || "Student",
    studentEmail: params.studentEmail || "",
    sender: "student",
    text,
    readByAdmin: false,
    readByStudent: true,
    createdAt: serverTimestamp(),
  });
}

/** Mark the counsellor's replies as read by the student (clears the unread badge). */
export async function markAdminMessagesRead(messages: ChatMessage[]): Promise<void> {
  const unread = messages.filter((m) => m.sender === "admin" && !m.readByStudent && m.id);
  await Promise.all(
    unread.map((m) =>
      updateDoc(doc(db, COLLECTION, m.id!), { readByStudent: true }).catch(() => {}),
    ),
  );
}
