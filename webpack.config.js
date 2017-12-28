const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist'
  },

  plugins: [new HtmlWebpackPlugin({
    title: 'Space shuttle',
    filename: 'index.html',
    template: 'src/assets/index.html'
  })],

  resolve: {
    extensions: ['.ts', '.js']
  },

  module: {
    rules: [
      { test: /\.ts$/, loader: 'awesome-typescript-loader' }
    ]
  }
};