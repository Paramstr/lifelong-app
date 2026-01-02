import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

/** Shared macro summary shape used in UI and aggregates. */
const macroSummary = v.object({
  calories: v.number(),
  protein: v.number(),
  carbs: v.number(),
  fat: v.number(),
});

/** Ingredient detail attached to scans/analyses. */
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
    v.literal("serving")
  ),
  calories: v.number(),
  protein: v.number(),
  carbs: v.number(),
  fat: v.number(),
});

export default defineSchema({
  ...authTables,
  /** App user profile, linked to Convex Auth user. */
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    displayName: v.optional(v.string()),
    photoUrl: v.optional(v.string()),
    createdAt: v.number(),
    lastSeenAt: v.optional(v.number()),
  })
    .index("email", ["email"])
    .index("phone", ["phone"]),

  /** A single captured image + analysis lifecycle for the timeline. */
  foodScans: defineTable({
    userId: v.id("users"),
    /** Optional parent meal, if scans are grouped into one meal. */
    mealId: v.optional(v.id("meals")),
    /** Convex file storage reference for the image. */
    storageId: v.optional(v.id("_storage")),
    /** Optional cached URL for convenience on the client. */
    imageUrl: v.optional(v.string()),
    /** Processing status for the analysis pipeline. */
    status: v.union(
      v.literal("uploading"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    ),
    createdAt: v.number(),
    /** Timestamp for when analysis last completed. */
    lastAnalyzedAt: v.optional(v.number()),
    /** Source of capture. */
    source: v.union(v.literal("camera"), v.literal("gallery")),
    title: v.optional(v.string()),
    mealType: v.optional(
      v.union(
        v.literal("breakfast"),
        v.literal("lunch"),
        v.literal("dinner"),
        v.literal("snack")
      )
    ),
    /** Denormalized macros for timeline display. */
    calories: v.optional(v.number()),
    protein: v.optional(v.number()),
    carbs: v.optional(v.number()),
    fat: v.optional(v.number()),
    /** Optional summary object used in some UI views. */
    summary: v.optional(macroSummary),
    ingredients: v.optional(v.array(ingredient)),
  })
    .index("by_user_id", ["userId"])
    .index("by_user_id_created_at", ["userId", "createdAt"]),

  /** Raw analysis output for a scan, kept for detail/traceability. */
  foodAnalyses: defineTable({
    scanId: v.id("foodScans"),
    /** Current analysis status. */
    status: v.union(
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    ),
    /** Model-provided macro fields. */
    calories: v.optional(v.number()),
    protein: v.optional(v.number()),
    carbs: v.optional(v.number()),
    fat: v.optional(v.number()),
    ingredients: v.optional(v.array(ingredient)),
    confidence: v.optional(v.number()),
    /** Unstructured model payload for debugging/replay. */
    rawResponse: v.optional(v.any()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_scan_id", ["scanId"]),

  /** A user-owned meal that can group multiple scans. */
  meals: defineTable({
    userId: v.id("users"),
    /** Optional primary scan if one exists. */
    scanId: v.optional(v.id("foodScans")),
    title: v.optional(v.string()),
    mealType: v.optional(
      v.union(
        v.literal("breakfast"),
        v.literal("lunch"),
        v.literal("dinner"),
        v.literal("snack")
      )
    ),
    /** Optional macro summary for the meal. */
    summary: v.optional(macroSummary),
    createdAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_user_id_created_at", ["userId", "createdAt"]),

  /** Onboarding data linked to the user. */
  onboarding: defineTable({
    userId: v.id("users"),
    // Demographics
    fullName: v.optional(v.string()),
    age: v.optional(v.number()),
    gender: v.optional(v.string()),
    weight: v.optional(v.number()),
    weightUnit: v.optional(v.string()),

    // Ancestry
    ancestryOrigins: v.optional(v.array(v.string())),
    ancestryInfluence: v.optional(v.string()),

    // Dietary
    allergies: v.optional(v.array(v.string())),
    customAllergies: v.optional(v.array(v.string())),
    sensitivities: v.optional(v.string()),
    dietaryBaseline: v.optional(v.string()),
    nutritionContext: v.optional(v.string()),

    // Synthesis
    nutritionTargets: v.optional(
      v.object({
        calories: v.optional(v.number()),
        protein: v.optional(v.number()),
      })
    ),

    // Meta
    completedAt: v.optional(v.number()),
    step: v.number(),
  }).index("by_user_id", ["userId"]),
});
