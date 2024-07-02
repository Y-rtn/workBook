const path = require("path");
const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const base = require("./webpack.base.js");

module.exports = merge(base, {
  mode: "development",
  entry: {
    index: "./example/index.js"
  },
  devtool: "inline-source-map",
  devServer: {
    static: path.resolve(__dirname, "../example")
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Development",
      template: path.join(__dirname, "../example/index.html"),
      filename: "index.html"
    })
  ],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "../example")
  }
});

