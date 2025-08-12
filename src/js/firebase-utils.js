// Firebase utility functions for common operations
import { 
  getFirestoreInstance, 
  getAuthInstance, 
  getStorageInstance,
  getAnalyticsInstance 
} from './firebase-config.js';

// Firestore utilities
export async function addDocument(collectionName, data) {
  try {
    const db = getFirestoreInstance();
    const { addDoc, collection } = await import('firebase/firestore');
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Failed to add document:', error);
    return { success: false, error: error.message };
  }
}

export async function getDocuments(collectionName, limit = 10) {
  try {
    const db = getFirestoreInstance();
    const { getDocs, collection, query, orderBy, limit: limitQuery } = await import('firebase/firestore');
    const q = query(
      collection(db, collectionName),
      orderBy('createdAt', 'desc'),
      limitQuery(limit)
    );
    const querySnapshot = await getDocs(q);
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: documents };
  } catch (error) {
    console.error('Failed to get documents:', error);
    return { success: false, error: error.message };
  }
}

// Analytics utilities
export function trackEvent(eventName, parameters = {}) {
  try {
    const analytics = getAnalyticsInstance();
    if (analytics) {
      // You can implement custom analytics tracking here
      console.log('Analytics event tracked:', eventName, parameters);
    }
  } catch (error) {
    console.log('Analytics not available:', error.message);
  }
}

// Auth utilities
export function getCurrentUser() {
  try {
    const auth = getAuthInstance();
    return auth.currentUser;
  } catch (error) {
    console.log('Auth not available:', error.message);
    return null;
  }
}

export function isUserLoggedIn() {
  const user = getCurrentUser();
  return user !== null;
}

// Storage utilities
export async function uploadFile(file, path) {
  try {
    const storage = getStorageInstance();
    const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
    
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return { success: true, url: downloadURL };
  } catch (error) {
    console.error('Failed to upload file:', error);
    return { success: false, error: error.message };
  }
}

// Search tracking utility
export async function trackSearch(location, category, resultCount) {
  try {
    // Track in Analytics
    trackEvent('search_performed', { location, category, resultCount });
    
    // Store in Firestore
    const searchData = {
      location,
      category: category || 'all',
      resultCount,
      userId: getCurrentUser()?.uid || 'anonymous'
    };
    
    await addDocument('searches', searchData);
    return { success: true };
  } catch (error) {
    console.log('Search tracking failed:', error.message);
    return { success: false, error: error.message };
  }
}
