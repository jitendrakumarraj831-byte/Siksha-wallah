'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { UserProfile, authService } from '@/lib/auth-service';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshUserProfile: (uid: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    // Tracks the most recent uid seen so a slower, older callback can't
    // overwrite state with stale data after a newer one has already resolved.
    let latestUid: string | null = null;

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      latestUid = firebaseUser?.uid ?? null;
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const profile = await authService.getUserProfile(firebaseUser.uid);
          if (latestUid === firebaseUser.uid) setUserProfile(profile);
        } catch (error) {
          console.error('Failed to load user profile:', error);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      if (latestUid === (firebaseUser?.uid ?? null)) setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setUserProfile(null);
  };

  const refreshUserProfile = async (uid: string) => {
    const profile = await authService.getUserProfile(uid);
    setUserProfile(profile);
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    isAuthenticated: !!user,
    logout,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
