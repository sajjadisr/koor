// Neshan Maps Configuration
// Configuration file for Neshan Maps API integration

const NESHAN_CONFIG = {
    // API Base URLs
    BASE_URL: 'https://api.neshan.org',
    TILES_URL: 'https://tiles.neshan.org',
    
    // API Endpoints
    ENDPOINTS: {
        SEARCH: '/v1/search',
        REVERSE_GEOCODE: '/v1/reverse',
        DIRECTIONS: '/v1/directions',
        PLACES: '/v1/places',
        DISTANCE: '/v1/distance'
    },
    
    // Default Map Settings
    DEFAULT_CENTER: [35.689, 51.389], // Tehran, Iran
    DEFAULT_ZOOM: 11,
    MAX_ZOOM: 18,
    MIN_ZOOM: 3,
    
    // Tile Layer Settings
    TILE_LAYER: {
        URL: 'https://tiles.neshan.org/tiles/{z}/{x}/{y}.png',
        ATTRIBUTION: '© Neshan Maps',
        MAX_ZOOM: 18
    },
    
    // API Rate Limiting
    RATE_LIMIT: {
        REQUESTS_PER_MINUTE: 60,
        REQUESTS_PER_DAY: 1000
    },
    
    // Supported Languages
    LANGUAGES: ['fa', 'en', 'ar'],
    DEFAULT_LANGUAGE: 'fa',
    
    // Map Styles
    MAP_STYLES: {
        DEFAULT: 'default',
        SATELLITE: 'satellite',
        TERRAIN: 'terrain',
        STREET: 'street'
    },
    
    // Marker Icons
    MARKER_ICONS: {
        DEFAULT: '📍',
        LOCATION: '📍',
        SEARCH: '🔍',
        CURRENT: '📍',
        DESTINATION: '🎯',
        ORIGIN: '🚀'
    },
    
    // Error Messages
    ERROR_MESSAGES: {
        API_KEY_MISSING: 'Neshan API key is required. Please get one from neshan.org',
        LOCATION_NOT_FOUND: 'Location not found. Please try a different search term.',
        NETWORK_ERROR: 'Network error. Please check your internet connection.',
        RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please try again later.',
        INVALID_COORDINATES: 'Invalid coordinates provided.',
        GEOLOCATION_NOT_SUPPORTED: 'Geolocation is not supported by this browser.',
        GEOLOCATION_PERMISSION_DENIED: 'Geolocation permission denied. Please enable location access.'
    },
    
    // Success Messages
    SUCCESS_MESSAGES: {
        LOCATION_FOUND: 'Location found successfully!',
        MARKER_ADDED: 'Marker added to map.',
        DIRECTIONS_LOADED: 'Directions loaded successfully!',
        CURRENT_LOCATION_SET: 'Current location set successfully!'
    }
};

// Environment-specific configuration
const getNeshanConfig = () => {
    const config = { ...NESHAN_CONFIG };
    
    // Override with environment variables if available
    if (typeof process !== 'undefined' && process.env) {
        if (process.env.NESHAN_API_KEY) {
            config.API_KEY = process.env.NESHAN_API_KEY;
        }
        if (process.env.NESHAN_BASE_URL) {
            config.BASE_URL = process.env.NESHAN_BASE_URL;
        }
    }
    
    // Override with window variables if available (for browser)
    if (typeof window !== 'undefined' && window.NESHAN_CONFIG) {
        Object.assign(config, window.NESHAN_CONFIG);
    }
    
    return config;
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NESHAN_CONFIG, getNeshanConfig };
} else if (typeof window !== 'undefined') {
    window.NESHAN_CONFIG = NESHAN_CONFIG;
    window.getNeshanConfig = getNeshanConfig;
}
