# Convex Setup Plan (Food Scans + Users)

## Todo Snapshot
Done ✅
- Convex deps installed.
- Convex initialized in repo root.
- Local env files created for Convex + Expo.
- Dev backend running with `npx convex dev`.
- Define Convex schema and data model types (food + analysis + auth).
- Add Convex Auth server config + HTTP routes.
- Document required env vars + setup steps.
- Implement app-side auth UI and session handling.
  - Added `/sign-in` screen with OAuth flow.
  - Added Convex Auth provider in the app root.
  - Added redirect allowlist for app scheme.
  - Added Convex client + auth token storage.

In Progress ✅
- Auth testing (Google + Apple) on device/simulator.
  - Verify redirect flow completes and session persists.
  - Confirm correct deployment is used for dev.

Next
- Document dev environment + credentials for collaborators.
- Document dev auth workflow in `/docs` (provider setup, env vars, testing).
- Add seed/test data and basic data access patterns.
- Add a README for the final Convex + Auth setup.

## Goals
- Store users, food scans, meals, and AI analysis results in Convex.
- Keep API keys on the server (Convex actions).
- Mobile app reads/writes via Convex queries/mutations and auth.

## Proposed Data Model (Convex)
- users: profile, auth provider ids, preferences.
- foodScans: image metadata, status, userId, timestamps.
- foodAnalyses: macros, ingredients, confidence, raw model output, scanId.
- meals: normalized meal entries derived from analyses.

## Current Food Timeline Flow (UI Source of Truth)
- `FoodEntry` (from mock store) fields:
  - `id`, `imageUri`, `status`, `createdAt`, `source`.
  - `title`, `mealType`, `summary` (calories/protein/carbs/fat), `ingredients[]`.
- `Ingredient` fields:
  - `id`, `name`, `imageUri`, `quantity`, `unit`, macros.
- Timeline behavior:
  - Add food -> insert entry immediately with `processing` status.
  - Details screen is accessible immediately; analysis fills in later.

## Convex Schema Plan (Mapped to Current Flow)
- `foodScans` (source of truth for timeline):
  - `userId`, `storageId`, `status`, `createdAt`, `source`.
  - `title`, `mealType`, `summary`, `ingredients[]`.
- `foodAnalyses` (AI output, attached to a scan):
  - `scanId`, macros, ingredient breakdown, confidence, raw model response.
- `users` (profile + auth identity mapping):
  - `authUserId`, `displayName`, `email`, provider info, preferences.

## File Uploads (Convex Storage)
- Use Convex file storage for images.
- Store `storageId` on `foodScans`.
- Expose signed URLs or use `storage.getUrl(storageId)` in queries.

## Dev Setup ✅
1) Install Convex deps in the app workspace
   - `npm install convex @convex-dev/auth`
2) Initialize Convex in the repo root
   - `npx convex dev` (creates `convex/` and config)
3) Add Convex env for server-only secrets
   - `convex/.env.local` (e.g., `OPENAI_API_KEY=...`)
4) Add app env for the Convex client URL
   - `.env` (e.g., `EXPO_PUBLIC_CONVEX_URL=...`)
5) Start Convex dev backend
   - `npx convex dev` (keeps functions hot-reloading)

## Dev Environment (for collaborators)
- Required tools: Node, npm, Convex CLI, Expo CLI.
- Local env files:
  - `convex/.env.local` for server-only secrets.
  - `.env` for Expo client values.
- First-time setup:
  1) `npm install`
  2) `npx convex dev` (choose the correct team/project)
  3) Add env vars (see "Dev Credentials" below)
  4) Run the app with Expo (document the exact command here once finalized)

## Dev Credentials
- Keep provider secrets in `convex/.env.local` only.
- Keep public client values in `.env` (prefixed with `EXPO_PUBLIC_`).
- Share credentials via a secure channel; do not commit them.
- Add a short checklist for new collaborators:
  - Confirm Convex account/team access.
  - Create OAuth apps (Google/Apple) or request shared dev creds.
  - Verify redirect URLs in Convex Auth.
- Required Convex Auth env vars (server):
  - `CONVEX_SITE_URL`
  - `JWT_PRIVATE_KEY`
  - `JWKS`
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `APPLE_CLIENT_ID`
  - `APPLE_CLIENT_SECRET` (JWT client secret)

## App Connection (Expo)
- Use `ConvexProvider` with `ConvexReactClient` in the app root.
- Client reads `EXPO_PUBLIC_CONVEX_URL` for the deployment URL.
- Use `useQuery`/`useMutation` hooks for data access.

## Auth & “Auto Login”
- Convex does not auto-login via `.env` by default.
- Recommended: Convex Auth (email/OAuth), or integrate Clerk/Auth0.
- For local dev, you can add a “dev sign-in” path or test users.

## Convex Auth: Google + Apple
- Use Convex Auth OAuth providers for Google and Apple.
- Config lives in Convex Auth config (server) plus provider secrets in `convex/.env.local`.
- Google setup:
  - Create OAuth client in Google Cloud Console.
  - Add authorized redirect URI from Convex Auth.
  - Store `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `convex/.env.local`.
- Apple setup:
  - Create Apple Services ID and private key in Apple Developer.
  - Configure the Services ID redirect URI from Convex Auth.
  - Store `APPLE_CLIENT_ID`, `APPLE_TEAM_ID`, `APPLE_KEY_ID`, and `APPLE_PRIVATE_KEY` in `convex/.env.local`.
- App flow:
  - Use Convex Auth client helpers to trigger OAuth sign-in.
  - On success, Convex creates/updates the user record tied to the provider id.
 - Todo for this project:
  - Register Google OAuth app for dev and production.
  - Register Apple Services ID for dev and production.
  - Generate Apple client secret (JWT) and add provider secrets to `convex/.env.local`.
  - Add provider ids and redirect URLs to Convex Auth config.
  - Verify `CONVEX_SITE_URL` points to the correct deployment URL.
  - Ensure Convex Auth redirect allowlist includes the app scheme (e.g., `lifelongapp://`).

## README Plan (Final Setup)
- Include: setup steps, env vars, auth provider setup, dev workflow, and common pitfalls.
- Add a “new collaborator checklist” and “how to switch Convex accounts safely”.

## AI Analysis (GPT-5)
- Call GPT-5 from Convex `actions` (server-side).
- Keep the model API key in `convex/.env.local`.
- Action flow:
  1) App uploads image metadata -> `foodScans` mutation.
  2) App triggers `analyzeFoodScan` action.
  3) Action calls GPT-5, writes analysis to `foodAnalyses`.
  4) UI subscribes to results via query.

## Runtime Ownership
- Convex hosts the backend runtime: queries, mutations, actions, scheduling.
- Mobile app is a thin client with optimistic updates and subscriptions.

## Open Questions
- Preferred auth provider? (Convex Auth vs Clerk/Auth0)
- Do you want uploads stored in Convex file storage or S3?
- GPT-5 usage: single-step analysis or multi-pass (vision + nutrition)?
