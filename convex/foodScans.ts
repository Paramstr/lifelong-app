import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";

const macroSummary = v.object({
  calories: v.number(),
  protein: v.number(),
  carbs: v.number(),
  fat: v.number(),
});

const ingredient = v.object({
  name: v.string(),
  imageStorageId: v.optional(v.id("_storage")),
  imageUrl: v.optional(v.string()),
  quantity: v.number(),
  unit: v.union(
    v.literal("g"),
    v.literal("kg"),
    v.literal("oz"),
    v.literal("lb"),
    v.literal("ml"),
    v.literal("l"),
    v.literal("cup"),
    v.literal("tbsp"),
    v.literal("tsp"),
    v.literal("whole"),
    v.literal("serving"),
  ),
  calories: v.number(),
  protein: v.number(),
  carbs: v.number(),
  fat: v.number(),
});

async function requireUserId(ctx: { auth: { getUserIdentity: () => Promise<any> } }) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Authentication required.");
  }
  return userId as Id<"users">;
}

export const listForUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    return ctx.db
      .query("foodScans")
      .withIndex("by_user_id_created_at", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getById = query({
  args: { scanId: v.id("foodScans") },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const scan = await ctx.db.get(args.scanId);
    if (!scan || scan.userId !== userId) {
      return null;
    }
    return scan;
  },
});

export const createFoodScan = mutation({
  args: {
    imageUrl: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
    source: v.union(v.literal("camera"), v.literal("gallery")),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const now = Date.now();

    const scanId = await ctx.db.insert("foodScans", {
      userId,
      storageId: args.storageId,
      imageUrl: args.imageUrl,
      status: "processing",
      createdAt: now,
      source: args.source,
    });

    await ctx.db.insert("foodAnalyses", {
      scanId,
      status: "processing",
      createdAt: now,
      updatedAt: now,
    });

    return scanId;
  },
});

export const updateFromAnalysis = mutation({
  args: {
    scanId: v.id("foodScans"),
    status: v.union(v.literal("completed"), v.literal("failed")),
    analysis: v.optional(
      v.object({
        title: v.optional(v.string()),
        mealType: v.optional(
          v.union(
            v.literal("breakfast"),
            v.literal("lunch"),
            v.literal("dinner"),
            v.literal("snack"),
          ),
        ),
        summary: v.optional(macroSummary),
        ingredients: v.optional(v.array(ingredient)),
        confidence: v.optional(v.number()),
      }),
    ),
    rawResponse: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const scan = await ctx.db.get(args.scanId);
    if (!scan || scan.userId !== userId) {
      throw new Error("Scan not found.");
    }

    const now = Date.now();
    const analysisRow = await ctx.db
      .query("foodAnalyses")
      .withIndex("by_scan_id", (q) => q.eq("scanId", args.scanId))
      .first();

    if (analysisRow) {
      const analysisPatch: Record<string, unknown> = {
        status: args.status,
        rawResponse: args.rawResponse,
        updatedAt: now,
      };

      if (args.analysis?.summary) {
        analysisPatch.calories = args.analysis.summary.calories;
        analysisPatch.protein = args.analysis.summary.protein;
        analysisPatch.carbs = args.analysis.summary.carbs;
        analysisPatch.fat = args.analysis.summary.fat;
      }
      if (args.analysis?.ingredients) {
        analysisPatch.ingredients = args.analysis.ingredients;
      }
      if (args.analysis?.confidence !== undefined) {
        analysisPatch.confidence = args.analysis.confidence;
      }

      await ctx.db.patch(analysisRow._id, analysisPatch);
    }

    const scanPatch: Record<string, unknown> = {
      status: args.status === "completed" ? "completed" : "failed",
    };

    if (args.status === "completed") {
      scanPatch.lastAnalyzedAt = now;
    }
    if (args.analysis?.title !== undefined) {
      scanPatch.title = args.analysis.title;
    }
    if (args.analysis?.mealType !== undefined) {
      scanPatch.mealType = args.analysis.mealType;
    }
    if (args.analysis?.summary) {
      scanPatch.calories = args.analysis.summary.calories;
      scanPatch.protein = args.analysis.summary.protein;
      scanPatch.carbs = args.analysis.summary.carbs;
      scanPatch.fat = args.analysis.summary.fat;
      scanPatch.summary = args.analysis.summary;
    }
    if (args.analysis?.ingredients) {
      scanPatch.ingredients = args.analysis.ingredients;
    }

    await ctx.db.patch(args.scanId, scanPatch);
  },
});

export const deleteFoodScan = mutation({
  args: { scanId: v.id("foodScans") },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const scan = await ctx.db.get(args.scanId);
    if (!scan || scan.userId !== userId) {
      throw new Error("Scan not found.");
    }

    const analyses = await ctx.db
      .query("foodAnalyses")
      .withIndex("by_scan_id", (q) => q.eq("scanId", args.scanId))
      .collect();

    await Promise.all(analyses.map((analysis) => ctx.db.delete(analysis._id)));
    await ctx.db.delete(args.scanId);
  },
});
// analyzeFoodScan action lives in convex/foodScansNode.ts (Node runtime).
