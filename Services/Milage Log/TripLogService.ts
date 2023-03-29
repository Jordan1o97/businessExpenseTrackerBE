import { TripLog } from "../../DTO/Milage Log/TripLog";
import { db } from "../../firebase";
import { getCurrentUserId } from "../../globals";
import moment from 'moment';
import { firestore } from "firebase-admin";

export class TripLogService {
  private tripLogCollection = db.collection("tripLog");

  async addTripLog(tripLog: TripLog): Promise<void> {
    await this.tripLogCollection.doc(tripLog.id).set({
      ...tripLog,
      userId: getCurrentUserId(),
    });
    console.log(`TripLog with id ${tripLog.id} added successfully.`);
  }

  async getTripLogById(tripLogId: string): Promise<TripLog | undefined> {
    const tripLogDoc = await this.tripLogCollection.doc(tripLogId).get();
    const tripLog = tripLogDoc.data() as TripLog | undefined;
    return tripLog;
  }

  async getTripLogsByUserId(userId: string): Promise<TripLog[]> {
    const querySnapshot = await this.tripLogCollection.where("userId", "==", userId).get();
    const tripLogs: TripLog[] = [];
    querySnapshot.forEach((doc) => {
      const tripLogData = doc.data();
      let date;
      let start;
      let end;
      if (tripLogData.date instanceof firestore.Timestamp) {
          date = tripLogData.date.toDate();
      } else if (moment(tripLogData.date, moment.ISO_8601, true).isValid()) {
          date = moment.utc(tripLogData.date).toDate();
      } else if (moment(tripLogData.date, 'MMMM D, YYYY [at] h:mm:ss A Z', true).isValid()) {
          date = moment.utc(tripLogData.date, 'MMMM D, YYYY [at] h:mm:ss A Z').toDate();
      } else if (moment(tripLogData.date, 'YYYY-MM-DDTHH:mm:ssZ', true).isValid()) {
          date = moment.utc(tripLogData.date, 'YYYY-MM-DDTHH:mm:ssZ').toDate();
      } else {
          console.error(`Invalid date format for trip log with ID ${tripLogData.id}`);
          return;
      }

      if (tripLogData.start instanceof firestore.Timestamp) {
        start = tripLogData.start.toDate();
      } else if (moment(tripLogData.start, moment.ISO_8601, true).isValid()) {
          start = moment.utc(tripLogData.start).toDate();
      } else if (moment(tripLogData.start, 'MMMM D, YYYY [at] h:mm:ss A Z', true).isValid()) {
          start = moment.utc(tripLogData.start, 'MMMM D, YYYY [at] h:mm:ss A Z').toDate();
      } else if (moment(tripLogData.start, 'YYYY-MM-DDTHH:mm:ssZ', true).isValid()) {
          start = moment.utc(tripLogData.start, 'YYYY-MM-DDTHH:mm:ssZ').toDate();
      } else {
          console.error(`Invalid date format for trip log with ID ${tripLogData.id}`);
          return;
      }

      if (tripLogData.end instanceof firestore.Timestamp) {
        end = tripLogData.end.toDate();
      } else if (moment(tripLogData.end, moment.ISO_8601, true).isValid()) {
        end = moment.utc(tripLogData.end).toDate();
      } else if (moment(tripLogData.end, 'MMMM D, YYYY [at] h:mm:ss A Z', true).isValid()) {
        end = moment.utc(tripLogData.end, 'MMMM D, YYYY [at] h:mm:ss A Z').toDate();
      } else if (moment(tripLogData.end, 'YYYY-MM-DDTHH:mm:ssZ', true).isValid()) {
        end = moment.utc(tripLogData.end, 'YYYY-MM-DDTHH:mm:ssZ').toDate();
      } else {
          console.error(`Invalid date format for trip log with ID ${tripLogData.id}`);
          return;
      }

      console.log(tripLogData);

      const tripLog = new TripLog(
        date,
        tripLogData.expense,
        start,
        end,
        tripLogData.totalHours,
        tripLogData.rate,
        tripLogData.vehicle,
        tripLogData.destination,
        tripLogData.origin,
        tripLogData.clientId,
        tripLogData.notes
      );
      tripLog.id = tripLogData.id;
      tripLog.userId = tripLogData.userId;
      tripLogs.push(tripLog);
    });
    console.log(`Found ${tripLogs.length} trip logs for user with id ${userId}.`);
    return tripLogs;
  }

  async updateTripLog(tripLog: TripLog): Promise<void> {
    console.log(tripLog.id)
    await this.tripLogCollection.doc(tripLog.id).set({
      ...tripLog,
      userId: getCurrentUserId(),
    });
    console.log(`TripLog with id ${tripLog.id} updated successfully.`);
  }

  async deleteTripLog(tripLogId: string): Promise<void> {
    await this.tripLogCollection.doc(tripLogId).delete();
    console.log(`TripLog with id ${tripLogId} deleted.`);
  }
}