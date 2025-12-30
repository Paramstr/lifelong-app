# Lifelong App

## Getting Started

### Prerequisites
- Node.js
- Xcode (latest recommended)
- CocoaPods

### Choose Xcode Toolchain (stable vs beta)
Liquid Glass requires the iOS 26 beta toolchain (Swift 6.2). Use these commands to switch the active Xcode before building:
- Stable (Xcode 16.2):  
  ```bash
  sudo xcode-select -s /Applications/Xcode.app
  xcodebuild -version
  ```
- Beta (Xcode 26 beta):  
  ```bash
  sudo xcode-select -s "/Applications/Xcode-beta.app"
  xcodebuild -version
  ```
After switching toolchains, rebuild native assets so pods pick up the active Xcode:
```bash
npx expo prebuild --clean
(cd ios && pod install)
```
Then run a fresh install:
```bash
npx expo run:ios --no-build-cache
```

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. (Optional) Configure Helper Script:
   The app uses a helper script located at `scripts/run-ios.sh` to boot the simulator and run the app. It attempts to auto-detect your environment.
   
   If you need to override defaults (e.g., specific Simulator UDID), create `ios/.simulator.env.local`:
   ```bash
   # ios/.simulator.env.local
   export SIM_UDID="YOUR-SIMULATOR-UDID"
   export DEVELOPER_DIR="/Applications/Xcode.app/Contents/Developer"
   ```

### Convex + Auth Setup
1. Start the Convex dev backend:
   ```bash
   npx convex dev
   ```
2. Ensure required env vars are set:
   - `convex/.env.local` (server-only):
     - `CONVEX_SITE_URL`
     - `JWT_PRIVATE_KEY`
     - `JWKS`
     - `AUTH_GOOGLE_ID`
     - `AUTH_GOOGLE_SECRET`
     - `AUTH_APPLE_ID`
     - `AUTH_APPLE_SECRET`
   - `.env` (client):
     - `EXPO_PUBLIC_CONVEX_URL`

3. OAuth provider setup:
   - Google: create OAuth client and add Convex Auth redirect URL.
   - Apple: generate the client secret (JWT) and add Convex Auth redirect URL.

### Convex Auth Files
- `convex/auth.ts` configures Google + Apple providers.
- `convex/auth.config.ts` is required by Convex Auth setup.
- `convex/http.ts` registers Auth HTTP routes.
- `convex/schema.ts` includes Convex Auth tables + app tables.

### Auth Testing
- Open the `sign-in` screen (route: `/sign-in`) to test Google/Apple OAuth.
- Tokens are stored in memory for now; replace with SecureStore before production.
- OAuth redirects are allowlisted in `convex/auth.ts` (app scheme must be permitted).

### Auth Config Status
- Dev ✅ `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_APPLE_ID`, `AUTH_APPLE_SECRET`
- Prod ✅ `AUTH_APPLE_ID`, `AUTH_APPLE_SECRET`

### Running the App

#### 1. Development Build (Fast Iteration) 🚀
We use `expo-dev-client` for daily development. This allows you to work without rebuilding the native app every time.

**Step A: Build & Install (Do this once)**
Builds the native app and installs it on your simulator.
```bash
npm run ios:clean
```

**Step B: Daily Development**
Once the app is installed, just start the Metro server.
```bash
npx expo start
```
- Press `i` to open in the simulator.
- You can now hot-reload changes instantly without recompiling native code.

*Note: You only need to repeat "Step A" if you install new native libraries.*

#### 2. Nuclear Option (Reset Everything)
Use this if you encounter deep linking or caching issues.
```bash
npm run ios:nuke
```

### Architecture
- **Framework**: React Native (Expo)
- **Navigation**: Expo Router (File-based routing in `app/`)
- **Structure**: Feature-based architecture in `src/`
