import type { Configuration } from "webpack";

const config: Configuration = {
  mode: "production",
  target: "node16",
  devtool: "source-map",
  output: {
    clean: true,
    library: {
      type: "commonjs",
    },
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  externals: [
    "aws-sdk",
  ],
};

export default config;
