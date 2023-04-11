import { Client } from "../DTO/Client";
import { db } from "../firebase";
import { getCurrentUserId } from "../globals";

export class ClientService {
  private clientCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;

  constructor() {
    this.clientCollection = db.collection("clients");
  }

  async addClient(client: Client): Promise<void> {
    const serializedClient = JSON.parse(JSON.stringify(client));
    await this.clientCollection.add(serializedClient);
    console.log(`Client with id ${client.id} added successfully.`);
  }

  async updateClient(client: Client): Promise<void> {
    const clientRef = this.clientCollection.doc(client.id);
    
    // Convert the client object to a plain JavaScript object
    const plainClientData = JSON.parse(JSON.stringify(client));
    
    await clientRef.set(plainClientData, { merge: true });
    console.log(`Client with id ${client.id} updated successfully.`);
}

  async getClientById(clientId: string): Promise<Client | undefined> {
    const querySnapshot = await this.clientCollection.where("id", "==", clientId).get();
    if (querySnapshot.empty) {
      console.log(`Client with id ${clientId} not found.`);
      return undefined;
    } else {
      const clientDoc = querySnapshot.docs[0];
      const client = clientDoc.data() as Client;
      return client;
    }
  }

  
  async deleteClient(clientId: string): Promise<void> {
    await this.clientCollection.doc(clientId).delete();
    console.log(`Client with id ${clientId} deleted successfully.`);
  }

  async getClientsByUserId(userId: string): Promise<Client[]> {
    const querySnapshot = await this.clientCollection.where("userId", "==", userId).get();
    const clients: Client[] = [];
    querySnapshot.forEach((doc) => {
      const clientData = doc.data();
      const client = new Client(
        clientData.name,
        clientData.emailAddress,
        clientData.officePhone,
        clientData.mobilePhone,
        clientData.addressLine1,
        clientData.addressLine2,
        clientData.city,
        clientData.stateOrProvince,
        clientData.postalCode,
        clientData.country
      );
      client.id = clientData.id;
      clients.push(client);
    });
    console.log(`Found ${clients.length} clients for user with id ${userId}.`);
    return clients;
  }
}