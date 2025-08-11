/**
 * Import the Firebase Functions and Admin SDKs.
 * The Admin SDK is crucial for interacting with Firebase services
 * on the backend without user authentication.
 */
const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize the Firebase Admin SDK.
// This allows your functions to interact with Firestore, Auth, etc.
admin.initializeApp();

/**
 * HTTP Callable Function Example: 'helloWorld'
 * This function can be called directly from your client-side code
 * using the Firebase Callable Functions SDK.
 * It's useful for client-server communication without needing
 * to set up a full REST API.
 */
exports.helloWorld = functions.https.onCall((data, context) => {
    // Check if the user is authenticated (optional, depends on your use case)
    if (!context.auth) {
        // Throwing an HttpsError will send a structured error back to the client
        throw new functions.https.HttpsError(
            'unauthenticated',
            'The function must be called while authenticated.'
        );
    }

    // Access data passed from the client
    const name = data.name || 'World';

    // Log to Firebase Functions logs
    console.log(`helloWorld function called by user: ${context.auth.uid || 'Anonymous'} with name: ${name}`);

    // Return a response to the client
    return { message: `Hello, ${name} from Firebase Functions!` };
});

/**
 * HTTP Request Function Example: 'currentTime'
 * This function responds to standard HTTP GET/POST requests.
 * You can access it via its URL after deployment.
 */
exports.currentTime = functions.https.onRequest((request, response) => {
    // Set CORS headers for all responses to allow requests from any origin
    response.set('Access-Control-Allow-Origin', '*'); // Adjust for production environments
    response.set('Access-Control-Allow-Methods', 'GET, POST');
    response.set('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests for CORS
    if (request.method === 'OPTIONS') {
        response.status(204).send('');
        return;
    }

    // Get the current time
    const now = new Date();
    const currentTimeString = now.toLocaleTimeString();
    const currentDateString = now.toLocaleDateString();

    // Send the response
    response.status(200).send(`The current time is ${currentTimeString} on ${currentDateString}.`);
});

/**
 * Firestore Triggered Function Example: 'onCounterUpdate'
 * This function will be triggered whenever the 'mainCounter' document
 * in the 'globalCounters' collection changes.
 * It demonstrates how to listen for database changes.
 */
exports.onCounterUpdate = functions.firestore
    .document('artifacts/{appId}/public/data/globalCounters/mainCounter')
    .onUpdate(async (change, context) => {
        const newValue = change.after.data();
        const previousValue = change.before.data();
        const appId = context.params.appId; // Access the appId from the path parameter

        console.log(`Counter updated for app ID: ${appId}`);
        console.log('Previous counter value:', previousValue ? previousValue.value : 'N/A');
        console.log('New counter value:', newValue ? newValue.value : 'N/A');

        // You could add logic here, e.g., send a notification, log to a different service, etc.
        // For example, if the counter reaches 10, log a special message:
        if (newValue && newValue.value >= 10) {
            console.log('🎉 Counter has reached or exceeded 10! 🎉');
        }

        return null; // Return null or a Promise that resolves to null
    });
