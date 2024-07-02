import { resolve } from "node:path";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import removeConsole from "vite-plugin-remove-console";
import svgr from "vite-plugin-svgr";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";

const withSourcemap = process.env.SOURCEMAP === "true";
const analyze = process.env.ANALYZE_BUNDLE === "true";
const ssl = process.env.SSL === "true";
const sourcemap = withSourcemap || analyze;

const plugins: Todo[] = [
  nodePolyfills({
    // Whether to polyfill specific globals.
    globals: {
      Buffer: true, // can also be 'build', 'dev', or false
      global: true,
      process: true,
    },
    // Whether to polyfill `node:` protocol imports.
    protocolImports: true,
  }),
  react(),
  topLevelAwait(),
  wasm(),
  svgr({ svgrOptions: { icon: true } }),
  removeConsole(),
  sentryVitePlugin({ telemetry: false, org: "thorswap-dex", project: "dex" }),
]
  .concat(
    analyze
      ? [
          visualizer({
            open: true,
            sourcemap: true,
            template: (process.env.TEMPLATE as "treemap") || "treemap",
          }),
        ]
      : [],
  )
  .concat(ssl ? [mkcert()] : []);

export default defineConfig({
  root: "",
  define: {
    "process.env": {},
    "process.version": JSON.stringify("v20.9.0"),
  },
  plugins,
  resolve: {
    alias: {
      assets: resolve(__dirname, "src/assets"),
      components: resolve(__dirname, "src/components"),
      config: resolve(__dirname, "src/config"),
      helpers: resolve(__dirname, "src/helpers"),
      hooks: resolve(__dirname, "src/hooks"),
      store: resolve(__dirname, "src/store"),
      services: resolve(__dirname, "src/services"),
      settings: resolve(__dirname, "src/settings"),
      types: resolve(__dirname, "src/types"),
      utils: resolve(__dirname, "src/utils"),
      views: resolve(__dirname, "src/views"),
      context: resolve(__dirname, "src/context"),

      buffer: "buffer",
      crypto: "crypto-browserify",
      "node:crypto": "crypto-browserify",
      stream: "stream-browserify",
      http: "stream-http",
      https: "https-browserify",
      os: "os-browserify/browser",
      path: "path-browserify",
    },
  },
  // @ts-expect-error
  server: { https: ssl },
  build: {
    reportCompressedSize: true,
    sourcemap,
    rollupOptions: { output: { chunkFileNames: () => "[hash].js" } },
  },
  esbuild: { sourcemap, logOverride: { "this-is-undefined-in-esm": "silent" } },
  optimizeDeps: { esbuildOptions: { sourcemap } },
});
