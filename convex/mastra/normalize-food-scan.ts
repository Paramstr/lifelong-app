import type { FoodScanOutput } from "./food-scan-schema";

const clampNumber = (value: number, min = 0, max = Number.POSITIVE_INFINITY) =>
  Math.min(max, Math.max(min, Number.isFinite(value) ? value : 0));

export function normalizeFoodScanOutput(raw: FoodScanOutput): FoodScanOutput {
  const ingredients = raw.ingredients.map((ingredient) => ({
    ...ingredient,
    quantity: clampNumber(ingredient.quantity),
    calories: clampNumber(ingredient.calories),
    protein: clampNumber(ingredient.protein),
    carbs: clampNumber(ingredient.carbs),
    fat: clampNumber(ingredient.fat),
  }));

  const summaryFromIngredients = ingredients.reduce(
    (totals, ingredient) => ({
      calories: totals.calories + ingredient.calories,
      protein: totals.protein + ingredient.protein,
      carbs: totals.carbs + ingredient.carbs,
      fat: totals.fat + ingredient.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  const confidence = clampNumber(raw.confidence, 0, 1);
  const shouldHideLabels = confidence < 0.4;

  return {
    title: shouldHideLabels ? null : raw.title ?? null,
    mealType: shouldHideLabels ? null : raw.mealType ?? null,
    ingredients,
    summary: {
      calories: clampNumber(summaryFromIngredients.calories),
      protein: clampNumber(summaryFromIngredients.protein),
      carbs: clampNumber(summaryFromIngredients.carbs),
      fat: clampNumber(summaryFromIngredients.fat),
    },
    confidence,
  };
}
