import { User } from "../DTO/User";
import { db, auth } from "../firebase";
import { clientAuth } from "../firebaseClient"
import bcrypt from "bcrypt";

export class UserService {
  private userCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;

  constructor() {
    this.userCollection = db.collection("users");
  }
  
  async updateUserAccountType(userId: string, accountType: string): Promise<void> {
    if (accountType !== 'free' && accountType !== 'paid') {
      console.log('Invalid account type provided.');
      return;
    }
  
    // Query for the user with the matching userId property
    const querySnapshot = await this.userCollection.where('id', '==', userId).get();
  
    if (querySnapshot.empty) {
      console.log(`No user found with userId ${userId}.`);
      return;
    }
  
    // Assuming there's only one document with the matching userId
    const userDoc = querySnapshot.docs[0];
    await userDoc.ref.update({ accountType: accountType });
    console.log(`User with id ${userId} updated account type to ${accountType} successfully.`);
  }

  async addUser(user: User, password: string): Promise<void> {
    try {
      const firebaseUser = await auth.createUser({
        email: user.username,
        password: password,
      });

      user.password = firebaseUser.uid;
      const serializedUser = JSON.parse(JSON.stringify(user));
      await this.userCollection.add(serializedUser);
      console.log(`User with id ${user.id} added successfully.`);
    } catch (error) {
      console.error(`Failed to add user: `, error);
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const querySnapshot = await this.userCollection.where('username', '==', email).get();
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return new User(data.id, data.accountType, data.username, data.password, data.name, data.companyName);
    }
    return null;
  }

  async updateUser(user: User): Promise<void> {
    await this.userCollection.doc(user.id).set(user);
    console.log(`User with id ${user.id} updated successfully.`);
  }

  async getUserById(userId: string): Promise<User | undefined> {
    const querySnapshot = await this.userCollection.where("id", "==", userId).get();
    if (querySnapshot.empty) {
      console.log(`User with id ${userId} not found.`);
      return undefined;
    } else {
      const userDoc = querySnapshot.docs[0];
      const user = userDoc.data() as User;
      return user;
    }
  }

  async getUserByCredentials(username: string, password: string): Promise<User | undefined> {
    try {
      const signInResult = await clientAuth.signInWithEmailAndPassword(username, password);
      const firebaseUser = signInResult.user;

      if (firebaseUser) {
        const querySnapshot = await this.userCollection.where("password", "==", firebaseUser.uid).get();
        console.log(firebaseUser.uid)
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const user = userDoc.data() as User;
          return user;
        } else {
          console.log(`User with username ${username} not found in Firestore.`);
          return undefined;
        }
      } else {
        console.log(`User with username ${username} not found in Firebase Auth.`);
        return undefined;
      }
    } catch (error) {
      console.error(`Failed to sign in user with username ${username}: `, error);
      return undefined;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    const querySnapshot = await this.userCollection.where("id", "==", userId).get();
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const user = userDoc.data() as User;
      const password = user.password;
      await userDoc.ref.delete();

      // Delete the Firebase Auth user
      try {
        await auth.deleteUser(password);
        console.log(`Firebase Auth user with id ${password} deleted successfully.`);
      } catch (error) {
        console.error(`Failed to delete Firebase Auth user with id ${userId}: `, error);
      }

      console.log(`Firestore user with id ${userId} deleted successfully.`);
    } else {
      console.log(`User with id ${userId} not found.`);
    }
  }

}