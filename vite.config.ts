import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // .glb（3D 模型，react-bits Lanyard 使用）按静态资源处理
  assetsInclude: ['**/*.glb'],
  server: {
    host: true,
    port: 5173,
  },
})
