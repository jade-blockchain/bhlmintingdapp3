const webpack = require("webpack")
    
module.exports = function override(config) {
  config.resolve.fallback = {
    fs: false,
    buffer: require.resolve("buffer/"),
    util: require.resolve("util/"),
    stream: require.resolve("stream-browserify"),
    assert: require.resolve("assert/"),
    http: require.resolve("stream-http/"),
    url: require.resolve("url/"),
    https: require.resolve("https-browserify/"),
    os: require.resolve("os-browserify/"),
    };
  
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ];
  return config;
};