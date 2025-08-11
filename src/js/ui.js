// UI utilities for displaying results and managing user interface
import { getPlaceDetails, getPlaceReviews } from './api.js';

// Show loading indicator
export function showLoading() {
  const loading = document.getElementById('loading');
  if (loading) {
    loading.style.display = 'flex';
  }
}

// Hide loading indicator
export function hideLoading() {
  const loading = document.getElementById('loading');
  if (loading) {
    loading.style.display = 'none';
  }
}

// Display search results
export function displayResults(results) {
  const resultsContainer = document.getElementById('resultsContainer');
  if (!resultsContainer) return;

  if (!results || results.length === 0) {
    resultsContainer.innerHTML = `
      <div class="no-results">
        <p>No places found. Try adjusting your search criteria.</p>
      </div>
    `;
    return;
  }

  const resultsHTML = results.map(place => createPlaceCard(place)).join('');
  resultsContainer.innerHTML = resultsHTML;

  // Add event listeners to place cards
  addPlaceCardEventListeners();
}

// Create a place card HTML
function createPlaceCard(place) {
  const rating = place.rating || 'N/A';
  const ratingText = place.rating ? `${place.rating}/5` : 'No rating';
  const photo = place.photos && place.photos[0] ? place.photos[0] : '/placeholder-image.jpg';
  
  return `
    <div class="place-card" data-place-id="${place.place_id || place.id}">
      <div class="place-image">
        <img src="${photo}" alt="${place.name}" loading="lazy">
      </div>
      <div class="place-info">
        <h3 class="place-name">${place.name}</h3>
        <p class="place-address">${place.vicinity || place.address || 'Address not available'}</p>
        <div class="place-rating">
          <span class="rating-stars">${generateStarRating(rating)}</span>
          <span class="rating-text">${ratingText}</span>
        </div>
        <div class="place-types">
          ${place.types ? place.types.slice(0, 3).map(type => 
            `<span class="type-tag">${type.replace(/_/g, ' ')}</span>`
          ).join('') : ''}
        </div>
        <div class="place-actions">
          <button class="btn btn-primary btn-sm view-details">View Details</button>
          <button class="btn btn-secondary btn-sm get-directions">Get Directions</button>
        </div>
      </div>
    </div>
  `;
}

// Generate star rating HTML
function generateStarRating(rating) {
  if (!rating || rating === 'N/A') return '☆☆☆☆☆';
  
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(emptyStars);
}

// Add event listeners to place cards
function addPlaceCardEventListeners() {
  const placeCards = document.querySelectorAll('.place-card');
  
  placeCards.forEach(card => {
    const placeId = card.dataset.placeId;
    const viewDetailsBtn = card.querySelector('.view-details');
    const getDirectionsBtn = card.querySelector('.get-directions');
    
    if (viewDetailsBtn) {
      viewDetailsBtn.addEventListener('click', () => showPlaceDetails(placeId));
    }
    
    if (getDirectionsBtn) {
      getDirectionsBtn.addEventListener('click', () => getDirections(placeId));
    }
  });
}

// Show place details modal
async function showPlaceDetails(placeId) {
  try {
    showLoading();
    
    const [placeDetails, reviews] = await Promise.all([
      getPlaceDetails(placeId),
      getPlaceReviews(placeId)
    ]);
    
    createPlaceDetailsModal(placeDetails, reviews);
    
  } catch (error) {
    console.error('Failed to load place details:', error);
    alert('Failed to load place details. Please try again.');
  } finally {
    hideLoading();
  }
}

// Create place details modal
function createPlaceDetailsModal(place, reviews) {
  // Remove existing modal if any
  const existingModal = document.querySelector('.modal');
  if (existingModal) {
    existingModal.remove();
  }
  
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>${place.name}</h2>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        <div class="place-details">
          <div class="place-photos">
            ${place.photos ? place.photos.map(photo => 
              `<img src="${photo}" alt="${place.name}" loading="lazy">`
            ).join('') : '<p>No photos available</p>'}
          </div>
          <div class="place-info-detailed">
            <p><strong>Address:</strong> ${place.vicinity || place.address || 'Not available'}</p>
            <p><strong>Rating:</strong> ${place.rating || 'N/A'}/5 (${place.user_ratings_total || 0} reviews)</p>
            <p><strong>Types:</strong> ${place.types ? place.types.join(', ') : 'Not specified'}</p>
            ${place.opening_hours ? `<p><strong>Open now:</strong> ${place.opening_hours.open_now ? 'Yes' : 'No'}</p>` : ''}
            ${place.price_level ? `<p><strong>Price level:</strong> ${'$'.repeat(place.price_level)}</p>` : ''}
          </div>
        </div>
        <div class="place-reviews">
          <h3>Reviews</h3>
          ${reviews && reviews.length > 0 ? 
            reviews.map(review => `
              <div class="review">
                <div class="review-header">
                  <span class="review-author">${review.author_name}</span>
                  <span class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</span>
                  <span class="review-time">${new Date(review.time * 1000).toLocaleDateString()}</span>
                </div>
                <p class="review-text">${review.text}</p>
              </div>
            `).join('') : '<p>No reviews available</p>'
          }
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add event listeners
  const closeBtn = modal.querySelector('.modal-close');
  closeBtn.addEventListener('click', () => modal.remove());
  
  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
  
  // Show modal
  setTimeout(() => modal.classList.add('show'), 10);
}

// Get directions to a place
function getDirections(placeId) {
  // This would integrate with Google Maps or other mapping service
  alert('Directions feature coming soon!');
}

// Show notification
export function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => notification.classList.add('show'), 10);
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Export for testing
export { createPlaceCard, generateStarRating };
