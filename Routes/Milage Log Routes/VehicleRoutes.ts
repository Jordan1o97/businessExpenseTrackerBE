import { Router } from 'express';
import { Vehicle } from '../../DTO/Milage Log/Vehicle';
import { VehicleService } from '../../Services/Milage Log/VehicleService';
import { addVehicles } from '../../Populator/Milage Log/VehiclePopulatior';
import { verifyToken } from '../../verify';

const vehicleRoutes = Router();
const vehicleService = new VehicleService();

//VEHICLES

// Get all vehicles by user ID
  vehicleRoutes.get("/vehicles/user/:userId", verifyToken, async (req, res) => {
    try {
      const { userId } = req.params;
      const vehicles = await vehicleService.getVehiclesByUserId(userId);
      res.json(vehicles);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get a vehicle by ID
  vehicleRoutes.get("/vehicles/:id", verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      const vehicle = await vehicleService.getVehicleById(id);
      res.json(vehicle);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Add a new vehicle
  vehicleRoutes.post("/vehicles", verifyToken, async (req, res) => {
    try {
      const { name } = req.body;
      const vehicle = new Vehicle(name);
      await vehicleService.addVehicle(vehicle);
      res.json({ message: "Vehicle added successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Update a vehicle
  vehicleRoutes.put("/vehicles/:id", verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const vehicle = new Vehicle(name);
      await vehicleService.updateVehicle(id, vehicle);
      res.json({ message: "Vehicle updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Delete a vehicle
  vehicleRoutes.delete("/vehicles/:id", verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      await vehicleService.deleteVehicle(id);
      res.json({ message: "Vehicle deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Populate vehicles
  vehicleRoutes.post("/vehicles/populate", verifyToken, async (req, res) => {
    try {
      await addVehicles();
      res.json({ message: "Vehicles populated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

export default vehicleRoutes;