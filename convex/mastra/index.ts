import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { foodScanAgent } from "./agents/food-scan-agent";
import { foodScanWorkflow } from "./workflows/food-scan-workflow";

const storageUrl = process.env.MASTRA_DB_URL ?? "file:./mastra.db";

export const mastra = new Mastra({
  agents: { foodScanAgent },
  workflows: { foodScanWorkflow },
  storage: new LibSQLStore({ url: storageUrl }),
  telemetry: { enabled: false },
});
