// Metro configuration for Expo
// Ensures we resolve browser-friendly builds (e.g., jose) before node targets.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = [
  'react-native',
  'browser',
  'import',
  'require',
  'default',
];

module.exports = config;
