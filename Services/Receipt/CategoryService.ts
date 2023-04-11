import { Category } from "../../DTO/Receipt/Category";
import { db } from "../../firebase";
import { getCurrentUserId } from "../../globals";

export class CategoryService {
  private categoryCollection = db.collection("categories");

  async addCategory(category: Category, userId: string): Promise<void> {
    const docRef = await this.categoryCollection.add({
      ...category,
      userId: userId,
    });
    console.log(`Category with id ${category.id} for user with id ${userId} added successfully.`);
  }

  async getCategoryById(categoryId: string): Promise<Category | undefined> {
    const query = await this.categoryCollection.where("id", "==", categoryId).get();
    if (!query.empty) {
      const categoryDoc = query.docs[0];
      const category = categoryDoc.data() as Category | undefined;
      return category;
    }
    return undefined;
  }

  async getCategoriesByUserId(userId: string): Promise<Category[]> {
    const querySnapshot = await this.categoryCollection.where("userId", "==", userId).get();
    const categories: Category[] = [];
    querySnapshot.forEach((doc) => {
      const category = doc.data() as Category;
      categories.push(category);
    });
    console.log(`Found ${categories.length} categories for user with id ${userId}.`);
    return categories;
  }

  async updateCategory(categoryId: string, categoryData: Category): Promise<void> {
    const categoryRef = this.categoryCollection.doc(categoryId);
    // Convert the vehicleData object to a plain JavaScript object
    const plainCategoryData = JSON.parse(JSON.stringify(categoryData));
    
    await categoryRef.set(plainCategoryData, { merge: true });
    console.log(`Category with id ${categoryId} has been updated.`);
  }

  async deleteCategory(categoryId: string): Promise<void> {
    await this.categoryCollection.doc(categoryId).delete();
    console.log(`Category with id ${categoryId} deleted.`);
  }
}