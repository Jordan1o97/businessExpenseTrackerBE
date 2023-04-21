import { clientAuth } from "./firebaseClient";
import { UserService } from "./Services/UserService";

const userService = new UserService();

clientAuth.onAuthStateChanged(async (user: any) => {
  if (user) {
    const { id, username } = user;

    // Fetch the user from Firestore by their email
    const firestoreUser = await userService.findUserByEmail(username as string);

    // If the user exists in Firestore, update their password
    if (firestoreUser) {
      const newPassword = await user.getIdToken(true);
      firestoreUser.password = newPassword;
      await userService.updateUser(firestoreUser);
    }
  }
});