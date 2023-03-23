import { Vehicle } from "../../DTO/Milage Log/Vehicle";
import { VehicleService } from "../../Services/Milage Log/VehicleService";

export async function addVehicles(): Promise<void> {
  const vehicle1 = new Vehicle("Ford Mustang");
  const vehicle2 = new Vehicle("Tesla Model 3");

  const vehicleService = new VehicleService();

  await vehicleService.addVehicle(vehicle1);
  await vehicleService.addVehicle(vehicle2);
}