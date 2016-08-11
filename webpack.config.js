const webpack = require('webpack');

module.exports = {
  cache: true,
  devtool: "eval", //or cheap-module-eval-source-map
  entry: [
    'babel-polyfill',
    './web-src/app.jsx'
  ],
  output: {
    filename: "bundle.js",
    path: __dirname + '/public'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // new webpack.DllReferencePlugin({
    //   context: __dirname,
    //   manifest: require('./dll.json')
    // }),
  ],
  module: {
    loaders: [
      {
        test: /\.coffee$/,
        include: __dirname + '/web-src',
        loader: "coffee-loader"
      },
      {
        test: /\.jsx$/,
        exclude: /(node_modules|bower_components)/,
        include: __dirname + '/web-src',
        loader: "babel-loader",
        query: {
          plugins: ['transform-runtime'],
          cacheDirectory: true,
          presets: ["react", "es2015", "stage-0"]
        }
      }
    ]
  },
  resolve: {
    extensions: ["", ".js", ".jsx"],
    modulesDirectories: ["node_modules", "bower_components"]
  }
  // externals: {
  //   // Use external version of React
  //   "react": "React",
  //   "react-dom": "ReactDOM"
  // },
};
