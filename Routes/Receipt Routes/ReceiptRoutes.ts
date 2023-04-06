import { Router } from 'express';
import { Receipt } from '../../DTO/Receipt/Receipt';
import { ReceiptService } from '../../Services/Receipt/ReceiptService';
import { CategoryService } from '../../Services/Receipt/CategoryService';
import { ClientService } from '../../Services/ClientService';
import PDFDocument from 'pdfkit';
const generateReceiptPDF = require('../../receiptPdfGenerator');
import fs from 'fs';
import moment from 'moment';
import { addReceipts } from '../../Populator/Receipt/ReceiptPopulator';
import { verifyToken } from '../../verify';

const receiptRoutes = Router();
const receiptService = new ReceiptService();
const categoryService = new CategoryService();
const clientService = new ClientService();

//RECEIPTS

// Get all receipts for a user
receiptRoutes.get('/receipts/user/:userId', verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const receipts = await receiptService.getReceiptsByUserId(userId);
    res.json(receipts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a receipt by id
receiptRoutes.get('/receipts/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const receipt = await receiptService.getReceiptById(id);
    res.json(receipt);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add a new receipt
receiptRoutes.post('/receipts', verifyToken, async (req, res) => {
  try {
    const {
      category,
      date,
      initalTotal,
      tax,
      tip,
      clientId,
      paymentMode,
      description,
      status,
    } = req.body;
    const receipt = new Receipt(
      category,
      date,
      initalTotal,
      tax,
      tip,
      clientId,
      paymentMode,
      description,
      status
    );
    await receiptService.addReceipt(receipt);
    res.json({ message: 'Receipt added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a receipt
receiptRoutes.put('/receipts/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const existingReceipt = await receiptService.getReceiptById(id);
    if (!existingReceipt) {
      res.status(404).json({ message: `Receipt with id ${id} not found` });
    } else {
      const {
        category,
        date,
        initalTotal,
        tax,
        tip,
        clientId,
        paymentMode,
        description,
        status,
      } = req.body;
      
      existingReceipt.category = category;
      existingReceipt.date = date;
      existingReceipt.initalTotal = initalTotal;
      existingReceipt.tax = tax;
      existingReceipt.tip = tip;
      existingReceipt.clientId = clientId;
      existingReceipt.paymentMode = paymentMode;
      existingReceipt.description = description;
      existingReceipt.status = status;

      await receiptService.updateReceipt(existingReceipt);
      res.json(existingReceipt);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a receipt
receiptRoutes.delete('/receipts/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    await receiptService.deleteReceipt(id);
    res.json({ message: 'Receipt deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
  
  //Populate Receipts
  receiptRoutes.post('/receipts/populate', verifyToken, async (req, res) => {
    try {
      await addReceipts();
      res.json({ message: 'Receipts populated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Daily Receipts
receiptRoutes.get("/receipts/user/:userId/daily", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.body;

    // Get all receipts for the current user
    const receipts = await receiptService.getReceiptsByUserId(userId);

    // Filter receipts by date range if start and end dates are provided
    let filteredReceipts = receipts;
    if (startDate && endDate) {
      filteredReceipts = receipts.filter((receipt) => {
        const receiptDate = receipt.date.getTime();
        return receiptDate >= startDate && receiptDate <= endDate;
      });
    }

    // Create object to hold receipts sorted by day
    const receiptsByDay: Record<string, Receipt[]> = {};

    // Loop through each receipt
    for (const receipt of filteredReceipts) {
      const receiptDay = receipt.date.toLocaleDateString();
      if (!receiptsByDay[receiptDay]) {
        receiptsByDay[receiptDay] = [];
      }
      receiptsByDay[receiptDay].push(receipt);
    }

    // Sort the receipts by date
    for (const dayKey in receiptsByDay) {
      receiptsByDay[dayKey].sort((a, b) => a.date.getTime() - b.date.getTime());
    }

    // Send the receiptsByDay object as JSON response
    res.json(receiptsByDay);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

  // Monthly Receipts
receiptRoutes.get("/receipts/user/:userId/monthly", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Get all receipts for the current user
    const receipts = await receiptService.getReceiptsByUserId(userId);

    // Create object to hold receipts sorted by month
    const receiptsByMonth: Record<string, Receipt[]> = {};

    // Loop through each receipt
    for (const receipt of receipts) {
      const receiptDate = new Date(receipt.date);
      if (!isNaN(receiptDate.getTime())) {
        const receiptMonth = receiptDate.toLocaleString("default", { month: "long", year: "numeric" });
        if (!receiptsByMonth[receiptMonth]) {
          receiptsByMonth[receiptMonth] = [];
        }
        receiptsByMonth[receiptMonth].push(receipt);
      }
    }

    // Sort the receipts by date
    for (const monthKey in receiptsByMonth) {
      receiptsByMonth[monthKey].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    // Send the receiptsByMonth object as JSON response
    res.json(receiptsByMonth);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

  // Yearly Receipts
receiptRoutes.get("/receipts/user/:userId/yearly", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Get all receipts for the current user
    const receipts = await receiptService.getReceiptsByUserId(userId);

    // Create object to hold receipts sorted by year
    const receiptsByYear: Record<string, Receipt[]> = {};

    // Loop through each receipt
    for (const receipt of receipts) {
      const receiptDate = new Date(receipt.date);
      if (!isNaN(receiptDate.getTime())) {
        const receiptYear = receiptDate.getFullYear().toString();
        if (!receiptsByYear[receiptYear]) {
          receiptsByYear[receiptYear] = [];
        }
        receiptsByYear[receiptYear].push(receipt);
      }
    }

    // Sort the receipts by date
    for (const yearKey in receiptsByYear) {
      receiptsByYear[yearKey].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    // Send the receiptsByYear object as JSON response
    res.json(receiptsByYear);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

  // Categories
receiptRoutes.get("/receipts/user/:userId/category", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Get all receipts for the current user
    const receipts = await receiptService.getReceiptsByUserId(userId);

    // Get all categories
    const categories = await categoryService.getCategoriesByUserId(userId);

    // Create object to hold receipts sorted by category
    const receiptsByCategory: Record<string, Receipt[]> = {};

    // Loop through each receipt
    for (const receipt of receipts) {
      const categoryId = receipt.category;
      const category = categories.find((c) => c.id === categoryId);

      if (category) {
        const categoryName = category.name;

        if (!receiptsByCategory[categoryName]) {
          receiptsByCategory[categoryName] = [];
        }

        receiptsByCategory[categoryName].push(receipt);
      }
    }

    // Sort the receipts by date
    for (const categoryKey in receiptsByCategory) {
      receiptsByCategory[categoryKey].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    // Send the receiptsByCategory object as JSON response
    res.json(receiptsByCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

receiptRoutes.get("/receipts/user/:userId/category/pdf", verifyToken, async (req, res) => {
    const { userId } = req.params;
    generateReceiptPDF(userId, res)
    
});

//Client
receiptRoutes.get("/receipts/user/:userId/client", verifyToken, async (req, res) => {
  try {
      const { userId } = req.params;

      // Get all receipts for the current user
      const receipts = await receiptService.getReceiptsByUserId(userId);

      // Create object to hold receipts sorted by client
      const receiptsByClient: Record<string, Receipt[]> = {};

      // Loop through each receipt
      for (const receipt of receipts) {
          if (receipt.clientId) {
              const client = await clientService.getClientById(receipt.clientId);
              console.log(client);
              if (client) {
                  const clientName = client.name;
                  if (!receiptsByClient[clientName]) {
                      receiptsByClient[clientName] = [];
                  }
                  receiptsByClient[clientName].push(receipt);
              }
          }
      }

      // Sort the receipts by client name
      const sortedReceiptsByClient = Object.keys(receiptsByClient).sort();
      const sortedReceiptsByClientObj: Record<string, Receipt[]> = {};
      for (const client of sortedReceiptsByClient) {
          sortedReceiptsByClientObj[client] = receiptsByClient[client];
      }

      // Send the sortedReceiptsByClient object as JSON response
      res.json(sortedReceiptsByClientObj);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
  }
});

//   //PDF Generator:
//   receiptRoutes.get('/receipts/user/:userId/pdf', verifyToken, async (req, res) => {
//     const userId = req.params.userId;
//     await generateReceiptPDF(userId, res);
// });

//Get Receipt Total
receiptRoutes.get("/receipts/user/:userId/total", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Get all receipts for the current user
    const receipts = await receiptService.getReceiptsByUserId(userId);

    // Calculate the total final amount for all receipts
    const total = receipts.reduce((sum, receipt) => sum + receipt.finalTotal, 0);

    // Send the total as JSON response
    res.json({ total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
  


export default receiptRoutes;