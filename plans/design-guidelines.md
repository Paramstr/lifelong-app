# Lifelong Design System

> **Aesthetics**: Modern iOS Aero, Glass-morphism, Vivid Native Feel.
> **Philosophy**: Calm, Optimistic, High-Fidelity.

---

## 1. Core Principles: "Aero & Glass"

The integration of **Glass** (`UIVisualEffectView`) is the central pillar of our design language. We move away from solid opaque cards to translucent materials that blur the content behind them, creating depth and a sense of place.

-   **Glass First**: Primary containers (Cards, Navigation, Headers) use `GlassView`.
-   **Soft Gradients**: Backgrounds use subtle, flowing gradients that provide the "light" for the glass to refract.
-   **Native Fidelity**: Use `SF Symbols`, native blurs, and system typography to feel at home on iOS.
-   **Vibrant but Controlled**: Use color for data and status (Green for health, Red for alerts), but keep the chrome neutral (White/Glass).

---

## 2. Materials & Backgrounds

### Glass Material
We use `expo-glass-effect` for all card surfaces.

-   **Component**: `<GlassView />`
-   **Style**: `glassEffectStyle="regular"` (Standard iOS Blur)
-   **Card Styling**:
    -   `borderRadius: 24` or `30`
    -   `overflow: 'hidden'`
    -   **No Shadow on Glass**: Glass itself shouldn't usually have a shadow *unless* it's a floating button. It relies on the content behind it for separation.
    -   *Exception*: If needed for contrast, a very subtle white tint `backgroundColor: 'rgba(255,255,255,0.1)'` can be added, but prefer raw glass.

### Screen Background
Screens are not flat colors. They are layered compositions.

1.  **Bottom Layer**: A scrolling or static content layer (e.g., Carousel Images, Gradient Blobs).
2.  **Middle Layer**: A `BlurView` or white gradient overlay to soften the background images so text remains legible.
3.  **Top Layer**: The content (Glass Cards) scrolling over the background.

**Standard Fade Gradient**:
```tsx
<LinearGradient
  colors={['rgba(255,255,255,0)', '#ffffff']}
  locations={[0, 0.4]} // Fade to solid white quickly
/>
```

### Shadows (Non-Glass)
For floating elements (like Avatar satellites) or solid buttons:

-   **Glow Shadow**:
    -   Color: `#ffffff` (White glow)
    -   Opacity: `1.0`
    -   Radius: `10`
    -   *Used for*: Items floating on complex backgrounds to separate them.
-   **Drop Shadow (Subtle)**:
    -   Color: `#000`
    -   Opacity: `0.08`
    -   Radius: `10`
    -   Offset: `0, 4`
    -   *Used for*: Floating white circles (e.g., active Avatar).

---

## 3. Color System

Colors are extracted directly from the "Family View" components.

### Typography Colors
High contrast, readable, neutral.

-   **Primary Text**: `#222222` or `#1a1a1a` or `#333333` (Deep Grey/Black)
-   **Secondary Text**: `#666666` (Medium Grey - Subtitles, Labels)
-   **Tertiary Text**: `#999999` (Light Grey - Dates, Info Icons)
-   **Inverted/Overlay**: `#ffffff` (White - on dark gradients or buttons)

### Functional Colors
Used for data visualization and status.

-   **Success / Good**: `#2d9f48` (Text), `#51cf66` (Bar/Graph)
-   **Warning / Average**: `#fcc419`
-   **Error / Low**: `#e03131` (Text), `#ff6b6b` (Bar/Graph)
-   **Trend Up (Good)**: `#2d9f48`
-   **Trend Down (Bad)**: `#e03131`

### Identity Colors (Family Members)
Fixed palette for distinguishing users.

-   **Member 1 (Red/Orange)**: `#eb4d4b`
-   **Member 2 (Green)**: `#6ab04c`
-   **Member 3 (Blue)**: `#0984e3`
-   **Member 4 (Purple)**: `#a29bfe`

---

## 4. Typography

We use the System Font (San Francisco on iOS).

| Role | Size | Weight | Line Height | Tracking |
| :--- | :--- | :--- | :--- | :--- |
| **Hero/Name** | 28px | 600 (SemiBold) | - | -0.5 |
| **Card Title** | 22px | 700 (Bold) | - | -0.5 |
| **Big Number** | 20px | 700 (Bold) | 26px | -0.4 |
| **Body/Bio** | 15px | 400 (Regular) | 22px | 0 |
| **Label/Sub** | 14px | 600 (SemiBold) | - | 0 |
| **Small/Meta** | 12px | 500/600 | - | 0 |
| **Tiny/Axis** | 11-12px | 500 | - | 0 |

**Rules**:
-   **Titles**: Keep letter-spacing tight (`-0.5`).
-   **Body**: Readable line-height (`1.4-1.5x`).
-   **Hierarchy**: Use weight (400 vs 600) to distinguish data labels from values.

---

## 5. Iconography

Use **SF Symbols** via `expo-symbols`.

-   **Component**: `<SymbolView />`
-   **Standard Sizes**:
    -   Small/Inline: `14px`
    -   Footer/Icon: `18px`
    -   Avatar Overlay: `12px`
-   **Standard Tints**:
    -   Muted Icon: `#999`
    -   Dark Icon: `#444` or `#666`
-   **Common Icons**:
    -   Info: `info.circle`
    -   Protocol/Magic: `sparkles`
    -   Nav: `chevron.left`, `chevron.right`
    -   Status: `umbrella.fill`

---

## 6. Layout & Spacing

-   **Screen Horizontal Padding**: `16` (content should not touch edges).
-   **Card Padding**: `20` (breathable internal spacing).
-   **Card Spacing**: `16` or `20` between cards.
-   **Border Radius**:
    -   Cards: `24`
    -   Buttons/Pills: `12`
    -   Avatars/Circles: `999` (Full Round)

---

## 7. Data Visualization (Graphs)

-   **Bar Charts**:
    -   **Gradients**: Bars should look 3D/Glassy. Use a `LinearGradient` from the base color to a lighter opacity (e.g., `Color` → `rgba(255,255,255, 0.4)`).
    -   **Rounded Caps**: Bars have `borderRadius: 6` (or similar) on top.
    -   **Track**: Light grey track behind bars (`#f0f0f0`).
-   **Line Charts**:
    -   **Curve**: CatmullRom or Natural curve (`d3.curveCatmullRom`).
    -   **Stroke**: Thick (`4px`), rounded caps/joins.
    -   **Gradient Stroke**: Gradient along the line path if possible (Skia).
-   **Interaction**: Touch-and-drag scrubbing is preferred over static charts.

---

## 8. Implementation Quick Reference

### Standard Card Boilerplate

```tsx
<GlassView style={styles.card} glassEffectStyle="regular">
  <View style={styles.header}>
    <Text style={styles.title}>Title</Text>
    <SymbolView name="info.circle" tintColor="#999" />
  </View>
  {/* Content */}
</GlassView>

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 20,
    width: '100%',
    overflow: 'hidden',
  }
});
```

### Standard Gradients
Use `expo-linear-gradient`.
```tsx
<LinearGradient
    colors={['#Color', 'rgba(255,255,255,0.4)']} // Fade to trans/white
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
/>
```
