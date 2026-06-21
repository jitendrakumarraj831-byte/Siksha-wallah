'use client';

import { auth, db } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
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

export const authService = {
  // Register new student
  async registerStudent(email: string, password: string, name: string, phone?: string): Promise<User | null> {
    if (!auth) throw new Error('Firebase Auth not initialized');
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile name
      await updateProfile(user, { displayName: name });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email ?? '',
        name: name,
        phone: phone || '',
        role: 'student',
        enrolledCourses: [],
        profileComplete: false,
        createdAt: Date.now(),
        lastLogin: Date.now(),
      } satisfies UserProfile);

      return user;
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  },

  // Login with email and password
  async loginStudent(email: string, password: string): Promise<User | null> {
    if (!auth) throw new Error('Firebase Auth not initialized');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update last login
      await updateDoc(doc(db, 'users', user.uid), {
        lastLogin: Date.now(),
      });

      return user;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
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

  // Send password reset email
  async sendPasswordReset(email: string): Promise<void> {
    if (!auth) throw new Error('Firebase Auth not initialized');
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(error.message || 'Password reset failed');
    }
  },

  // Get user profile
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const docSnap = await getDoc(doc(db, 'users', uid));
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
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

  // Send OTP to phone number (format: +91XXXXXXXXXX)
  async sendOTP(phoneNumber: string, recaptchaVerifier: RecaptchaVerifier): Promise<ConfirmationResult> {
    if (!auth) throw new Error('Firebase Auth not initialized');
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      return confirmationResult;
    } catch (error: any) {
      throw new Error(error.message || 'OTP भेजने में error आई');
    }
  },

  // Verify OTP and sign in — auto-creates Firestore user doc if new
  async verifyOTP(confirmationResult: ConfirmationResult, code: string): Promise<User> {
    try {
      const credential = await confirmationResult.confirm(code);
      const user = credential.user;

      // Create user doc in Firestore if this is a new sign-in
      const docSnap = await getDoc(doc(db, 'users', user.uid));
      if (!docSnap.exists()) {
        const lastName4 = user.phoneNumber?.slice(-4) ?? '0000';
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email || '',
          name: user.displayName || `Student ${lastName4}`,
          phone: user.phoneNumber || '',
          role: 'student',
          enrolledCourses: [],
          profileComplete: false,
          createdAt: Date.now(),
          lastLogin: Date.now(),
        } satisfies UserProfile);
      } else {
        await updateDoc(doc(db, 'users', user.uid), { lastLogin: Date.now() });
      }

      return user;
    } catch (error: any) {
      throw new Error(error.message || 'OTP verification failed');
    }
  },
};
