function buildWebpack() {
    let query = `const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    context: path.join(__dirname, '/client'),
    entry: './index.js',
    output: {
    path: path.join(__dirname, '/server/public'),
    filename: 'main.js',
    publicPath: '/server/public'
    },
    mode: 'development',
    //Set to rebundle on saved changes
    // watch: true, 
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