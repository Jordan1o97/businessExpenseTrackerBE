import { Job } from "../../DTO/TimeTrackor/Job";
import { db } from "../../firebase";
import { getCurrentUserId } from "../../globals";
import moment from "moment";
import { firestore } from "firebase-admin";

export class JobService {
  private jobCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;

  constructor() {
    this.jobCollection = db.collection("jobs");
  }

  async addJob(job: Job): Promise<void> {
    const docRef = this.jobCollection.doc();
    await docRef.set({
      ...job,
      userId: getCurrentUserId(),
      end: job.end || null // ensure that "end" field is not undefined
    }, { merge: true });
    job.id = docRef.id;
    console.log(`Job with id ${docRef.id} added successfully.`);
  }

  async updateJob(job: Job): Promise<void> {
    await this.jobCollection.doc(job.id).set({
      ...job,
      userId: getCurrentUserId(),
    });
    console.log(`Job with id ${job.id} updated successfully.`);
  }

  async getJobById(jobId: string): Promise<Job | undefined> {
    const doc = await this.jobCollection.doc(jobId).get();
    if (doc.exists) {
      const job = doc.data() as Job;
      job.id = doc.id;
      if (job.start instanceof firestore.Timestamp) {
        job.start = moment.utc(job.start.toDate()).toDate();
      } else {
        job.start = moment.utc(job.start).toDate();
      }
      if (job.end instanceof firestore.Timestamp) {
        job.end = moment.utc(job.end.toDate()).toDate();
      } else if (job.end) {
        job.end = moment.utc(job.end).toDate();
      }
      return job;
    } else {
      console.log(`Job with id ${jobId} not found.`);
      return undefined;
    }
  }

  async deleteJob(jobId: string): Promise<void> {
    await this.jobCollection.doc(jobId).delete();
    console.log(`Job with id ${jobId} deleted successfully.`);
  }

  async getJobsByUserId(userId: string): Promise<Job[]> {
    const querySnapshot = await this.jobCollection.where("userId", "==", userId).get();
    const jobs: Job[] = [];
    querySnapshot.forEach((doc) => {
      const job = doc.data() as Job;
      job.id = doc.id;
      if (job.start instanceof firestore.Timestamp) {
        job.start = moment.utc(job.start.toDate()).toDate();
      } else {
        job.start = moment.utc(job.start).toDate();
      }
      if (job.end instanceof firestore.Timestamp) {
        job.end = moment.utc(job.end.toDate()).toDate();
      } else if (job.end) {
        job.end = moment.utc(job.end).toDate();
      }
      jobs.push(job);
    });
    console.log(`Found ${jobs.length} jobs for user with id ${userId}.`);
    return jobs;
  }
}