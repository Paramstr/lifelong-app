"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { mastra } from "./mastra";

export const analyzeFoodScan = action({
  args: { scanId: v.id("foodScans") },
  handler: async (ctx, args) => {
    const startedAt = Date.now();
    const scan = await ctx.runQuery(api.foodScans.getById, {
      scanId: args.scanId,
    });
    if (!scan) {
      throw new Error("Scan not found.");
    }

    const imageUrl =
      scan.imageUrl ??
      (scan.storageId ? await ctx.storage.getUrl(scan.storageId) : null);

    if (!imageUrl) {
      const elapsedMs = Date.now() - startedAt;
      await ctx.runMutation(api.foodScans.updateFromAnalysis, {
        scanId: args.scanId,
        status: "failed",
        rawResponse: { error: "Missing image URL for analysis.", elapsedMs },
      });
      return { status: "failed" as const, elapsedMs };
    }

    try {
      const workflow = mastra.getWorkflow("foodScanWorkflow");
      const run = await workflow.createRunAsync({
        runId: `food-scan-${args.scanId}-${Date.now()}`,
      });
      const workflowResult = await run.start({
        inputData: { imageUrl },
      });

      if (workflowResult.status !== "success") {
        throw new Error("Food scan workflow did not complete.");
      }

      const output = workflowResult.result;
      const elapsedMs = Date.now() - startedAt;

      const analysis = {
        title: output.title ?? undefined,
        mealType: output.mealType ?? undefined,
        summary: output.summary,
        ingredients: output.ingredients,
        confidence: output.confidence,
      };

      await ctx.runMutation(api.foodScans.updateFromAnalysis, {
        scanId: args.scanId,
        status: "completed",
        analysis,
        rawResponse: { output, elapsedMs },
      });

      console.info("Food scan completed.", { scanId: args.scanId, elapsedMs });
      return { status: "completed" as const, analysis, elapsedMs };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const elapsedMs = Date.now() - startedAt;
      await ctx.runMutation(api.foodScans.updateFromAnalysis, {
        scanId: args.scanId,
        status: "failed",
        rawResponse: { error: message, elapsedMs },
      });
      console.warn("Food scan failed.", { scanId: args.scanId, elapsedMs, error: message });
      return { status: "failed" as const, error: message, elapsedMs };
    }
  },
});
