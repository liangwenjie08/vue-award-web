const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const CaseSensitivePathsWebpackPlugin = require("case-sensitive-paths-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");

module.exports = {
  context: path.resolve(__dirname),
  entry: {
    main: "./src/main.js"
  },
  node: {
    setImmediate: false,
    dgram: "empty",
    fs: "empty",
    net: "empty",
    tls: "empty",
    child_process: "empty"
  },
  plugins: [
    new VueLoaderPlugin(),
    new CaseSensitivePathsWebpackPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    new CleanWebpackPlugin(),
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
  ],
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/"
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
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
    noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
    rules: [{
      test: /\.vue$/,
      use: [{
        loader: "cache-loader",
        options: {
          cacheDirectory: path.resolve(__dirname, "node_modules/.cache/vue-loader")
        }
      }, {
        loader: "vue-loader",
        options: {
          compilerOptions: {
            preserveWhitespace: false
          },
          cacheDirectory: path.resolve(__dirname, "node_modules/.cache/vue-loader")
        }
      }]
    }, {
      test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
      use: [{
        loader: "url-loader",
        options: {
          limit: 4096,
          fallback: {
            loader: "file-loader",
            options: {
              name: "img/[name].[hash:8].[ext]"
            }
          }
        }
      }]
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
      use: [
        {
          loader: "url-loader",
          options: {
            limit: 4096,
            fallback: {
              loader: "file-loader",
              options: {
                name: "fonts/[name].[hash:8].[ext]"
              }
            }
          }
        }
      ]
    }, {
      test: /\.(svg)(\?.*)?$/,
      use: [{
        loader: "file-loader",
        options: {
          name: "img/[name].[hash:8].[ext]"
        }
      }]
    }]
  }
};
