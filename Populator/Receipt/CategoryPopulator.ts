import { Category } from "../../DTO/Receipt/Category";
import { CategoryService } from "../../Services/Receipt/CategoryService";

export async function addCategories(userId: String): Promise<void> {
    const defaultCategories: Category[] = [
        new Category( "Accommodation", "https://firebasestorage.googleapis.com/v0/b/icubemedia-expensetracker.appspot.com/o/category_images%2FArtboard%2021.png?alt=media&token=4bf56f53-fde7-483c-ab16-def88eacb188"),
        new Category( "Advertising", "https://firebasestorage.googleapis.com/v0/b/icubemedia-expensetracker.appspot.com/o/category_images%2FArtboard%2011.png?alt=media&token=2066eb10-09bc-49aa-b6be-152630adabbc"),
        new Category( "Airfare", "https://firebasestorage.googleapis.com/v0/b/icubemedia-expensetracker.appspot.com/o/category_images%2FArtboard%2020.png?alt=media&token=7cdae04d-c0fb-4158-a69e-d13548eacab6"),
        new Category( "Car Rental", "https://firebasestorage.googleapis.com/v0/b/icubemedia-expensetracker.appspot.com/o/category_images%2FArtboard%209.png?alt=media&token=c383a2db-bc7c-46cb-85d3-7d78de8c1dea"),
        new Category( "Clothing", "https://firebasestorage.googleapis.com/v0/b/icubemedia-expensetracker.appspot.com/o/category_images%2FArtboard%2019.png?alt=media&token=afa2904f-984d-4704-8f91-ac7ee57edc47"),
        new Category( "Communications", "https://firebasestorage.googleapis.com/v0/b/icubemedia-expensetracker.appspot.com/o/category_images%2FArtboard%2017.png?alt=media&token=d32abe68-4cde-44df-bd5e-3bd2d9bb7453"),
        new Category( "Entertainment", "https://firebasestorage.googleapis.com/v0/b/icubemedia-expensetracker.appspot.com/o/category_images%2FArtboard%2016.png?alt=media&token=15bdc24d-54b8-4e56-a40a-589f89d54dcb"),
        new Category( "Food and Beverages", "https://firebasestorage.googleapis.com/v0/b/icubemedia-expensetracker.appspot.com/o/category_images%2FArtboard%2015.png?alt=media&token=e22f517c-7a42-4e6a-a174-36e194dfd35b"),
        new Category( "General", "https://firebasestorage.googleapis.com/v0/b/icubemedia-expensetracker.appspot.com/o/category_images%2FArtboard%2014.png?alt=media&token=b778b2bd-ebe0-49c1-9842-7231798f1450"),
        new Category( "Groceries", "https://firebasestorage.googleapis.com/v0/b/icubemedia-expensetracker.appspot.com/o/category_images%2FArtboard%2013.png?alt=media&token=d68c7051-6d78-453d-ab5a-06dbe7081bb4"),
        new Category( "Health", "https://firebasestorage.googleapis.com/v0/b/icubemedia-expensetracker.appspot.com/o/category_images%2FArtboard%2012.png?alt=media&token=7d4b75d0-e789-4ce0-b129-2a28c7dc3cdf"),
        new Category( "Office Supplies", "https://firebasestorage.googleapis.com/v0/b/icubemedia-expensetracker.appspot.com/o/category_images%2FArtboard%2010.png?alt=media&token=fa3238a0-38de-487f-91b9-8bb8c1e6fdd6"),
        new Category( "Rent or Lease", "https://firebasestorage.googleapis.com/v0/b/icubemedia-expensetracker.appspot.com/o/category_images%2FArtboard%208.png?alt=media&token=6ceeebb7-bdf7-4728-b7bb-546d86857457"),
        new Category( "Repairs and Maintenance", "https://firebasestorage.googleapis.com/v0/b/icubemedia-expensetracker.appspot.com/o/category_images%2FArtboard%207.png?alt=media&token=e6e5e466-d200-4b1e-9a04-2ad8ea16f996"),
        new Category( "Shipping", "https://firebasestorage.googleapis.com/v0/b/icubemedia-expensetracker.appspot.com/o/category_images%2FArtboard%206.png?alt=media&token=e1d9c464-311f-4623-bb6a-7ca21c566cde"),
        new Category( "Transportation", "https://firebasestorage.googleapis.com/v0/b/icubemedia-expensetracker.appspot.com/o/category_images%2FArtboard%205.png?alt=media&token=4cc975e0-9090-4158-88e7-8449201094df"),
        new Category( "Travel", "https://firebasestorage.googleapis.com/v0/b/icubemedia-expensetracker.appspot.com/o/category_images%2FArtboard%204.png?alt=media&token=715cd6fd-99cc-48e6-a00a-27b061d8e049"),
        new Category( "Utilities", "https://firebasestorage.googleapis.com/v0/b/icubemedia-expensetracker.appspot.com/o/category_images%2FArtboard%201.png?alt=media&token=e0f85328-6881-4bcc-90e2-bfa1c46263f0"),
    ];

  const categoryService = new CategoryService();

  for(var category of defaultCategories){
    await categoryService.addCategory(category, userId);
  }
}