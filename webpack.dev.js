const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'eval-source-map',
  // devtool: 'inline-source-map',
  output: {
    filename: 'jpake.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'jpake-dev',
    libraryTarget: 'umd',
  }
});