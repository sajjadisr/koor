# Kooreh Project Structure

## Overview
Kooreh is a modern, professional platform for discovering and exploring the best places in Iran. This document outlines the clean, organized project structure.

## Directory Structure

```
kooreh/
├── src/                          # Main source code (modern structure)
│   ├── js/                       # JavaScript modules
│   │   ├── config/               # Configuration modules
│   │   │   └── environment.js    # Environment configuration
│   │   ├── utils/                # Utility modules
│   │   │   └── logger.js         # Centralized logging utility
│   │   ├── app.js                # Main application logic
│   │   ├── api.js                # API service layer
│   │   ├── ui.js                 # UI utilities and components
│   │   ├── maps.js               # Maps integration
│   │   ├── firebase-config.js    # Firebase configuration
│   │   ├── firebase-places.js    # Firebase places operations
│   │   └── firebase-utils.js     # Firebase utility functions
│   ├── style/                    # CSS styles
│   │   ├── main.css              # Main stylesheet
│   │   └── components.css        # Component-specific styles
│   ├── index.html                # Main HTML file
│   └── main.js                   # Application entry point
├── functions/                     # Firebase Cloud Functions
│   ├── index.js                  # Functions implementation (ES modules)
│   └── package.json              # Functions dependencies
├── firebase-config/               # Firebase configuration files
│   ├── firebase.json             # Firebase project configuration
│   ├── firestore.indexes.json    # Firestore indexes
│   ├── firestore.rules           # Firestore security rules
│   └── storage.rules             # Storage security rules
├── font/                         # Custom Persian fonts
│   ├── fonts.css                 # Font declarations
│   ├── tanha-font-v0.9/          # Tanha font family
│   ├── vazir-font-v18.0.0/       # Vazir font family
│   └── yekan-font/               # Yekan font family
├── server.js                     # Express.js backend server
├── vite.config.js                # Vite build configuration
├── package.json                  # Project dependencies and scripts
├── .gitignore                    # Git ignore patterns
├── .env.example                  # Environment variables template
├── env.example                   # Legacy environment template
├── firestore_test.js             # Firestore testing utility
├── deploy.bat                    # Windows deployment script
├── deploy.sh                     # Unix deployment script
└── README.md                     # Project documentation
```

## Key Architectural Decisions

### 1. **Modern ES Modules Structure**
- All JavaScript files use ES6+ modules (`import`/`export`)
- Consistent module resolution with Vite
- No CommonJS (`require`) in main application

### 2. **Centralized Configuration**
- Environment variables managed through `src/js/config/environment.js`
- Feature flags for enabling/disabling functionality
- Consistent configuration access across the application

### 3. **Structured Logging**
- Centralized logging utility in `src/js/utils/logger.js`
- Configurable log levels (ERROR, WARN, INFO, DEBUG)
- Environment-aware logging (development vs production)

### 4. **Clean Separation of Concerns**
- **Frontend**: Modern Vite-based build with ES modules
- **Backend**: Express.js server with Firebase Admin SDK
- **Functions**: Firebase Cloud Functions for serverless operations
- **Configuration**: Centralized and environment-aware

### 5. **Asset Organization**
- **Fonts**: Custom Persian fonts properly organized
- **Styles**: CSS with CSS custom properties and modern layouts
- **Images**: Optimized and organized in appropriate directories

## Development Workflow

### 1. **Local Development**
```bash
npm run dev          # Start both frontend and backend
npm run dev:frontend # Start only Vite dev server
npm run dev:backend  # Start only Express server
```

### 2. **Building for Production**
```bash
npm run build        # Build frontend with Vite
npm run start:prod   # Start production server
```

### 3. **Firebase Operations**
```bash
npm run firebase:deploy           # Deploy all Firebase services
npm run firebase:deploy:hosting   # Deploy only hosting
npm run firebase:deploy:functions # Deploy only functions
npm run firebase:emulators        # Start Firebase emulators
```

## Code Quality

### 1. **Linting and Formatting**
- ESLint for code quality and consistency
- Prettier for code formatting
- Consistent code style across the project

### 2. **Error Handling**
- Centralized error handling with proper logging
- User-friendly error messages
- Graceful degradation for non-critical failures

### 3. **Performance**
- Vite for fast development and optimized builds
- Code splitting and lazy loading
- Optimized asset delivery

## Security Considerations

### 1. **Environment Variables**
- Sensitive configuration in `.env` files (not committed to git)
- Environment-specific configuration
- Secure handling of API keys and secrets

### 2. **Firebase Security**
- Proper Firestore security rules
- Storage security rules
- Service account key management

### 3. **API Security**
- CORS configuration
- Input validation
- Rate limiting considerations

## Maintenance and Updates

### 1. **Dependencies**
- Regular dependency updates
- Security vulnerability monitoring
- Compatibility testing

### 2. **Code Organization**
- Consistent file naming conventions
- Clear module boundaries
- Comprehensive documentation

### 3. **Testing**
- Unit tests for critical functions
- Integration tests for API endpoints
- End-to-end testing for user workflows

## Future Improvements

### 1. **TypeScript Migration**
- Gradual migration to TypeScript
- Better type safety and developer experience
- Enhanced IDE support

### 2. **Testing Infrastructure**
- Jest for unit testing
- Cypress for E2E testing
- Test coverage reporting

### 3. **CI/CD Pipeline**
- Automated testing
- Deployment automation
- Quality gates

This structure ensures the project is maintainable, scalable, and follows modern web development best practices.
