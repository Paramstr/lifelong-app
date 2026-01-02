/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as foodScans from "../foodScans.js";
import type * as foodScansNode from "../foodScansNode.js";
import type * as http from "../http.js";
import type * as mastra_agents_food_scan_agent from "../mastra/agents/food_scan_agent.js";
import type * as mastra_food_scan_schema from "../mastra/food_scan_schema.js";
import type * as mastra_index from "../mastra/index.js";
import type * as mastra_normalize_food_scan from "../mastra/normalize_food_scan.js";
import type * as mastra_workflows_food_scan_workflow from "../mastra/workflows/food_scan_workflow.js";
import type * as onboarding from "../onboarding.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  foodScans: typeof foodScans;
  foodScansNode: typeof foodScansNode;
  http: typeof http;
  "mastra/agents/food_scan_agent": typeof mastra_agents_food_scan_agent;
  "mastra/food_scan_schema": typeof mastra_food_scan_schema;
  "mastra/index": typeof mastra_index;
  "mastra/normalize_food_scan": typeof mastra_normalize_food_scan;
  "mastra/workflows/food_scan_workflow": typeof mastra_workflows_food_scan_workflow;
  onboarding: typeof onboarding;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
