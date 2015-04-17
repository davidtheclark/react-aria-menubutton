var webpack = require('webpack');

module.exports = {
  entry: './demo/demo.js',
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel?loose=all', exclude: /node_modules/ }
    ]
  },
  output: {
    filename: 'demo/demo-bundle.min.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ]
};
