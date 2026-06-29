// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from "path"; // Garante que path está importado

export default defineConfig({
  plugins: [react()],
  
  server: {
    host: '0.0.0.0',
    port: 8080,
    allowedHosts: [
        'ivaldoprado.com', 
        'site1.com', 
        'site2.com'
    ],
  },
  
  resolve: {
    alias: {
      // 🚀 SINTAXE CORRIGIDA E CONFIÁVEL PARA O ALIAS '@'
      "@": path.resolve(__dirname, "./src"),
    },
  },
});