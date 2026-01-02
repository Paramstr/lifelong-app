# Onboarding Implementation Plan

- [ ] **Setup Environment Variables**
    - [ ] Add `EXPO_PUBLIC_ONBOARDING_DEBUG_MODE=true` to `.env.local` (Disables DB writes, enables design iteration).
    - [ ] Add `EXPO_PUBLIC_FORCE_ONBOARDING=true` to `.env.local` (Shows onboarding even if completed).

- [ ] **Create Onboarding Feature Structure**
    - [ ] Create `src/features/onboarding/` directory.
    - [ ] Create subdirectories: `components`, `screens`, `context`, `hooks`.

- [ ] **Backend Implementation (Convex)**
    - [ ] Define `onboarding` table in `convex/schema.ts` (linked to User, storing all collected fields).
    - [ ] Create `convex/onboarding.ts` with mutations to save/update onboarding data.
    - [ ] Ensure sensitive data rules are applied (if any).

- [ ] **Implement State Management**
    - [ ] Create `OnboardingContext` (or Zustand store) to manage user inputs and navigation state.
    - [ ] Ensure `EXPO_PUBLIC_ONBOARDING_DEBUG_MODE` is respected (mock API calls).

- [ ] **Create UI Components (Screens 0-17)**
    - *Adhering to "Liquid Glass" design: Clean, Inline, Typography-first, No Cards (unless specified).*
    - [ ] Screen 0: `LandingScreen` (Gradient, Typography)
    - [ ] Screen 1: `SignInScreen` (Auth Buttons)
    - [ ] Screen 2: `FullNameScreen` (Input)
    - [ ] Screen 3: `AgeScreen` (Numeric Input)
    - [ ] Screen 4: `GenderScreen` (Selection)
    - [ ] Screen 5: `WeightScreen` (Input + Unit)
    - [ ] Screen 6: `CameraPermissionScreen`
    - [ ] Screen 7: `MicrophonePermissionScreen`
    - [ ] Screen 8: `AncestryOriginScreen` (Searchable List)
    - [ ] Screen 9: `AncestryInsightScreen` (Generated Text)
    - [ ] Screen 10: `AncestryWeightScreen` (Slider)
    - [ ] Screen 11: `AllergiesScreen` (Multi-select + Input)
    - [ ] Screen 12: `SensitivitiesScreen` (Input)
    - [ ] Screen 13: `DietaryBaselineScreen` (Selection)
    - [ ] Screen 14: `NutritionContextScreen` (Multi-line Input)
    - [ ] Screen 15: `InitialSynthesisScreen` (Generated Summary)
    - [ ] Screen 16: `NutritionTargetsScreen` (Steppers)
    - [ ] Screen 17: `LifelongStatementScreen` (Statement)

- [ ] **Setup Navigation**
    - [ ] Create `app/onboarding/_layout.tsx` (Stack Navigator).
    - [ ] Create `app/onboarding/index.tsx` (Entry/Redirect).
    - [ ] Implement transition logic.

- [ ] **Integrate Entry Point**
    - [ ] Check flags in `app/_layout.tsx`.
    - [ ] Redirect to `/onboarding` if needed.

---

# plans/onboarding.md

This document defines the full onboarding flow for the Lifelong iOS app.  
All screen titles and purposes are for internal reference only and are not displayed to the user.

---

## Screen 0 — Landing

**Purpose**  
Set emotional tone and establish scope without explanation.

**What is shown on screen**  
- Large headline text: “Health that grows with you.”
- Subheadline line with three words separated by middots: “Vitality · Protocols · Family”
- One primary button at the bottom: “Continue”

**Design and layout details**  
- Full-screen layout.
- Typography-first. Large title style for headline, standard body for subheadline.
- Soft, full-bleed gradient background.
- No cards.
- No icons.
- Subtle fade-in motion for text on first load.

**Interaction behavior**  
- Tap “Continue” advances to next screen.
- No secondary actions.

---

## Screen 1 — Sign In

**Purpose**  
Authenticate with minimal friction.

**What is shown on screen**  
- “Continue with Apple” button.
- “Continue with Google” button.

**Design and layout details**  
- Full-screen.
- Buttons use native platform styling.
- Neutral background.
- No additional text or explanation.

**Interaction behavior**  
- Tapping either button initiates auth flow.
- On success, auto-advance to next screen.

---

## Screen 2 — Full Name

**Purpose**  
Capture identity in a human, non-formal way.

**What is shown on screen**  
- Large prompt text: “What’s your full name?”
- Single text input field.

**Design and layout details**  
- Full-screen.
- No cards.
- Input field centered vertically below prompt.
- Keyboard appears immediately on screen load.

**Interaction behavior**  
- Single-line text entry.
- Primary action button: “Next”.
- Cannot advance if input is empty.

---

## Screen 3 — Age

**Purpose**  
Capture age for downstream personalization.

**What is shown on screen**  
- Prompt text: “How old are you?”
- Numeric input field.

**Design and layout details**  
- Full-screen.
- Numeric keypad.
- No cards or helper text.

**Interaction behavior**  
- Numeric entry only.
- “Next” button enabled once a valid number is entered.

---

## Screen 4 — Gender

**Purpose**  
Collect gender context when relevant.

**What is shown on screen**  
- Prompt text: “How do you identify?”
- Three large selection rows:
  - Female
  - Male
  - Another identity

**Design and layout details**  
- Rows span full width.
- No cards. Each row highlights when selected.
- Selection indicated via background tint and checkmark.

**Interaction behavior**  
- Single-select.
- Tapping a row selects and auto-advances.

---

## Screen 5 — Weight

**Purpose**  
Capture baseline physical context.

**What is shown on screen**  
- Prompt text: “What’s your current weight?”
- Numeric input with unit label.

**Design and layout details**  
- Full-screen.
- No cards.
- Unit label fixed to right of input.

**Interaction behavior**  
- Numeric entry.
- “Next” button required to advance.

---

## Screen 6 — Permissions: Camera

**Purpose**  
Request camera access with context.

**What is shown on screen**  
- Short sentence: “Used to log meals and movement.”
- Primary button: “Allow Camera Access”

**Design and layout details**  
- Full-screen.
- Text centered vertically.
- No icons.
- No cards.

**Interaction behavior**  
- Tapping button triggers system permission modal.
- After user responds, auto-advance.

---

## Screen 7 — Permissions: Microphone

**Purpose**  
Request microphone access with context.

**What is shown on screen**  
- Short sentence: “Used for voice reflections and check-ins.”
- Primary button: “Allow Microphone Access”

**Design and layout details**  
- Same layout as previous screen.
- Visual continuity maintained.

**Interaction behavior**  
- Tapping button triggers system permission modal.
- Auto-advance after response.

---

## Screen 8 — Ancestral Origin

**Purpose**  
Begin context mining through heritage.

**What is shown on screen**  
- Prompt text: “Where do your ancestors come from?”
- Searchable list of countries and regions.

**Design and layout details**  
- Full-screen list.
- Native list styling.
- No cards.
- Selected items show checkmarks.

**Interaction behavior**  
- Multi-select allowed.
- “Next” button required to advance.

---

## Screen 9 — Ancestry Insight

**Purpose**  
Demonstrate contextual intelligence.

**What is shown on screen**  
- One or two short statements generated based on prior selection.
  - Example: “People with South Asian ancestry often experience lactose intolerance.”

**Design and layout details**  
- Full-screen.
- Static generated text.
- No cards.
- Slight fade-in animation.

**Interaction behavior**  
- Auto-advances after a short delay.
- No user action required.

---

## Screen 10 — Ancestral Influence Weighting

**Purpose**  
Give control over how ancestry is used.

**What is shown on screen**  
- Prompt text: “How much should this influence suggestions?”
- Single horizontal slider with three labeled anchor points:
  - None
  - Balanced
  - Strong

**Design and layout details**  
- Full-screen.
- Slider centered.
- No cards.

**Interaction behavior**  
- Slider value required.
- “Next” button to advance.

---

## Screen 11 — Food Allergies and Intolerances

**Purpose**  
Capture safety constraints.

**What is shown on screen**  
- Prompt text: “Any foods or ingredients you avoid?”
- Multi-select cards for common items:
  - Dairy
  - Gluten
  - Eggs
  - Nuts
- Text input field for custom entries.
- Running list of selected items shown below.

**Design and layout details**  
- Cards are used for selectable items only.
- Cards toggle selected state with color and checkmark.
- Text input is not card-wrapped.

**Interaction behavior**  
- Multi-select allowed.
- Custom text entries add to running list.
- “Next” button to advance.

---

## Screen 12 — Food Sensitivities

**Purpose**  
Capture subjective physical responses.

**What is shown on screen**  
- Prompt text: “Any foods that don’t feel right?”
- Text input field with placeholder examples.

**Design and layout details**  
- Full-screen.
- No cards.
- Placeholder text is static.

**Interaction behavior**  
- Optional input.
- “Next” button to advance.

---

## Screen 13 — Dietary Baseline

**Purpose**  
Understand default eating patterns.

**What is shown on screen**  
- Prompt text: “What does your normal diet look like?”
- Selectable rows:
  - Mostly home-cooked
  - Mostly eating out
  - Vegetarian
  - Cultural diet

**Design and layout details**  
- Full-width rows.
- Single-select.
- No cards.

**Interaction behavior**  
- Selecting a row auto-advances.

---

## Screen 14 — Additional Nutrition Context

**Purpose**  
Allow free-form context.

**What is shown on screen**  
- Prompt text: “Anything else we should know?”
- Multi-line text input.

**Design and layout details**  
- Full-screen.
- No cards.
- Input expands with text.

**Interaction behavior**  
- Optional.
- “Next” button to advance.

---

## Screen 15 — Initial Synthesis

**Purpose**  
Return first value to user.

**What is shown on screen**  
- Short generated summary based on collected inputs.
  - Example: “We’ll focus on energy stability and gut comfort.”

**Design and layout details**  
- Full-screen.
- Generated text only.
- No cards.

**Interaction behavior**  
- Auto-advances after brief delay or tap “Continue”.

---

## Screen 16 — Nutrition Targets

**Purpose**  
Provide actionable recommendations.

**What is shown on screen**  
- Generated targets (e.g. calories, protein).
- Each target adjustable via steppers.

**Design and layout details**  
- Targets displayed as rows.
- Steppers use native controls.
- No cards.

**Interaction behavior**  
- User may adjust values.
- “Confirm” button to advance.

---

## Screen 17 — Lifelong Statement

**Purpose**  
Close onboarding with alignment.

**What is shown on screen**  
- Single statement of intent.

**Design and layout details**  
- Full-screen.
- Typography-first.
- No cards or imagery.

**Interaction behavior**  
- Primary button: “Begin”
- Tapping completes onboarding.

---