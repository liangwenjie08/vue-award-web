const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");
const webpack = require("webpack");
// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

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
          /* config.module.rule('js').use('cache-loader') */
          {
            loader: "cache-loader",
            options: {
              cacheDirectory: path.resolve(__dirname, "node_modules/.cache/babel-loader")
              // cacheIdentifier: "25925c15"
            }
          },
          /* config.module.rule('js').use('thread-loader') */
          {
            loader: "thread-loader"
          },
          /* config.module.rule('js').use('babel-loader') */
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
    /* config.plugin('prefetch') */
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
  ]
  // optimization: {
  //   minimizer: [
  //     {
  //       options: {
  //         test: /\.m?js(\?.*)?$/i,
  //         chunkFilter: () => true,
  //         warningsFilter: () => true,
  //         extractComments: false,
  //         sourceMap: true,
  //         cache: true,
  //         cacheKeys: defaultCacheKeys => defaultCacheKeys,
  //         parallel: true,
  //         include: undefined,
  //         exclude: undefined,
  //         minify: undefined,
  //         terserOptions: {
  //           output: {
  //             comments: /^\**!|@preserve|@license|@cc_on/i
  //           },
  //           compress: {
  //             arrows: false,
  //             collapse_vars: false,
  //             comparisons: false,
  //             computed_props: false,
  //             hoist_funs: false,
  //             hoist_props: false,
  //             hoist_vars: false,
  //             inline: false,
  //             loops: false,
  //             negate_iife: false,
  //             properties: false,
  //             reduce_funcs: false,
  //             reduce_vars: false,
  //             switches: false,
  //             toplevel: false,
  //             typeofs: false,
  //             booleans: true,
  //             if_return: true,
  //             sequences: true,
  //             unused: true,
  //             conditionals: true,
  //             dead_code: true,
  //             evaluate: true
  //           },
  //           mangle: {
  //             safari10: true
  //           }
  //         }
  //       }
  //     }
  //   ],
  //   splitChunks: {
  //     cacheGroups: {
  //       vendors: {
  //         name: "chunk-vendors",
  //         test: /[\\\/]node_modules[\\\/]/,
  //         priority: - 10,
  //         chunks: "initial"
  //       },
  //       common: {
  //         name: "chunk-common",
  //         minChunks: 2,
  //         priority: - 20,
  //         chunks: "initial",
  //         reuseExistingChunk: true
  //       }
  //     }
  //   }
  // }
});
