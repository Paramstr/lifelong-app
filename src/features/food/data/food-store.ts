import { useMemo } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import type { Doc, Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

export type Ingredient = {
  id: string;
  name: string;
  imageUri?: string;
  quantity: number;
  unit:
    | "g"
    | "kg"
    | "oz"
    | "lb"
    | "ml"
    | "l"
    | "cup"
    | "tbsp"
    | "tsp"
    | "whole"
    | "serving";
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type FoodEntry = {
  id: string;
  imageUri?: string;
  status: "uploading" | "processing" | "completed" | "failed";
  createdAt: number;
  source: "camera" | "gallery";
  title?: string;
  mealType?: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  summary?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  ingredients?: Ingredient[];
};

const capitalizeMealType = (mealType?: string | null) => {
  if (!mealType) return undefined;
  return `${mealType[0]?.toUpperCase() ?? ""}${mealType.slice(1)}` as
    | "Breakfast"
    | "Lunch"
    | "Dinner"
    | "Snack";
};

const mapScanToEntry = (scan: Doc<"foodScans">): FoodEntry => ({
  id: scan._id,
  imageUri: scan.imageUrl ?? undefined,
  status: scan.status,
  createdAt: scan.createdAt,
  source: scan.source,
  title: scan.title ?? undefined,
  mealType: capitalizeMealType(scan.mealType),
  summary: scan.summary ?? undefined,
  ingredients:
    scan.ingredients?.map((ingredient, index) => ({
      id: `${scan._id}-${index}`,
      name: ingredient.name,
      imageUri: ingredient.imageUrl ?? undefined,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      calories: ingredient.calories,
      protein: ingredient.protein,
      carbs: ingredient.carbs,
      fat: ingredient.fat,
    })) ?? undefined,
});

export function useFoodEntries() {
  const scans = useQuery(api.foodScans.listForUser);
  return useMemo(() => (scans ?? []).map(mapScanToEntry), [scans]);
}

export function useFoodEntry(id?: string) {
  const scanId = id as Id<"foodScans"> | undefined;
  const scan = useQuery(
    api.foodScans.getById,
    scanId ? { scanId } : "skip",
  );
  return useMemo(() => (scan ? mapScanToEntry(scan) : undefined), [scan]);
}

export function useFoodScanActions() {
  const createFoodScan = useMutation(api.foodScans.createFoodScan);
  const analyzeFoodScan = useAction(api.foodScansNode.analyzeFoodScan);
  return { createFoodScan, analyzeFoodScan };
}
