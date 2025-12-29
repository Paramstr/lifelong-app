# Food Logging & Details Implementation Plan (V2)

## Goal

Build a **server-driven food logging flow** where:

* Image capture is instant and non-blocking.
* Analysis happens asynchronously.
* The home timeline is always usable.
* Food details are inspectable in a modal sheet.
* The server is the source of truth (mocked in V1).

The experience must feel calm, predictable, and resilient to latency.

---

## User Journey

1. **Add**

   * User taps **Add food** in `FoodTimeline`.

2. **Capture**

   * Native camera or gallery opens.
   * User takes or selects a photo.

3. **Immediate Return**

   * User is returned to Home immediately.
   * Toast appears: **“Analyzing meal”**.
   * No spinners. No blocking UI.

4. **Timeline Insert**

   * A new food card appears at the top of the timeline.
   * Shows the captured image.
   * Status is `processing`.

5. **Inspect Anytime**

   * User can tap the food card immediately.
   * Navigates to `/food/[id]` as a modal sheet.

6. **Details View**

   * Shows food image, metadata, and partial content if needed.
   * Once analysis completes, full macros and ingredients appear.

---

## Navigation & Routing

### Route

* `app/food/[id].tsx`

### Presentation

* Modal or bottom sheet configured in root `_layout.tsx`.

Sheet requirements:

* Scrollable content.
* Swipe-to-dismiss.
* Home remains visible underneath.
* No nested stacks.

### Params

* `id: string`

Used to resolve the food entry from the store.

---

## Data Model (Server Shape)

All UI is built against this shape.
This must not change when a real backend is introduced.

```ts
type FoodEntry = {
  id: string
  imageUri: string
  status: 'uploading' | 'processing' | 'completed' | 'failed'
  createdAt: number
  source: 'camera' | 'gallery'

  title?: string
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack'

  summary?: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }

  ingredients?: Ingredient[]
}

type Ingredient = {
  id: string
  name: string
  imageUri: string
  quantity: number
  unit: 'g' | 'cup' | 'whole'
  calories: number
  protein: number
  carbs: number
  fat: number
}
```

Rules:

* `status` always exists.
* `summary` and `ingredients` may be undefined while processing.
* Ingredient images are always provided by the server.

---

## Source of Truth

* A **mock server store** owns all food data.
* Components never store food state locally.
* Timeline and details screen both read from the same store.

The store exposes:

* `addFood(imageUri, source)`
* `getFoodById(id)`
* `listFoods()`

This can later be replaced with React Query, Convex, Supabase, or a REST API without changing UI contracts.

---

## Components

### A. FoodTimeline (Home Screen)

#### UI

* Replace text input with a single **Add Food** button.
* Timeline cards show:

  * Food image
  * Meal label and time
  * Either macros or a subtle “Analyzing…” label

#### Behavior

1. Launch `expo-image-picker`.
2. On successful image selection:

   * Create a new `FoodEntry` with:

     * `status: 'processing'`
     * `imageUri`
     * `createdAt`
     * `source`
   * Insert at the top of the timeline.
3. Show toast: **“Analyzing meal”**.
4. Mock server resolves the entry to `completed` (immediate or delayed).

#### Navigation

* Each card is wrapped in `Pressable`.
* Always navigates to `/food/${id}`, regardless of status.

No conditional routing.

---

### B. FoodDetailsScreen (`app/food/[id].tsx`)

This screen must visually match the provided reference image.

#### Layout Order

1. **Header Image**

   * Full-width food image.
   * Rounded corners.
   * Floating camera icon button (top-right).
   * Button is non-functional in V1.

2. **Metadata Row**

   * Time (e.g. `8:10 AM`)
   * Meal label (e.g. `Breakfast`)

3. **Title**

   * Food name (e.g. “Cottage Cheese & Avocado Plate”)
   * Use Unistyles theme fonts.

4. **Macro Summary**

   * Inline row:
     `544 cal | 26g protein | 54g carbs | 27g fat`
   * Clear typographic hierarchy.

5. **Ingredients List**

Each ingredient row contains four zones:

1. **Image**

   * Square thumbnail.
   * Rounded corners.
   * Loaded from `ingredient.imageUri`.

2. **Info**

   * Ingredient name.
   * Optional per-ingredient macros.

3. **Quantity Stepper**

   * `- 0.5 cup +`
   * Stateless in V1.
   * Layout must not shift.

4. **Optional Action Icon**

   * Reserved for future edits.
   * Non-interactive for now.

---

## Processing State Behavior

* If `status !== 'completed'`:

  * Show header image.
  * Show title and metadata.
  * Render ingredient rows as skeletons.
  * Ingredient images use placeholders.
* Once completed:

  * Content fades in.
  * No layout jumps.

Navigation is never blocked.

---

## Styling & Theming

* Use `react-native-unistyles`.
* Respect spacing, rhythm, and hierarchy.
* No reliance on serif fonts.
* Calm, neutral color usage.
* No heavy animations.

---

## Implementation Steps

1. Install dependencies:

   ```bash
   npx expo install expo-image-picker
   ```

2. Configure routing:

   * Ensure modal/sheet behavior in `_layout.tsx`.

3. Implement mock server store:

   * Centralized data ownership.
   * Deterministic dummy data.

4. Update `FoodTimeline`:

   * Add Food button.
   * Image picker integration.
   * Optimistic insert.
   * Toast notification.

5. Build `FoodDetailsScreen`:

   * Match reference layout exactly.
   * Bind to store via `id`.
   * Handle partial vs completed states.

6. Connect images:

   * Timeline image and details image must match.
   * Ingredient images always come from data.

---

## Future-Proofing

* Real uploads can replace mock instantly.
* Polling or websockets can update `status`.
* Quantity changes can trigger recalculation.
* Ingredient swaps and education can layer on later.
* Family sharing can consume the same summaries.

---

## Design Constraints to Preserve

* No blocking flows.
* No forced completion.
* Timeline is the anchor.
* Details are inspectable, not mandatory.
* Calm over clever.

---
