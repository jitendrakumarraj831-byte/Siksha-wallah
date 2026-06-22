'use client';

import { auth, db } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
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

      // Update last login — non-fatal if the Firestore doc doesn't exist yet
      updateDoc(doc(db, 'users', user.uid), {
        lastLogin: Date.now(),
      }).catch(() => {});

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

  // Send email verification to current user
  async sendVerificationEmail(): Promise<void> {
    if (!auth) throw new Error('Firebase Auth not initialized');
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');
    try {
      await sendEmailVerification(user);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send verification email');
    }
  },
};
