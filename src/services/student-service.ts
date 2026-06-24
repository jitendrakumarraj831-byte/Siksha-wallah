import { db, storage } from '@/lib/firebase';
import {
  doc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  addDoc,
  getDoc,
  deleteDoc,
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

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

      const ext = file.name.split('.').pop() ?? 'bin';
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
            const docRef = await addDoc(collection(db, 'documents'), {
              uid,
              name: docName,
              type: docType,
              url,
              storagePath,
              fileSize: file.size,
              mimeType: file.type,
              uploadedAt: Date.now(),
            } satisfies Omit<Document, 'id'>);
            resolve(docRef.id);
          } catch (err: any) {
            reject(new Error(err.message));
          }
        },
      );
    });
  },

  async getDocuments(uid: string): Promise<Document[]> {
    try {
      const q = query(collection(db, 'documents'), where('uid', '==', uid));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Document));
    } catch (error: any) {
      throw new Error(`Failed to fetch documents: ${error.message}`);
    }
  },

  async deleteDocument(docId: string, storagePath?: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'documents', docId));
      if (storagePath && storage) {
        await deleteObject(ref(storage, storagePath)).catch(() => {});
      }
    } catch (error: any) {
      throw new Error(`Failed to delete document: ${error.message}`);
    }
  },
};
