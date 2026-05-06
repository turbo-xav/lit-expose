import { defineConfig } from 'vite'
import { federation } from '@module-federation/vite'

export default defineConfig({
  plugins: [
    federation({
      name: 'litExpose',
      filename: 'remoteEntry.js',
      exposes: {
        './my-element': './src/todo-list.ts',
      },
      shared: {
        lit: {
          singleton: true,
        },
      },
    }),
  ],
  build: {
    target: 'esnext',
    lib: {
      entry: 'src/index.ts',
      name: 'TodoList',
      fileName: 'index',
      formats: ['es'],
    },
    rolldownOptions: {
      external: ['lit'],
    },
  },
})
