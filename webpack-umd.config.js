var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: {
    AriaMenuButton: './index.js',
  },
  output: {
    library: 'ReactAriaMenuButton',
    libraryTarget: 'umd',
    path: path.join(__dirname, 'umd'),
    filename: 'ReactAriaMenuButton.min.js',
  },
  externals: [
    {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react',
      },
    },
    {
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom',
      },
    },
  ],
  node: {
    Buffer: false,
    global: false,
    process: false,
    setImmediate: false,
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
  ],
};
