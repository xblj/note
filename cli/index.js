const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const config = require('../webpack/webpack.base.config');

const compiler = webpack(config);

const devServerOptions = Object.assign({}, config.devServer, {
  stats: {
    colors: true,
  },
});
const server = new WebpackDevServer(compiler, devServerOptions);

server.listen(8081, '127.0.0.1', () => {
  console.log('Starting server on http://localhost:8080');
});
