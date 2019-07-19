const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

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
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    }),
    new VueLoaderPlugin()
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
      use: [
        /* config.module.rule('images').use('url-loader') */
        {
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
        }
      ]
    }, {
      test: /\.(svg)(\?.*)?$/,
      use: [
        /* config.module.rule('svg').use('file-loader') */
        {
          loader: "file-loader",
          options: {
            name: "img/[name].[hash:8].[ext]"
          }
        }
      ]
    }]
  }
};
