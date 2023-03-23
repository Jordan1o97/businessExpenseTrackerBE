import { v4 as UUID } from "uuid";
import { getCurrentUserId } from "../../globals";

export class Job {
  id: string;
  start: Date;
  end?: Date;
  rate: number;
  income: number;
  project: string;
  clientId: string;
  taskId: string;
  notes: string;
  userId: string;

  constructor(
    start: Date,
    rate: number,
    income: number,
    project: string,
    clientId: string,
    taskId: string,
    notes: string,
    end?: Date,
  ) {
    this.id = UUID();
    this.start = start;
    this.end = end;
    this.rate = rate;
    this.income = income;
    this.project = project;
    this.clientId = clientId;
    this.taskId = taskId;
    this.notes = notes;
    this.userId = getCurrentUserId();
  }
}