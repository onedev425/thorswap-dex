const path = require('path')
const webpack = require('webpack')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    'storybook-tailwind-dark-mode',
  ],
  framework: '@storybook/react',
  core: {
    builder: 'webpack5',
  },
  webpackFinal: (baseConfig, options) => {
    const config = {
      ...baseConfig,
      module: {
        ...(baseConfig.module ?? {}),
        rules: [...(baseConfig.module?.rules ?? [])],
      },
      plugins: [
        ...(baseConfig.plugins ?? []),
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        }),
        new webpack.ProvidePlugin({
          process: 'process/browser',
        }),
      ],
      resolve: {
        ...(baseConfig.resolve ?? {}),
        fallback: {
          ...(baseConfig.resolve.fallback ?? {}),
          crypto: false,
          fs: false,
          http: false,
          https: false,
          net: false,
          os: false,
          path: false,
          stream: require.resolve('stream-browserify'),
          tls: false,
          zlib: false,
        },
        plugins: [
          ...(baseConfig.resolve.plugins ?? []),
          new TsconfigPathsPlugin(),
        ],
      },
    }

    if (options.configType === 'DEVELOPMENT') {
      config.module.rules.push({
        test: /,css&/,
        use: [
          {
            loader: 'postcss-loader',
            ident: 'postcss',
            options: {
              plugins: [],
              verbose: true,
            },
          },
        ],
        include: path.resolve(__dirname, '../'),
      })
    }

    return config
  },
}
