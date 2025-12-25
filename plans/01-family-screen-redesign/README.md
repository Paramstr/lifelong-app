# Family Screen Redesign: Exciting Loud Graphs

## Objective
Add a vibrant ("loud"), interactive graph to the Family Screen showing step data for 4 family members over a 1-week period.

## Requirements
1.  **Data Visualization**:
    - **Metric**: Steps.
    - **Timeframe**: 1 week (7 days).
    - **Entities**: 4 People (Dad, Mum, Brother, Me).
    - **Visual Style**: "Clean & Vibrant" (Ref: Lifespan Card).
    - **Container**: White rounded card with soft shadow (`elevation: 5` / `shadowOpacity: 0.08`).
    - **Graph Style**:
        - **Node-Linked**: Explicit distinct circles (dots) at every data point, connected by lines.
        - **Gradients**: Soft vertical gradient fills under the lines (optional, but requested in "Overview" style).
        - **Colors**: High contrast against white.
            - Dad: Dark/Navy Line.
            - Mum: Vibrant Green (like 'Optimal wake up').
            - Brother: Orange/Salmon (like 'Lifespan' left segment).
            - Me: Purple/Deep Blue.
2.  **Avatars**:
    -   Display the person's avatar at the *end* (rightmost point) of their respective data line.
    -   Avatars must move vertically based on the latest data point.
    -   **Style**: Small circular avatars, potentially with a colored ring matching their data line.
3.  **Interactivity**:
    -   "Beautifully interactive".
    -   Drag/Touch scrub interaction.
    -   **Tooltip**: Floating pill (like "Details >") appearing over the active point when scrubbing.

## Technical Approach
We will use **@shopify/react-native-skia** for high-performance, rich graphical rendering and **react-native-reanimated** for gesture handling.

### 1. New Component: `FamilyStepsGraph`
**Location**: `src/features/family/components/FamilyStepsGraph.tsx`

**Dependencies**:
- `@shopify/react-native-skia`: `Canvas`, `Path`, `Image`, `runSpring`, `Skia`, `Group`, `LinearGradient`, `BlurMask`.
- `react-native-reanimated`: `useSharedValue`, `useDerivedValue`.
- `react-native-gesture-handler`: `Gesture`, `GestureDetector`.

### 2. Implementation Details

#### A. Data Structure
Mock data generator for 4 users x 7 days.
```typescript
type DataPoint = { day: string; steps: number };
type FamilyMember = {
  id: string;
  name: string;
  avatar: any; // Image source
  color: string;
  data: DataPoint[]; // 7 days
};
```

#### B. Visual Design ("Clean & Vibrant" Style)
-   **Card**: White background, `borderRadius: 24`, subtle shadow.
-   **Lines**:
    -   Stroke Width: ~3px.
    -   Smoothing: Catmull-Rom or Cubic Bézier.
-   **Nodes (Dots)**:
    -   Radius: ~4px.
    -   Stroke: Matching line color.
    -   Fill: White (hollow look) or Solid (filled look). Reference suggests hollow with colored stroke or solid color. Let's go with **Solid Color with White Border** (Reverse of reference 'Lifespan' which has hollow dots, but 'Overview' has solid dots. Solid stands out more for multiple lines).
-   **Avatars**:
    -   Size: 32px.
    -   Position: Absolute right aligned to the last data point.
    -   Connecting Line: A dashed connector if the avatar is pushed slightly off-chart? Or just attached directly to the node.

#### C. Avatar Integration
-   Image loading via `useImage`.
-   Drawn directly on Canvas for synchronized animation, OR as absolute positioned React Native Views driven by `useDerivedValue` (Reanimated) for better accessibility/touch handling.
    -   *Decision*: **Skia Image** feels more integrated with the line physics, but **Reanimated View** handles the image loading/caching better without boilerplate.
    -   *Approach*: Use **Reanimated Views** for the avatars overlaying the Skia Canvas. We will export the `y` value of the last point via a SharedValue.

#### D. Interactivity (Gesture)
- **Scrubbing**:
    - A vertical "cursor" line appears on touch.
    - As the user drags horizontally, snap to the nearest day index.
    - Show a tooltip or floating pill showing the step counts for that day.
    - **Active State**: When scrubbing, maybe fade out non-active lines slightly or scale up the active day's intersection points.

### 3. Integration Plan
1.  **Create Assets**: Ensure we have access to the avatar images (already in `FamilyScreen` imports).
2.  **Build Component**: Implement `FamilyStepsGraph`.
3.  **Modify Screen**: Import and place `FamilyStepsGraph` inside `FamilyScreen.tsx`'s `ScrollView`, likely after the Bio/Stats section.

## Task Breakdown
1.  [x] Setup `FamilyStepsGraph.tsx` skeleton.
2.  [x] specific Mock Data generation.
3.  [x] Implement Skia Canvas with basic lines.
4.  [x] Add "Loud" styling (gradients, thickness, glow) -> Updated to "Clean & Vibrant" with Glass.
5.  [x] specific Avatar rendering at line ends.
6.  [x] Add Gesture Handler for interactivity.
7.  [x] Integrate into `FamilyScreen.tsx`.
