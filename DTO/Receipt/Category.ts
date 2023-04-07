import { v4 as uuidv4 } from 'uuid';
import { getCurrentUserId } from "../../globals";


export class Category {
  id: string;
  name: string;
  icon: string;
  userId: string;

  constructor(name: string, icon: string, userId: string) {
    this.id = uuidv4();
    this.name = name;
    this.icon = icon;
    this.userId = userId;
  }
}