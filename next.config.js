/** @type {import('next').NextConfig} */
const withCSS = require("@zeit/next-css");
module.exports = {
  reactStrictMode: true,
  eslint: {
    dirs: ["."],
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push(
      "pino-pretty",
      "lokijs",
      "encoding",
      "style-loader",
      "css-loader",
    );
    return config;
  },
};
