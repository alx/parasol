var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var AssetsPlugin = require("assets-webpack-plugin");

const constants = {
  TEST: process.env.NODE_ENV === "test",
  HOT: process.env.HOT === "true",
  LOCAL: process.env.NODE_ENV === "local" || process.env.NODE_ENV === "api",
  STAGE: process.env.NODE_ENV === "stage",
  DEVELOP: process.env.NODE_ENV === "develop",
  PRODUCTION: process.env.NODE_ENV === "production"
};

const entries = [];

// get git info from command line
const commitHash = require("child_process")
  .execSync("git rev-parse --short HEAD")
  .toString();

const templatePath =
  typeof process.env.TEMPLATE_PATH === "undefined"
    ? path.join(__dirname, "docs/example.html")
    : path.join(__dirname, process.env.TEMPLATE_PATH);

const plugins = [
  new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    },
    __COMMIT_HASH__: JSON.stringify(commitHash)
  }),
  new HtmlWebpackPlugin({
    title: "mytest",
    version: "[hash]",
    hash: "[hash]",
    debug: "true",
    env: process.env.NODE_ENV,
    template: templatePath,
    filename: "index.html"
  }),
  new AssetsPlugin({
    path: path.join(__dirname, "build/"),
    filename: path.join("version.json"),
    fullPath: false
  })
];

if (constants.PRODUCTION || constants.STAGE) {
  //plugins.push(new webpack.optimize.UglifyJsPlugin());
  //plugins.push(new webpack.LoaderOptionsPlugin({
  //  minimize: true
  //}));
}

if (constants.LOCAL) {
  plugins.push(new webpack.HotModuleReplacementPlugin());
  plugins.push(new webpack.NamedModulesPlugin());

  entries.push("react-hot-loader/patch");
  entries.push("webpack-dev-server/client?http://localhost:8095");
  entries.push("webpack/hot/only-dev-server");
}

entries.push("./src/index");

module.exports = {
  devtool:
    constants.LOCAL || constants.TEST || constants.STAGE
      ? "inline-source-map"
      : false,
  target: "web",
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty"
  },
  entry: entries,
  output: {
    path: path.join(__dirname, "build"),
    filename: path.join("js", "parasol.js"),
    publicPath: "/"
  },
  plugins: plugins,
  resolve: {
    extensions: [".js", ".jsx"],
    modules: [path.join(__dirname, "src"), "node_modules"]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  }
};
