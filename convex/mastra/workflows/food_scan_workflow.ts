 "use node";

import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { foodScanAgent } from "../agents/food_scan_agent";
import { foodScanSchema } from "../food_scan_schema";
import { normalizeFoodScanOutput } from "../normalize_food_scan";

const inputSchema = z.object({
  imageUrl: z.string().url(),
  imageMimeType: z.string().optional(),
});

const ingestStep = createStep({
  id: "ingest",
  inputSchema,
  outputSchema: inputSchema,
  execute: async ({ inputData }) => inputData,
});

const analyzeStep = createStep({
  id: "analyze",
  inputSchema,
  outputSchema: foodScanSchema,
  execute: async ({ inputData }) => {
    const prompt = [
      "Analyze the food in this image and estimate nutrition.",
      "",
      "Image:",
      inputData.imageUrl,
    ].join("\n");

    const result = await foodScanAgent.generate(prompt, {
      output: foodScanSchema,
    });

    return result.object;
  },
});

const validateStep = createStep({
  id: "validate",
  inputSchema: foodScanSchema,
  outputSchema: foodScanSchema,
  execute: async ({ inputData }) => normalizeFoodScanOutput(inputData),
});

export const foodScanWorkflow = createWorkflow({
  id: "foodScanWorkflow",
  inputSchema,
  outputSchema: foodScanSchema,
})
  .then(ingestStep)
  .then(analyzeStep)
  .then(validateStep)
  .commit();
