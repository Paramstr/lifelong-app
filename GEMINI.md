# Lifelong App (Liquid Glass) - Developer Context

## Project Overview
**Lifelong App** (also referred to as "Liquid Glass" due to its design language) is a personal longevity application built with **React Native** and **Expo**. It focuses on a high-fidelity, native-feeling user experience using advanced UI techniques like glass-morphism and smooth animations.

## Tech Stack
*   **Framework:** React Native (Expo SDK 52+)
*   **Language:** TypeScript
*   **Navigation:** Expo Router (File-based routing in `app/`)
*   **Styling:**
    *   **Unistyles:** Primary styling engine (`react-native-unistyles`).
    *   **Tailwind/NativeWind:** Used in some contexts (e.g., `tailwind-merge`, `clsx`).
*   **UI/UX:**
    *   **Glass:** `expo-glass-effect` for translucent materials.
    *   **Animations:** `react-native-reanimated` (v4).
    *   **Graphics:** `@shopify/react-native-skia`.
    *   **Icons:** SF Symbols via `expo-symbols`.
    *   **Fonts:** `SpaceMono` (custom).
*   **Dev Tools:** `@react-buoy/*` suite for debugging.

## Architecture
*   **`app/`**: Contains the Expo Router file-based routes.
    *   `_layout.tsx`: Root layout with `@react-buoy` dev tools integration.
    *   `(tabs)/`: Main tab navigation (`index`, `health`, `family`, `more`).
    *   `protocol/[id].tsx`: Modal screen for protocol details.
*   **`src/`**: Source code for the application logic and components.
    *   `features/`: Feature-based organization (e.g., `family`, `health`, `home`, `more`).
    *   `components/`: Shared UI components.
    *   `constants/`: App-wide constants (Colors, etc.).
    *   `theme/`: Unistyles theme definition.
    *   `unistyles.ts`: Unistyles configuration entry point.
*   **`ios/` & `android/`**: Native project directories (managed by Prebuild).

## Design Guidelines ("Aero & Glass")
*   **Philosophy:** Calm, Optimistic, High-Fidelity.
*   **Key Element:** **Glass View** (`<GlassView glassEffectStyle="regular" />`).
    *   Used for cards, headers, and primary containers.
    *   Relies on content behind it for separation (no shadows on glass).
*   **Typography:** SF Pro (Native iOS font).
*   **Colors:**
    *   Primary: Deep Grey (`#222`)
    *   Family Identity: Red, Green, Blue, Purple.

## Development Workflow

### Prerequisites
*   Node.js
*   Xcode (16.2 Stable or 26 Beta for specific Liquid Glass features).
*   CocoaPods.

### Build & Run
*   **Install Dependencies:** `npm install`
*   **Clean Native Build:** `npm run ios:clean` (Required when native deps change).
    *   *Note:* Uses `scripts/run-ios.sh` to manage simulator booting.
*   **Start Dev Server:** `npx expo start` (or `npm run dev` for dev client).
    *   Press `i` to open in Simulator.
*   **Reset:** `npm run ios:nuke` (Nuclear option for deep linking/caching issues).

### Conventions
*   **Imports:** Use absolute imports where possible (configured in `tsconfig.json`).
*   **Styling:** Prefer `Unistyles` for performant, dynamic styling.
*   **Navigation:** Use typed routes from Expo Router.
*   **Components:** Small, focused components. Feature-specific components go in `src/features/<feature>/components`.

## Key Files
*   `app/_layout.tsx`: Root provider setup (GestureHandler, Buoy DevTools).
*   `src/unistyles.ts`: Styling system configuration.
*   `DESIGN.md`: Detailed design system documentation.
*   `app.json`: Expo configuration (Bundle ID: `com.param.lifelongapp`).
*   `plugins/withPodfileDeploymentTarget.js`: Custom Expo Config plugin for iOS deployment target (18.0).

## Useful Commands
*   `npm run ios`: Runs the iOS app.
*   `npm run ios:clean`: Rebuilds the native iOS app.
