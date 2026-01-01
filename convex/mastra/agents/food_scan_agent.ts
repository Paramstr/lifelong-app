 "use node";

import { Agent } from "@mastra/core/agent";

export const foodScanAgent = new Agent({
  name: "FoodScanAgent",
  instructions: [
    "You are a food photo analysis assistant.",
    "Return concise, structured nutrition estimates for the visible meal.",
    "Prefer fewer, high-confidence ingredients over long speculative lists.",
    "If confidence is low, keep title/mealType null and lower confidence.",
    "All numeric values must be numbers, not strings.",
    "Respond with JSON only when asked for structured output.",
  ].join("\n"),
  model: "google/gemini-3-flash-preview",
});
