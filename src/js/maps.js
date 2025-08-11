// Maps integration for Google Maps and other mapping services
let googleMapsLoaded = false;
let mapInstance = null;

// Initialize maps functionality
export function initializeMaps() {
  // Check if Google Maps is available
  if (typeof google !== 'undefined' && google.maps) {
    googleMapsLoaded = true;
    console.log('Google Maps already loaded');
    return;
  }
  
  // Load Google Maps if not already loaded
  loadGoogleMaps();
}

// Load Google Maps API
function loadGoogleMaps() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.warn('Google Maps API key not found. Maps functionality will be limited.');
    return;
  }
  
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
  script.async = true;
  script.defer = true;
  
  script.onload = () => {
    googleMapsLoaded = true;
    console.log('Google Maps loaded successfully');
    initializeMap();
  };
  
  script.onerror = () => {
    console.error('Failed to load Google Maps');
  };
  
  document.head.appendChild(script);
}

// Initialize the map
function initializeMap() {
  if (!googleMapsLoaded) return;
  
  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;
  
  try {
    mapInstance = new google.maps.Map(mapContainer, {
      center: { lat: 35.6892, lng: 51.3890 }, // Tehran, Iran
      zoom: 10,
      styles: getMapStyles(),
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true
    });
    
    console.log('Map initialized successfully');
  } catch (error) {
    console.error('Failed to initialize map:', error);
  }
}

// Get custom map styles
function getMapStyles() {
  return [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'transit',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ];
}

// Add a marker to the map
export function addMapMarker(position, title, infoWindowContent = null) {
  if (!googleMapsLoaded || !mapInstance) return null;
  
  try {
    const marker = new google.maps.Marker({
      position: position,
      map: mapInstance,
      title: title,
      animation: google.maps.Animation.DROP
    });
    
    // Add info window if content provided
    if (infoWindowContent) {
      const infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent
      });
      
      marker.addListener('click', () => {
        infoWindow.open(mapInstance, marker);
      });
    }
    
    return marker;
  } catch (error) {
    console.error('Failed to add marker:', error);
    return null;
  }
}

// Search for places using Google Places API
export async function searchPlaces(query, location = null, radius = 5000) {
  if (!googleMapsLoaded) {
    throw new Error('Google Maps not loaded');
  }
  
  return new Promise((resolve, reject) => {
    const service = new google.maps.places.PlacesService(mapInstance || document.createElement('div'));
    
    const request = {
      query: query,
      radius: radius
    };
    
    if (location) {
      request.location = location;
    }
    
    service.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        resolve(results);
      } else {
        reject(new Error(`Places search failed: ${status}`));
      }
    });
  });
}

// Get place details
export async function getPlaceDetails(placeId) {
  if (!googleMapsLoaded) {
    throw new Error('Google Maps not loaded');
  }
  
  return new Promise((resolve, reject) => {
    const service = new google.maps.places.PlacesService(mapInstance || document.createElement('div'));
    
    const request = {
      placeId: placeId,
      fields: ['name', 'formatted_address', 'geometry', 'rating', 'user_ratings_total', 'photos', 'types', 'opening_hours', 'price_level']
    };
    
    service.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        resolve(place);
      } else {
        reject(new Error(`Place details failed: ${status}`));
      }
    });
  });
}

// Get directions between two points
export function getDirections(origin, destination, travelMode = 'DRIVING') {
  if (!googleMapsLoaded) {
    throw new Error('Google Maps not loaded');
  }
  
  return new Promise((resolve, reject) => {
    const service = new google.maps.DirectionsService();
    
    const request = {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode[travelMode]
    };
    
    service.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        resolve(result);
      } else {
        reject(new Error(`Directions failed: ${status}`));
      }
    });
  });
}

// Render directions on the map
export function renderDirections(directionsResult, panelElement = null) {
  if (!googleMapsLoaded || !mapInstance) return;
  
  try {
    const renderer = new google.maps.DirectionsRenderer({
      map: mapInstance,
      panel: panelElement
    });
    
    renderer.setDirections(directionsResult);
  } catch (error) {
    console.error('Failed to render directions:', error);
  }
}

// Get current location
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
}

// Center map on location
export function centerMapOnLocation(lat, lng, zoom = 15) {
  if (!mapInstance) return;
  
  try {
    mapInstance.setCenter({ lat, lng });
    mapInstance.setZoom(zoom);
  } catch (error) {
    console.error('Failed to center map:', error);
  }
}

// Export utility functions
export function isMapsLoaded() {
  return googleMapsLoaded;
}

export function getMapInstance() {
  return mapInstance;
}
