import { v4 as uuidv4 } from 'uuid';
import { getCurrentUserId } from "../../globals";

export class TripLog {
  id: string;
  date: Date;
  expense: number;
  start: Date;
  end: Date;
  rate: number;
  totalHours: number;
  total: number;
  vehicle: string;
  destination: string;
  origin: string;
  clientId: string;
  notes: string;
  userId: string;

  constructor(
    date: Date,
    expense: number,
    start: Date,
    end: Date,
    totalHours: number,
    rate: number,
    vehicle: string,
    destination: string,
    origin: string,
    clientId: string,
    notes: string
  ) {
    this.id = uuidv4();
    this.date = date;
    this.expense = expense;
    this.start = start;
    this.end = end;
    this.rate = rate;
    this.totalHours = totalHours;
    this.total = rate * totalHours;;
    this.vehicle = vehicle;
    this.destination = destination;
    this.origin = origin;
    this.clientId = clientId;
    this.notes = notes;
    this.userId = getCurrentUserId();
  }
}