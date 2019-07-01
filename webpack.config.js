// const webpack = require('webpack')

// module.exports = {
//     entry: [/* '@babel/polyfill', './controllers/UserController.js',  */'./src/index.js'],
//     output: {
//         path: __dirname + '/public',
//         filename: './dist/bundle.js'
//     },
//     devServer: {
//         contentBase: __dirname + '/public'
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.js$/,
//                 exclude: /node_modules/,
//                 use: {
//                     loader: 'babel-loader',
//                 }
//             }
//         ],
//     }
// };

const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'public')
  },
//   module: {
//     rules: [
//         {
//             test: /\.js$/,
//             exclude: /node_modules/,
//             use: {
//                 loader: 'babel-loader',
//             }
//         }
//     ],
//   }
};
