const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    reactStrictMode: true,
    distDir: isDev ? ".next-dev" : ".next",
    ...(isDev ? {} : { output: "export" }),
    trailingSlash: true,
    images: {
      unoptimized: true,
    },
  };
};
