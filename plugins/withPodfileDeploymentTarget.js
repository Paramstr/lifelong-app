const { withPodfile } = require('@expo/config-plugins');

const withPodfileDeploymentTarget = (config) => {
  return withPodfile(config, (config) => {
    const podfileContent = config.modResults.contents;

    // Avoid duplicating the patch if it's already there
    if (podfileContent.includes("Compliance for some pods")) {
      return config;
    }

    // The code we want to inject to force minimum deployment target on all Pods
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
    // This runs it at the beginning of post_install.
    const modifiedContent = podfileContent.replace(
      /post_install do \|installer\|/,
      `post_install do |installer|${patch}`
    );

    config.modResults.contents = modifiedContent;
    return config;
  });
};

module.exports = withPodfileDeploymentTarget;
