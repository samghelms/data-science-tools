const path = require('path')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = (baseConfig, env, config) => {
    config.devServer = {
      before(app) {
        // use proper mime-type for wasm files
        app.get('*.wasm', function(req, res, next) {
            var options = {
                root: contentBase,
                dotfiles: 'deny',
                headers: {
                    'Content-Type': 'application/wasm'
                }
            };
            res.sendFile(req.url, options, function (err) {
                if (err) {
                    next(err);
                }
            });
        });
    }
    }
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve("babel-loader")
        },
        {
          loader: require.resolve("awesome-typescript-loader")
        },
        {
          loader: require.resolve("@storybook/addon-storysource/loader"),
          options: {
            parser: "typescript"
          }
        }
      ]
    });
    config.module.rules.push(
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
          }
    )
    config.plugins.push(new MonacoWebpackPlugin())
    config.resolve.extensions.push(".ts", ".tsx", ".json");
    return config;
  };
