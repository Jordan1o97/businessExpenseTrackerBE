import { Receipt } from '././DTO/Receipt/Receipt';
import { Request, Response } from 'express';
import { Client } from '././DTO/Client';
import { ReceiptService } from '././Services/Receipt/ReceiptService';
import { CategoryService } from '././Services/Receipt/CategoryService';
import { ClientService } from "././Services/ClientService";
import PDFDocument from 'pdfkit';
import moment from 'moment';
const receiptService = new ReceiptService;
const clientService = new ClientService;
const categoryService = new CategoryService;
interface ReceiptsByCategory {
  [categoryName: string]: {
    receipts: Receipt[];
  };
}
async function generateReceiptPDF(userId: string, res: Response){
  try {
      // Get all receipts for the current user
      const receipts = await receiptService.getReceiptsByUserId(userId);
      // Create object to hold receipts sorted by category
      const receiptsByCategory: ReceiptsByCategory = {};
      // Loop through each receipt
      for (const receipt of receipts) {
          // Get the category for the current receipt
          const category = await categoryService.getCategoryById(receipt.category);
          // If the category exists, add the receipt to the appropriate category in the receiptsByCategory object
          if (category) {
              const categoryName = category.name;
              if (!receiptsByCategory[categoryName]) {
                  receiptsByCategory[categoryName] = { receipts: [] };
              }
              receiptsByCategory[categoryName].receipts.push(receipt);
          }
      }
      // Sort the receipts by category name
      const sortedReceiptsByCategory: ReceiptsByCategory = {};
      Object.keys(receiptsByCategory)
          .sort()
          .forEach(function (key) {
              sortedReceiptsByCategory[key] = receiptsByCategory[key];
          });
      // Generate PDF with categories separating the PDF lists
      const pdfDoc = new PDFDocument({ autoFirstPage: false });
      pdfDoc.pipe(res);
      for (const categoryName in sortedReceiptsByCategory) {
          pdfDoc.addPage();
          pdfDoc.font("Helvetica-Bold").fontSize(14).text(categoryName, {
              align: "center",
          });
          pdfDoc.moveDown(2);
          const receipts = sortedReceiptsByCategory[categoryName].receipts;
          if (receipts.length === 0) {
              pdfDoc.font("Helvetica").fontSize(12).text("No receipts found.");
          } else {
              for (const receipt of receipts) {
                  const { clientId, date, initalTotal, tax, tip, finalTotal, paymentMode, description, status } = receipt;
                  const formattedDate = moment(date).format("MMMM DD, YYYY h:mm:ss A");
                  const client = await clientService.getClientById(clientId);
                  const clientName = client ? client.name : "Unknown";
                  pdfDoc.font("Helvetica-Bold").fontSize(12).text("Client:", { continued: true })
                      .font("Helvetica").text(clientName);
                  pdfDoc.font("Helvetica-Bold").text("Date:", { continued: true })
                      .font("Helvetica").text(formattedDate);
                  pdfDoc.font("Helvetica-Bold").text("Initial Total:", { continued: true })
                      .font("Helvetica").text(`$${initalTotal.toFixed(2)}`);
                  pdfDoc.font("Helvetica-Bold").text("Tax:", { continued: true })
                      .font("Helvetica").text(`$${tax.toFixed(2)}`);
                  pdfDoc.font("Helvetica-Bold").text("Tip:", { continued: true })
                      .font("Helvetica").text(`$${tip.toFixed(2)}`);
                  pdfDoc.font("Helvetica-Bold").text("Final Total:", { continued: true })
                      .font("Helvetica").text(`$${finalTotal.toFixed(2)}`);
                  pdfDoc.font("Helvetica-Bold").text("Payment Mode:", { continued: true })
                      .font("Helvetica").text(paymentMode || "Not specified");
                  pdfDoc.font("Helvetica-Bold").text("Status:", { continued: true })
                  pdfDoc.font("Helvetica").text(status || "Not specified");
                  pdfDoc.font("Helvetica-Bold").text("Description:", { continued: true })
                      .font("Helvetica").text(description || "Not specified");
                  pdfDoc.moveDown(2);
                  pdfDoc.moveTo(40, pdfDoc.y)
                      .lineTo(pdfDoc.page.width - 40, pdfDoc.y)
                      .stroke();
                  pdfDoc.moveDown(2);
              }
          }
      }
      // Wait for the PDFDocument to emit the 'end' event before closing the response stream
      pdfDoc.on("end", () => {
          res.end();
      });
      pdfDoc.end();
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
  }
}
module.exports = generateReceiptPDF;