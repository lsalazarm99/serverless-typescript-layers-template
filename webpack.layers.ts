import path from "path";
import { merge } from "webpack-merge";

import baseConfig from "./webpack.base";

const config = merge(baseConfig, {
  context: path.resolve(__dirname, "src/layers"),
  entry: {
    general: "./general/index.ts",
    hello_world_producer: "./hello_world_producer/index.ts",
  },
  output: {
    path: path.resolve(__dirname, "dist/layers"),
    filename: "[name]/nodejs/node_modules/[name]/index.js",
  },
});

export default config;
