import { Router } from 'express';
import { Category } from '../../DTO/Receipt/Category';
import { CategoryService } from '../../Services/Receipt/CategoryService';
import { addCategories } from '../../Populator/Receipt/CategoryPopulator';
import { getCurrentUserId } from '../../globals';
import { verifyToken } from '../../verify';

const categoryRoutes = Router();
const categoryService = new CategoryService();

//Categories:

// Get all categories for a user
  categoryRoutes.get("/categories/user/:userId", verifyToken, async (req, res) => {
    try {
      const userId = req.params.userId || getCurrentUserId();
      const categories = await categoryService.getCategoriesByUserId(userId);
      res.json(categories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get a category by id
  categoryRoutes.get("/categories/:id", verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      const category = await categoryService.getCategoryById(id);
      res.json(category);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Add a new category
  categoryRoutes.post("/categories", verifyToken, async (req, res) => {
    try {
      const { name, icon } = req.body;
      const category = new Category(name, icon);
      await categoryService.addCategory(category, getCurrentUserId());
      res.json({ message: "Category added successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Update a category
  categoryRoutes.put("/categories/:id", verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      const { name, icon } = req.body;
      const category = new Category(name, icon);
      await categoryService.updateCategory(id, category);
      res.json({ message: "Category updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Delete a category
  categoryRoutes.delete("/categories/:id", verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      await categoryService.deleteCategory(id);
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Populate categories
  categoryRoutes.post("/categories/populate", verifyToken, async (req, res) => {
    try {
      await addCategories(getCurrentUserId());
      res.json({ message: "Categories populated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

export default categoryRoutes;