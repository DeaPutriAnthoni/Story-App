const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // Pastikan ini ada atau tambahkan jika belum
const CopyWebpackPlugin = require("copy-webpack-plugin"); // Pastikan ini ada atau tambahkan jika belum
const WorkboxWebpackPlugin = require("workbox-webpack-plugin"); // Pastikan ini ada atau tambahkan jika belum

module.exports = {
  // Mode pengembangan atau produksi
  mode: "development", // atau 'production'

  // Entry point aplikasi kamu
  entry: "./src/scripts/index.js",

  // Output bundle
  output: {
    filename: "app.bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true, // Membersihkan folder output sebelum build baru
  },

  // Dev server configuration
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    port: 3000, // Set port menjadi 3000
    open: true,
    hot: true,
  },

  // Module rules untuk menangani berbagai jenis file
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "images/[name].[ext]",
        },
      },
    ],
  },

  // Plugins
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/public"),
          to: path.resolve(__dirname, "dist"),
        },
      ],
    }),
    new WorkboxWebpackPlugin.GenerateSW({
      swDest: "sw.js",
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/story-api\.dicoding\.dev\//,
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "story-api-cache",
          },
        },
        {
          urlPattern: /\.(png|jpg|jpeg|svg|gif)$/i,
          handler: "CacheFirst",
          options: {
            cacheName: "image-cache",
            plugins: [
              new (require("workbox-expiration").ExpirationPlugin)({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, 
              }),
            ],
          },
        },
      ],
    }),
  ],

  resolve: {
    extensions: [".js"],
    alias: {
      "@pages": path.resolve(__dirname, "src/scripts/pages"),
      "@views": path.resolve(__dirname, "src/scripts/views"),
      "@models": path.resolve(__dirname, "src/scripts/models"),
      "@presenters": path.resolve(__dirname, "src/scripts/presenters"),
    },
  },
};