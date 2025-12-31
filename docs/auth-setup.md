# Auth setup

This project uses Convex Auth in the app and Convex backend. The app supports Google OAuth and Apple native sign-in (iOS). The same auth flow is used in dev and prod; what changes is which OAuth credentials are used and what base URLs are configured.

## Where auth lives

- App entry: `app/_layout.tsx` with `ConvexAuthProvider`.
- Sign-in UI: `app/sign-in.tsx`.
- Token storage: `src/lib/convex-auth-storage.ts`.
- Convex backend: `convex/`.

## Environment files

### `convex/.env.local`
Local Convex uses `convex/.env.local` for provider secrets and app URLs. This file should not be committed.

Recommended shape (adjust to your project configuration in the Convex dashboard):

```
# OAuth provider secrets for dev
GOOGLE_CLIENT_ID=your-dev-google-client-id
GOOGLE_CLIENT_SECRET=your-dev-google-client-secret

# If using Apple in Convex (web flow)
APPLE_CLIENT_ID=your-apple-service-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
APPLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----

# App URL(s) allowed by Convex Auth for local dev
APP_URL=http://localhost:8081

# Optional dev bypass (local only)
DEV_AUTH_BYPASS=true
DEV_AUTH_EMAIL=dev@lifelong.app
DEV_AUTH_NAME="Lifelong Dev"
# Optional: require a token from the app when bypassing auth
DEV_AUTH_TOKEN=local-dev-token
```

Notes:
- The exact variable names should match what your Convex auth setup expects. If they differ, follow the names shown in the Convex dashboard or your existing Convex config.
- Keep provider secrets in `convex/.env.local` for local development only.

### Production
Production credentials live in the Convex dashboard (environment variables for the production deployment). Use production OAuth client IDs/secrets there.

## Dev vs prod behavior

- Dev: uses local Convex deployment and dev OAuth credentials.
- Prod: uses production Convex deployment and production OAuth credentials.
- The app code does not change between environments; it reads the Convex deployment via your app configuration.

## How to develop (account strategy)

Recommended approach:

- Use a small set of shared dev accounts for quick testing (e.g., `dev+1@lifelong.app`, `dev+2@lifelong.app`), with access controlled by the team.
- For personal feature work, use your own Google/Apple account if you need real-world identity data or Apple Sign In behaviors on device.
- Avoid using production accounts in dev.

If you want tighter control and deterministic testing, set up a dedicated "Lifelong Dev" Google workspace and Apple test accounts, then use those for all dev sign-ins.

### Dev bypass (optional)

You can enable a dev-only "Continue with Dev Account" button for fast local sign-in. This is gated by both app and server env vars:

- In the app: set `EXPO_PUBLIC_DEV_AUTH_BYPASS=true` (and optional `EXPO_PUBLIC_DEV_AUTH_TOKEN`).
- In Convex: set `DEV_AUTH_BYPASS=true` (and optional `DEV_AUTH_TOKEN` to match).

When enabled, the server creates/links a user with the email from `DEV_AUTH_EMAIL` (default `dev@lifelong.app`).

## Quick checklist

- Dev OAuth credentials exist and are in `convex/.env.local`.
- OAuth redirect URLs are configured in Google/Apple consoles to match your local/dev URLs.
- Convex Auth provider settings are configured for both dev and prod deployments.
- On iOS, Apple native sign-in is enabled in the app project and tested on device.
