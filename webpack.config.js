//webpack wants absolute paths, we can build one using node.js
const path = require("path");

//this is how is stuff exported in node.js enviroment
module.exports = {

  //mode: 'development', //makes few optimalization, gives meaninfull messages 
  entry: "./src/index.ts",
  output: {
    filename: "bundle.js",
    // this construct an absolut path to dist folder;
    path: path.resolve(__dirname, "dist"),
    // fot the dev server to understand where is the output written to 
    publicPath: 'dist',
  },
  devtool: "inline-source-map", // source maps are generated for debugging

  devServer: {
    port: 9000
  },

  module: {
    rules: [
      {
        // any file that end with ts should have this rule applied
        test: /\.ts$/,
        // what do i do with them
        use: "ts-loader", //takes ts-config into mind
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: [".ts", ".js"], // look for extension of inputs (that is why we removed them )
  },
};
