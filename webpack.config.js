// webpack
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    '/js/fastParse': './src/js/fastParse.js',
    '/js/toolScript': './src/js/toolScript.js',
    '/css/toolStyle': './src/css/toolStyle.css',
  },
  devtool: 'inline-source-map',
  // devServer: {
  //   contentBase: './dist'
  // },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: '小鱼工具',
    }),
    new OptimizeCssAssetsPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css", // 都提到build目录下的css目录中
      chunkFilename: "[id].css"
    }),
  ],
  // mode: 'development',
  mode: 'production',
  output: {
    filename: '[name].js',
    // path: absulatePath,
    chunkFilename: '[name].js',
    // publicPath: absulatePath, //
    sourceMapFilename: '[file].map',
  },
  module: {
    rules: [
      {
				test: /\.(jpeg|jpg|png|gif|svg)$/,
				loaders: [
          'url-loader?limit=10000&name=/img/[name].[hash:8].[ext]',
				],
			},
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            // options: {
            //   publicPath: 'dist',
            // },
          },
          'css-loader'
        ],
      }
    ]
  }
};