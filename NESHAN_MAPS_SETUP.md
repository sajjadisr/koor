# Neshan Maps Integration Setup

This guide will help you integrate Neshan Maps into your Kooreh project. Neshan is an Iranian mapping platform that provides detailed maps of Iran and surrounding regions.

## Quick Start

### 1. Get Neshan API Key

1. Visit [neshan.org](https://neshan.org)
2. Sign up for an account
3. Navigate to the API section
4. Generate an API key
5. Note your API key for later use

### 2. Files Overview

The integration includes these files:

- **`public/neshan-maps.js`** - Main Neshan Maps integration class
- **`public/neshan-maps-demo.html`** - Demo page showcasing all features
- **`public/neshan-config.js`** - Configuration and settings
- **`NESHAN_MAPS_SETUP.md`** - This setup guide

### 3. Basic Integration

#### Option A: Using the Demo Page

1. Open `public/neshan-maps-demo.html` in your browser
2. Replace `'YOUR_NESHAN_API_KEY'` with your actual API key
3. The demo will load with a map centered on Tehran, Iran

#### Option B: Integrate into Your Existing Project

1. Include the required files in your HTML:

```html
<!-- Leaflet CSS and JS (required for maps) -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<!-- Neshan Maps Integration -->
<script src="neshan-config.js"></script>
<script src="neshan-maps.js"></script>
```

2. Add a map container to your HTML:

```html
<div id="map" style="height: 400px; width: 100%;"></div>
```

3. Initialize the map in your JavaScript:

```javascript
// Initialize Neshan Maps
const neshanMaps = new NeshanMaps('YOUR_NESHAN_API_KEY');

// Initialize map with default settings (Tehran, Iran)
neshanMaps.initMap('map', [35.689, 51.389], 11);
```

## Features

### Core Map Features

- **Interactive Maps**: Full-featured maps with zoom, pan, and controls
- **Location Search**: Search for places and addresses
- **Geolocation**: Get user's current location
- **Markers**: Add custom markers to the map
- **Reverse Geocoding**: Convert coordinates to addresses
- **Directions**: Get routing between two points

### Advanced Features

- **Custom Markers**: Add markers with custom icons and popups
- **Map Events**: Handle map clicks, moves, and zoom changes
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Comprehensive error handling and user feedback
- **Rate Limiting**: Built-in API rate limiting protection

## Configuration

### Environment Variables

You can configure the integration using environment variables:

```bash
NESHAN_API_KEY=your_api_key_here
NESHAN_BASE_URL=https://api.neshan.org
```

### JavaScript Configuration

Override default settings in your HTML:

```html
<script>
window.NESHAN_CONFIG = {
    API_KEY: 'your_api_key_here',
    DEFAULT_CENTER: [35.689, 51.389],
    DEFAULT_ZOOM: 11,
    DEFAULT_LANGUAGE: 'en'
};
</script>
```

## Usage Examples

### Basic Map Display

```javascript
const neshanMaps = new NeshanMaps('YOUR_API_KEY');
neshanMaps.initMap('map');
```

### Search for a Location

```javascript
const results = await neshanMaps.searchLocation('Tehran University');
if (results.length > 0) {
    const location = results[0];
    neshanMaps.addMarker([location.lat, location.lng], location.name);
}
```

### Get Current Location

```javascript
neshanMaps.getCurrentLocation();
```

### Add Custom Markers

```javascript
neshanMaps.addMarker([35.689, 51.389], 'Tehran, Iran', 'Landmark');
```

### Clear All Markers

```javascript
neshanMaps.clearMarkers();
```

## Supported Regions

Neshan Maps provides detailed coverage for:

- **Iran** - Full country coverage with detailed street maps
- **Middle East** - Regional coverage for neighboring countries
- **Central Asia** - Coverage for Central Asian countries

## Important Notes

### API Limitations

- **Rate Limits**: 60 requests per minute, 1000 per day
- **Coverage**: Best coverage in Iran, limited coverage elsewhere
- **Language Support**: Persian (Farsi), English, and Arabic

### Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet
- **Geolocation**: Requires HTTPS in production

### Dependencies

- **Leaflet.js**: Required for map functionality
- **Modern JavaScript**: ES6+ features required
- **Internet Connection**: Required for map tiles and API calls

## Troubleshooting

### Common Issues

1. **Map Not Loading**
   - Check if Leaflet.js is loaded
   - Verify API key is correct
   - Check browser console for errors

2. **Geolocation Not Working**
   - Ensure HTTPS is used (required for geolocation)
   - Check browser permissions
   - Verify user has granted location access

3. **Search Not Working**
   - Verify API key has search permissions
   - Check rate limits
   - Ensure search terms are in supported languages

4. **Tiles Not Loading**
   - Check internet connection
   - Verify tile server accessibility
   - Check browser console for network errors

### Debug Mode

Enable debug mode by adding this to your HTML:

```html
<script>
window.NESHAN_DEBUG = true;
</script>
```

## Useful Links

- [Neshan Official Website](https://neshan.org)
- [Neshan API Documentation](https://neshan.org/api)
- [Leaflet.js Documentation](https://leafletjs.com/reference.html)
- [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)

## License

This integration is provided as-is. Please refer to:
- Neshan's terms of service for API usage
- Leaflet.js license for map library usage

## Support

For issues with this integration:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Verify API key and permissions
4. Check rate limits and API status

For Neshan API issues:
- Contact Neshan support through their official channels
- Check their API status page
- Review their documentation and terms of service
