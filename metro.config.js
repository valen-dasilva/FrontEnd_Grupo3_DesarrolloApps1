const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  config.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer");
  config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== "svg");
  config.resolver.sourceExts.push("svg");

  // Exclude dotfiles and temporary folders inside node_modules from being watched/resolved
  config.resolver.blockList = [
    /node_modules\/.*\/\..*/,
    /node_modules\/\..*/,
    /.*\.git\/.*/
  ];

  return config;
})();
