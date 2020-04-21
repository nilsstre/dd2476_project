const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
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
    devtool: isDevelopment ? 'inline-source-map' : false,
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
      filename: isDevelopment ? 'main.js' : '[contenthash:8].main.js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve('./public/index.html')
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(env.nodeEnv || 'production'),
          COMMIT_HASH: JSON.stringify(process.env.COMMIT_HASH)
        }
      }),
      new CopyWebpackPlugin([
        { from: 'static' },
      ])
    ],
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            chunks: "all",
          }
        }
      }
    },
    devServer: {
      port: 7000,
      contentBase: './build',
      hot: true
    }
  }
}
