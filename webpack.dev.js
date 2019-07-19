const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require("webpack");

module.exports = merge(common, {
  devtool: "cheap-module-eval-source-map",
  mode: "development",
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9527,
    hot: true,
    host: "localhost",
    stats: "errors-only",
    open: true,
    overlay: true
  },
  output: {
    filename: "[name].js",
    globalObject: "(typeof self !== 'undefined' ? self : this)"
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
});
