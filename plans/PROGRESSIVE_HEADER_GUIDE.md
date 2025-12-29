# Progressive Blur Header Guide

This guide explains how the **Progressive Blur Header** works and how to easily reuse it across other screens (like Health, Beta, Family) to maintain a consistent, high-quality "Apple-style" glass aesthetic.

## 1. How It Works

The `ProgressiveBlurHeader` is a reusable component (`src/components/shared/progressive-blur-header.tsx`) that sits absolutely positioned at the top of your screen. It creates a "frosted glass" effect that reacts to your scrolling.

### Key Mechanisms:
1.  **Scroll Tracking:** It accepts a Reanimated `scrollY` shared value.
2.  **Parallax & Slide:** As you scroll down, the header background "slides" down into place (`travelTranslateY`) while fading in. This creates a physical feeling of the UI assembling itself.
3.  **Progressive Blur:** The blur intensity increases as you scroll.
4.  **Gradient Masking:** It uses a `MaskedView` with a gradient (`maskStops`) to make the bottom edge of the glass fade out smoothly, rather than having a hard line.
5.  **Tinting:** It combines a standard iOS/Android blur material (`blurTint`) with a customizable color overlay (`tintColors`) to get the perfect "milky" or "clear" glass look.

## 2. Key Props to Know

*   **`scrollY`** (Required): The `useSharedValue(0)` from your screen that tracks scroll position.
*   **`height`**: Total height of the header (usually `insets.top + headerHeight`).
*   **`ranges`**:
    *   `blurRange`: `[0, 80]` -> Blur starts at 0px, maxes out at 80px scroll.
    *   `travelRange`: `[0, 80]` -> The "slide down" animation duration.
    *   `contentRange`: `[30, 70]` -> When the text/avatar inside the header appears.
*   **`maskStops`**: Controls the fade-out at the bottom.
    *   Example: `[{ location: 0, opacity: 1 }, { location: 0.5, opacity: 1 }, { location: 1, opacity: 0 }]` (Solid top half, fades out bottom half).
*   **`blurTint`**: The material style (`'light'`, `'dark'`, `'systemChromeMaterialLight'`).
*   **`tintColors`**: The gradient colors of the glass itself (e.g., `['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.1)']`).

## 3. How to Reuse in Other Screens (e.g., Health, Beta)

It is extremely easy to drop this into any screen. Here is the standard pattern:

### Step 1: Setup Scroll Handling
In your screen component (`HealthScreen.tsx`):

```tsx
import { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
// ...

const HealthScreen = () => {
  const scrollY = useSharedValue(0); // 1. Create shared value

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y; // 2. Link scroll event
  });
  
  // ...
```

### Step 2: Add the Component
Place the `<ProgressiveBlurHeader>` **outside** your ScrollView (so it stays floating on top), but **inside** the main container.

```tsx
  return (
    <View style={styles.container}>
      
      {/* The Glass Header */}
      <ProgressiveBlurHeader
        scrollY={scrollY}
        height={insets.top + 60} // Adjust height as needed
        insetsTop={insets.top}
        blurTint="light" // Match your theme
        tintColors={['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.1)']} // Match HomeScreen
        maskStops={[
           { location: 0, opacity: 1 },
           { location: 0.5, opacity: 1 },
           { location: 1, opacity: 0 }
        ]}
      >
        {/* Your Compact Header Content (e.g., Title "Health") */}
        <View style={styles.compactHeader}>
           <Text style={styles.title}>Health</Text>
        </View>
      </ProgressiveBlurHeader>

      {/* Your Scrollable Content */}
      <Animated.ScrollView 
        onScroll={onScroll} 
        scrollEventThrottle={16}
        // ...
      >
         {/* ... Screen Content ... */}
      </Animated.ScrollView>
    </View>
  );
```

### Step 3: Polish
*   Adjust `contentRange` so the header title fades in exactly when the big title in the ScrollView scrolls out of view.
*   Adjust `height` to fit the specific content of that screen.

That's it! The component handles all the complex animations, masking, and platform-specific blur logic for you.
