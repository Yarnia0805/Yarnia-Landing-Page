import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three'))                                        return 'vendor-three'
          if (id.includes('node_modules/@react-three'))                                return 'vendor-r3f'
          if (id.includes('node_modules/gsap'))                                         return 'vendor-gsap'
          if (id.includes('node_modules/ogl'))                                         return 'vendor-ogl'
          if (id.includes('node_modules/framer-motion'))                               return 'vendor-motion'
          if (id.includes('node_modules/embla-carousel'))                              return 'vendor-embla'
          if (id.includes('node_modules/@phosphor-icons'))                             return 'vendor-icons'
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'vendor-react'
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
})
