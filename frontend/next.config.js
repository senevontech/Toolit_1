const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = (phase) => ({
  reactStrictMode: true,
  ...(phase === PHASE_DEVELOPMENT_SERVER ? {} : { output: "export" }),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
});
