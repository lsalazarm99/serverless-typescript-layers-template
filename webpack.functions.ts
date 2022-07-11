import path from "path";
import { merge } from "webpack-merge";
import nodeExternals from "webpack-node-externals";

import baseConfig from "./webpack.base";

const config = merge(baseConfig, {
  optimization: {
    minimize: false,
  },
  context: path.resolve(__dirname, "src/functions"),
  entry: {
    sayHello: "./sayHello.ts",
  },
  output: {
    path: path.resolve(__dirname, "dist/functions"),
    filename: "[name]/handler.js",
  },
  externals: [nodeExternals(), "general", "hello_world_producer"],
});

export default config;
