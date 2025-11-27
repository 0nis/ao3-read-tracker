import { defineConfig } from "vite";
import path from "path";

export default defineConfig(({ mode }) => {
  const browser = process.env.TARGET_BROWSER || "chrome";

  return {
    resolve: {
      alias: {
        "@app": path.resolve(__dirname, "src/app"),
        "@constants": path.resolve(__dirname, "src/constants"),
        "@data": path.resolve(__dirname, "src/data"),
        "@enums": path.resolve(__dirname, "src/enums"),
        "@services": path.resolve(__dirname, "src/services"),
        "@types": path.resolve(__dirname, "src/types"),
        "@utils": path.resolve(__dirname, "src/utils"),
      },
    },

    build: {
      target: "es2018",
      sourcemap: true,
      outDir: `build/${browser}`, // temporary build folder (mirrors your esbuild flow)

      lib: {
        entry: path.resolve(__dirname, "src/index.ts"),
        name: "ao3ReadTracker",
        format: "esm",
        fileName: () => "content.js",
      },

      rollupOptions: {
        input: path.resolve(__dirname, "src/index.ts"),
        output: {
          format: "esm",
          entryFileNames: "content.js",
        },
      },
      minify: false,
    },
  };
});
