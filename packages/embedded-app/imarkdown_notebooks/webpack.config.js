/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
const path = require('path');
// const lib = path.resolve(__dirname, "lib");

const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ASSET_PATH =  "/imarkdown/static/dist/";

const common = {
    entry: {
        "main": path.resolve('src', "main.js"),
        "editor.worker": 'monaco-editor-core/esm/vs/editor/editor.worker.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: ASSET_PATH,
    },
    module: {
        rules: [
            {
              test: /\.m?js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        [
                            '@babel/preset-env',
                            {"targets": {"node": "6.10" }}
                        ],
                        '@babel/preset-react'
                    ],
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
    target: 'web',
    node: {
        fs: 'empty',
        child_process: 'empty',
        net: 'empty',
        crypto: 'empty'
    },
    resolve: {
        alias: {
            'vscode': require.resolve('monaco-languageclient/lib/vscode-compatibility')
        }
    }
};

if (process.env['NODE_ENV'] === 'production') {
    module.exports = merge(common, {
        plugins: [
            new UglifyJSPlugin(),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production')
            }),
            new webpack.ContextReplacementPlugin(
                /vscode*/,
                path.join(__dirname, './index')
            )
        ]
    });
} else {
    module.exports = merge(common, {
        plugins: [
            new webpack.ContextReplacementPlugin(
                /vscode*/,
                path.join(__dirname, './index')
            ),
            
        ]
    });
} 
