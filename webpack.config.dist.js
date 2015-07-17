module.exports = {
  entry: './src/ariaMenuButton.jsx',
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
    filename: 'dist/ariaMenuButton.js',
    libraryTarget: 'umd',
    library: 'AriaMenuButton',
  },
};
