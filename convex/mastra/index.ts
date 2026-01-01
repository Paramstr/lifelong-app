"use node";

import { Mastra } from "@mastra/core/mastra";
import { foodScanAgent } from "./agents/food_scan_agent";
import { foodScanWorkflow } from "./workflows/food_scan_workflow";

export const mastra = new Mastra({
  agents: { foodScanAgent },
  workflows: { foodScanWorkflow },
  telemetry: { enabled: false },
});
