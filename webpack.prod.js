const path = require("path");
//合并webpack配置
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
//将css分离到单个文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");
const webpack = require("webpack");
//压缩 css
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
//压缩js
const TerserPlugin = require("terser-webpack-plugin");
//将runtime内联到index.html中
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");

module.exports = merge(common, {
  devtool: "source-map",
  mode: "production",
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "./",
    filename: "js/[name].[contenthash:8].js",
    chunkFilename: "js/[name].[contenthash:8].js"
  },
  module: {
    rules: [
      {
        test: /\.less$/,
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
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: false,
              publicPath: "../"
            }
          },
          "css-loader"
        ]
      },
      {
        test: /\.js$/,
        exclude: [path.resolve(__dirname, "node_modules")],
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
    // 注意一定要在HtmlWebpackPlugin之后引用
    // inline 的name 和你 runtimeChunk 的 name保持一致
    new ScriptExtHtmlWebpackPlugin({
      //`runtime` must same as runtimeChunk name. default is `runtime`
      inline: /runtime.*\..*(\.js)$/
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
  ],
  optimization: {
    //OptimizeCssAssetsPlugin 压缩 css
    minimize: true,
    minimizer: [new OptimizeCssAssetsPlugin(), new TerserPlugin()],
    //分离mainfest
    runtimeChunk: true,
    //当发生错误时，不生成dist目录
    noEmitOnErrors: true,
    moduleIds: "hashed",
    chunkIds: "named",
    nodeEnv: "production",
    //分离异步加载的代码块
    splitChunks: {
      chunks: "all",
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: "~",
      automaticNameMaxLength: 30,
      name: true,
      cacheGroups: {
        libs: {
          name: "chunk-libs",
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: "initial" // 只打包初始时依赖的第三方
        },
        elementUI: {
          name: "chunk-elementUI", // 单独将 elementUI 拆包
          priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
          test: /[\\/]node_modules[\\/]element-ui[\\/]/
        },
        commons: {
          name: "chunk-commons",
          test: path.resolve(__dirname, "src/components"), // 可自定义拓展你的规则
          minChunks: 2, // 最小共用次数
          priority: 5,
          reuseExistingChunk: true
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
});
