module.exports = {
  entry: './test/index.js',
  module: {
    loaders: [
      { test: /\.(?:js|jsx)$/, loader: 'babel?loose=all', exclude: /node_modules/ },
      // Hack due to https://github.com/webpack/webpack/issues/177
      { test: /sinon.*\.(?:js|jsx)$/, loader: 'imports?define=>false' },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  output: {
    filename: 'test/test-bundle.js',
  },
  // Hack due to https://github.com/webpack/webpack/issues/451
  node: {
    fs: 'empty',
  },
};
