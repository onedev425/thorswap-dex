const { whenProd } = require('@craco/craco')
const cssnano = require('cssnano')
const CracoAlias = require('craco-alias')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  eslint: {
    mode: 'file',
  },
  webpack: {
    plugins: {
      add: [
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        }),
        new webpack.ProvidePlugin({
          process: 'process/browser',
        }),
      ],
    },
    configure: (webpackConfig, { env }) => {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        fs: false,
        http: false,
        https: false,
        net: false,
        os: false,
        path: false,
        stream: require.resolve('stream-browserify'),
        tls: false,
        zlib: false,
      }

      webpackConfig.optimization = {
        minimize: env === 'production',
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              mangle: { reserved: ['BigInteger', 'ECPair', 'Point'] },
            },
          }),
        ],
      }

      return webpackConfig
    },
  },
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: 'tsconfig',
        baseUrl: './src',
        tsConfigPath: './tsconfig.json',
      },
    },
  ],
  style: {
    postcss: {
      plugins: (plugins) => whenProd(() => [...plugins, cssnano], []),
    },
  },
}
