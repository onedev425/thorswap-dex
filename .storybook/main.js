const path = require('path')

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
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
