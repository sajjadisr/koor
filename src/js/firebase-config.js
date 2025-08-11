// Firebase configuration for client-side
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "your-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "your-app-id"
};

// Initialize Firebase
let firebaseApp;
let firestore;
let auth;
let storage;

export async function initializeFirebase() {
  try {
    // Initialize Firebase app
    firebaseApp = initializeApp(firebaseConfig);
    
    // Initialize services
    firestore = getFirestore(firebaseApp);
    auth = getAuth(firebaseApp);
    storage = getStorage(firebaseApp);
    
    // Connect to emulators in development
    if (import.meta.env.DEV) {
      try {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
        connectAuthEmulator(auth, 'http://localhost:9099');
        connectStorageEmulator(storage, 'localhost', 9199);
        console.log('Connected to Firebase emulators');
      } catch (error) {
        console.log('Firebase emulators not available, using production services');
      }
    }
    
    console.log('Firebase initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    return false;
  }
}

// Export Firebase instances
export function getFirestoreInstance() {
  if (!firestore) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return firestore;
}

export function getAuthInstance() {
  if (!auth) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return auth;
}

export function getStorageInstance() {
  if (!storage) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return storage;
}

// Export the main Firebase app instance
export function getFirebaseApp() {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return firebaseApp;
}
