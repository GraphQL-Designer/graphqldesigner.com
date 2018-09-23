const path = require('path');

module.exports = {
  // devtool: 'inline-source-map',
  context: path.join(__dirname, '/client'),
  entry: './index.js',
  output: {
    path: path.join(__dirname, '/public'),
    filename: 'main.js',
    publicPath: '/public'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
            presets: ['es2015', 'react', 'stage-2'],
          }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loaders: ['style-loader', 'css-loader']
      }
    ]
  },
};