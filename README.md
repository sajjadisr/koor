# Kooreh - Best Place Finder Platform for Iran

A modern, professional platform for discovering and exploring the best places in Iran. Built with cutting-edge technologies and best practices.

## 🚀 Features

- **Advanced Search**: Find restaurants, cafes, hotels, attractions, and more
- **Real-time Reviews**: Access authentic reviews from real visitors
- **Interactive Maps**: Google Maps integration with custom styling
- **Location Services**: GPS-based nearby place discovery
- **Responsive Design**: Modern, mobile-first user interface
- **Firebase Integration**: Robust backend with real-time data
- **Google APIs**: Places, Maps, and Reviews integration

## 🏗️ Architecture

```
kooreh/
├── src/                    # Frontend source code
│   ├── js/                # JavaScript modules
│   │   ├── app.js         # Main application logic
│   │   ├── api.js         # API service layer
│   │   ├── ui.js          # UI utilities and components
│   │   ├── maps.js        # Maps integration
│   │   └── firebase-config.js # Firebase configuration
│   ├── style/             # CSS styles
│   │   └── main.css       # Main stylesheet
│   └── index.html         # Main HTML file
├── server.js              # Express.js backend server
├── dist/                  # Production build output
├── public/                # Static assets (legacy)
└── firebase-config/       # Firebase configuration files
```

## 🛠️ Technology Stack

### Frontend
- **Vite** - Fast build tool and dev server
- **Vanilla JavaScript** - Modern ES6+ with modules
- **CSS3** - Custom properties and modern layouts
- **HTML5** - Semantic markup and accessibility

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Firebase Admin SDK** - Backend services
- **Google APIs** - Places, Maps, and Reviews

### Development Tools
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **Concurrently** - Run multiple commands

## 📦 Installation

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn package manager
- Firebase project setup
- Google APIs enabled

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kooreh
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
   ```bash
   cp env.example .env
   # Edit .env with your actual values
   ```

4. **Firebase setup**
   - Place your `serviceAccountKey.json` in the root directory
   - Configure Firebase project settings

5. **Google APIs setup**
   - Enable Google Places API
   - Enable Google Maps JavaScript API
   - Get API keys and add to environment variables

## 🚀 Development

### Start Development Server
```bash
# Start both frontend and backend
npm run dev

# Start only frontend (Vite dev server)
npm run dev:frontend

# Start only backend (Express server)
npm run dev:backend
```

### Build for Production
```bash
# Build frontend
npm run build

# Start production server
npm run start:prod
```

### Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## 🌐 Deployment

### Production Build
```bash
# Build and start production server
npm run start:prod
```

### Environment Variables
Ensure these are set in your production environment:
- `NODE_ENV=production`
- `GOOGLE_API_KEY`
- `GOOGLE_MAPS_API_KEY`
- Firebase service account credentials

### Deployment Platforms
- **Vercel**: Automatic deployment from Git
- **Netlify**: Static hosting with serverless functions
- **Heroku**: Full-stack deployment
- **Firebase Hosting**: Integrated with Firebase ecosystem

## 🔧 Configuration

### Vite Configuration
- Source directory: `src/`
- Build output: `dist/`
- Development server: Port 3000
- Backend proxy: Port 3001

### Server Configuration
- Port: 3001 (configurable via environment)
- Static files: Serves from `dist/` in production
- API endpoints: `/api/*`
- CORS: Enabled for development

### Firebase Configuration
- Firestore database
- Authentication (optional)
- Storage (optional)
- Emulator support for development

## 📱 API Endpoints

### Places
- `GET /api/places/search` - Search for places
- `GET /api/places/nearby` - Find nearby places
- `GET /api/places/:id` - Get place details
- `POST /api/places/:id/reviews` - Sync place reviews

### Businesses
- `GET /api/businesses` - Get all businesses
- `POST /api/businesses` - Add new business

### Health
- `GET /api/health` - Server health check

## 🎨 Customization

### Styling
- CSS custom properties for theming
- Modular CSS structure
- Responsive design utilities
- Component-based styling

### Maps
- Custom Google Maps styling
- Marker customization
- Info window templates
- Directions integration

### Components
- Place cards
- Search forms
- Modal dialogs
- Loading indicators

## 🧪 Testing

### Manual Testing
```bash
# Test Firebase connection
npm run test
```

### Automated Testing
- Unit tests for utility functions
- Integration tests for API endpoints
- E2E tests for user workflows

## 📊 Performance

### Frontend Optimization
- Code splitting and lazy loading
- Image optimization and lazy loading
- CSS minification
- JavaScript bundling and minification

### Backend Optimization
- API response caching
- Database query optimization
- Rate limiting
- Error handling and logging

## 🔒 Security

### API Security
- CORS configuration
- Rate limiting
- Input validation
- Error message sanitization

### Environment Security
- Secure environment variable handling
- Service account key protection
- API key management

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

### Code Standards
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages
- Include tests for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [API Reference](docs/api.md)
- [Deployment Guide](docs/deployment.md)
- [Contributing Guide](docs/contributing.md)

### Issues
- Report bugs via GitHub Issues
- Request features via GitHub Discussions
- Ask questions via GitHub Discussions

## 🙏 Acknowledgments

- Google Maps Platform
- Firebase team
- Vite development team
- Open source community

---

**Built with ❤️ for Iran**
