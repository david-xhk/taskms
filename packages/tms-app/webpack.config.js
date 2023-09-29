import { CleanWebpackPlugin } from "clean-webpack-plugin"
import Dotenv from "dotenv-webpack"
import HtmlWebpackHarddiskPlugin from "html-webpack-harddisk-plugin"
import HtmlWebpackPlugin from "html-webpack-plugin"
import NodePolyfillPlugin from "node-polyfill-webpack-plugin"
import { resolve } from "path"

const currentTask = process.env.npm_lifecycle_event

const config = {
  entry: resolve("./src/Main.js"),
  output: {
    publicPath: "/",
    path: resolve("./src"),
    filename: "bundled.js"
  },
  plugins: [new Dotenv({ systemvars: true }), new NodePolyfillPlugin()],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", "@babel/preset-env"]
          }
        }
      }
    ]
  }
}

if (currentTask === "start:dev") {
  config.mode = "development"
  config.plugins.push(
    new HtmlWebpackPlugin({
      template: resolve("./src/index-template.html"),
      filename: resolve("./src/index.html"),
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackHarddiskPlugin()
  )
  config.devtool = "source-map"
  config.devServer = {
    static: resolve("./src"),
    hot: true,
    historyApiFallback: { index: "index.html" },
    port: 3000
  }
}

if (currentTask === "build") {
  config.mode = "production"
  config.plugins.push(
    new HtmlWebpackPlugin({
      template: resolve("./src/index-template.html"),
      filename: resolve("./dist/index.html"),
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackHarddiskPlugin(),
    new CleanWebpackPlugin(),
    {
      apply(compiler) {
        compiler.hooks.done.tap("Copy files", function () {
          import("fs").then(({ default: fs }) => {
            fs.copyFileSync("./src/main.css", "./dist/main.css")
          })
        })
      }
    }
  )
  config.output = {
    publicPath: "/",
    path: resolve("./dist"),
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js"
  }
}

export default config
