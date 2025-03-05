import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: ["cyan-planes-occur.loca.lt"],
    strictPort: false
  },
  plugins: [react()],
})
