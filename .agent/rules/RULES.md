---
trigger: manual
description: Lifelong app Details
---

# Lifelong — Personal Longevity App

@DESIGN.md

## Project Overview

Lifelong is a React Native app (Expo + Expo Router + Expo UI) focused on personalized longevity protocols. It uses native components and complex glass effects for a high-fidelity iOS feel.

### Key Technologies
-   **Framework**: React Native (0.81), Expo (SDK 52+), Expo Router.
-   **Styling**: `react-native-unistyles` + `expo-glass-effect` + `expo-blur`.
-   **Graphics**: `react-native-skia` (Graphs), `react-native-reanimated` (Animations).
-   **Icons**: `expo-symbols` (SF Symbols).

## Project Structure

The project is organized by **Feature** and **View**.

### Directory Layout
-   `app/`: **Routing & Entry**. Contains the Expo Router file-based navigation (tabs, stacks).
-   `src/`: **Implementation**.
    -   `features/`: **Domain Logic**. Each features corresponds to a main Tab or Flow.
        -   `family/`: Family view (Graphs, Sleep, Stress).
        -   `home/`: Dashboard, Timeline.
        -   `health/`: Health metrics.
        -   `more/`: Settings & extras.
    -   `components/`: **Shared UI**. Organized by where they appear.
        -   `home/`: Components specific to the Home view.
        -   `opal/`: Core "Opal" design system primitives (legacy/shared).
        -   `shared/`: Generic reusable components.
    -   `utils/`, `constants/`: Helpers.
-   `assets/`: Static files (fonts, images).

### Component Organization
Components are co-located with their feature or view.
-   **Feature-Specific**: If a component is only used in "Family", it lives in `src/features/family/components/`.
-   **View-Specific**: If a component is only used on "Home", it lives in `src/components/home/`.
-   **Shared**: If used everywhere (Buttons, Glass Wrappers), it lives in `src/components/shared/` or `src/components/opal/`.

## Development Workflow

### Scripts
-   `npm run ios:clean`: **Primary Build Command**. Cleans, Prebuilds, and runs the Native App on Simulator. Use this when native dependencies change.
-   `npx expo start`: **Daily Development**. Starts Metro for the Dev Client (hot-reload only).
-   `npm run ios:nuke`: **Fix-All**. Nukes `node_modules`, `ios/`, pods, and rebuilds from scratch.

### Design Standard
Always refer to the **Design System** in `DESIGN.md` (imported above) for styling rules.