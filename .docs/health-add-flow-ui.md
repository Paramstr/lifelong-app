# Health Screen Add Flow UI Plan

## Objective
Create a seamless, high-fidelity data entry experience for the Health Screen. When a user selects an option from the "Add" (+) dropdown, the UI should transition smoothly into a focused input mode without leaving the blurred context. The interface should be minimalist, "aesthetic," and use "glass" principles where appropriate.

## Core Interaction Concept: "Focus & Expand"

1.  **Initial State**: The user sees the blurred overlay with the Dropdown list (Medical Record, Note, Injury, Measurement).
2.  **Selection Action**: When an item is clicked:
    *   **Collapse**: The unselected options fade out (`Exiting` animation).
    *   **Focus**: The selected option's icon/label remains (or transitions) to become the "Header" of the new form.
    *   **Expand**: The specific form UI for that type fades in (`Entering` animation) below the header.
3.  **Context**: The background remains the existing blurred view (over the list). We do not navigate to a new screen.
4.  **Dismissal**: A simple "Cancel" or "Close" button (or tapping background) reverts to the dropdown or closes the overlay.

---

## Detailed User Journeys & UI

### 1. Medical Record (File Upload)

**Goal**: Quick file selection with context.

*   **UI Layout**:
    *   **Header**: Blue Document Icon + "Medical Record" Title.
    *   **Action Area**:
        *   **Empty State**: A large, minimalist touchable area with a dashed border (very subtle opacity) or just a centered button: "Tap to select file".
        *   **Selected State**:
            *   A card representing the file (PDF/Image icon).
            *   Filename text (truncated middle if long).
            *   "Change" or "Remove" small text buttons.
    *   **Context Input**:
        *   A "Description" text input below the file area.
        *   Style: Transparent background, bottom border only (very subtle), or no border.
        *   Placeholder: "What is this record for? (e.g., Blood work 2024)"
    *   **Footer**: "Save" button (Primary Color, pill shape).

### 2. Note (Minimalist Text)

**Goal**: Frictionless journaling.

*   **UI Layout**:
    *   **Header**: Orange Note Icon + "New Note" Title.
    *   **Input Area**:
        *   A large, multi-line `TextInput` taking up the center screen.
        *   **Style**: **No border, No background**. Just pure text on top of the blur.
        *   **Typography**: Large size (`24px` or `28px`), semi-bold or regular.
        *   **Placeholder**: "How are you feeling?" (Light opacity).
        *   **Cursor**: Standard system cursor.
    *   **Footer**: "Post" button (floating bottom right or centered below text).

### 3. Injury (Visual Selector)

**Goal**: Structured but quick logging.

*   **UI Layout**:
    *   **Header**: Red Bandage Icon + "Log Injury" Title.
    *   **Step 1: Type** (Horizontal Scroll):
        *   Pills/Chips: "Sprain", "Cut", "Bruise", "Burn", "Pain".
        *   Selected pill fills with Red/Theme color.
    *   **Step 2: Location** (Text or List):
        *   Input: "Where?" (e.g., "Right Ankle").
        *   *Bonus*: A simple body outline image where clicking a region sets the text? (Keep simple for V1: Text Input with auto-suggest chips like "Head", "Back", "Knee").
    *   **Step 3: Severity**:
        *   Slider or 1-5 Segmented Control.
        *   Labels: "Mild" -> "Severe".
    *   **Footer**: "Save Record".

### 4. Measurement (Data Point)

**Goal**: Fast numeric entry.

*   **UI Layout**:
    *   **Header**: Green Ruler Icon + "New Measurement" Title.
    *   **Type Selector**:
        *   Dropdown or horizontal scroll for: "Weight", "Blood Pressure", "Heart Rate", "Temperature".
        *   Default to "Weight" or last used.
    *   **Numeric Entry**:
        *   **Huge Text**: The value is the hero. Font size `64px`.
        *   **Unit Toggle**: Small toggle next to value (e.g., `lb` / `kg`).
    *   **Date/Time**: Defaults to Now, small edit link if needed.
    *   **Footer**: "Save".

---

## Component Architecture

We will refactor the current `HealthScreen` and `AddRecordDropdown` logic to support this "Mode" switching.

### New Components

1.  **`HealthInputOverlay.tsx`**
    *   The parent container. Replaces the simple "Dropdown" logic.
    *   Manages state: `mode: 'idle' | 'dropdown' | 'record' | 'note' | 'injury' | 'measurement'`.
    *   Handles the blur background and "click outside to close".

2.  **`HealthForms/*.tsx`** (Sub-components)
    *   `MedicalRecordForm.tsx`: Uses `expo-document-picker`.
    *   `NoteForm.tsx`: The clean text input.
    *   `InjuryForm.tsx`: Chips + Inputs.
    *   `MeasurementForm.tsx`: Big numeric input.

### Refactoring `AddRecordDropdown.tsx`

*   It currently maps `OPTIONS`. We will move `OPTIONS` to a shared constant or keep it within the new Overlay.
*   Instead of just `onSelect` closing the dropdown, `onSelect` will trigger the state change in the Overlay to show the specific form.

## Styling Strategy

*   **Theme**: Use `react-native-unistyles` for consistent spacing and typography.
*   **Animations**:
    *   Use `LayoutAnimation` for the height changes.
    *   Use `Reanimated` (`entering={FadeIn}`, `exiting={FadeOut}`) for switching between the List View and the Form View.
*   **Glass/Blur**:
    *   The `BlurView` is already present in `HealthScreen` when dropdown is open. We will reuse this.
    *   Forms sit *directly* on the Blur. No extra white containers unless necessary for contrast (e.g., the File Card).

## Next Steps (Execution)

1.  **Scaffold `HealthInputOverlay`**: Replace the current `AddRecordDropdown` usage in `HealthScreen` with this new component.
2.  **Implement `NoteForm` first**: It's the simplest UI (No border/bg) to test the "Focus & Expand" transition.
3.  **Implement `MeasurementForm`**: Add logic for types and numeric input.
4.  **Implement `MedicalRecordForm`**: Integrate file picker.
5.  **Implement `InjuryForm`**: Build the pill selectors.
