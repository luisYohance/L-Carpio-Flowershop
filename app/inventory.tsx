'use client';

const Consumables = [
  "Wrapper",
  "Silk",
  "Ribbon",
  "Sequins",
  "Glitter"
]

type Listener = (val: {[key : string] : number}) => void;

class inventoryClass {
  private _flowers: { [key : string] : number } = {};
  private _listeners: Listener[] = [];
  private _initialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private async init() {
    if (this._initialized) return;
    
    try {
      const res = await fetch("/api/inventory");
      if (!res.ok) throw new Error("Failed to fetch inventory");
      
      const data = await res.json();
      
      // Initialize flowers directly from database data
      this._flowers = data.flowers.reduce((result: {[key: string]: number}, flower: any) => {
        result[flower.name] = flower.quantity;
        return result;
      }, {});

      this._initialized = true;
      this._listeners.forEach((listener) => listener(this._flowers));
    } catch (error) {
      console.error("Error initializing inventory:", error);
      // Fallback to empty inventory
      this._flowers = {};
      this._initialized = true;
    }
  }

  get flowers() {
    if (typeof window !== 'undefined' && !this._initialized) {
      this.init();
    }
    return this._flowers;
  }

  get consumables() {
    return Consumables;
  }

  async removeFlower(flower: string, quantity: number) {
    const newQuantity = (this.flowers[flower]||0)-quantity;
    await this.setFlower(flower, newQuantity);
  }

  async addFlower(flower: string, quantity: number) {
    const newQuantity = (this.flowers[flower]||0)+quantity;
    await this.setFlower(flower, newQuantity);
  }

  async setFlower(flower: string, quantity: number) {
    try {
      const res = await fetch("/api/inventory", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: flower, quantity }),
      });

      if (!res.ok) throw new Error("Failed to update inventory");

      const data = await res.json();
      // Update flowers with the latest data from the database
      this._flowers = data.flowers.reduce((result: {[key: string]: number}, flower: any) => {
        result[flower.name] = flower.quantity;
        return result;
      }, {});
      
      this._listeners.forEach((listener) => listener(this._flowers));
    } catch (error) {
      console.error("Error updating flower quantity:", error);
      throw error;
    }
  }

  onChange(listener: Listener) {
    this._listeners.push(listener);
  }
}

export const inventory = new inventoryClass();