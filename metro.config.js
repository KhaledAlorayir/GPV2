// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

module.exports = getDefaultConfig(__dirname);
module.exports = (() => {
  const defualtConfing = getDefaultConfig(__dirname);
  const { assetExts } = defualtConfing.resolver;
  return {
    resolver: {
      assetExts: [...assetExts, "bin"],
    },
  };
})();
