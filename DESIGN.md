# Lifelong Agent Persona & Design Guidelines

You are an expert React Native developer specializing in **Expo**, **Expo Router**, and **Expo UI**. You are building "Lifelong", a personal longevity app.

## Design System: "Aero & Glass"

> **Aesthetics**: Modern iOS Aero, Glass-morphism, Vivid Native Feel.
> **Philosophy**: Calm, Optimistic, High-Fidelity.

### 1. Core Principles
The integration of **Glass** (`UIVisualEffectView`) is the central pillar. We move away from solid opaque cards to translucent materials that blur the content behind them.

-   **Glass First**: Primary containers (Cards, Navigation, Headers) use `GlassView`.
-   **Soft Gradients**: Backgrounds use subtle, flowing gradients.
-   **Native Fidelity**: Use `SF Symbols`, native blurs, and system typography.

### 2. Materials & Backgrounds

#### Glass Material
Use `expo-glass-effect` for all card surfaces.

-   **Component**: `<GlassView />`
-   **Style**: `glassEffectStyle="regular"`
-   **Card Styling**: `borderRadius: 24` or `30`, `overflow: 'hidden'`.
-   **No Shadow on Glass**: Glass relies on the content behind it for separation.

#### Screen Background
1.  **Bottom**: Scrolling/static content (Images/Blobs).
2.  **Middle**: `BlurView` or white gradient overlay.
3.  **Top**: Content (Glass Cards).

### 3. Color System

#### Typography
-   **Primary**: `#222` (Deep Grey)
-   **Secondary**: `#666` (Medium Grey)
-   **Tertiary**: `#999` (Light Grey)

#### Functional
-   **Success**: `#51cf66` (Good), `#2d9f48` (Text)
-   **Warning**: `#fcc419`
-   **Error**: `#ff6b6b` (Bad), `#e03131` (Text)

#### Identity (Family)
-   **Red**: `#eb4d4b`
-   **Green**: `#6ab04c`
-   **Blue**: `#0984e3`
-   **Purple**: `#a29bfe`

### 4. Typography (SF Pro)
-   **Hero/Name**: 28px, SemiBold (600), Tracking -0.5
-   **Card Title**: 22px, Bold (700), Tracking -0.5
-   **Body**: 15px, Regular (400)
-   **Label**: 14px, SemiBold (600)

### 5. Iconography
Use **SF Symbols** via `expo-symbols`.
-   **Sizes**: 14px (Inline), 18px (Footer).
-   **Colors**: `#999` (Muted), `#444`/`#666` (Dark).

### 6. Implementation Reference

#### Standard Glass Card
```tsx
<GlassView style={styles.card} glassEffectStyle="regular">
  <View style={styles.header}>
    <Text style={styles.title}>Title</Text>
    <SymbolView name="info.circle" tintColor="#999" />
  </View>
</GlassView>
```
