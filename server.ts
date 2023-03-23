import express from "express";
import * as admin from "firebase-admin";
import routes from "./routes";
import clientRoutes from "./Routes/ClientRoutes";
import tripLogRoutes from "./Routes/Milage Log Routes/TripLogRoute";
import vehicleRoutes from "./Routes/Milage Log Routes/VehicleRoutes";
import categoryRoutes from "./Routes/Receipt Routes/CategoryRoutes";
import currencyRoutes from "./Routes/Receipt Routes/CurrencyRoutes";
import receiptRoutes from "./Routes/Receipt Routes/ReceiptRoutes";
import jobRoutes from "./Routes/TimeTracker Routes/JobRoutes";
import userRoutes from "./Routes/UserRoutes";
import bodyParser from 'body-parser';

// Initialize Express server
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Register routes
app.use(
  "/", 
  routes, 
  tripLogRoutes, 
  vehicleRoutes, 
  categoryRoutes, 
  currencyRoutes, 
  receiptRoutes, 
  jobRoutes, 
  clientRoutes, 
  userRoutes
);


// Start the server
app.listen(port, () => {
  console.log(`Business Expense Tracker started on port ${port}`);
});