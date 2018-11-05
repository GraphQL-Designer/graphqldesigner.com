function buildWebpack() {
    let query = `const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    // devtool: 'inline-source-map',
    context: path.join(__dirname, '/client'),
    entry: './index.js',
    output: {
    path: path.join(__dirname, '/server/public'),
    filename: 'main.js',
    publicPath: '/server/public'
    },
    mode: 'development',
    // watch: true, //Bundle on saved changes
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
    optimization: {
    minimizer: [new UglifyJsPlugin()]
    }
};
`;
    return query;
}
  
module.exports = buildWebpack;