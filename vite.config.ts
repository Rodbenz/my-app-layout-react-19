import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  base: mode === 'production' ? '/my-app-layout/' : '/',
  build: {
    outDir: 'dist',
    manifest: true,
    rollupOptions: {
      input: './index.html',
    },
  },
  // esbuild: {
  //   drop: ["console", "debugger"],
  // },
}));
