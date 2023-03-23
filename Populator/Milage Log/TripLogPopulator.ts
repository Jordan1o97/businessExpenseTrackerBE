import { TripLog } from "../../DTO/Milage Log/TripLog";
import { TripLogService } from "../../Services/Milage Log/TripLogService";

export const addTripLogs = async (): Promise<void> => {
  const tripLogsToAdd: TripLog[] = [
    new TripLog(
      new Date("2022-03-01"),
      100.0,
      8,
      10,
      0.5,
      "car",
      "Los Angeles",
      "San Francisco",
      "be60ebd8-fac8-4e74-bccf-d1e74b179461",
      "Had a great meeting with the client, they loved our proposal."
    ),
    new TripLog(
      new Date("2022-03-02"),
      200.0,
      12,
      15,
      0.75,
      "car",
      "New York",
      "Boston",
      "be60ebd8-fac8-4e74-bccf-d1e74b179461",
      "Visited our partner company in New York and discussed new collaboration opportunities."
    ),
  ];

  const tripLogService = new TripLogService();

  for (const tripLog of tripLogsToAdd) {
    await tripLogService.addTripLog(tripLog);
  }
  console.log(`Added ${tripLogsToAdd.length} trip logs to the database.`);
};