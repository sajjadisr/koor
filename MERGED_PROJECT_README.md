# Kooreh - Merged Project Structure

This project has been merged from two separate folders (`/kore` and `/kooreh`) into one complete, unified project.

## Project Structure

```
kooreh/
├── public/                 # Frontend static files (main application)
│   ├── index.html         # Main HTML file
│   ├── main.js            # Main JavaScript application
│   ├── main.css           # Main stylesheet
│   ├── firebase-config.js # Firebase configuration
│   ├── firebase-utils.js  # Firebase utilities
│   ├── ai-utils.js        # AI (Gemini) utilities
│   ├── ai-demo.html       # AI capabilities demo
│   ├── maps-demo.html     # Maps integration demo
│   ├── google-reviews-demo.html # Google Reviews demo
│   └── image/             # Image assets
├── firebase-config/        # Firebase configuration files (merged from /kore)
│   ├── firebase.json      # Firebase project configuration
│   ├── .firebaserc        # Firebase project ID
│   ├── firestore.rules    # Firestore security rules
│   ├── firestore.indexes.json # Firestore indexes
│   └── storage.rules      # Storage security rules
├── functions/              # Cloud Functions (merged from /kore)
│   ├── index.js           # Cloud Functions entry point
│   ├── package.json       # Functions dependencies
│   └── .eslintrc.js       # ESLint configuration
├── server.js               # Express backend server
├── firestore_test.js       # Firebase connection test
├── package.json            # Project dependencies
├── vite.config.js          # Vite build configuration
└── .gitignore             # Git ignore rules
```

## What Was Merged

### From `/kooreh` (Main Project):
- ✅ Complete frontend application
- ✅ Express.js backend server
- ✅ All business logic and features
- ✅ AI integration (Gemini)
- ✅ Google Maps integration
- ✅ User authentication system
- ✅ Business management features

### From `/kore` (Firebase Project):
- ✅ Firebase hosting configuration
- ✅ Firestore security rules
- ✅ Storage security rules
- ✅ Cloud Functions setup
- ✅ Firebase project configuration

## Benefits of Merging

1. **Single Source of Truth**: All code is now in one place
2. **No Duplication**: Eliminated duplicate Firebase configurations
3. **Better Organization**: Clear separation of concerns
4. **Easier Deployment**: Single project to deploy
5. **Simplified Development**: One repository to work with

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Firebase Setup
- Copy your `serviceAccountKey.json` to the root directory
- Update Firebase configuration in `public/firebase-config.js`
- Set up environment variables

### 3. Development
```bash
# Start both frontend and backend
npm run dev

# Start only frontend
npm run dev:frontend

# Start only backend
npm run dev:backend
```

### 4. Firebase Deployment
```bash
# Deploy everything
npm run firebase:deploy

# Deploy specific parts
npm run firebase:deploy:hosting
npm run firebase:deploy:functions
npm run firebase:deploy:firestore
```

## Migration Notes

- The original `/kore` folder can now be safely deleted
- All Firebase configuration is now in `firebase-config/`
- Cloud Functions are in the `functions/` directory
- The main application remains unchanged in `public/`

## Next Steps

1. **Test the merged application** to ensure everything works
2. **Update any hardcoded paths** if they reference the old structure
3. **Deploy to Firebase** using the new configuration
4. **Delete the old `/kore` folder** once you're satisfied

## Support

If you encounter any issues with the merged project:
1. Check that all dependencies are installed
2. Verify Firebase configuration is correct
3. Ensure environment variables are set
4. Check the console for any error messages

---

**Project successfully merged on**: $(Get-Date)
**Status**: Ready for development and deployment
