import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import sourceMaps from "rollup-plugin-sourcemaps";
import typescript from "rollup-plugin-typescript2";
import json from "@rollup/plugin-json";

const pkg = require("./package.json");

export default {
  input: "src/index.ts",
  output: [
    { file: pkg.umd, name: "ds", format: "umd", sourcemap: true },
    { file: pkg.main, format: "es", sourcemap: true }
  ],
  external: [],
  watch: {
    include: "src/**"
  },
  plugins: [
    json(),
    typescript({
      useTsconfigDeclarationDir: true,
      objectHashIgnoreUnknownHack: true,
      tsconfigOverride: { compilerOptions: { module: "esnext" } }
    }),
    commonjs(),
    resolve(),
    sourceMaps()
  ]
};
