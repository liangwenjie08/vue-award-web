const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  context: path.resolve(__dirname),
  entry: {
    main: "./src/index.js"
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin()
  ],
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/"
  },
  resolve: {
    alias: {
      "@": "D:\\study\\vue-test\\src",
      vue$: "vue/dist/vue.runtime.esm.js"
    },
    extensions: [
      ".js",
      ".vue"
    ],
    modules: [
      "node_modules",
      path.resolve(__dirname, "node_modules")
    ]
  },
  resolveLoader: {
    modules: [
      "node_modules",
      path.resolve(__dirname, "node_modules")
    ]
  },
  module: {
    noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/
  }
};
