import { ConvexReactClient } from "convex/react";

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  console.warn(
    "EXPO_PUBLIC_CONVEX_URL is not set; Convex client will be misconfigured.",
  );
}

export const convex = new ConvexReactClient(convexUrl ?? "");
