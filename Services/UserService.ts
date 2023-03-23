import { User } from "../DTO/User";
import { db } from "../firebase";
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

    await this.userCollection.doc(userId).update({ accountType: accountType });
    console.log(`User with id ${userId} updated account type to ${accountType} successfully.`);
  }


  async addUser(user: User, password: string): Promise<void> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const serializedUser = JSON.parse(JSON.stringify(user));
    serializedUser.password = hashedPassword;
    await this.userCollection.add(serializedUser);
    console.log(`User with id ${user.id} added successfully.`);
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
    const querySnapshot = await this.userCollection.where("username", "==", username).get();
    if (querySnapshot.empty) {
      console.log(`User with username ${username} not found.`);
      return undefined;
    } else {
      const userDoc = querySnapshot.docs[0];
      const user = userDoc.data() as User;
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        console.log(`Incorrect password for user with username ${username}.`);
        return undefined;
      } else {
        return user;
      }
    }
  }

  async deleteUser(userId: string): Promise<void> {
    await this.userCollection.doc(userId).delete();
    console.log(`User with id ${userId} deleted successfully.`);
  }
}