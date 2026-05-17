import { defineConfig, transformWithOxc } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [
    {
      name: 'jsx-in-js',
      enforce: 'pre',
      async transform(code, id) {
        if (!/\/src\/.*\.js$/.test(id)) return;
        return transformWithOxc(code, id.replace(/\.js$/, '.jsx'));
      }
    },
    react({ include: /\.(jsx?|tsx?)$/ })
  ],
  optimizeDeps: {
    rolldownOptions: {
      moduleTypes: {
        '.js': 'jsx'
      }
    }
  },
  build: {
    outDir: 'build',
    rolldownOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        planner: resolve(__dirname, 'planner/index.html'),
        packingList: resolve(__dirname, 'packing-list/index.html')
      }
    }
  }
});
