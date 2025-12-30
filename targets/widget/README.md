# Lifelong Widget Target

This directory contains the source code and configuration for the Lifelong iOS Widget, managed via `@bacons/apple-targets`.

## Directory Structure

- **`expo-target.config.js`**: Native target configuration.
- **`widgets.swift`**: Main SwiftUI entry point for the widget.
- **`AppIntent.swift`**: Defines App Intents for user configuration.
- **`Assets.xcassets`**: Native assets (icons, colors).

---

## Development Workflow (DX)

### 🚀 Fast SwiftUI Previews
To preview your widget UI without waiting for the full React Native bundle to load:

1.  Run the **prewidget** script:
    ```bash
    npm run prewidget
    ```
    This builds a "blank" app template that only contains the widget target.
2.  Open the project in Xcode:
    ```bash
    xed ios
    ```
3.  Select the **Widget Extension** target in the Xcode schemes and open `widgets.swift`.
4.  Use the **Xcode Preview** canvas to design your UI with instant hot-reload.

---

## Data Sharing (The Bridge)

Since the widget runs in a separate process, you must use **App Groups** to share data.

### 1. React Native Side (Writer)
Use the `ExtensionStorage` helper to write data and trigger a widget reload.

```typescript
import { ExtensionStorage } from '@bacons/apple-targets';
import { AppState } from 'react-native';

const widgetStorage = new ExtensionStorage("group.com.param.lifelongapp");

// Update data
widgetStorage.set("widget_data_key", JSON.stringify({ steps: 1000 }));

// Trigger reload on app background
AppState.addEventListener('change', (state) => {
  if (state === 'background') {
    widgetStorage.reloadWidget();
  }
});
```

### 2. Swift Side (Reader)
Read from `UserDefaults` using the same App Group ID.

```swift
let defaults = UserDefaults(suiteName: "group.com.param.lifelongapp")
let dataString = defaults?.string(forKey: "widget_data_key") ?? "{}"
```

---

## Production Build

When ready to test the full app integration:

1.  Standard prebuild:
    ```bash
    npx expo prebuild -p ios --clean
    ```
2.  Run the app:
    ```bash
    npm run ios:clean
    ```

## Troubleshooting

- **Black Screen in Preview**: Run `npm run prewidget` to ensure you are in the lightweight preview mode.
- **Failed to show Widget (_XCWidgetKind)**: If you get an error about `_XCWidgetKind` when running the scheme:
    1. In Xcode, click the **Scheme** selector (next to the Play button) and choose **Edit Scheme...**.
    2. Go to **Run** (left sidebar) -> **Arguments** (top tab).
    3. Under **Environment Variables**, add:
        - Name: `_XCWidgetKind`
        - Value: `widget` (matches the `kind` string in your `widgets.swift`).
- **Data Not Refreshing**: Verify the App Group ID matches exactly in `app.json`, `ExtensionStorage`, and `UserDefaults`.
- **Booleans**: It is safer to pass booleans as strings ("true"/"false") or integers (1/0) when sharing via JSON between JS and Swift.
