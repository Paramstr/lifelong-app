# Lifelong App

## Getting Started

### Prerequisites
- Node.js
- Xcode (latest recommended)
- CocoaPods

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