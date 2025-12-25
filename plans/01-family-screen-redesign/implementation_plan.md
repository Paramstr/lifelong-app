# Family Screen Redesign Implementation Plan

## Overview
This plan outlines the steps to implement a premium "Family" screen design in React Native. The design features a background carousel of portrait images with a glass/blur effect, a seamless white gradient overlay, and a central avatar with profile information.

## Design Breakdown

### 1. Structure
The screen will be composed of three main layers (z-indexed):
1.  **Background Layer**: Holds the image carousel.
2.  **Effect Layer**: Applies the blur and the white gradient fade.
3.  **Content Layer**: Contains the interactive elements (Avatar, Text, ScrollView).

### 2. Visual Details
-   **Background Carousel**:
    -   16:9 Portrait images.
    -   "Curved background" at the top: This suggests a card-like shape or a window into the image. We will use a container with a large Top Border Radius (e.g., `borderTopLeftRadius: 40`, `borderTopRightRadius: 40`) to achieve the smooth curve.
    -   Transitions: Smooth cross-fade or slide between images using `react-native-reanimated`.
-   **Blur & Gradient**:
    -   **Blur**: `expo-blur` (`BlurView`) applied over the background images to create depth.
    -   **White Fade**: A `LinearGradient` (`expo-linear-gradient`) starting transparent at the top, transitioning to semi-white at ~30%, and solid white below. This blends the background into the white content area.
-   **Foreground Elements**:
    -   **Avatar**: Circular, centered, elevated above the gradient line.
    -   **Typography**: Clean, modern fonts (SF Pro/System), centered alignment.

## detailed Implementation Steps

### Step 1: Setup & Dependencies
-   Ensure `expo-blur`, `expo-linear-gradient`, and `react-native-reanimated` are installed (checked: they are).
-   Create component structure in `src/features/family/screens/FamilyScreen.tsx`.

### Step 2: Background Carousel Component
-   Create a sub-component `FamilyBackgroundCarousel`.
-   **Logic**:
    -   Accept an array of image URIs.
    -   Use `Reanimated` to transition between active indexes.
-   **Styling**:
    -   Absolute positioning to cover the top half of the screen.
    -   Apply `borderTopLeftRadius` and `borderTopRightRadius` (~40px) to the container to match the "curved" description.
    -   Add `overflow: 'hidden'`.

### Step 3: Glass & Gradient Overlay
-   Overlay the carousel with `<BlurView intensity={30} />` for the "definitely blurred" look.
-   Add `<LinearGradient />` on top.
    -   **Colors**: `['transparent', 'rgba(255,255,255,0.8)', '#fff']`.
    -   **Locations**: `[0, 0.35, 0.5]`.
    -   The gradient should start fading to white roughly 1/3 down the screen.

### Step 4: Content Layout
-   Create a `ScrollView` or `View` for the main content.
-   **Avatar**:
    -   Place it overlapping the gradient transition point using negative margin or absolute positioning relative to a content container.
    -   Style: Rounded full (Circle), white border/shadow for lift.
-   **Info Section**:
    -   Text elements: Name (H1), Role (Subtitle/Tags), Description (Body), Stats (Row).
    -   Ensure typography uses proper hierarchy (Bold large name, grey secondary text).

### Step 5: Animation & Polish
-   Add entrance animations for the text (fade in up).
-   Ensure status bar visibility is managed (dark icons presumably, as the bottom is white).

## Proposed Code Structure for `FamilyScreen.tsx`

```tsx
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';

// ... images and logic ...

export default function FamilyScreen() {
  return (
    <View style={styles.container}>
      {/* 1. Background Layer */}
      <View style={styles.backgroundContainer}>
         <Image source={currentImage} style={styles.image} />
         <BlurView intensity={50} style={StyleSheet.absoluteFill} />
      </View>

      {/* 2. Gradient Layer */}
      <LinearGradient
        colors={['transparent', 'rgba(255,255,255,0.9)', '#ffffff']}
        locations={[0, 0.35, 0.5]}
        style={styles.gradient}
      />

      {/* 3. Content Layer */}
      <View style={styles.contentContainer}>
         <Image source={avatar} style={styles.avatar} />
         <Text style={styles.name}>Aiden Raid</Text>
         {/* ... info ... */}
      </View>
    </View>
  );
}
```

## Next Actions
1.  Verify asset availability (or placeholders).
2.  Begin coding `FamilyScreen.tsx` following this structure.
