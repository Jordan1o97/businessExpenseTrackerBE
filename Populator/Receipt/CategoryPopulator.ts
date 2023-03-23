import { Category } from "../../DTO/Receipt/Category";
import { CategoryService } from "../../Services/Receipt/CategoryService";

export async function addCategories(): Promise<void> {
    const defaultCategories: Category[] = [
        new Category( "Accommodation", ""),
        new Category( "Advertising", ""),
        new Category( "Airfare", ""),
        new Category( "Car Rental", ""),
        new Category( "Clothing", ""),
        new Category( "Communications", ""),
        new Category( "Entertainment", ""),
        new Category( "Food and Beverages", ""),
        new Category( "General", ""),
        new Category( "Groceries", ""),
        new Category( "Health", ""),
        new Category( "Office Supplies", ""),
        new Category( "Rent or Lease", ""),
        new Category( "Repairs and Maintenance", ""),
        new Category( "Shipping", ""),
        new Category( "Transportation", ""),
        new Category( "Travel", ""),
        new Category( "Utilities", ""),
    ];

  const categoryService = new CategoryService();

  for(var category of defaultCategories){
    await categoryService.addCategory(category);
  }
}