const { whenProd } = require('@craco/craco')
const cssnano = require('cssnano')

module.exports = {
  eslint: {
    mode: 'file',
  },
  style: {
    postcss: {
      plugins: (plugins) => whenProd(() => [...plugins, cssnano], []),
    },
  },
}
