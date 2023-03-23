import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
const serviceAccount = require("./keys/icubemedia-expensetracker-firebase-adminsdk-hyjaj-f3e9c79dd9.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Initialize Firestore
const db = admin.firestore();

export { db };
