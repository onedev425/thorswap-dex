import nodePolyfills from 'rollup-plugin-polyfill-node'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import rewriteAll from 'vite-plugin-rewrite-all'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";


export default defineConfig(({ mode }) => ({
  define: {
    'process.env': {}
  },
  plugins: [
    wasm(),
    topLevelAwait(),
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


      process: 'process/browser',
      'safe-buffer': 'buffer',
      os: 'os-browserify/browser',
      'readable-stream': 'vite-compatible-readable-stream',
      stream: 'vite-compatible-readable-stream',
      crypto: 'crypto-browserify',

      /**
       * To operate locally on external libraries you can copy paste their `/src`
       * file and use like below:
       *
       * '@thorswap-lib/multichain-sdk': resolve(__dirname, 'src/multichain'),
       * '@thorswap-lib/multichain-ledger': resolve(__dirname, 'src/ledger'),
       */
    },
  },
  build: {
    commonjsOptions: { transformMixedEsModules: true },
    minify: 'esbuild',
    outDir: 'build',
    reportCompressedSize: true,
    sourcemap: false,
    rollupOptions: {
      plugins: [nodePolyfills({ include: ['events'], sourceMap: false })],
    },
  },
  optimizeDeps: {
    /**
     * Comment out libraries that you are working on locally
     * This option will prevent reloading those files without running `yarn vite optimize`
     */
    include: [
      '@binance-chain/javascript-sdk',
      'crypto-browserify',
    ],
    esbuildOptions: {
      define: { global: 'globalThis' },
      reserveProps: /(BigInteger|ECPair|Point)/,
      plugins: [NodeGlobalsPolyfillPlugin({ define: true, buffer: true })],
    },
  },
}))
