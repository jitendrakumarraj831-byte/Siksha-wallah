import { db, storage, auth } from '@/lib/firebase';
import {
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { getIdToken } from 'firebase/auth';

export interface StudentProfile {
  uid: string;
  email: string;
  name: string;
  phone: string;
  qualification?: string;
  address?: string;
  profileComplete: boolean;
  updatedAt?: number;
  createdAt?: number;
  lastLogin?: number;
  role?: string;
}

export type DocumentVerificationStatus = 'pending' | 'approved' | 'rejected';

export interface Document {
  id?: string;
  uid: string;
  name: string;
  type: string;
  url: string;
  storagePath?: string;
  fileSize?: number;
  mimeType?: string;
  uploadedAt: number;
  status?: DocumentVerificationStatus;
  remarks?: string;
  verifiedAt?: number;
  verifiedBy?: string;
}

export const studentService = {
  async getProfile(uid: string): Promise<StudentProfile | null> {
    try {
      const docSnap = await getDoc(doc(db, 'users', uid));
      if (docSnap.exists()) return docSnap.data() as StudentProfile;
      return null;
    } catch (error: any) {
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }
  },

  async updateProfile(uid: string, updates: Partial<StudentProfile>): Promise<void> {
    try {
      await setDoc(doc(db, 'users', uid), {
        ...updates,
        uid,
        updatedAt: Date.now(),
        profileComplete: true,
      }, { merge: true });
    } catch (error: any) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  },

  uploadDocumentFile(
    uid: string,
    file: File,
    docName: string,
    docType: string,
    onProgress?: (percent: number) => void,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!storage) {
        reject(new Error('Firebase Storage is not initialized'));
        return;
      }

      const mimeToExt: Record<string, string> = {
        'application/pdf': 'pdf',
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/png': 'png',
      };
      const ext = mimeToExt[file.type] ?? (file.name.split('.').pop() || 'bin');
      const storagePath = `documents/${uid}/${Date.now()}_${docType}.${ext}`;
      const storageRef = ref(storage, storagePath);
      const task = uploadBytesResumable(storageRef, file, { contentType: file.type });

      task.on(
        'state_changed',
        (snapshot) => {
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          onProgress?.(pct);
        },
        (error) => reject(new Error(error.message)),
        async () => {
          try {
            const url = await getDownloadURL(task.snapshot.ref);
            // Save metadata via server API (bypasses Firestore client rules)
            const token = auth?.currentUser ? await getIdToken(auth.currentUser) : null;
            const res = await fetch('/api/student/documents', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify({
                uid, name: docName, type: docType, url,
                storagePath, fileSize: file.size, mimeType: file.type,
              }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || 'Upload failed');
            resolve(json.id);
          } catch (err: any) {
            reject(new Error(err.message));
          }
        },
      );
    });
  },

  async getDocuments(uid: string): Promise<Document[]> {
    try {
      const token = auth?.currentUser ? await getIdToken(auth.currentUser) : null;
      const res = await fetch(`/api/student/documents?uid=${uid}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || 'Failed to fetch documents');
      }
      const json = await res.json();
      return json.data as Document[];
    } catch (error: any) {
      throw new Error(`Failed to fetch documents: ${error.message}`);
    }
  },

  async deleteDocument(docId: string, uid: string, storagePath?: string): Promise<void> {
    try {
      const token = auth?.currentUser ? await getIdToken(auth.currentUser) : null;
      const res = await fetch(`/api/student/documents?id=${docId}&uid=${uid}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || 'Failed to delete document');
      }
      if (storagePath && storage) {
        await deleteObject(ref(storage, storagePath)).catch(() => {});
      }
    } catch (error: any) {
      throw new Error(`Failed to delete document: ${error.message}`);
    }
  },
};
