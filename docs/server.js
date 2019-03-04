var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('../webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  stats: {
    assets: false,
    version: false,
    hash: false,
    timings: false,
    chunks: false,
    chunkModules: false,
    colors: true,
  },
  proxy: {
    '/api/*': {
      target: 'http://localhost/',
    },
    '/dd/*': {
      target: 'http://localhost:8080/',
      pathRewrite: {'^/dd' : ''}
    }
  },
}).listen(8095, 'localhost', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at localhost:8095');
});
