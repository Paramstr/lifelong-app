# GPT-5 Food Scan Workflow (Mastra)

## Linear TODOs (Move to Top)
- [ ] Decide Mastra file location (`convex/mastra/` vs `src/mastra/`).
- [ ] Choose storage provider and configure persistence.
- [ ] Define Zod schema + strict prompt for structured output.
- [ ] Implement workflow steps + wire to Convex actions.
- [ ] Verify the app shows data from Convex end-to-end.
- [ ] Add observability (Studio + hosted traces) after core functionality is complete.

## Sequencing Note
Core functionality comes first: build the food analysis workflow, integrate Convex, and ensure data renders in the app. Observability (Studio + hosted dashboard on Vercel / Mastra Cloud) is explicitly deferred until the end of the plan.

## Goal
Build a deterministic, observable food photo analysis pipeline using Mastra workflows + agents, integrated into the existing Convex-backed data model.

## Docs Reference (Mastra)
- Agents overview (setup, image input, structured output): `agents/overview.mdx`
- Workflows overview (steps, flow, registration): `workflows/overview.mdx`
- Storage configuration (persistence + traces): `server-db/storage.mdx`
- Conversation memory (message window): `memory/conversation-history.mdx`
- RAG overview (optional grounding): `rag/overview.mdx`

## Repo Placement
Choose one of the following and keep it consistent:
- Preferred: `convex/mastra/` for server-side AI logic co-located with Convex actions.
- Alternative: `src/mastra/` if you want AI logic alongside app modules.

Recommended file layout:
- `convex/mastra/index.ts` (Mastra instance registration)
- `convex/mastra/agents/food-scan-agent.ts`
- `convex/mastra/workflows/food-scan-workflow.ts`
- `convex/mastra/tools/` (only if we add custom tools)

## Dependencies + Env
Install packages (from `agents/overview.mdx` and `server-db/storage.mdx`):
- `@mastra/core`
- One storage provider (for persistence + traces): `@mastra/libsql` (local) or `@mastra/pg` (prod)
- A model provider (e.g., `@ai-sdk/openai`) if using the AI SDK client

Env vars (example for OpenAI):
- `OPENAI_API_KEY=...`

## Data Contract (Source of Truth)
Schema references:
- `convex/schema.ts`
- `plans/convex-setup.md`
- `plans/food-logging-feature.md`

Fields to extract:
- `title`: string or null
- `mealType`: `breakfast | lunch | dinner | snack` or null
- `summary`: calories, protein, carbs, fat (numbers)
- `ingredients[]`: name, quantity, unit, calories, protein, carbs, fat
- `confidence`: number between 0 and 1

Allowed units:
- `g`, `kg`, `oz`, `lb`, `ml`, `l`, `cup`, `tbsp`, `tsp`, `whole`, `serving`

## Workflow Shape (Mastra)
Use a single Mastra workflow with explicit steps (from `workflows/overview.mdx`):
1) **Ingest**: accept `foodScans` image reference (URL or storage ID).
2) **Analyze**: call the agent with image + prompt (from `agents/overview.mdx` image input).
3) **Validate**: normalize units + numbers, enforce schema.
4) **Persist**: write raw response + normalized fields to Convex.
5) **Finalize**: set `foodScans.status` to `completed` or `failed`.

## Agent Design (Mastra)
Create a dedicated food scan agent (from `agents/overview.mdx`):
- Use a strict system instruction with schema rules.
- Use `structuredOutput` with Zod for type-safe JSON.
- Include the image as `{ type: "image", image: "...", mimeType: "image/jpeg" }` in the content array.

## Storage + Observability (Defer to End)
Configure Mastra storage (from `server-db/storage.mdx`) so workflows can be resumed and traces persist across restarts:
- Local dev: `LibSQLStore({ url: "file:./mastra.db" })`
- Prod: `PostgreSQLStore` or equivalent

Observability plan:
- Enable Mastra tracing/logging for workflow steps + model calls.
- Decide exporter: Mastra Cloud vs OTEL/Langfuse/Braintrust.
Note: Observability setup is intentionally last, after core workflow + Convex integration is working.

## Single-Pass GPT-5 Structured Output
Use a single pass with strict schema. Use Zod `structuredOutput` to guarantee shape, and run post-parse validation for business rules.

Rules:
- Only allowed units.
- Numeric macros (no strings).
- `summary` should approximately match ingredient totals.
- If low confidence, set `title`/`mealType` to null and lower `confidence`.

## Failure + Edge Cases
- Low-quality images: return minimal ingredient list, set low confidence.
- Composite dishes: keep ingredient list short unless clearly visible.
- Hard errors: mark `foodScans.status = failed` and store error for retry.

## Open Questions
- Single-pass GPT-5 vs two-pass (vision detection then nutrition estimation)?
- Preferred production exporter (Mastra Cloud vs OTEL/Langfuse/Braintrust)?

## End-of-Plan: Studio + Vercel + Hosted Traces (Do Last)
Goal: run Studio locally for development, and host the Mastra server on Vercel with traces visible in a hosted dashboard.

Local Studio (dev-only):
- Run `mastra dev` or `npm run dev` to launch Studio locally.
- Use Studio to test agents/workflows and validate traces after core functionality is stable.

Hosted on Vercel (after core workflow + Convex integration):
- Deploy the Mastra server to Vercel as a standard Node service.
- Ensure env vars are set for your model provider and storage.

Hosted traces/observability:
- Use Mastra Cloud for hosted tracing (recommended for easiest setup).
- Set `MASTRA_CLOUD_ACCESS_TOKEN` and enable `observability.default`.
- Keep `DefaultExporter` if you want Studio traces locally and `CloudExporter` for hosted traces.
- Confirm traces appear under Mastra Cloud Dashboard -> Observability -> Traces.
