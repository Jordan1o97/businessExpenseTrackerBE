import { Vehicle } from "../../DTO/Milage Log/Vehicle";
import { db } from "../../firebase";
import { getCurrentUserId } from "../../globals";

export class VehicleService {
  private vehicleCollection = db.collection("vehicles");

  async addVehicle(vehicle: Vehicle): Promise<void> {
    await this.vehicleCollection.doc(vehicle.id).set({
      ...vehicle,
      userId: getCurrentUserId(),
    });
    console.log(`Vehicle with id ${vehicle.id} added successfully.`);
  }

  async getVehicleById(vehicleId: string): Promise<Vehicle | undefined> {
    const vehicleDoc = await this.vehicleCollection.doc(vehicleId).get();
    const vehicle = vehicleDoc.data() as Vehicle | undefined;
    return vehicle;
  }

  async getVehiclesByUserId(userId: string): Promise<Vehicle[]> {
    const querySnapshot = await this.vehicleCollection.where("userId", "==", userId).get();
    const vehicles: Vehicle[] = [];
    querySnapshot.forEach((doc) => {
      const vehicle = doc.data() as Vehicle;
      vehicles.push(vehicle);
    });
    console.log(`Found ${vehicles.length} vehicles for user with id ${userId}.`);
    return vehicles;
  }

  async updateVehicle(id: string, vehicleData: Vehicle): Promise<void> {
    const vehicleRef = this.vehicleCollection.doc(id);
    
    // Convert the vehicleData object to a plain JavaScript object
    const plainVehicleData = JSON.parse(JSON.stringify(vehicleData));
    
    await vehicleRef.set(plainVehicleData, { merge: true });
    console.log(`Vehicle with id ${id} has been updated.`);
  }

  async deleteVehicle(vehicleId: string): Promise<void> {
    await this.vehicleCollection.doc(vehicleId).delete();
    console.log(`Vehicle with id ${vehicleId} deleted.`);
  }
}