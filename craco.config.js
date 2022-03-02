const { whenProd } = require('@craco/craco')
const cssnano = require('cssnano')
const CracoAlias = require('craco-alias')
const webpack = require('webpack')

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
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          // const minimizerIndex = webpackConfig.optimization.minimizer.findIndex(
          //   (item) => item.options.terserOptions,
          // )

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

          // do not mangle problematic modules of bitcoinjs-lib
          // webpackConfig.optimization.minimizer[
          //   minimizerIndex
          // ].options.terserOptions.mangle = {
          //   ...webpackConfig.optimization.minimizer[minimizerIndex].options
          //     .terserOptions.mangle,
          //   reserved: ['BigInteger', 'ECPair', 'Point'],
          // }

          // // allow parallel running for minimizer
          // // https://support.circleci.com/hc/en-us/articles/360053201771-Resolving-Failed-to-minify-the-bundle-Errors
          // webpackConfig.optimization.minimizer[
          //   minimizerIndex
          // ].options.parallel = true

          return webpackConfig
        },
      },
    },
  ],
  style: {
    postcss: {
      plugins: (plugins) => whenProd(() => [...plugins, cssnano], []),
    },
  },
}
