# Google Reviews Integration Setup Guide

This guide will help you set up Google Reviews integration for your Koor platform.

## Prerequisites

- Node.js 18+ installed
- Google Cloud Platform account
- Firebase project (already configured)
- Valid Google API key with Places API enabled

## Step 1: Google Cloud Platform Setup

### 1.1 Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable billing for the project

### 1.2 Enable Google Places API
1. Navigate to "APIs & Services" > "Library"
2. Search for "Places API"
3. Click on "Places API" and click "Enable"
4. Also enable these APIs if needed:
   - Maps JavaScript API
   - Geocoding API
   - Directions API

### 1.3 Create API Key
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key
4. **Important**: Restrict the API key to only the APIs you need

### 1.4 Restrict API Key (Security)
1. Click on your API key
2. Under "Application restrictions", select "HTTP referrers"
3. Add your domain(s): `localhost:3001`, `yourdomain.com`
4. Under "API restrictions", select "Restrict key"
5. Select only: "Places API", "Maps JavaScript API"

## Step 2: Install Dependencies

Run this command in your project directory:

```bash
npm install
```

This will install the new dependencies:
- `@googlemaps/google-maps-services-js` - Official Google Maps services
- `axios` - HTTP client for API calls
- `cheerio` - HTML parsing (for fallback scraping)
- `puppeteer` - Browser automation (for fallback scraping)

## Step 3: Environment Configuration

### 3.1 Create Environment File
Create a `.env` file in your project root:

```env
# Google API Configuration
GOOGLE_API_KEY=your_actual_api_key_here

# Server Configuration
NODE_ENV=development
PORT=3001

# Firebase Configuration (if not already set)
FIREBASE_PROJECT_ID=your-project-id
```

### 3.2 Load Environment Variables
Install dotenv if not already installed:

```bash
npm install dotenv
```

Then in your `server.js`, add at the top:

```javascript
import dotenv from 'dotenv';
dotenv.config();
```

## Step 4: Update Server Configuration

The server has been updated with new endpoints. Make sure your `server.js` includes:

- Google Places API endpoints
- Review management endpoints
- Error handling and validation
- CORS configuration

## Step 5: Test the Integration

### 5.1 Start the Server
```bash
npm run dev
```

### 5.2 Test API Endpoints
Visit the demo page: `http://localhost:3000/google-reviews-demo.html`

Or test directly via API:
- Health check: `GET http://localhost:3001/api/health`
- Search places: `GET http://localhost:3001/api/places/search?query=restaurant&location=Tehran`

## Step 6: Frontend Integration

### 6.1 Include Google Reviews Script
Add this to your HTML files:

```html
<script src="google-reviews.js"></script>
```

### 6.2 Basic Usage Examples

#### Search for Places
```javascript
// Search for restaurants in Tehran
const results = await googleReviewsManager.searchPlaces('restaurant', 'Tehran');
console.log(results.places);
```

#### Get Place Details
```javascript
// Get detailed information about a place
const placeDetails = await googleReviewsManager.getPlaceDetails('place_id_here');
console.log(placeDetails.place);
```

#### Get Reviews
```javascript
// Get reviews for a specific place
const reviews = await googleReviewsManager.getPlaceReviews('place_id_here', 20);
console.log(reviews.reviews);
```

#### Nearby Search
```javascript
// Find nearby restaurants
const nearby = await googleReviewsManager.getNearbyPlaces(35.6892, 51.3890, 5000, 'restaurant');
console.log(nearby.places);
```

## Step 7: Sync with Firebase

### 7.1 Review Sync Endpoint
Use the sync endpoint to store Google Reviews in your Firebase database:

```javascript
// Sync reviews for a place
const syncResult = await googleReviewsManager.syncReviews('place_id_here');
console.log(syncResult.message);
```

### 7.2 Firebase Integration
The sync endpoint can be extended to:
- Store reviews in Firestore
- Update business ratings
- Track review counts
- Maintain review history

## Step 8: Monitor Usage

### 8.1 Google Cloud Console
- Monitor API usage in Google Cloud Console
- Set up quotas and alerts
- Track billing and costs

### 8.2 Application Monitoring
- Check server logs for API errors
- Monitor response times
- Track cache hit rates

## Important Considerations

### Rate Limits
- Google Places API has rate limits
- Implement caching to reduce API calls
- Use batch operations when possible

### Data Freshness
- Reviews are updated periodically
- Implement sync scheduling
- Store last sync timestamps

### Error Handling
- Handle API failures gracefully
- Implement retry logic
- Provide fallback content

### Legal Compliance
- Respect Google's Terms of Service
- Don't scrape without permission
- Use official APIs when possible

## Troubleshooting

### Common Issues

#### 1. API Key Errors
```
Error: This API project is not authorized to use this API
```
**Solution**: Enable Places API in Google Cloud Console

#### 2. Quota Exceeded
```
Error: OVER_QUERY_LIMIT
```
**Solution**: Check usage limits, implement caching

#### 3. Invalid Request
```
Error: INVALID_REQUEST
```
**Solution**: Check parameter format and required fields

#### 4. CORS Issues
```
Error: CORS policy violation
```
**Solution**: Ensure CORS is properly configured in server.js

### Debug Mode
Enable debug logging by setting:

```javascript
// In google-reviews.js
this.debug = true;
```

## Performance Optimization

### 1. Caching Strategy
- Cache place details for 5 minutes
- Cache reviews for 10 minutes
- Implement cache warming

### 2. Batch Operations
- Group API calls when possible
- Use pagination for large result sets
- Implement request queuing

### 3. Lazy Loading
- Load reviews on demand
- Implement infinite scroll
- Use skeleton loading states

## Security Best Practices

### 1. API Key Protection
- Never expose API keys in client-side code
- Use environment variables
- Implement key rotation

### 2. Request Validation
- Validate all input parameters
- Sanitize user queries
- Implement rate limiting

### 3. Data Privacy
- Respect user privacy settings
- Implement data retention policies
- Follow GDPR guidelines

## Additional Resources

- [Google Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Google Cloud Console logs
3. Check server console output
4. Verify API key permissions
5. Test with Google's API testing tools

## Next Steps

After successful setup:

1. **Customize UI**: Adapt the review display to match your design
2. **Add Analytics**: Track review engagement and user behavior
3. **Implement Notifications**: Alert users to new reviews
4. **Add Moderation**: Implement review filtering and moderation
5. **Performance Monitoring**: Set up monitoring and alerting

---

**Happy Coding!**

For questions or support, create an issue in the repository or contact the development team.
