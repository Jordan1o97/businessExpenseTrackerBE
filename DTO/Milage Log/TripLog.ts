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
    this.total = (rate * (this.calculateTimeDifference(start, end) + totalHours)) - expense;
    this.vehicle = vehicle;
    this.destination = destination;
    this.origin = origin;
    this.clientId = clientId;
    this.notes = notes;
    this.userId = getCurrentUserId();
  }

  // Add this method to the TripLog class
  calculateTimeDifference(start: Date, end: Date): number {
    const millisecondsDifference = end.getTime() - start.getTime();
    const hoursDifference = millisecondsDifference / (1000 * 60 * 60);
    const roundedHoursDifference = Math.round(hoursDifference);
  
    return roundedHoursDifference;
  }
}