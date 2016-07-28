const webpack = require('webpack');

module.exports = {
  entry: [
    'babel-polyfill',
    './web-src/app.jsx'
  ],
  output: {
    filename: "bundle.js",
    path: __dirname + '/public'
  },
  module: {
    loaders: [
      // {
      //   test: /\.coffee$/,
      //   include: __dirname + '/web-src',
      //   loader: "coffee-loader"
      // },
      {
        test: /\.jsx$/,
        exclude: /(node_modules|bower_components)/,
        include: __dirname + '/web-src',
        loader: "babel",
        query: {
          cacheDirectory: true,
          presets: ['es2015', 'react'],
          // plugins: ['transform-runtime']
        }
      }
    ]
  },
  resolve: {
    extensions: ["", ".js", ".jsx"]
  },
  externals: {
    // Use external version of React
    "react": "React",
    "react-dom": "ReactDOM"
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
