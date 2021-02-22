// import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import FriendlyErrorsPlugin, {Severity} from 'friendly-errors-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import webpack from 'webpack'
import {getIPAdress, resolve} from './util'
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const PORT = 9000

export default {
  context: path.resolve(__dirname, '../'),
  entry: {
    main: './src/index.tsx'
  },
  output: {
    filename: 'static/js/[name].[hash:8].js',
    publicPath: '/'
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.less', '.css'],
    alias: {
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.worker\.js$/, // 以.worker.js结尾的文件将被worker-loader加载
        use: {loader: 'worker-loader'}
      },
      {
        test: /\.(jsx|ts|tsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
              exclude: /node_modules/
            }
          }
        ],
        include: [resolve('src')],
        exclude: [resolve('node_modules')]
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {loader: 'css-loader', options: {modules: true}},
            {loader: 'less-loader', options: {modules: true}}
          ]
        }),
        include: [resolve('src')]
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{loader: 'css-loader'}]
        }),
        include: [resolve('node_modules')]
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{loader: 'css-loader', options: {modules: true}}]
        }),
        exclude: [resolve('node_modules')]
      },
      {
        test: /\.(jpeg|jpg|png|gif|svg)$/,
        loaders: ['url-loader?limit=10000&name=static/img/[name].[hash:8].[ext]']
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loaders: ['file-loader?name=static/font/[name].[hash:8].[ext]']
      }
    ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({}),
    new ForkTsCheckerNotifierWebpackPlugin({
      title: 'TypeScript',
      excludeWarnings: false
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    }),

    new ExtractTextPlugin({
      filename: 'static/css/[name].[hash:8].css',
      allChunks: true
    }),

    new HtmlWebpackPlugin({
      title: '小鱼工具',
      filename: 'index.html',
      chunks: ['main'],
      template: path.join(__dirname, 'index.html'),
      inject: true,
      favicon: resolve('favicon.ico'),
      reactURI: 'http://127.0.0.1:9999/static/react.development.js',
      reactDomURI: 'http://127.0.0.1:9999/static/react-dom.development.js'
    }),

    new webpack.HotModuleReplacementPlugin(),

    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [`Your application [toolbox] is running here: http://${getIPAdress()}:${PORT}`],
        notes: []
      },
      onErrors(_: Severity, errors: string) {
        console.error(errors)
      }
    })
  ],
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        {
          from: /^\/$/,
          to: '/index.html'
        }
      ]
    },
    hot: true,
    contentBase: false,
    compress: true,
    host: '0.0.0.0',
    port: PORT,
    overlay: {warnings: false, errors: true},
    publicPath: '/',
    quiet: true,
    watchOptions: {
      poll: true
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:9960',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    },
    disableHostCheck: true
  },
  mode: 'development',
  devtool: 'eval-source-map',
  optimization: {
    minimize: false,
    namedModules: true,
    noEmitOnErrors: true
  },
  node: {
    setImmediate: false,
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
