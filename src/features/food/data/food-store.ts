import { useState, useEffect } from 'react';
import { Image } from 'react-native';

export type Ingredient = {
  id: string;
  name: string;
  imageUri: string | number; // Allow number for local requires in mock
  quantity: number;
  unit: 'g' | 'cup' | 'whole';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type FoodEntry = {
  id: string;
  imageUri: string | number;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  createdAt: number;
  source: 'camera' | 'gallery' | 'mock';

  title?: string;
  mealType?: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'; // Capitalized to match UI

  summary?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };

  ingredients?: Ingredient[];
};

// Initial Mock Data adapted from timeline-data.ts
const INITIAL_ENTRIES: FoodEntry[] = [
  {
    id: '1',
    createdAt: new Date().setHours(8, 10),
    status: 'completed',
    source: 'mock',
    mealType: 'Breakfast',
    title: 'Eggs with avocado on toast',
    imageUri: require('../../../../assets/images/eggs-avocado-toast.png'),
    summary: { calories: 500, protein: 30, carbs: 30, fat: 30 },
    ingredients: [
        { id: 'i1', name: 'Egg', imageUri: require('../../../../assets/images/eggs-avocado-toast.png'), quantity: 2, unit: 'whole', calories: 140, protein: 12, carbs: 0, fat: 10 },
        { id: 'i2', name: 'Avocado', imageUri: require('../../../../assets/images/eggs-avocado-toast.png'), quantity: 0.5, unit: 'whole', calories: 160, protein: 2, carbs: 9, fat: 15 },
    ]
  },
  {
    id: '3',
    createdAt: new Date().setHours(13, 30),
    status: 'completed',
    source: 'mock',
    mealType: 'Lunch', // Changed to Lunch based on time, though original data said Breakfast
    title: 'Chicken rice bowl',
    imageUri: require('../../../../assets/images/chicken-rice-bowl.png'),
    summary: { calories: 600, protein: 45, carbs: 40, fat: 60 },
  },
  {
    id: '4',
    createdAt: new Date().setHours(17, 30),
    status: 'completed',
    source: 'mock',
    mealType: 'Dinner',
    title: 'Chicken rice bowl',
    imageUri: require('../../../../assets/images/chicken-rice-bowl.png'),
    summary: { calories: 600, protein: 45, carbs: 40, fat: 60 },
  },
  {
    id: '5',
    createdAt: new Date().setHours(18, 30),
    status: 'completed',
    source: 'mock',
    mealType: 'Snack',
    title: 'Protein Shake',
    imageUri: require('../../../../assets/images/protein-shake.png'),
    summary: { calories: 300, protein: 24, carbs: 10, fat: 10 },
  },
];

class FoodStore {
  private entries: FoodEntry[] = [...INITIAL_ENTRIES];
  private listeners: (() => void)[] = [];

  constructor() {
    // Sort initial entries
    this.entries.sort((a, b) => b.createdAt - a.createdAt);
  }

  getEntries() {
    return this.entries;
  }

  getEntry(id: string) {
    return this.entries.find(e => e.id === id);
  }

  addFood(imageUri: string, source: 'camera' | 'gallery') {
    const newEntry: FoodEntry = {
      id: Date.now().toString(),
      imageUri,
      status: 'processing',
      createdAt: Date.now(),
      source,
    };
    
    this.entries = [newEntry, ...this.entries];
    this.notify();

    // Mock processing logic
    setTimeout(() => {
      this.updateEntry(newEntry.id, {
        status: 'completed',
        title: 'Analyzed Meal',
        mealType: 'Snack',
        summary: {
          calories: 420,
          protein: 35,
          carbs: 25,
          fat: 18,
        },
        ingredients: [
            { id: 'm1', name: 'Unknown Item', imageUri: newEntry.imageUri, quantity: 1, unit: 'whole', calories: 420, protein: 35, carbs: 25, fat: 18 }
        ]
      });
    }, 4000); // 4 seconds delay

    return newEntry.id;
  }

  updateEntry(id: string, updates: Partial<FoodEntry>) {
    this.entries = this.entries.map(e => e.id === id ? { ...e, ...updates } : e);
    this.notify();
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }
}

export const foodStore = new FoodStore();

export function useFoodEntries() {
  const [entries, setEntries] = useState(foodStore.getEntries());
  useEffect(() => foodStore.subscribe(() => setEntries(foodStore.getEntries())), []);
  return entries;
}

export function useFoodEntry(id: string) {
  const [entry, setEntry] = useState(foodStore.getEntry(id));
  
  useEffect(() => {
    setEntry(foodStore.getEntry(id));
    return foodStore.subscribe(() => setEntry(foodStore.getEntry(id)));
  }, [id]);

  return entry;
}
