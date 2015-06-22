var webpack = require('webpack');

module.exports = {
  entry: './demo/js/demo.js',
  module: {
    loaders: [
      { test: /\.(js|jsx)$/, loader: 'babel?loose=all', exclude: /node_modules/ },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  output: {
    filename: './demo/demo-bundle.js',
  },
  devtool: '#inline-source-map',
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
  ],
};
