const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");

module.exports = merge(common, {
  devtool: "cheap-module-eval-source-map",
  mode: "development",
  //开发服务器，需要安装 webpack-dev-server
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9527,
    //热加载
    hot: true,
    //打开浏览器时访问的URL
    public: "http://localhost:9527",
    //设置为0.0.0.0允许所有机器访问，设置为localhost只能本机访问
    host: "0.0.0.0",
    //只显示错误信息
    stats: "errors-only",
    //启动成功时打开浏览器
    open: true,
    //不输出信息
    quiet: true,
    //发生错误时弹出错误朦层
    overlay: true,
    //是否写到硬盘
    writeToDisk: false,
    filename: "[name].js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    filename: "[name].js",
    globalObject: "(typeof self !== 'undefined' ? self : this)"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    }),
    //不太了解
    new PreloadWebpackPlugin({
      rel: "preload",
      include: "initial",
      fileBlacklist: [
        /\.map$/,
        /hot-update\.js$/
      ]
    }),
    //不太了解
    new PreloadWebpackPlugin({
      rel: "prefetch",
      include: "asyncChunks"
    }),
    //热加载
    new webpack.HotModuleReplacementPlugin(),
    //更友好的进行错误提示
    new FriendlyErrorsWebpackPlugin({
      //编译成功之后输出的信息
      compilationSuccessInfo: {
        messages: ["You application is running here http://localhost:9527"]
      },
      //清空上次编译时输出的信息
      clearConsole: true
    })
  ],
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          {
            loader: "vue-style-loader",
            // options: {
            //   sourceMap: false,
            //   shadowMode: false
            // }
          },
          {
            loader: "css-loader",
            // options: {
            //   sourceMap: false,
            //   importLoaders: 2
            // }
          },
          {
            loader: "postcss-loader",
            // options: {
            //   sourceMap: false
            // }
          },
          {
            loader: "less-loader",
            // options: {
            //   sourceMap: false
            // }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          "vue-style-loader",
          "css-loader",
          "postcss-loader"
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
