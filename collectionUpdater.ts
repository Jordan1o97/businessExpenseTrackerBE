import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
const serviceAccount = require("./keys/icubemedia-expensetracker-firebase-adminsdk-hyjaj-f3e9c79dd9.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();
const db = admin.firestore();

async function updateUserPasswordWithAuthUid() {
  let nextPageToken: string | undefined;

  do {
    try {
      // List all Firebase Auth users, 1000 at a time
      const result = await auth.listUsers(1000, nextPageToken);
      nextPageToken = result.pageToken;

      // Iterate through users and update corresponding Firestore document
      for (const user of result.users) {
        const email = user.email;
        if (!email) {
          console.log(`Skipping user with uid ${user.uid} because they have no email.`);
          continue;
        }

        // Find the corresponding Firestore document by email/username
        const usersRef = db.collection("users");
        const querySnapshot = await usersRef.where("username", "==", email).get();

        // If a matching document is found, update the password with the user's uid
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          await doc.ref.update({ password: user.uid });

          console.log(`Updated password for user ${email} with auth uid.`);
        } else {
          console.log(`No Firestore document found for user ${email}.`);
        }
      }
    } catch (error) {
      console.error("Error while updating user passwords with auth uid: ", error);
      nextPageToken = undefined;
    }
  } while (nextPageToken);
}

updateUserPasswordWithAuthUid();
