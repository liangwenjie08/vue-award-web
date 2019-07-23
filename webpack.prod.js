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
const TerserPlugin = require("terser-webpack-plugin");

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
      chunks: "async",
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: "~",
      automaticNameMaxLength: 30,
      name: true,
      cacheGroups: {
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
