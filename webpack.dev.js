const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");

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
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    }),
    new PreloadWebpackPlugin({
      rel: "preload",
      include: "initial",
      fileBlacklist: [
        /\.map$/,
        /hot-update\.js$/
      ]
    }),
    new PreloadWebpackPlugin({
      rel: "prefetch",
      include: "asyncChunks"
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.less$/,
        oneOf: [
          {
            resourceQuery: /module/,
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
                  importLoaders: 2,
                  modules: true,
                  localIdentName: "[name]_[local]_[hash:base64:5]"
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
          },
          {
            resourceQuery: /\?vue/,
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
          },
          {
            test: /\.module\.\w+$/,
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
                  importLoaders: 2,
                  modules: true,
                  localIdentName: "[name]_[local]_[hash:base64:5]"
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
          },
          {
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
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          "vue-style-loader",
          "css-loader"
        ]
      },
      {
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
      }
    ]
  }
});
