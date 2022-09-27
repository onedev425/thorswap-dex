import nodePolyfills from 'rollup-plugin-polyfill-node'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import rewriteAll from 'vite-plugin-rewrite-all'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { resolve } from 'path'
import removeConsole from 'vite-plugin-remove-console'
import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  define: {
    'process.env': {},
  },
  plugins: [
    react(),
    rewriteAll(),
    svgr({ svgrOptions: { icon: true } }),
    removeConsole(),
    visualizer({ template: 'treemap', sourcemap: true }),
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
      http: 'stream-http',
      https: 'https-browserify',
      os: 'os-browserify/browser',
      stream: 'readable-stream',
      util: 'util',

      /**
       * To operate locally on external libraries you can copy paste their `/src`
       * file and use like below:
       */
      //  '@thorswap-lib/multichain-core': resolve(__dirname, 'src/m'),
      },
  },
  build: {
    target: 'es2020',
    commonjsOptions: { transformMixedEsModules: true },
    minify: 'esbuild',
    reportCompressedSize: true,
    sourcemap: false,
    rollupOptions: {
      plugins: [nodePolyfills({ sourceMap: false })],
      output: {
        chunkFileNames: () => '[hash].js',
      },
    },
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
  optimizeDeps: {
    include: ['crypto-browserify'],
    esbuildOptions: {
      target: 'es2020',
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
