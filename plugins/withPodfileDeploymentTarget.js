const { withPodfile } = require('@expo/config-plugins');

const withPodfileDeploymentTarget = (config) => {
  return withPodfile(config, (config) => {
    const podfileContent = config.modResults.contents;

    // Avoid duplicating the patch
    if (podfileContent.includes("target.name == 'NitroModules'")) {
      return config;
    }

    const patch = `
  installer.pods_project.targets.each do |target|

    # SDWebImage fix
    if target.name.include?('SDWebImage')
      target.build_configurations.each do |config|
        config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '18.0'
      end
    end

    # NitroModules fix
    if target.name == 'NitroModules'
      target.build_configurations.each do |config|
        config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '18.0'
        config.build_settings['SWIFT_VERSION'] = '5.9'
      end
    end

    # Unistyles fix (Swift + availability)
    if target.name == 'Unistyles'
      target.build_configurations.each do |config|
        config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '18.0'
        config.build_settings['SWIFT_VERSION'] = '5.9'
      end
    end

  end
`;


    const modifiedContent = podfileContent.replace(
      /post_install do \|installer\|/,
      `post_install do |installer|${patch}`
    );

    config.modResults.contents = modifiedContent;
    return config;
  });
};

module.exports = withPodfileDeploymentTarget;
