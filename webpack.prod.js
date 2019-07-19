const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  output: {
    filename: "js/[name].[contenthash:8].js",
    chunkFilename: "js/[name].[contenthash:8].js"
  },
});
