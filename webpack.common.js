const path = require('path');

module.exports = {
  entry: './src/jpake.ts',
  devtool: 'eval-source-map',
  // devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    fallback: {
      "crypto": false,
      // "crypto": require.resolve("crypto-browserify"),
    }
  },
  output: {
    filename: 'jpake.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'jpake',
    libraryTarget: 'umd',
  }
};