# Liquid Glass Missing in Expo Dev Client (iOS 26)

## Executive Summary
- Liquid Glass shows up when the app is launched directly from Xcode but not when started through Expo Dev Client (`expo run:ios`). The runtime log `isLiquidGlassAvailable: false` indicates the native constant is resolving to `false`, not the JS fallback.
- The Expo Glass module is hard‑gated at compile time: it only reports availability when compiled with Swift compiler **≥ 6.2** _and_ running on iOS 26+; otherwise it returns `false`. The Dev Client build path is the only path that can plausibly be using an older toolchain or a cached pod product, so the guard evaluates to `false` there. Xcode’s direct run uses the iOS 26 beta toolchain, so the guard evaluates to `true`, enabling Liquid Glass.
- Dev Client also changes the startup sequence: in debug it swaps in a deferred root view and resets the React host before attaching the bundle. That reorders UIKit initialization compared to the normal Expo delegate path and may prevent the system’s new default tab bar appearance (Liquid Glass) from being applied before React-native-screens constructs the tab bar.
- Expo Router’s `NativeTabs` uses a custom appearance layer via react-native-screens; without Liquid Glass available this falls back to the legacy blurred/tabBarBackground path, matching the “tabs render but no Liquid Glass” symptom.

## Xcode vs Expo Launch (Observed Differences)
| Aspect | Xcode run (works) | Expo Dev Client run (missing Liquid Glass) |
| --- | --- | --- |
| Binary/toolchain path | Built and launched from Xcode using iOS 26 beta toolchain (Swift 6.2) | Uses Dev Client debug build; may reuse previously built pod products or prebuilt RN core compiled with older toolchain |
| Liquid Glass gate | `#if compiler(>=6.2)` + `@available(iOS 26)` passes → native constant `true` | Compiler gate likely fails → native constant `false`; logs confirm |
| Bundle source | Uses Xcode scheme; JS bundle from build or Metro depending on scheme | Dev Client Metro bundle (`.expo/.virtual-metro-entry` in `AppDelegate.swift`) |
| Startup sequence | Standard Expo delegate creates window & root VC immediately | Dev Launcher defers root view, resets React host, reattaches bundle later (`ExpoDevLauncherReactDelegateHandler`) |
| UIKit tab bar appearance | System defaults intact, Liquid Glass rendered | Appearance routed through react-native-screens without Liquid Glass capability; uses legacy blur/background |
| Runtime flags | Release/Debug depending on scheme; no Dev Launcher | Always `EXAppDefines.APP_DEBUG == true`, Dev Launcher & Network Inspector enabled |

## Confirmed Facts (from repo)
- Expo Glass availability check requires Swift compiler ≥ 6.2 and iOS 26+; otherwise returns `false` (`node_modules/expo-glass-effect/ios/GlassEffectModule.swift` and `ios/GlassView.swift`).
- JS fallback for `isLiquidGlassAvailable` is a hard `false`, so any failure of the native gate surfaces directly (`node_modules/expo-glass-effect/src/isLiquidGlassAvailable.ts` / `.ios.js`).
- Dev Client debug path defers React root creation and replaces the window’s root view controller after Dev Launcher starts (`node_modules/expo-dev-launcher/ios/ReactDelegateHandler/ExpoDevLauncherReactDelegateHandler.swift`).
- App bootstraps with `ExpoAppDelegate`, sets the Metro bundle URL for DEBUG, and creates the `UIWindow` before calling `super` (`ios/lifelongapp/AppDelegate.swift`).
- Native tabs are instantiated via `expo-router/unstable-native-tabs`, which builds a custom tab bar appearance through react-native-screens (`app/(tabs)/_layout.tsx`, `node_modules/expo-router/build/native-tabs/NativeBottomTabs/NativeTabsView.js`, `appearance.js`).
- Podfile uses prebuilt React Native core (`RCT_USE_PREBUILT_RNCORE=1`) and enables Dev Client network inspector in all iOS builds (`ios/Podfile`, `ios/Podfile.properties.json`).

## Evidence and Reasoning
- **Compiler gate explains the false constant**: `GlassEffectModule` returns `false` unless the code is compiled with Swift compiler ≥ 6.2 and the app isn’t marked `UIDesignRequiresCompatibility`. The observed `isLiquidGlassAvailable: false` while Reduce Transparency is `false` means the native constant itself returned `false`, not the accessibility check. This aligns with a build compiled using an older toolchain (or cached pod binary) that fails `compiler(>=6.2)`.
- **Dev Client is the only differing build/launch path**: Xcode and Expo runs share the same source and Info.plist (no `UIDesignRequiresCompatibility` key), but Dev Client introduces its own delegate handler and may reuse previously built pods; that is the primary variable affecting the compile-time gate.
- **Startup order differs**: Dev Launcher’s deferred root view (`EXDevLauncherDeferredRCTRootView`) replaces the window’s root controller after the bundle URL is resolved. UIKit’s new default tab bar material is applied during early window initialization; replacing the root later can leave the tab bar with the older appearance settings provided by react-native-screens instead of the system Liquid Glass default.
- **Tab bar appearance is custom-built**: `NativeTabsView` disables the `controlledBottomTabs` experiment and constructs tab bar appearance objects manually. When Liquid Glass is unavailable, these constructions fall back to traditional blur/background values, matching the “tabs render but no Liquid Glass” observation.

## Hypotheses (clearly labeled)
- **H1: Toolchain mismatch/cached Dev Client build** – The Dev Client binary (or its cached pods) is compiled with a Swift compiler version \< 6.2, so the `#if compiler(>=6.2)` guard returns `false`, disabling Liquid Glass. The Xcode direct build uses the iOS 26 beta toolchain, so the guard returns `true`.
- **H2: Dev Launcher alters UIKit initialization** – Because Dev Launcher defers root view creation and rebinds the React host, UIKit’s default tab bar appearance for iOS 26 may not be applied before react-native-screens constructs its tab bar, yielding the legacy, non–Liquid Glass rendering in Dev Client runs.
- **H3: Debug-only runtime path** – Dev Client always runs with `EXAppDefines.APP_DEBUG == true`, enabling Dev Launcher and the Network Inspector. If Expo Glass or react-native-screens conditions Liquid Glass usage on non-debug (not evident in code) the result would be the observed discrepancy. No explicit `__DEV__` guards were found in repo code, but the differing native delegate path remains.

## Open Questions
- What Swift compiler version and SDK were used for the currently installed Dev Client binary? (Compare with Xcode’s build log for the working run.)
- Are pods for `ExpoGlassEffect` rebuilt with the iOS 26 toolchain when running `expo run:ios`, or is a previously compiled artifact being reused from DerivedData/`ios/build`?
- Does Dev Launcher inject any UIKit appearance overrides at runtime (e.g., via modules) that could mask the system Liquid Glass defaults?
- When launching from Xcode, was the run configuration Release or Debug? (Would clarify whether the presence/absence of Dev Launcher alone explains the difference.)

## Relevant Files (for future debugging)
- `ios/lifelongapp/AppDelegate.swift` – App entry, Metro URL for DEBUG, window setup order.
- `node_modules/expo-glass-effect/ios/GlassEffectModule.swift` – Compile-time gate for `isLiquidGlassAvailable`.
- `node_modules/expo-glass-effect/ios/GlassView.swift` – Runtime gate for `UIGlassEffect` creation under the same compiler/iOS checks.
- `node_modules/expo-glass-effect/src/isLiquidGlassAvailable.ts` – JS fallback (`false`) showing the native constant is decisive.
- `node_modules/expo-dev-launcher/ios/ReactDelegateHandler/ExpoDevLauncherReactDelegateHandler.swift` – Dev Client-specific root view deferral and React host reset.
- `app/(tabs)/_layout.tsx` – Usage of `expo-router/unstable-native-tabs`.
- `node_modules/expo-router/build/native-tabs/NativeBottomTabs/NativeTabsView.js` and `appearance.js` – Custom tab bar appearance pipeline.
- `ios/Podfile`, `ios/Podfile.properties.json` – Build flags (prebuilt RN core, Dev Client inspector) shared by both launch paths but indicative of prebuilt/cached artifacts.

## Notes
- No fixes or code changes were applied; this document records the investigation state only.
- The observed behavior is attributable to launch/runtime differences, not device, OS version, hardware, or the app’s JS/TS configuration.
