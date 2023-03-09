import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: '1xawxk',
  viewportHeight: 1080,
  viewportWidth: 1920,

  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },

  e2e: {
    baseUrl: 'http://localhost:5173/',
    setupNodeEvents() {
      // implement node event listeners here
    },
  },
});
