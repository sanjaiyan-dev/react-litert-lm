import { defineConfig } from "tsup";
import babel from "@babel/core";
import ReactCompiler from "babel-plugin-react-compiler";
import fs from "node:fs/promises";

/** @type {import('esbuild').Plugin} */
const reactCompilerEsbuildPlugin = {
  name: "react-compiler",
  setup(build) {
    build.onLoad({ filter: /\.[jt]sx?$/ }, async (args) => {
      if (args.path.includes("node_modules") || args.path.includes("dist")) {
        return;
      }

      const source = await fs.readFile(args.path, "utf8");

      const result = await babel.transformAsync(source, {
        filename: args.path,
        plugins: [
          [
            ReactCompiler,
            {
              target: "19",
            },
          ],
        ],
        parserOpts: {
          plugins: ["jsx", "typescript"],
        },
        babelrc: false,
        configFile: false,
      });

      if (!result || !result.code) {
        return null;
      }

      return {
        contents: result.code,
        loader: args.path.endsWith(".tsx") || args.path.endsWith(".ts") ? "tsx" : "js",
      };
    });
  },
};

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: {
    compilerOptions: {
      ignoreDeprecations: "6.0",
      jsx: "react-jsx",
      target: "ES2022",
      moduleResolution: "bundler",
      module: "ESNext",
    },
  },
  clean: true,
  sourcemap: true,
  external: ["react", "react-dom", "@litert-lm/core"],
  esbuildPlugins: [reactCompilerEsbuildPlugin],
  banner: {
    js: '"use client";',
  },
});
