const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.base.js");

module.exports = merge(common, {
  entry: {
    index: "./index.js"
  },
  mode: "production",
  externals: {
    react: 'react', //打包时候排除react
    ReactDOM:'react-dom',
    antd:'antd'
  },
  output: {
    filename: "[name].js",
    library: {
      name: "MyButton",
      type: "umd",
      export: 'default',
    },
    path: path.resolve(__dirname, "../lib"),
    clean: true
  }
});

