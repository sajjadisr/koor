// Firebase configuration for Koor app
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUhFYpviZSDd-XjplnEuJgQEKOVQ9O0dE",
  authDomain: "koreh-d4a98.firebaseapp.com",
  projectId: "koreh-d4a98",
  storageBucket: "koreh-d4a98.firebasestorage.app",
  messagingSenderId: "690624738272",
  appId: "1:690624738272:web:75847121f6900bbaeaf185",
  measurementId: "G-R5CSK0QBK5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Firebase AI (Gemini) services
const ai = getAI(app, { backend: new GoogleAIBackend() });
const geminiModel = getGenerativeModel(ai, { model: "gemini-2.5-flash" });

// Export for use in other modules
export { app, analytics, auth, db, storage, ai, geminiModel };
export default app;
