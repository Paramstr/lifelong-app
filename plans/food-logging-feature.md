# Food Logging & Details Implementation Plan

## Goal
Implement a server-driven food logging journey where image capture is separated from the details view. The source of truth is the server (mocked for now).

## User Journey
1.  **Initiate**: User clicks "Add food" button in `FoodTimeline`.
2.  **Capture**: Native Camera/Gallery opens. User takes or selects a photo.
3.  **Return & Notify**: User is immediately returned to the Home Screen. A small popup/toast notifies: "Processing food...".
4.  **Timeline Update**: The captured image appears in the `FoodTimeline` with dummy data (simulating the completed server processing).
5.  **View Details**: User clicks on the new food item in the timeline.
6.  **Details Screen**: A new screen `food/[id]` opens (as a popover/bottom sheet) displaying the analysis results (macros, ingredients).

## Architecture

### 1. Navigation & Routing
*   **Route**: `app/food/[id].tsx`
    *   **Presentation**: Modal or flexible sheet (configured in `_layout.tsx`).
*   **Params**: `id` (string) - used to fetch specific food details.

### 2. Data Structure (Mock Server)
*   **Timeline Entry**: Needs to support an `id` and `status` (e.g., 'uploading', 'processing', 'completed').
*   **Source of Truth**: For this prototype, `FoodTimeline` will manage the state locally, but structure it to easily swap with a server query (e.g., React Query).

### 3. Components

#### A. `FoodTimeline` (Home Screen)
*   **Interaction**: Replace text input with a specialized "Add Food" button.
*   **Logic**:
    *   Handle `expo-image-picker` result.
    *   On image selection:
        1.  Show "Will notify when processed" toast/alert.
        2.  Optimistically add the item to the timeline list with dummy data.
    *   **Navigation**: Wrap `MealCard` in a `Pressable` that navigates to `/food/${entry.id}`.

#### B. `FoodDetailsScreen` (`app/food/[id].tsx`)
*   **Design**: Matches the provided screenshot (Cottage Cheese example).
*   **Input**: Receives `id` from route params.
*   **Logic**: Look up food details (Image, Macros, Ingredients) based on `id` from a dummy data store.
*   **UI Elements**:
    *   Large Header Image with Camera icon.
    *   Macro Summary Row (Cal, Protein, Carbs, Fat).
    *   Ingredients List with quantity steppers.

## Implementation Steps

1.  **Install Dependencies**:
    *   `npx expo install expo-image-picker`

2.  **Setup Details Route**:
    *   Ensure `app/food/[id].tsx` is implemented (already created).
    *   Verify `_layout.tsx` handles this route correctly.

3.  **Modify `FoodTimeline`**:
    *   Import `expo-image-picker`.
    *   Add `pickImage` function.
    *   Replace `TextInput` with `Pressable`.
    *   Add logic to append a new mock entry to the `entries` list upon image selection.
    *   Implement the "Processing" toast/alert.
    *   Make items pressable to navigate to `router.push('/food/123')`.

4.  **Refine UI**:
    *   Ensure `FoodDetails` screen matches the "Cottage Cheese" design precisely using `react-native-unistyles`.
    *   Connect the dummy data so the timeline image matches the details screen image.

## Future Proofing
*   **API Integration**: The "Add" action will eventually trigger an API upload. The timeline will simply render what the backend returns.
*   **Poling/Websockets**: The "Processing" state can be real-time in the future. For now, it's instant for the prototype.
