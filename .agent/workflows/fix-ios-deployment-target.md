---
description: How to fix iOS Podfile deployment target compilation errors using an Expo Config Plugin
---

# Fix iOS Deployment Target Issues

Modern React Native libraries (like `NitroModules` or C++ based modules) often require newer iOS deployment targets (e.g., iOS 16.0+). However, many standard libraries (like `SDWebImage`) still default to older targets (e.g., iOS 9.0) in their podspecs. This mismatch causes compilation errors (e.g., `module 'CxxStdlib' has a minimum deployment target of iOS 16.0`).

To fix this persistently—even when the `ios` folder is deleted and regenerated—we use an **Expo Config Plugin**.

## 1. Create the Config Plugin

Create a file at `plugins/withPodfileDeploymentTarget.js`:

```javascript
const { withPodfile } = require('@expo/config-plugins');

const withPodfileDeploymentTarget = (config) => {
  return withPodfile(config, (config) => {
    const podfileContent = config.modResults.contents;

    // Avoid duplicating the patch if it's already there
    if (podfileContent.includes("Compliance for some pods")) {
      return config;
    }

    // The code we want to inject to force minimum deployment target on all Pods
    // Update the version (e.g., '18.0') as needed based on your app.json deploymentTarget
    const patch = `
    # Compliance for some pods (like SDWebImage) that have old deployment targets
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        if config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'].to_f < 18.0
          config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '18.0'
        end
      end
    end
`;

    // We interpolate this into the `post_install` block.
    // We'll look for `post_install do |installer|` and insert our patch right after it.
    const modifiedContent = podfileContent.replace(
      /post_install do \|installer\|/,
      `post_install do |installer|${patch}`
    );

    config.modResults.contents = modifiedContent;
    return config;
  });
};

module.exports = withPodfileDeploymentTarget;
```

## 2. Register the Plugin

Add the plugin to your `app.json` configuration so it runs during `npx expo prebuild`:

```json
{
  "expo": {
    "plugins": [
      // ... other plugins
      "./plugins/withPodfileDeploymentTarget"
    ]
  }
}
```

## 3. Apply the Changes

To apply the fix, regenerate the native directories:

```bash
# This will run prebuild, which executes the plugin, and then pod install
npx expo prebuild --clean
```

Or use the project's clean script:

```bash
npm run ios:clean
```
