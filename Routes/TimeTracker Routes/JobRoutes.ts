import { Router } from "express";
import { Job } from "../../DTO/TimeTrackor/Job";
import { JobService } from "../../Services/TimeTracker/JobService";
import { addJobs } from "../../Populator/TimeTracker/JobPopulator";
import { ClientService } from "../../Services/ClientService";
import { Client } from "../../DTO/Client";
import moment from "moment";
import { verifyToken } from "../../verify";

const jobRoutes = Router();
const jobService = new JobService();
const clientService = new ClientService();

 //JOB:

  // Get all jobs for the current user
  jobRoutes.get("/jobs/user/:userId", verifyToken, async (req, res) => {
    try {
      const { userId } = req.params;
      const jobs = await jobService.getJobsByUserId(userId);
      res.json(jobs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get job by ID
  jobRoutes.get("/jobs/:id", verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      const job = await jobService.getJobById(id);
      if (!job) {
        res.status(404).json({ message: `Job with id ${id} not found` });
      } else {
        res.json(job);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Create job
  jobRoutes.post("/jobs", verifyToken, async (req, res) => {
    try {
      const { start, rate, income, project, clientId, taskId, notes, end } = req.body;
      const job = new Job(start, rate, income, project, clientId, taskId, notes, end);
      await jobService.addJob(job);
      res.json(job);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Update job
  jobRoutes.put("/jobs/:id", verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      const existingJob = await jobService.getJobById(id);
      if (!existingJob) {
        res.status(404).json({ message: `Job with id ${id} not found` });
      } else {
        const { start, rate, income, project, clientId, taskId, notes, end } = req.body;
        existingJob.start = start;
        existingJob.rate = rate;
        existingJob.income = income;
        existingJob.project = project;
        existingJob.clientId = clientId;
        existingJob.taskId = taskId;
        existingJob.notes = notes;
        existingJob.end = end;
        await jobService.updateJob(existingJob);
        res.json(existingJob);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Delete job
  jobRoutes.delete("/jobs/:id", verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      await jobService.deleteJob(id);
      res.json({ message: `Job with id ${id} deleted successfully` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Populate jobs
  jobRoutes.post("/jobs/populate", verifyToken, async (req, res) => {
    try {
      await addJobs();
      res.json({ message: "Jobs populated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Sort Jobs by Day:
jobRoutes.get("/jobs/user/:userId/daily", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Get start and end date from query parameters
    const startDateString = req.body.startDate as string;
    const endDateString = req.body.endDate as string;

    let startDate: Date | undefined;
    let endDate: Date | undefined;

    // Parse start and end date strings
    if (startDateString) {
      startDate = new Date(startDateString);
    }
    if (endDateString) {
      endDate = new Date(endDateString);
    }

    // Get all jobs for the current user within the date range
    const jobs = await jobService.getJobsByUserId(userId);
    const jobsInRange = jobs.filter((job) => {
      if (!startDate && !endDate) {
        return true;
      } else if (startDate && !endDate) {
        return moment(job.start).isSameOrAfter(startDate, "day");
      } else if (!startDate && endDate) {
        return moment(job.start).isSameOrBefore(endDate, "day");
      } else {
        return moment(job.start).isBetween(startDate, endDate, "day", "[]");
      }
    });

    // Create object to hold jobs sorted by day
    const jobsByDay: Record<string, { jobs: { [key: string]: any }[] }> = {};

    // Loop through each job
    for (const job of jobsInRange) {
      // If the job start date exists, add it to the appropriate day in the jobsByDay object
      if (job.start) {
        const startDay = moment(job.start).format("YYYY-MM-DD");
        if (!jobsByDay[startDay]) {
          jobsByDay[startDay] = { jobs: [] };
        }
        jobsByDay[startDay].jobs.push({
          ...job,
          start: new Date(job.start).toISOString(),
          end: job.end ? new Date(job.end).toISOString() : undefined,
        });
      }
    }

    // Send the jobsByDay object as JSON response
    res.json(jobsByDay);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

  // Sort Jobs By Date(Month)
  jobRoutes.get("/jobs/user/:userId/monthly", verifyToken, async (req, res) => {
    try {
      const { userId } = req.params;

      // Get all jobs for the current user
      const jobs = await jobService.getJobsByUserId(userId);

      // Create object to hold jobs with startStops sorted by month
      const jobsByMonth: Record<string, { jobs: { [key: string]: any }[] }> = {};

      // Loop through each job
      for (const job of jobs) {
        const startMonth = moment(job.start).format("MMMM YYYY");
        if (!jobsByMonth[startMonth]) {
          jobsByMonth[startMonth] = { jobs: [] };
        }
        jobsByMonth[startMonth].jobs.push({
          ...job,
          start: new Date(job.start).toISOString(),
          end: job.end ? new Date(job.end).toISOString() : undefined,
        });
      }

      // Send the jobsByMonth object as JSON response
      res.json(jobsByMonth);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Sort Jobs By Date(Year)
  jobRoutes.get("/jobs/user/:userId/yearly", verifyToken, async (req, res) => {
    try {
      const { userId } = req.params;

      // Get all jobs for the current user
      const jobs = await jobService.getJobsByUserId(userId);

      // Create object to hold jobs sorted by year
      const jobsByYear: Record<string, { jobs: { [key: string]: any }[] }> = {};

      // Loop through each job
      for (const job of jobs) {
        const startYear = new Date(job.start).getFullYear();
        const yearKey = `${startYear}`;
        if (!jobsByYear[yearKey]) {
          jobsByYear[yearKey] = { jobs: [] };
        }
        jobsByYear[yearKey].jobs.push({
          ...job,
          start: new Date(job.start).toISOString(),
          end: job.end ? new Date(job.end).toISOString() : undefined,
        });
      }

      // Send the jobsByYear object as JSON response
      res.json(jobsByYear);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  //Sort Jobs By Project Name
  jobRoutes.get("/jobs/user/:userId/projects", async (req, res) => {
    try {
      const { userId } = req.params;
      const jobs = await jobService.getJobsByUserId(userId);
      const jobsByProject: Record<string, any[]> = {};
  
      for (const job of jobs) {
        const project = job.project;
        if (project) {
          if (!jobsByProject[project]) {
            jobsByProject[project] = [];
          }
          jobsByProject[project].push(job);
        }
      }
  
      const sortedGroups = Object.entries(jobsByProject)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
  
      res.json(sortedGroups);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  //Sort Jobs By Cient Name

  jobRoutes.get("/jobs/user/:userId/clients", verifyToken, async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Get all jobs for the current user
      const jobs = await jobService.getJobsByUserId(userId);
  
      // Create object to hold jobs grouped by client
      const jobsByClient: Record<string, any[]> = {};
  
      // Loop through each job
      for (const job of jobs) {
        // Get the client for the current job
        const client = await clientService.getClientById(job.clientId);
  
        // If the client exists, group the job by the client's company name
        if (client) {
          const companyName = client.name;
          if (!jobsByClient[companyName]) {
            jobsByClient[companyName] = [];
          }
          jobsByClient[companyName].push(job);
        }
      }
  
      // Sort the groups by client company name
      const sortedKeys = Object.keys(jobsByClient).sort();
  
      // Create object to hold sorted groups
      const sortedJobsByClient: Record<string, any[]> = {};
  
      // Loop through each sorted key and add the corresponding group to the sortedJobsByClient object
      for (const key of sortedKeys) {
        sortedJobsByClient[key] = jobsByClient[key];
      }
  
      // Send the sortedJobsByClient object as JSON response
      res.json(sortedJobsByClient);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  export default jobRoutes;