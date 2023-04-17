import { v4 as uuidv4 } from 'uuid';
import { getCurrentUserId } from "../../globals";

export class Receipt {
    id: string;
    category: string;
    clientId: string;
    date: Date;
    initalTotal: number;
    tax: number;
    tip: number;
    finalTotal: number;
    paymentMode?: string;
    description?: string;
    status?: string;
    pictureId?: string;
    userId: string;
  
    constructor(
      category: string,
      date: Date,
      initalTotal: number,
      tax: number,
      tip: number,
      clientId: string,
      paymentMode?: string,
      description?: string,
      pictureId?: string,
      status: string = "pending",
    ) { 
      this.id = uuidv4();
      this.category = category;
      this.clientId= clientId;
      this.date = date;
      this.initalTotal = initalTotal;
      this.finalTotal = initalTotal + tip + tax;
      this.tax = tax;
      this.tip = tip;
      this.paymentMode = paymentMode;
      this.description = description;
      this.status = status;
      this.pictureId = pictureId;
      this.userId = getCurrentUserId();
    }
}