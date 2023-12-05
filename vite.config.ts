import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import removeConsole from 'vite-plugin-remove-console';
import rewriteAll from 'vite-plugin-rewrite-all';
import svgr from 'vite-plugin-svgr';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { sentryVitePlugin } from '@sentry/vite-plugin';

const withSourcemap = process.env.SOURCEMAP === 'true';
const analyze = process.env.ANALYZE_BUNDLE === 'true';
const ssl = process.env.SSL === 'true';
const sourcemap = withSourcemap || analyze;

const plugins: any[] = [
  react(),
  rewriteAll(),
  svgr({ svgrOptions: { icon: true } }),
  removeConsole(),
  sentryVitePlugin({
    telemetry: false,
    authToken: '56d3ae89505b4735b3c3406a0af4adbb7772a89118204789934866b9965656ef',
    org: 'thorswap-dex',
    project: 'dex',
  }),
]
  .concat(
    analyze
      ? [
          visualizer({
            open: true,
            sourcemap: true,
            template: (process.env.TEMPLATE as 'treemap') || 'treemap',
          }),
        ]
      : [],
  )
  .concat(ssl ? [basicSsl()] : []);

export default defineConfig({
  root: '',
  define: {
    'process.env': {},
    'process.version': JSON.stringify('v20.9.0'),
  },
  plugins,
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
      context: resolve(__dirname, 'src/context'),

      crypto: 'crypto-browserify',
      http: 'stream-http',
      https: 'https-browserify',
      os: 'os-browserify/browser',
      stream: 'readable-stream',
      util: 'util',
      url: 'url',

      /**
       * To operate locally on external libraries you can copy paste their `/src`
       * file and use like below and run yarn start --force
       */
      // '@swapkit/core': resolve(__dirname, 'src/c'),
      // '@swapkit/toolbox-evm': resolve(__dirname, 'src/e'),
      // '@swapkit/wallet-xdefi': resolve(__dirname, 'src/x'),
      // '@swapkit/wallet-keystore': resolve(__dirname, 'src/k'),
      // '@swapkit/toolbox-cosmos': resolve(__dirname, 'src/cos'),
    },
  },
  build: {
    target: 'es2020',
    reportCompressedSize: true,
    sourcemap,
    rollupOptions: {
      plugins: [nodePolyfills({ sourceMap: sourcemap })],
      output: {
        sourcemap,
        chunkFileNames: () => '[hash].js',
      },
    },
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
      define: { global: 'globalThis' },
      reserveProps: /(BigInteger|ECPair|Point)/,
    },
  },
});
