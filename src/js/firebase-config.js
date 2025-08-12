// Firebase configuration for client-side
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import config from './config/environment.js';
import logger from './utils/logger.js';

// Firebase configuration from environment
const firebaseConfig = {
  apiKey: config.FIREBASE.API_KEY,
  authDomain: config.FIREBASE.AUTH_DOMAIN,
  projectId: config.FIREBASE.PROJECT_ID,
  storageBucket: config.FIREBASE.STORAGE_BUCKET,
  messagingSenderId: config.FIREBASE.MESSAGING_SENDER_ID,
  appId: config.FIREBASE.APP_ID,
  measurementId: config.FIREBASE.MEASUREMENT_ID
};

// Initialize Firebase
let firebaseApp;
let firestore;
let auth;
let storage;
let analytics;

export async function initializeFirebase() {
  try {
    // Initialize Firebase app
    firebaseApp = initializeApp(firebaseConfig);
    
    // Initialize services
    firestore = getFirestore(firebaseApp);
    auth = getAuth(firebaseApp);
    storage = getStorage(firebaseApp);
    
    // Initialize Analytics (only in production to avoid emulator issues)
    if (config.PROD && config.FEATURES.ANALYTICS) {
      try {
        analytics = getAnalytics(firebaseApp);
        logger.info('Firebase Analytics initialized');
      } catch (error) {
        logger.warn('Analytics not available:', error.message);
      }
    }
    
    // Connect to emulators in development
    if (config.DEV) {
      try {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
        connectAuthEmulator(auth, 'http://localhost:9099');
        connectStorageEmulator(storage, 'localhost', 9199);
        logger.info('Connected to Firebase emulators');
      } catch (error) {
        logger.info('Firebase emulators not available, using production services');
      }
    }
    
    logger.info('Firebase initialized successfully');
    return true;
  } catch (error) {
    logger.error('Failed to initialize Firebase:', error);
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

export function getAnalyticsInstance() {
  if (!analytics) {
    throw new Error('Analytics not available or Firebase not initialized.');
  }
  return analytics;
}

// Export the main Firebase app instance
export function getFirebaseApp() {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return firebaseApp;
}
