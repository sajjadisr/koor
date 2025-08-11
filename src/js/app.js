// Main application logic
import { searchPlaces, getPlaceDetails } from './api.js';
import { displayResults, showLoading, hideLoading } from './ui.js';
import { initializeMaps } from './maps.js';

export function initializeApp() {
  console.log('Initializing Koor application...');
  
  // Initialize event listeners
  initializeEventListeners();
  
  // Initialize maps if available
  initializeMaps();
  
  console.log('Koor application initialized successfully');
}

function initializeEventListeners() {
  // Search form submission
  const searchForm = document.getElementById('searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', handleSearch);
  }
  
  // Search button click
  const searchBtn = document.getElementById('searchBtn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      document.getElementById('search').scrollIntoView({ behavior: 'smooth' });
    });
  }
  
  // Explore button click
  const exploreBtn = document.getElementById('exploreBtn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', handleExplore);
  }
  
  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

async function handleSearch(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const location = formData.get('location');
  const category = formData.get('category');
  
  if (!location.trim()) {
    alert('Please enter a location');
    return;
  }
  
  try {
    showLoading();
    
    // Search for places
    const results = await searchPlaces(location, category);
    
    // Display results
    displayResults(results);
    
    // Show results section
    const resultsSection = document.getElementById('results');
    if (resultsSection) {
      resultsSection.style.display = 'block';
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
    
  } catch (error) {
    console.error('Search failed:', error);
    alert('Search failed. Please try again.');
  } finally {
    hideLoading();
  }
}

async function handleExplore() {
  try {
    showLoading();
    
    // Get user's current location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Search for nearby places
          const results = await searchPlaces(`${latitude},${longitude}`, '', 'nearby');
          
          // Display results
          displayResults(results);
          
          // Show results section
          const resultsSection = document.getElementById('results');
          if (resultsSection) {
            resultsSection.style.display = 'block';
            resultsSection.scrollIntoView({ behavior: 'smooth' });
          }
          
          hideLoading();
        },
        (error) => {
          console.error('Geolocation error:', error);
          hideLoading();
          alert('Unable to get your location. Please enter a location manually.');
        }
      );
    } else {
      hideLoading();
      alert('Geolocation is not supported by your browser. Please enter a location manually.');
    }
  } catch (error) {
    console.error('Explore failed:', error);
    hideLoading();
    alert('Explore failed. Please try again.');
  }
}

// Export for testing
export { handleSearch, handleExplore };
