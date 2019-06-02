const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const webpack = require('webpack');
const ASSET_PATH =  "/imarkdown/static/dist/";
const merge = require('webpack-merge');

module.exports = {
  entry: ['@babel/polyfill', './src/main.js'],
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: ASSET_PATH,
  },
  devtool: 'source-map',
  module: {
    rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins: ['dynamic-import-node', "transform-es2015-modules-commonjs"]
            }
          }
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
        }
      ]
  },
  // plugins: [
  //   new MonacoWebpackPlugin(),
  //   new webpack.ContextReplacementPlugin(
  //     /vscode*/,
  //     path.join(__dirname, './client')
  // )
  // ],
  // resolve: {
  //   alias: {
  //     'vscode': require.resolve('./src/index.js')
  //   }
  // },
  node: {
    fs: 'empty',
    child_process: 'empty',
    net: 'empty',
    crypto: 'empty'
  }
};

module.exports = merge(common, {
  plugins: [
      new webpack.ContextReplacementPlugin(
          /vscode*/,
          path.join(__dirname, './client')
      )
  ]
});