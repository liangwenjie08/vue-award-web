const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const CaseSensitivePathsWebpackPlugin = require("case-sensitive-paths-webpack-plugin");

module.exports = {
  context: path.resolve(__dirname),
  entry: {
    main: path.resolve(__dirname, "src/main.js")
  },
  plugins: [
    new VueLoaderPlugin(),
    //此Webpack插件强制所有必需模块的完整路径与磁盘上实际路径的确切大小写相匹配。
    new CaseSensitivePathsWebpackPlugin()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
      // vue$: "vue/dist/vue.runtime.esm.js"
    },
    //可以省略后缀的文件
    extensions: [
      ".js",
      ".vue"
    ],
    // import时搜索的目录
    modules: [
      path.resolve(__dirname, "node_modules"),
      "node_modules"
    ]
  },
  resolveLoader: {
    //loader搜索目录
    modules: [
      path.resolve(__dirname, "node_modules"),
      "node_modules"
    ],
    //可以省略后缀的文件
    extensions: [
      ".js",
      ".vue"
    ],
  },
  module: {
    //匹配的文件都不编译
    noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
    rules: [{
      test: /\.vue$/,
      exclude: /node_modules/,
      include: path.resolve(__dirname, "src"),
      use: [{
        loader: "cache-loader",
        options: {
          //缓存文件夹
          cacheDirectory: path.resolve(__dirname, "node_modules/.cache/vue-loader"),
          //缓存失效标识符，这是默认配置
          cacheIdentifier: "cache-loader:{version} {process.env.NODE_ENV}"
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
        //通过base64的方式返回静态资源
        loader: "url-loader",
        options: {
          limit: 4096,
          //超过限制时执行的loader
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
