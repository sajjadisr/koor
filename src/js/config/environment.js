/**
 * Environment configuration for Kooreh application
 * Centralizes all environment-specific configuration
 */

const config = {
  // Server Configuration
  NODE_ENV: import.meta.env.MODE || 'development',
  PORT: import.meta.env.VITE_PORT || 3001,
  
  // Firebase Configuration
  FIREBASE: {
    API_KEY: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBUhFYpviZSDd-XjplnEuJgQEKOVQ9O0dE",
    AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "koreh-d4a98.firebaseapp.com",
    PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID || "koreh-d4a98",
    STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "koreh-d4a98.firebasestorage.app",
    MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "690624738272",
    APP_ID: import.meta.env.VITE_FIREBASE_APP_ID || "1:690624738272:web:75847121f6900bbaeaf185",
    MEASUREMENT_ID: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-R5CSK0QBK5"
  },
  
  // Google APIs
  GOOGLE: {
    API_KEY: import.meta.env.VITE_GOOGLE_API_KEY || '',
    MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  },
  
  // Logging
  LOG_LEVEL: parseInt(import.meta.env.VITE_LOG_LEVEL || '2'),
  
  // Feature Flags
  FEATURES: {
    ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS !== 'false',
    MAPS: import.meta.env.VITE_ENABLE_MAPS !== 'false',
    REVIEWS: import.meta.env.VITE_ENABLE_REVIEWS !== 'false',
    PWA: import.meta.env.VITE_ENABLE_PWA !== 'false'
  },
  
  // API Endpoints
  API: {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
    TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000')
  },
  
  // Development
  DEV: import.meta.env.DEV || false,
  PROD: import.meta.env.PROD || false
};

// Validation
const requiredConfigs = [
  'FIREBASE.API_KEY',
  'FIREBASE.PROJECT_ID'
];

requiredConfigs.forEach(configPath => {
  const value = configPath.split('.').reduce((obj, key) => obj?.[key], config);
  if (!value) {
    console.warn(`Missing required configuration: ${configPath}`);
  }
});

// Helper functions
export const isDevelopment = () => config.DEV;
export const isProduction = () => config.PROD;
export const getFirebaseConfig = () => config.FIREBASE;
export const getGoogleConfig = () => config.GOOGLE;
export const getFeatureFlag = (feature) => config.FEATURES[feature] || false;

export default config;
