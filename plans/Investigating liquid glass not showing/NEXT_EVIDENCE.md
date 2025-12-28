# Next Evidence to Collect

> Focus: confirm toolchain used by Expo `run:ios`, the Swift compiler used for pods, and the source of the `isLiquidGlassAvailable` boolean. Run commands from repo root unless noted.

## 1) Confirm Expo `run:ios` toolchain
- `xcode-select -p`
- `xcodebuild -version`

## 2) Confirm Swift compiler used for pods during Expo build
- Inspect Expo build log for Swift version lines:
  - `grep -i \"swift\" .expo/xcodebuild.log | head -n 40`
  - `grep -i \"swiftc\" .expo/xcodebuild.log | head -n 40`
  - `grep -i \"swift version\" .expo/xcodebuild.log | head -n 40`

## 3) Locate the logged boolean in the app
- Find where `isLiquidGlassAvailable` is logged:
  - `rg \"isLiquidGlassAvailable\"`
- Trace to the native module computing it:
  - Open `node_modules/expo-glass-effect/ios/GlassEffectModule.swift`
  - Open `node_modules/expo-glass-effect/src/isLiquidGlassAvailable.ts`

---

# Collected Evidence (Dec 28, 2025)

## Toolchain actually used by `expo run:ios`
- `xcode-select -p` → `/Applications/Xcode.app/Contents/Developer`
- `xcodebuild -version` → `Xcode 16.2 (16C5032a)`

## Swift compiler reported in Expo build log
- `.expo/xcodebuild.log` shows the invoked compiler path: `/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/swiftc --version` (no emitted version string in the captured lines).
- Swift driver entries carry `swift-version 5` and `SWIFT_VERSION=5.0`, meaning pods were compiled with Swift 5 from Xcode 16.2 (not Swift 6.2).
- SDK in use: `iPhoneSimulator18.2.sdk` with target `arm64-apple-ios18.0-simulator`, i.e., the Expo build used the iOS 18.2 SDK/toolchain.

## Source of the boolean
- `rg \"isLiquidGlassAvailable\"` finds no logging sites in app code; the earlier runtime log line (`isLiquidGlassAvailable: false`) must come from ad-hoc logging during runs, not from checked-in sources.
- Computation path:
  - Native constant defined in `node_modules/expo-glass-effect/ios/GlassEffectModule.swift` — returns `false` unless compiled with `compiler(>=6.2)` and running on iOS 26+, with `UIDesignRequiresCompatibility != true`.
  - JS wrapper in `node_modules/expo-glass-effect/src/isLiquidGlassAvailable.ts` / `.ios.js` reads that native constant; the TS fallback is a hard `false` if native is absent.

## Implication
- The current Dev Client/Expo-built pods were compiled with Swift 5 (Xcode 16.2), so the `#if compiler(>=6.2)` guard evaluates to `false`, yielding `isLiquidGlassAvailable: false` at runtime. Xcode direct builds with the iOS 26 beta toolchain (Swift 6.2) would satisfy the guard and enable Liquid Glass.
