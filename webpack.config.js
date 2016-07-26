module.exports = {
  entry: [
    './web-src/app.jsx'
  ],
  output: {
    filename: "bundle.js",
    path: __dirname + '/public'
  },
  module: {
    loaders: [{
      test: /\.coffee$/,
      include: __dirname + '/web-src',
      loader: "coffee-loader"
    }, {
      test: /\.jsx$/,
      exclude: /(node_modules|bower_components)/,
      include: __dirname + '/web-src',
      loader: "babel",
      query: {
        presets: ['react']
      }
    }]
  },
  resolve: {
    extensions: ["", ".jsx", ".webpack.js", ".web.js", ".js"]
  },
  externals: {
    // Use external version of React
    "react": "React",
    "react-dom": "ReactDOM"
  },
};
