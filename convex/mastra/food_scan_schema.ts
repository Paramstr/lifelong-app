import { z } from "zod";

export const mealTypeSchema = z.enum([
  "breakfast",
  "lunch",
  "dinner",
  "snack",
]);

export const unitSchema = z.enum([
  "g",
  "kg",
  "oz",
  "lb",
  "ml",
  "l",
  "cup",
  "tbsp",
  "tsp",
  "whole",
  "serving",
]);

export const ingredientSchema = z.object({
  name: z.string(),
  quantity: z.number(),
  unit: unitSchema,
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
});

export const macroSummarySchema = z.object({
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
});

export const foodScanSchema = z.object({
  title: z.string().nullable(),
  mealType: mealTypeSchema.nullable(),
  summary: macroSummarySchema,
  ingredients: z.array(ingredientSchema),
  confidence: z.number().min(0).max(1),
});

export type FoodScanOutput = z.infer<typeof foodScanSchema>;
