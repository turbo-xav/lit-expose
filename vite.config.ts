import { defineConfig } from 'vite'
import { federation } from '@module-federation/vite'

export default defineConfig({
  plugins: [
    federation({
      name: 'litExpose',
      filename: 'remoteEntry.js',
      exposes: {
        './todo-list': './src/todo-list.ts',
      },
      shared: {
        lit: {
          singleton: true,
          requiredVersion: '^3.3.2',
          import: false,
        },
        'lit/decorators.js': {
          singleton: true,
          requiredVersion: '^3.3.2',
          import: false,
        },
      },
    }),
  ],
  build: {
    target: 'esnext'
  },
})
