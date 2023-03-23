import { Job } from "../../DTO/TimeTrackor/Job";
import { JobService } from "../../Services/TimeTracker/JobService";
import { v4 as uuidv4 } from 'uuid';

export async function addJobs(): Promise<void> {
  const job1 = new Job(new Date(), 100, 200, "Project 1", "be60ebd8-fac8-4e74-bccf-d1e74b179461", "Task 1", "Notes 1");
  const job2 = new Job(new Date(), 150, 300, "Project 2", "be60ebd8-fac8-4e74-bccf-d1e74b179461", "Task 2", "Notes 2");
  
  const jobService = new JobService();
  
  await jobService.addJob(job1);
  await jobService.addJob(job2);
}