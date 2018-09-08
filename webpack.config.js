const path = require('path');

module.exports = {
  devtool: 'inline-source-map',
  context: path.join(__dirname, '/client'),
  entry: './app.js',
  output: {
    path: path.join(__dirname, '/public'),
    filename: 'main.js',
    publicPath: '/server/public'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
            presets: ['es2015', 'react'],
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