const path = require("path");
const { defineConfig } = require("rollup");
const pkgJson = require("./package.json");
const { getBabelOutputPlugin } = require("@rollup/plugin-babel");
const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const ts2 = require("rollup-plugin-typescript2");

const getOutput = (
  /** @type {import('rollup').RollupOptions}*/
  config
) =>
  defineConfig({
    paths: "./build",
    sourcemap: true,
    ...config,
  });

/** @type {import('rollup').RollupOptions}*/
const options = {
  input: "src/index.tsx",
  plugins: [
    getBabelOutputPlugin({
      presets: ['@babel/preset-env'],
    }),
    commonjs(),
    resolve(),
    ts2({ config: "./tsconfig.json", extensions: [".js", ".ts", ".tsx"] }),
  ],
  output: [
    getOutput({
      file: path.resolve(__dirname, pkgJson.main),
      format: "cjs",
    }),
    getOutput({
      file: path.resolve(__dirname, pkgJson.module),
      format: "es",
    }),
  ],
  external: ["react"],
};

exports.default = options;
