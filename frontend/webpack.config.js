const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path')
const webpack = require('webpack')

const configPath = (config) => {
  if (!config) throw new Error('Config unset!')
  console.log('Using config:', config)
  return path.join(__dirname, './config/config.' + config + '.js')
}

module.exports = (env) => {
  const isDevelopment = env.nodeEnv === 'development'

  return {
    mode: isDevelopment ? 'development' : 'production',
    devtool: 'inline-source-map',
    entry: ['./src/'],
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: [path.resolve(__dirname, 'node_modules')],
          use: ['babel-loader']
        }
      ]
    },
    resolve: {
      alias: {
        config: configPath(env.config)
      }
    },
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js',
      sourceMapFilename: 'main.js.map'
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve('./public/index.html'),
      }),
      new CopyWebpackPlugin([{ from: 'public', to: 'build' }]),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(env.nodeEnv || 'production'),
          COMMIT_HASH: JSON.stringify(process.env.COMMIT_HASH)
        }
      })
    ],
    optimization: {
      namedModules: true
    },
    devServer: {
      port: 7000,
      contentBase: './build',
      hot: true
    }
  }
}
