import { v4 as uuidv4 } from 'uuid';
import { getCurrentUserId } from "../../globals";

export class Currency {
  id: string;
  name: string;
  symbol: string;
  userId: string;

  constructor(name: string, symbol: string) {
    this.id = uuidv4();
    this.name = name;
    this.symbol = symbol;
    this.userId = getCurrentUserId();
  }
}