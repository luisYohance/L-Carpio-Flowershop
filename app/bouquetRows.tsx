'use client';

type Listener = (val: any[]) => void;

export interface Bouquet {
  id?: number;  // Optional since new bouquets won't have an ID until saved
  label: string;
  image: string;
  price: number;
  flowers: {[key : string]: number}; // flower name and quantity
  consumables: string[]; //consumable name
}

export interface Row {
  id?: number;  // Optional since new rows won't have an ID until saved
  title: string;
  items: Bouquet[];
}

class BouquetStore {
  private _value: any[] = [];
  private _listeners: Listener[] = [];
  private _initialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init() {
    if (this._initialized) return;
    const stored = localStorage.getItem("bouquetRows");
    this._value = stored ? JSON.parse(stored) : [];
    this._initialized = true;
  }

  get value() {
    if (typeof window !== 'undefined' && !this._initialized) {
      this.init();
    }
    return this._value;
  }

  set(val: any[]) {
    this._value = val;
    if (typeof window !== 'undefined') {
      localStorage.setItem("bouquetRows", JSON.stringify(val));
    }
    this._listeners.forEach((listener) => listener(val));
  }

  onChange(listener: Listener) {
    this._listeners.push(listener);
  }
}

export const bouquetRows = new BouquetStore();