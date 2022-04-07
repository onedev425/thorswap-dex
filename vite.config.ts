import { defineConfig } from 'vite'
import { resolve } from 'path'
import svgr from 'vite-plugin-svgr'
import react from '@vitejs/plugin-react'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import nodePolyfills from 'rollup-plugin-polyfill-node'

export default defineConfig({
  base: './',
  define: { 'process.env': {} },
  plugins: [react(), svgr({ svgrOptions: { icon: true } })],
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
      stream: 'vite-compatible-readable-stream',
      'readable-stream': 'vite-compatible-readable-stream',
      util: 'util',
    },
  },
  build: {
    outDir: 'build',
    sourcemap: false,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      plugins: [
        // @ts-expect-error
        nodePolyfills({ sourceMap: false }),
      ],
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [NodeGlobalsPolyfillPlugin({ buffer: true })],
    },
  },
})
