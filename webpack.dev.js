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
  ],
  module: {
    rules: [{
      test: /\.css$/,
      use: [
        {
          loader: "vue-style-loader",
          options: {
            sourceMap: false,
            shadowMode: false
          }
        },
        {
          loader: "css-loader",
          options: {
            sourceMap: false,
            importLoaders: 2
          }
        },
        {
          loader: "postcss-loader",
          options: {
            sourceMap: false
          }
        },
        {
          loader: "less-loader",
          options: {
            sourceMap: false
          }
        }
      ]
    }]
  }
});
