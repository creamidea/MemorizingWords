const path = require('path')
const webpack = require('webpack')

module.exports = {
  cache: true,
  devtool: 'eval', // or cheap-module-eval-source-map
  entry: [
    'babel-polyfill',
    './web-src/app.jsx'
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public')
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DllReferencePlugin({
      context: '.',
      manifest: require('./dll.json')
    })
  ],
  module: {
    loaders: [
      // {
      //   test: /\.coffee$/,
      //   include: __dirname + '/web-src',
      //   loader: "coffee-loader"
      // },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        // include: __dirname + '/web-src',
        include: path.resolve(__dirname, 'web-src'),
        loader: 'babel',
        query: {
          // plugins: ['transform-runtime', 'transform-react-jsx'],
          cacheDirectory: true,
          presets: ['es2015', 'react']
        }
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ['node_modules', 'bower_components']
  }
  // externals: {
  //   // Use external version of React
  //   "react": "React",
  //   "react-dom": "ReactDOM"
  // },
}
