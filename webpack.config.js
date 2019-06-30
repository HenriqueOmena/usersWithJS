const webpack = require('webpack')

module.exports = {
    entry: ['@babel/polyfill', './controllers/UserController.js', './src/main.js'],
    output: {
        path: __dirname + '/public',
        filename: './dist/bundle.js'
    },
    devServer: {
        contentBase: __dirname + '/public'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                }
            }
        ],
    }
};
