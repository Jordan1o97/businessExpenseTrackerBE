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
    this.total = (rate * (this.calculateHoursDifference(start, end) + totalHours)) - expense;
    this.vehicle = vehicle;
    this.destination = destination;
    this.origin = origin;
    this.clientId = clientId;
    this.notes = notes;
    this.userId = getCurrentUserId();
  }

  // Add this method to the TripLog class
  calculateHoursDifference(start: Date, end: Date): number {
    const oneDayInMilliseconds = 1000 * 60 * 60 * 24;;
    const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  
    let daysDifference = (endDay.getTime() - startDay.getTime()) / oneDayInMilliseconds;
    daysDifference = Math.ceil(daysDifference); // Round up to the nearest whole day
  
    let totalHours = 0;
    for (let day = 0; day <= daysDifference; day++) {
      const currentDayStart = new Date(start.getTime() + day * oneDayInMilliseconds);
      const currentDayEnd = new Date(currentDayStart.getTime() + oneDayInMilliseconds);
  
      const dailyStart = new Date(Math.max(currentDayStart.getTime(), start.getTime()));
      const dailyEnd = new Date(Math.min(currentDayEnd.getTime(), end.getTime()));
  
      const dailyMillisecondsDifference = dailyEnd.getTime() - dailyStart.getTime();
      const dailyHours = Math.min(8, dailyMillisecondsDifference / (1000 * 60 * 60));
  
      totalHours += dailyHours;
    }
  
    return totalHours;
  }
}