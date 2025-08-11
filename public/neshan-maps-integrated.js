// Neshan Maps Integration for Kooreh (کوره)
// Integrated with existing city selection system

class KoorehNeshanMaps {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.map = null;
        this.markers = [];
        this.currentCity = 'تهران';
        this.cityCoordinates = {
            'تهران': [35.689, 51.389],
            'اصفهان': [32.6546, 51.6680],
            'مشهد': [36.2605, 59.6168],
            'شیراز': [29.5916, 52.5836],
            'تبریز': [38.0962, 46.2738],
            'قم': [34.6416, 50.8746],
            'کرج': [35.8400, 50.9391],
            'اهواز': [31.3183, 48.6706],
            'کرمانشاه': [34.3277, 47.0778],
            'ارومیه': [37.5522, 45.0755],
            'یزد': [31.8974, 54.3569],
            'زاهدان': [29.4963, 60.8629],
            'بندرعباس': [27.1865, 56.2808],
            'گرگان': [36.8456, 54.4343],
            'ساری': [36.5656, 53.0586],
            'بوشهر': [28.9234, 50.8203],
            'خرم‌آباد': [33.5812, 48.2790],
            'سنندج': [35.3219, 46.9862],
            'اراک': [34.0954, 49.6986],
            'زنجان': [36.6736, 48.4787]
        };
    }

    // Initialize the map with city integration
    initMap(containerId, cityName = 'تهران') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Map container not found:', containerId);
            return;
        }

        // Set current city
        this.currentCity = cityName;
        
        // Get city coordinates
        const coordinates = this.cityCoordinates[cityName] || this.cityCoordinates['تهران'];
        
        // Create map container
        container.innerHTML = '';
        container.style.height = '400px';
        container.style.width = '100%';
        container.style.borderRadius = '8px';
        container.style.overflow = 'hidden';

        // Initialize Neshan map
        this.map = new L.Map(containerId, {
            center: coordinates,
            zoom: 12,
            zoomControl: true
        });

        // Add Neshan tile layer
        L.tileLayer('https://tiles.neshan.org/tiles/{z}/{x}/{y}.png', {
            attribution: '© Neshan Maps',
            maxZoom: 18
        }).addTo(this.map);

        // Add city center marker
        this.addCityMarker(coordinates, cityName);
        
        // Add current location button
        this.addCurrentLocationButton();
        
        // Add city info panel
        this.addCityInfoPanel(cityName);
        
        return this.map;
    }

    // Add city center marker
    addCityMarker(coordinates, cityName) {
        const cityIcon = L.divIcon({
            className: 'city-marker',
            html: '🏛',
            iconSize: [30, 30],
            iconAnchor: [15, 30]
        });

        const marker = L.marker(coordinates, { icon: cityIcon }).addTo(this.map);
        marker.bindPopup(`<b>${cityName}</b><br>مرکز شهر`);
        this.markers.push(marker);
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
                button.title = 'موقعیت فعلی';
                button.style.fontSize = '18px';
                button.style.textDecoration = 'none';
                button.style.color = '#333';
                
                button.onclick = () => this.getCurrentLocation();
                return container;
            }
        });

        this.map.addControl(new locationButton());
    }

    // Add city info panel
    addCityInfoPanel(cityName) {
        const infoPanel = L.Control.extend({
            options: {
                position: 'topright'
            },
            onAdd: () => {
                const container = L.DomUtil.create('div', 'city-info-panel');
                container.innerHTML = `
                    <div class="city-info-header">
                        <h4>🗺 ${cityName}</h4>
                        <p>مختصات: ${this.cityCoordinates[cityName]?.join(', ')}</p>
                    </div>
                    <div class="city-info-actions">
                                <button onclick="koorehMaps.searchNearbyPlaces()" class="city-action-btn">
            🔍 جستجوی مکان‌های نزدیک
        </button>
        <button onclick="koorehMaps.showCityBoundaries()" class="city-action-btn">
            🏙 نمایش محدوده شهر
        </button>
                    </div>
                `;
                return container;
            }
        });

        this.map.addControl(new infoPanel());
    }

    // Change city on map
    changeCity(newCityName) {
        if (this.cityCoordinates[newCityName]) {
            this.currentCity = newCityName;
            const coordinates = this.cityCoordinates[newCityName];
            
            // Clear existing markers
            this.clearMarkers();
            
            // Center map on new city
            this.map.setView(coordinates, 12);
            
            // Add new city marker
            this.addCityMarker(coordinates, newCityName);
            
            // Update city info panel
            this.updateCityInfoPanel(newCityName);
            
            // Trigger city change event
            this.onCityChanged(newCityName);
        }
    }

    // Update city info panel
    updateCityInfoPanel(cityName) {
        const infoPanel = document.querySelector('.city-info-panel');
        if (infoPanel) {
                            infoPanel.querySelector('h4').innerHTML = `🗺 ${cityName}`;
            infoPanel.querySelector('p').innerHTML = `مختصات: ${this.cityCoordinates[cityName]?.join(', ')}`;
        }
    }

    // Get current location
    getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const currentLocation = [latitude, longitude];
                    
                    // Add marker for current location
                    this.addMarker(currentLocation, 'موقعیت فعلی شما', '📍');
                    
                    // Calculate distance to city center
                    const cityCoords = this.cityCoordinates[this.currentCity];
                    if (cityCoords) {
                        const distance = this.calculateDistance(currentLocation, cityCoords);
                        this.showToast(`فاصله شما تا مرکز ${this.currentCity}: ${distance.toFixed(1)} کیلومتر`);
                    }
                },
                (error) => {
                    console.error('Error getting location:', error);
                    this.showToast('خطا در دریافت موقعیت. لطفاً مجوز دسترسی به موقعیت را فعال کنید.', 'error');
                }
            );
        } else {
            this.showToast('مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند.', 'error');
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

    // Search for nearby places
    async searchNearbyPlaces() {
        const cityCoords = this.cityCoordinates[this.currentCity];
        if (!cityCoords) return;

        try {
            // Search for common places in the city
            const searchTerms = ['رستوران', 'کافه', 'فروشگاه', 'پارک', 'مترو'];
            
            for (const term of searchTerms) {
                const results = await this.searchLocation(term);
                if (results.length > 0) {
                    const firstResult = results[0];
                    this.addMarker([firstResult.lat, firstResult.lng], `${term} - ${firstResult.name}`, '🏪');
                }
            }
            
            this.showToast(`مکان‌های نزدیک در ${this.currentCity} اضافه شدند`);
        } catch (error) {
            console.error('Error searching nearby places:', error);
            this.showToast('خطا در جستجوی مکان‌های نزدیک', 'error');
        }
    }

    // Show city boundaries (simplified)
    showCityBoundaries() {
        const cityCoords = this.cityCoordinates[this.currentCity];
        if (!cityCoords) return;

        // Create a simple circle to represent city boundaries
        const cityCircle = L.circle(cityCoords, {
            color: '#3182ce',
            fillColor: '#3182ce',
            fillOpacity: 0.1,
            radius: 5000 // 5km radius
        }).addTo(this.map);

        cityCircle.bindPopup(`محدوده ${this.currentCity}<br>شعاع: ۵ کیلومتر`);
        this.markers.push(cityCircle);
        
        this.showToast(`محدوده ${this.currentCity} نمایش داده شد`);
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

    // Calculate distance between two points
    calculateDistance(point1, point2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = (point2[0] - point1[0]) * Math.PI / 180;
        const dLon = (point2[1] - point1[1]) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(point1[0] * Math.PI / 180) * Math.cos(point2[0] * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    // Clear all markers
    clearMarkers() {
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers = [];
    }

    // City change event handler
    onCityChanged(cityName) {
        // Update global currentLocation variable
        if (typeof currentLocation !== 'undefined') {
            currentLocation = cityName;
        }
        
        // Update city display in header
        const cityDisplay = document.getElementById('currentLocation');
        if (cityDisplay) {
            cityDisplay.textContent = cityName;
        }
        
        // Show toast notification
        this.showToast(`شهر به ${cityName} تغییر کرد`);
        
        // Trigger any other city change events
        if (typeof window.cityChangedEvent === 'function') {
            window.cityChangedEvent(cityName);
        }
    }

    // Show toast message
    showToast(message, type = 'info') {
        // Use existing toast system if available
        if (typeof showToast === 'function') {
            showToast(message, type);
        } else {
            // Fallback toast
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.textContent = message;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.remove();
            }, 3000);
        }
    }

    // Get city coordinates
    getCityCoordinates(cityName) {
        return this.cityCoordinates[cityName] || null;
    }

    // Get all available cities
    getAvailableCities() {
        return Object.keys(this.cityCoordinates);
    }

    // Check if city is supported
    isCitySupported(cityName) {
        return cityName in this.cityCoordinates;
    }
}

// Global instance
let koorehMaps;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Kooreh Neshan Maps
    koorehMaps = new KoorehNeshanMaps('YOUR_NESHAN_API_KEY');
    
    // Override the existing selectCity function to integrate with maps
    const originalSelectCity = window.selectCity;
    if (originalSelectCity) {
        window.selectCity = function(cityName) {
            // Call original function
            originalSelectCity(cityName);
            
            // Update map if available
                if (koorehMaps && koorehMaps.map) {
        koorehMaps.changeCity(cityName);
            }
        };
    }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KoorehNeshanMaps;
} else if (typeof window !== 'undefined') {
    window.KoorehNeshanMaps = KoorehNeshanMaps;
    window.koorehMaps = koorehMaps;
}
