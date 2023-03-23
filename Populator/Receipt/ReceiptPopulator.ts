import { Receipt } from "../../DTO/Receipt/Receipt";
import { ReceiptService } from "../../Services/Receipt/ReceiptService";

export const addReceipts = async (): Promise<void> => {
  const receiptsToAdd: Receipt[] = [
    new Receipt(
      "8a9c557b-77c2-4778-b2e9-1505f3823403",
      new Date("2022-03-01"),
      100.0,
      10.0,
      20.0,
      "be60ebd8-fac8-4e74-bccf-d1e74b179461",
      "cash",
      "Business trip to LA",
      "794eec6a-df12-4923-a8df-6d5921a41126"
    ),
    new Receipt(
      "b56c97a4-d80e-4a5c-a193-74df489fb52d",
      new Date("2022-02-28"),
      50.0,
      5.0,
      10.0,
      "be60ebd8-fac8-4e74-bccf-d1e74b179461",
      "credit card",
      "Purchased printer cartridges",
      "794eec6a-df12-4923-a8df-6d5921a41126"
    ),
    new Receipt(
      "b56c97a4-d80e-4a5c-a193-74df489fb52d",
      new Date("2022-02-27"),
      75.0,
      7.5,
      15.0,
      "be60ebd8-fac8-4e74-bccf-d1e74b179461",
      "debit card",
      "Dinner with clients",
      "794eec6a-df12-4923-a8df-6d5921a41126"
    ),
  ];

  const receiptService = new ReceiptService();

  for (const receipt of receiptsToAdd) {
    await receiptService.addReceipt(receipt);
  }
  console.log(`Added ${receiptsToAdd.length} receipts to the database.`);
};