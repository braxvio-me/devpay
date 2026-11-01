// The marketing site (devsite/) is a separate Next.js app; keep Metro out of it.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.blockList = [/\/devsite\/.*/];

module.exports = config;
