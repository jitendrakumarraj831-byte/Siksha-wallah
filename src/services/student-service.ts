import { db, auth } from '@/lib/firebase';
import {
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
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
  publicId?: string;
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
    // Mobile browsers often leave file.type empty — infer a sensible MIME type
    // from the filename extension so the saved metadata stays accurate.
    const inferMimeFromName = (name: string): string => {
      const n = name.toLowerCase();
      if (n.endsWith('.pdf')) return 'application/pdf';
      if (n.endsWith('.png')) return 'image/png';
      if (n.endsWith('.jpg') || n.endsWith('.jpeg')) return 'image/jpeg';
      return '';
    };
    const mimeType = file.type || inferMimeFromName(file.name);

    return new Promise((resolve, reject) => {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        reject(new Error('Cloudinary is not configured. Check environment variables.'));
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', `documents/${uid}`);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100);
          onProgress?.(pct);
        }
      });

      xhr.addEventListener('load', async () => {
        try {
          if (xhr.status < 200 || xhr.status >= 300) {
            let errMsg = `Cloudinary upload failed (HTTP ${xhr.status})`;
            try {
              const errBody = JSON.parse(xhr.responseText);
              if (errBody?.error?.message) errMsg = `Cloudinary: ${errBody.error.message}`;
            } catch {}
            throw new Error(errMsg);
          }
          const result = JSON.parse(xhr.responseText);
          const url: string = result.secure_url;
          const publicId: string = result.public_id;
          // resource_type is 'image' for jpg/png, 'raw' for pdf (when preset uses auto)
          const resourceType: string = result.resource_type || 'image';

          const token = auth?.currentUser ? await getIdToken(auth.currentUser) : null;
          const res = await fetch('/api/student/documents', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              uid, name: docName, type: docType, url,
              publicId, resourceType, fileSize: file.size, mimeType,
            }),
          });
          const json = await res.json();
          if (!res.ok) throw new Error(json.error || 'Upload failed');
          resolve(json.id);
        } catch (err: any) {
          reject(new Error(err.message));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      // Use /auto/upload so Cloudinary correctly handles both images and PDFs
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`);
      xhr.send(formData);
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

  async deleteDocument(docId: string, uid: string, publicId?: string): Promise<void> {
    try {
      const token = auth?.currentUser ? await getIdToken(auth.currentUser) : null;
      const res = await fetch(`/api/student/documents?id=${docId}&uid=${uid}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicId: publicId || null }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || 'Failed to delete document');
      }
    } catch (error: any) {
      throw new Error(`Failed to delete document: ${error.message}`);
    }
  },
};
