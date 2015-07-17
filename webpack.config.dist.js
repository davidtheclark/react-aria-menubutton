module.exports = {
  entry: './src/createAriaMenuButton.js',
  module: {
    loaders: [
      { test: /\.(js|jsx)$/, loader: 'babel?loose=all', exclude: /node_modules/ },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  externals: {
    react: 'react',
  },
  output: {
    filename: 'dist/createAriaMenuButton.js',
    libraryTarget: 'umd',
    library: 'AriaMenuButton',
  },
};
