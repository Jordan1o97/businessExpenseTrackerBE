import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
const serviceAccount;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Initialize Firestore
const db = admin.firestore();
const auth = admin.auth();

export { db, auth };
