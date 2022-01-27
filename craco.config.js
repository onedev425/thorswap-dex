const { whenProd } = require('@craco/craco')
const cssnano = require('cssnano')
const CracoAlias = require('craco-alias')

module.exports = {
  eslint: {
    mode: 'file',
  },
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: 'tsconfig',
        baseUrl: './src',
        tsConfigPath: './tsconfig.json',
      }
    }
  ],
  style: {
    postcss: {
      plugins: (plugins) => whenProd(() => [...plugins, cssnano], []),
    },
  },
}
