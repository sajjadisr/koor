/**
 * Google Reviews Integration for Kooreh Platform
 * This file handles all Google Reviews API calls and data processing
 */

class GoogleReviewsManager {
    constructor() {
        this.apiBase = '/api/places';
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Search for places using Google Places API
     * @param {string} query - Search query
     * @param {string} location - Location (optional)
     * @param {number} radius - Search radius in meters (default: 5000)
     * @returns {Promise<Object>} Search results
     */
    async searchPlaces(query, location = null, radius = 5000) {
        try {
            const params = new URLSearchParams({
                query: query,
                radius: radius
            });
            
            if (location) {
                params.append('location', location);
            }

            const response = await fetch(`${this.apiBase}/search?${params}`);
            const data = await response.json();
            
            if (data.success) {
                return data;
            } else {
                throw new Error(data.error || 'Failed to search places');
            }
        } catch (error) {
            console.error('Error searching places:', error);
            throw error;
        }
    }

    /**
     * Get detailed information about a specific place
     * @param {string} placeId - Google Place ID
     * @param {string} fields - Comma-separated fields to retrieve
     * @returns {Promise<Object>} Place details
     */
    async getPlaceDetails(placeId, fields = 'name,rating,reviews,formatted_address,geometry,photos,opening_hours,price_level,types') {
        const cacheKey = `place_${placeId}_${fields}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        try {
            const params = new URLSearchParams({ fields });
            const response = await fetch(`${this.apiBase}/${placeId}?${params}`);
            const data = await response.json();
            
            if (data.success) {
                // Cache the result
                this.cache.set(cacheKey, {
                    data: data,
                    timestamp: Date.now()
                });
                
                return data;
            } else {
                throw new Error(data.error || 'Failed to get place details');
            }
        } catch (error) {
            console.error('Error getting place details:', error);
            throw error;
        }
    }

    /**
     * Get reviews for a specific place
     * @param {string} placeId - Google Place ID
     * @param {number} maxResults - Maximum number of reviews to retrieve
     * @returns {Promise<Object>} Reviews data
     */
    async getPlaceReviews(placeId, maxResults = 20) {
        try {
            const params = new URLSearchParams({ maxResults });
            const response = await fetch(`${this.apiBase}/${placeId}/reviews?${params}`);
            const data = await response.json();
            
            if (data.success) {
                return data;
            } else {
                throw new Error(data.error || 'Failed to get reviews');
            }
        } catch (error) {
            console.error('Error getting reviews:', error);
            throw error;
        }
    }

    /**
     * Get nearby places with reviews
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     * @param {number} radius - Search radius in meters
     * @param {string} type - Place type (optional)
     * @param {string} keyword - Search keyword (optional)
     * @returns {Promise<Object>} Nearby places
     */
    async getNearbyPlaces(lat, lng, radius = 5000, type = null, keyword = null) {
        try {
            const params = new URLSearchParams({
                lat: lat,
                lng: lng,
                radius: radius
            });
            
            if (type) params.append('type', type);
            if (keyword) params.append('keyword', keyword);

            const response = await fetch(`${this.apiBase}/nearby?${params}`);
            const data = await response.json();
            
            if (data.success) {
                return data;
            } else {
                throw new Error(data.error || 'Failed to get nearby places');
            }
        } catch (error) {
            console.error('Error getting nearby places:', error);
            throw error;
        }
    }

    /**
     * Sync Google Reviews with local database
     * @param {string} placeId - Google Place ID
     * @param {boolean} forceUpdate - Force update even if recently synced
     * @returns {Promise<Object>} Sync result
     */
    async syncReviews(placeId, forceUpdate = false) {
        try {
            const response = await fetch(`${this.apiBase}/${placeId}/reviews/sync`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ forceUpdate })
            });
            
            const data = await response.json();
            
            if (data.success) {
                return data;
            } else {
                throw new Error(data.error || 'Failed to sync reviews');
            }
        } catch (error) {
            console.error('Error syncing reviews:', error);
            throw error;
        }
    }

    /**
     * Format Google Review data for display
     * @param {Object} review - Google Review object
     * @returns {Object} Formatted review
     */
    formatReview(review) {
        return {
            id: review.author_name + '_' + review.time,
            author: review.author_name,
            rating: review.rating,
            text: review.text,
            time: this.formatReviewTime(review.time),
            language: review.language || 'en',
            profilePhoto: review.profile_photo_url,
            relativeTime: this.getRelativeTime(review.time)
        };
    }

    /**
     * Format review timestamp
     * @param {number} timestamp - Unix timestamp
     * @returns {string} Formatted date
     */
    formatReviewTime(timestamp) {
        if (!timestamp) return 'Unknown time';
        
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Get relative time (e.g., "2 days ago")
     * @param {number} timestamp - Unix timestamp
     * @returns {string} Relative time string
     */
    getRelativeTime(timestamp) {
        if (!timestamp) return '';
        
        const now = Date.now();
        const reviewTime = timestamp * 1000;
        const diff = now - reviewTime;
        
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);
        
        if (years > 0) return `${years} سال پیش`;
        if (months > 0) return `${months} ماه پیش`;
        if (days > 0) return `${days} روز پیش`;
        if (hours > 0) return `${hours} ساعت پیش`;
        if (minutes > 0) return `${minutes} دقیقه پیش`;
        return 'همین الان';
    }

    /**
     * Generate star rating HTML
     * @param {number} rating - Rating value (0-5)
     * @returns {string} HTML string for stars
     */
    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let starsHTML = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<span class="star full">★</span>';
        }
        
        // Half star
        if (hasHalfStar) {
            starsHTML += '<span class="star half">★</span>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<span class="star empty">☆</span>';
        }
        
        return starsHTML;
    }

    /**
     * Render reviews in the UI
     * @param {Array} reviews - Array of reviews
     * @param {HTMLElement} container - Container element to render reviews
     */
    renderReviews(reviews, container) {
        if (!container) return;
        
        container.innerHTML = '';
        
        if (!reviews || reviews.length === 0) {
            container.innerHTML = '<p class="no-reviews">هیچ نظری یافت نشد</p>';
            return;
        }
        
        reviews.forEach(review => {
            const formattedReview = this.formatReview(review);
            const reviewElement = this.createReviewElement(formattedReview);
            container.appendChild(reviewElement);
        });
    }

    /**
     * Create a review element for the DOM
     * @param {Object} review - Formatted review object
     * @returns {HTMLElement} Review DOM element
     */
    createReviewElement(review) {
        const reviewDiv = document.createElement('div');
        reviewDiv.className = 'google-review';
        reviewDiv.innerHTML = `
            <div class="review-header">
                <div class="reviewer-info">
                    <img src="${review.profilePhoto || '/image/default-avatar.png'}" alt="${review.author}" class="reviewer-avatar">
                    <div class="reviewer-details">
                        <h4 class="reviewer-name">${review.author}</h4>
                        <div class="review-rating">
                            ${this.generateStars(review.rating)}
                            <span class="rating-value">${review.rating}/5</span>
                        </div>
                    </div>
                </div>
                <div class="review-time">
                    <span class="relative-time">${review.relativeTime}</span>
                    <span class="absolute-time">${review.time}</span>
                </div>
            </div>
            <div class="review-content">
                <p class="review-text">${review.text}</p>
            </div>
            <div class="review-footer">
                <span class="review-language">${review.language === 'fa' ? 'فارسی' : 'English'}</span>
                <span class="review-source">Google Reviews</span>
            </div>
        `;
        
        return reviewDiv;
    }

    /**
     * Search and display places with reviews
     * @param {string} query - Search query
     * @param {HTMLElement} resultsContainer - Container for results
     */
    async searchAndDisplayPlaces(query, resultsContainer) {
        try {
            resultsContainer.innerHTML = '<div class="loading">در حال جستجو...</div>';
            
            const searchResults = await this.searchPlaces(query);
            
            if (searchResults.places && searchResults.places.length > 0) {
                this.renderPlacesWithReviews(searchResults.places, resultsContainer);
            } else {
                resultsContainer.innerHTML = '<div class="no-results">مکانی یافت نشد</div>';
            }
        } catch (error) {
            resultsContainer.innerHTML = `<div class="error">خطا در جستجو: ${error.message}</div>`;
        }
    }

    /**
     * Render places with their reviews
     * @param {Array} places - Array of places
     * @param {HTMLElement} container - Container element
     */
    async renderPlacesWithReviews(places, container) {
        container.innerHTML = '';
        
        for (const place of places) {
            const placeElement = await this.createPlaceElement(place);
            container.appendChild(placeElement);
        }
    }

    /**
     * Create a place element with reviews
     * @param {Object} place - Place object
     * @returns {Promise<HTMLElement>} Place DOM element
     */
    async createPlaceElement(place) {
        const placeDiv = document.createElement('div');
        placeDiv.className = 'google-place';
        
        // Get reviews for this place
        let reviews = [];
        try {
            const reviewsData = await this.getPlaceReviews(place.place_id, 5);
            reviews = reviewsData.reviews || [];
        } catch (error) {
            console.warn(`Could not fetch reviews for ${place.name}:`, error);
        }
        
        placeDiv.innerHTML = `
            <div class="place-header">
                <h3 class="place-name">${place.name}</h3>
                <div class="place-rating">
                    ${this.generateStars(place.rating || 0)}
                    <span class="rating-value">${place.rating || 0}/5</span>
                    <span class="total-reviews">(${place.user_ratings_total || 0} نظر)</span>
                </div>
            </div>
            <div class="place-details">
                <p class="place-address">${place.formatted_address || 'آدرس موجود نیست'}</p>
                <p class="place-types">${(place.types || []).join(' • ')}</p>
            </div>
            <div class="place-reviews">
                <h4>آخرین نظرات:</h4>
                <div class="reviews-container">
                    ${reviews.length > 0 ? 
                        reviews.slice(0, 3).map(review => {
                            const formatted = this.formatReview(review);
                            return `
                                <div class="mini-review">
                                    <div class="mini-review-header">
                                        <span class="mini-reviewer">${formatted.author}</span>
                                        <span class="mini-rating">${this.generateStars(formatted.rating)}</span>
                                    </div>
                                    <p class="mini-review-text">${formatted.text.substring(0, 100)}${formatted.text.length > 100 ? '...' : ''}</p>
                                </div>
                            `;
                        }).join('') : 
                        '<p class="no-reviews">هیچ نظری موجود نیست</p>'
                    }
                </div>
                ${reviews.length > 0 ? 
                    `<button class="view-all-reviews" onclick="googleReviewsManager.showAllReviews('${place.place_id}')">
                        مشاهده همه نظرات (${reviews.length})
                    </button>` : ''
                }
            </div>
        `;
        
        return placeDiv;
    }

    /**
     * Show all reviews for a place in a modal
     * @param {string} placeId - Google Place ID
     */
    async showAllReviews(placeId) {
        try {
            const reviewsData = await this.getPlaceReviews(placeId, 50);
            
            if (reviewsData.success && reviewsData.reviews) {
                this.showReviewsModal(reviewsData.reviews, placeId);
            }
        } catch (error) {
            console.error('Error showing all reviews:', error);
            alert('خطا در بارگذاری نظرات');
        }
    }

    /**
     * Show reviews in a modal
     * @param {Array} reviews - Array of reviews
     * @param {string} placeId - Place ID
     */
    showReviewsModal(reviews, placeId) {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'reviews-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>همه نظرات</h2>
                    <button class="close-modal" onclick="this.closest('.reviews-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="reviews-list"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Render reviews
        const reviewsContainer = modal.querySelector('.reviews-list');
        this.renderReviews(reviews, reviewsContainer);
        
        // Add modal styles
        if (!document.querySelector('#reviews-modal-styles')) {
            const styles = document.createElement('style');
            styles.id = 'reviews-modal-styles';
            styles.textContent = `
                .reviews-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .modal-content {
                    background: white;
                    border-radius: 8px;
                    max-width: 800px;
                    max-height: 80vh;
                    overflow-y: auto;
                    width: 90%;
                }
                .modal-header {
                    padding: 20px;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .modal-body {
                    padding: 20px;
                }
                .close-modal {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #666;
                }
                .close-modal:hover {
                    color: #000;
                }
            `;
            document.head.appendChild(styles);
        }
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Get cache statistics
     * @returns {Object} Cache statistics
     */
    getCacheStats() {
        const now = Date.now();
        let validEntries = 0;
        let expiredEntries = 0;
        
        this.cache.forEach((value, key) => {
            if (now - value.timestamp < this.cacheTimeout) {
                validEntries++;
            } else {
                expiredEntries++;
            }
        });
        
        return {
            total: this.cache.size,
            valid: validEntries,
            expired: expiredEntries,
            size: this.cache.size
        };
    }
}

// Create global instance
const googleReviewsManager = new GoogleReviewsManager();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoogleReviewsManager;
}
