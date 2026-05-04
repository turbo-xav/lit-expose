import { defineConfig } from 'vite'
import { federation } from '@module-federation/vite'

export default defineConfig({
  plugins: [
    federation({
      name: 'litExpose',
      filename: 'remoteEntry.js',
      exposes: {
        './my-element': './src/my-element.ts',
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
  },
})
