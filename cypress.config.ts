import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: '1xawxk',

  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },

  e2e: {
    baseUrl: 'http://localhost:4173/',
    setupNodeEvents() {
      // implement node event listeners here
    },
  },
});
