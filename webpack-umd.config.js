var webpack = require('webpack');
var path = require('path');

var plugins = [new webpack.optimize.OccurenceOrderPlugin()];
if (process.env.MINIFY) {
  plugins.push(new webpack.optimize.UglifyJsPlugin());
}

var filename = (process.env.MINIFY)
  ? 'ReactAriaMenuButton.min.js'
  : 'ReactAriaMenuButton.js';

module.exports = {
  entry: {
    AriaMenuButton: './index.js',
  },
  output: {
    library: 'ReactAriaMenuButton',
    libraryTarget: 'umd',
    path: path.join(__dirname, 'umd'),
    filename: filename,
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
    process: false,
    setImmediate: false,
  },
  plugins: plugins,
};
