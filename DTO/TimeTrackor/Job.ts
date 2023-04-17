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
    this.income = rate * this.calculateTimeDifference(start, end);
    console.log(start, end, this.calculateTimeDifference(start, end))
    this.project = project;
    this.clientId = clientId;
    this.taskId = taskId;
    this.notes = notes;
    this.userId = getCurrentUserId();
  }

  calculateTimeDifference(start: Date, end: Date): number {
    const millisecondsDifference = end.getTime() - start.getTime();
    const hoursDifference = millisecondsDifference / (1000 * 60 * 60);
    const roundedHoursDifference = Math.round(hoursDifference);
  
    return roundedHoursDifference;
  }

  
}