import { v4 as UUID } from "uuid";
import { getCurrentUserId } from "../../globals";

export class Job {
  id: string;
  start: Date;
  end: Date;
  rate: number;
  income: number;
  project: string;
  clientId: string;
  taskId: string;
  notes: string;
  userId: string;

  constructor(
    start: Date,
    end: Date,
    rate: number,
    project: string,
    clientId: string,
    taskId: string,
    notes: string,
  ) {
    this.id = UUID();
    this.start = start;
    this.end = end;
    this.rate = rate;
    this.income = rate * this.calculateHoursDifference(start, end);
    console.log(start, end, this.calculateHoursDifference(start, end))
    this.project = project;
    this.clientId = clientId;
    this.taskId = taskId;
    this.notes = notes;
    this.userId = getCurrentUserId();
  }

  calculateHoursDifference(start: Date, end: Date): number {
    const oneDayInMilliseconds = 1000 * 60 * 60 * 24;;
    const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  
    let daysDifference = (endDay.getTime() - startDay.getTime()) / oneDayInMilliseconds;
    daysDifference = Math.ceil(daysDifference); // Round up to the nearest whole day
    console.log("days: ", daysDifference)
  
    let totalHours = 0;
    for (let day = 0; day <= daysDifference; day++) {
      const currentDayStart = new Date(start.getTime() + day * oneDayInMilliseconds);
      const currentDayEnd = new Date(currentDayStart.getTime() + oneDayInMilliseconds);
  
      const dailyStart = new Date(Math.max(currentDayStart.getTime(), start.getTime()));
      const dailyEnd = new Date(Math.min(currentDayEnd.getTime(), end.getTime()));
  
      const dailyMillisecondsDifference = dailyEnd.getTime() - dailyStart.getTime();
      const dailyHours = Math.min(8, dailyMillisecondsDifference / (1000 * 60 * 60));
      const roundedHours = Math.round(dailyHours)
  
      totalHours += roundedHours;
      console.log("dailey hours: ", roundedHours);
    }
  
    return totalHours;
  }
}