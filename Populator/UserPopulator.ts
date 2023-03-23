// import { User } from "../DTO/User";
// import { v4 as uuidv4 } from 'uuid';
// import { UserService } from "../Services/UserService";

// export async function addDummyData(): Promise<void> {
//   // Add default currencies

//   //   const vehicles: Vehicle[] = [
//   //       new Vehicle(uuidv4(), "Toyota"),
//   //       new Vehicle(uuidv4(), "Honda"),
//   //       new Vehicle(uuidv4(), "Ford"),
//   //   ];

//   //   const locations: Location[] = [
//   //       new Location(uuidv4(), "Home", "123 Main St"),
//   //       new Location(uuidv4(), "Office", "456 1st St"),
//   //       new Location(uuidv4(), "Client Site", "789 Market St"),
//   //   ];

//   //   const rates: Rate[] = [
//   //       new Rate(uuidv4(), 0.5, 0.2, 0.8),
//   //       new Rate(uuidv4(), 0.5, 0.2, 0.8),
//   //       new Rate(uuidv4(), 0.5, 0.2, 0.8),
//   //   ];

//   //   const milages: Milage[] = [
//   //       new Milage(uuidv4(), 0, 100, rates[0]),
//   //       new Milage(uuidv4(), 100, 200, rates[1]),
//   //       new Milage(uuidv4(), 200, 300, rates[2]),
//   //   ];
    
//   //   const vendors: Vendor[] = [
//   //       new Vendor(uuidv4(), "Company A", "email@companya.com", "profileA"),
//   //       new Vendor(uuidv4(), "Company B", "email@companyb.com", "profileB"),
//   //       new Vendor(uuidv4(), "Company C", "email@companyc.com", "profileC")
//   //   ];
    
//   //   const profiles: Profile[] = [
//   //       new Profile(uuidv4(), "Profile A", defaultCurrencies[20], "John", "Doe", "email@profilea.com"),
//   //       new Profile(uuidv4(), "Profile B", defaultCurrencies[20], "Jane", "Doe", "email@profileb.com"),
//   //       new Profile(uuidv4(), "Profile C", defaultCurrencies[20], "Bob", "Smith", "email@profilec.com")
//   //   ];

//   //   const clients: Client[] = [
//   //       new Client(uuidv4(), "Client A", "email@clienta.com", "555-555-5555"),
//   //       new Client(uuidv4(), "Client B", "email@clientb.com", "555-555-5555"),
//   //       new Client(uuidv4(), "Client C", "email@clientc.com", "555-555-5555")
//   //   ];

//   //   // const jobs: Job[] = [
//   //   //     new Job(
//   //   //       uuidv4(),
//   //   //       startStops[0],
//   //   //       15,
//   //   //       150,
//   //   //       "Project A",
//   //   //       clients[0],
//   //   //       "Task A",
//   //   //       "Notes for Task A"
//   //   //     ),
//   //   //     new Job(
//   //   //       uuidv4(),
//   //   //       startStops[1],
//   //   //       20,
//   //   //       200,
//   //   //       "Project B",
//   //   //       clients[0],
//   //   //       "Task B",
//   //   //       "Notes for Task B"
//   //   //     ),
//   //   //     new Job(
//   //   //       uuidv4(),
//   //   //       startStops[2],
//   //   //       25,
//   //   //       250,
//   //   //       "Project C",
//   //   //       clients[0],
//   //   //       "Task C",
//   //   //       "Notes for Task C"
//   //   //     )
//   //   //   ];
      
//   //     const tripLogs: TripLog[] = [
//   //       new TripLog(
//   //         uuidv4(),
//   //         new Date(),
//   //         20,
//   //         milages[0],
//   //         vehicles[0],
//   //         new Location(uuidv4(), "Home", "123 Main St"),
//   //         new Location(uuidv4(), "Office", "456 1st St"),
//   //         clients[0],
//   //         "Trip A",
//   //         "Notes for Trip A"
//   //       ),
//   //       new TripLog(
//   //           uuidv4(),
//   //           new Date(),
//   //           20,
//   //           milages[0],
//   //           vehicles[0],
//   //           new Location(uuidv4(), "Home", "123 Main St"),
//   //           new Location(uuidv4(), "Office", "456 1st St"),
//   //           clients[0],
//   //           "Trip A",
//   //           "Notes for Trip A"
//   //         ),
//   //         new TripLog(
//   //           uuidv4(),
//   //           new Date(),
//   //           20,
//   //           milages[0],
//   //           vehicles[0],
//   //           new Location(uuidv4(), "Home", "123 Main St"),
//   //           new Location(uuidv4(), "Office", "456 1st St"),
//   //           clients[0],
//   //           "Trip A",
//   //           "Notes for Trip A"
//   //         )
//   //     ];
    
//   //     const receipts: Receipt[] = [
//   //       new Receipt(uuidv4(), defaultCategories[0], new Date(2022, 2, 1), 50.0, 2.5, 5.0, vendors[0], PaymentMode.CreditCard, "Some description", profiles[0]),
//   //       new Receipt(uuidv4(), defaultCategories[1], new Date(2022, 2, 2), 75.0, 3.75, 7.5, vendors[1], PaymentMode.Cash, "Another description", profiles[1]),
//   //       new Receipt(uuidv4(), defaultCategories[2], new Date(2022, 2, 3), 100.0, 5.0, 10.0, vendors[2], PaymentMode.PaperCheck, "Description", profiles[2])
//   //     ];

//       const user = new User(uuidv4(), "free", "Jordan Davis");

//       const userService = new UserService();

//       userService.addUser(user);
// }