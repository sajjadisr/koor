// API service for communicating with the backend
const API_BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:3001';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Search for places
  async searchPlaces(query, category = '', type = 'text') {
    let endpoint = '/api/places/search';
    
    if (type === 'nearby') {
      endpoint = '/api/places/nearby';
    }
    
    const params = new URLSearchParams();
    
    if (type === 'nearby') {
      const [lat, lng] = query.split(',');
      params.append('lat', lat);
      params.append('lng', lng);
    } else {
      params.append('query', query);
    }
    
    if (category) {
      params.append('type', category);
    }
    
    return this.request(`${endpoint}?${params.toString()}`);
  }

  // Get place details
  async getPlaceDetails(placeId) {
    return this.request(`/api/places/${placeId}`);
  }

  // Get place reviews
  async getPlaceReviews(placeId, forceUpdate = false) {
    return this.request(`/api/places/${placeId}/reviews`, {
      method: 'POST',
      body: JSON.stringify({ forceUpdate }),
    });
  }

  // Add a new business
  async addBusiness(businessData) {
    return this.request('/api/businesses', {
      method: 'POST',
      body: JSON.stringify(businessData),
    });
  }

  // Get all businesses
  async getBusinesses() {
    return this.request('/api/businesses');
  }

  // Health check
  async healthCheck() {
    return this.request('/api/health');
  }
}

// Create and export a singleton instance
const apiService = new ApiService();

// Export individual methods for convenience
export const searchPlaces = (query, category, type) => apiService.searchPlaces(query, category, type);
export const getPlaceDetails = (placeId) => apiService.getPlaceDetails(placeId);
export const getPlaceReviews = (placeId, forceUpdate) => apiService.getPlaceReviews(placeId, forceUpdate);
export const addBusiness = (businessData) => apiService.addBusiness(businessData);
export const getBusinesses = () => apiService.getBusinesses();
export const healthCheck = () => apiService.healthCheck();

// Export the service instance for advanced usage
export default apiService;
