const path = require('path');
const HtmlWebpackPlugin = require('../source/webpack/html-webpack-plugin');

const resolve = pathName => path.resolve(process.cwd(), pathName);

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    main: './src/react/redux/index.js',
  },
  output: {
    path: resolve('build'),
    filename: 'bundle.js',
  },
  devServer: {
    port: 8081,
    contentBase: 'build',
  },

  resolve: {
    alias: {
      source: resolve('source'),
    },
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/react'],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve('template.html'),
    }),
  ],
};
