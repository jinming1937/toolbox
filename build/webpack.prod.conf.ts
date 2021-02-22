import CopyWebpackPlugin from 'copy-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import FriendlyErrorsPlugin, {Severity} from 'friendly-errors-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import UglifyjsWebpackPlugin from 'uglifyjs-webpack-plugin'
import OptimizeCSSPlugin from 'optimize-css-assets-webpack-plugin'
import path from 'path'
import webpack from 'webpack'
import {resolve} from './util'
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

export default {
  context: path.resolve(__dirname, '../'),
  entry: {
    main: './src/index.tsx'
  },
  output: {
    filename: './static/js/[name].[hash:8].js',
    publicPath: '/'
  },
  externals: {
    '@biqi/ui': 'BiQi',
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
        ]
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
        test: /\.md(\?.*)?$/,
        loaders: ['html-loader', 'markdown-loader']
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
    new UglifyjsWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin({}),
    new ForkTsCheckerNotifierWebpackPlugin({
      title: 'TypeScript',
      excludeWarnings: false
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),

    new ExtractTextPlugin({
      filename: './static/css/[name].[hash:8].css',
      allChunks: true
    }),
    new OptimizeCSSPlugin(),

    new HtmlWebpackPlugin({
      title: '小鱼工具',
      filename: 'index.html',
      chunks: ['main'],
      template: path.join(__dirname, 'index.html'),
      inject: true,
      favicon: resolve('favicon.ico'),
      biqiJS: './static/biqi.mini.js',
      reactURI: 'https://unpkg.com/react@16.13.1/umd/react.production.min.js',
      reactDomURI: 'https://unpkg.com/react-dom@16.13.1/umd/react-dom.production.min.js'
    }),

    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [`Your application [toolbox] has built successlly!!!`],
        notes: []
      },
      onErrors(_: Severity, errors: string) {
        console.error(errors)
      }
    }),
    new CopyWebpackPlugin([
      {from: resolve('node_modules/@biqi/ui/dist/biqi.mini.js'), to: 'static'},
      {from: resolve('node_modules/@biqi/ui/dist/theme/index.mini.css'), to: 'static'}
    ])
  ],
  mode: 'production',
  optimization: {
    minimize: false,
    namedModules: true,
    noEmitOnErrors: true
  }
}
