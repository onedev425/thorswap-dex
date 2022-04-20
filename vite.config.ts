import nodePolyfills from 'rollup-plugin-polyfill-node'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import rewriteAll from 'vite-plugin-rewrite-all'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  define: { 'process.env': {} },
  plugins: [
    rewriteAll(),
    splitVendorChunkPlugin(),
    react(),
    svgr({ svgrOptions: { icon: true } }),
    visualizer({ json: true }),
  ],
  resolve: {
    alias: {
      assets: resolve(__dirname, 'src/assets'),
      components: resolve(__dirname, 'src/components'),
      config: resolve(__dirname, 'src/config'),
      helpers: resolve(__dirname, 'src/helpers'),
      hooks: resolve(__dirname, 'src/hooks'),
      store: resolve(__dirname, 'src/store'),
      services: resolve(__dirname, 'src/services'),
      settings: resolve(__dirname, 'src/settings'),
      types: resolve(__dirname, 'src/types'),
      utils: resolve(__dirname, 'src/utils'),
      views: resolve(__dirname, 'src/views'),

      crypto: 'crypto-browserify',
      os: 'os-browserify/browser',
      'readable-stream': 'vite-compatible-readable-stream',
      stream: 'vite-compatible-readable-stream',
      util: 'util',
    },
  },
  build: {
    commonjsOptions: { ignoreTryCatch: false, transformMixedEsModules: true },
    minify: 'esbuild',
    outDir: 'build',
    reportCompressedSize: false,
    sourcemap: false,
    rollupOptions: {
      plugins: [nodePolyfills({ sourceMap: false })],
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      reserveProps: /(BigInteger|ECPair|Point)/,
      plugins: [NodeGlobalsPolyfillPlugin({ buffer: true })],
    },
  },
})
