# Convex Setup Plan (Food Scans + Users)

## Goals
- Store users, food scans, meals, and AI analysis results in Convex.
- Keep API keys on the server (Convex actions).
- Mobile app reads/writes via Convex queries/mutations and auth.

## Proposed Data Model (Convex)
- users: profile, auth provider ids, preferences.
- foodScans: image metadata, status, userId, timestamps.
- foodAnalyses: macros, ingredients, confidence, raw model output, scanId.
- meals: normalized meal entries derived from analyses.

## Dev Setup
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
