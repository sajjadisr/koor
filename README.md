# Koor - Best Place Finder Platform

A comprehensive platform for discovering and reviewing the best places in Iran, including gyms, salons, restaurants, and more.

## Features

- **Smart Search**: Find places by category, location, and reviews
- **Location-based**: Discover places near you or in specific cities
- **User Reviews**: Read and write authentic reviews
- **Responsive Design**: Works perfectly on all devices
- **User Authentication**: Secure login and registration system
- **Business Dashboard**: Add and manage your business listings
- **AI-Powered Intelligence**: Gemini AI for smart recommendations and natural language search

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project setup

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd koor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Download your `serviceAccountKey.json` and place it in the root directory
   - Update Firebase configuration in `public/firebase-config.js`

4. **Start development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Project Structure

```
koor/
├── public/                 # Frontend static files
│   ├── index.html         # Main HTML file
│   ├── main.js            # Main JavaScript application
│   ├── main.css           # Main stylesheet
│   ├── firebase-config.js # Firebase configuration
│   ├── firebase-utils.js  # Firebase utilities
│   ├── ai-utils.js        # AI (Gemini) utilities
│   ├── ai-demo.html       # AI capabilities demo
│   └── image/             # Image assets
├── server.js              # Express backend server
├── firestore_test.js      # Firebase connection test
├── package.json           # Project dependencies
├── vite.config.js         # Vite build configuration
└── .gitignore            # Git ignore rules
```

## Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:frontend` - Start only the frontend (Vite dev server)
- `npm run dev:backend` - Start only the backend (Express server)
- `npm run build` - Build the frontend for production
- `npm run preview` - Preview the production build
- `npm start` - Start the production backend server
- `npm test` - Test Firebase connection

## Configuration

### Firebase Setup

1. **Authentication**: Enable Email/Password and Google sign-in
2. **Firestore**: Create collections for businesses, users, and reviews
3. **Storage**: Set up rules for image uploads
4. **Hosting**: Configure for production deployment

### Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=3001
FIREBASE_PROJECT_ID=your-project-id
```

## API Endpoints

### Backend API (Port 3001)

- `GET /api/health` - Health check
- `GET /api/businesses` - Get all businesses
- `POST /api/businesses` - Add new business
- `GET /` - Serve frontend

### Frontend (Port 3000)

- Main application interface
- Firebase integration
- User authentication
- Business search and discovery

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Build Tool**: Vite
- **Backend**: Node.js, Express.js
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **Hosting**: Firebase Hosting
- **AI**: Google Gemini (Firebase AI)

## AI Capabilities

### Gemini AI Integration
The app now includes powerful AI capabilities powered by Google's Gemini model:

- **Smart Search Suggestions**: AI-generated search recommendations based on user input
- **Business Recommendations**: Personalized business suggestions based on user preferences
- **Content Generation**: AI-powered business descriptions and content
- **Natural Language Processing**: Convert natural language queries to search keywords
- **Review Insights**: AI analysis of user reviews and feedback
- **Personalized Recommendations**: User-specific business suggestions

### AI Demo Page
Visit `/ai-demo.html` to test all AI capabilities interactively.

## Security

- Firebase security rules for Firestore and Storage
- CORS enabled for development
- Input validation and sanitization
- Secure authentication flow
- AI API rate limiting and safety measures

## Deployment

### Firebase Hosting

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

### Manual Deployment

1. **Build frontend**
   ```bash
   npm run build
   ```

2. **Deploy backend** to your preferred hosting service
3. **Update API endpoints** in frontend configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the Firebase documentation

## Updates

Stay updated with the latest features and improvements by:
- Following the repository
- Checking the changelog
- Reading release notes

---

**Made with dedication for the Iranian community**
