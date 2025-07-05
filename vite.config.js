import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // 🔓 разрешает подключение извне
    port: 5173,        // 📡 порт по умолчанию
    strictPort: true,  // 🛡 не переключаться на другой порт
  },
});
