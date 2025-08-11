// Firebase utilities for Koor app
import { auth, db, storage } from './firebase-config.js';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  onSnapshot, 
  arrayUnion, 
  arrayRemove, 
  deleteDoc,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

// --- Collection References ---
const getBusinessesCollectionRef = () => collection(db, 'businesses');
const getUserProfileDocRef = (userId) => doc(db, 'users', userId, 'profile', 'main');
const getUserFavoritesCollectionRef = (userId) => collection(db, 'users', userId, 'favorites');
const getReviewsCollectionRef = () => collection(db, 'reviews');

// --- Authentication Functions ---

/**
 * Sign in with email and password
 */
export async function signInUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Create new user account
 */
export async function createUser(email, password, displayName) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Create user profile
    await setDoc(getUserProfileDocRef(userCredential.user.uid), {
      displayName,
      email,
      favoritesCount: 0,
      reviewsCount: 0,
      visitsCount: 0,
      createdAt: serverTimestamp()
    });
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return { success: true, user: result.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Sign out user
 */
export async function signOutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// --- Business Operations ---

/**
 * Adds a new business to Firestore
 */
export async function addBusiness(businessData, userId) {
  if (!userId) {
    return { success: false, error: 'برای ثبت کسب و کار باید وارد شده باشید.' };
  }

  try {
    const businessRef = await addDoc(getBusinessesCollectionRef(), {
      ...businessData,
      ownerId: userId,
      timestamp: serverTimestamp(),
      isApproved: false // New businesses require approval
    });
    
    return { success: true, id: businessRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Fetches all approved businesses from Firestore
 */
export async function getBusinesses() {
  try {
    const q = query(getBusinessesCollectionRef(), where("isApproved", "==", true));
    const querySnapshot = await getDocs(q);
    const businesses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true, businesses };
  } catch (error) {
    return { success: false, error: error.message, businesses: [] };
  }
}

// --- User Profile Operations ---

/**
 * Fetches a user's profile data from Firestore
 */
export async function getUserProfile(userId) {
  if (!userId) {
    return { success: false, profile: { favoritesCount: 0, reviewsCount: 0, visitsCount: 0 } };
  }

  try {
    const userProfileRef = getUserProfileDocRef(userId);
    const docSnap = await getDoc(userProfileRef);
    
    if (docSnap.exists()) {
      return { success: true, profile: docSnap.data() };
    } else {
      // Create a default profile if it doesn't exist
      const newProfile = {
        favoritesCount: 0,
        reviewsCount: 0,
        visitsCount: 0,
        createdAt: serverTimestamp()
      };
      await setDoc(userProfileRef, newProfile);
      return { success: true, profile: newProfile };
    }
  } catch (error) {
    return { success: false, error: error.message, profile: { favoritesCount: 0, reviewsCount: 0, visitsCount: 0 } };
  }
}

/**
 * Updates user profile data
 */
export async function updateUserProfile(userId, data) {
  try {
    const userProfileRef = getUserProfileDocRef(userId);
    await updateDoc(userProfileRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// --- Favorites Operations ---

/**
 * Toggle favorite status for a place
 */
export async function toggleFavorite(placeId, isFavorite, placeName, userId) {
  try {
    const favoritesRef = getUserFavoritesCollectionRef(userId);
    const placeRef = doc(favoritesRef, placeId);
    
    if (isFavorite) {
      await setDoc(placeRef, {
        placeName,
        addedAt: serverTimestamp()
      });
    } else {
      await deleteDoc(placeRef);
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get user's favorite places
 */
export async function getFavorites(userId) {
  try {
    const favoritesRef = getUserFavoritesCollectionRef(userId);
    const querySnapshot = await getDocs(favoritesRef);
    const favorites = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true, favorites };
  } catch (error) {
    return { success: false, error: error.message, favorites: [] };
  }
}

// --- Reviews Operations ---

/**
 * Add a review for a place
 */
export async function addReview(placeId, rating, text, userId, userName) {
  try {
    const reviewData = {
      placeId,
      rating,
      text,
      userId,
      userName,
      timestamp: serverTimestamp()
    };
    
    await addDoc(getReviewsCollectionRef(), reviewData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get reviews for a specific place
 */
export async function getReviewsForPlace(placeId) {
  try {
    const q = query(getReviewsCollectionRef(), where("placeId", "==", placeId));
    const querySnapshot = await getDocs(q);
    const reviews = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true, reviews };
  } catch (error) {
    return { success: false, error: error.message, reviews: [] };
  }
}

// --- Utility Functions ---

/**
 * Listen to authentication state changes
 */
export function onAuthStateChange(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Get current user
 */
export function getCurrentUser() {
  return auth.currentUser;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return !!auth.currentUser;
}

// Export Firebase instances for direct use
export { auth, db, storage, serverTimestamp, Timestamp };
