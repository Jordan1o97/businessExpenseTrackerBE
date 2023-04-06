import { Category } from "../../DTO/Receipt/Category";
import { db } from "../../firebase";
import { getCurrentUserId } from "../../globals";

export class CategoryService {
  private categoryCollection = db.collection("categories");

  async addCategory(category: Category, userId: String): Promise<void> {
    const docRef = await this.categoryCollection.add({
      ...category,
      userId: getCurrentUserId(),
    });
    console.log(`Category with id ${category.id} added successfully.`);
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
    const userId = getCurrentUserId();
  
    const categoryDoc = await categoryRef.get();
    if (!categoryDoc.exists) {
      throw new Error(`Category with id ${categoryId} does not exist.`);
    }
  
    const category = categoryDoc.data() as Category;
    if (category.userId !== userId) {
      throw new Error(`Category with id ${categoryId} does not belong to current user.`);
    }
  
    await categoryRef.update({
      ...categoryData,
      userId: userId,
    });
    console.log(`Category with id ${categoryId} has been updated.`);
  }

  async deleteCategory(categoryId: string): Promise<void> {
    await this.categoryCollection.doc(categoryId).delete();
    console.log(`Category with id ${categoryId} deleted.`);
  }
}