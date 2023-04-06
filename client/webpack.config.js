const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const EslintWebpackPlugin = require("eslint-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

const extensions = [".js", ".jsx",".ts",".tsx"];

module.exports = {
  target: 'web',
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "build"),
  },
  resolve: {
    extensions,
    alias: {
      pages: path.resolve(__dirname, "src/pages/"),
      types: path.resolve(__dirname, "src/types/"),
      style: path.resolve(__dirname, "src/style/"),
      components: path.resolve(__dirname, "src/components/"),
      router: path.resolve(__dirname, "src/router/"),
      utils: path.resolve(__dirname, "src/utils/")
    },
    fallback: {
      "fs": false
    }
  },
  devServer: {
    client: {
      overlay: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [["@babel/preset-react", { runtime: "automatic" }]],
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(jpe?g|gif|png|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 10000
            }
          }
          ]
      }
    ],
  },
  plugins: [
    new EslintWebpackPlugin({ extensions }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      favicon: "./public/favicon.ico",
    }),
    new NodePolyfillPlugin(),
  ],
  stats: "minimal",
};
