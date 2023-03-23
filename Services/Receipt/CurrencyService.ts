import { Currency } from "../../DTO/Receipt/Currency";
import { db } from "../../firebase";
import { getCurrentUserId } from "../../globals";

export class CurrencyService {
  private currencyCollection = db.collection("currencies");

  async addCurrency(currency: Currency): Promise<void> {
    const docRef = await this.currencyCollection.add({
      ...currency,
      userId: getCurrentUserId(),
    });
    console.log(`Currency with id ${currency.id} added successfully.`);
  }

  async getCurrencyById(currencyId: string): Promise<Currency | undefined> {
    const currencyDoc = await this.currencyCollection.doc(currencyId).get();
    const currency = currencyDoc.data() as Currency | undefined;
    return currency;
  }

  async getCurrenciesByUserId(userId: string): Promise<Currency[]> {
    const querySnapshot = await this.currencyCollection.where("userId", "==", userId).get();
    const currencies: Currency[] = [];
    querySnapshot.forEach((doc) => {
      const currency = doc.data() as Currency;
      currencies.push(currency);
    });
    console.log(`Found ${currencies.length} currencies for user with id ${userId}.`);
    return currencies;
  }

  async updateCurrency(id: string, currencyData: Currency): Promise<void> {
    const currencyRef = this.currencyCollection.doc(id);
    await currencyRef.set(currencyData, { merge: true });
    console.log(`Currency with id ${id} has been updated.`);
  }

  async deleteCurrency(currencyId: string): Promise<void> {
    await this.currencyCollection.doc(currencyId).delete();
    console.log(`Currency with id ${currencyId} deleted.`);
  }
}