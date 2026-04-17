import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@omnitoast/core':   path.resolve(__dirname, '../../packages/core/src/index.ts'),
      '@omnitoast/react':  path.resolve(__dirname, '../../packages/react/src/index.ts'),
      '@omnitoast/native': path.resolve(__dirname, '../../packages/native/src/index.ts'),
    },
  },
});
