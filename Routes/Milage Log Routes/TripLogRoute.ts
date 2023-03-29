import { Router } from 'express';
import { TripLog } from '../../DTO/Milage Log/TripLog';
import { TripLogService } from '../../Services/Milage Log/TripLogService';
import { getCurrentUserId } from '../../globals';
import { VehicleService } from '../../Services/Milage Log/VehicleService';
import { ClientService } from '../../Services/ClientService';
import { verifyToken } from '../../verify';

const tripLogRoutes = Router();
const tripLogService = new TripLogService();
const vehicleService = new VehicleService();
const clientService = new ClientService();

// Get all trip logs for a user
tripLogRoutes.get("/triplog/user/:userId", verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId || getCurrentUserId();
    const tripLogs = await tripLogService.getTripLogsByUserId(userId);
    res.json(tripLogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get a trip log by id
tripLogRoutes.get("/triplog/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const tripLog = await tripLogService.getTripLogById(id);
    res.json(tripLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add a new trip log
tripLogRoutes.post('/triplogs', verifyToken, async (req, res) => {
  try {
    const {
      date,
      expense,
      start,
      end,
      totalHours,
      rate,
      vehicle,
      destination,
      origin,
      clientId,
      notes,
    } = req.body;
    const tripLog = new TripLog(
      date,
      expense,
      start,
      end,
      totalHours,
      rate,
      vehicle,
      destination,
      origin,
      clientId,
      notes,
    );
    await tripLogService.addTripLog(tripLog);
    res.json(tripLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a trip log
tripLogRoutes.put('/triplogs/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const existingTripLog = await tripLogService.getTripLogById(id);
    if (!existingTripLog) {
      res.status(404).json({ message: `Trip log with id ${id} not found` });
    } else {
      const {
        date,
        expense,
        start,
        end,
        totalHours,
        rate,
        vehicle,
        destination,
        origin,
        clientId,
        notes,
      } = req.body;
      existingTripLog.date = date;
      existingTripLog.expense = expense;
      existingTripLog.start = start;
      existingTripLog.end = end;
      existingTripLog.totalHours;
      existingTripLog.rate = rate;
      existingTripLog.vehicle = vehicle;
      existingTripLog.destination = destination;
      existingTripLog.origin = origin;
      existingTripLog.clientId = clientId;
      existingTripLog.notes = notes;
      await tripLogService.updateTripLog(existingTripLog);
      res.json(existingTripLog);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a trip log
tripLogRoutes.delete("/triplog/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    await tripLogService.deleteTripLog(id);
    res.json({ message: "Trip log deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// // Populate trip logs
// tripLogRoutes.post("/triplog/populate", verifyToken, async (req, res) => {
//   try {
//     await addTripLogs();
//     res.json({ message: "Trip logs populated successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

  // Return TripLog Daily:
  tripLogRoutes.get("/triplog/user/:userId/daily", verifyToken, async (req, res) => {
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
  
      // Get all trip logs for the current user within the date range
      const tripLogs = await tripLogService.getTripLogsByUserId(userId);
      const tripLogsInRange = tripLogs.filter((tripLog) => {
        if (!startDate && !endDate) {
          return true;
        } else if (startDate && !endDate) {
          return tripLog.date >= startDate;
        } else if (!startDate && endDate) {
          return tripLog.date <= endDate;
        } else {
          return tripLog.date >= startDate! && tripLog.date <= endDate!;
        }
      });
  
      // Create object to hold trip logs sorted by day
      const tripLogsByDay: Record<string, { tripLogs: any[] }> = {};
  
      // Loop through each trip log
      for (const tripLog of tripLogsInRange) {
        const tripLogDay = new Date(tripLog.date).toLocaleDateString();
        if (!tripLogsByDay[tripLogDay]) {
          tripLogsByDay[tripLogDay] = { tripLogs: [] };
        }
        tripLogsByDay[tripLogDay].tripLogs.push(tripLog);
      }
  
      // Sort the trip logs by date
      for (const dayKey in tripLogsByDay) {
        tripLogsByDay[dayKey].tripLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      }
  
      // Send the tripLogsByDay object as JSON response
      res.json(tripLogsByDay);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

// Get TripLog Monthly
tripLogRoutes.get("/triplog/user/:userId/monthly", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Get all trip logs for the current user
    const tripLogs = await tripLogService.getTripLogsByUserId(userId);

    // Create object to hold trip logs sorted by month
    const tripLogsByMonth: Record<string, { tripLogs: any[] }> = {};

    // Loop through each trip log
    for (const tripLog of tripLogs) {
      const tripLogMonth = new Date(tripLog.date).toLocaleString("default", { month: "long", year: "numeric" });
      if (!tripLogsByMonth[tripLogMonth]) {
        tripLogsByMonth[tripLogMonth] = { tripLogs: [] };
      }
      tripLogsByMonth[tripLogMonth].tripLogs.push(tripLog);
    }

    // Sort the trip logs by date
    for (const monthKey in tripLogsByMonth) {
      tripLogsByMonth[monthKey].tripLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    // Send the tripLogsByMonth object as JSON response
    res.json(tripLogsByMonth);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

  //Get TripLog Yearly

  tripLogRoutes.get("/triplog/user/:userId/yearly", verifyToken, async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Get all trip logs for the current user
      const tripLogs = await tripLogService.getTripLogsByUserId(userId);
  
      // Create object to hold trip logs sorted by year
      const tripLogsByYear: Record<string, { tripLogs: any[] }> = {};
  
      // Loop through each trip log
      for (const tripLog of tripLogs) {
        const tripLogYear = new Date(tripLog.date).getFullYear().toString();
        if (!tripLogsByYear[tripLogYear]) {
          tripLogsByYear[tripLogYear] = { tripLogs: [] };
        }
        tripLogsByYear[tripLogYear].tripLogs.push(tripLog);
      }
  
      // Sort the trip logs by date
      for (const yearKey in tripLogsByYear) {
        tripLogsByYear[yearKey].tripLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      }
  
      // Send the tripLogsByYear object as JSON response
      res.json(tripLogsByYear);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  //get triplogbyvehicle
  tripLogRoutes.get("/triplog/user/:userId/vehicles", verifyToken, async (req, res) => {
    try {
      const { userId } = req.params;

      // Get all trip logs for the current user
      const tripLogs = await tripLogService.getTripLogsByUserId(userId);

      // Create object to hold trip logs sorted by vehicle name
      const tripLogsByVehicle: Record<string, any[]> = {};

      // Loop through each trip log
      for (const tripLog of tripLogs) {
        // Get the vehicle for the current trip log
        const vehicle = await vehicleService.getVehicleById(tripLog.vehicle);
        console.log(tripLog.vehicle)

        // If the vehicle exists, add the trip log to the appropriate vehicle in the tripLogsByVehicle object
        if (vehicle) {
          const vehicleName = vehicle.name;
          if (!tripLogsByVehicle[vehicleName]) {
            tripLogsByVehicle[vehicleName] = [];
          }
          tripLogsByVehicle[vehicleName].push(tripLog);
        }
      }

      // Convert the tripLogsByVehicle object to an array of tuples
      const tripLogsByVehicleArray = Object.entries(tripLogsByVehicle);

      // Sort the trip logs by date for each vehicle
      for (const [vehicleName, logs] of tripLogsByVehicleArray) {
        logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      }

      // Send the result as JSON response
      res.json(tripLogsByVehicleArray);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });


 // Get Triplog by Client
tripLogRoutes.get("/triplog/user/:userId/clients", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Get all trip logs for the current user
    const tripLogs = await tripLogService.getTripLogsByUserId(userId);

    // Create an object to hold trip logs grouped by client company name
    const tripLogsByClientCompany: Record<string, any[]> = {};

    // Loop through each trip log
    for (const tripLog of tripLogs) {
      const client = await clientService.getClientById(tripLog.clientId);
      if (client) {
        const companyName = client.name;
        if (!tripLogsByClientCompany[companyName]) {
          tripLogsByClientCompany[companyName] = [];
        }
        tripLogsByClientCompany[companyName].push(tripLog);
      }
    }

    // Sort the groups by company name
    const sortedKeys = Object.keys(tripLogsByClientCompany).sort((a, b) =>
      a.toLowerCase() > b.toLowerCase() ? 1 : -1
    );
    const sortedTripLogsByClientCompany: Record<string, any[]> = {};
    for (const key of sortedKeys) {
      sortedTripLogsByClientCompany[key] = tripLogsByClientCompany[key];
    }

    // Send the sortedTripLogsByClientCompany object as JSON response
    res.json(sortedTripLogsByClientCompany);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});



export default tripLogRoutes;