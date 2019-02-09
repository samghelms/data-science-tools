const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const ASSET_PATH =  "/imarkdown/static/dist/";

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
              plugins: ['@babel/plugin-syntax-dynamic-import']
            }
          }
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
        }
      ]
  },
  plugins: [
    new MonacoWebpackPlugin()
  ],
  resolve: {
    alias: {
        'vscode': require.resolve('monaco-languageclient/lib/vscode-compatibility')
    }
  },
  node: {
    fs: 'empty',
    child_process: 'empty',
    net: 'empty',
    crypto: 'empty'
  }
};