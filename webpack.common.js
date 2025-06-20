// webpack.common.js

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    app: path.resolve(__dirname, "src/scripts/index.js"),
    // Tambahkan sw.js sebagai entry point baru
    // sw: path.resolve(__dirname, "src/sw.js"),
  },
  output: {
    // [name] akan diganti menjadi 'app' dan 'sw'
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true, // Bersihkan direktori dist sebelum build
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/index.html"),
      // Pastikan sw.bundle.js tidak di-inject ke HTML
      excludeChunks: ["sw"],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/public/"),
          to: path.resolve(__dirname, "dist/"),
        },
      ],
    }),
  ],
};