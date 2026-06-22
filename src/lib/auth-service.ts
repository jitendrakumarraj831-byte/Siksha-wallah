'use client';

import { auth, db } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  sendEmailVerification,
  User,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  phone?: string;
  role: 'student' | 'admin' | 'counselor';
  enrolledCourses?: string[];
  profileComplete: boolean;
  createdAt: number;
  lastLogin?: number;
}

function friendlyAuthError(code: string): string {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password. Please check and try again.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'Your account has been disabled. Please contact our support team.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in instead.';
    case 'auth/weak-password':
      return 'Your password must be at least 6 characters long.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a few minutes and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled. Please try again.';
    case 'auth/unauthorized-continue-uri':
    case 'auth/invalid-continue-uri':
      return 'Configuration error. Please contact our support team.';
    default:
      return 'Something went wrong. Please try again or contact our team.';
  }
}

// Fire-and-forget POST helper — never throws, never blocks the caller.
function fireEmail(path: string, body: Record<string, string>): void {
  fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).catch(() => {});
}

export const authService = {
  // Register new student
  async registerStudent(email: string, password: string, name: string, phone?: string): Promise<User | null> {
    if (!auth) throw new Error('Firebase Auth not initialized');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email ?? '',
        name,
        phone: phone || '',
        role: 'student',
        enrolledCourses: [],
        profileComplete: false,
        createdAt: Date.now(),
        lastLogin: Date.now(),
      } satisfies UserProfile);

      // Send branded welcome + verification emails (non-blocking)
      fireEmail('/api/auth/welcome', { name, email: user.email ?? email });
      fireEmail('/api/auth/send-verification', { name, email: user.email ?? email });

      return user;
    } catch (error: any) {
      throw new Error(friendlyAuthError(error.code));
    }
  },

  // Login with email and password
  async loginStudent(email: string, password: string): Promise<User | null> {
    if (!auth) throw new Error('Firebase Auth not initialized');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      updateDoc(doc(db, 'users', user.uid), {
        lastLogin: Date.now(),
      }).catch(() => {});

      return user;
    } catch (error: any) {
      throw new Error(friendlyAuthError(error.code));
    }
  },

  // Logout
  async logout(): Promise<void> {
    if (!auth) throw new Error('Firebase Auth not initialized');
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message || 'Logout failed');
    }
  },

  // Send password reset email.
  // Tries Titan SMTP API route first; falls back to Firebase's own sender
  // if the server route is unavailable or not yet configured.
  async sendPasswordReset(email: string): Promise<void> {
    try {
      const res = await fetch('/api/auth/send-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) return;
      if (res.status === 400 || res.status === 429) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Could not send reset email. Please try again.');
      }
      // 5xx = SMTP not configured — fall through to Firebase fallback
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) throw err;
    }

    // Fallback: Firebase built-in sender (slower but always works).
    // Always use the canonical production URL so Firebase's authorized-domain
    // check passes even on preview deployments like *.vercel.app.
    if (!auth) throw new Error('Firebase Auth not initialized');
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
      || (typeof window !== 'undefined' ? window.location.origin : '');
    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${siteUrl}/auth/login`,
        handleCodeInApp: true,
      });
    } catch (error: any) {
      throw new Error(friendlyAuthError(error.code));
    }
  },

  // Complete password reset with oobCode from email link
  async confirmPasswordReset(oobCode: string, newPassword: string): Promise<void> {
    if (!auth) throw new Error('Firebase Auth not initialized');
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
    } catch (error: any) {
      throw new Error(friendlyAuthError(error.code));
    }
  },

  // Get user profile
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const docSnap = await getDoc(doc(db, 'users', uid));
      if (docSnap.exists()) return docSnap.data() as UserProfile;
      return null;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch user profile');
    }
  },

  // Update user profile
  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', uid), updates);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update profile');
    }
  },

  // Get current auth user
  getCurrentUser(): User | null {
    if (!auth) return null;
    return auth.currentUser;
  },

  // Resend email verification — tries Titan SMTP route, falls back to Firebase.
  async sendVerificationEmail(): Promise<void> {
    if (!auth) throw new Error('Firebase Auth not initialized');
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    try {
      const res = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email ?? '',
          name: user.displayName ?? 'Student',
        }),
      });
      if (res.ok) return;
      if (res.status === 400 || res.status === 429) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to send verification email.');
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) throw err;
    }

    // Fallback: Firebase built-in
    try {
      await sendEmailVerification(user);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send verification email');
    }
  },
};
