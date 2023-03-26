import { Router } from "express";
// import { addDummyData } from "../Populator/UserPopulator"
import { UserService } from "../Services/UserService";
import { User } from "../DTO/User";
import { getCurrentUserId, setCurrentUserId } from "../globals";
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';  
import { verifyToken } from "../verify";
import { addCategories } from "../Populator/Receipt/CategoryPopulator";
import { validateReceipt } from "../validateReceipt";

const userRoutes = Router();
const userService = new UserService();

//Initialize Secret:
const secret = '5cab09d219339bb519cb4fe771fb65e0a39acd61b59df25ddf767301f17dd104'

//USERS:  

userRoutes.post('/login', async (req, res) => {
  const { username, password } = req.body;
  // Verify user credentials
  const user = await userService.getUserByCredentials(username, password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  // Generate JWT token
  if (!secret) {
    throw new Error("JWT secret is not defined");
  }
  const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '2w' });
  res.json({ token, userId: user.id, accountType: user.accountType });
});

// userRoutes.get("/populateUser", async (req, res) => {
//     try {
//       await addDummyData();
//       res.send("Dummy data added successfully");
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Error adding dummy data");
//     }
//   });
  
  userRoutes.get('/users/:id', verifyToken, async (req, res) => {
      try {
        const { id } = req.params;
        const user = await userService.getUserById(id);
        if (!user) {
          res.status(404).json({ message: `User with id ${id} not found` });
        } else {
          res.json(user);
          setCurrentUserId(user.id);
          console.log(getCurrentUserId())
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }1
  });
  
  userRoutes.post('/users', async (req, res) => {
    try {
      const { accountType, username, password, name, companyName } = req.body;
  
      // Check if the email is already in use
      const existingUser = await userService.findUserByEmail(username);
      if (existingUser) {
        return res.status(409).json({ message: 'Email is already in use' });
      }
  
      const user = new User(uuidv4(), accountType, username, password, name, companyName);
      await userService.addUser(user, password);
      await addCategories();
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  userRoutes.put('/users/:id/paid', verifyToken, async (req, res) => {
    try {
      const userId = req.params.id;
      const accountType = 'paid'; // Set the account type to 'paid'
  
      // Find the user by their ID
      const existingUser = await userService.getUserById(userId);
  
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update the user's account type
      await userService.updateUserAccountType(userId, accountType);
      res.json({ message: `User with id ${userId} updated account type to ${accountType} successfully.` });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  userRoutes.put('/users/:id/free', verifyToken, async (req, res) => {
    try {
      const userId = req.params.id;
      const accountType = 'free'; // Set the account type to 'paid'
  
      // Find the user by their ID
      const existingUser = await userService.getUserById(userId);
  
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update the user's account type
      await userService.updateUserAccountType(userId, accountType);
      res.json({ message: `User with id ${userId} updated account type to ${accountType} successfully.` });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
    
  // DELETE /users/:id
  userRoutes.delete('/users/:id', verifyToken, async (req, res) => {
  try {
      const { id } = req.params;
      await userService.deleteUser(id);
      res.json({ message: `User with id ${id} deleted successfully.` });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
  });

  userRoutes.post('/validateReceipt', async (req, res) => {
    const receiptData = req.body.receiptData;
    console.log(req.body);

    try {
        const result = await validateReceipt(receiptData);

        if (result.success) {
            res.json({
                success: true,
                expiry_date: result.expiryDate
            });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

  export default userRoutes;

