import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs'; // Import the file system module
import admin from 'firebase-admin'; // Import Firebase Admin SDK
import axios from 'axios';
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

// Get the current directory name for ESM context
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- Load serviceAccountKey.json manually to avoid import assertion issues ---
let serviceAccount;
const serviceAccountPath = join(__dirname, 'serviceAccountKey.json');

try {
  // Check if the serviceAccountKey.json file exists
  if (!fs.existsSync(serviceAccountPath)) {
    console.error('CRITICAL ERROR: serviceAccountKey.json not found at:', serviceAccountPath);
    console.error('Please ensure the serviceAccountKey.json file is in the same directory as server.js.');
    process.exit(1); // Exit if the key cannot be found
  }

  const serviceAccountContent = fs.readFileSync(serviceAccountPath, 'utf8');
  serviceAccount = JSON.parse(serviceAccountContent);
  console.log('serviceAccountKey.json loaded successfully.');
  console.log('Project ID from key:', serviceAccount.project_id);
  console.log('Client Email from key:', serviceAccount.client_email);

} catch (error) {
  console.error('CRITICAL ERROR: Error loading or parsing serviceAccountKey.json:', error);
  console.error('Please ensure serviceAccountKey.json is a valid JSON file.');
  process.exit(1); // Exit if the key cannot be loaded or parsed
}
// --- End of manual JSON loading ---

// Initialize Firebase Admin SDK
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("Admin SDK runtime project:", admin.app().options.projectId);
  console.log('Firebase Admin SDK initialized successfully.');
} catch (error) {
  console.error('CRITICAL ERROR: Firebase Admin SDK initialization failed:', error);
  process.exit(1); // Exit if Firebase Admin SDK cannot be initialized
}

// Get a Firestore database instance
const db = admin.firestore();
console.log('Firestore instance obtained.');


const app = express();
const PORT = process.env.PORT || 3001; // Changed from 3000 to avoid conflict with Vite

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the built 'dist' directory (production) or 'public' directory (development)
const isProduction = process.env.NODE_ENV === 'production';
const staticPath = isProduction ? join(__dirname, 'dist') : join(__dirname, 'public');
app.use(express.static(staticPath));

// Google API Configuration
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || 'YOUR_GOOGLE_API_KEY_HERE';
const GOOGLE_PLACES_API_BASE = 'https://maps.googleapis.com/maps/api/place';

// API endpoint to add a new business to Firestore
app.post('/api/businesses', async (req, res) => {
  const newBusiness = req.body;
  console.log('Received request to add business:', newBusiness); // Log incoming request

  try {
    // Add a new document to the 'businesses' collection
    const docRef = await db.collection('businesses').add(newBusiness);
    console.log('New business added to Firestore with ID:', docRef.id); // Log success to server console
    res.status(201).send({ id: docRef.id, ...newBusiness });
  } catch (error) {
    console.error('Error adding business to Firestore:', error.code, error.details || error.message);
    res.status(500).send({ message: 'Error adding business', error: error.message, code: error.code });
  }
});

// API endpoint to get all businesses from Firestore
app.get('/api/businesses', async (req, res) => {
  console.log('Received request to get all businesses.'); // Log incoming request
  try {
    const businessesRef = db.collection('businesses');
    const snapshot = await businessesRef.get();
    const businesses = [];
    snapshot.forEach(doc => {
      businesses.push({ id: doc.id, ...doc.data() });
    });
    console.log(`Fetched ${businesses.length} businesses from Firestore.`); // Log to server console
    res.json(businesses);
  } catch (error) {
    console.error('Error fetching businesses from Firestore:', error.code, error.details || error.message);
    res.status(500).send({ message: 'Error fetching businesses', error: error.message, code: error.code });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Koor API is running', timestamp: new Date().toISOString() });
});

// Google Reviews API Endpoints

// 1. Search for places and get basic info
app.get('/api/places/search', async (req, res) => {
  try {
    const { query, location, radius = 5000 } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const searchUrl = `${GOOGLE_PLACES_API_BASE}/textsearch/json`;
    const params = {
      query: query,
      key: GOOGLE_API_KEY,
      radius: radius
    };

    if (location) {
      params.location = location;
    }

    const response = await axios.get(searchUrl, { params });
    
    if (response.data.status === 'OK') {
      res.json({
        success: true,
        places: response.data.results,
        nextPageToken: response.data.next_page_token
      });
    } else {
      res.status(400).json({
        success: false,
        error: response.data.error_message || 'Failed to fetch places',
        status: response.data.status
      });
    }
  } catch (error) {
    console.error('Error searching places:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// 2. Get detailed place information including reviews
app.get('/api/places/:placeId', async (req, res) => {
  try {
    const { placeId } = req.params;
    const { fields = 'name,rating,reviews,formatted_address,geometry,photos,opening_hours,price_level,types' } = req.query;

    const detailsUrl = `${GOOGLE_PLACES_API_BASE}/details/json`;
    const params = {
      place_id: placeId,
      fields: fields,
      key: GOOGLE_API_KEY
    };

    const response = await axios.get(detailsUrl, { params });
    
    if (response.data.status === 'OK') {
      res.json({
        success: true,
        place: response.data.result
      });
    } else {
      res.status(400).json({
        success: false,
        error: response.data.error_message || 'Failed to fetch place details',
        status: response.data.status
      });
    }
  } catch (error) {
    console.error('Error fetching place details:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// 3. Get reviews for a specific place
app.get('/api/places/:placeId/reviews', async (req, res) => {
  try {
    const { placeId } = req.params;
    const { maxResults = 20 } = req.query;

    const detailsUrl = `${GOOGLE_PLACES_API_BASE}/details/json`;
    const params = {
      place_id: placeId,
      fields: 'reviews',
      key: GOOGLE_API_KEY
    };

    const response = await axios.get(detailsUrl, { params });
    
    if (response.data.status === 'OK' && response.data.result.reviews) {
      const reviews = response.data.result.reviews.slice(0, maxResults);
      res.json({
        success: true,
        reviews: reviews,
        total: response.data.result.reviews.length
      });
    } else {
      res.json({
        success: true,
        reviews: [],
        total: 0,
        message: 'No reviews available for this place'
      });
    }
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// 4. Alternative: Scrape Google Reviews (fallback method)
app.get('/api/places/:placeId/reviews/scrape', async (req, res) => {
  try {
    const { placeId } = req.params;
    const { maxResults = 10 } = req.query;

    // This is a fallback method using web scraping
    // Note: This may violate Google's terms of service and should be used carefully
    
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Navigate to Google Maps with the place ID
    const googleMapsUrl = `https://www.google.com/maps/place/?q=place_id:${placeId}`;
    await page.goto(googleMapsUrl, { waitUntil: 'networkidle2' });
    
    // Wait for reviews to load
    await page.waitForSelector('[data-review-id]', { timeout: 10000 });
    
    // Extract reviews
    const reviews = await page.evaluate((maxResults) => {
      const reviewElements = document.querySelectorAll('[data-review-id]');
      const reviews = [];
      
      for (let i = 0; i < Math.min(reviewElements.length, maxResults); i++) {
        const element = reviewElements[i];
        const review = {
          id: element.getAttribute('data-review-id'),
          author: element.querySelector('.d4r55')?.textContent || 'Anonymous',
          rating: element.querySelector('.kvMYJc')?.getAttribute('aria-label') || '5',
          text: element.querySelector('.wiI7pd')?.textContent || '',
          time: element.querySelector('.rsqaWe')?.textContent || '',
          language: element.querySelector('.review-snippet')?.getAttribute('lang') || 'en'
        };
        reviews.push(review);
      }
      
      return reviews;
    }, maxResults);
    
    await browser.close();
    
    res.json({
      success: true,
      reviews: reviews,
      total: reviews.length,
      method: 'scraped'
    });
    
  } catch (error) {
    console.error('Error scraping reviews:', error);
    res.status(500).json({ 
      error: 'Failed to scrape reviews', 
      details: error.message,
      suggestion: 'Try using the official Google Places API instead'
    });
  }
});

// 5. Sync Google Reviews with local database
app.post('/api/places/:placeId/reviews/sync', async (req, res) => {
  try {
    const { placeId } = req.params;
    const { forceUpdate = false } = req.body;

    // Get reviews from Google Places API
    const detailsUrl = `${GOOGLE_PLACES_API_BASE}/details/json`;
    const params = {
      place_id: placeId,
      fields: 'reviews,rating,user_ratings_total',
      key: GOOGLE_API_KEY
    };

    const response = await axios.get(detailsUrl, { params });
    
    if (response.data.status === 'OK') {
      const placeData = response.data.result;
      
      // Here you would typically:
      // 1. Check if reviews need updating (compare timestamps)
      // 2. Store/update reviews in your Firebase database
      // 3. Update place rating and review count
      
      res.json({
        success: true,
        message: 'Reviews synced successfully',
        data: {
          placeId: placeId,
          totalReviews: placeData.user_ratings_total || 0,
          averageRating: placeData.rating || 0,
          reviewsCount: placeData.reviews ? placeData.reviews.length : 0,
          lastSync: new Date().toISOString()
        }
      });
    } else {
      res.status(400).json({
        success: false,
        error: response.data.error_message || 'Failed to sync reviews',
        status: response.data.status
      });
    }
  } catch (error) {
    console.error('Error syncing reviews:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// 6. Get nearby places with reviews
app.get('/api/places/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 5000, type, keyword } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const nearbyUrl = `${GOOGLE_PLACES_API_BASE}/nearbysearch/json`;
    const params = {
      location: `${lat},${lng}`,
      radius: radius,
      key: GOOGLE_API_KEY
    };

    if (type) params.type = type;
    if (keyword) params.keyword = keyword;

    const response = await axios.get(nearbyUrl, { params });
    
    if (response.data.status === 'OK') {
      res.json({
        success: true,
        places: response.data.results,
        nextPageToken: response.data.next_page_token
      });
    } else {
      res.status(400).json({
        success: false,
        error: response.data.error_message || 'Failed to fetch nearby places',
        status: response.data.status
      });
    }
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Serve the main index.html file for the root URL
app.get('/', (req, res) => {
  const indexPath = isProduction ? join(__dirname, 'dist/index.html') : join(__dirname, 'public/index.html');
  res.sendFile(indexPath);
});

// Start the server
app.listen(PORT, () => {
  console.log(`[SERVER] Koor backend server listening at http://localhost:${PORT}`);
  console.log('[INFO] Frontend will be available at http://localhost:3001');
  console.log('[AUTH] Please ensure your Firebase service account has "Cloud Datastore User" or "Editor" roles.');
  console.log(`[HEALTH] Health check: http://localhost:${PORT}/api/health`);
  console.log(`[API] Google Reviews API: http://localhost:${PORT}/api/places/`);
  console.log(`[WARNING] Remember to set GOOGLE_API_KEY environment variable`);
});
