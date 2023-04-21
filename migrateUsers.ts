import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
const serviceAccount = require("./keys/icubemedia-expensetracker-firebase-adminsdk-hyjaj-f3e9c79dd9.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();
const db = admin.firestore();

async function migrateUsers() {
  const usersRef = db.collection("users");
  const snapshot = await usersRef.get();

  // Email validation regex
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

  for (const doc of snapshot.docs) {
    const userData = doc.data();

    // Check if the email is valid
    console.log(userData.username)
    if (!emailRegex.test(userData.username)) {
      console.log(`Skipping user with invalid email: ${userData.username}`);
      continue;
    }

    try {
      const { uid } = await auth.createUser({
        email: userData.username,
        password: userData.password,
      });

      console.log(`User ${userData.email} migrated successfully with uid: ${uid}`);
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "auth/email-already-exists") {
        console.log(`User ${userData.email} already migrated.`);
      } else if (error instanceof Error && "code" in error && error.code === "auth/invalid-email") {
        console.log(`Invalid email for user ${userData.email}.`);
      } else {
        console.error(`Failed to migrate user ${userData.email}: `, error);
      }
    }
  }
}

migrateUsers();