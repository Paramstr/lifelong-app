# Lifelong App Design System

> A calm, optimistic, nature-forward design system for Health + Longevity

---

## Core Design Principles

- **Calm, optimistic, non-clinical** — Create an inviting, warm atmosphere
- **High contrast and legibility** — Ensure accessibility across all modes
- **Nature-forward with soft warmth** — Colors inspired by natural elements
- **Minimal saturation, no neon** — Subtle, sophisticated palette
- **Color supports meaning, not decoration** — Purposeful use of color

---

## Brand Core Colors

These define the identity and are used sparingly.

### Primary — Vital Coral

Used for progress, success states, CTAs, highlights.

| Mode  | Value     |
| ----- | --------- |
| Light | `#F26B4F` |
| Dark  | `#FF7A5C` |

### Secondary — Sky Calm Blue

Used for headers, cards, illustrations, background accents.

| Mode  | Value     |
| ----- | --------- |
| Light | `#A9CFE5` |
| Dark  | `#6FA8C9` |

### Accent — Longevity Yellow

Used for subtle emphasis, icons, badges, optimism.

| Mode  | Value     |
| ----- | --------- |
| Light | `#F4D35E` |
| Dark  | `#E6C453` |

---

## Neutral System

The foundation of the visual hierarchy.

### Light Mode Neutrals

| Token                | Value     |
| -------------------- | --------- |
| Background Primary   | `#F7FAFC` |
| Background Secondary | `#FFFFFF` |
| Surface Card         | `#FFFFFF` |
| Border Subtle        | `#E5E9EE` |
| Divider              | `#D8DEE6` |

### Light Mode Text

| Token         | Value     |
| ------------- | --------- |
| Text Primary  | `#0F172A` |
| Text Secondary| `#475569` |
| Text Muted    | `#94A3B8` |
| Text Disabled | `#CBD5E1` |

### Dark Mode Neutrals

| Token                | Value     |
| -------------------- | --------- |
| Background Primary   | `#0B0F14` |
| Background Secondary | `#121822` |
| Surface Card         | `#171E2B` |
| Border Subtle        | `#263042` |
| Divider              | `#1F2937` |

### Dark Mode Text

| Token         | Value     |
| ------------- | --------- |
| Text Primary  | `#E6EDF3` |
| Text Secondary| `#B6C2D0` |
| Text Muted    | `#7C8A9D` |
| Text Disabled | `#4B5563` |

---

## Semantic Colors

Used consistently across both modes.

### Success

| Token            | Value     |
| ---------------- | --------- |
| Success Base     | `#3CB371` |
| Success Soft (Light) | `#E6F6ED` |
| Success Soft (Dark)  | `#1F3D2E` |

### Warning

| Token            | Value     |
| ---------------- | --------- |
| Warning Base     | `#E6A23C` |
| Warning Soft (Light) | `#FFF3E0` |
| Warning Soft (Dark)  | `#3A2A14` |

### Error

| Token            | Value     |
| ---------------- | --------- |
| Error Base       | `#E5533D` |
| Error Soft (Light)   | `#FDECEC` |
| Error Soft (Dark)    | `#3A1E1A` |

### Info

| Token            | Value     |
| ---------------- | --------- |
| Info Base        | `#4DA3D9` |
| Info Soft (Light)    | `#EAF4FB` |
| Info Soft (Dark)     | `#1B3344` |

---

## Progress & Health Indicators

Designed for longevity and habit tracking.

| Token            | Value     |
| ---------------- | --------- |
| Progress Low     | `#CBD5E1` |
| Progress Medium  | `#6FA8C9` |
| Progress High    | `#F26B4F` |
| Streak Highlight | `#FF8C66` |

---

## Usage Rules

1. **Primary Coral** — Only for actions and positive feedback
2. **Blue** — Dominates backgrounds and informational UI
3. **Yellow** — Never used for text
4. **Cards** — Always neutral, never brand-colored
5. **Dark mode** — Uses reduced saturation across all colors
6. **Pure black/white** — Avoid using `#000000` or `#FFFFFF`

---

## Gradient System

Used very sparingly — only for hero headers or onboarding screens.

### Vital Gradient

| Mode  | Value                    |
| ----- | ------------------------ |
| Light | `#A9CFE5` → `#F26B4F`    |
| Dark  | `#1F3D4F` → `#FF7A5C`    |

---

## Token Naming Convention

```typescript
// Background colors
color.background.primary
color.background.secondary

// Surface colors
color.surface.card

// Text colors
color.text.primary
color.text.secondary
color.text.muted
color.text.disabled

// Brand colors
color.brand.primary
color.brand.secondary
color.brand.accent

// Semantic colors
color.semantic.success
color.semantic.warning
color.semantic.error
color.semantic.info

// Border & dividers
color.border.subtle
color.border.divider

// Progress indicators
color.progress.low
color.progress.medium
color.progress.high
color.progress.streak
```

---

## Spacing System

Using a 4px base unit for consistency.

| Token   | Value  |
| ------- | ------ |
| `xs`    | 4px    |
| `sm`    | 8px    |
| `md`    | 16px   |
| `lg`    | 24px   |
| `xl`    | 32px   |
| `2xl`   | 40px   |
| `3xl`   | 48px   |
| `4xl`   | 64px   |

---

## Border Radius System

| Token     | Value  |
| --------- | ------ |
| `none`    | 0px    |
| `sm`      | 4px    |
| `md`      | 8px    |
| `lg`      | 12px   |
| `xl`      | 16px   |
| `2xl`     | 24px   |
| `full`    | 9999px |

---

## Typography Scale

| Token      | Size  | Weight | Line Height |
| ---------- | ----- | ------ | ----------- |
| `display`  | 32px  | 800    | 38px        |
| `headline` | 24px  | 700    | 30px        |
| `title`    | 20px  | 600    | 26px        |
| `body`     | 16px  | 400    | 22px        |
| `caption`  | 14px  | 500    | 18px        |
| `small`    | 12px  | 400    | 16px        |

---

## Shadow System

### Light Mode

```typescript
shadow.sm = {
  shadowColor: '#0F172A',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 2,
  elevation: 1,
}

shadow.md = {
  shadowColor: '#0F172A',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 2,
}

shadow.lg = {
  shadowColor: '#0F172A',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.12,
  shadowRadius: 8,
  elevation: 4,
}
```

### Dark Mode

Shadows are more subtle in dark mode — use lower opacity values.

---

## Component Guidelines

### Cards

- Background: `color.surface.card`
- Border: `color.border.subtle`
- Border Radius: `xl` (16px) or `2xl` (24px)
- Padding: `md` (16px)

### Buttons (Primary)

- Background: `color.brand.primary`
- Text: White (`#FFFFFF` in light, `#0F172A` in dark)
- Border Radius: `full` for pill buttons, `lg` for standard

### Text Hierarchy

1. Headlines: `color.text.primary`, weight 600-800
2. Body: `color.text.primary`, weight 400
3. Supporting: `color.text.secondary`, weight 400-500
4. Muted/Hints: `color.text.muted`, weight 400

---

## Implementation Notes

1. Always use semantic color tokens, never hardcoded values
2. Support system color scheme by default
3. Provide a manual override for users who prefer explicit mode selection
4. Test all UIs in both light and dark modes
5. Ensure minimum contrast ratio of 4.5:1 for body text
6. Use the `useAppTheme()` hook for accessing theme values

---

## Files Structure

```
lifelong-app/
├── index.ts                      # App entry point (loads unistyles first)
├── babel.config.js               # Babel config with Unistyles plugin
├── src/
│   ├── unistyles.ts              # Unistyles configuration
│   └── theme/
│       └── index.ts              # Theme definitions (light & dark)
```

---

## Unistyles Usage

### Basic Usage

Replace React Native's `StyleSheet` with Unistyles:

```typescript
import { StyleSheet } from 'react-native-unistyles';

const styles = StyleSheet.create(theme => ({
  container: {
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.md,
  },
  title: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight,
  },
}));
```

### Accessing Theme at Runtime

```typescript
import { UnistylesRuntime } from 'react-native-unistyles';

// Get current theme name
const themeName = UnistylesRuntime.themeName; // 'light' or 'dark'

// Change theme manually (only when adaptive themes disabled)
UnistylesRuntime.setTheme('dark');

// Check color scheme
const colorScheme = UnistylesRuntime.colorScheme;
```

### Adaptive Themes

The app is configured with `adaptiveThemes: true`, which means:
- Theme automatically switches based on device color scheme
- No manual `setTheme()` calls needed
- Themes named `light` and `dark` are required
