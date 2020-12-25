const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');


prodConfigOptions = {
  mode: "production",
  devtool: 'source-map',
  // devtool: 'inline-source-map',
}

module.exports = common.map((x) => merge(x, prodConfigOptions))