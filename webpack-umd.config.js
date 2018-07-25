const path = require("path");

const filename = process.env.MINIFY
  ? "ReactAriaMenuButton.min.js"
  : "ReactAriaMenuButton.js";

module.exports = {
  entry: {
    AriaMenuButton: "./src/index.js"
  },
  output: {
    library: "ReactAriaMenuButton",
    libraryTarget: "umd",
    path: path.join(__dirname, "umd"),
    filename: filename
  },
  externals: [
    {
      react: {
        root: "React",
        commonjs2: "react",
        commonjs: "react",
        amd: "react"
      }
    },
    {
      "react-dom": {
        root: "ReactDOM",
        commonjs2: "react-dom",
        commonjs: "react-dom",
        amd: "react-dom"
      }
    }
  ],
  module: {
    rules: [{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }]
  },
  node: {
    Buffer: false,
    process: false,
    setImmediate: false
  }
};
