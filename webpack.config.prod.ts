const path = require("path");
const CleanPlugin = require("clean-webpack-plugin");

module.exports = {
 // mode: "production",
  entry: "./src/index.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "none",

  devServer: {
    port: 9000
  },

  // applid on an file level
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: [".ts", ".js"], // look for extension of inputs (that is why we removed them )
  },

  // applied to general whole project
  plugins: [
    // clean distro folder before building production code
    new CleanPlugin.CleanWebpackPlugin(),
  ],
};
