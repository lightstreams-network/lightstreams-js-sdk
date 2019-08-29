const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');

const dev = process.env.NODE_ENV !== 'production';

const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: path.join(__dirname, '/src/index.html'),
  filename: 'index.html',
  inject: 'body',
});

const DefinePluginConfig = new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('production'),
});

const DotenvPluginCfg = new DotenvPlugin({
  path: path.resolve(__dirname, '.env'),
  silent: false, // hide any errors
  defaults: false // load '.env.defaults' as the default values if empty.
});

module.exports = {
  devServer: {
    host: 'localhost',
    port: '3001',
    hot: true,
    inline: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: true,
  },
  devtool: 'source-map',
  entry: ['@babel/polyfill', 'whatwg-fetch', 'react-hot-loader/patch', path.join(__dirname, '/src/index.jsx')],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel-loader'],
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader',
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'url-loader',
        options: {
          limit: 10000,
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  output: {
    filename: 'index.js',
    path: path.join(__dirname, '/build'),
  },
  mode: dev ? 'development' : 'production',
  plugins: dev
    ? [HTMLWebpackPluginConfig, DefinePluginConfig, new webpack.HotModuleReplacementPlugin(), DotenvPluginCfg]
    : [HTMLWebpackPluginConfig, DefinePluginConfig, DotenvPluginCfg],
};
