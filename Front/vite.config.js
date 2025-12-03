/* global process */
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.VITE_BACKEND_URL || 'http://localhost:5001/';

  return defineConfig({
    server: {
      port: 3005,
      proxy: {
        '/api': {
          target,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [
      react(),
      tailwindcss(),
    ],
  });
};
