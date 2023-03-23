import { v4 as uuidv4 } from 'uuid';
import { getCurrentUserId } from '../../globals';

export class Vehicle {
  id: string;
  name: string;
  userId: string;

  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
    this.userId = getCurrentUserId();
  }
}
