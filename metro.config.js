const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
  };

  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"],
  };

  // Exclude dotfiles and temporary folders inside node_modules from being watched/resolved
  config.resolver.blockList = [
    /node_modules[/\\][^/\\]+[/\\]\.[^/\\]+/,
    /node_modules[/\\]\.[^/\\]+/,
    /[/\\]\.git[/\\]/
  ];

  return config;
})();
