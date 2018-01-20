const path = require('path');
const webpack = require("webpack");

module.exports = {
  entry: './build/index.js',
  target: 'node',
  output: {
    filename: 'ubt.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
      new webpack.DefinePlugin({
        __VERSION__: JSON.stringify(require("./package.json")["version"])
    }),
    new webpack.BannerPlugin({banner: '#!/usr/bin/env node', raw: true})
  ]
};