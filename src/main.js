// Main application entry point
import './style/main.css';
import { initializeApp } from './js/app.js';
import { initializeFirebase } from './js/firebase-config.js';

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Initialize Firebase first
    await initializeFirebase();
    
    // Then initialize the main app
    initializeApp();
    
    console.log('Kooreh application initialized successfully');
  } catch (error) {
    console.error('Failed to initialize application:', error);
  }
});
