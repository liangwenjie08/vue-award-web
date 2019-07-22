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
    quiet: true,
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
      test: /\.less$/,
      oneOf: [
        {
          resourceQuery: /module/,
          use: [
            /* config.module.rule('less').oneOf('vue-modules').use('vue-style-loader') */
            {
              loader: "vue-style-loader",
              options: {
                sourceMap: false,
                shadowMode: false
              }
            },
            /* config.module.rule('less').oneOf('vue-modules').use('css-loader') */
            {
              loader: "css-loader",
              options: {
                sourceMap: false,
                importLoaders: 2,
                modules: true,
                localIdentName: "[name]_[local]_[hash:base64:5]"
              }
            },
            /* config.module.rule('less').oneOf('vue-modules').use('postcss-loader') */
            {
              loader: "postcss-loader",
              options: {
                sourceMap: false
              }
            },
            /* config.module.rule('less').oneOf('vue-modules').use('less-loader') */
            {
              loader: "less-loader",
              options: {
                sourceMap: false
              }
            }
          ]
        }, {
          resourceQuery: /\?vue/,
          use: [
            /* config.module.rule('less').oneOf('vue').use('vue-style-loader') */
            {
              loader: "vue-style-loader",
              options: {
                sourceMap: false,
                shadowMode: false
              }
            },
            /* config.module.rule('less').oneOf('vue').use('css-loader') */
            {
              loader: "css-loader",
              options: {
                sourceMap: false,
                importLoaders: 2
              }
            },
            /* config.module.rule('less').oneOf('vue').use('postcss-loader') */
            {
              loader: "postcss-loader",
              options: {
                sourceMap: false
              }
            },
            /* config.module.rule('less').oneOf('vue').use('less-loader') */
            {
              loader: "less-loader",
              options: {
                sourceMap: false
              }
            }
          ]
        }, {
          test: /\.module\.\w+$/,
          use: [
            /* config.module.rule('less').oneOf('normal-modules').use('vue-style-loader') */
            {
              loader: "vue-style-loader",
              options: {
                sourceMap: false,
                shadowMode: false
              }
            },
            /* config.module.rule('less').oneOf('normal-modules').use('css-loader') */
            {
              loader: "css-loader",
              options: {
                sourceMap: false,
                importLoaders: 2,
                modules: true,
                localIdentName: "[name]_[local]_[hash:base64:5]"
              }
            },
            /* config.module.rule('less').oneOf('normal-modules').use('postcss-loader') */
            {
              loader: "postcss-loader",
              options: {
                sourceMap: false
              }
            },
            /* config.module.rule('less').oneOf('normal-modules').use('less-loader') */
            {
              loader: "less-loader",
              options: {
                sourceMap: false
              }
            }
          ]
        }, {
          use: [
            /* config.module.rule('less').oneOf('normal').use('vue-style-loader') */
            {
              loader: "vue-style-loader",
              options: {
                sourceMap: false,
                shadowMode: false
              }
            },
            /* config.module.rule('less').oneOf('normal').use('css-loader') */
            {
              loader: "css-loader",
              options: {
                sourceMap: false,
                importLoaders: 2
              }
            },
            /* config.module.rule('less').oneOf('normal').use('postcss-loader') */
            {
              loader: "postcss-loader",
              options: {
                sourceMap: false
              }
            },
            /* config.module.rule('less').oneOf('normal').use('less-loader') */
            {
              loader: "less-loader",
              options: {
                sourceMap: false
              }
            }
          ]
        }
      ]
    }, {
      test: /\.css$/,
      use: [
        "vue-style-loader",
        "css-loader"
      ]
    }, {
      test: /\.js$/,
      use: [
        {
          loader: "cache-loader",
          options: {
            cacheDirectory: path.resolve(__dirname, "node_modules/.cache/babel-loader")
            // cacheIdentifier: "22a018e2"
          }
        },
        {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      ]
    }]
  }
});
