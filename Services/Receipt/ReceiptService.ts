import { Receipt } from "../../DTO/Receipt/Receipt";
import { db } from "../../firebase";
import { getCurrentUserId } from "../../globals";
import moment from 'moment';
import { firestore } from "firebase-admin";

export class ReceiptService {
  private receiptCollection = db.collection("receipts");

  async addReceipt(receipt: Receipt): Promise<void> {
    const entries = Object.entries(receipt).filter(([key, value]) => value !== undefined);
    const filteredReceipt = Object.fromEntries(entries);
    await this.receiptCollection.doc(receipt.id).set({
        ...filteredReceipt,
        userId: getCurrentUserId(),
    });
    console.log(`Receipt with id ${receipt.id} added successfully.`);
}

  async getReceiptById(receiptId: string): Promise<Receipt | undefined> {
    const receiptDoc = await this.receiptCollection.doc(receiptId).get();
    const receipt = receiptDoc.data() as Receipt | undefined;
    return receipt;
  }

  async getReceiptsByUserId(userId: string): Promise<Receipt[]> {
    const querySnapshot = await this.receiptCollection.where("userId", "==", userId).get();
    const receipts: Receipt[] = [];
    querySnapshot.forEach((doc) => {
      const receiptData = doc.data();
      let date: Date;
      if (receiptData.date instanceof firestore.Timestamp) {
          date = receiptData.date.toDate();
      } else if (moment(receiptData.date, moment.ISO_8601, true).isValid()) {
          date = moment.utc(receiptData.date).toDate();
      } else if (moment(receiptData.date, 'MMMM D, YYYY [at] h:mm:ss A Z', true).isValid()) {
          date = moment.utc(receiptData.date, 'MMMM D, YYYY [at] h:mm:ss A Z').toDate();
      } else if (moment(receiptData.date, 'YYYY-MM-DDTHH:mm:ssZ', true).isValid()) {
          date = moment.utc(receiptData.date, 'YYYY-MM-DDTHH:mm:ssZ').toDate();
      } else {
          console.error(`Invalid date format for receipt with ID ${receiptData.id}`);
          return;
      }
        const receipt = new Receipt(
          receiptData.category,
          date,
          receiptData.initalTotal,
          receiptData.tax,
          receiptData.tip,
          receiptData.clientId,
          receiptData.paymentMode,
          receiptData.description,
          receiptData.status,
      );
        receipt.id = receiptData.id;
        receipt.userId = receiptData.userId;
        receipts.push(receipt);
    });
    console.log(`Found ${receipts.length} receipts for user with id ${userId}.`);
    return receipts;
}

  async updateReceipt(receipt: Receipt): Promise<void> {
    await this.receiptCollection.doc(receipt.id).set({
      ...receipt,
      userId: getCurrentUserId(),
    })
    console.log(`Receipt with id ${receipt.id} has been updated.`);
  }

  async deleteReceipt(receiptId: string): Promise<void> {
    await this.receiptCollection.doc(receiptId).delete();
    console.log(`Receipt with id ${receiptId} deleted.`);
  }
}