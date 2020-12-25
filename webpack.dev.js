const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

devConfigOptions = {
  devtool: 'eval-source-map',
  // devtool: 'inline-source-map',
  output: {
    filename: 'jpake.dev.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'jpake',
    libraryTarget: 'umd',
  }
}

module.exports = common.map((x) => merge(x, devConfigOptions))