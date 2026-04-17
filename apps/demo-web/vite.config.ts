import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@modal-toast/core':   path.resolve(__dirname, '../../packages/core/src/index.ts'),
      '@modal-toast/react':  path.resolve(__dirname, '../../packages/react/src/index.ts'),
      '@modal-toast/native': path.resolve(__dirname, '../../packages/native/src/index.ts'),
    },
  },
});
