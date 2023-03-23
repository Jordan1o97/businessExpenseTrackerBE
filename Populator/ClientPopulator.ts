import { Client } from "../DTO/Client";
import { ClientService } from "../Services/ClientService";

export async function addClients(): Promise<void> {
  const client1 = new Client(
    "John Doe",
    "john.doe@example.com",
    "555-555-1212",
    "555-555-1212",
    "123 Main St",
    "",
    "Anytown",
    "CA",
    "12345",
    "USA"
  );

  const client2 = new Client(
    "Jane Smith",
    "jane.smith@example.com",
    "555-555-1212",
    "555-555-1212",
    "123 Main St",
    "",
    "Anytown",
    "CA",
    "12345",
    "USA"
  );

  const clientService = new ClientService();

  await clientService.addClient(client1);
  await clientService.addClient(client2);
}