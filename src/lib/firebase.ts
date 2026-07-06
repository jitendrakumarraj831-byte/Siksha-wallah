
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, initializeFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth, browserLocalPersistence, setPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app!: FirebaseApp;
let db!: Firestore;
let auth: Auth | null = null;

if (typeof window !== "undefined" && !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  console.warn("Firebase API Key is missing. Check your .env file.");
}

try {
  const alreadyInitialized = getApps().length > 0;
  app = alreadyInitialized ? getApp() : initializeApp(firebaseConfig);
  // Optional fields across the app (e.g. the /apply form) are written as
  // `value || undefined` when left blank. The Firestore SDK rejects `undefined`
  // field values by default (`Unsupported field value: undefined`), which
  // aborts the write client-side before any network call — so it never shows
  // up in Vercel logs, only as a swallowed exception in the submitting page.
  // ignoreUndefinedProperties makes the SDK drop those keys instead of throwing.
  db = alreadyInitialized ? getFirestore(app) : initializeFirestore(app, { ignoreUndefinedProperties: true });
  if (firebaseConfig.apiKey) {
    auth = getAuth(app);
    // Explicitly persist auth state in localStorage so session survives page refreshes.
    if (typeof window !== "undefined") {
      setPersistence(auth, browserLocalPersistence).catch(() => {});
    }
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export { db, auth };
