const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");
const webpack = require("webpack");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  output: {
    filename: "js/[name].[contenthash:8].js",
    chunkFilename: "js/[name].[contenthash:8].js"
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        oneOf: [
          {
            resourceQuery: /module/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  hmr: false,
                  publicPath: "../"
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
                loader: MiniCssExtractPlugin.loader,
                options: {
                  hmr: false,
                  publicPath: "../"
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
                loader: MiniCssExtractPlugin.loader,
                options: {
                  hmr: false,
                  publicPath: "../"
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
                loader: MiniCssExtractPlugin.loader,
                options: {
                  hmr: false,
                  publicPath: "../"
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
        // exclude: [
        //   function() {
        //   }
        // ],
        use: [
          {
            loader: "cache-loader",
            options: {
              cacheDirectory: path.resolve(__dirname, "node_modules/.cache/babel-loader")
              // cacheIdentifier: "25925c15"
            }
          },
          {
            loader: "thread-loader"
          },
          {
            loader: "babel-loader"
          }
        ]
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        collapseBooleanAttributes: true,
        removeScriptTypeAttributes: true
      },
      template: "./public/index.html"
    }),
    new PreloadWebpackPlugin(
      {
        rel: "preload",
        include: "initial",
        fileBlacklist: [
          /\.map$/,
          /hot-update\.js$/
        ]
      }
    ),
    new PreloadWebpackPlugin(
      {
        rel: "prefetch",
        include: "asyncChunks"
      }
    ),
    new MiniCssExtractPlugin(
      {
        filename: "css/[name].[contenthash:8].css",
        chunkFilename: "css/[name].[contenthash:8].css"
      }
    ),
    new webpack.NamedChunksPlugin(),
    new webpack.HashedModuleIdsPlugin(
      {
        hashDigest: "hex"
      }
    )
    // new OptimizeCssAssetsPlugin({
    //   assetNameRegExp: /\.optimize\.css$/g,
    //   cssProcessor: require('cssnano'),
    //   cssProcessorPluginOptions: {
    //     preset: ['default', { discardComments: { removeAll: true } }],
    //   },
    //   canPrint: true
    // })
  ],
  optimization: {
    minimizer: [new OptimizeCssAssetsPlugin()],
    minimize: true,
    // noEmitOnErrors: true,
    // splitChunks: true,
    // runtimeChunk: {
    //   name: "runtime"
    // }
  }
});
