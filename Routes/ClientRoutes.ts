import { Router } from 'express';
import { Client } from '../DTO/Client';
import { addClients } from '../Populator/ClientPopulator';
import { ClientService } from '../Services/ClientService';
import { verifyToken } from '../verify';

const clientRoutes = Router();
const clientService = new ClientService();

// Get clients by user id
clientRoutes.get('/clients/user/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const clients = await clientService.getClientsByUserId(userId);
    res.json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get client by id
clientRoutes.get('/clients/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const client = await clientService.getClientById(id);
    if (!client) {
      res.status(404).json({ message: `Client with id ${id} not found` });
    } else {
      res.json(client);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create client
clientRoutes.post('/clients', verifyToken, async (req, res) => {
  try {
    const {
      name,
      emailAddress,
      officePhone,
      mobilePhone,
      addressLine1,
      addressLine2,
      city,
      stateOrProvince,
      postalCode,
      country,
    } = req.body;

    const client = new Client(
      name,
      emailAddress,
      officePhone,
      mobilePhone,
      addressLine1,
      addressLine2,
      city,
      stateOrProvince,
      postalCode,
      country,
    );

    await clientService.addClient(client);
    res.json({ message: 'Client created successfully', id: client.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update client
clientRoutes.put('/clients/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      emailAddress,
      officePhone,
      mobilePhone,
      addressLine1,
      addressLine2,
      city,
      stateOrProvince,
      postalCode,
      country,
    } = req.body;

    const client = await clientService.getClientById(id);
    if (!client) {
      res.status(404).json({ message: `Client with id ${id} not found` });
    } else {
      client.name = name ?? client.name;
      client.emailAddress = emailAddress ?? client.emailAddress;
      client.officePhone = officePhone ?? client.officePhone;
      client.mobilePhone = mobilePhone ?? client.mobilePhone;
      client.addressLine1 = addressLine1 ?? client.addressLine1;
      client.addressLine2 = addressLine2 ?? client.addressLine2;
      client.city = city ?? client.city;
      client.stateOrProvince = stateOrProvince ?? client.stateOrProvince;
      client.postalCode = postalCode ?? client.postalCode;
      client.country = country ?? client.country;

      await clientService.updateClient(client);
      res.json({ message: `Client with id ${id} updated successfully` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
  
  // Delete client
  clientRoutes.delete('/clients/:id', verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      const client = await clientService.getClientById(id);
      if (!client) {
        res.status(404).json({ message: `Client with id ${id} not found` });
      } else {
        await clientService.deleteClient(id);
        res.json({ message: `Client with id ${id} deleted successfully` });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  clientRoutes.post('/clients/populate', async (req, res) => {
    try {
      await addClients();
      res.json({ message: 'Clients populated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
 
export default clientRoutes;