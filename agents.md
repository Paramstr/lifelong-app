## Lifelong — personal longevity app

Lifelong is a React Native app (Expo + Expo Router + Expo UI) focused on personalized longevity: it guides users through research-grounded, pragmatic protocols tailored to the individual.

### Project layout
- `app/`: Expo Router native tab routes and entry screens (Home, Health, Social, More); routing stays here.
- `src/`: All feature and shared code:
  - `features/`: Screen implementations per domain (e.g., home, health, social, more).
  - `components/`: Shared UI pieces.
  - `utils/`, `constants/`: Cross-cutting helpers and values.
- `assets/`: Images and static assets.
- `run-ios-beta.sh`: Convenience script to run the iOS beta build.

### UI approach
- Uses Expo UI native components and native tabs for platform-aligned navigation.
- React Native + Expo libraries for animations, gestures, and styling.

### Install & run
1) Install deps: `npm install`
2) Start dev server: `npm start`
3) iOS beta runner: `./run-ios-beta.sh`

### Feature planning convention (living structure)
- `plans/` (top-level planning home)
  - `01-feature-name/`, `02-feature-name/`, …
    - Keep names short and clear; numbering reflects order.
- This document is a living reference and is automatically attached to chats to keep context on app purpose, structure, and run workflow.
