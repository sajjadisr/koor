// Neshan Maps Integration
// Neshan is an Iranian mapping platform providing maps and location services

class NeshanMaps {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.map = null;
        this.markers = [];
        this.currentLocation = null;
    }

    // Initialize the map
    initMap(containerId, center = [35.689, 51.389], zoom = 11) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Container not found:', containerId);
            return;
        }

        // Create map container
        container.innerHTML = '';
        container.style.height = '400px';
        container.style.width = '100%';
        container.style.borderRadius = '8px';
        container.style.overflow = 'hidden';

        // Initialize Neshan map
        this.map = new L.Map(containerId, {
            center: center,
            zoom: zoom,
            zoomControl: true
        });

        // Add Neshan tile layer
        L.tileLayer('https://tiles.neshan.org/tiles/{z}/{x}/{y}.png', {
            attribution: '© Neshan Maps',
            maxZoom: 18
        }).addTo(this.map);

        // Add current location button
        this.addCurrentLocationButton();
        
        return this.map;
    }

    // Add current location button
    addCurrentLocationButton() {
        const locationButton = L.Control.extend({
            options: {
                position: 'topleft'
            },
            onAdd: () => {
                const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
                const button = L.DomUtil.create('a', 'leaflet-control-zoom-in', container);
                button.innerHTML = '📍';
                button.title = 'Current Location';
                button.style.fontSize = '18px';
                button.style.textDecoration = 'none';
                button.style.color = '#333';
                
                button.onclick = () => this.getCurrentLocation();
                return container;
            }
        });

        this.map.addControl(new locationButton());
    }

    // Get current location
    getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    this.currentLocation = [latitude, longitude];
                    
                    // Center map on current location
                    this.map.setView(this.currentLocation, 15);
                    
                    // Add marker for current location
                    this.addMarker(this.currentLocation, 'Current Location', '📍');
                    
                    // Get address from coordinates
                    this.reverseGeocode(latitude, longitude);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Unable to get your location. Please check your browser settings.');
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    }

    // Add marker to map
    addMarker(coordinates, title = '', icon = '📍') {
        const marker = L.marker(coordinates).addTo(this.map);
        
        if (title) {
            marker.bindPopup(title);
        }
        
        this.markers.push(marker);
        return marker;
    }

    // Search for locations
    async searchLocation(query) {
        try {
            const response = await fetch(`https://api.neshan.org/v1/search?q=${encodeURIComponent(query)}&key=${this.apiKey}`);
            const data = await response.json();
            
            if (data.status === 'OK' && data.results) {
                return data.results;
            }
            return [];
        } catch (error) {
            console.error('Error searching location:', error);
            return [];
        }
    }

    // Reverse geocoding
    async reverseGeocode(lat, lng) {
        try {
            const response = await fetch(`https://api.neshan.org/v1/reverse?lat=${lat}&lng=${lng}&key=${this.apiKey}`);
            const data = await response.json();
            
            if (data.status === 'OK' && data.result) {
                return data.result;
            }
            return null;
        } catch (error) {
            console.error('Error reverse geocoding:', error);
            return null;
        }
    }

    // Get directions between two points
    async getDirections(origin, destination) {
        try {
            const response = await fetch(`https://api.neshan.org/v1/directions?origin=${origin.join(',')}&destination=${destination.join(',')}&key=${this.apiKey}`);
            const data = await response.json();
            
            if (data.status === 'OK' && data.routes) {
                return data.routes;
            }
            return [];
        } catch (error) {
            console.error('Error getting directions:', error);
            return [];
        }
    }

    // Clear all markers
    clearMarkers() {
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers = [];
    }

    // Fit bounds to show all markers
    fitBounds() {
        if (this.markers.length > 0) {
            const group = new L.featureGroup(this.markers);
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NeshanMaps;
}
