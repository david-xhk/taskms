const { copyFileSync } = require("fs")
const { resolve } = require("path")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const Dotenv = require("dotenv-webpack")
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

const currentTask = process.env.npm_lifecycle_event

const config = {
  entry: resolve(__dirname, "src/Main.js"),
  output: {
    publicPath: "/",
    path: resolve(__dirname, "src"),
    filename: "bundled.js"
  },
  plugins: [
    new Dotenv({ systemvars: true }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index-template.html",
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackHarddiskPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules(?!\/@han-keong)/,
        use: { loader: "babel-loader", options: { rootMode: "upward" } }
      }
    ]
  },
  resolve: {
    alias: {
      src: resolve(__dirname, "src")
    }
  }
}

if (currentTask === "start:dev") {
  config.mode = "development"
  config.devtool = "source-map"
  config.devServer = {
    static: resolve(__dirname, "src"),
    hot: true,
    historyApiFallback: { index: "index.html" },
    port: 3000
  }
}

if (currentTask === "build") {
  config.mode = "production"
  config.plugins.push(new CleanWebpackPlugin(), {
    apply(compiler) {
      compiler.hooks.done.tap("Copy files", function () {
        copyFileSync("./src/main.css", "./dist/main.css")
      })
    }
  })
  config.output = {
    publicPath: "/",
    path: resolve(__dirname, "dist"),
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js"
  }
}

module.exports = config
