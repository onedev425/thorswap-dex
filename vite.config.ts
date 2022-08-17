import nodePolyfills from 'rollup-plugin-polyfill-node'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import rewriteAll from 'vite-plugin-rewrite-all'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { defineConfig } from 'vite'
import { resolve } from 'path'
import removeConsole from 'vite-plugin-remove-console'

// TODO: to split build into smaller chunks
// const initialModules = [...builtinModules,
//   'buffer', 'safe-buffer', '@binance-chain', 'vite-compatible-readable-stream', 'html-escaper',
//   'html-parse-stringify', 'reselect', 'void-elements', 'warning', 'randombytes', 'ripemd160',
//   '@thorswap-lib', 'sha',
// ]

export default defineConfig({
  define: {
    'process.env': {},
  },
  plugins: [
    react(),
    rewriteAll(),
    svgr({ svgrOptions: { icon: true } }),
    removeConsole(),
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

      'readable-stream': 'vite-compatible-readable-stream',
      crypto: 'crypto-browserify',
      http: 'stream-http',
      https: 'https-browserify',
      os: 'os-browserify/browser',
      stream: 'vite-compatible-readable-stream',
      util: 'util',

      /**
       * To operate locally on external libraries you can copy paste their `/src`
       * file and use like below:
       *
       * '@thorswap-lib/multichain-sdk': resolve(__dirname, 'src/multichain'),
       */
    },
  },
  build: {
    commonjsOptions: { transformMixedEsModules: true },
    minify: 'esbuild',
    polyfillModulePreload: false,
    reportCompressedSize: true,
    sourcemap: false,
    rollupOptions: {
      plugins: [nodePolyfills({ sourceMap: false })],
      output: {
        chunkFileNames: () => '[hash].js',
        manualChunks: (id) => {
          if (id.includes('node_modules')) return 'vendor'
        },
      },
    },
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  optimizeDeps: {
    /**
     * Comment out libraries that you are working on locally
     * This option will prevent reloading those zfiles without running `yarn vite optimize`
     */
    include: [
      '@binance-chain/javascript-sdk',
      'crypto-browserify',
    ],
    esbuildOptions: {
      define: { global: 'globalThis' },
      reserveProps: /(BigInteger|ECPair|Point)/,
      plugins: [
        NodeGlobalsPolyfillPlugin({
          define: { global: 'globalThis' },
          buffer: true,
          process: true,
        }),
      ],
    },
  },
})
