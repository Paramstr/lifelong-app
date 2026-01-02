import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const saveOnboardingData = mutation({
  args: {
    step: v.number(),
    data: v.object({
      fullName: v.optional(v.string()),
      age: v.optional(v.number()),
      gender: v.optional(v.string()),
      weight: v.optional(v.number()),
      weightUnit: v.optional(v.string()),
      ancestryOrigins: v.optional(v.array(v.string())),
      ancestryInfluence: v.optional(v.string()),
      allergies: v.optional(v.array(v.string())),
      customAllergies: v.optional(v.array(v.string())),
      sensitivities: v.optional(v.string()),
      dietaryBaseline: v.optional(v.string()),
      nutritionContext: v.optional(v.string()),
      nutritionTargets: v.optional(v.any()),
      completedAt: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      // If we are in debug mode, we might want to allow this or just fail silently?
      // Since we can't easily check env vars here (well, we can check process.env but it's server side),
      // and the prompt said "Disables DB writes" for the frontend flag.
      // We will assume that if this is called, it should be authenticated.
      // But for initial onboarding before signup? 
      // The plan says "Screen 1: SignInScreen". So users sign in early.
      throw new Error("Unauthorized");
    }

    const existing = await ctx.db
      .query("onboarding")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args.data,
        step: args.step,
      });
    } else {
      await ctx.db.insert("onboarding", {
        userId,
        step: args.step,
        ...args.data,
      });
    }
  },
});

export const getOnboardingData = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db
      .query("onboarding")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .unique();
  },
});
